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
];
