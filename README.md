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

## El plan del mes y las cuatro compras

`SEMANAS` (en `data/recetas.js`) son cuatro semanas de 28 comidas: 112 en total,
con las 49 recetas del sitio. Ninguna receta se repite dentro de la misma semana;
entre semanas sí, porque 49 recetas no llenan un mes de otra forma.

El reparto lo hizo `scripts/armar_mes.mjs`, y no es alfabético ni al azar:

- Las **seis colaciones entran como merienda** —es lo que son—, y suben la
  merienda de nueve opciones a quince. Sin eso era lo más repetido del mes.
- Se optimizó que las recetas de una misma semana **compartan verdura y carne**,
  para que la compra sea más corta y sobre menos en la heladera: los artículos
  frescos distintos del mes bajaron de 120 a 111.
- Dentro de la semana, **lo que lleva más tiempo cae sábado y domingo**.
- **La semana 1 no se tocó.** Es la que ya existía y la que narra el audio de la
  caminata 3: cambiarla habría dejado el audio mintiendo.

El script es reproducible (semilla fija) y vuelve a correr con `node
scripts/armar_mes.mjs`, que además informa calorías y carbos promedio de cada
semana.

### La lista del súper se deriva, ya no se escribe

Hasta el 2026-08-19 `LISTA_COMPRAS` era una tabla escrita a mano con las
cantidades de la única semana que había, y tenía escrito arriba su propia
sentencia de muerte: «si se cambia el plan semanal, hay que rehacerlo». Con
cuatro semanas eso era garantizar que la lista y el plan se contradijeran.

Ahora sale de las recetas, con dos piezas:

- **`data/despensa.js`** — qué se compra cuando una receta pide «1 cucharada de
  manteca». Tiene los `ARTICULOS` (sector del súper, unidad de compra, las
  conversiones propias de cada uno: una taza de harina de almendras son 100 g y
  una de aceite son 240 cc) y las `REGLAS` de texto a artículo, que se prueban
  **en orden**.
- **`lib/compras.js`** — parte el ingrediente («Relleno: 200 g de jamón cocido,
  3 huevos»), lo mide (incluidas las fracciones tipográficas y los números en el
  medio, como «jugo de ½ limón») y lo traduce.

Lo que no matchea ninguna regla **no se descarta en silencio**: sale en
`sinReconocer` y `scripts/verificar.mjs` lo marca como error, sobre las 49
recetas y no sólo sobre las del plan. Una lista a la que le falta un ingrediente
no se nota hasta que se está cocinando.

### Las cantidades

Las cantidades no son texto (`"1 kg de vacío"`) sino `{ cant, unidad, nombre }`,
para poder multiplicarlas por la cantidad de personas de la casa. El armado del
texto está en `src/lib/porciones.js`.

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

## Las fotos de las recetas

Muestran **el ingrediente principal, no el plato terminado**: la palta, el
zucchini, el corte de carne crudo. Decisión de Ariel del 2026-08-17, y la página
de cada receta lo dice al pie de la foto — la foto ilustra de qué está hecho el
plato, no cómo va a quedar. Es una solución puente hasta tener fotos propias de
los platos ya cocinados.

El motivo es práctico: los archivos libres tienen miles de fotos buenas de una
palta partida al medio y ninguna de un revuelto de zapallitos argentino.

`scripts/bajar_imagenes.py` las baja de **Wikimedia Commons** en tres pasos, y el
del medio es el que importa:

```bash
python3 scripts/bajar_imagenes.py --buscar     # candidatas a .revision-imagenes/
#  … acá una persona las mira y escribe .revision-imagenes/elecciones.json …
python3 scripts/bajar_imagenes.py --aplicar    # publica y reescribe creditos.json
```

**El paso de revisión no es opcional.** La versión anterior del script buscaba en
Openverse y se quedaba con la primera candidata que descargara bien. Como esas
búsquedas son sobre títulos y etiquetas y no sobre el contenido de la imagen, más
de veinte de las cuarenta y nueve fotos no tenían nada que ver: «zapallitos
rellenos» era **un tractor con estiércol**, «ensalada de repollo» una hamburguesa
con papas fritas, y «flan de coco» una captura de pantalla de la receta de otro
sitio con su URL y su logo impresos encima. Ninguna búsqueda automática puede
garantizar que la foto muestre lo que dice.

Para revisar, conviene armar hojas de contacto con PIL (una fila por receta, sus
cuatro candidatas numeradas) y mirarlas: en tres rondas de ajuste de términos se
llega a las 49. Los términos que fallan suelen fallar por homonimia — «chard» es
un pueblo de Inglaterra, «portobello» una playa de Escocia, «paprika» un cultivar
de rosa, y `cream jug` devuelve jarras de plata del Metropolitan.

Requisitos que el script hace cumplir solo:

- **Licencia comercial y con derivados.** El sitio lleva publicidad, y acá se
  recorta y se redimensiona, que es una obra derivada: quedan afuera las NC y las
  ND. Se prefiere CC0 y dominio público sobre CC BY, y CC BY sobre CC BY-SA.
- **Atribución obligatoria**, guardada en `src/data/creditos.json` y mostrada al
  pie de cada foto con enlace a la licencia.
- **El término tiene que estar en el título** de Commons. Es el filtro que faltaba.

## Panel de medios (`panel/` → `baudry.com.ar/keto-panel/`)

Donde Ariel revisa las fotos y sube las suyas, desde el celular. Es PHP en
Ferozo, igual que el contador y por el mismo motivo: acá ya corre PHP y así no
entra ningún tercero.

- **URL:** <https://www.baudry.com.ar/keto-panel/> — usuario `ariel`.
- **No va en `/ariel/`**: esa carpeta es la landing pública de baudry.com.ar, y
  el panel de Ferozo redirige el dominio raíz ahí.
- **Deploy:** `scripts/subir_panel.sh` (código) o `--imagenes` (además las 49×4
  candidatas, 27 MB, que van a `candidatas/`).

Qué muestra: las 4 candidatas de Commons de cada receta con su licencia, marcando
con un punto naranja **la que sirve el sitio ahora** y con borde verde **la
elegida**. Si son distintas, la ficha dice «falta publicar». Abajo, las fotos y
videos propios y los enlaces de YouTube.

### El reparto entre lo estático y lo vivo

No es arbitrario y conviene no invertirlo:

| Qué | Dónde | Por qué |
|---|---|---|
| Foto grande de la receta | repo, `public/img/recetas/` | Es el LCP de la página. Cargarla por JavaScript la volvería lo último en aparecer. |
| Fotos secundarias, videos, YouTube | Ferozo, vía `medios.php` | Aparecen **sin esperar un build**. Es lo que hace que el panel se use en vez de abandonarse. |

`scripts/traer_medios.py` es el puente del primer caso: baja `datos/medios.json`
por FTP (por FTP y no por HTTP porque `datos/` está detrás de un
`Require all denied`), copia la candidata elegida o baja la foto propia, la
encuadra a 1200×800 y reescribe `creditos.json`. Sin `--aplicar` sólo dice qué
cambiaría.

Cuando la portada pasa a ser una foto propia, `materia` se vacía y queda
`propia`. Eso hace que el pie deje de decir «el ingrediente principal, no el
plato terminado»: sobre una foto de una palta esa aclaración es honesta, sobre
una del plato ya cocinado es falsa.

### Lo que el panel hace cumplir solo

- La contraseña va como `password_hash`, no en claro: el archivo viaja por FTP a
  un hosting compartido.
- Freno por IP: a los 5 fallos cada intento espera, a los 10 quedan 15 minutos
  afuera.
- El tipo de cada archivo sale de sus bytes con `finfo`, **nunca** del nombre ni
  del `Content-Type`, y la extensión la pone el servidor.
- `subidas/` tiene un `.htaccess` que apaga la ejecución de PHP. Sin eso un
  formulario de subida es una shell remota, que es el error clásico.
- `datos/` tiene `Require all denied`, porque `/public_html/` es raíz web.
- Las miniaturas de 800 px no son cosméticas: una foto de iPhone son 4 MB, y el
  panel se abre desde el celular.

Credenciales FTP en `~/.config/keto/ferozo.env`, fuera del repo.

## Audios de guía (`scripts/audios/`)

Siete MP3 con la voz de **Daniela** (`es_AR-daniela-high`, la misma de videosyt).
Se sirven desde Ferozo, no desde el repo: son ~134 MB y git guarda cada versión
para siempre.

| Audio | Dura | Qué es |
|---|---|---|
| `elongacion-manana` | 16,9 min | La rutina de la mañana, en tiempo real y contando |
| `fuerza-en-casa` | 42,6 min | La rutina de fuerza, en tiempo real y contando |
| `caminata-1-por-que-funciona` | 40,1 min | La evidencia + 6 desayunos |
| `caminata-2-lo-que-te-van-a-decir` | 42,3 min | Las comparativas + 6 almuerzos |
| `caminata-3-el-super-y-la-semana` | 56,5 min | Productos, plan semanal + 6 cenas |
| `caminata-4-la-cocina` | 47,8 min | Freezer, trucos, ayuno + 6 meriendas |
| `caminata-5-la-despensa` | 45,1 min | Las fichas de los 37 ingredientes |

Son 291 minutos y 134 MB en total. Generarlos completos: ~50 min de modelo
(gemini) y ~45 min de piper.

**La duración pedida es orientativa, no un contrato.** `--minutos 45` dio 40, 42 y
36; rehacer la tercera con `--minutos 52` dio 56,5. La dispersión no la produce el
objetivo sino cuánto se pasa el modelo del largo pedido en cada bloque y cuántos
bloques caen al respaldo, y eso cambia en cada corrida. Si un audio tiene que caer
en una ventana estrecha, hay que generar y medir, no calcular.

**Y cuando el material sobra, el presupuesto no alcanza a frenarlo.** La cuarta
caminata tiene 9.300 palabras de fuente contra 8.200 de objetivo, o sea que hay
que *comprimir*. El reparto autocorregible baja el objetivo de cada bloque, pero
tiene un piso de 120 palabras, y **14 de los 20 bloques terminaron en ese piso**:
a partir de ahí el reparto ya no regula nada. Pedidas 5.673 palabras, salieron
12.290 — los modelos entregan más del doble cuando el pedido es corto, porque un
resumen de 120 palabras de una fuente de 250 es algo que hacen mal.

Conclusión práctica: para un programa con más material que duración, o se acepta
el largo natural o se parte en dos audios. Estirar funciona; comprimir no.

**Y eso fue lo que se hizo al día siguiente.** La cuarta caminata se partió en
dos: la 4 se quedó con la cocina (freezer, trucos, ayuno y las seis meriendas) y
la 5 se llevó las fichas de los treinta y siete ingredientes, góndola por
góndola. Con el material repartido, las dos caen dentro del techo de expansión
—×2,6 y ×1,1— y ninguna necesita comprimir. La 4 pasó de **66,4 a 47,8 minutos**
y la 5 salió en 45,1: el mismo contenido, en dos audios que se escuchan.

### Un motor caído no puede condenar la corrida entera

`llm.Motor` de videosyt descarta un motor **para toda la corrida** en cuanto falla
una vez. Para un video de diez secciones está bien: una cuota agotada no se
recupera a mitad de camino y reintentarla cuesta un timeout por llamada.

Acá no. El 2026-08-18 gemini falló **una sola vez**, por un timeout de 90 segundos
—diez minutos después contestaba perfecto—, y esa única caída mandó los catorce
bloques siguientes a ollama. El audio pasaba de prosa hablada a esto, leído en voz
alta: «Menos edulcorante del que se espera. 4. Preparación rápida: Pan keto: 2
minutos en microondas».

Dos arreglos, y hacían falta los dos:

- **`MotorConReintento`** (en `caminatas.py`) rearma el motor cada tres bloques y
  le da otra oportunidad al preferido. Si la cuota está agotada de verdad, cuesta
  un timeout cada tres bloques y sigue cayendo al respaldo; si fue un hipo, se
  recupera. En la corrida siguiente reintentó seis veces.
- **`_parece_lista()`** rechaza el bloque si contestó con enumeraciones o
  renglones cortos terminados en dos puntos, y lo vuelve a pedir. Sin esto el
  pipeline podía volver a producir un audio malo en silencio, que es exactamente
  lo que había pasado. El verificador de números no lo veía: una lista no tiene
  números inventados, tiene forma equivocada.

```bash
node scripts/audios/exportar.mjs                        # volcar el contenido del sitio
/usr/bin/python3 scripts/audios/generar.py --plan       # ver qué saldría, sin generar
MAX=8G /home/hpp/agente/scripts/pesado.sh \
    /usr/bin/python3 scripts/audios/generar.py --todo   # generar
scripts/subir_audios.sh                                 # subir a Ferozo
```

### Los silencios son el punto

Lo que separa estos audios de un podcast sobre ejercicios es que **respetan el
reloj**: cuando la voz dice «sostené treinta segundos», el audio se calla treinta
segundos de verdad. `dosis.py` traduce las 26 formas de `dosis` que usa
`ejercicios.js` («3 series de 12», «25 segundos por pierna», «10 atrás, 10
adelante») a tramos de silencio, y tiene autoprueba:

```bash
/usr/bin/python3 scripts/audios/dosis.py
```

Los avisos que caen **dentro** de un tramo («Diez segundos») se encajan sin
estirarlo. Si se sumaran, dieciséis ejercicios con dos avisos cada uno correrían
el audio varios minutos y a mitad de sesión la voz iría atrasada respecto del
cuerpo. Verificable:

```bash
/usr/bin/ffmpeg -hide_banner -nostats -i storage/audios/elongacion-manana.mp3 \
  -af silencedetect=noise=-50dB:d=6 -f null - 2>&1 | grep silence_
```

### Contar en voz alta, y decir dónde ponerse

Ariel hizo la elongación el 2026-08-19 y el diagnóstico fue que el audio se
callaba demasiado: «cuando dice nos preparamos para el ejercicio, aclaremos si
nos paramos, nos acostamos o nos arrodillamos; si hay que mantener 15 segundos,
contar hasta 15». Dos arreglos, los dos sobre la misma maquinaria de cortes:

- **La posición.** Cada ejercicio de `ejercicios.js` tiene ahora `posicion`, una
  frase que dice dónde ponerse («Acostate boca arriba, con los brazos en cruz»).
  El orden cambió: antes la voz decía «acomodate para el que sigue», se callaba,
  y **recién después** nombraba el ejercicio — con los ojos cerrados eso es
  quedarse parado esperando. Ahora primero se dice dónde y el silencio de
  acomodarse llega cuando ya se sabe hacia dónde moverse. Si la postura no
  cambia, la voz lo dice y el silencio se acorta a la mitad.
- **La cuenta.** Los tramos traen sus propios cortes desde `dosis.py`. Hasta 20
  segundos se cuenta de uno en uno; de ahí para arriba van la mitad, el aviso de
  los diez y la regresiva de los últimos cinco, que es como cuenta un entrenador
  de verdad. Las repeticiones se cuentan al terminarlas, y las respiraciones
  guían el «inhalá contando cuatro, exhalá contando seis» que el texto de la
  página ya pedía y el audio no acompañaba.

El límite de 20 no es estético sino de física del habla: «veinte» dura 0,85 s y
entra cómodo en su segundo, «veintisiete» se pasa y se pisaría con el siguiente.
Por la misma razón cada número se dice 0,2 s antes de su segundo: sin ese
adelanto, «diecinueve» no termina antes del final de un tramo de veinte y
`voz.armar()` —que nunca estira un tramo— lo descarta, dejando la cuenta cortada
justo en el último número. La elongación quedó con **196 cortes de cuenta, todos
encajados y ninguno salteado**.

### La rutina de fuerza no entra en 40 minutos

Con las 3 series que pide la página son 58 minutos. El audio hace **2 series** y
queda en 41, **y lo dice en voz alta** en la introducción. Un audio que se callara
eso mentiría sobre cuánto entrenó quien lo siguió. Con `--series 3` sale completo.

### Las caminatas y el límite del material

Tres audios de 45 minutos son ~23.000 palabras habladas; todo el contenido
aprovechable del sitio son ~11.000. La salida no es inventar sino **reescribir en
forma hablada**, que ocupa casi el doble: un texto escrito se puede releer, uno
hablado no, así que repite, anticipa y recapitula. Como el objetivo es fijar
conceptos, esa repetición es el punto y no relleno.

El permiso termina ahí, y no se pide por favor: **se verifica**. Cada bloque pasa
por `numeros.inventados()`, que compara los números del guion contra los de la
fuente —en dígitos y en palabras, porque un modelo al que se le pide lenguaje
hablado escribe «doscientas sesenta», no «260»—. Si aparece uno que no estaba, el
bloque se rechaza y se vuelve a pedir diciendo cuál sobró; a los tres intentos se
usa el texto del sitio sin reescribir.

**Medido en la primera corrida completa (2026-08-18): 18 reintentos y 2 respaldos
sobre 39 bloques**, o sea 5 % de bloques que quedaron sin reescribir. En los dos
casos el modelo insistía con un número que la fuente no tenía —probablemente
cuántas veces más dulce es la sucralosa, y una cuenta de ítems de la góndola de
lácteos—. Vale aflojar el criterio sólo si ese 5 % sube mucho: permitir «cinco»
como número libre dejaría pasar también un «cinco gramos de carbohidratos»
inventado, que en un audio sobre alimentación es peor que un bloque sin
reescribir.

También tiene autoprueba:

```bash
/usr/bin/python3 scripts/audios/numeros.py
```

Dos detalles que costaron y que la autoprueba fija: «por ciento» lleva adentro la
palabra «ciento», que vale 100 y ensuciaba todo texto con un porcentaje; y «cuatro
coma tres» tiene que unirse en 4,3, porque en la fuente está en dígitos y si no el
verificador denuncia como inventado un dato que se copió bien.

El presupuesto de palabras por bloque **se autocorrige**: los modelos no aciertan
el largo pedido (gemini se pasa un 30 %) y con nueve bloques ese sesgo convierte
una caminata de 45 minutos en una de 58. Después de cada bloque se reparte lo que
queda entre los que faltan, así no hace falta calibrar un factor por motor que
envejecería con cada versión del modelo.

El motor por defecto es **gemini**, con la cadena de respaldo de videosyt
(`gemini → mistral → ollama`). Se reusa `videosyt/pipeline/llm.py` entero.

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
