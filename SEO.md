# SEO, GEO y verificación

Qué está hecho, qué falta y cómo se valida. Para el estado del proyecto en
general, ver `README.md`.

## Verificar el sitio en Google Search Console

Hay dos formas y conviene la primera.

### Opción A — registro DNS (recomendada)

Verifica el dominio entero, sirve para todos los subdominios y no depende de que
un archivo siga existiendo después de un redeploy.

1. En <https://search.google.com/search-console> → *Agregar propiedad* →
   **Dominio**.
2. Google da un registro `TXT` del tipo `google-site-verification=...`.
3. Ese TXT va en el DNS del dominio. **Con `ketofacil.vercel.app` no se puede**:
   el dominio es de Vercel y no controlamos su zona DNS. Sirve recién cuando se
   conecte un dominio propio.

### Opción B — archivo HTML (la que aplica hoy)

1. En Search Console → *Agregar propiedad* → **Prefijo de URL** →
   `https://ketofacil.vercel.app`.
2. Elegir el método **archivo HTML**. Google da un archivo tipo
   `google1234abcd.html`.
3. Ese archivo va en **`public/`**, no en la raíz del repo: en Astro sólo lo que
   está en `public/` termina en `dist/` y se sirve. Es la misma razón por la que
   el `ads.txt` de la raíz no se sirve y el de `public/` sí.
4. Commit, push, esperar el deploy de Vercel y recién ahí apretar *Verificar*.

También sirve la **etiqueta meta**: se agrega en `src/layouts/Layout.astro`
dentro del `<head>` y vale para todas las páginas.

### Después de verificar

- Enviar el sitemap: `https://ketofacil.vercel.app/sitemap-index.xml`
- Pedir indexación de la home a mano para acelerar el primer rastreo.
- Revisar *Cobertura* a los pocos días: ahí aparecen las páginas que Google no
  pudo indexar y por qué.

## Qué está implementado

| | |
|---|---|
| HTML5 semántico | `header`, `nav`, `main`, `article`, `section`, `footer` |
| Canonical | Absoluta en cada página, desde `site` de `astro.config.mjs` |
| Open Graph | Título, descripción, imagen, `og:locale` `es_AR` |
| Sitemap | `@astrojs/sitemap`, se regenera en cada build, con `changefreq` y `priority` |
| `sitemap.xml` | Índice propio que apunta al de la integración, porque es el nombre que todos prueban |
| `llms.txt` | Mapa del sitio en Markdown para modelos de lenguaje, generado desde los datos |
| robots.txt | Permite explícitamente 18 rastreadores de IA, uno por uno |
| `ads.txt` | En `public/`, con el pub-ID de AdSense |
| Idioma | `lang="es-AR"` — importante para búsquedas locales |

### Datos estructurados (JSON-LD)

| Tipo | Dónde |
|---|---|
| `WebSite` + `FAQPage` | Home |
| `Recipe` con `nutrition`, `HowToStep` e `image` | Cada receta |
| `Article` + `FAQPage` | Cada comparativa de Negociemos |
| `MedicalWebPage` + `citation` + `FAQPage` | Cada artículo de Evidencia, y Controles médicos |
| `ItemList` | Lista de compras, índice de Ejercicios |
| `ExercisePlan` + `HowTo` + `FAQPage` | Cada rutina de ejercicio |
| `FAQPage` | Plan semanal, Calculadora, Calendario |
| `WebPage` con `dateModified` | Las tres páginas legales |

En las rutinas van los dos tipos a propósito: `ExercisePlan` es el que acepta
frecuencia, duración e intensidad como campos propios, y `HowTo` es el que Google
entiende para mostrar los pasos. Describen lo mismo, uno para el buscador y otro
para los modelos que buscan la ficha estructurada.

Las cantidades del `ItemList` de la lista de compras se emiten **para una
persona**, que es la base de los datos: el escalado por grupo familiar ocurre en
el navegador y no tiene sentido en los datos estructurados.

`image` en `Recipe` no es opcional en la práctica: sin esa propiedad Google no
muestra la ficha enriquecida de receta, que es el formato con más clics del
sector.

### Los tres archivos de la raíz

| Archivo | Quién lo lee | Cómo se genera |
|---|---|---|
| `/robots.txt` | Rastreadores | A mano, en `public/` |
| `/sitemap.xml` | Google Search Console | `src/pages/sitemap.xml.js` |
| `/llms.txt` | Modelos de lenguaje | `src/pages/llms.txt.js`, desde los datos del sitio |

**Por qué `sitemap.xml` existiendo `sitemap-index.xml`.** `@astrojs/sitemap` emite
`sitemap-index.xml` + `sitemap-0.xml` y no deja renombrarlos. Google acepta
cualquier nombre, pero el que se tipea en Search Console y el que prueban las
herramientas de auditoría es `sitemap.xml`. Así que `/sitemap.xml` es un índice de
seis líneas que apunta al de la integración: una sola fuente de verdad para las
URLs, y el nombre que todo el mundo espera.

**Por qué no se emite `lastmod`.** El único valor disponible en el build sería la
fecha del build, y eso pondría «modificada hoy» en las 122 páginas cada vez que se
toca una coma en el pie. Un `lastmod` que miente es peor que no tenerlo: Google
deja de creerle al campo para todo el dominio. Las páginas que sí saben cuándo
cambiaron lo declaran en su JSON-LD (`dateModified`).

**Por qué `llms.txt` se genera y no se escribe.** Es la convención de
[llmstxt.org](https://llmstxt.org): un Markdown en la raíz que le dice a un modelo
qué hay en el sitio y **qué contesta cada página**, sin que tenga que deducirlo de
un HTML lleno de menús. Escrito a mano envejecería en tres semanas —se agregan
recetas y nadie se acuerda de tocarlo—, así que sale de los mismos `data/*.js` que
las páginas. Ojo con el nombre: es `llms.txt`, en plural.

## GEO: que los modelos de IA puedan citar el sitio

No es lo mismo que SEO clásico y se optimiza distinto.

- **Respuesta directa arriba de todo.** Cada comparativa abre con un `veredicto`
  de una o dos oraciones y cada artículo de evidencia con un `resumen_directo`.
  Es el fragmento que un modelo extrae y cita.
- **Tablas comparativas con el número al lado de cada opción**, no enterrado en
  un párrafo.
- **FAQ al final de cada página**, con la pregunta redactada como la escribiría
  una persona ("¿la Coca Zero saca de cetosis?") y no como un título de sección.
- **Fuentes con enlace real** en Evidencia. Un modelo que puede seguir la cita
  confía más en el resto del contenido.
- **Nada inventado.** Una cita falsa detectada arruina la credibilidad de todo el
  dominio, y en salud Google lo penaliza fuerte por criterios E-E-A-T.
- **Los números se dan con la fórmula al lado.** Las calorías de las rutinas salen
  de `MET × kilos × horas` (Compendio de Actividades Físicas) y la página dice el
  MET que usó, así que la cuenta es reproducible. Un modelo puede citar el método
  y no sólo el resultado — y el resultado no queda atado a un peso inventado.

## Pendiente

- [ ] Verificar en Search Console y enviar el sitemap.
- [ ] Dominio propio (habilita la verificación por DNS y suma autoridad frente a
      un subdominio de `vercel.app`).
- [ ] Página "Quiénes somos" con autoría real y firmada — hoy existe, pero pesa en
      E-E-A-T que diga quién escribe y con qué formación.
- [ ] Revisión de una nutricionista matriculada para poder firmar el contenido
      médico. Es lo que más movería la aguja en un sitio de esta temática.
