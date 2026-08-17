// Recetas keto con ingredientes de acá.
//
// Cada receta lleva macros por porción y las etiquetas que alimentan los filtros
// ("15min", "economica", "pocos-ingredientes"). Los macros son estimaciones de
// tabla para orientar, no valores de laboratorio.
//
// Regla de contenido: los ingredientes se escriben como se piden en la
// verdulería o la carnicería de acá — "un vacío", "medio morrón", "una palta"—,
// no traducidos del inglés.

export const COMIDAS = [
  { id: "desayuno", nombre: "Desayunos" },
  { id: "almuerzo", nombre: "Almuerzos" },
  { id: "merienda", nombre: "Meriendas" },
  { id: "cena", nombre: "Cenas" },
  { id: "colacion", nombre: "Colaciones" },
];

export const ETIQUETAS = [
  { id: "15min", nombre: "En 15 minutos" },
  { id: "economica", nombre: "Económica" },
  { id: "pocos-ingredientes", nombre: "Pocos ingredientes" },
];

export const RECETAS = [
  {
    slug: "huevos-revueltos-con-palta",
    nombre: "Huevos revueltos con palta",
    comida: "desayuno",
    etiquetas: ["15min", "economica", "pocos-ingredientes"],
    minutos: 8,
    porciones: 1,
    macros: { grasas: 38, proteinas: 16, carbos: 3, calorias: 430 },
    ingredientes: [
      "3 huevos",
      "1 cucharada de manteca",
      "½ palta",
      "Sal y pimienta",
    ],
    pasos: [
      "Derretí la manteca en una sartén a fuego bajo. Bajo de verdad: el huevo revuelto se arruina con fuego fuerte.",
      "Batí los huevos con una pizca de sal y volcalos.",
      "Revolvé despacio con espátula. Sacalos del fuego cuando todavía se ven un poco húmedos: terminan de cuajar solos.",
      "Serví con la palta en gajos al lado y pimienta por encima.",
    ],
    tip: "Si te quedan secos, es que los dejaste de más. El huevo sigue cocinándose fuera del fuego.",
  },
  {
    slug: "tortilla-de-acelga-y-queso",
    nombre: "Tortilla de acelga y queso",
    comida: "cena",
    etiquetas: ["economica", "pocos-ingredientes"],
    minutos: 25,
    porciones: 2,
    macros: { grasas: 29, proteinas: 21, carbos: 4, calorias: 370 },
    ingredientes: [
      "1 atado de acelga",
      "5 huevos",
      "100 g de queso cremoso en cubos",
      "2 cucharadas de aceite de oliva",
      "Sal, pimienta y nuez moscada",
    ],
    pasos: [
      "Herví la acelga 5 minutos, escurrila y —esto es lo importante— apretala fuerte para sacarle el agua.",
      "Picala y mezclala con los huevos batidos, el queso, sal, pimienta y nuez moscada.",
      "Calentá el aceite en una sartén mediana y volcá la mezcla.",
      "Cociná a fuego bajo 10 minutos, tapada. Dala vuelta con la ayuda de un plato y 5 minutos más.",
    ],
    tip: "Si no le sacás el agua a la acelga, la tortilla queda aguada y no cuaja. Es el error clásico.",
  },
  {
    slug: "vacio-al-horno-con-chimichurri",
    nombre: "Vacío al horno con chimichurri",
    comida: "almuerzo",
    etiquetas: ["pocos-ingredientes"],
    minutos: 90,
    porciones: 4,
    macros: { grasas: 41, proteinas: 44, carbos: 1, calorias: 550 },
    ingredientes: [
      "1 kg de vacío",
      "Sal gruesa",
      "Para el chimichurri: 1 taza de perejil, 4 dientes de ajo, 1 cucharada de orégano, ½ taza de aceite de oliva, 2 cucharadas de vinagre, ají molido",
    ],
    pasos: [
      "Sacá la carne de la heladera 40 minutos antes. Fría por dentro se cocina desparejo.",
      "Salá con sal gruesa de los dos lados y ponela en asadera con la grasa hacia arriba.",
      "Horno a 180 °C, 70 a 80 minutos. La grasa de arriba se derrite y le va cayendo encima.",
      "Mientras, picá todo el chimichurri y dejalo reposar en el aceite y el vinagre al menos media hora.",
      "Sacá la carne y dejala descansar 10 minutos antes de cortar, o pierde todo el jugo en la tabla.",
    ],
    tip: "El chimichurri mejora de un día para el otro. Hacé el doble y guardalo en frasco.",
  },
  {
    slug: "fideos-de-zucchini-con-crema-y-panceta",
    nombre: "Fideos de zucchini con crema y panceta",
    comida: "cena",
    etiquetas: ["15min", "pocos-ingredientes"],
    minutos: 15,
    porciones: 2,
    macros: { grasas: 44, proteinas: 14, carbos: 6, calorias: 480 },
    ingredientes: [
      "2 zucchinis grandes",
      "150 g de panceta en tiras",
      "200 cc de crema de leche",
      "50 g de queso rallado",
      "Sal y pimienta negra",
    ],
    pasos: [
      "Cortá los zucchinis en tiras finas con pelapapas o espiralizador. Salalos y dejalos 10 minutos en un colador.",
      "Dorá la panceta en sartén sin aceite: suelta su propia grasa.",
      "Sumá la crema, bajá el fuego y dejá reducir 3 minutos.",
      "Escurrí bien los zucchinis, tiralos a la sartén y salteá 2 minutos. No más, o se deshacen.",
      "Fuera del fuego, el queso rallado y mucha pimienta.",
    ],
    tip: "El paso de la sal y el colador es el que hace la diferencia entre fideos de zucchini y sopa de zucchini.",
  },
  {
    slug: "pan-keto-de-taza",
    nombre: "Pan keto de taza (2 minutos)",
    comida: "merienda",
    etiquetas: ["15min", "pocos-ingredientes"],
    minutos: 3,
    porciones: 1,
    macros: { grasas: 22, proteinas: 10, carbos: 3, calorias: 260 },
    ingredientes: [
      "3 cucharadas de harina de almendras",
      "1 huevo",
      "1 cucharada de manteca derretida",
      "½ cucharadita de polvo de hornear",
      "1 pizca de sal",
    ],
    pasos: [
      "Mezclá todo en una taza ancha con un tenedor hasta que no queden grumos.",
      "Microondas a máxima potencia, 90 segundos.",
      "Desmoldá y cortá al medio. Si lo pasás por la tostadora queda bastante mejor.",
    ],
    tip: "Resuelve el antojo de pan en tres minutos. Es la receta que más evita que abandones.",
  },
  {
    slug: "milanesas-de-pollo-con-almendras",
    nombre: "Milanesas de pollo rebozadas en almendras",
    comida: "almuerzo",
    etiquetas: ["economica"],
    minutos: 30,
    porciones: 3,
    macros: { grasas: 32, proteinas: 38, carbos: 4, calorias: 460 },
    ingredientes: [
      "600 g de pechuga de pollo en milanesas",
      "1 taza de harina de almendras",
      "½ taza de queso rallado",
      "2 huevos",
      "Ajo, perejil, sal y pimienta",
      "Grasa o manteca para freír",
    ],
    pasos: [
      "Mezclá la harina de almendras con el queso rallado, el ajo y el perejil picados.",
      "Batí los huevos con sal y pimienta.",
      "Pasá cada milanesa por huevo y después por la mezcla seca, apretando bien.",
      "Freí en grasa caliente 3 minutos por lado, o al horno a 200 °C unos 20 minutos.",
    ],
    tip: "La almendra se quema más rápido que el pan rallado: fuego medio, no fuerte.",
  },
  {
    slug: "ensalada-de-atun-y-huevo",
    nombre: "Ensalada de atún y huevo",
    comida: "almuerzo",
    etiquetas: ["15min", "economica", "pocos-ingredientes"],
    minutos: 12,
    porciones: 1,
    macros: { grasas: 30, proteinas: 32, carbos: 4, calorias: 420 },
    ingredientes: [
      "1 lata de atún al natural",
      "2 huevos duros",
      "Un puñado de rúcula o lechuga",
      "½ palta",
      "Aceite de oliva, sal y limón",
    ],
    pasos: [
      "Herví los huevos 10 minutos y pasalos por agua fría para poder pelarlos sin pelearte.",
      "Escurrí el atún y mezclalo con las hojas.",
      "Sumá los huevos en mitades y la palta en cubos.",
      "Aliñá con bastante aceite de oliva, sal y unas gotas de limón.",
    ],
    tip: "La comida keto de oficina: se arma en la mesada, viaja en tupper y no necesita microondas.",
  },
  {
    slug: "flan-de-coco-sin-azucar",
    nombre: "Flan de coco sin azúcar",
    comida: "colacion",
    etiquetas: ["pocos-ingredientes"],
    minutos: 40,
    porciones: 4,
    macros: { grasas: 26, proteinas: 7, carbos: 4, calorias: 280 },
    ingredientes: [
      "400 cc de leche de coco",
      "3 huevos",
      "Edulcorante a gusto (stevia o eritritol)",
      "Esencia de vainilla",
    ],
    pasos: [
      "Batí los huevos con el edulcorante y la vainilla.",
      "Sumá la leche de coco de a poco, sin dejar de batir.",
      "Volcá en moldes individuales y cocinalos a baño María, horno a 170 °C, 35 minutos.",
      "Enfriá al menos 3 horas en la heladera antes de desmoldar.",
    ],
    tip: "Sin el baño María el flan se corta y queda con textura de huevo revuelto dulce.",
  },
];

export const PLAN_SEMANAL = [
  { dia: "Lunes",     desayuno: "huevos-revueltos-con-palta", almuerzo: "ensalada-de-atun-y-huevo", merienda: "pan-keto-de-taza", cena: "tortilla-de-acelga-y-queso" },
  { dia: "Martes",    desayuno: "huevos-revueltos-con-palta", almuerzo: "milanesas-de-pollo-con-almendras", merienda: "pan-keto-de-taza", cena: "fideos-de-zucchini-con-crema-y-panceta" },
  { dia: "Miércoles", desayuno: "pan-keto-de-taza", almuerzo: "vacio-al-horno-con-chimichurri", merienda: "flan-de-coco-sin-azucar", cena: "tortilla-de-acelga-y-queso" },
  { dia: "Jueves",    desayuno: "huevos-revueltos-con-palta", almuerzo: "vacio-al-horno-con-chimichurri", merienda: "pan-keto-de-taza", cena: "ensalada-de-atun-y-huevo" },
  { dia: "Viernes",   desayuno: "huevos-revueltos-con-palta", almuerzo: "milanesas-de-pollo-con-almendras", merienda: "flan-de-coco-sin-azucar", cena: "fideos-de-zucchini-con-crema-y-panceta" },
  { dia: "Sábado",    desayuno: "pan-keto-de-taza", almuerzo: "vacio-al-horno-con-chimichurri", merienda: "flan-de-coco-sin-azucar", cena: "tortilla-de-acelga-y-queso" },
  { dia: "Domingo",   desayuno: "huevos-revueltos-con-palta", almuerzo: "vacio-al-horno-con-chimichurri", merienda: "pan-keto-de-taza", cena: "ensalada-de-atun-y-huevo" },
];

// Lista de compras de la semana, agrupada como se recorre el súper.
export const LISTA_COMPRAS = [
  { sector: "Carnicería", items: ["1 kg de vacío", "600 g de pechuga de pollo", "150 g de panceta en tiras", "Grasa vacuna"] },
  { sector: "Verdulería", items: ["3 paltas", "1 atado de acelga", "2 zucchinis", "Rúcula o lechuga", "1 cabeza de ajo", "Perejil", "1 limón"] },
  { sector: "Lácteos", items: ["2 docenas de huevos", "Manteca", "300 g de queso cremoso", "200 cc de crema de leche", "Queso rallado"] },
  { sector: "Almacén", items: ["2 latas de atún al natural", "Aceite de oliva", "Vinagre", "Orégano y ají molido", "Sal gruesa"] },
  { sector: "Dietética", items: ["500 g de harina de almendras", "Leche de coco", "Polvo de hornear", "Edulcorante (stevia o eritritol)", "Esencia de vainilla"] },
];
