// Reparte las 49 recetas en 4 semanas y emite el JS de SEMANAS.
import { RECETAS, PLAN_SEMANAL } from "../src/data/recetas.js";
import { listaDe } from "../src/lib/compras.js";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const COMIDAS = ["desayuno", "almuerzo", "merienda", "cena"];
const porSlug = Object.fromEntries(RECETAS.map((r) => [r.slug, r]));

// Las colaciones entran como merienda: son 6 recetas que el plan de una semana
// no usaba nunca, y con 9 meriendas para 28 huecos la merienda era lo más
// repetido del mes.
const POOL = {
  desayuno: RECETAS.filter((r) => r.comida === "desayuno"),
  almuerzo: RECETAS.filter((r) => r.comida === "almuerzo"),
  merienda: RECETAS.filter((r) => r.comida === "merienda" || r.comida === "colacion"),
  cena: RECETAS.filter((r) => r.comida === "cena"),
};

// Cuántas veces aparece cada receta en el mes: 28 huecos repartidos parejo.
function apariciones(pool) {
  const n = pool.length;
  const base = Math.floor(28 / n);
  const extra = 28 - base * n;
  return pool.map((r, i) => ({ slug: r.slug, veces: base + (i < extra ? 1 : 0) }));
}

// Un generador determinista: el mismo plan en cada corrida.
let semilla = 20260819;
const rnd = () => (semilla = (semilla * 1103515245 + 12345) % 2147483648) / 2147483648;

/** Reparte las apariciones en 4 semanas de 7, sin repetir dentro de una semana.
 *  La semana 1 viene dada: es el plan curado que ya existía, y que además narra
 *  el audio de la caminata 3. */
function repartir(pool, comida) {
  const cupos = apariciones(pool);
  const fija = PLAN_SEMANAL.map((d) => d[comida]);
  for (let intento = 0; intento < 5000; intento++) {
    const semanas = [fija.slice(), [], [], []];
    const restantes = cupos.flatMap((c) => Array(c.veces).fill(c.slug));
    for (const s of fija) restantes.splice(restantes.indexOf(s), 1);
    const pendientes = restantes;
    // Los que más veces aparecen se colocan primero: son los que menos lugar
    // tienen para elegir.
    pendientes.sort(() => rnd() - 0.5);
    const cuenta = {};
    for (const s of pendientes) cuenta[s] = (cuenta[s] ?? 0) + 1;
    pendientes.sort((a, b) => cuenta[b] - cuenta[a]);

    let ok = true;
    for (const slug of pendientes) {
      const posibles = [1, 2, 3]
        .filter((w) => semanas[w].length < 7 && !semanas[w].includes(slug))
        .sort((a, b) => semanas[a].length - semanas[b].length || rnd() - 0.5);
      if (!posibles.length) { ok = false; break; }
      semanas[posibles[0]].push(slug);
    }
    if (ok && semanas.every((s) => s.length === 7)) return semanas;
  }
  throw new Error("no se pudo repartir");
}

/** Cuántos artículos frescos distintos necesita esta semana. Menos es mejor:
 *  significa que las recetas de la semana comparten verdura y carne. */
function frescosDe(semana) {
  const recetas = semana.flatMap((d) =>
    COMIDAS.map((c) => ({ receta: porSlug[d[c]], comida: c })));
  const { sectores } = listaDe(recetas);
  return sectores
    .filter((s) => s.sector === "Verdulería" || s.sector === "Carnicería y pescadería")
    .reduce((n, s) => n + s.items.length, 0);
}

function armar(reparto) {
  return [0, 1, 2, 3].map((w) =>
    DIAS.map((dia, d) => {
      const fila = { dia };
      for (const c of COMIDAS) fila[c] = reparto[c][w][d];
      return fila;
    }));
}

/** Dentro de cada semana, el orden de los días: lo que lleva más tiempo cae el
 *  fin de semana, que es cuando hay tiempo de cocinarlo. */
function ordenarDias(reparto) {
  for (const c of COMIDAS) {
    for (const semana of reparto[c].slice(1)) {
      semana.sort((a, b) => porSlug[a].minutos - porSlug[b].minutos);
      // Lunes a viernes lo rápido; sábado y domingo lo que lleva más tiempo.
    }
  }
}

// ── Reparto, y después una mejora por intercambios ─────────────────────────
const reparto = {};
for (const c of COMIDAS) reparto[c] = repartir(POOL[c], c);
ordenarDias(reparto);

function puntaje(rep) {
  const semanas = armar(rep);
  return semanas.reduce((n, s) => n + frescosDe(s), 0);
}

let mejor = JSON.parse(JSON.stringify(reparto));
let mejorP = puntaje(mejor);
const inicial = mejorP;

for (let paso = 0; paso < 4000; paso++) {
  const cand = JSON.parse(JSON.stringify(mejor));
  const c = COMIDAS[Math.floor(rnd() * 4)];
  const w1 = 1 + Math.floor(rnd() * 3);
  let w2 = 1 + Math.floor(rnd() * 3);
  if (w1 === w2) continue;
  const i = Math.floor(rnd() * 7);
  const j = Math.floor(rnd() * 7);
  const a = cand[c][w1][i], b = cand[c][w2][j];
  if (a === b) continue;
  if (cand[c][w1].includes(b) || cand[c][w2].includes(a)) continue;
  cand[c][w1][i] = b;
  cand[c][w2][j] = a;
  const p = puntaje(cand);
  if (p <= mejorP) { mejor = cand; mejorP = p; }
}

ordenarDias(mejor);
const semanas = armar(mejor);

// ── Informe ────────────────────────────────────────────────────────────────
console.error(`frescos distintos por mes: ${inicial} → ${mejorP}`);
const usadas = new Set();
for (const [w, s] of semanas.entries()) {
  const recetas = s.flatMap((d) => COMIDAS.map((c) => ({ receta: porSlug[d[c]], comida: c })));
  recetas.forEach((r) => usadas.add(r.receta.slug));
  const { sectores } = listaDe(recetas);
  const items = sectores.reduce((n, x) => n + x.items.length, 0);
  const cal = Math.round(recetas.reduce((n, r) => n + r.receta.macros.calorias, 0) / 7);
  const carbos = Math.round(recetas.reduce((n, r) => n + r.receta.macros.carbos, 0) / 7);
  console.error(`  semana ${w + 1}: ${items} ítems · ${cal} cal/día · ${carbos} g carbos/día`);
}
console.error(`recetas distintas usadas en el mes: ${usadas.size} de ${RECETAS.length}`);
for (const r of RECETAS) if (!usadas.has(r.slug)) console.error(`  ✗ nunca usada: ${r.slug}`);

// ── Salida ─────────────────────────────────────────────────────────────────
const ancho = (arr, k) => Math.max(...arr.map((x) => x[k].length));
for (const [w, s] of semanas.entries()) {
  const aD = ancho(s, "desayuno"), aA = ancho(s, "almuerzo"), aM = ancho(s, "merienda");
  console.log(`  [`);
  for (const d of s) {
    console.log(
      `    { dia: ${(JSON.stringify(d.dia) + ",").padEnd(13)} ` +
      `desayuno: ${(JSON.stringify(d.desayuno) + ",").padEnd(aD + 4)} ` +
      `almuerzo: ${(JSON.stringify(d.almuerzo) + ",").padEnd(aA + 4)} ` +
      `merienda: ${(JSON.stringify(d.merienda) + ",").padEnd(aM + 4)} ` +
      `cena: ${JSON.stringify(d.cena)} },`);
  }
  console.log(`  ],`);
}
