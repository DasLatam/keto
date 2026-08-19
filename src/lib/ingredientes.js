// Qué recetas usan un producto de la góndola.
//
// La lista de «dónde se usa» de cada página de ingrediente **no se escribe a
// mano**: se deriva de los ingredientes de las 49 recetas. Escrita a mano
// quedaría desactualizada con la primera receta nueva y nadie se enteraría;
// derivada, no puede mentir.
//
// El matching es por término y no por igualdad porque los dos textos están
// escritos para personas distintas. En la góndola el producto se llama «Quesos
// duros (sardo, reggianito, provolone)» y en la receta dice «200 g de queso
// sardo o parmesano rallado grueso». Lo que los une son las palabras de adentro
// del paréntesis, que son justamente los nombres con los que se pide en la
// fiambrería.

const plano = (t) =>
  String(t ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// Palabras que aparecen en todas partes y no identifican nada. Sin esta lista,
// «Queso cremoso» matchearía cualquier receta que diga «queso».
const VACIAS = new Set([
  "de", "del", "la", "el", "los", "las", "y", "o", "con", "sin", "en", "al", "un", "una",
  "para", "sus", "que", "mas", "muy", "poco", "bien", "entera", "entero", "comun",
  "natural", "fresco", "fresca", "chico", "chica", "grande", "rallado", "molido",
  "cocido", "crudo", "light", "zero", "agua", "gas", "azucar", "almidon", "aptos",
]);

/** Singular tosco pero suficiente: quita la `s` o la `es` final. */
const singular = (p) => p.replace(/([^aeiou])es$/, "$1").replace(/s$/, "");

/**
 * Los términos con los que buscar un producto dentro de una receta.
 *
 * Del nombre se sacan dos cosas: las palabras de afuera del paréntesis —el
 * nombre genérico— y cada una de las de adentro, que son las variedades
 * concretas. Para «Cerdo (bondiola, matambrito, panceta)» quedan `cerdo`,
 * `bondiola`, `matambrito` y `panceta`, y así una receta con matambrito
 * aparece aunque nunca diga la palabra cerdo.
 */
export function terminos(producto) {
  const n = plano(producto.nombre);
  // Se corta también por " y ": «Semillas de chía y lino» son dos cosas, y unidas
  // en un solo término se exigiría que la receta nombre las dos. Es lo que hacía
  // que la receta con chía no apareciera en la página de la chía.
  const partir = (t) => t.split(/[,/]| y /);
  const dentro = partir(n.match(/\(([^)]*)\)/)?.[1] ?? "");
  const fuera = partir(n.replace(/\([^)]*\)/g, ""));

  const salida = new Set();
  for (const trozo of [...fuera, ...dentro]) {
    const palabras = trozo
      .split(/\s+/)
      .map((p) => p.replace(/[^a-z0-9]/g, ""))
      .filter((p) => p.length >= 3 && !VACIAS.has(p));
    if (!palabras.length) continue;
    // La frase entera («harina de almendras» → «harina almendras») no sirve para
    // buscar en un texto libre, así que se guardan las palabras sueltas y se
    // exige que estén todas: ver `usaProducto`.
    salida.add(palabras.map(singular).join(" "));
  }
  return [...salida].filter(Boolean);
}

/** Si el texto de una receta contiene todas las palabras de alguno de los términos. */
function coincide(texto, terminosProducto) {
  return terminosProducto.some((t) =>
    t.split(" ").every((palabra) => texto.includes(palabra)),
  );
}

/**
 * Las recetas que usan un producto, en el orden en que están en el sitio.
 *
 * Se busca sobre los ingredientes y no sobre los pasos: un paso puede nombrar
 * la manteca de la sartén sin que la manteca sea parte de la receta, y eso
 * llenaría la página de falsos positivos.
 */
export function recetasCon(producto, recetas) {
  const ts = terminos(producto);
  if (!ts.length) return [];
  return recetas.filter((r) => {
    const texto = singularizar(plano(r.ingredientes.join(" ; ")));
    return coincide(texto, ts);
  });
}

/** Pasa un texto entero a «singular» para poder comparar palabra por palabra. */
function singularizar(texto) {
  return texto.split(/\s+/).map(singular).join(" ");
}
