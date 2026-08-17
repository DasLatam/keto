// "Qué sí, qué no, negociemos" — comparativas honestas.
//
// La idea de esta sección: la mayoría de las guías keto contestan con un "no" y
// listo. La gente igual va a tomar algo en un cumpleaños, así que sirve más
// explicar **cuál de las opciones hace menos daño y por qué**, con el número
// adelante.
//
// Formato pensado para GEO/AEO: cada comparativa arranca con un `veredicto` de
// una o dos oraciones —que es lo que un modelo de IA cita como respuesta
// directa— y sigue con la tabla y el desarrollo.
//
// `carbos` son gramos netos por la `porcion` indicada en cada opción, no por
// 100 g: la pregunta real no es "cuántos carbos tiene el vino" sino "cuántos me
// como si me tomo una copa".

export const CATEGORIAS_NEG = [
  { id: "bebidas", nombre: "Bebidas y alcohol" },
  { id: "carbos", nombre: "Los clásicos con almidón" },
  { id: "panificados", nombre: "Pan y galletitas" },
  { id: "dulce", nombre: "Lo dulce" },
  { id: "fiambres", nombre: "Fiambres y quesos" },
  { id: "frutas", nombre: "Frutas" },
];

export const NEGOCIACIONES = [
  {
    slug: "cerveza-vino-o-whisky",
    categoria: "bebidas",
    titulo: "¿Cerveza, vino o whisky?",
    pregunta: "Si voy a tomar alcohol en keto, ¿cuál conviene?",
    resumen: "Los destilados puros no tienen carbohidratos, el vino seco tiene pocos y la cerveza es la peor opción con diferencia.",
    veredicto:
      "El whisky gana por lejos: destilado puro, cero carbohidratos. El vino tinto o blanco seco es la segunda opción, con unos 3 a 4 gramos por copa. La cerveza queda afuera: una pinta puede tener más carbohidratos que todo tu día.",
    opciones: [
      { nombre: "Whisky, vodka, gin, ron blanco (solos o con soda)", porcion: "1 medida de 45 ml", carbos: 0, estado: "si",
        texto: "La destilación deja el azúcar atrás: quedan cero carbohidratos. El problema aparece con la mezcla, no con el destilado." },
      { nombre: "Vino tinto o blanco seco", porcion: "1 copa de 150 ml", carbos: 3.5, estado: "negociable",
        texto: "Un Malbec o un Torrontés seco entran en el presupuesto de un día. Los dulces y los espumantes demi-sec, no." },
      { nombre: "Fernet con Coca Zero", porcion: "1 medida de fernet", carbos: 6, estado: "negociable",
        texto: "El fernet lleva azúcar en su formulación, unos 6 g por medida. Con Coca Zero en vez de común, el trago pasa de 30 g a 6." },
      { nombre: "Cerveza", porcion: "1 pinta de 473 ml", carbos: 13, estado: "no",
        texto: "Maltosa, que es azúcar de cereal. La rubia común ronda los 13 g por pinta y las artesanales negras bastante más." },
      { nombre: "Tragos con gaseosa común, jugo o licor", porcion: "1 vaso", carbos: 25, estado: "no",
        texto: "El destilado no aporta nada, pero la mezcla sí. Un gin tonic con tónica común son 22 g de azúcar." },
    ],
    desarrollo: [
      "Antes que el número de carbohidratos hay algo más importante: mientras el hígado procesa alcohol, deja de producir cetonas. La cetosis se frena unas horas, tomes lo que tomes. Por eso el alcohol en keto no es sólo cuestión de elegir bien, sino de que sea ocasional.",
      "Dicho eso, si vas a tomar, la diferencia entre opciones es enorme. Un whisky con hielo y una pinta de cerveza no juegan el mismo deporte: uno tiene cero carbohidratos y el otro tiene los mismos que dos rebanadas de pan.",
      "La trampa argentina más común es el fernet. El destilado no es el problema: el fernet ya viene azucarado de fábrica, y encima se toma con Coca. Cambiando a Coca Zero el trago baja de unos 30 gramos a 6, que es la diferencia entre romper el día y no.",
      "Y una advertencia práctica: en cetosis la tolerancia al alcohol baja bastante. Sin las reservas de glucógeno haciendo de amortiguador, la misma cantidad pega bastante más rápido de lo que estás acostumbrado.",
    ],
    faq: [
      { p: "¿El vino tinto tiene menos carbohidratos que el blanco?", r: "Prácticamente lo mismo si los dos son secos: entre 3 y 4 gramos por copa. Lo que importa no es el color sino el azúcar residual, así que un blanco seco es mejor opción que un tinto dulce." },
      { p: "¿La cerveza sin alcohol sirve?", r: "No, es peor. Al no fermentar del todo queda más azúcar sin convertir: suele tener más carbohidratos que la común." },
      { p: "¿Se puede tomar fernet en keto?", r: "Con Coca Zero y en cantidad moderada, entra. El fernet aporta unos 6 gramos de carbohidratos por medida, así que uno se puede negociar y tres no." },
    ],
  },

  {
    slug: "lentejas-porotos-choclo-arvejas-garbanzos",
    categoria: "carbos",
    titulo: "¿Lentejas, porotos, choclo, arvejas o garbanzos?",
    pregunta: "De las legumbres y el choclo, ¿se salva alguno?",
    resumen: "Ninguno entra en una porción normal. Si hay que elegir, las arvejas en cantidad chica son lo menos malo y el choclo lo peor.",
    veredicto:
      "En keto estricto no entra ninguno: todos superan los 15 gramos de carbohidratos netos por porción, cuando el día entero son 20 a 50. Si tenés que elegir en una comida familiar, un par de cucharadas de arvejas es lo menos dañino; el choclo y los garbanzos son los peores.",
    opciones: [
      { nombre: "Arvejas", porcion: "½ taza", carbos: 7, estado: "negociable",
        texto: "La menos mala del grupo, y en porción de guarnición —dos cucharadas, no media taza— se puede negociar en una comida." },
      { nombre: "Lentejas", porcion: "1 taza cocidas", carbos: 24, estado: "no",
        texto: "Mucha fibra y mucha proteína, pero 24 g netos por taza. Nutritivas de verdad; simplemente no son keto." },
      { nombre: "Porotos negros o alubias", porcion: "1 taza cocidos", carbos: 26, estado: "no",
        texto: "Casi lo mismo que las lentejas. Media taza ya se lleva medio día de carbohidratos." },
      { nombre: "Garbanzos", porcion: "1 taza cocidos", carbos: 32, estado: "no",
        texto: "Los más altos del grupo. Un plato de hummus con verduras puede pasar los 30 g sin que te des cuenta." },
      { nombre: "Choclo", porcion: "1 unidad mediana", carbos: 25, estado: "no",
        texto: "No es una verdura, es un cereal. Un choclo con manteca puede ser tu día entero de carbohidratos." },
    ],
    desarrollo: [
      "Este grupo genera confusión porque son alimentos sanos. Y lo son: las lentejas tienen fibra, hierro y proteína vegetal, y en una dieta normal son excelentes. El problema es específico de keto — con un presupuesto de 20 a 50 gramos por día, una taza de lentejas se lleva casi todo.",
      "El choclo merece un párrafo aparte porque casi todo el mundo lo clasifica como verdura. Botánicamente es un grano, un cereal, y nutricionalmente se comporta como tal. Está más cerca de la polenta que de la lechuga, y la polenta —que es choclo molido— nadie duda de que queda afuera.",
      "¿Y qué se pone en el plato en lugar de esto? El coliflor es el reemplazo más versátil: procesado reemplaza al arroz, hervido y pisado reemplaza al puré. Para el volumen y la sensación de plato lleno, las verduras de hoja y el zapallito no tienen techo.",
      "Un caso que sí se puede negociar: la chaucha. Es una legumbre pero se come inmadura, con la vaina, y tiene sólo 4 gramos netos por taza. Esa entra sin discusión.",
    ],
    faq: [
      { p: "¿Las lentejas tienen menos carbohidratos que los porotos?", r: "Un poco: unos 24 gramos netos por taza cocida contra 26 de los porotos negros. La diferencia es demasiado chica para que cambie la conclusión — ninguno entra en keto." },
      { p: "¿El choclo es una verdura?", r: "No. Es un cereal, un grano, igual que el trigo o el arroz. Por eso tiene unos 25 gramos de carbohidratos netos por unidad y se comporta como un alimento con almidón, no como una verdura." },
      { p: "¿Qué legumbre se puede comer en keto?", r: "La chaucha, con unos 4 gramos netos por taza, porque se come inmadura y con vaina. Las arvejas frescas en porción chica también se pueden negociar." },
    ],
  },

  {
    slug: "salvado-chipa-o-galletas-de-arroz",
    categoria: "panificados",
    titulo: "¿Salvado, chipá o galletas de arroz?",
    pregunta: "Cuando necesito algo tipo pan o galletita, ¿qué elijo?",
    resumen: "El chipá es la mejor de las tres y las galletas de arroz son la peor, aunque tengan fama de saludables.",
    veredicto:
      "El chipá gana: es almidón de mandioca pero lleva mucho queso y huevo, así que por unidad son unos 6 gramos de carbohidratos. Las galletas de arroz son la peor opción de las tres pese a su fama light: son almidón casi puro y el cuerpo las procesa como azúcar.",
    opciones: [
      { nombre: "Pan keto de harina de almendras", porcion: "1 rebanada", carbos: 2, estado: "si",
        texto: "La única opción que es keto de verdad. Se hace en 3 minutos al microondas y es el reemplazo que evita que abandones." },
      { nombre: "Chipá", porcion: "1 unidad chica", carbos: 6, estado: "negociable",
        texto: "Almidón de mandioca, sí, pero con mucho queso y huevo que bajan la carga total. Uno se negocia; cuatro con el mate, no." },
      { nombre: "Pan de salvado", porcion: "1 rebanada", carbos: 11, estado: "no",
        texto: "El salvado agrega fibra, pero la base sigue siendo harina de trigo. Es pan un poco mejor, no pan keto." },
      { nombre: "Galletas de arroz", porcion: "2 unidades", carbos: 15, estado: "no",
        texto: "Su fama de saludables viene de que tienen pocas calorías. Pero son almidón inflado: índice glucémico altísimo, casi nada de fibra y no sacian nada." },
    ],
    desarrollo: [
      "Las galletas de arroz son el caso más claro de un alimento con buena prensa y mal perfil para keto. Son livianas y tienen pocas calorías, y de ahí sacaron la fama. Pero la pregunta en keto no es cuántas calorías tiene algo, sino cuánto te sube la glucosa — y el arroz inflado la sube tanto o más que el pan blanco.",
      "El pan de salvado es la trampa del supermercado. Dice integral, dice fibra, viene en un envase con hojitas verdes. Y es pan: la base es harina de trigo, el salvado es un agregado. Una rebanada tiene unos 11 gramos netos, la mitad de tu día si estás en 20.",
      "El chipá zafa por una razón interesante: la receta no es sólo almidón. Lleva tanto queso y tanto huevo que la proporción de carbohidratos por unidad baja bastante, y encima la grasa y la proteína hacen que se absorba más lento. Sigue sin ser keto, pero es la mejor de las tres si estás en un café y no hay otra cosa.",
      "La salida real es no negociar con ninguna: el pan de taza con harina de almendras se hace en tres minutos, tiene 2 gramos y resuelve el antojo. Es la receta que más gente reporta como la que le permitió sostener la dieta.",
    ],
    faq: [
      { p: "¿Las galletas de arroz son keto?", r: "No. Son almidón de arroz inflado: unos 7 a 8 gramos de carbohidratos netos por unidad y casi nada de fibra o grasa que frene la absorción. Su fama de saludables viene de tener pocas calorías, que es una métrica distinta." },
      { p: "¿Puedo comer chipá en keto?", r: "Uno ocasional se puede negociar: son unos 6 gramos por unidad chica, porque el queso y el huevo bajan la proporción de almidón. Lo que no entra es la porción habitual de tres o cuatro con el mate." },
      { p: "¿El pan integral o de salvado sirve para keto?", r: "No. La base sigue siendo harina de trigo y una rebanada ronda los 11 gramos netos. El salvado suma fibra pero no cambia la categoría del alimento." },
    ],
  },

  {
    slug: "stevia-eritritol-o-sucralosa",
    categoria: "dulce",
    titulo: "¿Stevia, eritritol o sucralosa?",
    pregunta: "¿Con qué endulzo sin romper la cetosis?",
    resumen: "Los tres sirven para la cetosis. El eritritol es el mejor para cocinar, la stevia para el café y el mate.",
    veredicto:
      "Ninguno de los tres aporta carbohidratos que cuenten, así que los tres sirven. El eritritol es el mejor para repostería porque tiene cuerpo y se comporta como el azúcar; la stevia rinde más para endulzar líquidos pero deja un dejo amargo que a mucha gente le molesta en el mate.",
    opciones: [
      { nombre: "Eritritol", porcion: "1 cucharada", carbos: 0, estado: "si",
        texto: "Poliol que el cuerpo casi no absorbe. Aporta volumen, así que es el único que reemplaza al azúcar en una receta sin rehacer las proporciones. En cantidad grande puede caer pesado." },
      { nombre: "Stevia", porcion: "1 sobre", carbos: 0, estado: "si",
        texto: "De hoja, sin efecto sobre la glucosa. Rinde muchísimo. El dejo amargo se nota más en el mate que en el café." },
      { nombre: "Sucralosa", porcion: "1 sobre", carbos: 0, estado: "si",
        texto: "Es la de la mayoría de los edulcorantes de mesa argentinos. No afecta la cetosis. Ojo con las versiones en polvo, que vienen cortadas con maltodextrina." },
      { nombre: "Miel, azúcar mascabo, azúcar rubia", porcion: "1 cucharada", carbos: 17, estado: "no",
        texto: "Son azúcar. Que sean naturales o menos refinadas no cambia lo que le hacen a la glucosa." },
    ],
    desarrollo: [
      "La pregunta que casi nadie hace y es la importante: fijate qué dice la letra chica del envase. Muchos edulcorantes en polvo que se venden como 'cero' vienen cortados con maltodextrina o dextrosa para darles volumen, y esas dos son azúcar con otro nombre. Un sobre puede tener un gramo de carbohidratos que no figura en el frente del paquete.",
      "Los líquidos y las pastillas casi nunca tienen ese problema, porque no necesitan relleno. Si dudás, esa es la forma más segura.",
      "Sobre la miel y el azúcar mascabo: se venden como alternativas saludables y para keto son idénticas al azúcar blanca. La miel tiene incluso un poco más de carbohidratos por cucharada. Que un endulzante sea natural no dice nada sobre lo que le hace a tu glucosa.",
    ],
    faq: [
      { p: "¿La stevia rompe la cetosis?", r: "No. La stevia pura no aporta carbohidratos digeribles ni eleva la glucosa. Lo único a revisar es si el producto viene cortado con maltodextrina, que sí aporta azúcar." },
      { p: "¿Cuál es el mejor edulcorante para repostería keto?", r: "El eritritol, porque aporta volumen y se comporta parecido al azúcar en la masa. Con stevia o sucralosa hay que ajustar la receta, ya que endulzan mucho pero no ocupan lugar." },
      { p: "¿La miel se puede en keto?", r: "No. Una cucharada tiene unos 17 gramos de carbohidratos, prácticamente lo mismo que el azúcar común." },
    ],
  },

  {
    slug: "leche-entera-descremada-almendras-o-coco",
    categoria: "bebidas",
    titulo: "¿Leche entera, descremada, de almendras o de coco?",
    pregunta: "¿Qué le pongo al café si la leche tiene carbohidratos?",
    resumen: "La de almendras sin azúcar es la mejor. Entre las de vaca, la entera le gana a la descremada.",
    veredicto:
      "La leche de almendras sin azúcar es la ganadora clara: menos de 1 gramo por vaso. Entre las de vaca, la entera es mejor que la descremada, algo que sorprende a mucha gente: sacarle la grasa no le saca la lactosa, así que la descremada tiene incluso un poquito más de azúcar por vaso.",
    opciones: [
      { nombre: "Leche de almendras sin azúcar", porcion: "1 vaso de 200 ml", carbos: 0.6, estado: "si",
        texto: "La mejor opción. Sin azúcar agregada: la versión común viene endulzada y salta a 12 g." },
      { nombre: "Crema de leche", porcion: "2 cucharadas", carbos: 0.9, estado: "si",
        texto: "Lo que usa casi todo el mundo en keto para el café. Aporta grasa y saciedad, y en esa cantidad casi no suma carbohidratos." },
      { nombre: "Leche de coco", porcion: "1 vaso de 200 ml", carbos: 3, estado: "si",
        texto: "La de cartón para tomar, no la de lata para cocinar, que es mucho más concentrada. Le da un sabor propio que no a todos les gusta en el café." },
      { nombre: "Leche entera de vaca", porcion: "1 vaso de 200 ml", carbos: 9.4, estado: "negociable",
        texto: "Casi 10 gramos por vaso. Un chorrito en el café se puede; un vaso, difícil." },
      { nombre: "Leche descremada", porcion: "1 vaso de 200 ml", carbos: 10, estado: "no",
        texto: "Peor que la entera: al sacarle grasa queda proporcionalmente más lactosa, y sacia menos." },
    ],
    desarrollo: [
      "Lo de la leche descremada es contraintuitivo y vale la pena entenderlo, porque se repite en muchos productos light. La lactosa —el azúcar de la leche— no está en la grasa: está en la parte acuosa. Cuando le sacás la grasa, la lactosa se queda entera y ahora representa una porción mayor de lo que tomás. Sumale que sin grasa sacia menos y terminás tomando más.",
      "Es el mismo mecanismo que hace que el queso untable light sea peor que el común para keto: le sacan grasa y la reemplazan con almidones y estabilizantes para que mantenga la textura.",
      "En la práctica, la mayoría de la gente que hace keto en Argentina termina tomando el café con crema. Es lo más barato de conseguir, aporta grasa y saciedad, y con dos cucharadas ni siquiera llegás a un gramo de carbohidratos.",
    ],
    faq: [
      { p: "¿La leche descremada es mejor que la entera para keto?", r: "No, es peor. Sacarle la grasa no le saca la lactosa: la descremada tiene alrededor de 10 gramos de carbohidratos por vaso contra 9,4 de la entera, y sacia menos." },
      { p: "¿Cuánta leche puedo tomar en keto?", r: "Un chorrito en el café, no mucho más. Un vaso de leche entera son casi 10 gramos, entre un quinto y la mitad del presupuesto diario según en qué nivel estés." },
      { p: "¿La leche de almendras sirve para keto?", r: "Sí, siempre que sea la versión sin azúcar: menos de 1 gramo por vaso. La común viene endulzada y llega a 12 gramos." },
    ],
  },
  {
    slug: "banana-manzana-frutilla-o-palta",
    categoria: "frutas",
    titulo: "¿Banana, manzana, frutilla o palta?",
    pregunta: "¿Qué fruta puedo comer sin salirme de cetosis?",
    resumen: "La palta y los frutos rojos entran cómodos. La banana es la peor de todas y una sola puede ser tu día entero.",
    veredicto:
      "La palta es la única fruta que se puede comer sin pensar: 2 gramos netos por media unidad. Los frutos rojos entran en porción chica. La manzana ya se lleva medio día de carbohidratos y la banana, en una sola unidad, se lleva el día completo si estás en 20 gramos.",
    opciones: [
      { nombre: "Palta", porcion: "½ unidad", carbos: 2, estado: "si",
        texto: "Botánicamente es una fruta y es la reina de keto: casi todo grasa, casi nada de azúcar." },
      { nombre: "Frutillas", porcion: "1 taza", carbos: 8, estado: "negociable",
        texto: "La mejor de las frutas dulces. Una taza entra si el resto del día viene tranquilo." },
      { nombre: "Arándanos", porcion: "½ taza", carbos: 9, estado: "negociable",
        texto: "Más concentrados que la frutilla: media taza ya son 9 gramos. Van de a puñado, no de a bol." },
      { nombre: "Manzana", porcion: "1 unidad mediana", carbos: 20, estado: "no",
        texto: "La fruta \u00absana\u00bb por excelencia, y son 20 g netos: el día entero si estás en keto estricto." },
      { nombre: "Banana", porcion: "1 unidad mediana", carbos: 24, estado: "no",
        texto: "La más alta de las frutas comunes. Nada que hacer en keto, ni siquiera media." },
      { nombre: "Uvas", porcion: "1 taza", carbos: 26, estado: "no",
        texto: "El problema es que se comen sin registrar cuántas van. Un racimo chico se pasa de los 30 g." },
    ],
    desarrollo: [
      "La regla que sirve para no memorizar tablas: cuanto más dulce sabe una fruta, más carbohidratos tiene. Es obvio y funciona. La palta no sabe dulce y tiene 2 gramos; la banana sabe muy dulce y tiene 24.",
      "La segunda regla es el tamaño de la porción real. Los frutos rojos entran no porque sean mágicos, sino porque se comen de a puñado. La uva tiene un problema parecido al del maní: se come sin contar, y ahí es donde se va el día.",
      "Mención especial para el limón: dos cucharadas de jugo tienen menos de 1 gramo. Es el condimento que salva ensaladas, pescados y agua saborizada casera sin costo de carbohidratos.",
    ],
    faq: [
      { p: "¿Qué frutas se pueden comer en keto?", r: "La palta sin restricción (2 gramos netos por media unidad) y los frutos rojos en porción chica: frutillas, arándanos, frambuesas. El limón y la lima también, como condimento." },
      { p: "¿Puedo comer una banana en keto?", r: "No. Una banana mediana tiene unos 24 gramos de carbohidratos netos, que es el presupuesto diario completo de una dieta keto estricta." },
      { p: "¿La manzana es keto?", r: "No. Una manzana mediana ronda los 20 gramos netos. Su fama de saludable es merecida en general, pero no la hace compatible con cetosis." },
    ],
  },

  {
    slug: "jamon-crudo-salame-mortadela-o-salchichas",
    categoria: "fiambres",
    titulo: "¿Jamón crudo, salame, mortadela o salchichas?",
    pregunta: "En la fiambrería, ¿qué llevo y qué dejo?",
    resumen: "El jamón crudo y el salame puro entran sin problema. La mortadela y las salchichas traen almidón y azúcar agregados.",
    veredicto:
      "El jamón crudo y el salame puro son prácticamente cero carbohidratos: sólo carne, sal y tiempo. La mortadela, las salchichas y el jamón cocido barato llevan almidón, fécula y azúcar como relleno, y ahí pueden aparecer entre 3 y 6 gramos cada 100 gramos.",
    opciones: [
      { nombre: "Jamón crudo", porcion: "100 g", carbos: 0.5, estado: "si",
        texto: "Carne, sal y estacionamiento. De lo más seguro que hay en la fiambrería." },
      { nombre: "Salame puro / longaniza", porcion: "100 g", carbos: 1, estado: "si",
        texto: "Fijate que diga puro. Los industriales baratos pueden traer fécula." },
      { nombre: "Bondiola curada", porcion: "100 g", carbos: 0.5, estado: "si",
        texto: "Igual que el crudo: carne y sal. Cara, pero rinde en poca cantidad." },
      { nombre: "Jamón cocido", porcion: "100 g", carbos: 3, estado: "negociable",
        texto: "Depende muchísimo de la marca. El de primera calidad ronda 1 g; el más económico llega a 5 por los agregados." },
      { nombre: "Mortadela", porcion: "100 g", carbos: 5, estado: "no",
        texto: "Lleva almidón como ligante. Además suele tener azúcar en la formulación." },
      { nombre: "Salchichas tipo viena", porcion: "2 unidades", carbos: 6, estado: "no",
        texto: "Fécula, azúcar y jarabe de maíz. De lo peor de la góndola para keto." },
    ],
    desarrollo: [
      "La lógica de este grupo es simple: cuanto más procesado y más barato, más relleno tiene. Los fiambres tradicionales —crudo, salame, bondiola— se hacen con carne, sal y tiempo, y no necesitan nada más. Los industriales usan almidón y fécula para dar textura y retener agua, porque el agua pesa y se vende.",
      "El jamón cocido es el caso donde más conviene leer la etiqueta, porque el rango es enorme. Uno de primera calidad tiene menos de 1 gramo cada 100. Uno económico puede tener 5, y la diferencia no se nota al comerlo.",
      "Un detalle que sorprende: buena parte de las pancetas ahumadas de góndola traen azúcar agregada en el curado. No es mucha, pero si desayunás panceta todos los días conviene buscar una sin.",
    ],
    faq: [
      { p: "¿El jamón crudo es keto?", r: "Sí, es de las mejores opciones de la fiambrería: alrededor de 0,5 gramos de carbohidratos cada 100 gramos, porque se hace sólo con carne, sal y estacionamiento." },
      { p: "¿Puedo comer mortadela en keto?", r: "No conviene. Lleva almidón como ligante y suele tener azúcar en la formulación: unos 5 gramos cada 100." },
      { p: "¿Qué fiambre tiene menos carbohidratos?", r: "El jamón crudo y la bondiola curada, con alrededor de 0,5 gramos cada 100. El salame puro está apenas arriba, en torno a 1 gramo." },
    ],
  },

  {
    slug: "coca-zero-agua-saborizada-o-soda",
    categoria: "bebidas",
    titulo: "¿Coca Zero, agua saborizada o soda?",
    pregunta: "¿Las gaseosas sin azúcar rompen la dieta?",
    resumen: "Las tres versiones zero no aportan carbohidratos. Las aguas saborizadas comunes sí, y engañan porque parecen agua.",
    veredicto:
      "Las gaseosas sin azúcar no tienen carbohidratos y no sacan de cetosis: Coca Zero, Paso de los Toros sin azúcar y Sprite Zero entran sin problema. La trampa está en las aguas saborizadas comunes, que parecen agua pero llevan entre 6 y 8 gramos de azúcar cada 200 ml.",
    opciones: [
      { nombre: "Agua y soda", porcion: "1 vaso", carbos: 0, estado: "si",
        texto: "En keto se pierde más líquido y sal. Tomar más agua de la que tomabas antes no es una recomendación genérica: previene la \u00abgripe keto\u00bb." },
      { nombre: "Gaseosas zero / sin azúcar", porcion: "1 lata", carbos: 0, estado: "si",
        texto: "Cero carbohidratos. Sirven para el antojo dulce sin costo, que es más útil de lo que parece cuando arrancás." },
      { nombre: "Agua saborizada zero", porcion: "1 botella", carbos: 0, estado: "si",
        texto: "Fijate que diga zero o sin azúcar. La diferencia con la común es el día entero de carbohidratos." },
      { nombre: "Agua saborizada común", porcion: "500 ml", carbos: 17, estado: "no",
        texto: "La trampa más común del kiosco: parece agua, se toma como agua, y tiene casi tanta azúcar como una gaseosa." },
      { nombre: "Jugos exprimidos y de caja", porcion: "1 vaso", carbos: 22, estado: "no",
        texto: "Aun el natural sin azúcar agregada es azúcar de fruta sin la fibra que la frenaba." },
    ],
    desarrollo: [
      "Sobre los edulcorantes de las gaseosas zero hay mucho ruido. Lo que muestra la evidencia disponible es que no elevan la glucosa ni la insulina de forma significativa, así que no interrumpen la cetosis. Lo que sí puede pasar, y varía mucho entre personas, es que el sabor dulce mantenga el antojo de dulce.",
      "La hidratación merece un párrafo propio porque es la causa número uno de que la gente la pase mal la primera semana. Al bajar los carbohidratos, el cuerpo vacía las reservas de glucógeno y con ellas elimina el agua que retenían, y con el agua se van sodio, potasio y magnesio. El dolor de cabeza y los calambres de los primeros días casi siempre son eso.",
      "La solución es poco elegante y bastante efectiva: tomar más agua de la que tomabas y salar la comida más de lo que te enseñaron. Un caldo con sal a la tarde resuelve buena parte de la gripe keto.",
    ],
    faq: [
      { p: "¿La Coca Zero saca de cetosis?", r: "No. No aporta carbohidratos ni eleva la glucosa de forma significativa, así que no interrumpe la cetosis. Lo único a tener en cuenta es que a algunas personas el sabor dulce les mantiene el antojo." },
      { p: "¿Las aguas saborizadas son keto?", r: "Sólo las versiones zero o sin azúcar. Las comunes tienen entre 6 y 8 gramos de azúcar cada 200 ml, unos 17 gramos en una botella de medio litro." },
      { p: "¿Cuánta agua hay que tomar en keto?", r: "Más de la habitual. Al vaciarse las reservas de glucógeno se pierde el agua que retenían junto con sodio, potasio y magnesio, y esa pérdida es la causa más común del dolor de cabeza y los calambres de los primeros días." },
    ],
  },
  {
    slug: "mani-almendras-nueces-o-castanas",
    categoria: "carbos",
    titulo: "¿Maní, almendras, nueces o castañas de cajú?",
    pregunta: "¿Qué fruto seco puedo comer de colación?",
    resumen: "Las nueces y las nueces pecán son las mejores. Las castañas de cajú son las peores y el maní tiene un problema aparte: no se para de comer.",
    veredicto:
      "La nuez es la ganadora: unos 2 gramos netos por puñado de 30 gramos. La almendra está muy cerca. Las castañas de cajú son las más altas del grupo y quedan afuera. Con el maní el problema no es tanto el número —4 gramos por puñado— sino que es el fruto seco que más se come sin registrar cuánto va.",
    opciones: [
      { nombre: "Nueces y nueces pecán", porcion: "30 g (un puñado)", carbos: 2, estado: "si",
        texto: "Las mejores del grupo. Mucha grasa, poca carga de carbohidratos y saciedad alta." },
      { nombre: "Almendras", porcion: "30 g", carbos: 2.5, estado: "si",
        texto: "Prácticamente empatadas con la nuez. Tostadas con sal y pimentón hacen una colación difícil de superar." },
      { nombre: "Avellanas", porcion: "30 g", carbos: 2, estado: "si",
        texto: "Bajas y sabrosas, pero caras y difíciles de conseguir fuera de dietéticas." },
      { nombre: "Maní", porcion: "30 g", carbos: 4, estado: "negociable",
        texto: "El número entra. El problema es el pote: se come sin contar y treinta gramos son unos veinte maníes, no un bol." },
      { nombre: "Pistachos", porcion: "30 g", carbos: 5, estado: "negociable",
        texto: "Un poco más altos. Tienen a favor que pelarlos obliga a comer despacio y a registrar cuántos van." },
      { nombre: "Castañas de cajú", porcion: "30 g", carbos: 8, estado: "no",
        texto: "Las más altas con diferencia: un puñado ya es casi la mitad de un día en keto estricto." },
    ],
    desarrollo: [
      "En este grupo la trampa no es la tabla nutricional, es la porción. Casi todos los frutos secos entran si se comen de a treinta gramos, que es un puñado chico. El problema aparece cuando el envase queda abierto en la mesa mientras mirás una serie.",
      "Un truco que funciona: servite la porción en un plato chico y guardá el paquete antes de sentarte. Suena tonto y es la diferencia entre 2 gramos y 15.",
      "Aparte, ojo con los mixes de frutos secos de kiosco: casi siempre traen pasas de uva o arándanos azucarados, y esas dos cosas son las que se llevan el día.",
    ],
    faq: [
      { p: "¿Qué fruto seco tiene menos carbohidratos?", r: "Las nueces, las nueces pecán y las avellanas, con alrededor de 2 gramos netos por puñado de 30 gramos. Las almendras están apenas arriba, en 2,5." },
      { p: "¿Se puede comer maní en keto?", r: "Sí, un puñado de 30 gramos tiene unos 4 gramos netos. El riesgo no es el número sino la cantidad: es el fruto seco que más se come sin registrar." },
      { p: "¿Las castañas de cajú son keto?", r: "No conviene. Con unos 8 gramos netos cada 30, un solo puñado se lleva casi la mitad del presupuesto diario de una dieta keto estricta." },
    ],
  },

  {
    slug: "mozzarella-cremoso-untable-o-light",
    categoria: "fiambres",
    titulo: "¿Muzzarella, cremoso, untable o light?",
    pregunta: "En la quesería, ¿cuál conviene para keto?",
    resumen: "Los quesos duros y el cremoso son los mejores. Los light son la peor opción, aunque parezca al revés.",
    veredicto:
      "Los quesos duros —sardo, reggianito, provolone— son casi cero carbohidratos y ganan cómodos. El cremoso y la muzzarella entran sin problema. Los quesos light son la peor opción del grupo: al sacarles grasa, la proporción de lactosa sube y además les agregan almidones y estabilizantes para sostener la textura.",
    opciones: [
      { nombre: "Quesos duros (sardo, reggianito, provolone, parmesano)", porcion: "100 g", carbos: 1, estado: "si",
        texto: "Los más seguros y los que más sabor dan por gramo. Rallados rinden muchísimo." },
      { nombre: "Queso cremoso", porcion: "100 g", carbos: 2, estado: "si",
        texto: "El de todos los días. Barato, en cualquier kiosco y sin sorpresas en la etiqueta." },
      { nombre: "Muzzarella", porcion: "100 g", carbos: 3, estado: "si",
        texto: "Entra sin problema. Es la base de la pizza con masa de coliflor." },
      { nombre: "Queso untable entero", porcion: "100 g", carbos: 3, estado: "si",
        texto: "Finlandia, Casancrem, Mendicrim. La versión entera, no la light." },
      { nombre: "Ricota entera", porcion: "100 g", carbos: 3, estado: "negociable",
        texto: "Más alta que el resto y con menos grasa, así que sacia menos. Entra en porción moderada." },
      { nombre: "Quesos untables light", porcion: "100 g", carbos: 6, estado: "no",
        texto: "Le sacan grasa y le ponen almidón y estabilizantes para compensar la textura. Peor que el entero en todos los sentidos." },
    ],
    desarrollo: [
      "El mecanismo del queso light es exactamente el mismo que el de la leche descremada, y por eso conviene entenderlo una vez y aplicarlo a toda la góndola. La lactosa —el azúcar del lácteo— está en la parte acuosa, no en la grasa. Si le sacás grasa, la lactosa se queda entera y ahora ocupa una proporción mayor del producto.",
      "Y hay un segundo efecto: sin grasa, la textura se cae. Para arreglarlo, la industria agrega almidones, gomas y estabilizantes. Ahí es donde aparecen los carbohidratos que no esperabas.",
      "La regla práctica en la quesería es simple: cuanto más duro y más estacionado el queso, menos lactosa le queda, porque parte se fermenta durante la maduración. Por eso un parmesano de dos años tiene prácticamente cero.",
      "Un caso a mirar con lupa: los quesos untables saborizados, con hierbas o con verdeo. Muchos traen azúcar en la formulación aunque el sabor sea salado.",
    ],
    faq: [
      { p: "¿El queso light es mejor para keto?", r: "No, es peor. Al sacarle grasa sube la proporción de lactosa y además se le agregan almidones y estabilizantes para sostener la textura: unos 6 gramos cada 100 contra 3 del entero." },
      { p: "¿Qué queso tiene menos carbohidratos?", r: "Los duros y estacionados: sardo, reggianito, provolone y parmesano, con alrededor de 1 gramo cada 100. Durante la maduración parte de la lactosa se fermenta." },
      { p: "¿Se puede comer muzzarella en keto?", r: "Sí, unos 3 gramos cada 100. Es la base de la pizza con masa de coliflor y entra sin problema en una porción normal." },
    ],
  },

  {
    slug: "harina-de-almendras-coco-o-lino",
    categoria: "panificados",
    titulo: "¿Harina de almendras, de coco o de lino?",
    pregunta: "Para hacer pan o repostería keto, ¿cuál uso?",
    resumen: "La de almendras es la más versátil y la más fácil de usar. La de coco rinde el triple pero cambia toda la receta.",
    veredicto:
      "La harina de almendras es la mejor para empezar: se comporta parecido a la harina común y es la que usan casi todas las recetas keto. La de coco es más barata por lo que rinde, pero absorbe tanto líquido que hay que usar un tercio de la cantidad y sumar más huevo. La de lino es la más económica y sirve sobre todo mezclada, no sola.",
    opciones: [
      { nombre: "Harina de almendras", porcion: "100 g", carbos: 7, estado: "si",
        texto: "La más versátil y la que piden casi todas las recetas. Se consigue en dietéticas a granel, bastante más barata que en el súper." },
      { nombre: "Harina de coco", porcion: "100 g", carbos: 8, estado: "si",
        texto: "Absorbe muchísimo: se usa un tercio de lo que pediría una receta con almendras, y hay que sumar un huevo extra por cada cuarto de taza." },
      { nombre: "Harina de lino", porcion: "100 g", carbos: 2, estado: "si",
        texto: "La más baja en carbohidratos y la más barata. Sabor fuerte y color oscuro: rinde mejor mezclada con almendras que sola." },
      { nombre: "Psyllium", porcion: "1 cucharada", carbos: 1, estado: "si",
        texto: "No es una harina sino un aglutinante. Es el ingrediente que hace que el pan keto no se desarme, y en dietéticas sale muy poco." },
      { nombre: "Harina de garbanzo", porcion: "100 g", carbos: 45, estado: "no",
        texto: "Se vende en las mismas góndolas que las anteriores y no es keto: es legumbre molida." },
      { nombre: "Harina integral o de avena", porcion: "100 g", carbos: 60, estado: "no",
        texto: "Que sea integral no la hace baja en carbohidratos. Sigue siendo cereal." },
    ],
    desarrollo: [
      "El error más común al empezar con repostería keto es reemplazar harina de trigo por harina de almendras en la misma proporción y esperar el mismo resultado. No funciona, y no es cuestión de cantidad: es que no hay gluten. El gluten es lo que da estructura y elasticidad, y sin él la masa no se sostiene sola.",
      "Por eso las recetas keto llevan mucho más huevo del que esperarías, y por eso aparece el psyllium: cumplen el rol que cumplía el gluten. Una receta de pan keto sin ningún aglutinante da un ladrillo que se desmorona al cortarlo.",
      "La harina de coco merece una advertencia propia porque su capacidad de absorción sorprende a todo el mundo. Un cuarto de taza de harina de coco absorbe lo mismo que una taza de harina de almendras. Si la sustituís uno a uno, el resultado es incomible: seco y arenoso.",
      "En cuanto a precio, la de lino es la más barata por lejos y se puede moler en casa con semillas de lino y una procesadora. El sabor es intenso, así que conviene usarla como parte de una mezcla y no como único ingrediente.",
    ],
    faq: [
      { p: "¿Puedo reemplazar harina de trigo por harina de almendras?", r: "No en la misma proporción ni esperando el mismo resultado. La harina de almendras no tiene gluten, que es lo que da estructura, así que las recetas keto necesitan más huevo y a menudo un aglutinante como el psyllium." },
      { p: "¿Cuánta harina de coco se usa en vez de harina de almendras?", r: "Alrededor de un tercio: un cuarto de taza de harina de coco absorbe lo mismo que una taza de harina de almendras. Además hay que sumar un huevo extra por cada cuarto de taza." },
      { p: "¿Qué harina keto es más barata?", r: "La de lino, que además se puede moler en casa con semillas y una procesadora. Tiene sabor intenso y color oscuro, así que rinde mejor mezclada con harina de almendras que usada sola." },
    ],
  },
];
