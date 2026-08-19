// Qué cuenta como «ingrediente» a los fines de la etiqueta «Pocos ingredientes».
//
// No cuenta las líneas: cuenta **lo que hay que ir a comprar**. La sal, la
// pimienta, el aceite de oliva y los condimentos ya están en la casa de
// cualquiera que esté haciendo esta dieta, y sumarlos convierte una receta de
// tres cosas en una de cinco.
//
// El umbral no lo elegí yo: sale del propio contenido. De las 30 recetas que ya
// tenían la etiqueta, ninguna supera las cinco cosas a comprar — o sea que quien
// las etiquetó estaba usando esta cuenta sin escribirla. Lo que faltaba era
// aplicarla a todas: había recetas de dos ingredientes sin la etiqueta.
export const MAX_PARA_COMPRAR = 5;

const DESPENSA =
  /^(sal|pimienta|sal y pimienta|sal gruesa|aceite de oliva|oregano|orégano|pimenton|pimentón|comino|aji molido|ají molido|nuez moscada|edulcorante|vinagre|caldo|agua|especias|hierbas|pizca de sal|manteca para|aceite para)\b/i;

const plano = (t) =>
  String(t ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Cuántas cosas de una receta hay que ir a comprar.
 *
 *  Lo marcado «(opcional)» tampoco cuenta: una cucharada de crema arriba de la
 *  torta es una sugerencia para servir, no un renglón de la compra. Sin esta
 *  regla, aclarar un agregado opcional en una receta le sacaba la etiqueta de
 *  «pocos ingredientes», que es castigar justo la aclaración que la mejora. */
export function paraComprar(receta) {
  return receta.ingredientes.filter(
    (i) => !DESPENSA.test(plano(i)) && !/\(opcional\)/i.test(i),
  ).length;
}

/** Si a la receta le corresponde la etiqueta «pocos ingredientes». */
export function esDePocosIngredientes(receta) {
  return paraComprar(receta) <= MAX_PARA_COMPRAR;
}
