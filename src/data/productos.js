// Guía de productos keto conseguibles en Argentina.
//
// El criterio para incluir algo es que se consiga de verdad: cadena grande (Coto,
// Carrefour, Día, Jumbo), dietética de barrio o carnicería. Nada de importados de
// tienda online, que es donde se cae la mayoría de las guías traducidas del inglés.
//
// `carbos` son gramos de carbohidratos NETOS por 100 g salvo que se aclare otra
// unidad en `porcion`. Son valores de referencia de tabla, no de laboratorio:
// sirven para decidir en la góndola, no para un plan clínico.

export const CATEGORIAS = [
  { id: "lacteos", nombre: "Lácteos y quesos", emoji: "🧀" },
  { id: "grasas", nombre: "Grasas y aceites", emoji: "🫒" },
  { id: "proteinas", nombre: "Carnes y proteínas", emoji: "🥩" },
  { id: "harinas", nombre: "Harinas y sustitutos", emoji: "🌰" },
  { id: "verduras", nombre: "Verduras y frutas", emoji: "🥬" },
  { id: "bebidas", nombre: "Bebidas", emoji: "☕" },
];

export const PRODUCTOS = [
  // ── Lácteos ───────────────────────────────────────────────────────────────
  {
    slug: "queso-cremoso", categoria: "lacteos", nombre: "Queso cremoso", apto: true, carbos: 2,
    marcas: "La Serenísima, Ilolay, Tregar, marca propia de Coto y Día",
    nota: "El de todos los días. Barato y en cualquier kiosco.",
  },
  {
    slug: "queso-untable", categoria: "lacteos", nombre: "Queso Finlandia / untable", apto: true, carbos: 3,
    marcas: "Finlandia, Casancrem, Mendicrim",
    nota: "Ojo con las versiones «light»: le sacan grasa y le suben los carbos.",
  },
  {
    slug: "quesos-duros", categoria: "lacteos", nombre: "Quesos duros (sardo, reggianito, provolone)", apto: true, carbos: 1,
    marcas: "Ilolay, Verónica, Punta del Agua",
    nota: "De los más seguros: casi cero carbos y mucho sabor por poco volumen.",
  },
  {
    slug: "crema-de-leche", categoria: "lacteos", nombre: "Crema de leche", apto: true, carbos: 3,
    marcas: "La Serenísima, Ilolay",
    nota: "La de repostería (más grasa) rinde mejor que la «light».",
  },
  {
    slug: "manteca", categoria: "lacteos", nombre: "Manteca", apto: true, carbos: 0.6,
    marcas: "La Serenísima, Sancor",
    nota: "Manteca, no margarina. La margarina trae aceites vegetales procesados.",
  },
  {
    slug: "leche-entera", categoria: "lacteos", nombre: "Leche entera", apto: false, carbos: 4.7,
    nota: "4,7 g cada 100 ml se van sumando rápido. Para el café va crema, o leche de almendras sin azúcar.",
  },
  {
    slug: "yogur-saborizado", categoria: "lacteos", nombre: "Yogur bebible y saborizado", apto: false, carbos: 12,
    nota: "Azúcar agregada casi siempre. El yogur natural entero sin azúcar sí entra, con moderación.",
  },
  {
    slug: "dulce-de-leche", categoria: "lacteos", nombre: "Dulce de leche", apto: false, carbos: 55,
    nota: "No hay versión keto que valga la pena en góndola. Si lo extrañás, va casero con edulcorante.",
  },

  // ── Grasas ────────────────────────────────────────────────────────────────
  {
    slug: "aceite-de-oliva", categoria: "grasas", nombre: "Aceite de oliva", apto: true, carbos: 0,
    marcas: "Nucete, Familia Zuccardi, marca propia de Carrefour",
    nota: "Virgen extra para crudo. Para freír conviene grasa o manteca, que aguantan más calor.",
  },
  {
    slug: "palta", categoria: "grasas", nombre: "Palta", apto: true, carbos: 2,
    nota: "La fruta keto por excelencia. En verdulería sale bastante menos que en el súper.",
  },
  {
    slug: "grasa-vacuna", categoria: "grasas", nombre: "Grasa vacuna / de cerdo", apto: true, carbos: 0,
    nota: "La pedís en la carnicería y sale monedas. Ideal para freír y para el asado.",
  },
  {
    slug: "aceitunas", categoria: "grasas", nombre: "Aceitunas", apto: true, carbos: 3,
    marcas: "Nucete, Alco",
    nota: "Verdes o negras, en salmuera. Colación perfecta para llevar.",
  },
  {
    slug: "aceite-de-girasol", categoria: "grasas", nombre: "Aceite de girasol / maíz", apto: false, carbos: 0,
    nota: "No tiene carbos, pero es aceite de semillas muy procesado. Se puede, no conviene.",
  },

  // ── Proteínas ─────────────────────────────────────────────────────────────
  {
    slug: "cortes-vacunos", categoria: "proteinas", nombre: "Cortes vacunos (vacío, entraña, asado, roast beef, peceto)", apto: true, carbos: 0,
    nota: "Todos entran. El vacío y la entraña tienen más grasa, que en keto juega a favor.",
  },
  {
    slug: "pollo-con-piel", categoria: "proteinas", nombre: "Pollo con piel", apto: true, carbos: 0,
    nota: "Con piel, no sin. Muslo y pata rinden más que la pechuga y son más baratos.",
  },
  {
    slug: "cerdo", categoria: "proteinas", nombre: "Cerdo (bondiola, matambrito, panceta)", apto: true, carbos: 0,
    nota: "La panceta sin azúcar agregada: leé la etiqueta, muchas la traen.",
  },
  {
    slug: "huevos", categoria: "proteinas", nombre: "Huevos", apto: true, carbos: 0.6,
    nota: "El pilar del desayuno keto argentino. Baratos y resuelven cualquier comida.",
  },
  {
    slug: "pescado", categoria: "proteinas", nombre: "Pescado (merluza, salmón, atún en lata)", apto: true, carbos: 0,
    nota: "El atún al natural o en aceite de oliva, no en aceite de girasol.",
  },
  {
    slug: "milanesas-rebozadas", categoria: "proteinas", nombre: "Milanesas rebozadas", apto: false, carbos: 15,
    nota: "El rebozado es harina. La carne sí: hacelas con harina de almendras o queso rallado.",
  },
  {
    slug: "fiambres-con-almidon", categoria: "proteinas", nombre: "Fiambres con almidón (mortadela, salchichas)", apto: false, carbos: 5,
    nota: "Suelen traer almidón y azúcar. El jamón crudo y el salame puro sí entran.",
  },

  // ── Harinas y sustitutos ──────────────────────────────────────────────────
  {
    slug: "harina-de-almendras", categoria: "harinas", nombre: "Harina de almendras", apto: true, carbos: 7,
    marcas: "Dietéticas de barrio, Nuez del Sol; también molés almendras en procesadora",
    nota: "Cara en el súper, bastante menos en dietética a granel.",
  },
  {
    slug: "harina-de-coco", categoria: "harinas", nombre: "Harina de coco", apto: true, carbos: 8,
    nota: "Absorbe muchísimo líquido: se usa un tercio de lo que pide una receta con harina común.",
  },
  {
    slug: "psyllium", categoria: "harinas", nombre: "Psyllium", apto: true, carbos: 2,
    nota: "El secreto del pan keto que no se desarma. En dietéticas, muy barato.",
  },
  {
    slug: "chia-y-lino", categoria: "harinas", nombre: "Semillas de chía y lino", apto: true, carbos: 2,
    nota: "Fibra y saciedad. La chía en agua reemplaza al huevo en algunas recetas.",
  },
  {
    slug: "harinas-de-cereal", categoria: "harinas", nombre: "Harina de trigo, avena, pan, fideos, arroz", apto: false, carbos: 70,
    nota: "El corazón de lo que hay que dejar. No hay versión keto de la harina común.",
  },

  // ── Verduras ──────────────────────────────────────────────────────────────
  {
    slug: "verduras-de-hoja", categoria: "verduras", nombre: "Verduras de hoja (lechuga, espinaca, acelga, rúcula)", apto: true, carbos: 2,
    nota: "Libres. Son el volumen del plato cuando el resto es grasa y proteína.",
  },
  {
    slug: "verduras-de-volumen", categoria: "verduras", nombre: "Zucchini, berenjena, brócoli, coliflor", apto: true, carbos: 3,
    nota: "El coliflor reemplaza al arroz y al puré. El zucchini, a los fideos.",
  },
  {
    slug: "tomate", categoria: "verduras", nombre: "Tomate", apto: true, carbos: 3,
    nota: "Entra, pero no en cantidad. Media unidad por comida.",
  },
  {
    slug: "frutos-rojos", categoria: "verduras", nombre: "Frutos rojos (frutilla, arándano)", apto: true, carbos: 6,
    nota: "La única fruta que entra cómoda, y en porción chica.",
  },
  {
    slug: "papa-y-feculentas", categoria: "verduras", nombre: "Papa, batata, choclo, mandioca", apto: false, carbos: 17,
    nota: "Los cuatro se van del presupuesto de carbos en una porción.",
  },
  {
    slug: "frutas-dulces", categoria: "verduras", nombre: "Banana, uva, mango", apto: false, carbos: 20,
    nota: "Fruta muy dulce. La banana sola puede ser tu día entero de carbos.",
  },

  // ── Bebidas ───────────────────────────────────────────────────────────────
  {
    slug: "mate-y-te", categoria: "bebidas", nombre: "Mate y té sin azúcar", apto: true, carbos: 0,
    nota: "El mate amargo es keto puro. Con azúcar, no.",
  },
  {
    slug: "cafe", categoria: "bebidas", nombre: "Café", apto: true, carbos: 0,
    nota: "Solo, o con crema. Con leche suma carbos.",
  },
  {
    slug: "gaseosas-zero", categoria: "bebidas", nombre: "Gaseosas zero / sin azúcar", apto: true, carbos: 0,
    marcas: "Coca Zero, Paso de los Toros sin azúcar, Sprite Zero",
    nota: "Cero carbos. Sirven para el antojo dulce sin romper la dieta.",
  },
  {
    slug: "agua", categoria: "bebidas", nombre: "Agua con y sin gas", apto: true, carbos: 0,
    nota: "En keto se pierde más agua y sal: tomá más de lo que tomabas antes.",
  },
  {
    slug: "cerveza", categoria: "bebidas", nombre: "Cerveza", apto: false, carbos: 12,
    nota: "Pura maltosa. Si tomás alcohol, el vino seco o los destilados sin mezclar son menos malos.",
  },
  {
    slug: "jugos", categoria: "bebidas", nombre: "Jugos y aguas saborizadas comunes", apto: false, carbos: 11,
    nota: "Aun los «naturales» son azúcar líquida. Las saborizadas zero sí entran.",
  },
];
