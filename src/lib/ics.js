// Generador de archivos .ics (iCalendar, RFC 5545).
//
// Es lo que hace que los recordatorios funcionen de verdad: un .ics se importa en
// Google Calendar, en el Calendario de iPhone, en Outlook y en Thunderbird sin
// que el sitio tenga que integrarse con ninguno. La alternativa —notificaciones
// del navegador— sólo avisa si la persona tiene la pestaña abierta, que es justo
// cuando no hace falta el aviso.
//
// El módulo se usa en dos lados: en el build, para emitir `/rutina-keto.ics` con
// los valores por defecto, y en el navegador, para armar el archivo con los
// horarios que elija cada uno en `/calendario`.

/** Los saltos de línea de iCalendar son CRLF y no es negociable: con \n solo,
 *  el Calendario de iPhone rechaza el archivo entero sin decir por qué. */
const CRLF = "\r\n";

/**
 * Escapa un texto para un campo de iCalendar. Las comas y los punto y coma son
 * separadores de campo en el formato, así que un SUMMARY con una coma sin escapar
 * parte el evento en dos y el archivo deja de importar.
 */
function esc(texto) {
  return String(texto)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Las líneas de iCalendar no pueden pasar de 75 **octetos** (no caracteres): hay
 * que "doblarlas" partiéndolas y arrancando la continuación con un espacio. Sin
 * esto, una descripción larga rompe el archivo en algunos clientes.
 *
 * La distinción entre octetos y caracteres importa acá: el texto está lleno de
 * acentos (2 bytes) y de emojis (4 bytes), así que contar caracteres deja líneas
 * de hasta 300 octetos. Se recorre por *code point* —con el iterador de string,
 * que no parte los pares subrogados de un emoji— sumando el peso en bytes de
 * cada uno.
 */
function doblar(linea) {
  const bytes = (s) => new TextEncoder().encode(s).length;
  if (bytes(linea) <= 75) return linea;

  const partes = [];
  let actual = "";
  let peso = 0;
  // La primera línea admite 75 octetos; las siguientes 74, porque el espacio
  // inicial de continuación ocupa uno.
  let tope = 75;

  for (const c of linea) {
    const b = bytes(c);
    if (peso + b > tope) {
      partes.push(actual);
      actual = "";
      peso = 0;
      tope = 74;
    }
    actual += c;
    peso += b;
  }
  if (actual) partes.push(actual);

  return partes.map((p, i) => (i === 0 ? p : " " + p)).join(CRLF);
}

/** Fecha y hora en formato local flotante: 20260817T183000.
 *  Sin la Z del final a propósito — un evento "flotante" cae a las 18:30 de la
 *  zona del teléfono, que es lo que se quiere para una rutina de ejercicio. Con
 *  hora UTC, quien viaja o cambia de horario de verano se encuentra la caminata
 *  agendada a las 15:30. */
function fechaHora(fecha, hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const p = (n) => String(n).padStart(2, "0");
  return (
    `${fecha.getFullYear()}${p(fecha.getMonth() + 1)}${p(fecha.getDate())}` +
    `T${p(h)}${p(m)}00`
  );
}

/** Marca de tiempo UTC para DTSTAMP, que sí debe ser absoluta. Ya viene con la
 *  Z del final: `toISOString()` la trae. */
function ahoraUTC() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

const DIAS_ICS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

/**
 * Primera fecha, a partir de `desde`, que caiga en uno de los días pedidos. Si el
 * primer día de la serie fuera anterior a hoy, Google Calendar igual expande la
 * repetición, pero el usuario abre el calendario y no ve nada en la semana en
 * curso: conviene arrancar en la próxima ocurrencia real.
 */
function primeraFecha(desde, dias) {
  const f = new Date(desde);
  for (let i = 0; i < 7; i++) {
    if (dias.includes(DIAS_ICS[f.getDay()])) return f;
    f.setDate(f.getDate() + 1);
  }
  return new Date(desde);
}

/**
 * Un VEVENT que se repite todas las semanas en los días indicados.
 *
 * @param {object} ev
 * @param {string} ev.uid        identificador estable: si se reimporta el mismo
 *                               archivo, el cliente actualiza el evento en lugar
 *                               de duplicarlo.
 * @param {string} ev.titulo
 * @param {string} ev.detalle
 * @param {string} ev.hora       "18:30"
 * @param {number} ev.duracion   minutos
 * @param {string[]} ev.dias     ["MO","WE","FR"]
 * @param {number} ev.aviso      minutos antes del recordatorio (0 = sin alarma)
 * @param {Date}   ev.desde      fecha de inicio de la serie
 * @param {number} [ev.semanas]  si se indica, la serie termina a las N semanas
 * @param {number} [ev.cada]     cada cuántas semanas se repite (1 = todas)
 * @param {number} [ev.correr]   cuántas semanas se corre el arranque de la serie
 */
function evento({ uid, titulo, detalle, url, hora, duracion, dias, aviso, desde,
                  semanas, cada = 1, correr = 0 }) {
  const inicio = primeraFecha(desde, dias);
  // El plan del mes son cuatro semanas distintas: la comida de la semana 3 se
  // repite cada cuatro semanas y arranca dos semanas después que la de la 1.
  if (correr) inicio.setDate(inicio.getDate() + 7 * correr);
  const fin = new Date(inicio);
  const [h, m] = hora.split(":").map(Number);
  fin.setHours(h, m + duracion, 0, 0);

  const l = [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${ahoraUTC()}`,
    `DTSTART:${fechaHora(inicio, hora)}`,
    `DTEND:${fechaHora(fin, `${String(fin.getHours()).padStart(2, "0")}:${String(fin.getMinutes()).padStart(2, "0")}`)}`,
    `RRULE:FREQ=WEEKLY${cada > 1 ? `;INTERVAL=${cada}` : ""};BYDAY=${dias.join(",")}` +
      (semanas ? `;COUNT=${Math.ceil(semanas / cada) * dias.length}` : ""),
    `SUMMARY:${esc(titulo)}`,
    `DESCRIPTION:${esc(detalle)}`,
    "TRANSP:OPAQUE",
  ];
  if (url) l.push(`URL:${esc(url)}`);
  if (aviso > 0) {
    l.push(
      "BEGIN:VALARM",
      `TRIGGER:-PT${aviso}M`,
      "ACTION:DISPLAY",
      `DESCRIPTION:${esc(titulo)}`,
      "END:VALARM"
    );
  }
  l.push("END:VEVENT");
  return l;
}

/**
 * Arma el .ics completo.
 *
 * @param {object[]} eventos  la lista de eventos ya resuelta (ver `armarEventos`)
 * @param {string} nombre     nombre del calendario, el que se ve al importarlo
 */
export function generarICS(eventos, nombre = "Keto Argentina") {
  const lineas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Keto Argentina//Rutina y comidas//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(nombre)}`,
    "X-WR-TIMEZONE:America/Argentina/Buenos_Aires",
    ...eventos.flatMap(evento),
    "END:VCALENDAR",
  ];
  return lineas.map(doblar).join(CRLF) + CRLF;
}

/** Sufijo estable para los UID. Se mantiene fijo (no lleva la fecha) para que
 *  reimportar el archivo actualice los eventos en lugar de duplicarlos. */
const DOMINIO = "ketoargentina";

/**
 * Traduce la configuración elegida en la página a la lista de eventos.
 *
 * @param {object} cfg
 * @param {Date}    cfg.desde        fecha de inicio
 * @param {object}  cfg.rutinas      { slug: {hora, dias, aviso, activa} }
 * @param {object[]} cfg.RUTINAS     datos de `src/data/ejercicios.js`
 * @param {boolean} cfg.comidas      agendar las 28 comidas del plan
 * @param {object}  cfg.horasComida  { desayuno: "08:00", ... }
 * @param {object[]} [cfg.semanas]   las cuatro semanas del plan del mes
 * @param {object}  [cfg.recetas]    recetas por slug, para el nombre y las calorías
 * @param {boolean} cfg.compra       agendar el recordatorio de la compra semanal
 * @param {string}  cfg.diaCompra    "SA"
 * @param {string}  cfg.horaCompra   "10:00"
 * @param {number}  cfg.personas     para el texto del recordatorio de compra
 * @param {string}  cfg.sitio        URL base, para el campo URL de cada evento
 */
export function armarEventos(cfg) {
  const eventos = [];
  const sitio = cfg.sitio ?? "https://ketofacil.vercel.app";

  // ── Las rutinas de ejercicio ────────────────────────────────────────
  for (const rutina of cfg.RUTINAS) {
    const c = cfg.rutinas?.[rutina.slug];
    if (c && c.activa === false) continue;

    const hora = c?.hora ?? rutina.agenda.hora;
    const dias = c?.dias?.length ? c.dias : rutina.agenda.dias;
    const aviso = c?.aviso ?? rutina.agenda.aviso;

    // La descripción lleva el primer ejercicio de cada bloque: es lo que se ve
    // en la notificación del celular sin abrir nada, y alcanza para arrancar.
    const guia = rutina.bloques
      .map((b) => `${b.nombre}: ${b.ejercicios.map((e) => e.nombre).join(", ")}`)
      .join("\n");

    eventos.push({
      uid: `rutina-${rutina.slug}@${DOMINIO}`,
      titulo: `${rutina.emoji} ${rutina.nombre}`,
      detalle: `${rutina.resumen}\n\n${guia}\n\nLa rutina completa: ${sitio}/ejercicios/${rutina.slug}`,
      url: `${sitio}/ejercicios/${rutina.slug}`,
      hora,
      duracion: rutina.duracion,
      dias,
      aviso,
      desde: cfg.desde,
    });
  }

  // ── La ventana de comida del ayuno intermitente ─────────────────────
  // Un solo evento diario que va de la primera comida a la última. Es lo que
  // convierte "hago ayuno" en algo que se ve en la pantalla del teléfono: fuera
  // de ese bloque, no se come.
  //
  // La ventana se calcula con los horarios que haya puestos en la página, no con
  // los del esquema: si alguien cena a las diez, su ventana termina a las diez y
  // el evento tiene que decir eso.
  if (cfg.ayuno?.saltea?.length && cfg.horasComida) {
    const quedan = ["desayuno", "almuerzo", "merienda", "cena"]
      .filter((c) => !cfg.saltea?.includes(c))
      .map((c) => cfg.horasComida[c])
      .filter(Boolean)
      .sort();

    if (quedan.length) {
      const desde = quedan[0];
      const hasta = quedan[quedan.length - 1];
      const minutos = (h) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3));
      const dur = Math.max(30, minutos(hasta) - minutos(desde));
      const horas = Math.round(dur / 60);

      eventos.push({
        uid: `ayuno-ventana@${DOMINIO}`,
        titulo: `⏳ Ventana de comida (${24 - horas}:${horas})`,
        detalle:
          `Entre ${desde} y ${hasta} se come; el resto del día, no.\n\n` +
          `${cfg.ayuno.nombre}: ${cfg.ayuno.resumen}\n\n` +
          `Agua, café solo, té y mate amargo no cortan el ayuno.\n\n` +
          `Cómo funciona: ${sitio}/ayuno-intermitente`,
        url: `${sitio}/ayuno-intermitente`,
        hora: desde,
        duracion: dur,
        dias: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
        aviso: 0,
        desde: cfg.desde,
      });
    }
  }

  // ── Las comidas del plan del mes ────────────────────────────────────
  //
  // Un evento por comida, por día y por semana del mes, repitiendo **cada cuatro
  // semanas**: el lunes de la primera semana cae un desayuno y el de la tercera
  // cae otro. Son 112 eventos, y por eso van detrás de una casilla: quien ya
  // tiene el calendario del trabajo cargado no los quiere.
  //
  // Con `FREQ=WEEKLY;INTERVAL=4` y el arranque corrido, el calendario rota solo
  // y para siempre. La alternativa —112 eventos sueltos con fecha fija— se queda
  // sin comidas al mes y medio.
  if (cfg.comidas && cfg.semanas) {
    const CLAVES = [
      ["desayuno", "Desayuno"],
      ["almuerzo", "Almuerzo"],
      ["merienda", "Merienda"],
      ["cena", "Cena"],
    ];
    for (const [si, sem] of cfg.semanas.entries()) {
    for (const dia of sem.dias) {
      const diaICS = DIAS_ICS[
        ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].indexOf(dia.dia)
      ];
      if (!diaICS) continue;

      for (const [clave, etiqueta] of CLAVES) {
        // Las comidas que saltea el ayuno no se agendan: un recordatorio de
        // desayuno para alguien que decidió no desayunar es exactamente el tipo
        // de aviso que hace que se desactiven todos los avisos.
        if (cfg.saltea?.includes(clave)) continue;
        const receta = cfg.recetas?.[dia[clave]];
        if (!receta) continue;
        const hora = cfg.horasComida?.[clave];
        if (!hora) continue;

        const rinde =
          cfg.personas > receta.porciones
            ? `\nPara ${cfg.personas} personas hay que hacerla ${Math.ceil(cfg.personas / receta.porciones)} veces (rinde ${receta.porciones}).`
            : "";

        eventos.push({
          uid: `comida-s${si + 1}-${dia.dia.toLowerCase()}-${clave}@${DOMINIO}`,
          titulo: `🍽 ${etiqueta}: ${receta.nombre}`,
          detalle:
            `${receta.macros.calorias} cal · ${receta.macros.carbos} g de carbos netos · ${receta.minutos} min` +
            `${rinde}\n\nIngredientes: ${receta.ingredientes.join("; ")}` +
            `\n\nLa receta: ${sitio}/recetas/${receta.slug}`,
          url: `${sitio}/recetas/${receta.slug}`,
          hora,
          duracion: 30,
          dias: [diaICS],
          aviso: 15,
          desde: cfg.desde,
          cada: cfg.semanas.length,
          correr: si,
        });
      }
    }
    }
  }

  // ── La compra semanal ───────────────────────────────────────────────
  if (cfg.compra) {
    eventos.push({
      uid: `compra-semanal@${DOMINIO}`,
      titulo: "🛒 Compra de la semana",
      detalle:
        `La lista completa, ya calculada para ${cfg.personas} ${cfg.personas === 1 ? "persona" : "personas"}, ` +
        `con casillas para ir tildando en el súper: ${sitio}/lista-compras`,
      url: `${sitio}/lista-compras`,
      hora: cfg.horaCompra ?? "10:00",
      duracion: 60,
      dias: [cfg.diaCompra ?? "SA"],
      aviso: 60,
      desde: cfg.desde,
    });
  }

  return eventos;
}
