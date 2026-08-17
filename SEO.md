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
| Sitemap | `@astrojs/sitemap`, se regenera en cada build |
| robots.txt | Permite explícitamente GPTBot, PerplexityBot, ClaudeBot y Google-Extended |
| `ads.txt` | En `public/`, con el pub-ID de AdSense |
| Idioma | `lang="es-AR"` — importante para búsquedas locales |

### Datos estructurados (JSON-LD)

| Tipo | Dónde |
|---|---|
| `WebSite` + `FAQPage` | Home |
| `Recipe` con `nutrition`, `HowToStep` e `image` | Cada receta |
| `Article` + `FAQPage` | Cada comparativa de Negociemos |
| `MedicalWebPage` + `citation` + `FAQPage` | Cada artículo de Evidencia |
| `ItemList` | Lista de compras |

`image` en `Recipe` no es opcional en la práctica: sin esa propiedad Google no
muestra la ficha enriquecida de receta, que es el formato con más clics del
sector.

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

## Pendiente

- [ ] Verificar en Search Console y enviar el sitemap.
- [ ] Dominio propio (habilita la verificación por DNS y suma autoridad frente a
      un subdominio de `vercel.app`).
- [ ] Imagen Open Graph propia: hoy `og-default.png` no existe, así que al
      compartir en redes no aparece miniatura.
- [ ] Página "Quiénes somos" con autoría — pesa en E-E-A-T para temas de salud.
- [ ] Revisión de una nutricionista matriculada para poder firmar el contenido
      médico. Es lo que más movería la aguja en un sitio de esta temática.
