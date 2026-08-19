/**
 * Vuelca el contenido del sitio a `storage/contenido.json` para que lo lea el
 * pipeline de audio, que es Python.
 *
 * Los datos viven en `src/data/*.js` como módulos ESM, no en Markdown, así que
 * la única forma honesta de leerlos es importándolos: cualquier parser de texto
 * que escribiéramos en Python se rompería con la primera coma dentro de una
 * string. Node ya sabe leer esos módulos — que los lea él.
 *
 *   node scripts/audios/exportar.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const { RECETAS, COMIDAS, PLAN_SEMANAL } = await import(`${RAIZ}/src/data/recetas.js`);
const { RUTINAS } = await import(`${RAIZ}/src/data/ejercicios.js`);
const { ARTICULOS } = await import(`${RAIZ}/src/data/evidencia.js`);
const { NEGOCIACIONES, CATEGORIAS_NEG } = await import(`${RAIZ}/src/data/negociemos.js`);
const { PRODUCTOS, CATEGORIAS } = await import(`${RAIZ}/src/data/productos.js`);
const { INGREDIENTES } = await import(`${RAIZ}/src/data/ingredientes.js`);
const { PRINCIPIOS_FREEZER, COMO_CONGELAR, NO_SE_CONGELA, TRUCOS } =
  await import(`${RAIZ}/src/data/cocina.js`);
const { AYUNOS } = await import(`${RAIZ}/src/data/ayuno.js`);

const salida = {
  generado: new Date().toISOString(),
  comidas: COMIDAS,
  recetas: RECETAS,
  planSemanal: PLAN_SEMANAL,
  rutinas: RUTINAS,
  articulos: ARTICULOS,
  negociaciones: NEGOCIACIONES,
  categoriasNeg: CATEGORIAS_NEG,
  productos: PRODUCTOS,
  categorias: CATEGORIAS,
  ingredientes: INGREDIENTES,
  freezer: { principios: PRINCIPIOS_FREEZER, fichas: COMO_CONGELAR, nunca: NO_SE_CONGELA },
  trucos: TRUCOS,
  ayunos: AYUNOS,
};

const destino = `${RAIZ}/storage/contenido.json`;
fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, JSON.stringify(salida, null, 1));

const n = (x) => (Array.isArray(x) ? x.length : 0);
console.log(
  `contenido.json: ${n(RECETAS)} recetas · ${n(RUTINAS)} rutinas · ` +
    `${n(ARTICULOS)} artículos · ${n(NEGOCIACIONES)} comparativas · ${n(PRODUCTOS)} productos · ` +
    `${Object.keys(INGREDIENTES).length} fichas · ${n(TRUCOS)} grupos de trucos`,
);
