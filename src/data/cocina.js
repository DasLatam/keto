// Congelado, descongelado y trucos de cocina.
//
// Es la parte que ninguna receta cuenta y que decide si un plan de una semana se
// sostiene: cocinar de más y congelar bien es lo que salva el miércoles a las
// nueve de la noche, cuando la alternativa real no es otra receta sino el
// delivery.
//
// Escrito a mano, con el mismo criterio que las fichas de `ingredientes.js`: son
// afirmaciones sobre comida y no se generan.

// ══════════════════════════════════════════════════════════════════════════
// Congelar y descongelar
// ══════════════════════════════════════════════════════════════════════════

export const PRINCIPIOS_FREEZER = [
  {
    titulo: "Lo que arruina la comida congelada es el aire, no el frío",
    texto:
      "Esas manchas grises y secas en el borde de un bife no son «quemadura de frío» por estar demasiado frío: son deshidratación. El aire que queda dentro del paquete le roba humedad a la superficie durante meses. Por eso un envoltorio bien apretado, sin cámara de aire, conserva mejor que un tupper grande con la comida suelta adentro.",
  },
  {
    titulo: "Rápido para congelar, lento para descongelar",
    texto:
      "Congelar rápido forma cristales de hielo chicos, que rompen menos las células; congelar lento forma cristales grandes, que las revientan y hacen que al descongelar la comida suelte todo su líquido. Por eso conviene porciones finas y chatas antes que un bloque, y el estante de abajo del freezer antes que la puerta. Descongelar es al revés: cuanto más lento, menos líquido pierde.",
  },
  {
    titulo: "Se congela en la porción en que se va a comer",
    texto:
      "Es la regla que más veces se ignora y la que más comida termina en la basura. Un kilo de carne picada en un solo bloque obliga a descongelar el kilo entero para hacer una cena. Porcionado antes de congelar, se saca lo del día. Vale igual para la salsa, para el caldo y para la manteca.",
  },
  {
    titulo: "Etiquetar no es prolijidad, es que se coma",
    texto:
      "Todo se parece congelado. Sin fecha y sin nombre, lo del fondo del freezer se convierte en un bloque anónimo que nadie va a arriesgarse a cocinar. Una cinta de papel y una birome alcanzan: qué es, cuántas porciones y qué día entró.",
  },
];

export const COMO_CONGELAR = [
  {
    que: "Carne y pollo crudos",
    tiempo: "6 a 12 meses",
    como: "Porcionado en lo que se cocina de una vez, envuelto bien apretado en film y después en bolsa. Sacar todo el aire posible.",
    descongelar:
      "En la heladera, doce horas. Nunca sobre la mesada: la superficie llega a temperatura ambiente mucho antes que el centro y es donde se multiplican las bacterias.",
    ojo: "Lo que se descongeló crudo no se vuelve a congelar crudo. Sí se puede congelar ya cocinado.",
  },
  {
    que: "Pescado",
    tiempo: "3 meses",
    como: "Igual que la carne, pero es el que peor aguanta: pierde textura antes que ningún otro.",
    descongelar: "En heladera y sobre una rejilla, para que no quede en su propio líquido.",
    ojo: "Si venía congelado de la pescadería, no se recongela.",
  },
  {
    que: "Quesos duros",
    tiempo: "6 meses",
    como: "Rallados, en bolsa. También en trozo, aunque sale más quebradizo.",
    descongelar: "No hace falta: van directo del freezer a la preparación.",
    ojo: "Los blandos y los untables no: se cortan y quedan granulados.",
  },
  {
    que: "Manteca",
    tiempo: "6 meses",
    como: "En cubos, para no descongelar el pan entero por una cucharada.",
    descongelar: "En heladera, o directo a la sartén.",
    ojo: "Bien envuelta: absorbe olores incluso congelada.",
  },
  {
    que: "Crema de leche",
    tiempo: "3 meses",
    como: "En cubetera. Los cubos se pasan a una bolsa.",
    descongelar: "Directo a la salsa caliente, revolviendo.",
    ojo: "Al descongelar se separa. Vuelve con calor y movimiento, pero ya no se puede batir.",
  },
  {
    que: "Verduras de hoja y de volumen",
    tiempo: "8 a 12 meses",
    como: "Blanqueadas: treinta segundos en agua hirviendo, después a agua con hielo, escurrir y secar. El blanqueado frena las enzimas que las siguen envejeciendo aun congeladas.",
    descongelar: "Sin descongelar, directo a la sartén o a la tarta.",
    ojo: "Crudas también se pueden congelar, pero salen aguadas y sólo sirven para preparaciones cocidas.",
  },
  {
    que: "Palta",
    tiempo: "3 meses",
    como: "Pisada con un chorro de limón, en frasco chico.",
    descongelar: "En heladera.",
    ojo: "En gajos no. Sale con textura de jabón y no hay forma de recuperarla.",
  },
  {
    que: "Huevos",
    tiempo: "6 meses (claras)",
    como: "Sólo las claras, en cubetera. Las yemas se vuelven gomosas.",
    descongelar: "En heladera.",
    ojo: "Con cáscara nunca: se expande y revienta.",
  },
  {
    que: "Comida ya cocinada",
    tiempo: "3 meses",
    como: "Enfriar del todo antes de congelar. Meter algo tibio sube la temperatura de todo el freezer y descongela a medias lo que estaba al lado.",
    descongelar: "En heladera la noche anterior, y recalentar a fuego bajo.",
    ojo: "Las preparaciones con papa o con crema light son las que peor vuelven.",
  },
  {
    que: "Frutos rojos",
    tiempo: "12 meses",
    como: "Sueltos en una placa primero, y cuando están duros a la bolsa: así no se pegan en un bloque.",
    descongelar: "Sin descongelar, para licuados y postres.",
    ojo: "Descongelados quedan blandos: no sirven para decorar.",
  },
];

export const NO_SE_CONGELA = [
  ["Queso untable y quesos blandos", "se cortan y quedan granulados"],
  ["Crema ya batida", "se baja y suelta agua"],
  ["Mayonesa y salsas emulsionadas", "se separan sin arreglo"],
  ["Verduras crudas para ensalada", "salen aguadas"],
  ["Huevos duros", "la clara se pone gomosa"],
  ["Papa cocida", "queda arenosa (además no entra en la dieta)"],
];

// ══════════════════════════════════════════════════════════════════════════
// Trucos de cocina
// ══════════════════════════════════════════════════════════════════════════
//
// Están agrupados por lo que resuelven y no por técnica, porque nadie busca
// «reacción de Maillard»: busca «por qué la carne me queda gris».

export const TRUCOS = [
  {
    grupo: "Por qué no se dora",
    emoji: "🔥",
    intro:
      "El dorado es lo que separa un plato con gusto de uno insípido, y casi siempre falla por lo mismo: agua y temperatura. Mientras haya agua en la superficie, esa superficie no pasa de cien grados y la comida se hierve en lugar de dorarse.",
    items: [
      {
        t: "Secar antes de cocinar",
        d: "Papel de cocina sobre la carne, el pollo o el pescado, hasta que la superficie quede mate. Es el paso que más resultado da por menos trabajo, y el que más se saltea.",
      },
      {
        t: "Sartén caliente antes de que entre nada",
        d: "Si la comida entra en una sartén tibia, suelta su líquido antes de sellarse y se cocina en él. La prueba es una gota de agua: si baila y se desliza, está lista; si se queda quieta y burbujea, todavía no.",
      },
      {
        t: "No llenar la sartén",
        d: "Cada cosa que entra baja la temperatura. Amontonadas, sueltan vapor y se hierven entre ellas. Dos tandas de carne dorada valen más que una tanda gris, aunque den más trabajo.",
      },
      {
        t: "No tocarla",
        d: "La costra se forma por contacto sostenido. Moverla cada treinta segundos es lo que produce esa carne gris con líquido en la sartén.",
      },
      {
        t: "Salar la carne al final, la verdura al principio",
        d: "La sal saca agua. En la verdura eso conviene —zucchini y berenjena hay que salarlos y dejarlos escurrir veinte minutos—; en la carne, justo antes de la sartén, saca agua a la superficie y arruina el dorado. O se sala una hora antes, o se sala al final.",
      },
    ],
  },
  {
    grupo: "El huevo",
    emoji: "🥚",
    intro:
      "Es el ingrediente que más aparece en esta dieta y el que más fácil se arruina. Todo lo que se hace mal con el huevo es por exceso: exceso de fuego, de batido o de tiempo.",
    items: [
      {
        t: "Fuego bajo, siempre",
        d: "El huevo cuaja a temperatura baja. El revuelto seco y granulado y la tortilla con borde gomoso son fuego fuerte, no falta de técnica.",
      },
      {
        t: "Sacarlo antes de que esté listo",
        d: "Sigue cocinándose fuera del fuego con el calor que ya tiene. Si sale del fuego perfecto, en el plato está pasado.",
      },
      {
        t: "Batirlo poco",
        d: "Quince segundos alcanzan. Batido de más, el huevo incorpora aire y sale gomoso en vez de cremoso.",
      },
      {
        t: "Los duros, en agua fría desde el arranque",
        d: "Tirarlos en agua hirviendo los raja. Se ponen en agua fría, se lleva a hervor, se apaga y se dejan diez minutos tapados. Después, a agua con hielo: el golpe de frío separa la membrana y se pelan solos.",
      },
      {
        t: "El aro verde alrededor de la yema es tiempo de más",
        d: "No es peligroso, es hierro y azufre reaccionando. Aparece pasados los doce minutos y es la señal de que se cocinó de más.",
      },
    ],
  },
  {
    grupo: "Las masas sin harina",
    emoji: "🥐",
    intro:
      "La repostería keto no falla por las proporciones sino por esperar que la harina de almendras se comporte como la de trigo. Sin gluten no hay red que sostenga el aire, así que la estructura la tienen que dar el huevo, la fibra y el frío.",
    items: [
      {
        t: "Harina de coco no se reemplaza uno a uno",
        d: "Absorbe entre tres y cuatro veces más líquido que la de almendras. Un cuarto de taza de coco por cada taza de almendras, y un huevo extra.",
      },
      {
        t: "El psyllium es lo que evita que se desarme",
        d: "Forma un gel que hace de gluten. Sin él, el pan keto se rompe al cortarlo. Con demasiado, queda gomoso y tira a violeta.",
      },
      {
        t: "Dejar reposar la masa",
        d: "Diez minutos antes de hornear. La harina de almendras y el psyllium tardan en absorber; sin reposo, la masa parece líquida y uno le agrega harina de más.",
      },
      {
        t: "Enfriar antes de cortar",
        d: "Un pan keto caliente se desarma siempre. La estructura termina de armarse al enfriarse, y cortarlo tibio es lo que hace creer que la receta falló.",
      },
      {
        t: "Menos edulcorante del que dice el instinto",
        d: "Los edulcorantes de repostería son mucho más dulces que el azúcar y en exceso dejan regusto y sensación fría en la boca. Conviene arrancar por debajo y ajustar.",
      },
    ],
  },
  {
    grupo: "Que la verdura no quede aguada",
    emoji: "🥬",
    intro:
      "Zucchini, berenjena, zapallito y coliflor son casi todo agua. Si esa agua no se saca antes, sale durante la cocción y convierte cualquier plato en un guiso involuntario.",
    items: [
      {
        t: "Salar y escurrir",
        d: "Cortados, con sal gruesa, veinte minutos en un colador, y después secar con papel. Salen más firmes y además menos amargos, en el caso de la berenjena.",
      },
      {
        t: "El coliflor arroz, a sartén seca",
        d: "Procesado y salteado sin nada de líquido primero, para que evapore. Recién ahí la grasa. Con la grasa desde el arranque queda un puré.",
      },
      {
        t: "Los fideos de zucchini, sin hervir",
        d: "Se saltean un minuto o se comen crudos con la salsa caliente encima. Hervidos son agua con forma de fideo.",
      },
      {
        t: "Blanquear antes de congelar",
        d: "Treinta segundos en agua hirviendo y golpe de agua con hielo. Frena las enzimas que las siguen madurando dentro del freezer.",
      },
    ],
  },
  {
    grupo: "Sabor sin carbohidratos",
    emoji: "🧂",
    intro:
      "Lo que hace que una dieta se abandone no es el hambre: es el aburrimiento. Casi todo lo que da sabor —ácido, grasa, hierbas, fermentados— no tiene carbohidratos.",
    items: [
      {
        t: "Ácido al final",
        d: "Un chorro de limón o de vinagre sobre el plato terminado levanta todo. Es lo que más se extraña sin saberlo cuando se saca el pan y la salsa dulce.",
      },
      {
        t: "Dorar la manteca",
        d: "A fuego medio hasta que los sólidos se vuelven marrones y huele a nuez. Cambia por completo un pescado o una verdura, y no cuesta nada.",
      },
      {
        t: "Los fondos de la sartén no se lavan, se aprovechan",
        d: "Lo pegado después de dorar es sabor concentrado. Un chorro de agua, vino seco o crema y una cuchara de madera, y eso se convierte en salsa.",
      },
      {
        t: "Hierbas duras al principio, blandas al final",
        d: "Orégano, tomillo y laurel aguantan la cocción y necesitan tiempo para soltar. Perejil, albahaca y ciboulette se ponen apagados si se cocinan: van fuera del fuego.",
      },
      {
        t: "La grasa es el vehículo del sabor",
        d: "Muchos aromas son solubles en grasa y no en agua. Por eso el ajo se dora en aceite antes de sumar el resto, y no se tira al final.",
      },
    ],
  },
  {
    grupo: "Cocinar una vez y comer tres",
    emoji: "🍱",
    intro:
      "El plan de siete días se cae casi siempre el mismo día: el miércoles a la noche, cuando hay que cocinar de cero y la alternativa es pedir. Todo esto es para que ese miércoles ya esté resuelto.",
    items: [
      {
        t: "Cocinar de a doble y congelar la mitad",
        d: "El trabajo de una tarta o de una carne al horno es casi el mismo para uno o para dos. La segunda mitad al freezer, porcionada, es la cena de la semana que viene.",
      },
      {
        t: "Huevos duros los domingos",
        d: "Media docena en la heladera resuelve desayunos y colaciones toda la semana. Duran una semana pelados en un tupper con agua, y más sin pelar.",
      },
      {
        t: "Verdura lavada y seca el día de la compra",
        d: "Lo que hace que la hoja se pudra es la humedad y lo que hace que no se use es tener que lavarla a las nueve de la noche. Lavada, secada y en un tupper con papel de cocina dura una semana.",
      },
      {
        t: "Grasa de panceta en un frasco",
        d: "La que suelta al cocinarla no se tira: colada en un frasco en la heladera es lo mejor que hay para saltear, y sale gratis.",
      },
      {
        t: "Lo congelado va adelante",
        d: "Lo que queda al fondo del freezer no se come. Rotar cada vez que entra algo nuevo es lo que hace que el freezer sea una despensa y no un cementerio.",
      },
    ],
  },
];
