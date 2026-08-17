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
];
