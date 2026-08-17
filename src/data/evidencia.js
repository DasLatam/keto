// Qué dice la evidencia científica sobre la dieta keto.
//
// REGLA INNEGOCIABLE DE ESTA SECCIÓN: no se cita nada que no se haya verificado
// que existe. Cada entrada lleva su URL real a PubMed o NCBI, y el resumen dice
// lo que el estudio dice — no lo que nos gustaría que dijera. Un sitio de salud
// que inventa una cita pierde la única cosa que lo hace útil, y Google lo trata
// como contenido de baja calidad (criterios E-E-A-T).
//
// Por eso también van los límites y lo que NO está probado. Es lo que separa
// esto de los cientos de blogs que sólo dicen que keto es milagroso.

export const ARTICULOS = [
  {
    slug: "que-dice-la-ciencia-sobre-keto-y-bajar-de-peso",
    titulo: "¿Qué dice la ciencia sobre keto y bajar de peso?",
    bajada:
      "La evidencia es sólida para el corto y mediano plazo, más floja para el largo. Repasamos qué está demostrado, qué no, y por qué la diferencia importa.",
    actualizado: "2026-08-17",
    resumen_directo:
      "Las revisiones sistemáticas muestran que la dieta cetogénica produce pérdida de peso significativa frente a dietas control, sobre todo en los primeros 6 a 12 meses. A partir del año la ventaja frente a otras dietas se achica bastante, y el factor que más pesa deja de ser el tipo de dieta y pasa a ser la adherencia.",
    secciones: [
      {
        titulo: "Lo que está bien documentado",
        parrafos: [
          "La pérdida de peso a corto y mediano plazo es el resultado más consistente. Los metaanálisis de ensayos controlados aleatorizados encuentran reducciones significativas de peso y de circunferencia de cintura frente a dietas de control, y también mejoras en triglicéridos y en hemoglobina glicosilada en personas con diabetes tipo 2.",
          "El mecanismo propuesto tiene dos partes. Por un lado, al bajar los carbohidratos baja la insulina circulante y aumenta la oxidación de grasas. Por otro —y esto explica buena parte del efecto— comer mucha grasa y proteína sacia bastante más, así que la gente termina comiendo menos calorías sin proponérselo.",
          "En síndrome de ovario poliquístico hay revisiones recientes con resultados llamativos en peso, índice de masa corporal y circunferencia de cintura, aunque con muestras chicas.",
        ],
      },
      {
        titulo: "Lo que no está probado",
        parrafos: [
          "La superioridad a largo plazo. Cuando los estudios pasan del año, la diferencia frente a otras dietas de restricción calórica tiende a achicarse. Lo que mejor predice el resultado a dos años no es qué dieta se eligió, sino cuánta gente la sostuvo.",
          "Los efectos sobre el colesterol son heterogéneos: hay quienes mejoran su perfil y quienes suben el LDL de forma marcada. No se puede anticipar en qué grupo va a caer cada persona, y por eso conviene medir antes y a los tres meses.",
          "Tampoco hay evidencia de peso sobre la seguridad de sostener cetosis estricta durante años. La mayoría de los ensayos duran meses.",
        ],
      },
      {
        titulo: "Cuándo consultar antes de empezar",
        parrafos: [
          "Si tomás medicación para la diabetes —insulina o sulfonilureas— la dieta puede bajar la glucosa rápido y provocar hipoglucemias si no se ajustan las dosis. Eso se coordina con quien te la recetó, no por cuenta propia.",
          "Lo mismo con medicación para la presión: al perder líquido en los primeros días, la presión suele bajar y la dosis habitual puede quedar de más.",
          "Embarazo, lactancia, enfermedad renal o hepática, pancreatitis y antecedentes de trastornos de la conducta alimentaria son situaciones donde hace falta supervisión profesional.",
        ],
      },
    ],
    fuentes: [
      {
        cita: "Masood W, Annamaraju P, Khan Suheb MZ, Uppaluri KR. The Ketogenic Diet: Clinical Applications, Evidence-based Indications, and Implementation. StatPearls, NCBI Bookshelf.",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK499830/",
        nota: "Revisión general de aplicaciones clínicas e indicaciones basadas en evidencia.",
      },
      {
        cita: "Effects of ketogenic and low-carbohydrate diets on the body composition of adults with overweight or obesity: a systematic review and meta-analysis of randomised controlled trials.",
        url: "https://pubmed.ncbi.nlm.nih.gov/39854812/",
        nota: "Metaanálisis de ensayos aleatorizados sobre composición corporal.",
      },
      {
        cita: "The Ketogenic Diet in Type 2 Diabetes and Obesity: A Narrative Review of Clinical Evidence.",
        url: "https://pubmed.ncbi.nlm.nih.gov/41683221/",
        nota: "Revisión de la evidencia en diabetes tipo 2 y obesidad.",
      },
      {
        cita: "The Impact of Ketogenic Nutrition on Obesity and Metabolic Health: Mechanisms and Clinical Implications.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12422014/",
        nota: "Mecanismos metabólicos e implicancias clínicas.",
      },
      {
        cita: "Effects of ketogenic diet on weight loss parameters among obese or overweight patients with polycystic ovary syndrome: a systematic review and meta-analysis of randomized controlled trials.",
        url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10989237/",
        nota: "Resultados en síndrome de ovario poliquístico.",
      },
    ],
    faq: [
      {
        p: "¿La dieta keto sirve para bajar de peso según la ciencia?",
        r: "Sí, la evidencia de ensayos controlados aleatorizados y sus metaanálisis muestra pérdida de peso significativa, sobre todo en los primeros 6 a 12 meses. A partir del año la ventaja frente a otras dietas se reduce y lo que más pesa pasa a ser la adherencia.",
      },
      {
        p: "¿Es peligrosa la dieta keto?",
        r: "Para la mayoría de las personas sanas es segura en el corto y mediano plazo. Requiere supervisión profesional si tomás medicación para diabetes o presión, si estás embarazada o amamantando, o si tenés enfermedad renal, hepática o antecedentes de trastornos alimentarios.",
      },
      {
        p: "¿Keto sube el colesterol?",
        r: "Depende de la persona. Los estudios muestran resultados heterogéneos: algunos mejoran el perfil lipídico y otros suben el LDL de forma marcada. No se puede predecir de antemano, por lo que conviene medir antes de empezar y a los tres meses.",
      },
    ],
  },
  {
    slug: "gripe-keto-por-que-pasa-y-como-evitarla",
    titulo: "La «gripe keto»: qué dice la investigación y cómo se evita",
    bajada:
      "Dolor de cabeza, cansancio y calambres en los primeros días. No es una gripe ni una desintoxicación: es pérdida de sodio y de agua, y se previene.",
    actualizado: "2026-08-17",
    resumen_directo:
      "Los síntomas de los primeros días —dolor de cabeza, mareo, náuseas, fatiga y poca tolerancia al ejercicio— aparecen sobre todo por hipovolemia: al bajar los carbohidratos, el cuerpo elimina sodio y agua. La literatura apunta a la reposición de sodio, potasio y magnesio, y a tomar más líquido, como la forma de prevenirlos. Suelen resolverse en días o pocas semanas.",
    secciones: [
      {
        titulo: "Qué se reporta y con qué frecuencia",
        parrafos: [
          "Los síntomas descritos con más frecuencia al arrancar son dolor de cabeza, mareo, náuseas, vómitos, fatiga, baja tolerancia al ejercicio y constipación. En una revisión narrativa que analizó reportes de un foro abierto con 300 participantes, 101 mencionaron síntomas de este tipo, concentrados en las primeras cuatro semanas: casi la mitad describió un cuadro parecido a una gripe, un 24,8 % dolor de cabeza y un 17,8 % fatiga.",
          "El nombre «gripe keto» es popular, no clínico. No hay infección ni fiebre: la coincidencia es con la sensación general de malestar y cansancio.",
        ],
      },
      {
        titulo: "Por qué pasa",
        parrafos: [
          "La explicación con más respaldo es la hipovolemia: una caída del volumen de líquido circulante. Al reducir los carbohidratos, baja la insulina, y una de las funciones de la insulina es indicarle al riñón que retenga sodio. Con menos insulina, el riñón elimina más sodio y con él se va el agua — un efecto natriurético y diurético bien documentado en esta dieta.",
          "A eso se suma el vaciado de las reservas de glucógeno. Cada gramo de glucógeno se almacena junto con unos tres gramos de agua, así que al agotarlo se pierde bastante líquido en pocos días. Es también la razón por la que la balanza baja mucho la primera semana y después se frena: esa parte fue agua, no grasa.",
          "El tercer factor es la menor ingesta de algunos micronutrientes, en particular potasio y magnesio, que suelen venir de alimentos que quedan fuera de la dieta.",
        ],
      },
      {
        titulo: "Qué hacer",
        parrafos: [
          "La literatura apunta a lo mismo en todos los casos: cubrir sodio y potasio de forma deliberada, y aumentar la ingesta de líquido. Salar la comida más de lo habitual deja de ser un pecado y pasa a ser parte del plan, algo contraintuitivo para quien viene de años escuchando lo contrario.",
          "En la práctica, un caldo salado a media tarde durante la primera semana resuelve buena parte del cuadro. El magnesio suele ser el que falta cuando aparecen calambres nocturnos.",
          "Y conviene tener expectativas realistas: los efectos se concentran en la fase de adaptación y tienden a resolverse en días o pocas semanas. Si a las cuatro semanas seguís igual, eso ya no es adaptación y vale la pena consultar.",
        ],
      },
      {
        titulo: "Cuándo esta dieta no es para vos",
        parrafos: [
          "Hay contraindicaciones documentadas e interacciones con medicación que no se negocian por cuenta propia. Las más relevantes son la medicación para diabetes —insulina y sulfonilureas, por riesgo de hipoglucemia—, los antihipertensivos, y ciertos trastornos metabólicos poco frecuentes.",
          "También hay que considerar enfermedad hepática o pancreática, antecedentes de cálculos renales y trastornos de la conducta alimentaria.",
        ],
      },
    ],
    fuentes: [
      {
        cita: "Harvey CJDC, Schofield GM, Williden M. The use of nutritional supplements to induce ketosis and reduce symptoms associated with keto-induction: a narrative review.",
        url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5858534/",
        nota: "Revisión narrativa sobre síntomas de keto-inducción y su relación con hidratación y micronutrientes.",
      },
      {
        cita: "The ketogenic diet is not for everyone: contraindications, side effects, and drug interactions.",
        url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12777878/",
        nota: "Contraindicaciones, efectos adversos e interacciones con medicación.",
      },
      {
        cita: "Masood W, Annamaraju P, Khan Suheb MZ, Uppaluri KR. The Ketogenic Diet: Clinical Applications, Evidence-based Indications, and Implementation. StatPearls, NCBI Bookshelf.",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK499830/",
        nota: "Efectos adversos frecuentes y su curso temporal.",
      },
      {
        cita: "The effects of a 6-week controlled, hypocaloric ketogenic diet, with and without exogenous ketone salts, on cognitive performance and mood states in overweight and obese adults.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9563373/",
        nota: "Ensayo controlado sobre rendimiento cognitivo y estado de ánimo durante la adaptación.",
      },
    ],
    faq: [
      {
        p: "¿Qué es la gripe keto y cuánto dura?",
        r: "Es el conjunto de síntomas de los primeros días de la dieta: dolor de cabeza, mareo, náuseas, fatiga y poca tolerancia al ejercicio. Se concentra en las primeras semanas y tiende a resolverse en días o pocas semanas. No es una infección ni una desintoxicación.",
      },
      {
        p: "¿Por qué me duele la cabeza al empezar keto?",
        r: "Principalmente por pérdida de sodio y de agua. Al bajar los carbohidratos cae la insulina, y con ella la señal que le indica al riñón retener sodio, así que se elimina más sodio y más líquido. Reponer sal y tomar más agua suele resolverlo.",
      },
      {
        p: "¿Cómo se evita la gripe keto?",
        r: "Cubriendo sodio y potasio de forma deliberada y aumentando la ingesta de líquido desde el primer día. Salar la comida más de lo habitual y tomar un caldo salado durante la primera semana es la medida más efectiva y más simple.",
      },
      {
        p: "¿Por qué bajo mucho de peso la primera semana y después se frena?",
        r: "Porque esa bajada inicial es en buena parte agua. Cada gramo de glucógeno se almacena con unos tres gramos de agua, y al agotar esas reservas se pierde el líquido que retenían. La pérdida de grasa viene después y es más lenta.",
      },
    ],
  },
  {
    slug: "keto-y-diabetes-tipo-2-que-muestran-los-ensayos",
    titulo: "Keto y diabetes tipo 2: qué muestran los ensayos",
    bajada:
      "Es el área donde la evidencia es más fuerte, y también donde más cuidado hay que tener: la dieta puede obligar a cambiar la medicación.",
    actualizado: "2026-08-17",
    resumen_directo:
      "Los ensayos y metaanálisis muestran que las dietas cetogénicas y bajas en carbohidratos mejoran el control glucémico frente a dietas bajas en grasa: baja la hemoglobina glicosilada, bajan los triglicéridos, sube el HDL y muchas personas reducen la medicación. Las tasas de remisión son altas al primer año y caen de forma marcada con los años. **Nada de esto se hace sin coordinar la medicación con quien la recetó.**",
    secciones: [
      {
        titulo: "Qué mejora, según los ensayos",
        parrafos: [
          "Los metaanálisis de ensayos clínicos encuentran mejor control glucémico con dieta cetogénica que con dieta baja en grasas, medido sobre todo por hemoglobina glicosilada. También aparecen mejoras en el índice HOMA, que estima la resistencia a la insulina.",
          "En el perfil lipídico el resultado más consistente es la baja de triglicéridos y el aumento del HDL. El comportamiento del LDL es más variable entre personas, y por eso conviene medir antes de empezar y a los pocos meses.",
          "Un hallazgo que se repite y que importa en la vida real: buena parte de los participantes reduce la dependencia de medicación hipoglucemiante y antihipertensiva a lo largo del estudio.",
        ],
      },
      {
        titulo: "Remisión: el número que hay que leer con contexto",
        parrafos: [
          "En revisiones de largo plazo, las tasas de remisión son más altas al año —se reportan cifras de hasta el 62 %— y caen de forma marcada con el tiempo, hasta alrededor del 13 % a los cinco años. El ensayo DiRECT, que usó dietas muy bajas en calorías en atención primaria, reportó 46 % de remisión al año y 36 % a los dos años.",
          "La lectura honesta de esos números es doble. Por un lado, que la remisión de la diabetes tipo 2 por vía alimentaria es posible y está documentada, algo que hace veinte años no se daba por sentado. Por otro, que sostenerla en el tiempo es difícil: la caída entre el año uno y el año cinco habla de recuperación de peso y de recaída glucémica.",
          "Dicho de otro modo: lo que hace la diferencia a cinco años no es el arranque, es la adherencia.",
        ],
      },
      {
        titulo: "El riesgo concreto: hipoglucemia",
        parrafos: [
          "Este es el punto que separa a la diabetes del resto de los casos. Si tomás insulina o sulfonilureas, bajar los carbohidratos de golpe puede provocar una hipoglucemia, y la dosis que era correcta el lunes puede ser peligrosa el miércoles.",
          "No es un riesgo teórico ni una advertencia de trámite: es la razón por la que los ensayos serios ajustan la medicación al inicio y monitorean glucemia con frecuencia. Fuera de un estudio, eso lo hace tu médico.",
          "Lo mismo aplica, en menor medida, a la medicación para la presión: la pérdida de líquido de los primeros días suele bajarla, y la dosis habitual puede quedar de más.",
        ],
      },
      {
        titulo: "Qué no dice esta evidencia",
        parrafos: [
          "No dice que keto sea la única forma de mejorar la diabetes tipo 2. Varias intervenciones de restricción calórica logran resultados comparables, y el ensayo DiRECT —el de mejores tasas de remisión— usó dietas muy bajas en calorías, no cetogénicas.",
          "Tampoco dice que la mejora sea permanente. Los datos a cinco años muestran una caída importante, y ningún estudio disponible sigue a las personas durante décadas.",
        ],
      },
    ],
    fuentes: [
      {
        cita: "Long-Term Efficacy and Safety of a Low-Carbohydrate Diet in Type 2 Diabetes Remission: A Systematic Review.",
        url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12476234/",
        nota: "Revisión sistemática con tasas de remisión a uno y cinco años.",
      },
      {
        cita: "Effects of the Ketogenic Diet on Glycemic Control in Diabetic Patients: Meta-Analysis of Clinical Trials.",
        url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7641470/",
        nota: "Metaanálisis sobre hemoglobina glicosilada e índice HOMA.",
      },
      {
        cita: "Ketogenic Diet and Its Potential Role in Preventing Type 2 Diabetes Mellitus and Its Complications: A Narrative Review of Randomized Controlled Trials.",
        url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11380086/",
        nota: "Revisión de ensayos aleatorizados en prevención y complicaciones.",
      },
      {
        cita: "Impact of a Ketogenic Diet on Metabolic Parameters in Patients with Obesity or Overweight and with or without Type 2 Diabetes: A Meta-Analysis of Randomized Controlled Trials.",
        url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7400909/",
        nota: "Parámetros metabólicos y perfil lipídico.",
      },
    ],
    faq: [
      {
        p: "¿La dieta keto puede revertir la diabetes tipo 2?",
        r: "Hay remisión documentada en ensayos clínicos, con tasas altas al primer año —se reportan cifras de hasta el 62 %— que caen de forma marcada con los años, hasta alrededor del 13 % a los cinco. Es posible, pero sostenerlo en el tiempo es lo difícil.",
      },
      {
        p: "¿Puedo hacer keto si tomo insulina o metformina?",
        r: "No sin coordinarlo con tu médico. Bajar los carbohidratos de golpe puede provocar hipoglucemia si tomás insulina o sulfonilureas, porque la dosis que era correcta antes puede ser excesiva después. La medicación se ajusta con quien la recetó.",
      },
      {
        p: "¿Keto baja la hemoglobina glicosilada?",
        r: "Los metaanálisis de ensayos clínicos muestran mejor control glucémico con dieta cetogénica que con dieta baja en grasas, medido por hemoglobina glicosilada, junto con baja de triglicéridos y aumento del HDL.",
      },
    ],
  },
];
