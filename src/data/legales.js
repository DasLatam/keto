// Índice de las páginas legales. Vive en un archivo aparte porque lo consumen
// tres lugares: el pie del `Layout`, el enlace cruzado del `Legal` y el aviso de
// cookies. Repetir la lista en cada uno garantiza que en el próximo cambio uno
// quede desactualizado.
export const LEGALES = [
  { slug: "condiciones-de-servicio", titulo: "Condiciones de Servicio" },
  { slug: "politica-de-privacidad", titulo: "Política de Privacidad" },
  { slug: "politica-de-cookies", titulo: "Política de Cookies" },
];

/** Fecha de última revisión de los tres textos, en ISO. Se toca cuando cambia el
 *  contenido legal — no en cada deploy del sitio. */
export const ACTUALIZADO = "2026-08-17";

/** Correo de contacto para ejercer derechos y para consultas legales. */
export const CONTACTO = "info@baudry.com.ar";
