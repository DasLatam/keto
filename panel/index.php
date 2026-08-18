<?php
/**
 * Panel de medios de Keto Argentina.
 *
 * Una sola página: login, y después la galería de las 49 recetas con sus 4
 * candidatas, las fotos y videos propios y los enlaces de YouTube.
 *
 * Está pensado para usarse **desde el celular**, que es donde Ariel va a estar
 * cuando cocine y saque la foto. Por eso todo se toca con el pulgar y las
 * miniaturas son chicas.
 */

declare(strict_types=1);
require __DIR__ . '/lib.php';

preparar();
abrirSesion();

// El panel no se indexa. La cabecera va antes que cualquier salida.
header('X-Robots-Tag: noindex, nofollow, noarchive');
header('Referrer-Policy: no-referrer');

$error = null;
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && isset($_POST['usuario'])) {
    if (intentarLogin((string) $_POST['usuario'], (string) ($_POST['clave'] ?? ''))) {
        // Redirección después del POST: así recargar no reenvía la contraseña.
        header('Location: ' . strtok($_SERVER['REQUEST_URI'] ?? '/keto-panel/', '?'));
        exit;
    }
    $error = frenoLogin() >= 10
        ? 'Demasiados intentos. Probá de nuevo en quince minutos.'
        : 'Usuario o contraseña incorrectos.';
}
$entro = autenticado();
?>
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#12100e">
<title>Panel de medios — Keto</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><text y='14' font-size='14'>🥑</text></svg>">
<style>
  /* Utilitario a propósito: esto es una herramienta, no una página del sitio. */
  *, *::before, *::after { box-sizing: border-box; }
  :root {
    --fondo:#12100e; --panel:#1c1916; --borde:#332e28; --texto:#ede7dd;
    --suave:#a49a8c; --verde:#7cb342; --naranja:#e8913a; --rojo:#d2564b;
  }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin:0; background:var(--fondo); color:var(--texto);
    font:15px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    padding-bottom: env(safe-area-inset-bottom);
  }
  a { color:var(--naranja); }
  h1 { font-size:1.15rem; margin:0; }

  /* ── Login ── */
  .login { max-width:22rem; margin:15vh auto; padding:0 1.25rem; }
  .login h1 { margin-bottom:.25rem; }
  .login p { color:var(--suave); font-size:.85rem; margin:0 0 1.5rem; }
  label { display:block; font-size:.8rem; color:var(--suave); margin:.9rem 0 .3rem; }
  input[type=text], input[type=password], input[type=url] {
    width:100%; padding:.7rem .8rem; border-radius:.5rem; font-size:1rem;
    background:var(--panel); border:1px solid var(--borde); color:var(--texto);
  }
  input:focus-visible, button:focus-visible, .cand:focus-visible {
    outline:2px solid var(--naranja); outline-offset:2px;
  }
  button {
    font:inherit; cursor:pointer; border-radius:.5rem; border:1px solid var(--borde);
    background:var(--panel); color:var(--texto); padding:.55rem .9rem;
  }
  button.primario { background:var(--verde); border-color:var(--verde); color:#10240a; font-weight:600; }
  button:disabled { opacity:.5; cursor:default; }
  .error { color:var(--rojo); font-size:.85rem; margin-top:.9rem; }

  /* ── Barra ── */
  header.barra {
    position:sticky; top:0; z-index:10; background:rgba(18,16,14,.94);
    backdrop-filter:blur(8px); border-bottom:1px solid var(--borde);
    padding:.7rem 1rem calc(.7rem + env(safe-area-inset-bottom, 0px) * 0);
    display:flex; gap:.75rem; align-items:center; flex-wrap:wrap;
  }
  .barra .crece { flex:1 1 auto; }
  .chips { display:flex; gap:.4rem; overflow-x:auto; padding:.55rem 1rem; }
  .chips button { white-space:nowrap; font-size:.8rem; padding:.35rem .7rem; color:var(--suave); }
  .chips button[aria-pressed=true] { background:var(--naranja); border-color:var(--naranja); color:#2a1a06; font-weight:600; }

  main { padding:0 1rem 4rem; }
  .grupo { margin-top:1.5rem; font-size:.75rem; letter-spacing:.08em;
           text-transform:uppercase; color:var(--suave); }

  /* ── Ficha de receta ── */
  .receta { background:var(--panel); border:1px solid var(--borde);
            border-radius:.75rem; padding:.85rem; margin-top:.75rem; }
  .receta h2 { font-size:.95rem; margin:0 0 .1rem; font-weight:600; }
  .materia { font-size:.75rem; color:var(--suave); margin:0 0 .7rem; }
  .fila { display:grid; grid-template-columns:repeat(4, 1fr); gap:.4rem; }
  .cand {
    position:relative; aspect-ratio:1; border-radius:.45rem; overflow:hidden;
    border:2px solid transparent; padding:0; background:#000; cursor:pointer;
  }
  .cand img { width:100%; height:100%; object-fit:cover; display:block; }
  .cand[aria-pressed=true] { border-color:var(--verde); }
  .cand .n { position:absolute; left:.2rem; top:.2rem; font-size:.65rem;
             background:rgba(0,0,0,.6); border-radius:.25rem; padding:0 .28rem; }
  .cand .tic { position:absolute; right:.2rem; bottom:.2rem; font-size:.8rem;
               opacity:0; transition:opacity .15s; }
  /* Punto naranja: ésta es la que sirve el sitio en este momento. Distinto
     del borde verde, que es la que Ariel eligió y todavía puede no estar. */
  .cand .viva { position:absolute; right:.2rem; top:.2rem; width:.5rem; height:.5rem;
                border-radius:50%; background:var(--naranja); }
  .pendiente { color:var(--naranja); }
  .cand[aria-pressed=true] .tic { opacity:1; }
  .lic { font-size:.6rem; color:var(--suave); text-align:center;
         overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

  .propias { display:flex; gap:.4rem; flex-wrap:wrap; margin-top:.7rem; }
  .propia { position:relative; width:5.5rem; }
  .propia img, .propia video { width:100%; aspect-ratio:1; object-fit:cover;
                               border-radius:.45rem; background:#000; display:block; }
  .propia.esPortada img { outline:2px solid var(--verde); outline-offset:-2px; }
  .propia .x { position:absolute; right:-.3rem; top:-.3rem; width:1.4rem; height:1.4rem;
               border-radius:50%; background:var(--rojo); color:#fff; border:0;
               font-size:.8rem; line-height:1; padding:0; }
  .yt { display:flex; align-items:center; gap:.5rem; margin-top:.4rem;
        font-size:.8rem; background:#000; border-radius:.45rem; padding:.35rem .5rem; }
  .yt img { width:4rem; border-radius:.25rem; }
  .acciones { display:flex; gap:.5rem; margin-top:.7rem; flex-wrap:wrap; }
  .acciones button, .acciones label.boton {
    font-size:.8rem; padding:.4rem .7rem; border-radius:.5rem;
    border:1px solid var(--borde); background:#0000; color:var(--texto); cursor:pointer;
  }
  .aviso { font-size:.78rem; color:var(--suave); margin-top:.5rem; }
  .aviso.mal { color:var(--rojo); }
  .barraProgreso { height:3px; background:var(--borde); border-radius:2px; overflow:hidden; margin-top:.5rem; }
  .barraProgreso i { display:block; height:100%; background:var(--verde); width:0; transition:width .2s; }
  .vacio { color:var(--suave); font-size:.8rem; padding:2rem 0; text-align:center; }
</style>
</head>
<body>

<?php if (!$entro): ?>

  <form class="login" method="post" autocomplete="on">
    <h1>Panel de medios</h1>
    <p>Keto Argentina — fotos, videos y enlaces de las recetas.</p>
    <label for="u">Usuario</label>
    <input id="u" name="usuario" type="text" autocapitalize="none" autocomplete="username" required autofocus>
    <label for="c">Contraseña</label>
    <input id="c" name="clave" type="password" autocomplete="current-password" required>
    <?php if ($error): ?><p class="error"><?= htmlspecialchars($error, ENT_QUOTES) ?></p><?php endif; ?>
    <p style="margin-top:1.25rem"><button class="primario" type="submit" style="width:100%">Entrar</button></p>
  </form>

<?php else: ?>

  <header class="barra">
    <h1 class="crece">Medios de las recetas</h1>
    <button id="salir" type="button">Salir</button>
  </header>
  <div class="chips" role="group" aria-label="Filtros">
    <button data-filtro="todas"    aria-pressed="true">Todas</button>
    <button data-filtro="sinelegir" aria-pressed="false">Sin elegir</button>
    <button data-filtro="propias"   aria-pressed="false">Con foto mía</button>
    <button data-filtro="video"     aria-pressed="false">Con video</button>
    <button data-filtro="pendientes" aria-pressed="false">Sin nada mío</button>
  </div>

  <main id="lista"><p class="vacio">Cargando…</p></main>

  <script>
  const TOKEN = <?= json_encode(token()) ?>;
  const COMIDAS = { desayuno:"Desayunos", almuerzo:"Almuerzos", merienda:"Meriendas",
                    cena:"Cenas", colacion:"Colaciones" };
  let RECETAS = [], filtro = "todas";

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));

  async function api(accion, datos = {}, archivo = null, alProgreso = null) {
    const fd = new FormData();
    fd.append("accion", accion);
    fd.append("token", TOKEN);
    for (const [k, v] of Object.entries(datos)) fd.append(k, v);
    if (archivo) fd.append("archivo", archivo);

    // XHR y no fetch: es la única forma de tener progreso de subida, y un video
    // de 200 MB por 4G sin barra de progreso parece colgado.
    return new Promise((ok, mal) => {
      const x = new XMLHttpRequest();
      x.open("POST", "api.php");
      if (alProgreso) x.upload.onprogress = (e) =>
        e.lengthComputable && alProgreso(e.loaded / e.total);
      x.onload = () => {
        let r; try { r = JSON.parse(x.responseText); }
        catch { return mal(new Error("Respuesta ilegible del servidor")); }
        r.error ? mal(new Error(r.error)) : ok(r);
      };
      x.onerror = () => mal(new Error("Se cortó la conexión"));
      x.send(fd);
    });
  }

  function pasa(r) {
    if (filtro === "sinelegir")  return r.elegida === null && !r.propias.length;
    if (filtro === "propias")    return r.propias.some((m) => m.tipo === "imagen");
    if (filtro === "video")      return r.youtube.length || r.propias.some((m) => m.tipo === "video");
    if (filtro === "pendientes") return !r.propias.length && !r.youtube.length;
    return true;
  }

  function pintar() {
    const lista = document.getElementById("lista");
    const visibles = RECETAS.filter(pasa);
    if (!visibles.length) { lista.innerHTML = '<p class="vacio">Nada acá con ese filtro.</p>'; return; }

    let html = "", grupo = null;
    for (const r of visibles) {
      if (r.comida !== grupo) { grupo = r.comida; html += `<p class="grupo">${esc(COMIDAS[grupo] || grupo)}</p>`; }
      html += ficha(r);
    }
    lista.innerHTML = html;
  }

  /** Una línea que diga en qué estado quedó la receta, sin tener que mirar
   *  los bordes de las miniaturas. */
  function estado(r) {
    const partes = [];
    partes.push(r.materia ? "En el sitio: " + esc(r.materia) : "Sin foto publicada");
    if (r.elegida !== null && r.elegida !== r.publicada)
      partes.push('<span class="pendiente">elegiste la ' + (r.elegida + 1) + ", falta publicar</span>");
    const fotos = r.propias.filter((m) => m.tipo === "imagen").length;
    const vids  = r.propias.filter((m) => m.tipo === "video").length + r.youtube.length;
    if (fotos) partes.push(fotos + (fotos === 1 ? " foto mía" : " fotos mías"));
    if (vids)  partes.push(vids + (vids === 1 ? " video" : " videos"));
    return partes.join(" · ");
  }

  function ficha(r) {
    const esPortadaCand = (i) => r.portada && r.portada.origen === "candidata" && +r.portada.ref === i;

    let cands = "";
    if (r.candidatas > 0) {
      cands = '<div class="fila">';
      for (let i = 0; i < r.candidatas; i++) {
        const m = (r.meta && r.meta[i]) || {};
        cands += `
          <div>
            <button class="cand" type="button" data-elegir="${i}" data-slug="${esc(r.slug)}"
                    aria-pressed="${esPortadaCand(i)}"
                    aria-label="Usar la candidata ${i + 1} de ${esc(r.nombre)}">
              <img src="candidatas/${esc(r.slug)}/${i}.webp" alt="" loading="lazy" decoding="async">
              <span class="n">${i + 1}</span><span class="tic">✅</span>
              ${r.publicada === i ? '<span class="viva" title="Es la que está en el sitio"></span>' : ""}
            </button>
            <div class="lic" title="${esc(m.autor || "")} — ${esc(m.licencia || "")}">${esc(m.licencia || "—")}</div>
          </div>`;
      }
      cands += "</div>";
    } else {
      cands = '<p class="aviso">Las candidatas de esta receta todavía no están subidas.</p>';
    }

    let propias = "";
    for (const m of r.propias) {
      const portada = r.portada && r.portada.origen === "propia" && r.portada.ref === m.id;
      const src = m.miniatura || m.archivo;
      const vista = m.tipo === "video"
        ? `<video src="${esc(m.archivo)}" preload="metadata" muted playsinline
                  data-ver="${esc(m.archivo)}"></video>`
        : `<img src="${esc(src)}" alt="" loading="lazy" decoding="async"
                data-portada="${esc(m.id)}" data-slug="${esc(r.slug)}">`;
      propias += `<div class="propia ${portada ? "esPortada" : ""}">
          ${vista}
          <button class="x" type="button" data-quitar="${esc(m.id)}" data-slug="${esc(r.slug)}"
                  aria-label="Quitar">×</button>
        </div>`;
    }

    let yts = "";
    for (const v of r.youtube) {
      yts += `<div class="yt">
          <img src="https://i.ytimg.com/vi/${esc(v)}/mqdefault.jpg" alt="" loading="lazy">
          <a class="crece" href="https://youtu.be/${esc(v)}" target="_blank" rel="noopener">youtu.be/${esc(v)}</a>
          <button type="button" data-quitar="${esc(v)}" data-slug="${esc(r.slug)}" aria-label="Quitar">×</button>
        </div>`;
    }

    return `<section class="receta" data-ficha="${esc(r.slug)}">
        <h2>${esc(r.nombre)}</h2>
        <p class="materia">${estado(r)}</p>
        ${cands}
        ${propias ? `<div class="propias">${propias}</div>` : ""}
        ${yts}
        <div class="acciones">
          <label class="boton">📷 Foto o video
            <input type="file" hidden accept="image/*,video/*" data-subir="${esc(r.slug)}">
          </label>
          <button type="button" data-yt="${esc(r.slug)}">▶️ Enlace de YouTube</button>
        </div>
        <div class="barraProgreso" hidden><i></i></div>
        <p class="aviso" data-aviso hidden></p>
      </section>`;
  }

  function decir(slug, texto, mal = false) {
    const p = document.querySelector(`[data-ficha="${CSS.escape(slug)}"] [data-aviso]`);
    if (!p) return;
    p.textContent = texto;
    p.hidden = !texto;
    p.classList.toggle("mal", mal);
  }

  function actualizar(slug, reg) {
    const i = RECETAS.findIndex((r) => r.slug === slug);
    if (i < 0) return;
    RECETAS[i] = { ...RECETAS[i], ...reg };
    // Se repinta sólo esta ficha: repintar las 49 pierde el scroll, y en el
    // celular eso hace imposible revisarlas de a una.
    const vieja = document.querySelector(`[data-ficha="${CSS.escape(slug)}"]`);
    if (!vieja) { pintar(); return; }
    const tmp = document.createElement("div");
    tmp.innerHTML = ficha(RECETAS[i]);
    vieja.replaceWith(tmp.firstElementChild);
  }

  // ── Eventos, todos delegados en el documento ──────────────────────────────
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("button, [data-portada]");
    if (!btn) return;

    if (btn.id === "salir") {
      await api("salir").catch(() => {});
      location.reload();
      return;
    }
    if (btn.dataset.filtro) {
      filtro = btn.dataset.filtro;
      document.querySelectorAll("[data-filtro]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.filtro === filtro)));
      pintar();
      return;
    }

    const slug = btn.dataset.slug;
    if (!slug) return;

    try {
      if (btn.dataset.elegir !== undefined) {
        const r = await api("elegir", { slug, indice: btn.dataset.elegir });
        actualizar(slug, r.receta);
        decir(slug, "Elegida la " + (+btn.dataset.elegir + 1) + ". Se publica en el próximo build.");
      } else if (btn.dataset.portada !== undefined) {
        const r = await api("portada", { slug, origen: "propia", ref: btn.dataset.portada });
        actualizar(slug, r.receta);
        decir(slug, "Esa foto pasa a ser la portada.");
      } else if (btn.dataset.quitar !== undefined) {
        if (!confirm("¿Quitar esto?")) return;
        const r = await api("quitar", { slug, id: btn.dataset.quitar });
        actualizar(slug, r.receta);
      } else if (btn.dataset.yt !== undefined) {
        const url = prompt("Pegá el enlace de YouTube:");
        if (!url) return;
        const r = await api("youtube", { slug, url });
        actualizar(slug, r.receta);
      }
    } catch (err) {
      decir(slug, err.message, true);
    }
  });

  document.addEventListener("change", async (e) => {
    const inp = e.target.closest("[data-subir]");
    if (!inp || !inp.files.length) return;
    const slug = inp.dataset.subir;
    const archivo = inp.files[0];
    const caja = document.querySelector(`[data-ficha="${CSS.escape(slug)}"]`);
    const barra = caja.querySelector(".barraProgreso");
    const relleno = barra.querySelector("i");

    barra.hidden = false;
    decir(slug, `Subiendo ${archivo.name} (${(archivo.size / 1048576).toFixed(1)} MB)…`);
    try {
      const r = await api("subir", { slug }, archivo, (p) => {
        relleno.style.width = (p * 100).toFixed(0) + "%";
      });
      actualizar(slug, r.receta);
      decir(slug, r.medio.tipo === "video" ? "Video subido." : "Foto subida y puesta de portada.");
    } catch (err) {
      barra.hidden = true;
      decir(slug, err.message, true);
    }
    inp.value = "";
  });

  // Los videos de la galería arrancan mudos y sin autoplay; un toque los reproduce.
  document.addEventListener("click", (e) => {
    const v = e.target.closest("video[data-ver]");
    if (v) v.paused ? v.play() : v.pause();
  });

  api("estado")
    .then((r) => { RECETAS = r.recetas; pintar(); })
    .catch((err) => {
      document.getElementById("lista").innerHTML =
        `<p class="vacio">No pude cargar: ${esc(err.message)}</p>`;
    });
  </script>

<?php endif; ?>
</body>
</html>
