// `/rutina-keto.ics` — el calendario de las tres rutinas con los horarios por
// defecto, listo para descargar sin configurar nada.
//
// Existe porque la mayoría no va a tocar ningún control: entra, aprieta
// "descargar" y lo importa. La página `/calendario` genera la versión a medida en
// el navegador con el mismo módulo, así que no hay dos formatos que mantener.
//
// Se genera en el build (el sitio es estático), y las repeticiones son semanales
// sin fecha de fin, así que el archivo no vence: importado en marzo sigue
// agendando la caminata de los lunes en octubre.
import { RUTINAS } from "../data/ejercicios.js";
import { armarEventos, generarICS } from "../lib/ics.js";

export function GET({ site }) {
  const eventos = armarEventos({
    desde: new Date(),
    RUTINAS,
    comidas: false,
    compra: false,
    personas: 1,
    sitio: (site?.href ?? "https://ketofacil.vercel.app/").replace(/\/$/, ""),
  });

  return new Response(generarICS(eventos, "Keto Argentina · Rutina"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="rutina-keto.ics"',
    },
  });
}
