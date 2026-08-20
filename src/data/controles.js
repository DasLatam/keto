// Controles médicos: qué medir antes de empezar, qué repetir y con quién.
//
// Es la sección que un sitio de dieta no puede no tener. Keto no es "comer
// menos": cambia cómo el cuerpo maneja el azúcar, el agua y el sodio, y eso
// interactúa con medicación real —insulina, antihipertensivos, anticoagulantes—
// de formas que no se resuelven leyendo una página web.
//
// El criterio de escritura es el mismo de `evidencia.js`: ningún número sin
// fuente. Los valores de referencia que aparecen acá son los de las guías que
// están en `FUENTES`, y donde dos guías no coinciden —la presión arterial es el
// caso claro— se dicen los dos umbrales en vez de elegir uno y hacerlo pasar por
// consenso.
//
// Y una decisión editorial: esta página **no** interpreta resultados. Dice qué
// pedir, para qué sirve cada cosa y cuándo repetirla. Quien lee el laboratorio
// es el médico, que tiene delante los antecedentes, la medicación y a la persona.

// ══════════════════════════════════════════════════════════════════════════
// La línea de tiempo
// ══════════════════════════════════════════════════════════════════════════

/** Los cuatro momentos del seguimiento. El primero es el que más se saltea. */
export const MOMENTOS = [
  {
    cuando: "Antes de empezar",
    titulo: "La foto de partida",
    texto:
      "Es el control que más se saltea y el único que no se puede recuperar después. Sin un laboratorio previo, dentro de tres meses vas a tener un colesterol de 210 sin saber si subió, bajó o siempre estuvo ahí. La foto de partida no es burocracia: es lo que convierte cualquier resultado posterior en información.",
    hacer: [
      "Consulta con clínico o médico de cabecera, contándole que vas a hacer una dieta cetogénica.",
      "Laboratorio completo (la tabla de abajo).",
      "Presión arterial, peso, altura, cintura y cuello anotados el mismo día.",
      "Revisión de la medicación que tomás, si tomás alguna.",
    ],
  },
  {
    cuando: "Primeras dos semanas",
    titulo: "La adaptación",
    texto:
      "No lleva laboratorio, lleva atención. Es cuando aparece la gripe keto —cansancio, dolor de cabeza, calambres—, que casi siempre es agua y sales y no la dieta fallando. Y es cuando la presión y el azúcar se mueven más rápido, que es justo el motivo por el que quien toma medicación necesita haber hablado antes con su médico.",
    hacer: [
      "Presión arterial dos o tres veces por semana si sos hipertenso o tomás diuréticos.",
      "Glucemia capilar más seguido que de costumbre si usás insulina o pastillas para la diabetes, con las pautas que te haya dado tu médico.",
      "Peso una vez por semana, siempre el mismo día y a la misma hora.",
    ],
  },
  {
    cuando: "A los 3 meses",
    titulo: "El primer control de verdad",
    texto:
      "Tres meses es el plazo que tiene sentido bioquímico y no sólo calendario: la hemoglobina glicosilada refleja el promedio de azúcar en sangre de los últimos dos a tres meses, que es exactamente la vida media de un glóbulo rojo. Antes de ese plazo el número todavía arrastra cómo comías antes.",
    hacer: [
      "Repetir el laboratorio: glucemia, hemoglobina glicosilada, perfil lipídico completo, función renal y hepática.",
      "Consulta para leerlo con el médico, con la planilla de casa en la mano.",
      "Ajustar la medicación si hace falta. Lo decide el médico, nunca la balanza.",
    ],
  },
  {
    cuando: "A los 6 meses",
    titulo: "Confirmar o corregir",
    texto:
      "Acá se ve la tendencia, que vale más que cualquier valor suelto. Un colesterol que subió a los tres meses y volvió a bajar a los seis cuenta una historia distinta de uno que subió las dos veces. Si todo está en orden, después de este control se pasa a un seguimiento anual como el de cualquier persona.",
    hacer: [
      "Mismo laboratorio que a los tres meses.",
      "Revisar la tendencia de los tres puntos: inicio, tres meses, seis meses.",
      "Si el LDL subió y se mantuvo alto, es momento de sumar al cardiólogo.",
      "Definir con el médico cada cuánto seguir controlándote.",
    ],
  },
];

// ══════════════════════════════════════════════════════════════════════════
// El laboratorio
// ══════════════════════════════════════════════════════════════════════════

/**
 * Qué pedir en el laboratorio.
 *
 * `referencia` es el valor habitual de las guías citadas en `FUENTES`, y está
 * para que la orden se pueda leer, no para autodiagnosticarse: un valor fuera de
 * rango puede no significar nada y uno dentro de rango puede significar mucho,
 * según con qué venga acompañado.
 */
export const ESTUDIOS = [
  {
    grupo: "Azúcar en sangre",
    porque:
      "Es lo que la dieta cambia primero y más fuerte. También es lo que obliga a ajustar medicación: si tomás algo para la diabetes, estos valores bajando son el motivo por el que el médico tiene que estar al tanto antes y no después.",
    items: [
      {
        que: "Glucemia en ayunas",
        referencia: "Menos de 100 mg/dL. Entre 100 y 125, prediabetes; 126 o más en dos tomas, diabetes.",
        nota: "Ocho horas de ayuno. Es una foto de un momento, por eso no se lee sola.",
      },
      {
        que: "Hemoglobina glicosilada (HbA1c)",
        referencia: "Menos de 5,7 %. Entre 5,7 y 6,4 %, prediabetes; 6,5 % o más, diabetes.",
        nota: "El promedio de los últimos dos o tres meses. Es el número que hay que mirar a los 3 y a los 6 meses.",
      },
      {
        que: "Insulina basal",
        referencia: "No hay un corte universal: se interpreta junto con la glucemia.",
        nota: "Con la glucemia permite calcular el índice HOMA, que estima resistencia a la insulina. No todos los médicos lo piden de rutina; se puede preguntar.",
      },
    ],
  },
  {
    grupo: "Perfil lipídico",
    porque:
      "Es el que más discusión genera en una dieta alta en grasa, y por eso es el que más conviene tener medido antes. En una parte de las personas el LDL sube al bajar los carbohidratos; en otras baja. Los triglicéridos, en cambio, suelen bajar y el HDL subir. Sin la foto de partida, cualquiera de esos movimientos es una anécdota.",
    items: [
      {
        que: "Colesterol total",
        referencia: "Deseable, menos de 200 mg/dL.",
        nota: "Solo, dice poco: sube tanto si sube el LDL como si sube el HDL, que son cosas opuestas.",
      },
      {
        que: "Colesterol LDL",
        referencia: "El objetivo depende del riesgo cardiovascular de cada uno; lo fija el médico.",
        nota: "El que hay que seguir si sube. No existe un número que sirva para todos: no es lo mismo a los 30 sin antecedentes que a los 60 con un stent.",
      },
      {
        que: "Colesterol HDL",
        referencia: "Bajo por debajo de 40 mg/dL en varones y de 50 mg/dL en mujeres.",
        nota: "Es de los que suele mejorar con la dieta.",
      },
      {
        que: "Triglicéridos",
        referencia: "Normal por debajo de 150 mg/dL.",
        nota: "Junto con el HDL, es lo que más rápido se mueve al sacar azúcar y harinas.",
      },
    ],
  },
  {
    grupo: "Riñón e hígado",
    porque:
      "Son los dos órganos sobre los que más se pregunta y sobre los que más se opina sin datos. Medirlos al principio zanja la discusión para tu caso particular: si el filtrado glomerular está normal antes y sigue normal a los seis meses, la pregunta está contestada. Y si venías con algo, es exactamente la información que hace falta para decidir si esta dieta es para vos.",
    items: [
      {
        que: "Creatinina y filtrado glomerular",
        referencia: "El filtrado se informa calculado; el laboratorio marca si está por debajo de lo esperado.",
        nota: "La enfermedad renal avanzada es una contraindicación: no se hace keto por cuenta propia con el riñón comprometido.",
      },
      {
        que: "Uremia",
        referencia: "Según el rango del laboratorio.",
        nota: "Acompaña a la creatinina para leer la función renal.",
      },
      {
        que: "Hepatograma (TGO, TGP, fosfatasa alcalina)",
        referencia: "Según el rango del laboratorio.",
        nota: "En hígado graso suele mejorar, pero eso se afirma con el antes y el después, no de memoria.",
      },
      {
        que: "Ácido úrico",
        referencia: "Según el rango del laboratorio.",
        nota: "Puede subir en las primeras semanas. Si tuviste gota, avisale al médico antes de empezar.",
      },
    ],
  },
  {
    grupo: "Lo que la dieta mueve de arrastre",
    porque:
      "Bajar los carbohidratos baja la insulina, y la insulina es una de las señales que le dicen al riñón que retenga sodio. Por eso las primeras semanas se pierde agua y sal, y por eso los electrolitos son el estudio que explica la mitad de los síntomas de los que se queja la gente que empieza.",
    items: [
      {
        que: "Ionograma (sodio, potasio, cloro)",
        referencia: "Según el rango del laboratorio.",
        nota: "Especialmente si tomás diuréticos o hacés mucha actividad física.",
      },
      {
        que: "Magnesio",
        referencia: "Según el rango del laboratorio.",
        nota: "Los calambres nocturnos de las primeras semanas suelen venir por acá.",
      },
      {
        que: "TSH",
        referencia: "Según el rango del laboratorio.",
        nota: "El tiroides cambia el metabolismo basal. Si el peso no se mueve con todo bien hecho, es de lo primero que se revisa.",
      },
      {
        que: "Vitamina D y vitamina B12",
        referencia: "Según el rango del laboratorio.",
        nota: "Valen como base general de salud, sobre todo si la dieta deja afuera muchos grupos de alimentos.",
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════════════════════
// Lo que se mide en casa
// ══════════════════════════════════════════════════════════════════════════

/**
 * La planilla de casa.
 *
 * `cada` es la frecuencia y `como` es cómo tomar la medida para que sirva: una
 * medida mal tomada no es "menos precisa", es ruido, y el ruido en una serie de
 * seis meses tapa la señal que se está buscando.
 */
export const MEDIDAS = [
  {
    que: "Peso",
    unidad: "kg",
    cada: "Una vez por semana",
    como:
      "Mismo día, misma hora, recién levantado, después de ir al baño y antes de desayunar. Pesarse todos los días muestra sobre todo cuánta agua retuviste, que en keto se mueve varios kilos y no es grasa.",
  },
  {
    que: "Cintura",
    unidad: "cm",
    cada: "Cada dos semanas",
    como:
      "Parado, relajado, sin meter la panza, a la altura del ombligo y con la cinta paralela al piso. Es la medida que mejor acompaña al riesgo metabólico, y muchas veces baja aunque la balanza no se mueva.",
  },
  {
    que: "Cuello",
    unidad: "cm",
    cada: "Cada dos semanas",
    como:
      "Debajo de la nuez de Adán, con la cinta apoyada sin apretar. Junto con la cintura y la altura entra en la fórmula de porcentaje de grasa que usa la calculadora del sitio.",
  },
  {
    que: "Cadera",
    unidad: "cm",
    cada: "Cada dos semanas",
    como:
      "En la parte más ancha. Hace falta para el porcentaje de grasa en mujeres, y el índice cintura-cadera dice dónde está distribuida.",
  },
  {
    que: "IMC",
    unidad: "kg/m²",
    cada: "Sale solo",
    como:
      "Es el peso dividido la altura al cuadrado; la calculadora lo hace. Sirve como referencia poblacional, no individual: no distingue músculo de grasa, y por eso va siempre acompañado de la cintura.",
  },
  {
    que: "Presión arterial",
    unidad: "mmHg",
    referencia:
      "Normal por debajo de 120/80. A partir de ahí no hay un único corte: la guía de 2017 del Colegio Americano de Cardiología considera hipertensión desde 130/80, y buena parte de las guías europeas y locales siguen usando 140/90. Quien decide qué umbral aplica a tu caso es tu médico.",
    cada: "Semanal, o como te lo indique tu médico",
    como:
      "Sentado, con la espalda apoyada, cinco minutos de reposo antes, el brazo a la altura del corazón y sin haber tomado café ni fumado en la media hora previa. Dos tomas separadas por un minuto y se anota el promedio.",
  },
  {
    que: "Glucemia capilar",
    unidad: "mg/dL",
    cada: "Sólo si tu médico te lo indicó",
    como:
      "Con el medidor y la frecuencia que te haya indicado. Si tomás insulina o sulfonilureas, esta fila no es opcional: es la que avisa una hipoglucemia antes de que se vuelva un problema.",
  },
  {
    que: "Cómo dormiste y cómo andás de energía",
    unidad: "1 a 5",
    cada: "Semanal",
    como:
      "Parece blando al lado de un análisis y no lo es: es lo que explica por qué una semana comiste bien y la siguiente no. Una escala del uno al cinco anotada al lado del peso alcanza.",
  },
];

/** Los objetivos que se fijan al principio, para que el seguimiento tenga contra qué comparar. */
export const OBJETIVOS = [
  {
    titulo: "Uno de peso, con fecha",
    texto:
      "«Bajar 8 kilos en seis meses» se puede verificar; «bajar de peso» no. Y conviene que sea modesto: un ritmo sostenible es el que se sigue sosteniendo en el mes siete.",
  },
  {
    titulo: "Uno de laboratorio",
    texto:
      "Por ejemplo bajar la hemoglobina glicosilada o los triglicéridos. Es el que le importa a tu salud aunque la balanza no colabore, y el que le sirve al médico para decidir sobre la medicación.",
  },
  {
    titulo: "Uno de centímetros",
    texto:
      "La cintura, que baja incluso en las semanas en que el peso se estanca. Es el que sostiene la moral cuando la balanza no se mueve.",
  },
  {
    titulo: "Uno de hábito",
    texto:
      "«Cocinar el domingo para tres días», «caminar cuarenta minutos cuatro veces por semana». Es el único que depende enteramente de vos, y el que hace que los otros tres pasen.",
  },
];

// ══════════════════════════════════════════════════════════════════════════
// Con quién
// ══════════════════════════════════════════════════════════════════════════

export const ESPECIALISTAS = [
  {
    quien: "Médico clínico o de cabecera",
    cuando: "Siempre, antes de empezar",
    porque:
      "Es el que tiene tu historia completa y el que ordena el laboratorio. Si sólo vas a ver a un profesional, es éste. Decile explícitamente que vas a bajar mucho los carbohidratos: cambia qué pide y qué mira.",
  },
  {
    quien: "Nutricionista",
    cuando: "Al empezar, y a los tres meses",
    porque:
      "La diferencia entre una dieta que se sostiene y una que se abandona a las tres semanas suele ser de armado, no de fuerza de voluntad. Además es quien detecta si estás dejando afuera nutrientes sin darte cuenta. Buscá matrícula.",
  },
  {
    quien: "Diabetólogo o endocrinólogo",
    cuando: "Si tenés diabetes, prediabetes, tiroides o síndrome de ovario poliquístico",
    porque:
      "Si tomás insulina o pastillas para la diabetes, la medicación casi seguro necesita ajuste al bajar los carbohidratos, y ese ajuste no se hace por cuenta propia: es el escenario donde aparece la hipoglucemia.",
  },
  {
    quien: "Cardiólogo",
    cuando: "Si tenés antecedentes, hipertensión, o si el LDL sube y se queda arriba",
    porque:
      "Es quien pone el colesterol en contexto de riesgo global —edad, presión, tabaquismo, antecedentes familiares— en vez de leer un número suelto. También es el que corresponde si tomás antihipertensivos, porque la presión suele bajar en las primeras semanas.",
  },
  {
    quien: "Nefrólogo",
    cuando: "Si tenés enfermedad renal, cálculos a repetición o el filtrado bajo",
    porque:
      "El riñón es uno de los pocos lugares donde una dieta alta en proteína y baja en carbohidratos deja de ser una discusión teórica. Con función renal comprometida, esta dieta se hace supervisada o no se hace.",
  },
  {
    quien: "Salud mental",
    cuando: "Si hubo o hay un trastorno de la conducta alimentaria",
    porque:
      "Una dieta con reglas estrictas y listas de alimentos prohibidos puede ser exactamente lo peor en ese contexto. No es una advertencia de compromiso: es la razón por la que en ese caso hay que consultar antes.",
  },
];

// ══════════════════════════════════════════════════════════════════════════
// Medicación
// ══════════════════════════════════════════════════════════════════════════

/**
 * Las interacciones que obligan a consultar antes de empezar, no después.
 *
 * Están acá porque son la diferencia entre "esta dieta no me cayó bien" y una
 * urgencia. No dicen qué hacer: dicen por qué hay que preguntar.
 */
export const MEDICACION = [
  {
    grupo: "Insulina y sulfonilureas (glibenclamida, glimepirida, gliclazida)",
    riesgo: "Hipoglucemia",
    texto:
      "La dosis estaba calculada para una alimentación con muchos más carbohidratos. Si sacás los carbohidratos y dejás la dosis igual, el azúcar puede bajar demasiado. El ajuste lo hace tu médico, y conviene tenerlo hablado antes del primer día, no después del primer susto.",
  },
  {
    grupo: "Inhibidores de SGLT2 (dapagliflozina, empagliflozina, canagliflozina)",
    riesgo: "Cetoacidosis euglucémica",
    texto:
      "Es la interacción más seria de la lista y la menos conocida: puede aparecer una cetoacidosis con el azúcar en sangre normal, justamente porque el valor normal hace que nadie sospeche. Si tomás alguno de estos, la consulta previa no es recomendable, es necesaria.",
  },
  {
    grupo: "Antihipertensivos y diuréticos",
    riesgo: "Presión demasiado baja, pérdida de sodio y potasio",
    texto:
      "Las primeras semanas de keto tienen efecto diurético: se pierde agua y sal. Sumado a un diurético, la presión puede bajar más de la cuenta y aparecer mareos al pararse. Es un motivo frecuente de ajuste de dosis, y por eso la presión se mide seguido al principio.",
  },
  {
    grupo: "Anticoagulantes orales (warfarina, acenocumarol)",
    riesgo: "El RIN se mueve",
    texto:
      "Estas dietas suben mucho el consumo de verduras de hoja, que traen vitamina K, que es justamente lo que estos remedios bloquean. No hay que dejar de comer verdura: hay que avisar, mantener un consumo parejo y controlar el RIN más seguido al principio.",
  },
];

/** Cuándo no esperar al control programado. */
export const ALARMAS = [
  "Mareo al pararte, visión borrosa o desmayo.",
  "Temblor, sudor frío, confusión o palpitaciones: puede ser una hipoglucemia, sobre todo si tomás medicación para la diabetes.",
  "Vómitos, dolor abdominal fuerte o respiración agitada, con o sin el azúcar alto.",
  "Palpitaciones o pulso irregular que no ceden.",
  "Dolor de pecho.",
  "Calambres intensos que no mejoran tomando líquido y sal.",
  "Orina muy oscura o mucho menos cantidad que de costumbre.",
];

/** Situaciones en las que la dieta no se arranca por cuenta propia. */
export const NO_EMPEZAR_SOLO = [
  "Diabetes tipo 1.",
  "Embarazo o lactancia.",
  "Enfermedad renal o hepática.",
  "Antecedentes de pancreatitis.",
  "Vesícula sacada o cálculos biliares.",
  "Trastornos del metabolismo de las grasas diagnosticados.",
  "Antecedentes de trastorno de la conducta alimentaria.",
  "Menos de 18 años.",
];

// ══════════════════════════════════════════════════════════════════════════
// Preguntas y fuentes
// ══════════════════════════════════════════════════════════════════════════

export const FAQ = [
  {
    p: "¿Hace falta ir al médico si estoy sano y sólo quiero bajar unos kilos?",
    r: "Hace falta igual, y por un motivo práctico además del sanitario: sin un laboratorio previo no vas a poder saber si la dieta te hizo bien. Dentro de tres meses vas a tener un colesterol de 210 y ninguna forma de saber si subió, bajó o siempre estuvo ahí. Además, una parte de las personas se entera de que tenía prediabetes justamente en ese primer análisis.",
  },
  {
    p: "¿Qué le pido al médico exactamente?",
    r: "Contale que vas a hacer una dieta cetogénica y pedile un laboratorio con glucemia, hemoglobina glicosilada, perfil lipídico completo, función renal, hepatograma, ionograma y TSH. En esta página está la lista con el para qué de cada uno: podés imprimirla y llevarla. Quien decide qué pedir es el médico, pero llevar la lista hace que la consulta rinda.",
  },
  {
    p: "¿Por qué a los tres meses y no antes?",
    r: "Porque la hemoglobina glicosilada refleja el promedio de azúcar en sangre de los últimos dos o tres meses, que es la vida de un glóbulo rojo. Medirla al mes todavía muestra en buena parte cómo comías antes de empezar. El resto de los valores se puede mirar antes si hay un motivo, y el médico lo va a decir.",
  },
  {
    p: "Me subió el colesterol. ¿Dejo la dieta?",
    r: "No es una decisión que se tome con un número suelto ni en una página web. En una parte de las personas el LDL sube al bajar los carbohidratos, mientras los triglicéridos bajan y el HDL sube. Qué significa ese conjunto depende de tu riesgo cardiovascular global, que lo evalúa un médico —cardiólogo si hay antecedentes—. Lo que sí conviene es no esperar al control de los seis meses para preguntar.",
  },
  {
    p: "Tomo medicación. ¿Puedo empezar igual?",
    r: "Podés, pero hablando antes con quien te la indicó. Hay cuatro grupos donde la consulta previa no es opcional: insulina y sulfonilureas, por hipoglucemia; inhibidores de SGLT2, por riesgo de cetoacidosis con el azúcar normal; antihipertensivos y diuréticos, porque la presión suele bajar; y anticoagulantes, porque el consumo de verduras de hoja cambia el RIN.",
  },
  {
    p: "¿Sirve de algo anotar el peso y la cintura si ya me hago los análisis?",
    r: "Sirve para dos cosas que el laboratorio no da. Una es la tendencia entre control y control: tres meses sin ninguna medición son tres meses a ciegas. La otra es que la cintura baja muchas veces en semanas en que la balanza no se mueve, y saber eso es lo que hace que alguien no abandone en la cuarta semana.",
  },
];

export const FUENTES = [
  {
    cita: "National Institute of Diabetes and Digestive and Kidney Diseases (NIH). Pruebas y diagnóstico de la diabetes.",
    url: "https://www.niddk.nih.gov/health-information/informacion-de-la-salud/diabetes/informacion-general/pruebas-diagnostico",
    nota: "Valores de corte de glucemia en ayunas y hemoglobina glicosilada para prediabetes y diabetes.",
  },
  {
    cita: "The ketogenic diet is not for everyone: contraindications, side effects, and drug interactions.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12777878/",
    nota: "Contraindicaciones, efectos adversos e interacciones medicamentosas de la dieta cetogénica.",
  },
  {
    cita: "Masood W, Annamaraju P, Khan Suheb MZ, Uppaluri KR. The Ketogenic Diet: Clinical Applications, Evidence-based Indications, and Implementation. StatPearls, NCBI Bookshelf.",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK499830/",
    nota: "Revisión general, con el seguimiento clínico recomendado y los controles de laboratorio.",
  },
  {
    cita: "Organización Mundial de la Salud. Obesidad y sobrepeso.",
    url: "https://www.who.int/es/news-room/fact-sheets/detail/obesity-and-overweight",
    nota: "Categorías de índice de masa corporal.",
  },
  {
    cita: "Whelton PK et al. 2017 ACC/AHA/AAPA/ABC/ACPM/AGS/APhA/ASH/ASPC/NMA/PCNA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults. J Am Coll Cardiol.",
    url: "https://pubmed.ncbi.nlm.nih.gov/29146535/",
    nota: "Umbrales de presión arterial y cómo tomarla bien. Es la guía que baja el corte a 130/80; otras guías siguen usando 140/90.",
  },
  {
    cita: "Harvey CJDC, Schofield GM, Williden M. The use of nutritional supplements to induce ketosis and reduce symptoms associated with keto-induction: a narrative review.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5858534/",
    nota: "Síntomas de la adaptación y su relación con agua, sodio y magnesio.",
  },
];
