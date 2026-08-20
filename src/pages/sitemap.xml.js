// `/sitemap.xml`, que es donde todo el mundo lo busca.
//
// `@astrojs/sitemap` genera `sitemap-index.xml` + `sitemap-0.xml` y no deja
// renombrarlos. Google acepta cualquier nombre, pero el que se escribe a mano en
// Search Console, el que prueban las herramientas de auditoría y el que la gente
// tipea en la barra es `sitemap.xml`. Así que esto es un índice de sitemaps —seis
// líneas de XML— que apunta al que genera la integración.
//
// Se hace así y no copiando la lista de URLs para que haya **una sola fuente de
// verdad**: las URLs las sigue emitiendo la integración en el build, y esto no se
// puede desincronizar porque no sabe qué páginas existen.
//
// El único supuesto es que la integración emite un solo archivo. Su `entryLimit`
// por defecto es 45.000 URLs y el sitio tiene 122: si algún día hicieran falta
// `sitemap-1.xml` y siguientes, hay que agregarlos acá.

const ARCHIVOS = ["sitemap-0.xml"];

export function GET({ site }) {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...ARCHIVOS.map((a) => `  <sitemap><loc>${new URL(a, site).href}</loc></sitemap>`),
    "</sitemapindex>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
