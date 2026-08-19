// Contenido largo de cada producto de la góndola: una página por ingrediente.
//
// `productos.js` tiene la ficha de góndola —si entra, cuántos carbos, qué marcas
// se consiguen acá— y eso alcanza para decidir parado frente a la heladera. Esto
// es lo otro: por qué entra, cómo elegir el bueno, cómo guardarlo y cuál es el
// error que arruina el resultado.
//
// **Está escrito a mano, producto por producto, y es a propósito.** La fuente en
// `productos.js` son veintiséis palabras; pedirle a un modelo que las estire a
// seiscientas es pedirle que invente el noventa y cinco por ciento del texto. El
// verificador de `scripts/audios/numeros.py` caza un carbohidrato inventado,
// pero no caza «el cuajo lo hace más digerible», que suena bien y es falso. En
// un sitio de alimentación eso no se puede automatizar.
//
// Campos, todos opcionales salvo `porque`:
//
//   porque    por qué entra o por qué no. El mecanismo, no la etiqueta.
//   elegir    cómo distinguir el bueno del malo en un súper argentino.
//   guardar   heladera, freezer o despensa, con tiempos y cómo descongelar.
//   error     el error típico, con el mismo criterio que el `tip` de las recetas.
//   rinde     equivalencias y reemplazos que sirven al cocinar.
//
// La comprobación de que no falte ninguno está en `detalle()`, más abajo: si se
// agrega un producto a `productos.js` y no se le escribe la ficha, el build lo
// dice en lugar de publicar una página vacía.

export const INGREDIENTES = {
  // ══════════════════════════ Lácteos y quesos ══════════════════════════
  "queso-cremoso": {
    porque:
      "Casi todo el carbohidrato de la leche es lactosa, y la lactosa se va en dos etapas: una parte queda en el suero que se escurre al hacer el queso, y otra la fermentan las bacterias del cultivo. Por eso cien gramos de leche tienen casi cinco gramos de carbohidratos y cien gramos de queso cremoso tienen dos. Cuanto más se escurre y más madura, menos queda.",
    elegir:
      "Que diga queso cremoso y no «producto lácteo» ni «alimento a base de queso»: esos últimos suelen llevar almidón o fécula para dar textura, y ahí el número de la tabla ya no es el que uno espera. La lista de ingredientes de un cremoso honesto es corta: leche, sal, cuajo y fermentos.",
    guardar:
      "En la heladera, envuelto en su propio envase o en film, no en un tupper hermético: encerrado sin aire transpira y se pone baboso en la superficie. Se congela, pero cambia: sale más quebradizo y suelta agua al descongelar. Congelado sirve para gratinar y no para una tabla.",
    error:
      "Comprarlo en fetas de máquina y suponer que es lo mismo. Muchas fetas industriales llevan almidón para que no se peguen entre sí, y eso son carbohidratos que la horma no tiene.",
  },

  "queso-untable": {
    porque:
      "Es crema de leche con fermentos y poco suero, así que la mayor parte de lo que aporta es grasa. Los tres gramos de carbohidratos por cada cien son la lactosa que queda: en la porción real que se unta —veinte o treinta gramos— es menos de un gramo.",
    elegir:
      "La palabra que hay que buscar en la etiqueta es la grasa, y hay que buscarla para que sea **alta**. Las versiones «light» y «0 %» le sacan grasa, y como algo tiene que dar cuerpo, entran espesantes y a veces azúcar: terminan con más carbohidratos que la común. Es el caso más claro del sitio donde el producto «saludable» es el peor.",
    guardar:
      "Heladera y consumir dentro de la semana de abierto. No se congela: al descongelar se corta y queda granulado, sin arreglo.",
    error:
      "Usarlo como si fuera libre. Es grasa, así que suma calorías rápido: dos cucharadas soperas son unas cien calorías y pasan sin que uno las registre.",
    rinde:
      "Reemplaza a la crema en salsas frías. En caliente hay que bajarle el fuego, porque se corta antes que la crema.",
  },

  "quesos-duros": {
    porque:
      "Son los que más tiempo maduraron, y la maduración es fermentación: las bacterias se comieron la lactosa que quedaba. Un sardo o un reggianito de estacionamiento largo está prácticamente en cero carbohidratos. Es la razón por la que un queso duro es más seguro que uno blando, aunque los dos sean queso.",
    elegir:
      "Comprarlo en cuña y rallarlo en casa. El rallado de paquete suele llevar antiapelmazantes —almidón de maíz, celulosa— para que no se compacte, y ese almidón es carbohidrato agregado a un producto que no lo tenía.",
    guardar:
      "En la parte menos fría de la heladera, envuelto en papel de cocina y después en film: el papel absorbe la humedad que suelta y el film evita que se seque. Aguanta meses. Se congela rallado sin problema y se usa directo del freezer.",
    error:
      "Rallar el queso frío de heladera y pelear con él. Diez minutos afuera y ralla el doble de rápido, y si es para fundir, además funde parejo en vez de dejar grumos.",
  },

  "crema-de-leche": {
    porque:
      "Es la grasa de la leche separada del resto. Al concentrar grasa se diluye todo lo demás, incluida la lactosa: por eso tiene menos carbohidratos por caloría que la leche de la que salió. En keto cumple una función que ningún otro lácteo cumple, que es agregar calorías y saciedad sin agregar volumen.",
    elegir:
      "La de repostería, con más materia grasa, antes que la «light» o la «para batir» rebajada. Más grasa quiere decir dos cosas útiles: menos lactosa por cucharada y que no se corta al hervir. La light se corta en cuanto la salsa levanta hervor.",
    guardar:
      "Heladera. Abierta dura pocos días. Se congela en cubetera y los cubos sirven para salsas —al descongelar se separa, pero al calentarla y revolver vuelve—; lo que no vuelve es la crema batida.",
    error:
      "Hervirla a fuego fuerte. La crema se corta por calor brusco, no por tiempo: a fuego bajo se reduce y espesa, a fuego fuerte se separa en grasa y suero y ya no hay vuelta atrás.",
    rinde:
      "Cien mililitros de crema espesan una salsa para dos porciones. Si falta, media cucharadita de queso untable levanta el cuerpo sin cambiar el gusto.",
  },

  manteca: {
    porque:
      "Es casi grasa pura: le queda menos de un gramo de carbohidratos por cada cien. Además tiene un punto de humo lo bastante alto para saltear a fuego medio, que es como se cocina la mayor parte de las recetas del sitio.",
    elegir:
      "Manteca, no margarina, y la diferencia no es de gusto. La margarina se hace con aceites vegetales endurecidos industrialmente, que es exactamente el tipo de grasa que esta dieta busca evitar; la manteca es grasa láctea. Si dice «untable» o «para untar» en la góndola de la manteca, casi siempre es margarina o una mezcla.",
    guardar:
      "Heladera bien envuelta: absorbe olores con una facilidad asombrosa y una manteca guardada al lado de un pescado se convierte en manteca de pescado. Se congela hasta seis meses sin cambiar nada, y se corta en cubos antes de congelar para no tener que descongelar el pan entero.",
    error:
      "Ponerla a fuego fuerte. A partir de cierto punto los sólidos lácteos se queman y amargan el plato entero. Para dorar fuerte conviene grasa vacuna; la manteca es para fuego medio o para terminar.",
    rinde:
      "Una cucharada sopera son unos catorce gramos y cien calorías. Sirve para calcular sin balanza.",
  },

  "leche-entera": {
    porque:
      "El problema no es lo que tiene sino cómo se toma. Cuatro coma siete gramos de carbohidratos cada cien mililitros parece poco, hasta que se piensa en un vaso: doscientos mililitros son casi diez gramos, la mitad del presupuesto de un día en muchos planes, y en algo que no llena nada.",
    elegir:
      "Si se usa, la entera antes que la descremada: al sacarle la grasa queda proporcionalmente más lactosa por vaso. Un chorrito en el café es perfectamente manejable; el problema es el vaso.",
    guardar: "Heladera. Abierta, tres o cuatro días.",
    error:
      "Reemplazarla por «leche de almendras» sin leer la etiqueta. Las que se consiguen en el súper argentino suelen venir azucaradas, y entonces el reemplazo tiene más carbohidratos que lo que reemplazaba. La que sirve dice «sin azúcares añadidos».",
    rinde:
      "En el café, la crema hace el mismo trabajo con una fracción de los carbohidratos. En una preparación, la leche de coco.",
  },

  "yogur-saborizado": {
    porque:
      "El yogur natural no es el problema: la fermentación se come parte de la lactosa igual que en el queso. El problema es el azúcar agregada del saborizado y del bebible, que es lo que lo lleva a doce gramos por pote. Ahí ya no es un lácteo fermentado, es un postre.",
    elegir:
      "Yogur natural entero, sin azúcar, y leer el renglón de «azúcares» de la tabla nutricional en vez del frente del pote. «Sin azúcar agregada» y «light» no son lo mismo: el light puede tener el azúcar de la leche igual y menos grasa, que es peor combinación.",
    guardar: "Heladera. Una vez abierto, tres días.",
    error:
      "Elegir el descremado creyendo que es la versión buena. Sin grasa el yogur queda ácido y aguado, así que la industria compensa con azúcar o con almidón. El entero natural es el que menos carbohidratos tiene y el único que llena.",
  },

  "dulce-de-leche": {
    porque:
      "Es leche y azúcar reducidas juntas hasta que queda una pasta. Cincuenta y cinco gramos de carbohidratos por cada cien no admiten porción chica: dos cucharadas son más carbohidratos que todo el resto del día.",
    elegir:
      "No hay ninguno de góndola que valga la pena, incluidos los que dicen «sin azúcar»: se hacen con polialcoholes que en cantidad revuelven el estómago, y el precio no acompaña.",
    guardar: "—",
    error:
      "Buscarle el reemplazo exacto. No existe, y perseguirlo es lo que hace abandonar. Para el antojo dulce están la mousse de chocolate y el flan de coco del sitio: no imitan al dulce de leche, pero cierran la misma necesidad.",
  },

  // ══════════════════════════ Grasas y aceites ══════════════════════════
  "aceite-de-oliva": {
    porque:
      "Cero carbohidratos y una grasa que se tolera bien en crudo. En una dieta donde la grasa es el combustible principal, el aceite es la forma más simple de subir las calorías de un plato que quedó liviano sin cambiarle el gusto.",
    elegir:
      "Virgen extra para crudo, y de botella oscura o lata: la luz lo oxida y el aceite oxidado es amargo y rancio. Para freír conviene otra cosa —grasa vacuna o manteca—, no porque el oliva sea malo sino porque su punto de humo es más bajo y se desperdicia el bueno.",
    guardar:
      "En un lugar fresco y oscuro, lejos de la hornalla. La alacena de arriba de la cocina es el peor lugar posible, y es donde todo el mundo lo pone.",
    error:
      "Medirlo a ojo por encima de la ensalada. Un chorro largo son fácilmente tres cucharadas y trescientas sesenta calorías. En keto la grasa se cuenta igual que todo lo demás.",
  },

  palta: {
    porque:
      "Es una fruta con perfil de grasa: la mayor parte de lo que aporta es grasa monoinsaturada y fibra, y los carbohidratos que tiene vienen en buena medida como fibra, que no se absorbe. Por eso entra cómoda donde ninguna otra fruta entra.",
    elegir:
      "Se elige por el tacto y no por el color: cede apenas con la presión de la palma, no del dedo, que es lo que la magulla. Si el cabito sale solo y abajo está verde, está en punto; si abajo está marrón, ya se pasó por dentro.",
    guardar:
      "Verde, afuera y a temperatura ambiente; en punto, a la heladera, donde frena tres o cuatro días más. Para apurarla, en una bolsa de papel con una banana. La mitad sobrante se guarda con el carozo puesto y film pegado a la pulpa: lo que la oscurece es el aire, no el carozo, así que el film hace más que el mito. Se congela pisada con limón, para licuados; en gajos no, queda con textura de jabón.",
    error:
      "Comprar todas en el mismo punto de madurez. Se pasan las cinco el mismo día. Conviene llevar dos maduras y dos verdes, que es como se compra la fruta que se va a usar toda la semana.",
  },

  "grasa-vacuna": {
    porque:
      "Cero carbohidratos y un punto de humo alto, que es lo que la hace la mejor opción para dorar fuerte. Es además la grasa con la que se cocinó siempre acá, así que el sabor no queda ajeno en ningún plato argentino.",
    elegir:
      "Se pide en la carnicería y suele salir monedas o directamente nada. Conviene pedirla del corte —grasa de pella para derretir— y hacerla en casa a fuego muy bajo hasta que suelte todo y queden los chicharrones.",
    guardar:
      "Derretida y colada, en un frasco en la heladera: aguanta meses. En el freezer, prácticamente indefinido. Se saca con cuchara, no hace falta descongelar.",
    error:
      "Derretirla apurado a fuego fuerte. Se quema y toda la tanda queda con gusto amargo. Es una hora a fuego mínimo y no hay atajo.",
  },

  aceitunas: {
    porque:
      "Son grasa y sal en formato portátil, que es exactamente lo que falta a media tarde. Los tres gramos de carbohidratos por cada cien son por el fruto entero; en las seis o siete que entran en una porción es una fracción de eso.",
    elegir:
      "En salmuera antes que en aceite si se busca la aceituna, y con carozo antes que descarozadas: las descarozadas se ablandan y pierden sabor. Las rellenas con morrón suman poco; las rellenas con pasta de anchoa, nada.",
    guardar:
      "En su salmuera, en la heladera una vez abierto el frasco. Si el líquido no las cubre, se secan y se arrugan por arriba: se completa con agua y sal.",
    error:
      "Contarlas como libres. Son la colación que más fácil se come de a puñados frente a la heladera, y ahí las calorías suben rápido aunque los carbohidratos no.",
  },

  "aceite-de-girasol": {
    porque:
      "No tiene carbohidratos, así que técnicamente no rompe la cetosis. Queda afuera por otra razón: es un aceite de semillas muy refinado, con mucho omega 6, y la dieta apunta a que la grasa que se come sea de mejor calidad, no sólo de bajo carbohidrato. No todo lo que entra en el presupuesto de carbohidratos es una buena idea.",
    elegir:
      "Si se usa por precio, que sea sólo para freír y no para crudo, y que no se reutilice: el aceite recalentado varias veces es el peor escenario.",
    guardar: "Fresco y oscuro, como todos los aceites.",
    error:
      "Suponer que «cero carbos» es igual a «keto». Es el mismo razonamiento que llevaría a aceptar cualquier ultraprocesado con la tabla en cero.",
    rinde:
      "Para freír, la grasa vacuna o la manteca hacen mejor trabajo y aguantan más temperatura.",
  },

  // ══════════════════════════ Carnes y proteínas ══════════════════════════
  "cortes-vacunos": {
    porque:
      "La carne no tiene carbohidratos, y punto. Lo que decide cuál conviene es la grasa: en una dieta donde la grasa es el combustible, un corte magro obliga a agregarla aparte y uno graso ya viene resuelto. Por eso el vacío y la entraña rinden mejor que el peceto, aunque los tres estén en cero.",
    elegir:
      "Para el día a día, los cortes con veta: vacío, entraña, asado, aguja. El peceto y la nalga son magros y quedan secos salvo que se cocinen en líquido o se acompañen con manteca o salsa. Y conviene mirar el color de la grasa: amarilla es de animal a pasto, blanca de feedlot; las dos sirven, pero la amarilla tiene más sabor.",
    guardar:
      "En la heladera dura dos o tres días. Para el freezer, porcionada en lo que se va a cocinar de una vez y bien envuelta: el enemigo es el aire, que quema la carne por deshidratación y deja esas manchas grises. Descongelar **en la heladera**, doce horas, nunca a temperatura ambiente ni en agua caliente.",
    error:
      "Salar y tirar a la sartén sin sacarla de la heladera. La carne fría por dentro se cocina de afuera hacia adentro con un gradiente enorme: para cuando el centro llega, el borde ya está gris. Veinte minutos afuera antes de cocinar cambian el resultado más que cualquier otra cosa.",
    rinde:
      "Ciento cincuenta a doscientos gramos por persona en un plato principal. Al cocinarse pierde alrededor de un cuarto de su peso.",
  },

  "pollo-con-piel": {
    porque:
      "La piel es la mitad del asunto: es donde está la grasa. Un muslo con piel tiene el doble de calorías que una pechuga pelada, y en keto eso es una ventaja, no un problema. Sin piel, el pollo es proteína casi pura y hay que agregarle grasa aparte.",
    elegir:
      "Muslo y pata antes que pechuga: más grasa, más sabor y bastante más barato. Si va pechuga, que sea con piel y con hueso, que es lo que la salva de quedar seca.",
    guardar:
      "Es la carne que menos aguanta: dos días en heladera como mucho. Se congela bien hasta seis meses. Descongelar en heladera y no volver a congelar crudo lo que ya se descongeló.",
    error:
      "Poner la piel en una sartén tibia. La piel se dora por contacto con calor fuerte y seco: sartén bien caliente, piel para abajo, y no tocarla durante varios minutos. Moverla cada treinta segundos es lo que produce esa piel blanda y gomosa.",
  },

  cerdo: {
    porque:
      "Cero carbohidratos y más grasa intramuscular que el vacuno en la mayoría de los cortes, lo que lo vuelve difícil de arruinar. La bondiola y el matambrito son de los cortes con mejor relación entre precio, grasa y sabor de toda la carnicería.",
    elegir:
      "La panceta es la que hay que mirar con atención: muchas vienen con azúcar en el curado, y ahí un producto de cero carbohidratos pasa a tener varios. La etiqueta lo dice. La panceta ahumada de tira, sin azúcar, es la que conviene.",
    guardar:
      "Igual que el vacuno: dos o tres días en heladera, porcionado y bien envuelto en el freezer. La panceta se congela en fetas separadas con papel, así se sacan de a una.",
    error:
      "Cocinarlo hasta que quede blanco del todo. El cerdo hace rato dejó de necesitar cocción extrema, y llevado hasta ahí queda seco y con textura de cartón. Un punto apenas rosado en el centro de la bondiola es correcto.",
    rinde:
      "La grasa que suelta la panceta es de las mejores para cocinar el resto: no se tira, se guarda en un frasco.",
  },

  huevos: {
    porque:
      "Medio gramo de carbohidratos por unidad, proteína completa y grasa en la yema. Es el alimento que mejor resuelve el desayuno de esta dieta, y el más barato: por eso aparece en dieciséis de las cuarenta y nueve recetas del sitio.",
    elegir:
      "Cualquiera sirve. Lo único que conviene mirar es que la cáscara esté entera y limpia. El color de la cáscara no dice nada sobre el huevo; el color de la yema depende de lo que comió la gallina y tampoco cambia los macros.",
    guardar:
      "En la heladera, pero **no en la puerta**: es la zona que más cambia de temperatura y donde más rápido se pierden. En su cartón, en un estante. Duran tres o cuatro semanas. Para saber si uno sirve, se sumerge en agua: si se hunde y queda acostado está fresco, si flota, se tira. La clara sola se congela; el huevo entero con cáscara no.",
    error:
      "Cocinarlos a fuego fuerte. El huevo cuaja a temperatura baja, y el fuego fuerte es lo que produce el revuelto seco y granulado y la tortilla con el borde gomoso. Fuego bajo y sacarlos cuando todavía se ven húmedos, porque siguen cocinándose fuera del fuego.",
  },

  pescado: {
    porque:
      "Cero carbohidratos, y en el caso del salmón y la caballa además grasa de la que conviene comer. La merluza es magra y barata: entra igual, pero pide manteca o aceite encima para cerrar como plato keto.",
    elegir:
      "El atún en lata **al natural o en aceite de oliva**, no en aceite de girasol. Fresco, el pescado se elige por el ojo —transparente y abultado, no hundido y opaco— y porque huele a mar y no a pescado.",
    guardar:
      "Fresco, se cocina el mismo día o el siguiente: es lo que menos aguanta de la heladera. Congelado, tres meses. Descongelar en heladera, sobre una rejilla para que no quede en su propio líquido.",
    error:
      "Darlo vuelta muchas veces. El pescado se desarma con la manipulación: se cocina la mayor parte del tiempo de un lado, se da vuelta una sola vez y se termina.",
  },

  "milanesas-rebozadas": {
    porque:
      "La carne de adentro está perfecta; lo que queda afuera es el rebozado, que es pan rallado, o sea harina de trigo. Quince gramos de carbohidratos por porción es casi el presupuesto de un día entero en el pan de una sola comida.",
    elegir:
      "Ninguna de góndola. Las «milanesas de soja» y las de vegetales suelen ser peores, porque además del rebozado traen fécula de ligante.",
    guardar: "—",
    error:
      "Sacarles el rebozado y comer la carne. Además de triste, no funciona: la harina ya absorbió grasa y quedó pegada. Es más fácil hacerlas con harina de almendras, que es lo que hace la receta de milanesas de pollo del sitio.",
    rinde:
      "Una taza de harina de almendras reboza cuatro milanesas, con huevo batido como pegamento.",
  },

  "fiambres-con-almidon": {
    porque:
      "La mortadela, las salchichas y buena parte de los fiambres cocidos llevan almidón y azúcar: el almidón para retener agua y dar textura, el azúcar para el curado y el sabor. Cinco gramos por porción no parecen muchos hasta que se recuerda que el presupuesto del día son veinte.",
    elegir:
      "Los fiambres que sí entran son los que no necesitan ligante: jamón crudo, bondiola curada, salame, lomito. La regla práctica es que cuanto más se parece a un músculo entero salado y secado, mejor; cuanto más se parece a una pasta moldeada, peor.",
    guardar:
      "El jamón crudo, envuelto en la heladera, aguanta semanas. Las fetas al vacío, una vez abiertas, tres o cuatro días.",
    error:
      "Confiar en el frente del paquete. «Sin TACC» no quiere decir sin almidón: hay almidón de maíz y de mandioca que no llevan gluten y suman carbohidratos igual. El renglón que importa es el de carbohidratos de la tabla.",
  },

  // ══════════════════════════ Harinas y sustitutos ══════════════════════════
  "harina-de-almendras": {
    porque:
      "Es almendra molida, así que lo que aporta es grasa y proteína, no almidón. Los siete gramos de carbohidratos por cada cien incluyen fibra, y en la porción real de una receta —treinta o cuarenta gramos— quedan dos o tres gramos netos. Es lo que permite que exista un pan, una torta o una milanesa dentro de la dieta.",
    elegir:
      "En dietética a granel sale bastante menos que en el súper, y es exactamente lo mismo. La de almendra pelada da una miga más clara y fina; la integral, con piel, tiene más fibra y sabor más marcado. Para pan, cualquiera; para tortas, mejor la pelada.",
    guardar:
      "Es grasa molida, así que se pone rancia: en la heladera o el freezer, no en la alacena. En un frasco cerrado en el freezer dura un año y se usa directo, sin descongelar.",
    error:
      "Reemplazar harina de trigo uno a uno en una receta común. No liga igual —no tiene gluten— y absorbe menos líquido: la masa queda chirle y no sube. Las recetas de harina de almendras están escritas para ella, con más huevo y con polvo de hornear.",
    rinde:
      "Una taza son unos noventa y seis gramos, contra ciento veinte de la de trigo. Si una receta pide gramos, hay que pesar.",
  },

  "harina-de-coco": {
    porque:
      "Es la pulpa del coco desgrasada y molida, y es sobre todo fibra. Los ocho gramos por cada cien asustan menos cuando se ve cuánta se usa: absorbe tanto líquido que una receta lleva un tercio de lo que llevaría de otra harina.",
    elegir:
      "Que diga sólo «harina de coco» y nada más. Algunas mezclas para repostería «sin TACC» la traen cortada con fécula de mandioca, y ahí el número cambia por completo.",
    guardar:
      "Alacena, cerrada, en lugar seco: es higroscópica y si toma humedad se apelmaza en piedra. Bien cerrada dura un año.",
    error:
      "Usar la misma cantidad que de harina de almendras. Es el error más caro de la repostería keto: con harina de coco se usa entre un cuarto y un tercio, y hay que subir el líquido y los huevos. Puesta uno a uno, la preparación sale seca e incomible.",
    rinde:
      "Regla práctica: un cuarto de taza de harina de coco reemplaza a una taza de harina de almendras, sumando un huevo extra.",
  },

  psyllium: {
    porque:
      "Es fibra soluble pura: forma un gel con el agua y eso es lo que le da estructura al pan keto y evita que se desarme. La mayor parte de sus carbohidratos es fibra que no se absorbe, así que el neto queda muy bajo. También es lo que resuelve la constipación de las primeras semanas.",
    elegir:
      "En dietética, mucho más barato que en el súper. La cáscara entera y la molida sirven las dos; la molida da una miga más fina.",
    guardar: "Alacena, seco y cerrado. Dura años.",
    error:
      "Pasarse de cantidad. Una cucharada de más vuelve el pan gomoso y violeta —sí, tira a violeta— y además cae pesado. Y hay que tomarlo siempre con bastante agua: seco, se hincha en el lugar equivocado.",
  },

  "chia-y-lino": {
    porque:
      "Grasa, fibra y saciedad por muy poco carbohidrato neto. La chía en agua forma un gel que en repostería reemplaza al huevo, y las dos aportan volumen a un plato sin aportar almidón.",
    elegir:
      "El lino conviene comprarlo entero y molerlo en el momento, en un molinillo de café: molido se oxida rápido y pierde lo que lo hace interesante. La chía se usa entera.",
    guardar:
      "Enteras, en la alacena. Molidas, en el freezer y por poco tiempo.",
    error:
      "Comerlas secas a cucharadas. Absorben mucha agua y hay que dárselas: en un vaso de agua diez minutos antes, o dentro de una preparación húmeda.",
    rinde:
      "Una cucharada de chía en tres de agua, quince minutos, reemplaza un huevo en masas y budines.",
  },

  "harinas-de-cereal": {
    porque:
      "Setenta gramos de carbohidratos por cada cien. No hay porción chica posible: una rodaja de pan de molde son unos quince gramos, casi el presupuesto entero de un día. Es el corazón de lo que la dieta saca, y no por capricho sino por aritmética.",
    elegir:
      "Ninguna, incluidas las integrales y las «sin TACC». Integral cambia la fibra y el índice glucémico, no el total de carbohidratos. Y las harinas sin gluten —arroz, mandioca, maíz— suelen tener **más** almidón que la de trigo.",
    guardar: "—",
    error:
      "Buscar «pan keto» en el súper. Casi todos los que se venden como tales tienen almidón entre los primeros ingredientes. El pan que funciona se hace en casa con harina de almendras y psyllium, y el sitio tiene la receta de pan de taza para tenerlo en cinco minutos.",
  },

  // ══════════════════════════ Verduras y frutas ══════════════════════════
  "verduras-de-hoja": {
    porque:
      "Son casi agua y fibra: dos gramos de carbohidratos por cada cien, y cien gramos de hoja cruda es un plato lleno. Cumplen la función que en otras dietas cumplen el arroz o el pan, que es dar volumen para que el plato parezca un plato.",
    elegir:
      "La espinaca y la rúcula de hoja chica son más tiernas y menos amargas. La acelga se aprovecha entera: la hoja como espinaca y la penca cortada fina, salteada aparte porque tarda más.",
    guardar:
      "Lavadas, secas del todo y en un tupper con papel de cocina adentro: el papel se lleva la humedad, que es lo que las pudre. Así duran una semana en vez de tres días. Se congelan blanqueadas —treinta segundos en agua hirviendo y a agua con hielo—, y sirven para tartas y revueltos, no para ensalada.",
    error:
      "Guardarlas mojadas después de lavarlas. Es la causa número uno de la bolsa de hojas negras del fondo de la heladera. Secarlas bien no es opcional.",
    rinde:
      "Un atado grande crudo se reduce a nada al cocinarlo: lo que parece para cuatro alcanza para uno.",
  },

  "verduras-de-volumen": {
    porque:
      "Tres gramos por cada cien, con textura suficiente para reemplazar a los almidones. El coliflor procesado y salteado hace las veces de arroz y, hervido y pisado con manteca, de puré; el zucchini cortado en tiras largas reemplaza a los fideos. No saben igual, pero cumplen la misma función en el plato.",
    elegir:
      "El zucchini chico y firme, que tiene menos semilla y menos agua. El coliflor bien blanco y compacto, sin manchas marrones. La berenjena, pesada para su tamaño y con el cabito verde.",
    guardar:
      "Heladera, en el cajón, sin bolsa cerrada. El coliflor entero dura una semana; procesado, dos días. Se congelan blanqueados; el zucchini crudo congelado suelta demasiada agua.",
    error:
      "No sacarles el agua. El zucchini y la berenjena son casi todo agua, y si van directo a la sartén hierven en su propio líquido en vez de dorarse. Se salan, se dejan veinte minutos en un colador y se secan: ahí recién se cocinan.",
  },

  tomate: {
    porque:
      "Tres gramos por cada cien lo dejan adentro, pero es de los que hay que mirar: es fruta, y en cantidad suma. Media unidad por comida es una porción razonable; un plato de tomate con dos latas de puré, no.",
    elegir:
      "El perita para salsa —más pulpa, menos agua— y el redondo para ensalada. En lata, que la etiqueta diga tomate y sal, sin azúcar agregada, que muchas salsas listas traen.",
    guardar:
      "**Fuera de la heladera.** El frío por debajo de doce grados arruina la textura y mata el aroma; el tomate de heladera es harinoso y no vuelve. En un plato en la cocina, boca abajo.",
    error:
      "Contar la salsa de tomate comprada como si fuera tomate. Casi todas llevan azúcar entre los primeros ingredientes y triplican el número.",
  },

  "frutos-rojos": {
    porque:
      "Seis gramos por cada cien es alto comparado con una verdura y bajo comparado con cualquier otra fruta: una banana tiene veinte. Además buena parte viene como fibra. Es la única fruta que entra cómoda, y en porción chica.",
    elegir:
      "Congelados salen bastante menos que frescos y sirven igual para licuados y postres. Frescos, que no tengan la caja manchada por abajo, que es señal de que abajo hay fruta aplastada.",
    guardar:
      "Frescos, en la heladera y sin lavar hasta el momento de comerlos: el agua los pudre en horas. Congelados, en el freezer, y se usan sin descongelar.",
    error:
      "Comerlos de a puñados «porque son fruta permitida». Una taza de frutillas son unos doce gramos: media taza está bien, dos tazas es el día entero.",
    rinde:
      "Media taza por porción de postre. En licuado, con leche de coco y sin agregar nada dulce.",
  },

  "papa-y-feculentas": {
    porque:
      "Son almidón, que es glucosa encadenada: el cuerpo la corta y la absorbe. Diecisiete gramos por cada cien parece manejable hasta que se mira la porción real, porque nadie come cien gramos de papa: una papa mediana son doscientos, y ahí se fue el día.",
    elegir:
      "Ninguna. El reemplazo que mejor funciona en textura es el coliflor —hervido y pisado con manteca para puré, procesado y salteado para arroz— y el nabo para la tortilla, que es lo que hace la tortilla española del sitio.",
    guardar: "—",
    error:
      "Creer que enfriarlas las vuelve aptas. El almidón resistente que se forma al enfriar la papa baja algo el impacto, pero no la convierte en un alimento de bajo carbohidrato: sigue teniendo casi todo lo que tenía.",
  },

  "frutas-dulces": {
    porque:
      "Veinte gramos por cada cien, y en fruta que se come de a unidades enteras. Una banana mediana es prácticamente el presupuesto de carbohidratos de un día keto estricto. No hay porción chica que valga: media banana ya es la mitad del día.",
    elegir:
      "Si hay antojo de fruta, frutos rojos en porción chica. Es el único reemplazo que se sostiene.",
    guardar: "—",
    error:
      "Sumarlas al licuado «para endulzar». Es la forma más rápida de romper la cetosis sin darse cuenta, porque en licuado no se percibe la cantidad: entran tres frutas que nadie se comería enteras.",
  },

  // ══════════════════════════ Bebidas ══════════════════════════
  "mate-y-te": {
    porque:
      "Cero carbohidratos amargo. El mate es además la bebida que más acompaña el ayuno intermitente acá: llena, entretiene y no corta nada mientras no lleve azúcar.",
    elegir:
      "Cualquier yerba. Las saborizadas con cáscara de naranja o hierbas tampoco suman nada apreciable; las que hay que mirar son las mezclas «con azúcar» o los tés de sobre saborizados, que a veces vienen endulzados.",
    guardar: "La yerba, en un recipiente hermético y oscuro: se pone rancia con la luz.",
    error:
      "Pasar del azúcar al edulcorante y quedarse ahí. Funciona a los fines de la dieta, pero el mate amargo se aprende en una semana y después el dulce empalaga.",
  },

  cafe: {
    porque:
      "Cero carbohidratos solo. Con crema sigue en cero prácticamente; con leche empieza a sumar, y con azúcar deja de ser café keto. También es de lo que mejor sostiene la mañana de quien saltea el desayuno.",
    elegir:
      "El de filtro o la cafetera italiana antes que el instantáneo saborizado, que a veces trae azúcar en la mezcla. Los «capuchinos» de sobre son casi todos azúcar y leche en polvo.",
    guardar:
      "En grano y molido en el momento si se puede; molido, en un frasco hermético y oscuro, no en la heladera, que le mete humedad y olores.",
    error:
      "Tomar cinco cafés para aguantar el ayuno. Además del nervio, la cafeína en exceso empeora el sueño, y dormir mal es de lo que más sabotea una dieta.",
  },

  "gaseosas-zero": {
    porque:
      "Cero carbohidratos y cero calorías: no sacan de cetosis. Cumplen una función práctica que conviene no despreciar, que es resolver el antojo dulce de la noche sin romper nada, y eso hace que mucha gente sostenga la dieta.",
    elegir:
      "Cualquiera «zero» o «sin azúcar». La versión «light» de algunas marcas viejas no siempre es cero: la etiqueta manda.",
    guardar: "Sin misterio.",
    error:
      "Tomarlas todo el día en lugar de agua. No rompen la dieta, pero tampoco hidratan igual, y en keto la hidratación y el sodio son la mitad de cómo uno se siente en las primeras semanas.",
  },

  agua: {
    porque:
      "En keto se orina más: al bajar la insulina, el riñón retiene menos sodio y con el sodio se va el agua. Eso es lo que produce el dolor de cabeza, el mareo y los calambres de los primeros días. El agua es literalmente parte del tratamiento.",
    elegir:
      "Con o sin gas, da igual. La con gas ayuda a la sensación de saciedad de quien está ayunando.",
    guardar: "—",
    error:
      "Tomar mucha agua sin reponer sal. Es contraintuitivo y es la causa más común del malestar de la primera semana: tomar litros sin sodio diluye todavía más lo poco que queda. Un caldo salado a media tarde resuelve buena parte del cuadro.",
  },

  cerveza: {
    porque:
      "Es maltosa, que es azúcar de cereal: doce gramos por vaso, y nadie toma un solo vaso. Es la peor opción alcohólica con diferencia, y la «sin alcohol» es todavía peor, porque al no fermentar del todo le queda más azúcar sin convertir.",
    elegir:
      "Si va a haber alcohol, destilados puros con soda —cero carbohidratos— o vino seco, tinto o blanco, que son tres o cuatro gramos por copa.",
    guardar: "—",
    error:
      "Pensar sólo en los carbohidratos. Mientras el hígado procesa alcohol deja de producir cuerpos cetónicos, así que cualquier trago frena la cetosis un rato aunque no tenga azúcar. El daño de la cerveza es doble.",
  },

  jugos: {
    porque:
      "Once gramos por cada cien mililitros, y en formato líquido, que es el peor: no sacia nada y se toma rápido. Un vaso de jugo «natural» exprimido tiene el azúcar de tres naranjas y ninguna de sus fibras.",
    elegir:
      "Las aguas saborizadas **zero** sí entran y resuelven lo mismo. Las comunes, no.",
    guardar: "—",
    error:
      "Distinguir entre jugo de caja y jugo natural como si fuera la diferencia relevante. Para esta dieta son casi lo mismo: el problema es el azúcar de la fruta concentrada sin su fibra, no el conservante.",
  },
};

/**
 * La ficha larga de un producto.
 *
 * Devuelve `null` si todavía no se escribió: la página del producto muestra
 * entonces sólo lo de góndola, en lugar de romper el build o publicar una
 * plantilla vacía con títulos sin contenido debajo.
 */
export function detalle(slug) {
  return INGREDIENTES[slug] ?? null;
}

/** Cuántos productos tienen ficha larga. Lo usa el índice para no prometer una
 *  página de detalle que todavía no dice nada. */
export function tieneDetalle(slug) {
  return Boolean(INGREDIENTES[slug]);
}
