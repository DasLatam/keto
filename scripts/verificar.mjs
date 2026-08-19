/**
 * Verificación del contenido del sitio.
 *
 *   node scripts/verificar.mjs          # todo
 *   node scripts/verificar.mjs --duro   # sólo lo que es un error, sin avisos
 *
 * Existe porque el contenido es la única credibilidad que tiene el sitio. Una
 * receta que dice tener 430 calorías y suma 512, o una que se presenta como keto
 * y lleva 30 gramos de carbohidratos, no es un detalle: es la razón por la que
 * alguien deja de creerle a todo lo demás.
 *
 * Distingue dos niveles a propósito:
 *
 *   ✗ ERROR  algo es falso o inconsistente y hay que arreglarlo.
 *   ⚠ AVISO  algo puede estar bien pero conviene mirarlo.
 *
 * Sale con código 1 si hay errores, para poder engancharlo a un build o a un
 * hook antes de publicar.
 */
import { RECETAS, PLAN_SEMANAL, LISTA_COMPRAS, COMIDAS, ETIQUETAS } from "../src/data/recetas.js";
import { PRODUCTOS, CATEGORIAS } from "../src/data/productos.js";
import { INGREDIENTES } from "../src/data/ingredientes.js";
import { RUTINAS } from "../src/data/ejercicios.js";
import { ARTICULOS } from "../src/data/evidencia.js";
import { NEGOCIACIONES } from "../src/data/negociemos.js";
import { COMIDAS_PLAN } from "../src/data/ayuno.js";
import { recetasCon } from "../src/lib/ingredientes.js";
import { esDePocosIngredientes, paraComprar } from "../src/lib/etiquetas.js";
import creditos from "../src/data/creditos.json" with { type: "json" };
import { readFileSync, existsSync } from "node:fs";

const errores = [];
const avisos = [];
const err = (donde, que) => errores.push([donde, que]);
const avi = (donde, que) => avisos.push([donde, que]);

const plano = (t) =>
  String(t ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// ══════════════════════════════════════════════════════════════════════════
// 1. Los macros cierran con las calorías
// ══════════════════════════════════════════════════════════════════════════
//
// Grasa 9 cal/g, proteína y carbohidratos 4 cal/g (Atwater). Las tablas de
// alimentos redondean y los alimentos reales varían, así que un desvío chico es
// normal: lo que no es normal es un 25 % de diferencia, que significa que el
// número salió de otro lado o que alguien cambió un ingrediente y no rehizo la
// cuenta.
const TOLERANCIA = 0.2;

for (const r of RECETAS) {
  const m = r.macros;
  const calculadas = m.grasas * 9 + m.proteinas * 4 + m.carbos * 4;
  const desvio = Math.abs(calculadas - m.calorias) / m.calorias;
  if (desvio > TOLERANCIA) {
    err(
      r.slug,
      `los macros dan ${Math.round(calculadas)} cal pero dice ${m.calorias} ` +
        `(${(desvio * 100).toFixed(0)} % de desvío) — G${m.grasas} P${m.proteinas} C${m.carbos}`,
    );
  } else if (desvio > 0.1) {
    avi(r.slug, `los macros dan ${Math.round(calculadas)} cal contra ${m.calorias} declaradas`);
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 2. ¿Es keto de verdad?
// ══════════════════════════════════════════════════════════════════════════
//
// El presupuesto habitual de una dieta cetogénica es de 20 a 50 g de
// carbohidratos netos por día. Una receta de una comida que sola se lleva más de
// 15 g no puede presentarse sin aclaración; más de 10 g ya merece una mirada.
const CARBOS_ERROR = 15;
const CARBOS_AVISO = 10;

for (const r of RECETAS) {
  if (r.macros.carbos > CARBOS_ERROR) {
    err(r.slug, `${r.macros.carbos} g de carbos netos en una porción: no es keto`);
  } else if (r.macros.carbos > CARBOS_AVISO) {
    avi(r.slug, `${r.macros.carbos} g de carbos netos en una porción, al límite`);
  }
}

// Un plato keto saca la mayor parte de sus calorías de la grasa. Por debajo del
// 55 % es un plato magro que necesita grasa agregada, y conviene saberlo.
for (const r of RECETAS) {
  const m = r.macros;
  const pctGrasa = (m.grasas * 9) / (m.grasas * 9 + m.proteinas * 4 + m.carbos * 4);
  if (pctGrasa < 0.5) {
    avi(r.slug, `sólo ${(pctGrasa * 100).toFixed(0)} % de las calorías vienen de la grasa`);
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 3. Ingredientes prohibidos colados en una receta
// ══════════════════════════════════════════════════════════════════════════
//
// Se buscan por palabra, contra la lista de lo que el propio sitio marca como no
// apto en `productos.js`, más los sospechosos habituales. Es la comprobación que
// atrapa el copiar y pegar de una receta común.
const PROHIBIDOS = [
  "harina de trigo", "pan rallado", "pan de molde", "fideos", "arroz", "avena",
  "azucar", "miel", "papa", "batata", "choclo", "mandioca",
  "banana", "maicena", "fecula", "almidon", "dulce de leche", "cerveza",
];

// Se revisa **sólo la lista de ingredientes**, no los pasos ni el tip.
//
// Los pasos y el tip nombran lo prohibido todo el tiempo, y con razón: "del
// grosor de una papa pay", "reemplazan a la papa", "el gramajo original lleva
// papas pay". Eso no es una receta con papa, es una receta que explica qué
// reemplaza — que es justamente lo que hace buena a la receta. Revisarlos daba
// cuatro errores falsos de cuatro.
const CONTEXTO_OK = /\b(sin|en vez de|en lugar de|reemplaza|equivalente a|como si fuera|tipo)\b/;

for (const r of RECETAS) {
  for (const ing of r.ingredientes) {
    const linea = plano(ing);
    if (CONTEXTO_OK.test(linea)) continue;   // "Edulcorante equivalente a 150 g de azúcar"
    for (const mal of PROHIBIDOS) {
      // Límite de palabra: sin esto, "papa" matchea "pelapapas" y "fecula"
      // matchea cualquier cosa que la contenga.
      const re = new RegExp(`(^|[^a-z])${plano(mal)}($|[^a-z])`);
      if (re.test(linea)) err(r.slug, `el ingrediente «${ing}» incluye «${mal}»`);
    }
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 4. Los pasos no usan ingredientes que no están en la lista
// ══════════════════════════════════════════════════════════════════════════
//
// Es el error que más arruina una receta en la práctica: alguien compra lo de la
// lista, empieza a cocinar y en el último paso aparece algo que no tiene. Pasaba
// de verdad en dos recetas: la crema de brócoli servía con pimienta que no
// estaba listada, y los panqueques con frutillas que tampoco.
//
// El léxico se arma con **el sustantivo principal de cada línea de ingrediente
// de las 49 recetas**, y no partiendo los nombres de la góndola en palabras. La
// primera versión hacía eso último y avisaba de «para», «entera» y «hoja»: 30
// avisos de los cuales 28 eran ruido, que es lo mismo que ninguno porque nadie
// los lee.
const LEXICO = new Set();
for (const r of RECETAS) {
  for (const ing of r.ingredientes) {
    // Se descarta la cantidad y la unidad y queda el sustantivo: de
    // "200 g de queso sardo o parmesano rallado grueso" quedan queso, sardo,
    // parmesano.
    const limpio = plano(ing)
      .replace(/^[\d\s/½¼¾,.]*/, "")
      .replace(/\b(g|kg|cc|ml|cucharada|cucharadita|taza|punado|feta|diente|lata|atado|unidad|chorro|pizca|rama|hoja|cabeza|filete|muslo|tira|cubo)s?\b/g, " ");
    for (const t of limpio.split(/[\s,;/()]+/)) {
      const w = t.replace(/s$/, "");
      if (w.length >= 5) LEXICO.add(w);
    }
  }
}
// Palabras que quedaron en el léxico pero son adjetivos o preparación, no cosas.
for (const x of ["rallado", "rallada", "picado", "picada", "molido", "molida", "grueso",
                 "gruesa", "entero", "entera", "fresco", "fresca", "grande", "chico", "crudo", "cruda",
                 "chica", "opcional", "servir", "gusto", "seco", "seca", "negro", "negra",
                 "verde", "cremoso", "cremosa", "batido", "cortado", "derretida", "extra",
                 "esencia", "sartén", "sarten", "horno", "fuego", "parte", "punto",
                 "trozo", "rodaja", "bastone", "tira", "medio", "media", "sobre",
                 // Colectivos con los que un paso se refiere a algo ya listado:
                 // "alterná pollo y verduras", "cubrilo con la salsa", "dorá la
                 // carne". No son ingredientes nuevos, son la misma cosa nombrada
                 // en general, y avisar por ellos es avisar por todo.
                 "carne", "pollo", "pescado", "verdura", "queso", "salsa", "grasa",
                 "masa", "mezcla", "relleno", "cobertura"]) {
  LEXICO.delete(plano(x));
}

for (const r of RECETAS) {
  const enIngredientes = new Set(
    plano(r.ingredientes.join(" ; ")).split(/[\s,;/()]+/).map((t) => t.replace(/s$/, "")),
  );
  const faltantes = new Set();
  for (const paso of r.pasos) {
    // "papel manteca" es papel, no manteca: es la trampa más obvia y la que más
    // avisos falsos daba.
    const linea = plano(paso).replace(/papel manteca/g, " ");
    // Un paso que dice "sin aceite" o "reemplazan a la papa" no está usando eso.
    if (CONTEXTO_OK.test(linea)) continue;
    for (const t of linea.split(/[\s,;.:/()]+/)) {
      const w = t.replace(/s$/, "");
      if (LEXICO.has(w) && !enIngredientes.has(w)) faltantes.add(w);
    }
  }
  if (faltantes.size) {
    avi(r.slug, `los pasos usan «${[...faltantes].join(", ")}» y no está en los ingredientes`);
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 5. Campos obligatorios, unicidad y coherencia estructural
// ══════════════════════════════════════════════════════════════════════════
const slugs = new Set();
for (const r of RECETAS) {
  for (const campo of ["slug", "nombre", "comida", "minutos", "porciones", "tip"]) {
    if (r[campo] === undefined || r[campo] === null || r[campo] === "") {
      err(r.slug ?? "(sin slug)", `le falta el campo «${campo}»`);
    }
  }
  if (slugs.has(r.slug)) err(r.slug, "slug repetido");
  slugs.add(r.slug);

  if (!r.ingredientes?.length) err(r.slug, "no tiene ingredientes");
  if (!r.pasos?.length) err(r.slug, "no tiene pasos");
  if (r.porciones < 1) err(r.slug, `porciones inválidas: ${r.porciones}`);
  if (r.minutos < 1 || r.minutos > 240) avi(r.slug, `${r.minutos} minutos parece raro`);
  if (!COMIDAS.some((c) => c.id === r.comida)) err(r.slug, `comida desconocida: ${r.comida}`);
  for (const e of r.etiquetas ?? []) {
    if (!ETIQUETAS.some((x) => x.id === e)) err(r.slug, `etiqueta desconocida: ${e}`);
  }
  // Una receta de "15 minutos" que declara 40 se contradice a sí misma.
  if (r.etiquetas?.includes("15min") && r.minutos > 15) {
    err(r.slug, `tiene la etiqueta «15min» pero declara ${r.minutos} minutos`);
  }
  // La etiqueta cuenta lo que hay que **comprar**, no las líneas: ver
  // `lib/etiquetas.js`. Se comprueba en los dos sentidos, porque una receta que
  // califica y no la tiene no aparece en el filtro, y para quien busca eso es lo
  // mismo que no existir.
  const corresponde = esDePocosIngredientes(r);
  const tiene = r.etiquetas?.includes("pocos-ingredientes") ?? false;
  if (tiene && !corresponde) {
    err(r.slug, `«pocos ingredientes» con ${paraComprar(r)} cosas para comprar`);
  }
  if (!tiene && corresponde) {
    err(r.slug, `${paraComprar(r)} cosas para comprar y le falta la etiqueta «pocos ingredientes»`);
  }
  if (!r.etiquetas?.includes("15min") && r.minutos <= 15) {
    avi(r.slug, `${r.minutos} minutos y no tiene la etiqueta «15min»`);
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 6. Fotos y atribución
// ══════════════════════════════════════════════════════════════════════════
for (const r of RECETAS) {
  const c = creditos[r.slug];
  const archivo = `public/img/recetas/${r.slug}.webp`;
  if (!existsSync(new URL(`../${archivo}`, import.meta.url))) {
    err(r.slug, `falta la foto ${archivo}`);
  }
  if (!c) {
    err(r.slug, "no tiene entrada en creditos.json");
    continue;
  }
  // Las licencias Creative Commons obligan a atribuir. Una foto sin autor o sin
  // enlace a su licencia es un problema legal, no un descuido de formato.
  if (!c.propia) {
    if (!c.autor) err(r.slug, "la foto no tiene autor");
    if (!c.fuente) err(r.slug, "la foto no tiene enlace a la fuente");
    if (!c.licencia) err(r.slug, "la foto no declara licencia");
    if (/\bNC\b|NonCommercial|\bND\b|NoDeriv/i.test(c.licencia ?? "")) {
      err(r.slug, `licencia no usable en este sitio: ${c.licencia}`);
    }
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 7. El plan semanal
// ══════════════════════════════════════════════════════════════════════════
const porSlug = Object.fromEntries(RECETAS.map((r) => [r.slug, r]));
const usadas = [];
for (const d of PLAN_SEMANAL) {
  for (const c of COMIDAS_PLAN) {
    const s = d[c];
    if (!s) { err(`plan/${d.dia}`, `no tiene ${c}`); continue; }
    if (!porSlug[s]) { err(`plan/${d.dia}`, `${c} apunta a «${s}», que no existe`); continue; }
    if (porSlug[s].comida !== c) {
      avi(`plan/${d.dia}`, `«${s}» está catalogada como ${porSlug[s].comida} y se usa de ${c}`);
    }
    usadas.push(s);
  }
}
if (new Set(usadas).size !== usadas.length) {
  const repes = usadas.filter((s, i) => usadas.indexOf(s) !== i);
  err("plan", `recetas repetidas: ${[...new Set(repes)].join(", ")}`);
}
if (usadas.length !== 28) err("plan", `tiene ${usadas.length} comidas y deberían ser 28`);

// El día tiene que cerrar dentro de un presupuesto keto.
for (const d of PLAN_SEMANAL) {
  const carbos = COMIDAS_PLAN.reduce((a, c) => a + (porSlug[d[c]]?.macros.carbos ?? 0), 0);
  if (carbos > 50) err(`plan/${d.dia}`, `${carbos} g de carbos netos en el día: fuera de keto`);
  else if (carbos > 35) avi(`plan/${d.dia}`, `${carbos} g de carbos netos en el día, alto`);
}

// ══════════════════════════════════════════════════════════════════════════
// 8. La lista del súper cubre lo que el plan necesita
// ══════════════════════════════════════════════════════════════════════════
const enLista = new Set();
for (const s of LISTA_COMPRAS) {
  for (const it of s.items) {
    for (const t of plano(it.nombre ?? it.unidad).split(/[\s,/]+/)) {
      if (t.length >= 4) enLista.add(t.replace(/s$/, ""));
    }
  }
}
const sinCubrir = new Map();
for (const d of PLAN_SEMANAL) {
  for (const c of COMIDAS_PLAN) {
    const r = porSlug[d[c]];
    if (!r) continue;
    for (const ing of r.ingredientes) {
      const palabras = plano(ing)
        .replace(/^[\d\s/½¼¾,.]*/, "")
        .split(/[\s,/()]+/)
        .map((t) => t.replace(/s$/, ""))
        .filter((t) => t.length >= 4 && !["cucharada", "cucharadita", "gusto", "opcional",
          "picado", "picada", "rallado", "rallada", "cubo", "feta", "diente", "punado",
          "pizca", "taza", "hoja", "trozo", "unidad", "medio", "media", "extra"].includes(t));
      if (palabras.length && !palabras.some((t) => enLista.has(t))) {
        sinCubrir.set(ing, (sinCubrir.get(ing) ?? []).concat(r.slug));
      }
    }
  }
}
for (const [ing, recetas] of sinCubrir) {
  avi("lista-compras", `«${ing}» (${recetas[0]}) no aparece en la lista del súper`);
}

// ══════════════════════════════════════════════════════════════════════════
// 9. Productos, fichas de ingrediente y sus enlaces
// ══════════════════════════════════════════════════════════════════════════
const slugsProd = new Set();
for (const p of PRODUCTOS) {
  if (!p.slug) { err(p.nombre, "producto sin slug"); continue; }
  if (slugsProd.has(p.slug)) err(p.slug, "slug de producto repetido");
  slugsProd.add(p.slug);
  if (!CATEGORIAS.some((c) => c.id === p.categoria)) {
    err(p.slug, `categoría desconocida: ${p.categoria}`);
  }
  if (!INGREDIENTES[p.slug]) err(p.slug, "no tiene ficha en ingredientes.js");
  else if (!INGREDIENTES[p.slug].porque) err(p.slug, "la ficha no explica por qué entra o no");

  // Un producto marcado como apto con muchos carbohidratos se contradice.
  if (p.apto && p.carbos > 10) err(p.slug, `marcado como apto con ${p.carbos} g de carbos`);
  if (!p.apto && p.carbos < 1 && p.slug !== "aceite-de-girasol") {
    avi(p.slug, `marcado como no apto con ${p.carbos} g de carbos: conviene que la ficha explique por qué`);
  }
}
for (const s of Object.keys(INGREDIENTES)) {
  if (!slugsProd.has(s)) err(s, "ficha de ingrediente sin producto que la use");
}

// Un producto que el sitio marca como NO apto no puede aparecer en una receta.
//
// Sólo se comprueba sobre los productos con nombre específico. Los que son una
// categoría —«Harina de trigo, avena, pan, fideos, arroz», «Leche entera»,
// «Jugos y aguas saborizadas comunes»— dan falsos positivos garantizados:
// «leche» matchea «leche de coco» y «crema de leche», «fideos» matchea «fideos
// de zucchini» y «jugo» matchea «jugo de limón». Sobre esos vale la
// comprobación 3, que mira la línea de ingrediente entera.
const GENERICOS = new Set([
  "harinas-de-cereal", "leche-entera", "jugos", "papa-y-feculentas",
  "frutas-dulces", "fiambres-con-almidon", "aceite-de-girasol", "yogur-saborizado",
]);
for (const p of PRODUCTOS.filter((x) => !x.apto && !GENERICOS.has(x.slug))) {
  const rs = recetasCon(p, RECETAS);
  if (rs.length) {
    err(p.slug, `marcado como no apto pero aparece en: ${rs.map((r) => r.slug).join(", ")}`);
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 10. Rutinas, evidencia y comparativas
// ══════════════════════════════════════════════════════════════════════════
for (const r of RUTINAS) {
  if (!r.bloques?.length) err(r.slug, "rutina sin bloques");
  for (const b of r.bloques) {
    for (const e of b.ejercicios) {
      for (const campo of ["nombre", "dosis", "como", "tip"]) {
        if (!e[campo]) err(r.slug, `«${e.nombre ?? "?"}» sin ${campo}`);
      }
    }
  }
  if (!r.agenda?.hora) err(r.slug, "rutina sin horario de agenda");
}

for (const a of ARTICULOS) {
  if (!a.fuentes?.length) err(a.slug, "artículo de evidencia sin fuentes");
  for (const f of a.fuentes ?? []) {
    if (!f.url || !/^https?:\/\//.test(f.url)) err(a.slug, `fuente sin URL válida: ${f.cita?.slice(0, 40)}`);
  }
}

for (const n of NEGOCIACIONES) {
  if (!n.veredicto) err(n.slug, "comparativa sin veredicto");
  for (const o of n.opciones ?? []) {
    if (o.carbos === undefined) err(n.slug, `la opción «${o.nombre}» no declara carbos`);
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 11. Enlaces internos que apuntan a páginas que existen
// ══════════════════════════════════════════════════════════════════════════
const RUTAS = new Set([
  "/", "/recetas", "/plan-semanal", "/lista-compras", "/calculadora", "/calendario",
  "/productos", "/negociemos", "/evidencia", "/ejercicios", "/como-empezar",
  "/quienes-somos", "/ayuno-intermitente", "/congelar", "/trucos",
  "/condiciones-de-servicio", "/politica-de-privacidad", "/politica-de-cookies",
  ...RECETAS.map((r) => `/recetas/${r.slug}`),
  ...PRODUCTOS.map((p) => `/productos/${p.slug}`),
  ...RUTINAS.map((r) => `/ejercicios/${r.slug}`),
  ...ARTICULOS.map((a) => `/evidencia/${a.slug}`),
  ...NEGOCIACIONES.map((n) => `/negociemos/${n.slug}`),
]);

const fuentesTexto = [
  ...RECETAS.map((r) => [r.slug, r.pasos.join(" ") + r.tip]),
  ...Object.entries(INGREDIENTES).map(([s, d]) => [s, Object.values(d).join(" ")]),
];
for (const [donde, texto] of fuentesTexto) {
  for (const m of String(texto).matchAll(/href="(\/[^"#]*)"/g)) {
    const ruta = m[1].replace(/\/$/, "") || "/";
    if (!RUTAS.has(ruta)) err(donde, `enlace roto: ${m[1]}`);
  }
}

// ══════════════════════════════════════════════════════════════════════════
// Salida
// ══════════════════════════════════════════════════════════════════════════
const soloDuro = process.argv.includes("--duro");

function imprimir(titulo, lista, marca) {
  if (!lista.length) return;
  console.log(`\n${titulo} (${lista.length})\n`);
  const porDonde = new Map();
  for (const [donde, que] of lista) {
    porDonde.set(donde, (porDonde.get(donde) ?? []).concat(que));
  }
  for (const [donde, qs] of [...porDonde].sort()) {
    console.log(`  ${donde}`);
    for (const q of qs) console.log(`    ${marca} ${q}`);
  }
}

console.log(
  `Verificando ${RECETAS.length} recetas · ${PRODUCTOS.length} productos · ` +
  `${RUTINAS.length} rutinas · ${ARTICULOS.length} artículos · ${NEGOCIACIONES.length} comparativas`,
);

imprimir("ERRORES", errores, "✗");
if (!soloDuro) imprimir("AVISOS", avisos, "⚠");

console.log(
  `\n${errores.length ? "✗" : "✓"} ${errores.length} errores` +
  (soloDuro ? "" : ` · ${avisos.length} avisos`),
);
process.exit(errores.length ? 1 : 0);
