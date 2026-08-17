// Índice de búsqueda: se genera en el build y se sirve como un JSON estático.
//
// Por qué así y no con un buscador embebido en cada página: el índice completo
// pesa unos pocos kilobytes, pero no hay razón para que viaje en el HTML de
// todas las páginas cuando la mayoría de las visitas no va a buscar nada. Se
// baja una sola vez, cuando alguien escribe la primera letra, y queda cacheado.
//
// Tampoco hace falta un servicio externo tipo Algolia: con este volumen de
// contenido, filtrar un array en el navegador es instantáneo y no agrega
// dependencias, ni costo, ni una llamada a un tercero desde un sitio que tiene
// que cargar rápido.

import { RECETAS } from "../data/recetas.js";
import { NEGOCIACIONES } from "../data/negociemos.js";
import { ARTICULOS } from "../data/evidencia.js";
import { PRODUCTOS } from "../data/productos.js";

export function GET() {
  const docs = [
    ...RECETAS.map((r) => ({
      t: r.nombre,
      u: `/recetas/${r.slug}`,
      s: "Receta",
      d: `${r.minutos} min · ${r.macros.carbos} g de carbos netos`,
      // El cuerpo indexado incluye los ingredientes: alguien que busca "palta"
      // espera encontrar las recetas que la llevan, no sólo la que la tiene en
      // el título.
      b: [r.nombre, ...r.ingredientes, r.tip ?? ""].join(" "),
    })),
    ...NEGOCIACIONES.map((n) => ({
      t: n.titulo,
      u: `/negociemos/${n.slug}`,
      s: "Negociemos",
      d: n.resumen,
      b: [n.titulo, n.pregunta, n.resumen, ...n.opciones.map((o) => o.nombre)].join(" "),
    })),
    ...ARTICULOS.map((a) => ({
      t: a.titulo,
      u: `/evidencia/${a.slug}`,
      s: "Evidencia",
      d: a.bajada,
      b: [a.titulo, a.bajada, a.resumen_directo].join(" "),
    })),
    ...PRODUCTOS.map((p) => ({
      t: p.nombre,
      u: "/productos",
      s: p.apto ? "Producto permitido" : "Producto a evitar",
      d: `${p.carbos} g de carbos netos · ${p.nota}`,
      b: [p.nombre, p.marcas ?? "", p.nota].join(" "),
    })),
    {
      t: "Cómo empezar keto en 7 días",
      u: "/como-empezar",
      s: "Guía",
      d: "Los siete pasos de la primera semana, en orden.",
      b: "como empezar keto arrancar primera semana guia principiantes gripe keto",
    },
    {
      t: "Calculadora de macros y peso ideal",
      u: "/calculadora",
      s: "Herramienta",
      d: "Macros, cuánto deberías pesar, masa magra y cuánto vas a tardar.",
      b: "calculadora macros peso ideal imc masa magra grasa corporal tiempo objetivo",
    },
    {
      t: "Lista de compras semanal",
      u: "/lista-compras",
      s: "Herramienta",
      d: "Todo lo de las 28 comidas del plan, por sector del súper.",
      b: "lista compras supermercado semanal carniceria verduleria dietetica",
    },
  ];

  return new Response(JSON.stringify(docs), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
