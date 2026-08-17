// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// `site` es obligatorio para que el sitemap emita URLs absolutas y para que las
// canonical y las Open Graph del Layout apunten a algo real. Cuando el dominio
// definitivo esté en Vercel, se cambia acá y nada más.
export default defineConfig({
  site: "https://keto-argentina.vercel.app",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
