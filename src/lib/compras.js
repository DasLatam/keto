// De un conjunto de recetas a la lista del súper.
//
// Es la pieza que reemplaza a la tabla escrita a mano: se le pasan las 28
// recetas de una semana y devuelve los sectores con sus ítems sumados,
// convertidos a unidades de compra y con el `usos` que la página necesita para
// descontar el desayuno cuando alguien hace ayuno intermitente.
//
// El texto de los ingredientes de una receta es prosa de cocina, no un formato:
// «1 cucharada de manteca», «Sal y pimienta», «Relleno: 200 g de jamón cocido,
// 200 g de queso cremoso, 3 huevos». Acá se lo desarma en tres pasos, y cada uno
// existe por un caso concreto de `recetas.js`:
//
//   1. **Partir.** Se saca el prefijo («Relleno:», «Para el chimichurri:») y se
//      corta por comas. Un fragmento sin números se corta además por « y »:
//      «Sal y pimienta» son dos cosas, pero «Ralladura y jugo de 2 limones» es
//      una sola y partirla perdería el 2.
//   2. **Medir.** Se busca la cantidad y su unidad. Los números pueden ser
//      fracciones tipográficas (½, 2½) y la cantidad puede estar en el medio
//      («jugo de ½ limón»), así que si no hay número al principio se busca en
//      todo el fragmento.
//   3. **Traducir.** Se prueban las `REGLAS` de `despensa.js` contra el resto
//      —lo que queda después de la cantidad— y, si ninguna matchea, contra el
//      fragmento entero. Los dos intentos hacen falta: «150 cc de crema» sólo se
//      reconoce por el resto («crema»), y «1 provoleta de 200 g» sólo por el
//      texto entero, porque su resto es «200 g».
//
// Lo que no matchea **no se descarta**: sale en `sinReconocer` y
// `scripts/verificar.mjs` falla. Una lista a la que le falta un ingrediente no
// se nota hasta que se está cocinando.

import { ARTICULOS, REGLAS, SECTORES, CUCHARADA, CUCHARADITA, TAZA, PUÑADO, CHORRO } from "../data/despensa.js";

const FRACCIONES = { "½": 0.5, "¼": 0.25, "¾": 0.75, "⅓": 1 / 3, "⅔": 2 / 3 };

/** Las unidades que pueden aparecer escritas en un ingrediente. */
const UNIDADES =
  "kg|g|cc|ml|tazas?|cucharadas?|cucharaditas?|latas?|atados?|dientes?|fetas?|" +
  "filetes?|tiras?|puñados?|pizcas?|chorros?|medallones?|medallón|muslos?|" +
  "paquetes?|potes?|sobres?|provoletas?";

/** Singular de la unidad escrita, para poder buscarla en una tabla. */
function normalizarUnidad(u) {
  if (!u) return null;
  const s = u.toLowerCase();
  if (s === "medallones") return "medallón";
  if (/^(kg|g|cc|ml)$/.test(s)) return s;
  return s.replace(/es$/, "").replace(/s$/, "");
}

/** «2½» → 2.5, «½» → 0.5, «un» → 1. */
function aNumero(txt) {
  if (!txt) return null;
  const t = txt.trim().toLowerCase();
  if (/^un[oa]?s?$/.test(t)) return 1;
  let n = 0;
  const m = t.match(/^(\d+)/);
  if (m) n += Number(m[1]);
  for (const [f, v] of Object.entries(FRACCIONES)) if (t.includes(f)) n += v;
  return n || null;
}

const NUM = "(?:\\d+(?:[.,]\\d+)?[½¼¾⅓⅔]?|[½¼¾⅓⅔]|[Uu]n[oa]?s?)";

/** Cantidad, unidad y resto de un fragmento de ingrediente. */
export function medir(fragmento) {
  const t = fragmento.trim();

  // «1 cucharada de manteca» / «3 fetas de jamón crudo»
  let m = t.match(new RegExp(`^(${NUM})\\s+(${UNIDADES})\\b\\s*(?:de\\s+)?(.*)$`, "i"));
  if (m) return { cant: aNumero(m[1]), unidad: normalizarUnidad(m[2]), resto: m[3].trim() };

  // «3 huevos» / «½ palta» / «Un hilo de aceite de oliva»
  m = t.match(new RegExp(`^(${NUM})\\s+(.+)$`));
  if (m) return { cant: aNumero(m[1]), unidad: null, resto: m[2].trim() };

  // «jugo de ½ limón», «Edulcorante equivalente a 150 g de azúcar»: el número
  // está en el medio. La cantidad vale; el resto es el fragmento entero, porque
  // recortarlo por la mitad se lleva justo la palabra que nombra la cosa.
  m = t.match(new RegExp(`(${NUM})\\s*(${UNIDADES})?\\b`, "i"));
  if (m && aNumero(m[1])) {
    return { cant: aNumero(m[1]), unidad: normalizarUnidad(m[2]), resto: t };
  }

  // «Sal gruesa», «Aceite de oliva», «Rúcula».
  return { cant: 1, unidad: null, resto: t };
}

/** Parte un ingrediente en los fragmentos que son cosas distintas. */
export function partir(ingrediente) {
  // «Relleno: …», «Para el chimichurri: …», «Base: …», «Mayonesa casera: …»
  const sinPrefijo = ingrediente.replace(/^[^:]{1,30}:\s*/, "");
  return sinPrefijo
    .split(",")
    .flatMap((p) => (/\d|[½¼¾⅓⅔]/.test(p) ? [p] : p.split(/\s+y\s+/)))
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Qué artículo es este fragmento. `null` = se ignora a propósito. */
function articuloDe(resto, entero) {
  for (const objetivo of [resto.toLowerCase(), entero.toLowerCase()]) {
    for (const [re, clave] of REGLAS) {
      if (re.test(objetivo)) return { clave, encontrado: true };
    }
  }
  return { clave: undefined, encontrado: false };
}

/** Cuánto suma este fragmento, en la unidad de compra del artículo. */
function cantidadEnUnidadDeCompra(art, cant, unidad) {
  // Los condimentos no tienen cantidad: nadie compra 3,5 g de orégano.
  if (!art.unidad) return null;
  // Lo que rinde varias semanas se pide de a uno y no se multiplica. Además
  // evita que «Edulcorante equivalente a 150 g de azúcar» pida 150 paquetes.
  if (art.escala === false) return 1;

  const masa = art.unidad === "g" || art.unidad === "cc";
  const porUnidad = art.porUnidad ?? (masa ? CUCHARADA : 1);

  let factor;
  switch (unidad) {
    case "kg": factor = 1000; break;
    case "g": case "cc": case "ml": factor = art.porGramo ?? 1; break;
    case "taza": factor = art.porTaza ?? (masa ? TAZA : porUnidad); break;
    case "cucharada": factor = art.porCucharada ?? (masa ? CUCHARADA : porUnidad); break;
    case "cucharadita": factor = art.porCucharadita ?? (masa ? CUCHARADITA : porUnidad); break;
    case "puñado": factor = masa ? PUÑADO : porUnidad; break;
    case "chorro": factor = masa ? CHORRO : porUnidad; break;
    case "pizca": factor = 0; break;
    default: factor = porUnidad;
  }
  return cant * factor;
}

/**
 * La lista del súper de un conjunto de recetas.
 *
 * `recetas` son objetos `{ receta, comida }`: la misma receta puede entrar dos
 * veces en la semana —el plan de un mes repite— y cada aparición suma.
 *
 * Devuelve `{ sectores, sinReconocer }`, con los sectores en el orden en que se
 * recorre el súper y los ítems de cada uno en la forma que espera
 * `lib/porciones.js`: `{ cant, unidad, nombre, escala, usos }`.
 */
export function listaDe(recetas) {
  const acumulado = new Map();
  const sinReconocer = new Set();

  for (const { receta, comida } of recetas) {
    // Un ingrediente repetido dentro de la misma receta —pasa: manteca en la
    // masa y manteca en el relleno— suma cantidad pero cuenta **un solo uso**.
    const usadosEnEsta = new Set();

    for (const ingrediente of receta.ingredientes) {
      for (const fragmento of partir(ingrediente)) {
        const { cant, unidad, resto } = medir(fragmento);
        const { clave, encontrado } = articuloDe(resto, fragmento);
        if (!encontrado) {
          sinReconocer.add(`${receta.slug}: «${fragmento}»`);
          continue;
        }
        if (clave === null) continue; // ignorado a propósito (agua, hielo)

        const art = ARTICULOS[clave];
        if (!art) {
          sinReconocer.add(`${receta.slug}: artículo inexistente «${clave}»`);
          continue;
        }

        if (!acumulado.has(clave)) {
          acumulado.set(clave, { clave, art, total: 0, usos: {} });
        }
        const acc = acumulado.get(clave);
        const suma = cantidadEnUnidadDeCompra(art, cant, unidad);
        if (suma != null) {
          // Lo que no se multiplica se pide una vez, aunque aparezca en veinte
          // recetas: si no, la lista pediría veinte botellas de aceite.
          acc.total = art.escala === false ? 1 : acc.total + suma;
        }
        if (!usadosEnEsta.has(clave)) {
          usadosEnEsta.add(clave);
          acc.usos[comida] = (acc.usos[comida] ?? 0) + 1;
        }
      }
    }
  }

  const porSector = new Map(SECTORES.map((s) => [s, []]));
  for (const { art, total, usos } of acumulado.values()) {
    const item = {
      cant: art.unidad ? redondearCompra(total, art.unidad) : null,
      unidad: art.unidad ?? null,
      nombre: art.nombre ?? null,
      usos,
    };
    if (art.escala === false) item.escala = false;
    porSector.get(art.sector).push(item);
  }

  // Dentro de cada sector, lo más usado primero: es lo que no puede faltar.
  const sectores = SECTORES.map((sector) => ({
    sector,
    items: porSector.get(sector).sort((a, b) => usosTotales(b) - usosTotales(a)),
  })).filter((s) => s.items.length);

  return { sectores, sinReconocer: [...sinReconocer].sort() };
}

function usosTotales(item) {
  return Object.values(item.usos).reduce((a, b) => a + b, 0);
}

/**
 * Redondeo de compra, antes de que `porciones.js` haga el suyo.
 *
 * Acá se redondea a **algo que se pueda pedir en el mostrador**: los gramos y
 * los cc a múltiplos de 50, los contables para arriba. Sin esto la lista pediría
 * «0,58 docenas de huevos» y «237,5 g de manteca», que es exactamente el tipo de
 * número que hace que alguien deje de usar una lista.
 */
function redondearCompra(total, unidad) {
  // Siempre para arriba. Quedarse corto en el súper significa volver, o cocinar
  // otra cosa: redondear 60 g de jamón crudo a 50 arruina la receta, y redondear
  // a 100 sólo deja dos fetas en la heladera.
  if (unidad === "g" || unidad === "cc") return Math.max(50, Math.ceil(total / 50) * 50);
  return Math.max(1, Math.ceil(total - 0.001));
}
