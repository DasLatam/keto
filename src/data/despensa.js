// La góndola: de qué está hecho cada ingrediente de una receta.
//
// **Por qué existe.** Hasta el 2026-08-19 la lista del súper era una tabla
// escrita a mano con las cantidades de las 28 comidas de la única semana que
// había. Funcionaba, y tenía escrito arriba su propia sentencia de muerte: «si
// se cambia el plan semanal, hay que rehacerlo». Con cuatro semanas y 112
// comidas, rehacerlo a mano cuatro veces era garantizar que la lista y el plan
// se desincronizaran en la primera corrección.
//
// Así que ahora la lista **se deriva de las recetas**. Este archivo es lo único
// que hace falta para lograrlo: qué se compra realmente cuando una receta pide
// «1 cucharada de manteca». La cuenta la hace `src/lib/compras.js`.
//
// **Cómo está armado.** Dos piezas y nada más:
//
//   · `ARTICULOS` — lo que se pone en el changuito. Tiene sector (o sea, en qué
//     parte del súper está), unidad de compra y las conversiones que sólo valen
//     para él: una taza de harina de almendras son 100 g y una taza de aceite
//     son 240 cc, y no hay forma de saberlo sin mirar de qué taza se habla.
//
//   · `REGLAS` — de texto de receta a artículo. Se prueban **en orden** y gana
//     la primera: por eso «queso de cabra» va antes que «queso», y «aceite de
//     coco» antes que «aceite». Cambiar el orden cambia el resultado.
//
// **La regla editorial que sostiene todo esto:** la lista compra la receta
// entera, no la porción. Si la tortilla rinde tres y la comés vos solo, igual se
// compran los seis huevos: lo que sobra es el almuerzo del día siguiente o va al
// freezer, que es exactamente lo que la página de congelar recomienda hacer.
//
// Un ingrediente que no matchee ninguna regla **no se descarta en silencio**:
// `scripts/verificar.mjs` falla. Es la diferencia entre una lista incompleta y
// una lista rota, y sólo se nota en el súper.

// ── Conversiones generales ──────────────────────────────────────────────────
//
// Las de cocina de toda la vida. Las que dependen del ingrediente (una taza de
// harina no pesa lo que una taza de agua) viven en cada artículo.
export const CUCHARADA = 15; // g o cc
export const CUCHARADITA = 5;
export const TAZA = 240; // cc, para líquidos
export const PUÑADO = 30; // g
export const CHORRO = 30; // cc
export const FETA = 20; // g de fiambre
export const TIRA_PANCETA = 25; // g

const CARNICERIA = "Carnicería y pescadería";
const VERDULERIA = "Verdulería";
const LACTEOS = "Lácteos y fiambrería";
const ALMACEN = "Almacén";
const FIJA = "Condimentos y despensa fija";

/**
 * Lo que se compra.
 *
 * - `unidad` es la unidad de compra, la que va a leerse en la lista.
 * - `nombre` es cómo se llama en el súper. Si falta, la unidad **es** la cosa:
 *   «4 paltas», no «4 unidades de palta».
 * - `escala: false` marca lo que no se multiplica por la cantidad de personas.
 *   Una botella de aceite rinde varias semanas para una casa entera.
 * - `porTaza`, `porUnidad`, `porCucharada` son conversiones propias del
 *   artículo, en su unidad de compra.
 */
export const ARTICULOS = {
  // ── Carnicería y pescadería ───────────────────────────────────────────
  vacio: { sector: CARNICERIA, nombre: "vacío", unidad: "g" },
  pechuga: { sector: CARNICERIA, nombre: "pechuga de pollo", unidad: "g", porUnidad: 300 },
  muslos: { sector: CARNICERIA, nombre: "pollo", unidad: "muslo" },
  muslos_sin_hueso: { sector: CARNICERIA, nombre: "muslo de pollo sin hueso", unidad: "g" },
  matambrito: { sector: CARNICERIA, nombre: "matambrito de cerdo", unidad: "g" },
  picada: { sector: CARNICERIA, nombre: "carne picada", unidad: "g" },
  lomo: { sector: CARNICERIA, nombre: "lomo", unidad: "medallón" },
  cuero_cerdo: { sector: CARNICERIA, nombre: "cuero de cerdo", unidad: "g" },
  merluza: { sector: CARNICERIA, nombre: "merluza", unidad: "filete" },
  salmon: { sector: CARNICERIA, nombre: "salmón", unidad: "medallón" },
  panceta: { sector: CARNICERIA, nombre: "panceta", unidad: "g", porUnidad: TIRA_PANCETA },
  jamon_cocido: { sector: CARNICERIA, nombre: "jamón cocido", unidad: "g", porUnidad: FETA },
  jamon_crudo: { sector: CARNICERIA, nombre: "jamón crudo", unidad: "g", porUnidad: FETA },

  // ── Verdulería ────────────────────────────────────────────────────────
  palta: { sector: VERDULERIA, unidad: "palta" },
  acelga: { sector: VERDULERIA, nombre: "acelga", unidad: "atado" },
  espinaca: { sector: VERDULERIA, nombre: "espinaca", unidad: "atado" },
  rucula: { sector: VERDULERIA, nombre: "rúcula", unidad: "paquete", porUnidad: 0.5 },
  repollo: { sector: VERDULERIA, unidad: "repollo blanco" },
  zucchini: { sector: VERDULERIA, unidad: "zucchini" },
  berenjena: { sector: VERDULERIA, unidad: "berenjena" },
  zapallito: { sector: VERDULERIA, unidad: "zapallito redondo" },
  zapallo: { sector: VERDULERIA, nombre: "zapallo anco", unidad: "g" },
  brocoli: { sector: VERDULERIA, unidad: "brócoli" },
  coliflor: { sector: VERDULERIA, unidad: "coliflor" },
  nabo: { sector: VERDULERIA, unidad: "nabo" },
  champinones: { sector: VERDULERIA, nombre: "champiñones", unidad: "g" },
  verdeo: { sector: VERDULERIA, nombre: "cebolla de verdeo", unidad: "atado" },
  puerro: { sector: VERDULERIA, unidad: "puerro" },
  cebolla: { sector: VERDULERIA, unidad: "cebolla" },
  cebolla_morada: { sector: VERDULERIA, unidad: "cebolla morada" },
  morron: { sector: VERDULERIA, unidad: "morrón rojo" },
  morron_verde: { sector: VERDULERIA, unidad: "morrón verde" },
  tomate: { sector: VERDULERIA, unidad: "tomate" },
  zanahoria: { sector: VERDULERIA, unidad: "zanahoria" },
  limon: { sector: VERDULERIA, unidad: "limón" },
  frutillas: { sector: VERDULERIA, nombre: "frutillas", unidad: "caja", porUnidad: 1 / 12 },
  arandanos: { sector: VERDULERIA, nombre: "arándanos", unidad: "caja" },
  // La cabeza de ajo trae unos diez dientes: pedir una cabeza por diente sería
  // llegar a casa con medio kilo de ajo.
  ajo: { sector: VERDULERIA, nombre: "ajo", unidad: "cabeza", porUnidad: 0.1 },
  perejil: { sector: VERDULERIA, nombre: "perejil", unidad: "atado", porTaza: 1, porCucharada: 0.15, porUnidad: 0.25 },
  albahaca: { sector: VERDULERIA, nombre: "albahaca fresca", unidad: "paquete", porUnidad: 1 },
  eneldo: { sector: VERDULERIA, nombre: "eneldo fresco", unidad: "paquete", escala: false },
  jengibre: { sector: VERDULERIA, nombre: "jengibre", unidad: "trozo", escala: false },

  // ── Lácteos y fiambrería ──────────────────────────────────────────────
  // Los huevos se compran por docena y son, de lejos, lo que más se usa: el
  // plan de un mes pasa las diez docenas.
  huevos: { sector: LACTEOS, nombre: "huevos", unidad: "docena", porUnidad: 1 / 12 },
  manteca: { sector: LACTEOS, nombre: "manteca", unidad: "g" },
  queso_cremoso: { sector: LACTEOS, nombre: "queso cremoso", unidad: "g" },
  queso_crema: { sector: LACTEOS, nombre: "queso crema", unidad: "g" },
  muzzarella: { sector: LACTEOS, nombre: "muzzarella", unidad: "g", porUnidad: 200 },
  provolone: { sector: LACTEOS, nombre: "provolone", unidad: "g", porUnidad: 200 },
  queso_cabra: { sector: LACTEOS, nombre: "queso de cabra", unidad: "g" },
  queso_sardo: { sector: LACTEOS, nombre: "queso sardo", unidad: "g" },
  queso_parmesano: { sector: LACTEOS, nombre: "queso parmesano", unidad: "g" },
  queso_rallado: { sector: LACTEOS, nombre: "queso rallado", unidad: "g", porTaza: 90 },
  crema: { sector: LACTEOS, nombre: "crema de leche", unidad: "cc" },
  yogur: { sector: LACTEOS, nombre: "yogur natural entero", unidad: "pote", porGramo: 1 / 150 },

  // ── Almacén ───────────────────────────────────────────────────────────
  atun: { sector: ALMACEN, nombre: "atún al natural", unidad: "lata" },
  harina_almendras: { sector: ALMACEN, nombre: "harina de almendras", unidad: "g", porTaza: 100 },
  almendras: { sector: ALMACEN, nombre: "almendras", unidad: "g" },
  nueces: { sector: ALMACEN, nombre: "nueces", unidad: "g" },
  aceitunas: { sector: ALMACEN, nombre: "aceitunas verdes", unidad: "g", porUnidad: PUÑADO },
  leche_coco: { sector: ALMACEN, nombre: "leche de coco", unidad: "cc" },
  salsa_tomate: { sector: ALMACEN, nombre: "salsa de tomate sin azúcar", unidad: "g", porUnidad: 400 },
  gelatina: { sector: ALMACEN, nombre: "gelatina sin sabor", unidad: "sobre", porGramo: 1 / 7 },
  cacao: { sector: ALMACEN, nombre: "cacao amargo", unidad: "paquete", escala: false },
  chia: { sector: ALMACEN, nombre: "semillas de chía", unidad: "paquete", escala: false },
  aceite_oliva: { sector: ALMACEN, nombre: "aceite de oliva", unidad: "botella", escala: false },
  aceite_coco: { sector: ALMACEN, nombre: "aceite de coco", unidad: "pote", escala: false },
  vinagre: { sector: ALMACEN, nombre: "vinagre", unidad: "botella", escala: false },
  vino_blanco: { sector: ALMACEN, nombre: "vino blanco seco", unidad: "botella", escala: false },
  caldo: { sector: ALMACEN, nombre: "caldo de verdura", unidad: "paquete", escala: false },
  edulcorante: { sector: ALMACEN, nombre: "edulcorante", unidad: "paquete", escala: false },
  polvo_hornear: { sector: ALMACEN, nombre: "polvo de hornear", unidad: "paquete", escala: false },
  vainilla: { sector: ALMACEN, nombre: "esencia de vainilla", unidad: "frasco", escala: false },

  // ── Condimentos ───────────────────────────────────────────────────────
  // Van sin cantidad a propósito: nadie compra «3,5 g de orégano». Es la lista
  // de lo que tiene que haber en la alacena para que el mes entre.
  sal: { sector: FIJA, nombre: "Sal fina y sal gruesa" },
  pimienta: { sector: FIJA, nombre: "Pimienta negra" },
  oregano: { sector: FIJA, nombre: "Orégano" },
  pimenton: { sector: FIJA, nombre: "Pimentón dulce y ahumado" },
  comino: { sector: FIJA, nombre: "Comino" },
  curry: { sector: FIJA, nombre: "Curry" },
  aji_molido: { sector: FIJA, nombre: "Ají molido" },
  nuez_moscada: { sector: FIJA, nombre: "Nuez moscada" },
  tomillo: { sector: FIJA, nombre: "Tomillo" },
  ajo_polvo: { sector: FIJA, nombre: "Ajo en polvo" },
};

/**
 * De texto de receta a artículo. **El orden manda**: gana la primera que matchea.
 *
 * Las expresiones se prueban contra el texto en minúsculas y sin la cantidad, así
 * que «60 g de queso de cabra (o cremoso)» llega acá como «queso de cabra (o
 * cremoso)». Cuando una receta ofrece alternativa —«sardo o parmesano»— la lista
 * compra la primera: es una lista, no un menú de opciones.
 */
export const REGLAS = [
  // ── Lo que se ignora ──────────────────────────────────────────────────
  // Agua y hielo no se compran. «Para servir (opcional)» tampoco: la lista es
  // de lo que hace falta para que la receta salga.
  [/^(agua|hielo)$/, null],
  [/^crema para servir/, null],
  [/^(frutillas|queso rallado) para servir/, null],

  // ── Carnicería ────────────────────────────────────────────────────────
  [/vacío/, "vacio"],
  [/pechugas? (enteras?|en cubos|en milanesas)|^pechugas?$/, "pechuga"],
  [/muslos? de pollo sin hueso/, "muslos_sin_hueso"],
  [/muslos? de pollo/, "muslos"],
  [/matambrito/, "matambrito"],
  [/carne picada/, "picada"],
  [/lomo/, "lomo"],
  [/cuero de cerdo/, "cuero_cerdo"],
  [/merluza/, "merluza"],
  [/salmón/, "salmon"],
  [/panceta/, "panceta"],
  [/jamón cocido/, "jamon_cocido"],
  [/jamón crudo/, "jamon_crudo"],

  // ── Verdulería ────────────────────────────────────────────────────────
  [/palta/, "palta"],
  [/acelga/, "acelga"],
  [/espinaca/, "espinaca"],
  [/rúcula/, "rucula"],
  [/repollo/, "repollo"],
  [/zucchini/, "zucchini"],
  [/berenjena/, "berenjena"],
  [/zapallitos? redondos?|^zapallitos?$/, "zapallito"],
  [/zapallo/, "zapallo"],
  [/brócoli/, "brocoli"],
  [/coliflor/, "coliflor"],
  [/nabo/, "nabo"],
  [/champiñones/, "champinones"],
  [/cebolla de verdeo/, "verdeo"],
  [/puerro/, "puerro"],
  [/cebolla morada/, "cebolla_morada"],
  [/cebolla/, "cebolla"],
  [/morrón verde/, "morron_verde"],
  [/morrón/, "morron"],
  [/tomates?$/, "tomate"],
  [/zanahoria/, "zanahoria"],
  [/limón|limones/, "limon"],
  [/frutillas?/, "frutillas"],
  [/arándanos/, "arandanos"],
  [/ajo en polvo/, "ajo_polvo"],
  [/ajo/, "ajo"],
  [/perejil/, "perejil"],
  [/albahaca/, "albahaca"],
  [/eneldo/, "eneldo"],
  [/jengibre/, "jengibre"],

  // ── Lácteos ───────────────────────────────────────────────────────────
  [/huevos? duros?|huevos?/, "huevos"],
  [/manteca/, "manteca"],
  [/queso crema/, "queso_crema"],
  [/queso cremoso/, "queso_cremoso"],
  [/muzzarella/, "muzzarella"],
  [/queso de cabra/, "queso_cabra"],
  [/queso sardo/, "queso_sardo"],
  [/queso parmesano|parmesano/, "queso_parmesano"],
  [/provoleta|provolone/, "provolone"],
  [/queso rallado/, "queso_rallado"],
  [/crema de leche|^crema$/, "crema"],
  [/yogur/, "yogur"],

  // ── Almacén ───────────────────────────────────────────────────────────
  [/atún/, "atun"],
  [/harina de almendras/, "harina_almendras"],
  [/almendras/, "almendras"],
  [/nueces/, "nueces"],
  [/aceitunas/, "aceitunas"],
  [/leche de coco/, "leche_coco"],
  [/salsa de tomate/, "salsa_tomate"],
  [/gelatina/, "gelatina"],
  [/cacao/, "cacao"],
  [/(semillas de )?chía/, "chia"],
  [/aceite de coco/, "aceite_coco"],
  [/aceite de oliva/, "aceite_oliva"],
  [/vinagre/, "vinagre"],
  [/vino blanco|coñac/, "vino_blanco"],
  [/caldo/, "caldo"],
  [/edulcorante|azúcar/, "edulcorante"],
  [/polvo de hornear/, "polvo_hornear"],
  [/(esencia de )?vainilla/, "vainilla"],

  // ── Condimentos ───────────────────────────────────────────────────────
  [/nuez moscada/, "nuez_moscada"],
  [/sal gruesa|^sal$|^sal /, "sal"],
  [/pimienta/, "pimienta"],
  [/orégano/, "oregano"],
  [/pimentón/, "pimenton"],
  [/comino/, "comino"],
  [/curry/, "curry"],
  [/ají molido/, "aji_molido"],
  [/tomillo/, "tomillo"],
];

/** El orden del recorrido por el súper, que no es alfabético ni casual: lo
 *  fresco al final, para que no pase media hora en el changuito. */
export const SECTORES = [ALMACEN, LACTEOS, CARNICERIA, VERDULERIA, FIJA];
