// Rutinas de movimiento para acompañar la dieta. Tres, y a propósito nada más:
// elongación todas las mañanas, caminata tres veces por semana y fuerza dos.
//
// Regla de contenido, la misma que en las recetas: **nada que necesite gimnasio
// ni aparatos**. Silla, pared, piso, una alfombra o toalla, y como mucho una
// banda elástica de las que se venden en cualquier casa de deportes. Si un
// ejercicio pide algo más, no va.
//
// Cada ejercicio lleva su `tip` con el error típico. En elongación y fuerza eso
// no es un adorno: la diferencia entre elongar y lastimarse es la técnica, y el
// error más común (rebotar, bloquear la lumbar, apurar la bajada) es siempre el
// mismo.
//
// Los MET de cada actividad son los del Compendio de Actividades Físicas
// (Ainsworth), que es la tabla estándar. Se usan para estimar calorías con el
// peso de cada uno en vez de dar un número fijo que no le sirve a nadie: ver
// `caloriasPorSesion()` más abajo.

export const RUTINAS = [
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: "elongacion-manana",
    nombre: "Elongación de la mañana",
    tipo: "elongacion",
    emoji: "🧘",
    frecuencia: "Todos los días",
    dias: "Los siete días",
    duracion: 10,
    met: 2.3,
    intensidad: "Muy suave",
    resumen:
      "Diez minutos al levantarse, sin forzar nada. Es la rutina que sostiene a las otras dos: un cuerpo que arranca el día desentumecido camina mejor y entrena sin lesionarse.",
    veredicto:
      "Diez minutos de elongación suave todas las mañanas, en el piso y con una silla. No busca flexibilidad de contorsionista: busca que la espalda, las caderas y los hombros dejen de estar rígidos al arrancar el día.",
    elementos: ["Una alfombra, colchoneta o toalla grande", "Una silla firme", "Una pared libre"],
    cuando:
      "Al levantarse, antes del desayuno. Si te acabás de despertar el cuerpo está frío: por eso todo va lento y sin rebotes.",
    // La hora por defecto del calendario. 7:00 es temprano pero es lo que hace
    // que la rutina exista: si se agenda "cuando pueda", no se hace nunca.
    agenda: { hora: "07:00", dias: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"], aviso: 5 },
    bloques: [
      {
        nombre: "De pie, para despertar el cuerpo",
        nota: "Los tres primeros se hacen recién levantado, sin apoyo. Son los que suben la temperatura del músculo antes de estirarlo de verdad.",
        ejercicios: [
          {
            nombre: "Respiración con brazos arriba",
            dosis: "5 respiraciones",
            posicion: "Parate con los pies al ancho de las caderas y los brazos al costado del cuerpo.",
            zona: "Caja torácica, hombros",
            como: "De pie, pies al ancho de las caderas. Subí los brazos por los costados mientras inhalás por la nariz, contando cuatro. Bajalos exhalando por la boca, contando seis.",
            tip: "Exhalar más largo que inhalar es lo que baja el pulso. Si inhalás y exhalás igual, es respirar fuerte y nada más.",
          },
          {
            nombre: "Rotación de cuello",
            dosis: "4 vueltas a cada lado",
            posicion: "Seguí de pie, con los brazos colgando y los hombros sueltos.",
            zona: "Cuello, trapecio",
            como: "Dejá caer la pera al pecho y llevá la oreja hacia un hombro, despacio, dibujando un semicírculo. Sin pasar la cabeza para atrás.",
            tip: "El círculo completo, con la cabeza yendo hacia atrás, comprime las cervicales. Sólo la mitad de adelante: de hombro a hombro pasando por el pecho.",
          },
          {
            nombre: "Círculos de hombros",
            dosis: "10 atrás, 10 adelante",
            posicion: "Quedate de pie, con los brazos colgando a los costados.",
            zona: "Hombros, parte alta de la espalda",
            como: "Brazos colgando. Llevá los hombros arriba, atrás y abajo, como dibujando un círculo grande con las puntas de los hombros.",
            tip: "El movimiento es del hombro, no del brazo. Si te ves moviendo las manos, estás haciendo otra cosa.",
          },
          {
            nombre: "Inclinación lateral de tronco",
            dosis: "20 segundos por lado",
            posicion: "De pie, con los pies al ancho de las caderas y las rodillas apenas blandas.",
            zona: "Costados, oblicuos",
            como: "Un brazo arriba, inclinate hacia el lado opuesto hasta sentir el costado. La otra mano apoyada en la cadera. Sostené sin rebotar.",
            tip: "La cadera se queda quieta. Si se va para el costado con el tronco, el estiramiento desaparece y sólo estás parado torcido.",
          },
        ],
      },
      {
        nombre: "En la alfombra",
        nota: "El bloque más importante: acá se suelta la cadera y la espalda baja, que es donde se acumula todo lo de estar sentado.",
        ejercicios: [
          {
            nombre: "Gato y camello",
            dosis: "8 repeticiones lentas",
            posicion: "Arrodillate en la alfombra y apoyá las manos en el piso, en cuatro apoyos.",
            zona: "Toda la columna",
            como: "En cuatro apoyos, manos debajo de los hombros. Redondeá la espalda hacia arriba metiendo la pera al pecho, y después hundila llevando la mirada al frente. Una respiración por movimiento.",
            tip: "El error es hacerlo rápido, como bombeando. Cada posición necesita una respiración completa para que la columna se mueva vértebra por vértebra.",
          },
          {
            nombre: "Postura del niño",
            dosis: "40 segundos",
            posicion: "Quedate de rodillas y sentate sobre los talones.",
            zona: "Espalda baja, caderas, hombros",
            como: "De rodillas, sentate sobre los talones y estirá los brazos hacia adelante apoyando la frente en la alfombra. Dejá que la espalda se abra sola con cada exhalación.",
            tip: "Si las rodillas o los tobillos molestan, poné una toalla doblada abajo. Aguantar la molestia no estira más, sólo hace que abandones la rutina en tres días.",
          },
          {
            nombre: "Isquiotibiales sentado",
            dosis: "30 segundos por pierna",
            posicion: "Sentate en la alfombra con las piernas estiradas hacia adelante.",
            zona: "Parte de atrás del muslo",
            como: "Sentado, una pierna estirada y la otra flexionada con la planta contra el muslo. Llevá el pecho hacia la rodilla estirada, con la espalda lo más recta que puedas.",
            tip: "No hay que llegar al pie. La instrucción real es «espalda recta»: redondear la espalda para tocarse la punta del pie estira la lumbar en vez del isquiotibial, que es lo contrario de lo que se busca.",
          },
          {
            nombre: "Rotación de columna acostado",
            dosis: "30 segundos por lado",
            posicion: "Acostate boca arriba, con los brazos abiertos en cruz.",
            zona: "Espalda baja, glúteo",
            como: "Boca arriba, brazos en cruz. Subí una rodilla y cruzala hacia el lado opuesto, dejando que caiga por su peso. Los dos hombros pegados al piso.",
            tip: "Si el hombro se levanta para que la rodilla llegue al piso, perdiste la rotación. La rodilla llega hasta donde llega con el hombro apoyado.",
          },
          {
            nombre: "Rodillas al pecho",
            dosis: "30 segundos",
            posicion: "Quedate boca arriba, sin levantarte.",
            zona: "Espalda baja",
            como: "Boca arriba, abrazá las dos rodillas y acercalas al pecho. Balanceate apenas de lado a lado, como masajeando la lumbar contra el piso.",
            tip: "Es el cierre de la rutina y conviene no saltearlo: descomprime la zona que quedó trabajando en todos los estiramientos anteriores.",
          },
        ],
      },
      {
        nombre: "Con la silla y la pared",
        nota: "Los últimos tres. Necesitan apoyo porque son los que más equilibrio piden, y a las siete de la mañana el equilibrio todavía no llegó.",
        ejercicios: [
          {
            nombre: "Cuádriceps con apoyo",
            dosis: "25 segundos por pierna",
            posicion: "Parate al lado de la silla, con una mano en el respaldo.",
            zona: "Frente del muslo",
            como: "Una mano en el respaldo de la silla. Llevá el talón al glúteo tomándote el tobillo, con la rodilla apuntando al piso y la cadera adelantada.",
            tip: "La rodilla tiene que quedar debajo de la cadera, no atrás. Si se va para atrás, el estiramiento se lo come la lumbar.",
          },
          {
            nombre: "Pantorrilla contra la pared",
            dosis: "25 segundos por pierna",
            posicion: "Parate frente a la pared, con las dos manos apoyadas a la altura del pecho.",
            zona: "Gemelo, tendón de Aquiles",
            como: "Manos en la pared, una pierna atrás bien estirada con el talón clavado en el piso. Empujá la pared hasta sentir la parte de atrás de la pierna.",
            tip: "El talón de atrás no se levanta ni un milímetro. Es el único punto que importa en este ejercicio.",
          },
          {
            nombre: "Pecho en el marco de la puerta",
            dosis: "25 segundos",
            posicion: "Parate en el marco de una puerta, con un pie adelante.",
            zona: "Pecho, hombro delantero",
            como: "Antebrazos apoyados en el marco de la puerta a la altura de los hombros, un pie adelante. Dejate caer despacio hacia adelante.",
            tip: "Es el antídoto de la postura de escritorio: los pectorales acortados son los que tiran los hombros hacia adelante todo el día.",
          },
        ],
      },
    ],
    progresion: [
      "Semana 1 y 2: la rutina completa tal como está, sin agregar tiempo. El objetivo de estas dos semanas es que se vuelva costumbre, no ganar flexibilidad.",
      "Semana 3 y 4: subí los sostenidos de 25-30 segundos a 45. Es el punto donde el músculo empieza a ceder de verdad.",
      "Mes 2 en adelante: agregá una segunda vuelta del bloque de la alfombra. Doce minutos en total.",
    ],
    faq: [
      {
        p: "¿Sirve elongar sin haber calentado, recién levantado?",
        r: "Sí, si se hace suave y sostenido, que es exactamente lo que propone esta rutina. Lo que no hay que hacer en frío es elongación con rebotes o forzada al límite del rango: eso sí necesita calentamiento previo. Los tres ejercicios de pie del principio están puestos justamente para subir un poco la temperatura antes del bloque del piso.",
      },
      {
        p: "¿Diez minutos de elongación adelgazan?",
        r: "No por las calorías: son unas 25 a 30 en diez minutos, nada. Lo que aporta es indirecto y vale más de lo que parece: sostiene la constancia, mejora el sueño y hace que la caminata y la rutina de fuerza se puedan hacer sin dolores que las interrumpan.",
      },
      {
        p: "¿Se puede hacer de noche en vez de a la mañana?",
        r: "Sí, y de noche el cuerpo está más caliente y flexible. La razón para ponerla a la mañana es de constancia, no de fisiología: a la mañana el día todavía no tuvo tiempo de llenarse de excusas. Lo importante es que sea siempre a la misma hora.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  {
    slug: "caminata-40",
    nombre: "Caminata de 40 minutos",
    tipo: "cardio",
    emoji: "🚶",
    frecuencia: "3 veces por semana",
    dias: "Lunes, miércoles y viernes",
    duracion: 40,
    met: 4.3,
    intensidad: "Moderada",
    resumen:
      "Cuarenta minutos, tres veces por semana, a un ritmo en el que podés hablar pero no cantar. Es el cardio con mejor relación entre lo que cuesta y lo que devuelve, y en keto tiene una ventaja extra: se hace con grasa como combustible.",
    veredicto:
      "Cuarenta minutos de caminata a paso sostenido, tres veces por semana, suman 120 minutos de actividad moderada: con los 60 de la rutina de fuerza llegan a 180, por encima de los 150 semanales que recomienda como mínimo la Organización Mundial de la Salud para adultos. El ritmo correcto es el que te deja hablar en frases cortas pero no cantar.",
    elementos: ["Zapatillas con suela que amortigüe", "Una botella de agua", "Nada más"],
    cuando:
      "Lunes, miércoles y viernes. Dejar día por medio no es casualidad: el día de descanso es cuando el cuerpo se adapta.",
    agenda: { hora: "18:30", dias: ["MO", "WE", "FR"], aviso: 30 },
    bloques: [
      {
        nombre: "Los 40 minutos, por tramos",
        nota: "No son 40 minutos iguales. Los primeros y los últimos cinco tienen función propia y son los que más se saltean.",
        ejercicios: [
          {
            nombre: "Entrada en calor",
            dosis: "5 minutos",
            zona: "Ritmo de paseo",
            como: "Caminá como si fueras mirando vidrieras. Sin apurar. Le da tiempo al corazón y a las articulaciones a ponerse en marcha.",
            tip: "Arrancar directo a ritmo fuerte es lo que produce la puntada en el costado y el dolor de canillas de los primeros días.",
          },
          {
            nombre: "Ritmo sostenido",
            dosis: "30 minutos",
            zona: "Ritmo de «llego tarde»",
            como: "Paso largo y firme, como si fueras a una cita con diez minutos de retraso. Deberías poder decir una frase corta sin quedarte sin aire, pero no mantener una charla cómoda.",
            tip: "El error es ir demasiado lento por miedo a cansarse. Si podés cantar, el ritmo no alcanza para que el cuerpo se adapte a nada.",
          },
          {
            nombre: "Vuelta a la calma",
            dosis: "5 minutos",
            zona: "Ritmo de paseo",
            como: "Bajá el ritmo de a poco hasta caminar tranquilo. Al terminar, aprovechá para hacer el estiramiento de pantorrilla y de cuádriceps de la rutina de la mañana.",
            tip: "Cortar de golpe y sentarse deja las piernas cargadas: la sangre se queda ahí. Cinco minutos suaves y dos estiramientos evitan las agujetas del día siguiente.",
          },
        ],
      },
      {
        nombre: "Cómo saber si el ritmo es el correcto",
        nota: "Sin reloj ni pulsómetro. Dos formas, y las dos funcionan.",
        ejercicios: [
          {
            nombre: "El test del habla",
            dosis: "Cada 10 minutos",
            zona: "Autocontrol",
            como: "Decí en voz alta una frase de seis o siete palabras. Si sale entera y cómoda, acelerá. Si tenés que cortarla en dos para respirar, ese es el ritmo. Si no podés terminarla, bajá.",
            tip: "Es el método que usan los fisiólogos del ejercicio cuando no hay aparatos, y coincide bastante bien con el 60-70 % de la frecuencia cardíaca máxima.",
          },
          {
            nombre: "Pasos por minuto",
            dosis: "Contá 20 segundos",
            zona: "Autocontrol",
            como: "Contá los pasos de un pie durante 20 segundos y multiplicá por seis. Entre 100 y 120 pasos por minuto es ritmo moderado para la mayoría de los adultos.",
            tip: "Cualquier celular tiene contador de pasos, pero cuenta el total del día. Para el ritmo sirve más contar 20 segundos a mano.",
          },
        ],
      },
    ],
    progresion: [
      "Semana 1: si 40 minutos hoy es mucho, arrancá con 25 y sumá 5 por semana. Tres veces por semana desde el principio, aunque sean cortas — la frecuencia importa más que la duración.",
      "Semana 4: ya en 40 minutos, empezá a buscar una cuesta o una subida en el recorrido. Sube el esfuerzo sin sumar tiempo ni impacto en las rodillas.",
      "Mes 3: sumá una cuarta caminata (sábado o domingo), o meté cuatro tramos de 2 minutos a paso muy rápido dentro de los 30 minutos centrales.",
    ],
    faq: [
      {
        p: "¿Cuántas calorías se queman caminando 40 minutos?",
        r: "Depende del peso, porque mover un cuerpo más grande cuesta más. La cuenta es MET × kilos × horas, y caminar a paso sostenido son 4,3 MET. Para 90 kilos: 4,3 × 90 × 0,67 = unas 260 calorías. Para 70 kilos, unas 200. Tres veces por semana son entre 600 y 800 semanales.",
      },
      {
        p: "¿Es mejor caminar en ayunas para quemar grasa?",
        r: "Se quema un porcentaje algo mayor de grasa durante la caminata, pero el total de grasa perdida al final del día es prácticamente el mismo: lo que decide es el balance calórico de las 24 horas, no el combustible del momento. En keto la diferencia es todavía menor, porque el cuerpo ya viene usando grasa. Caminá cuando te resulte más fácil sostenerlo.",
      },
      {
        p: "¿Alcanza con caminar para bajar de peso?",
        r: "Ayuda pero no alcanza sola: 700 calorías semanales son menos de 100 gramos de grasa. Lo que sí hace, y es lo importante, es proteger la masa muscular durante el déficit y mejorar la sensibilidad a la insulina. El peso lo baja la dieta; la caminata decide cuánto de lo que baja es grasa y cuánto es músculo.",
      },
      {
        p: "¿Sirve caminar en cinta o dando vueltas en casa?",
        r: "Sirve igual, el cuerpo no distingue el paisaje. Pero al aire libre la adherencia es bastante mejor y la irregularidad del terreno trabaja más los estabilizadores del tobillo. Si el clima no da, la cinta o dar vueltas por la casa es mucho mejor que saltear el día.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  {
    slug: "fuerza-en-casa",
    nombre: "Fuerza en casa, con lo que hay",
    tipo: "fuerza",
    emoji: "💪",
    frecuencia: "2 veces por semana",
    dias: "Martes y jueves",
    duracion: 30,
    met: 3.8,
    intensidad: "Moderada a exigente",
    resumen:
      "Piernas, pecho, espalda y brazos con el propio cuerpo, una silla, la pared y una banda elástica. Es la parte de la rutina que decide que lo que bajes sea grasa y no músculo.",
    veredicto:
      "Rutina de fuerza de cuerpo completo, dos veces por semana, sin gimnasio: silla, pared, piso y una banda elástica. Dieciséis ejercicios en cinco bloques —piernas, pecho, espalda, brazos y un cierre de zona media—, con tres niveles de progresión para que sirva desde el primer día hasta varios meses después.",
    elementos: [
      "Una silla firme sin ruedas",
      "Una pared libre",
      "Alfombra, colchoneta o toalla",
      "Una banda elástica (opcional pero recomendada)",
      "Una mochila con libros, para cuando el peso del cuerpo empiece a ser poco",
    ],
    cuando:
      "Martes y jueves, en los días en que no caminás. Entre una sesión y otra tiene que haber al menos 48 horas: el músculo crece descansando, no entrenando.",
    agenda: { hora: "18:30", dias: ["TU", "TH"], aviso: 30 },
    bloques: [
      {
        nombre: "Piernas",
        nota: "Van primero porque son el grupo más grande y el que más cansa. Hacerlas al final, con el cuerpo ya trabajado, es la forma más fácil de hacerlas mal.",
        ejercicios: [
          {
            nombre: "Sentadilla a la silla",
            dosis: "3 series de 12",
            posicion: "Parate de espaldas a la silla, con los pies al ancho de los hombros.",
            zona: "Cuádriceps, glúteo",
            como: "De espaldas a la silla, pies al ancho de los hombros. Bajá como si fueras a sentarte, tocá el asiento con la cola y subí sin apoyarte del todo. Rodillas apuntando hacia afuera, no hacia adentro.",
            tip: "La silla no es para descansar, es para marcar la profundidad. Si te sentás y te levantás con el impulso del respaldo, el ejercicio dejó de existir.",
          },
          {
            nombre: "Zancada con la silla atrás",
            dosis: "3 series de 10 por pierna",
            posicion: "Parate de espaldas a la silla, a un paso largo de distancia.",
            zona: "Cuádriceps, glúteo, equilibrio",
            como: "Parado de frente, apoyá el empeine de un pie sobre el asiento detrás de vos. Bajá con la pierna de adelante hasta que el muslo quede casi paralelo al piso.",
            tip: "El pie de adelante va bien lejos de la silla. Si queda cerca, la rodilla se pasa de la punta del pie y todo el peso va a la rótula.",
          },
          {
            nombre: "Puente de glúteos",
            dosis: "3 series de 15",
            posicion: "Acostate boca arriba en la alfombra, con las rodillas flexionadas y los pies apoyados cerca de la cola.",
            zona: "Glúteo, isquiotibiales",
            como: "Boca arriba en la alfombra, rodillas flexionadas y pies apoyados cerca de la cola. Subí la cadera apretando el glúteo hasta formar una línea recta de rodillas a hombros. Sostené un segundo arriba.",
            tip: "El empujón sale del glúteo, no de la lumbar. Si terminás sintiendo la espalda baja, subiste demasiado: la línea recta es el techo, no un arco.",
          },
          {
            nombre: "Silla isométrica contra la pared",
            dosis: "3 series de 30 a 45 segundos",
            posicion: "Parate de espaldas a la pared, con la espalda bien pegada.",
            zona: "Cuádriceps",
            como: "Espalda pegada a la pared, deslizate hasta que los muslos queden paralelos al piso, rodillas en ángulo recto. Sostené.",
            tip: "Las manos no se apoyan en los muslos. Es la trampa más común y le saca al ejercicio la mitad del trabajo.",
          },
        ],
      },
      {
        nombre: "Pecho",
        nota: "Todo son flexiones, cambiando la altura de las manos. Es la progresión más simple que existe: la pared es el nivel más fácil, los pies en la silla el más difícil.",
        ejercicios: [
          {
            nombre: "Flexiones (elegí tu altura)",
            dosis: "3 series de 8 a 15",
            posicion: "Ubicate en la altura que elijas: las manos en la pared, en el asiento de la silla o en el piso.",
            zona: "Pectoral, hombro, tríceps",
            como: "Nivel 1: manos en la pared, cuerpo inclinado. Nivel 2: manos en el asiento de la silla. Nivel 3: manos en el piso. Nivel 4: manos en el piso y pies sobre la silla. Bajá hasta que el pecho quede a un puño del apoyo.",
            tip: "Elegí el nivel donde llegás a 8 repeticiones con buena forma, no el que te gustaría estar haciendo. Diez flexiones completas valen más que veinte a medio recorrido.",
          },
          {
            nombre: "Apertura con banda",
            dosis: "3 series de 12",
            posicion: "Parate con la banda pasada por detrás de la espalda, a la altura de las axilas.",
            zona: "Pectoral",
            como: "Pasá la banda por detrás de la espalda, a la altura de las axilas, sujetando las puntas con las manos. Brazos casi estirados al frente, abrí en cruz y cerrá juntando las manos adelante.",
            tip: "El movimiento se hace con el codo apenas flexionado y fijo. Si flexionás y estirás el codo, pasaste a hacer tríceps.",
          },
          {
            nombre: "Flexión diamante",
            dosis: "2 series de 6 a 10",
            posicion: "Volvé a la posición de flexión, con las manos juntas debajo del pecho.",
            zona: "Pectoral interno, tríceps",
            como: "Igual que la flexión, pero con las manos juntas debajo del pecho formando un triángulo con los índices y los pulgares. Se puede hacer con las manos en la silla si en el piso es mucho.",
            tip: "Los codos se van hacia atrás pegados al cuerpo, no hacia los costados. Abiertos, el hombro se lleva toda la carga.",
          },
        ],
      },
      {
        nombre: "Espalda",
        nota: "El grupo que casi todas las rutinas caseras dejan afuera, porque sin barra ni dominadas parece imposible. No lo es: hace falta la banda elástica o una mesa firme.",
        ejercicios: [
          {
            nombre: "Remo con banda",
            dosis: "3 series de 12",
            posicion: "Sentate en el piso con las piernas estiradas y la banda pasada por las plantas de los pies.",
            zona: "Dorsal, romboides",
            como: "Sentado en el piso con las piernas estiradas, pasá la banda por las plantas de los pies y tomá las puntas. Espalda recta, tirá llevando los codos hacia atrás y pegados al cuerpo, apretando los omóplatos.",
            tip: "El tirón arranca en los omóplatos, no en las manos. Si sólo doblás los codos, estás haciendo bíceps con la espalda quieta.",
          },
          {
            nombre: "Remo invertido bajo la mesa",
            dosis: "3 series de 8",
            posicion: "Acostate boca arriba debajo de la mesa y tomá el borde con las dos manos.",
            zona: "Dorsal, bíceps",
            como: "Acostate boca arriba debajo de una mesa firme y tomá el borde con las dos manos. Cuerpo recto, talones en el piso, y traccioná hasta acercar el pecho al borde.",
            tip: "Antes de colgarte, comprobá que la mesa no se venga encima: probá con la mano apoyando peso de a poco. Las mesas livianas de caballete no sirven para esto.",
          },
          {
            nombre: "Superman",
            dosis: "3 series de 12",
            posicion: "Acostate boca abajo en la alfombra, con los brazos estirados adelante.",
            zona: "Lumbares, glúteo",
            como: "Boca abajo en la alfombra, brazos estirados adelante. Levantá al mismo tiempo brazos, pecho y piernas unos centímetros, sostené dos segundos y bajá.",
            tip: "Unos centímetros alcanzan. Arquear la espalda todo lo posible no fortalece más, comprime las vértebras lumbares.",
          },
          {
            nombre: "Pull-apart con banda",
            dosis: "2 series de 15",
            posicion: "Parate con la banda tomada con las dos manos y los brazos estirados al frente.",
            zona: "Espalda alta, postura",
            como: "Brazos estirados al frente a la altura de los hombros, banda tomada con las dos manos. Abrí los brazos en cruz estirando la banda hasta que toque el pecho.",
            tip: "Es el ejercicio que corrige los hombros caídos hacia adelante. Si hacés uno solo de este bloque, que sea este.",
          },
        ],
      },
      {
        nombre: "Brazos",
        nota: "Van al final porque ya vinieron trabajando en las flexiones y los remos. Dos ejercicios de tríceps y uno de bíceps: el tríceps es dos tercios del volumen del brazo y casi siempre se entrena menos.",
        ejercicios: [
          {
            nombre: "Fondos de tríceps en la silla",
            dosis: "3 series de 10",
            posicion: "Sentate al borde de la silla, con las manos a los costados de la cadera tomando el asiento.",
            zona: "Tríceps",
            como: "Sentado al borde de la silla, manos a los costados de la cadera tomando el asiento. Deslizá la cola hacia adelante y bajá flexionando los codos hacia atrás, hasta unos 90 grados. Subí empujando.",
            tip: "La silla contra la pared, o se va para atrás en la primera repetición. Y los codos hacia atrás, no abiertos: abiertos, esto es de los ejercicios que más hombros lastima.",
          },
          {
            nombre: "Curl de bíceps con banda",
            dosis: "3 series de 12",
            posicion: "Parate sobre el medio de la banda, con una punta en cada mano.",
            zona: "Bíceps",
            como: "Parado sobre el medio de la banda, una punta en cada mano. Codos pegados al cuerpo y fijos, subí las manos hacia los hombros y bajá despacio, contando tres.",
            tip: "La bajada lenta es donde está el trabajo. Dejar que la banda te devuelva la mano de golpe desperdicia la mitad de la repetición.",
          },
          {
            nombre: "Extensión de tríceps sobre la cabeza",
            dosis: "3 series de 12",
            posicion: "Parate pisando una punta de la banda, con la otra punta detrás de la cabeza.",
            zona: "Tríceps",
            como: "Pisá una punta de la banda, pasá la otra por detrás de la cabeza tomándola con las dos manos. Estirá los brazos hacia arriba manteniendo los codos apuntando al frente.",
            tip: "Los codos quedan cerca de las orejas y no se abren. Si se abren hacia los costados, el tríceps deja de trabajar.",
          },
        ],
      },
      {
        nombre: "Cierre",
        nota: "Tres minutos de zona media y termina. No es opcional: es lo que sostiene la espalda en todo lo anterior.",
        ejercicios: [
          {
            nombre: "Plancha",
            dosis: "3 series de 20 a 45 segundos",
            posicion: "Apoyate en la alfombra sobre los antebrazos y las puntas de los pies.",
            zona: "Abdomen, zona media",
            como: "Antebrazos y puntas de los pies en la alfombra, cuerpo en línea recta de la cabeza a los talones. Apretá el abdomen y el glúteo como si fueras a recibir un golpe.",
            tip: "La cola no se levanta ni la cadera se hunde. Treinta segundos con la línea recta valen más que dos minutos con la cola en el aire.",
          },
          {
            nombre: "Bicho muerto",
            dosis: "2 series de 10 por lado",
            posicion: "Acostate boca arriba, con los brazos apuntando al techo y las rodillas a noventa grados.",
            zona: "Abdomen profundo",
            como: "Boca arriba, brazos apuntando al techo y rodillas a 90 grados. Estirá un brazo hacia atrás y la pierna opuesta hacia adelante, sin que la lumbar se despegue del piso. Volvé y cambiá.",
            tip: "Si sentís que la espalda baja se arquea, no estires tanto la pierna. El rango correcto es el que mantiene la lumbar pegada al piso.",
          },
        ],
      },
    ],
    progresion: [
      "Semana 1 y 2: dos series de cada ejercicio en vez de tres, y el nivel de flexión más fácil que puedas. Vas a tener agujetas de todas formas; empezar suave hace que no te tomes la semana siguiente libre.",
      "Semana 3 a 6: las tres series completas. Cuando llegues al tope de repeticiones de un ejercicio con buena forma en las tres series, subí de nivel ese ejercicio (no todos a la vez).",
      "Mes 2 en adelante: cargá la mochila con libros para las sentadillas y las zancadas, y pasá a la banda de resistencia más dura. Si llegás a hacer las flexiones con los pies en la silla, ya estás en un nivel que la mayoría no alcanza en un gimnasio.",
    ],
    faq: [
      {
        p: "¿Se puede ganar músculo sin pesas, sólo con el peso del cuerpo?",
        r: "Sí, sobre todo el primer año y sobre todo si nunca entrenaste. El músculo responde a la tensión y a la progresión, no al material del que está hecho el peso. El límite aparece cuando el propio cuerpo se vuelve poco estímulo: ahí entran la mochila con libros, la banda más dura y las variantes a una pierna.",
      },
      {
        p: "¿Se puede hacer fuerza en keto sin quedarse sin energía?",
        r: "Las primeras dos o tres semanas la fuerza baja: el músculo todavía tiene poco glucógeno y las series largas se sienten pesadas. Después se recupera casi por completo para este tipo de trabajo. Ayuda mucho salar bien la comida y tomar agua, porque los calambres en keto son casi siempre falta de sodio y magnesio.",
      },
      {
        p: "¿Cuánta proteína hace falta para no perder músculo?",
        r: "Unos 2 gramos por kilo de masa magra por día, que es exactamente lo que calcula la calculadora del sitio. Es el número que más importa mientras estás en déficit: sin proteína suficiente, el déficit se come músculo además de grasa, y entrenar no lo evita.",
      },
      {
        p: "¿Dos veces por semana alcanza?",
        r: "Para mantener y ganar los primeros meses, sí: dos sesiones de cuerpo completo por semana están muy cerca de lo que rinden tres, y son bastante más fáciles de sostener. La diferencia entre dos y cero es enorme; entre dos y tres es chica.",
      },
      {
        p: "¿Qué hago si me duele algo?",
        r: "Molestia muscular difusa al día siguiente es normal y se pasa en 48 horas. Dolor puntual en una articulación —rodilla, hombro, codo— en el momento del movimiento no lo es: ese ejercicio se suspende y, si sigue, se consulta. Ninguna rutina vale una lesión que te saque tres meses.",
      },
    ],
  },
];

/** Rutina por slug, para las páginas de detalle y los enlaces cruzados. */
export const porSlug = Object.fromEntries(RUTINAS.map((r) => [r.slug, r]));

/**
 * Calorías estimadas de una sesión, por la fórmula del Compendio de Actividades
 * Físicas: kcal = MET × kilos × horas. Es una estimación de tabla, igual que los
 * macros de las recetas: sirve para ordenar la semana, no para cuadrar un número
 * al gramo.
 */
export function caloriasPorSesion(rutina, peso) {
  return Math.round(rutina.met * peso * (rutina.duracion / 60));
}

/** Cuántas sesiones semanales tiene una rutina, según sus días de agenda. */
export function sesionesSemanales(rutina) {
  return rutina.agenda.dias.length;
}

/** Calorías semanales de las tres rutinas juntas, para un peso dado. */
export function caloriasSemana(peso) {
  return RUTINAS.reduce(
    (t, r) => t + caloriasPorSesion(r, peso) * sesionesSemanales(r),
    0
  );
}

/** Minutos de actividad moderada o intensa por semana. La OMS recomienda 150
 *  para adultos, y la elongación no cuenta porque es de intensidad suave. */
export function minutosModerados() {
  return RUTINAS.filter((r) => r.met >= 3).reduce(
    (t, r) => t + r.duracion * sesionesSemanales(r),
    0
  );
}
