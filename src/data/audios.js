// Qué audios acompañan a cada rutina.
//
// Los datos de cada archivo (duración, peso, nombre) salen de `audios.json`, que
// lo escribe `scripts/audios/generar.py` al terminar y lo copia al repo
// `scripts/subir_audios.sh`. Acá sólo está el reparto y los subtítulos, que son
// decisiones editoriales y no salen de ningún proceso.
//
// Los MP3 no están en el repo: se sirven desde Ferozo. Ver `AudioGuia.astro`.
import manifiesto from "./audios.json";

/** Subtítulo de cada caminata. Las rutinas no llevan: su título ya lo dice todo. */
const BAJADAS = {
  "caminata-1-por-que-funciona":
    "La evidencia, y seis desayunos.",
  "caminata-2-lo-que-te-van-a-decir":
    "El alcohol, la fruta, las gaseosas: qué se negocia y qué no. Con seis almuerzos.",
  "caminata-3-el-super-y-la-semana":
    "Góndola por góndola, la semana armada y seis cenas.",
};

/** Qué audios van en la página de cada rutina. */
const REPARTO = {
  "elongacion-manana": ["elongacion-manana"],
  "fuerza-en-casa": ["fuerza-en-casa"],
  "caminata-40": [
    "caminata-1-por-que-funciona",
    "caminata-2-lo-que-te-van-a-decir",
    "caminata-3-el-super-y-la-semana",
  ],
};

// Un audio que está en el reparto pero todavía no se generó simplemente no
// aparece: así se puede publicar el sitio con dos de las tres caminatas hechas.
export const AUDIOS_POR_RUTINA = Object.fromEntries(
  Object.entries(REPARTO).map(([rutina, slugs]) => [
    rutina,
    slugs
      .filter((s) => manifiesto[s])
      .map((s) => ({ slug: s, ...manifiesto[s], bajada: BAJADAS[s] ?? null })),
  ]),
);

/** Todos los audios, para la página índice de ejercicios. */
export const AUDIOS = Object.values(AUDIOS_POR_RUTINA).flat();
