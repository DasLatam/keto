// Ayuno intermitente: los dos esquemas que propone el sitio y cómo afectan al
// resto de las páginas.
//
// La elección se guarda en `localStorage` bajo `keto-ayuno` y vale para todo el
// sitio, igual que la cantidad de personas de la casa. El HTML sale siempre en
// «sin ayuno» y el JavaScript lo reescribe: así el sitio sigue siendo estático y
// quien tenga el JS bloqueado ve el plan completo, que es el caso general.
//
// **Por qué sólo dos esquemas y no seis.** Hay decenas de protocolos (5:2, días
// alternos, 14:10, comer una vez al día). Ponerlos todos convierte una decisión
// simple en una tabla comparativa y hace que no se elija ninguno. Estos dos son
// los que se sostienen con las cuatro comidas que ya tiene el plan: sacar el
// desayuno, o sacar el desayuno y el almuerzo.
//
// Los nombres 16:8 y 20:4 salen de la ventana que queda con los horarios por
// defecto del calendario, no al revés: primero se decide qué comida se saltea y
// después se mira cuántas horas quedan.

/**
 * Horarios por defecto de las cuatro comidas. Viven acá y no en la página del
 * calendario porque la ventana de cada esquema de ayuno **se deriva de ellos**:
 * salteando el desayuno, la ventana va de la hora del almuerzo a la de la cena.
 * Con los horarios en un lado y las ventanas escritas a mano en otro, mover la
 * cena a las diez dejaría al sitio diciendo que el ayuno es de dieciséis horas
 * cuando ya no lo es.
 */
export const HORAS_COMIDA = {
  desayuno: "08:00",
  almuerzo: "13:00",
  merienda: "17:00",
  cena: "21:00",
};

const hs = (h) => Number(h.slice(0, 2)) + Number(h.slice(3)) / 60;

/** La ventana de comida que queda al saltear unas comidas, en horas. */
function ventanaDe(saltea, horas = HORAS_COMIDA) {
  const quedan = COMIDAS_PLAN.filter((c) => !saltea.includes(c));
  if (!saltea.length || quedan.length < 1) return null;
  const desde = horas[quedan[0]];
  const hasta = horas[quedan[quedan.length - 1]];
  const comida = Math.round(hs(hasta) - hs(desde));
  return { desde, hasta, comida, ayuno: 24 - comida };
}

/**
 * Las comidas del plan, en orden. La colación no está: es una categoría de
 * recetas suelta y el plan semanal no la agenda.
 */
export const COMIDAS_PLAN = ["desayuno", "almuerzo", "merienda", "cena"];

export const AYUNOS = [
  {
    id: "no",
    nombre: "Sin ayuno",
    corto: "Las cuatro comidas",
    etiqueta: "4 comidas",
    saltea: [],
    ventana: null,
    resumen:
      "El plan completo: desayuno, almuerzo, merienda y cena. Es el punto de partida y no hay ninguna necesidad de moverse de acá.",
  },
  {
    id: "simple",
    nombre: "Ayuno simple",
    corto: "Sin desayuno",
    etiqueta: "16:8",
    saltea: ["desayuno"],
    // La ventana no está escrita: sale de los horarios de arriba. Con el
    // desayuno afuera, del almuerzo a la cena hay ocho horas, y las otras
    // dieciséis son de ayuno — la mayor parte durmiendo, que es lo que hace que
    // este esquema se sostenga.
    ventana: ventanaDe(["desayuno"]),
    resumen:
      "Se saltea el desayuno y se come de mediodía a la noche. Es el esquema más común y el más fácil de sostener, porque la mayor parte del ayuno transcurre durmiendo.",
  },
  {
    id: "avanzado",
    nombre: "Ayuno avanzado",
    corto: "Sin desayuno ni almuerzo",
    etiqueta: "20:4",
    saltea: ["desayuno", "almuerzo"],
    ventana: ventanaDe(["desayuno", "almuerzo"]),
    resumen:
      "Se saltea el desayuno y el almuerzo: queda la merienda y la cena en una ventana de cuatro horas. Esas dos comidas tienen que cubrir el día entero —porciones dobles—, así que no es por donde se empieza.",
  },
];

/** El esquema por su id, con «sin ayuno» como valor por defecto. */
export function porId(id) {
  return AYUNOS.find((a) => a.id === id) ?? AYUNOS[0];
}

/**
 * Por cuánto hay que multiplicar las comidas que quedan.
 *
 * **Esto es lo que separa un plan de un ayuno mal hecho.** Las porciones del plan
 * están calculadas para cuatro comidas. Salteando dos y comiendo las otras dos
 * como están, el día cierra en 671 calorías y 28 gramos de proteína: no es ayuno
 * intermitente, es comer la mitad. Y es exactamente el escenario del que
 * advierte el ensayo TREAT, donde el grupo que ayunaba perdió masa magra.
 *
 * El ayuno mueve **cuándo** se come, no cuánto. Así que las comidas que quedan
 * tienen que cubrir el día entero: con dos de cuatro, cada una rinde el doble.
 *
 * `caloriasPorComida` es el promedio de cada comida en el plan; se pasa desde
 * afuera porque vive en `recetas.js` y este módulo no tiene por qué importarlo.
 */
export function factorPorcion(caloriasPorComida, saltea = []) {
  if (!saltea.length) return 1;
  const total = COMIDAS_PLAN.reduce((a, c) => a + (caloriasPorComida[c] || 0), 0);
  const quedan = COMIDAS_PLAN.reduce(
    (a, c) => a + (saltea.includes(c) ? 0 : caloriasPorComida[c] || 0), 0);
  if (!quedan || !total) return 1;
  return total / quedan;
}

/**
 * Cuánto de un ítem de la lista del súper sigue haciendo falta.
 *
 * Cada ítem lleva en `usos` en cuántas recetas del plan aparece y en qué comida
 * (ver `recetas.js`). Salteando el desayuno, los seis huevos que iban ahí dejan
 * de hacer falta, pero los que van en la cena sí: por eso el factor es una
 * proporción y no un sí o un no.
 *
 * Devuelve 0 cuando el ítem sólo servía para comidas que se saltean — la palta,
 * por ejemplo, si se saltean desayuno y almuerzo. Ese ítem sale de la lista.
 *
 * Lo que **no** se toca es la despensa (`escala: false`): el frasco de pimentón
 * y la botella de aceite rinden varias semanas y no se compran a medias porque
 * uno deje de desayunar.
 */
export function factorLista(item, saltea = [], multiplicador = 1) {
  if (!saltea.length || item.escala === false || !item.usos) return 1;
  const usos = Object.entries(item.usos);
  const total = usos.reduce((a, [, n]) => a + n, 0);
  if (!total) return 1;
  // Las comidas que quedan se cocinan más grandes (ver `factorPorcion`), así que
  // sus ingredientes rinden menos: por eso el multiplicador entra acá. Sin él, la
  // lista pediría comida para 671 calorías por día.
  const quedan = usos.reduce(
    (a, [c, n]) => a + (saltea.includes(c) ? 0 : n * multiplicador), 0);
  return quedan / total;
}

export function comidasQueQuedan(saltea = []) {
  return COMIDAS_PLAN.filter((c) => !saltea.includes(c));
}
