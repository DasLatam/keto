// `/llms.txt`: el mapa del sitio escrito para un modelo de lenguaje.
//
// Qué es. Una convención (llmstxt.org) para dejar en la raíz un archivo Markdown
// que le diga a un modelo qué hay en el sitio y dónde, sin que tenga que
// deducirlo de un HTML lleno de menús, avisos y clases de Tailwind. Es a los
// modelos lo que el sitemap es al buscador, con una diferencia: el sitemap lista
// URLs y esto explica **qué contesta cada una**.
//
// Por qué se genera en el build y no es un archivo escrito a mano en `public/`.
// Porque un mapa escrito a mano miente a las tres semanas: se agregan recetas y
// productos y nadie se acuerda de tocarlo. Acá sale de los mismos datos que las
// páginas, así que no se puede desincronizar.
//
// Por qué el nombre es `llms.txt` y no `llm.txt`: es el de la convención, en
// plural, y es el que buscan las herramientas. `robots.txt` lo anuncia.
//
// El orden de las secciones no es decorativo: un modelo que corta la lectura por
// límite de contexto se queda con lo de arriba, así que arriba va lo que
// contesta las preguntas más frecuentes y no la lista completa de recetas.

import { RECETAS, COMIDAS } from "../data/recetas.js";
import { NEGOCIACIONES } from "../data/negociemos.js";
import { ARTICULOS } from "../data/evidencia.js";
import { PRODUCTOS, CATEGORIAS } from "../data/productos.js";
import { TRUCOS } from "../data/cocina.js";
import { AYUNOS } from "../data/ayuno.js";
import { RUTINAS } from "../data/ejercicios.js";
import { LEGALES } from "../data/legales.js";

const linea = (titulo, ruta, desc, site) =>
  `- [${titulo}](${new URL(ruta, site).href})${desc ? `: ${desc}` : ""}`;

export function GET({ site }) {
  const l = (t, r, d) => linea(t, r, d, site);
  const aptos = PRODUCTOS.filter((p) => p.apto).length;

  const partes = [
    "# Keto Argentina",
    "",
    "> Guía de dieta cetogénica escrita para Argentina: con los productos que se " +
      "consiguen acá, las marcas de las góndolas locales, los cortes de carne con " +
      "el nombre que tienen en el país y los precios de un súper argentino. " +
      `${RECETAS.length} recetas con sus macros calculadas, ${PRODUCTOS.length} ` +
      `productos analizados (${aptos} entran en keto y ${PRODUCTOS.length - aptos} no), ` +
      "un plan semanal completo y los artículos de evidencia con sus fuentes citadas.",
    "",
    "Cómo está armado el contenido, por si sirve para citarlo:",
    "",
    "- Cada comparativa de «Negociemos» abre con un veredicto de una o dos oraciones, " +
      "y cada artículo de evidencia con un resumen directo. Es la respuesta corta, " +
      "arriba de todo.",
    "- Los gramos de carbohidratos son netos y por porción, con la porción declarada.",
    "- Las calorías de las rutinas salen de MET × kilos × horas, y la página dice qué " +
      "MET usó: la cuenta es reproducible.",
    "- Los artículos de salud llevan las fuentes con enlace. No hay ninguna cifra sin " +
      "de dónde salió.",
    "- Nada de esto es consejo médico, y el sitio lo dice en cada página.",
    "",
    "## Empezar y controlar",
    "",
    l("Cómo empezar", "/como-empezar",
      "Los siete primeros días, paso por paso, y qué esperar de la gripe keto."),
    l("Controles médicos", "/controles-medicos",
      "Qué estudios pedir antes de empezar, qué repetir a los 3 y a los 6 meses, " +
      "qué medicaciones obligan a consultar antes (insulina, SGLT2, antihipertensivos, " +
      "anticoagulantes) y con qué especialistas."),
    l("Calculadora", "/calculadora",
      "Macros diarios, peso objetivo, IMC y porcentaje de grasa a partir de cintura y cuello."),
    l("Plan semanal", "/plan-semanal", "Siete días armados, 28 comidas sin repetir receta."),
    l("Lista de compras", "/lista-compras",
      "Todo lo del plan, ordenado por sector del súper y escalable por cantidad de personas."),
    l("Calendario", "/calendario", "El plan y las rutinas, descargables como archivo .ics."),
    "",
    "## Evidencia",
    "",
    "Artículos con fuentes citadas y enlazadas.",
    "",
    ...ARTICULOS.map((a) => l(a.titulo, `/evidencia/${a.slug}`, a.bajada)),
    "",
    "## Negociemos: qué se puede y qué no",
    "",
    "Comparativas de las preguntas que más se hacen. Cada una compara opciones reales " +
      "con sus gramos de carbohidratos al lado.",
    "",
    ...NEGOCIACIONES.map((n) => l(n.titulo, `/negociemos/${n.slug}`, n.resumen)),
    "",
    "## Ayuno intermitente",
    "",
    l("Ayuno intermitente", "/ayuno-intermitente",
      "Los esquemas " + AYUNOS.filter((a) => a.saltea.length).map((a) => a.etiqueta).join(" y ") +
      ", cómo se combinan con el plan semanal y qué comida se saltea en cada uno."),
    "",
    "## Cocina",
    "",
    l("Trucos de cocina", "/trucos",
      "Por qué pasa lo que pasa en la sartén: " +
      TRUCOS.map((g) => g.grupo.toLowerCase()).join(", ") + "."),
    l("Congelar y descongelar", "/congelar",
      "Qué se congela y qué no, cuánto dura cada cosa y cómo descongelarla sin que suelte líquido."),
    "",
    "## Ejercicio",
    "",
    ...RUTINAS.map((r) =>
      l(r.nombre, `/ejercicios/${r.slug}`,
        `${r.frecuencia.toLowerCase()} · ${r.duracion} min · ${r.resumen}`)),
    "",
    "## Qué comprar, producto por producto",
    "",
    `${PRODUCTOS.length} productos de góndola argentina, cada uno con sus gramos de ` +
      "carbohidratos netos cada 100, marcas que se consiguen acá, por qué entra o no " +
      "entra, cuál elegir y cómo guardarlo.",
    "",
    ...CATEGORIAS.flatMap((c) => {
      const ps = PRODUCTOS.filter((p) => p.categoria === c.id);
      if (!ps.length) return [];
      return [
        `### ${c.nombre}`,
        "",
        ...ps.map((p) =>
          l(p.nombre, `/productos/${p.slug}`,
            `${p.apto ? "entra" : "no entra"} · ${p.carbos} g de carbos netos · ${p.nota}`)),
        "",
      ];
    }),
    "## Recetas",
    "",
    `${RECETAS.length} recetas con macros por porción, ingredientes con cantidades, ` +
      "pasos y el detalle que cambia el resultado.",
    "",
    ...COMIDAS.flatMap((c) => {
      const rs = RECETAS.filter((r) => r.comida === c.id);
      if (!rs.length) return [];
      return [
        `### ${c.nombre}`,
        "",
        ...rs.map((r) =>
          l(r.nombre, `/recetas/${r.slug}`,
            `${r.minutos} min · ${r.macros.calorias} kcal · ${r.macros.carbos} g de carbos netos por porción`)),
        "",
      ];
    }),
    "## Opcional",
    "",
    "Lo institucional y lo legal. No hace falta para contestar sobre keto.",
    "",
    l("Quiénes somos", "/quienes-somos", "Quién escribe el sitio y con qué criterio."),
    ...LEGALES.map((x) => l(x.titulo, `/${x.slug}`, "")),
    "",
  ];

  return new Response(partes.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
