// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// `site` es obligatorio para que el sitemap emita URLs absolutas y para que las
// canonical y las Open Graph del Layout apunten a algo real. Cuando el dominio
// definitivo esté en Vercel, se cambia acá y nada más.
export default defineConfig({
  site: "https://ketofacil.vercel.app",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      // Prioridad y frecuencia por tipo de página. No son un ranking —Google no
      // lo usa como tal— pero sí le dicen al rastreador dónde volver: el índice
      // de recetas cambia seguido y una política de cookies no cambia nunca.
      //
      // **No se emite `lastmod`.** El único valor disponible acá sería la fecha
      // del build, y eso pondría "modificada hoy" en las 122 páginas cada vez que
      // se toca una coma en el pie. Un `lastmod` que miente es peor que no
      // tenerlo: Google deja de creerle al campo para todo el dominio. Las
      // páginas que sí saben cuándo cambiaron lo declaran en su JSON-LD.
      serialize(item) {
        const ruta = new URL(item.url).pathname;
        const es = (re) => re.test(ruta);

        if (ruta === "/") {
          return { ...item, changefreq: "weekly", priority: 1.0 };
        }
        if (es(/^\/(recetas|productos|negociemos|evidencia|ejercicios)\/$/)) {
          return { ...item, changefreq: "weekly", priority: 0.9 };
        }
        if (es(/^\/(plan-semanal|lista-compras|como-empezar|calculadora|controles-medicos|ayuno-intermitente)\/$/)) {
          return { ...item, changefreq: "monthly", priority: 0.9 };
        }
        if (es(/^\/(politica-de-privacidad|politica-de-cookies|condiciones-de-servicio)\/$/)) {
          return { ...item, changefreq: "yearly", priority: 0.3 };
        }
        return { ...item, changefreq: "monthly", priority: 0.7 };
      },
    }),
  ],
});
