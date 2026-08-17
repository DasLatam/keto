// Escalado de cantidades para una persona o para el grupo familiar.
//
// La lista del súper está escrita **para una persona y una semana**. Multiplicarla
// por N no es multiplicar el número y listo: "600 g de pechuga" por cuatro no se
// pide como "2400 g", se pide como "2,4 kg", y "1 atado de acelga" por tres no
// puede quedar en "3,7 atados" porque en la verdulería no venden fracciones de
// atado. Así que cada unidad tiene su regla de redondeo.
//
// Hay ítems que **no se multiplican**: una botella de aceite, el frasco de
// pimentón, el polvo de hornear. Rinden varias semanas y multiplicarlos haría que
// la lista pidiera cinco botellas de vinagre para una familia. Van marcados con
// `escala: false` y se muestran siempre igual.

/** Símbolos de unidades de medida, que no pluralizan: 3 kg, 500 g, 200 cc.
 *  «litro» sí pluraliza y por eso no está acá. */
const INVARIABLES = new Set(["kg", "g", "cc", "ml"]);

/** Palabras que no se pluralizan y que además cortan la concordancia: en «cebolla
 *  de verdeo» se pluraliza «cebolla» y nada de lo que viene después. */
const CORTES = new Set(["de", "del", "con", "en", "al", "a", "y", "sin", "para"]);

const SIN_TILDE = { á: "a", é: "e", í: "i", ó: "o", ú: "u" };

/** Número con coma decimal y sin el ",0" de los enteros. */
export function fmt(n) {
  return Number(n).toFixed(1).replace(/\.0$/, "").replace(".", ",");
}

/**
 * Plural de una palabra en español. No alcanza con agregar la «s»: sin esto la
 * lista dice «4 coliflors», «2 limóns» y «6 nuezs».
 *
 * - vocal final → + s ....................... palta → paltas
 * - z final → -ces .......................... nuez → nueces
 * - otra consonante → + es, y si la última vocal lleva tilde la pierde, porque al
 *   sumar sílaba el acento vuelve a caer donde corresponde:
 *   limón → limones, morrón → morrones, coliflor → coliflores
 */
function pluralizarPalabra(p) {
  if (/[aeiou]$/i.test(p)) return `${p}s`;
  if (/z$/i.test(p)) return `${p.slice(0, -1)}ces`;
  return `${p.replace(/[áéíóú](?=[^áéíóú]*$)/, (c) => SIN_TILDE[c] ?? c)}es`;
}

/**
 * Plural de la unidad, que puede ser de más de una palabra. El adjetivo concuerda
 * con el sustantivo («zapallitos redondos», «morrones rojos»), así que se
 * pluraliza cada palabra hasta la primera preposición.
 */
function plural(unidad, n) {
  if (!unidad || n === 1 || INVARIABLES.has(unidad)) return unidad;

  let corto = false;
  return unidad
    .split(" ")
    .map((p) => {
      if (corto || CORTES.has(p.toLowerCase())) {
        corto = true;
        return p;
      }
      return pluralizarPalabra(p);
    })
    .join(" ");
}

/**
 * Redondeo con criterio de góndola: nadie pide 2400 g de carne ni 1,3 latas de
 * atún. Los gramos y los cc suben a kilos y litros cuando pasan los mil, los
 * contables van para arriba (si sobra un huevo no pasa nada; si falta, sí).
 */
function redondear(total, unidad) {
  if (unidad === "g") {
    if (total >= 1000) return { cant: Math.round(total / 100) / 10, unidad: "kg" };
    return { cant: Math.max(50, Math.round(total / 50) * 50), unidad: "g" };
  }
  if (unidad === "cc") {
    if (total >= 1000) return { cant: Math.round(total / 100) / 10, unidad: "litro" };
    return { cant: Math.max(50, Math.round(total / 50) * 50), unidad: "cc" };
  }
  if (unidad === "kg") return { cant: Math.round(total * 10) / 10, unidad: "kg" };
  // Contables: atados, docenas, latas, paltas. Siempre para arriba.
  return { cant: Math.ceil(total), unidad };
}

/**
 * Texto final de un ítem de la lista para `personas` personas.
 *
 * - `{ cant: 1, unidad: "kg", nombre: "vacío" }` → "1 kg de vacío"
 * - `{ cant: 4, unidad: "palta" }`               → "4 paltas"
 * - `{ nombre: "Sal gruesa", escala: false }`    → "Sal gruesa"
 */
export function textoItem(item, personas = 1) {
  if (item.cant == null) return item.nombre;

  const total = item.escala === false ? item.cant : item.cant * personas;
  const { cant, unidad } = redondear(total, item.unidad);
  const u = plural(unidad, cant);

  if (!u) return `${fmt(cant)} ${item.nombre}`;
  // Sin `nombre` la unidad ya es la cosa: "4 paltas", "12 zapallitos redondos".
  if (!item.nombre) return `${fmt(cant)} ${u}`;
  return `${fmt(cant)} ${u} de ${item.nombre}`;
}

/** Clave estable para el localStorage de los tildes: no puede depender del
 *  texto, porque el texto cambia cuando cambia la cantidad de personas y se
 *  perderían todos los tildes al mover el selector. */
export function claveItem(sector, item) {
  return `${sector}::${item.nombre ?? ""}|${item.unidad ?? ""}`;
}

/** Cuántos ítems de un sector se multiplican por persona. Sirve para avisar en
 *  la UI que el resto rinde varias semanas. */
export function cuentaEscalables(items) {
  return items.filter((i) => i.escala !== false && i.cant != null).length;
}

/**
 * Porciones que rinde una receta para un grupo. Devuelve cuántas veces hay que
 * hacer la receta: una receta de 2 porciones para 4 personas se cocina 2 veces.
 */
export function vecesQueRinde(porciones, personas) {
  return Math.max(1, Math.ceil(personas / porciones));
}
