# Keto Argentina

Sitio de dieta cetogénica con productos e ingredientes que se consiguen en
Argentina. Astro estático + Tailwind, desplegado en Vercel
(<https://ketofacil.vercel.app>).

Para SEO, GEO y datos estructurados, ver **`SEO.md`**.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Compila a `./dist/` |
| `npm run preview` | Sirve `./dist/` como en producción |

⚠️ Los builds y los renders conviene correrlos enjaulados:
`MAX=4G /home/hpp/agente/scripts/pesado.sh npm run build`. Ver el CLAUDE.md de
`/home/hpp/agente` — un proceso sin techo de RAM congeló el server 2h41m.

## Estructura del contenido

Todo el contenido vive en `src/data/` como módulos JavaScript, no en Markdown:
las páginas los importan y calculan totales en el build.

| Archivo | Qué tiene |
|---|---|
| `recetas.js` | 49 recetas, `PLAN_SEMANAL` (7 días × 4 comidas, 28 recetas sin repetir) y `LISTA_COMPRAS` |
| `ejercicios.js` | Las 3 rutinas (elongación, caminata, fuerza) y las funciones de calorías |
| `negociemos.js` | Comparativas tipo «¿la Coca Zero saca de cetosis?» |
| `evidencia.js` | Artículos con fuentes citadas y enlace real |
| `productos.js` | Qué comprar y qué no, por góndola |
| `legales.js` | Índice de las 3 páginas legales, fecha de revisión y correo de contacto |
| `creditos.json` | Atribución de cada foto (licencias de Openverse: **no es opcional**) |

Cada receta lleva `macros` (con `calorias`), `porciones` y un `tip` con el error
típico. Cada ejercicio lleva su `tip` por la misma razón.

## Las cantidades de la lista del súper

`LISTA_COMPRAS` **no** guarda las cantidades como texto (`"1 kg de vacío"`) sino
partidas en `{ cant, unidad, nombre }`, para poder multiplicarlas por la cantidad
de personas de la casa. El armado del texto está en `src/lib/porciones.js`.

Dos cosas que ese módulo resuelve y que no son obvias:

- **Redondeo de góndola.** 600 g × 4 no se muestra como «2400 g» sino como
  «2,4 kg», y los contables van siempre para arriba: si sobra un huevo no pasa
  nada, si falta sí.
- **Plural en español.** No alcanza con agregar la «s». Sin las reglas de
  `pluralizarPalabra()` la lista dice «4 coliflors», «2 limóns» y «6 nuezs».
  Las unidades de más de una palabra concuerdan («zapallitos redondos»).

`escala: false` marca lo que **no se multiplica**: una botella de aceite o el
frasco de pimentón rinden varias semanas. Multiplicarlos pediría cuatro botellas
de vinagre para una familia, que es el error que hace que la lista se abandone.

El escalado ocurre **en el navegador**, no en el build: el HTML sale para una
persona y el JS lo reescribe con el número guardado en `localStorage`. Así el
sitio sigue siendo estático y quien tenga el JS bloqueado ve la lista para uno.

## Calendario y recordatorios (`/calendario`)

`src/lib/ics.js` genera archivos iCalendar (RFC 5545) que se importan en Google
Calendar, en el Calendario del iPhone y en Outlook. Se usa en dos lugares con el
mismo código: `src/pages/rutina-keto.ics.js` lo emite en el build con los
horarios por defecto, y `/calendario` lo arma en el navegador a medida.

Detalles del formato que rompen el archivo si se ignoran:

- **Los saltos de línea son CRLF.** Con `\n` solo, el Calendario de iPhone
  rechaza el archivo sin decir por qué.
- **Las líneas no pasan de 75 _octetos_**, no caracteres. Con acentos (2 bytes) y
  emojis (4), contar caracteres deja líneas de 300 octetos.
- **Las comas y los punto y coma se escapan.** Sin escapar, un `SUMMARY` con una
  coma parte el evento en dos.
- **Las horas son «flotantes»** (sin `Z`): así la caminata cae a las 18:30 de la
  zona del teléfono. Con hora UTC, quien viaja se la encuentra a las 15:30.
- **Los `UID` son estables.** Reimportar el archivo actualiza los eventos en
  lugar de duplicarlos, que es lo que permite cambiar un horario y volver a bajar.

Para validar el `.ics` después de tocarlo (`icalendar` está en el Python del
sistema, **no** en el de linuxbrew):

```bash
npm run build
/usr/bin/python3 -c "
from icalendar import Calendar
raw = open('dist/rutina-keto.ics','rb').read()
print('exceden 75 octetos:', sum(1 for l in raw.split(b'\r\n') if len(l) > 75))
print('eventos:', len(list(Calendar.from_ical(raw).walk('VEVENT'))))"
```

## Contador de visitas

El pie muestra un contador con estética de los 90 que **arranca en 19751108**
(pedido de Ariel: 8 de noviembre de 1975). El offset es explícito, no un número
inflado: el endpoint devuelve `base` y `visitas` por separado y el `title` del
elemento muestra las dos cosas.

El conteo es real. Como el sitio es estático y no tiene backend, el contador vive
en **Ferozo**, que ya corre PHP — así no se suma ningún tercero ni cookies de
nadie más:

- Código: `contador/contador.php` en este repo.
- Publicado en `https://www.baudry.com.ar/keto-contador/contador.php`.
- Deploy (es la excepción a «nada de código por FTP»: esa regla es del working
  tree git de `/public_html/vidal/inmobiliaria`, y esta carpeta está afuera):

  ```bash
  curl --ssl-reqd --ftp-create-dirs -T contador/contador.php \
    "ftp://ftp%40va000847.ferozo.com:PASS@va000847.ferozo.com/public_html/keto-contador/contador.php"
  ```

- La URL se puede cambiar sin tocar código con la variable de entorno
  `PUBLIC_CONTADOR_URL` en Vercel.
- Si el endpoint no responde, el pie muestra el número base y no se avisa nada:
  un contador roto no puede romper el pie de página.

**Privacidad:** no se guarda la IP. Para no contar dos veces se guarda un
HMAC-SHA256 de IP + navegador + fecha con una clave local, sólo por el día en
curso. `datos/` se autoprotege con un `.htaccess` (`Require all denied`) porque
`/public_html/` es raíz web: sin eso, `clave.txt` sería descargable y el hash
dejaría de ser irreversible en la práctica.

## Páginas legales

Las tres (`/condiciones-de-servicio`, `/politica-de-privacidad`,
`/politica-de-cookies`) usan el mismo layout `src/layouts/Legal.astro` y salen de
los textos de DAS LATAM (`daslatam.org`), adaptados.

**La adaptación no es cosmética.** DAS LATAM declara recopilar nombre, apellido y
correo por formularios de contacto y suscripciones, y este sitio **no tiene
ningún formulario**; en cambio tiene tres cosas que allá no existen y que sí hay
que declarar: el almacenamiento local de las listas, la publicidad y el contador.
Una política que declara tratamientos que no ocurren y omite los que sí ocurren
es falsa en las dos direcciones.

La tabla de `/politica-de-cookies` lista **las cuatro claves exactas** que el
sitio guarda (`keto-lista-compras`, `keto-personas`, `keto-calendario`,
`keto-visita`). Es verificable abriendo las herramientas de desarrollo: si se
agrega una clave nueva al sitio, hay que agregarla ahí.

El correo de contacto y la fecha de última revisión están en `src/data/legales.js`,
en un solo lugar.

## Cuidado con el espacio antes de `<strong>`

En Astro, el whitespace que contiene un salto de línea entre texto y un elemento
**se elimina**. Esto deja «mañanas,caminata» en la página:

```astro
<p>
  ...todas las mañanas</strong>,
  <strong>caminata de 40 minutos...
</p>
```

Hay que cerrar la línea con `{" "}`, que es lo que usa el resto del sitio. Pasa
igual al revés: `</a>` al final de línea seguido de texto. Para encontrarlos
todos de una vez:

```bash
/usr/bin/python3 - <<'PY'
import re, glob
I = r'(?:strong|em|a|code|b|i|span|time)'
for f in sorted(glob.glob("src/**/*.astro", recursive=True)):
    L = open(f, encoding="utf-8").read().split("\n")
    for i in range(len(L)-1):
        a, b = L[i].rstrip(), L[i+1].strip()
        if re.match(rf'<{I}[\s>]', b) and not a.endswith(('{" "}', ">", "{", "(")) \
           and re.search(r'[\wáéíóúñü,.:;»)"\']$', a):
            print(f"{f}:{i+1} falta espacio antes del tag")
        if re.search(rf'</{I}>$', a) and re.match(r'[\wáéíóúñü¿¡«(]', b):
            print(f"{f}:{i+1} falta espacio después del cierre")
PY
```
