// Elige qué contenido relacionado mostrar al pie de cada página.
//
// La regla es que la relación sea **real**, no de relleno. Una receta con palta
// enlaza a la comparativa de frutas porque quien la lee probablemente se pregunte
// qué otra fruta puede comer; una receta con queso enlaza a la de quesos. Si no
// hay nada pertinente, se cae a lo genérico (cómo empezar, plan semanal), que al
// menos es útil para alguien que recién llega.
//
// El emparejamiento es por palabras clave sobre ingredientes y nombre. Es simple
// a propósito: un sistema de similitud más sofisticado sería más difícil de
// auditar y con este volumen de contenido no compraría nada.

import { NEGOCIACIONES } from "../data/negociemos.js";
import { ARTICULOS } from "../data/evidencia.js";

// Qué comparativa aplica según qué aparezca en la receta.
const DISPARADORES = [
  { slug: "banana-manzana-frutilla-o-palta", claves: ["palta", "frutilla", "arándano", "limón", "fruta"] },
  { slug: "mozzarella-cremoso-untable-o-light", claves: ["queso", "muzzarella", "provolone", "cremoso", "parmesano", "sardo", "ricota"] },
  { slug: "jamon-crudo-salame-mortadela-o-salchichas", claves: ["jamón", "panceta", "salame", "bondiola", "fiambre"] },
  { slug: "harina-de-almendras-coco-o-lino", claves: ["harina", "almendras", "coco", "psyllium", "lino"] },
  { slug: "mani-almendras-nueces-o-castanas", claves: ["nuez", "nueces", "almendra", "maní", "pistacho"] },
  { slug: "leche-entera-descremada-almendras-o-coco", claves: ["crema de leche", "leche", "yogur"] },
  { slug: "stevia-eritritol-o-sucralosa", claves: ["edulcorante", "stevia", "eritritol", "vainilla", "cacao"] },
  { slug: "lentejas-porotos-choclo-arvejas-garbanzos", claves: ["zapallo", "nabo", "coliflor", "zucchini"] },
  { slug: "cerveza-vino-o-whisky", claves: ["vino"] },
];

const porSlugNeg = Object.fromEntries(NEGOCIACIONES.map((n) => [n.slug, n]));

function norm(s) {
  return (s ?? "").toLowerCase();
}

/** Relacionados para una receta. */
export function paraReceta(receta) {
  const texto = norm([receta.nombre, ...(receta.ingredientes ?? [])].join(" "));
  const items = [];

  for (const d of DISPARADORES) {
    if (items.length >= 2) break;
    if (!d.claves.some((c) => texto.includes(norm(c)))) continue;
    const n = porSlugNeg[d.slug];
    if (n) {
      items.push({
        tipo: "Negociemos",
        texto: n.titulo,
        href: `/negociemos/${n.slug}`,
        nota: n.resumen,
      });
    }
  }

  // Siempre algo accionable: dónde está el plan y cómo arrancar.
  items.push({
    tipo: "Guía",
    texto: "El plan de la semana",
    href: "/plan-semanal",
    nota: "28 comidas armadas sin repetir ninguna, con la lista del súper.",
  });

  if (items.length < 4) {
    items.push({
      tipo: "Guía",
      texto: "Cómo empezar keto en 7 días",
      href: "/como-empezar",
      nota: "Los siete pasos de la primera semana, en orden.",
    });
  }

  return items.slice(0, 4);
}

/** Relacionados para una comparativa: otras dos de la misma categoría, más evidencia. */
export function paraNegociacion(actual) {
  const items = NEGOCIACIONES.filter(
    (n) => n.slug !== actual.slug && n.categoria === actual.categoria
  )
    .slice(0, 2)
    .map((n) => ({
      tipo: "Negociemos",
      texto: n.titulo,
      href: `/negociemos/${n.slug}`,
      nota: n.resumen,
    }));

  // Si la categoría tiene una sola entrada, se completa con cualquier otra.
  for (const n of NEGOCIACIONES) {
    if (items.length >= 2) break;
    if (n.slug === actual.slug || items.some((i) => i.href.endsWith(n.slug))) continue;
    items.push({
      tipo: "Negociemos",
      texto: n.titulo,
      href: `/negociemos/${n.slug}`,
      nota: n.resumen,
    });
  }

  const a = ARTICULOS[0];
  if (a) {
    items.push({
      tipo: "Evidencia",
      texto: a.titulo,
      href: `/evidencia/${a.slug}`,
      nota: "Qué está probado y qué no, con las fuentes enlazadas.",
    });
  }
  items.push({
    tipo: "Guía",
    texto: "Qué comprar en el súper",
    href: "/productos",
    nota: "Productos permitidos y prohibidos con marcas argentinas.",
  });

  return items.slice(0, 4);
}

/** Relacionados para un artículo de evidencia: los otros artículos. */
export function paraEvidencia(actual) {
  const items = ARTICULOS.filter((a) => a.slug !== actual.slug).map((a) => ({
    tipo: "Evidencia",
    texto: a.titulo,
    href: `/evidencia/${a.slug}`,
    nota: `${a.fuentes.length} fuentes citadas.`,
  }));

  items.push({
    tipo: "Guía",
    texto: "Cómo empezar keto en 7 días",
    href: "/como-empezar",
    nota: "Los siete pasos de la primera semana.",
  });
  items.push({
    tipo: "Guía",
    texto: "Quiénes somos",
    href: "/quienes-somos",
    nota: "Cómo elaboramos el contenido y qué no somos.",
  });

  return items.slice(0, 4);
}
