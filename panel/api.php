<?php
/**
 * API del panel. Todo pide sesión iniciada y token anti-CSRF, salvo `salir`.
 *
 * Acciones (POST, `accion=`):
 *   estado    → el manifiesto completo + las 49 recetas
 *   elegir    → fija cuál de las 4 candidatas se publica  (slug, indice|null)
 *   subir     → sube una foto o un video propio           (slug, archivo)
 *   youtube   → agrega un enlace de YouTube               (slug, url)
 *   quitar    → borra un medio propio o un enlace         (slug, id)
 *   portada   → elige qué imagen usa el sitio de foto      (slug, origen, ref)
 *   salir     → cierra la sesión
 */

declare(strict_types=1);
require __DIR__ . '/lib.php';

preparar();
abrirSesion();

if (($_POST['accion'] ?? '') === 'salir') {
    $_SESSION = [];
    session_destroy();
    json(['ok' => true]);
}

if (!autenticado()) {
    json(['error' => 'Sesión vencida. Volvé a entrar.'], 401);
}
if (!tokenValido((string) ($_POST['token'] ?? ''))) {
    json(['error' => 'Token inválido. Recargá la página.'], 403);
}

$accion = (string) ($_POST['accion'] ?? '');
$slug   = (string) ($_POST['slug'] ?? '');

// Salvo `estado`, todo opera sobre una receta concreta, y tiene que ser una de
// las 49: es lo que impide que un slug con `../` escriba fuera de `subidas/`.
if ($accion !== 'estado' && !slugValido($slug)) {
    json(['error' => 'Receta desconocida.'], 400);
}

$medios = leerMedios();

switch ($accion) {

    // ── Estado completo ─────────────────────────────────────────────────────
    case 'estado': {
        $recetas = recetas();
        $salida = [];
        foreach ($recetas as $r) {
            $reg = receta($medios, $r['slug']);
            // Cuántas candidatas hay realmente en disco: si la carpeta no se
            // subió, el panel tiene que decirlo en vez de mostrar 4 rotas.
            $n = 0;
            for ($i = 0; $i < 4; $i++) {
                if (is_file(DIR_CAND . '/' . $r['slug'] . '/' . $i . '.webp')) {
                    $n++;
                }
            }
            $meta = json_decode((string) @file_get_contents(
                DIR_CAND . '/' . $r['slug'] . '/meta.json'
            ), true) ?: [];
            $salida[] = $r + ['candidatas' => $n, 'meta' => $meta] + $reg;
        }
        json(['ok' => true, 'recetas' => $salida]);
    }

    // ── Elegir candidata ────────────────────────────────────────────────────
    case 'elegir': {
        $i = $_POST['indice'] ?? '';
        $reg = receta($medios, $slug);
        if ($i === '' || $i === 'null') {
            $reg['elegida'] = null;
        } else {
            $i = (int) $i;
            if ($i < 0 || $i > 3) {
                json(['error' => 'Índice fuera de rango.'], 400);
            }
            $reg['elegida'] = $i;
            // Elegir una candidata implica querer verla: pasa a ser la portada.
            $reg['portada'] = ['origen' => 'candidata', 'ref' => $i];
        }
        $medios[$slug] = $reg;
        if (!guardarMedios($medios)) {
            json(['error' => 'No se pudo guardar.'], 500);
        }
        json(['ok' => true, 'receta' => $reg]);
    }

    // ── Subir foto o video propio ───────────────────────────────────────────
    case 'subir': {
        $f = $_FILES['archivo'] ?? null;
        if (!$f || ($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            $motivos = [
                UPLOAD_ERR_INI_SIZE   => 'El archivo supera el límite del servidor.',
                UPLOAD_ERR_FORM_SIZE  => 'El archivo supera el límite del formulario.',
                UPLOAD_ERR_PARTIAL    => 'La subida se cortó por la mitad.',
                UPLOAD_ERR_NO_FILE    => 'No llegó ningún archivo.',
                UPLOAD_ERR_NO_TMP_DIR => 'El servidor no tiene carpeta temporal.',
                UPLOAD_ERR_CANT_WRITE => 'El servidor no pudo escribir el archivo.',
            ];
            json(['error' => $motivos[$f['error'] ?? UPLOAD_ERR_NO_FILE] ?? 'Falló la subida.'], 400);
        }
        if ($f['size'] > MAX_BYTES) {
            json(['error' => 'Máximo ' . (int) (MAX_BYTES / 1048576) . ' MB por archivo.'], 400);
        }
        // `is_uploaded_file` confirma que el temporal viene de esta subida y no
        // es una ruta del servidor que alguien metió en el formulario.
        if (!is_uploaded_file($f['tmp_name'])) {
            json(['error' => 'Subida inválida.'], 400);
        }

        // El tipo sale de los bytes del archivo, NUNCA del nombre ni del
        // Content-Type que manda el navegador: los dos los elige quien sube.
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime  = (string) $finfo->file($f['tmp_name']);
        if (!isset(TIPOS[$mime])) {
            json(['error' => "Tipo no aceptado ($mime). Fotos JPG/PNG/WEBP/HEIC o videos MP4/MOV/WEBM."], 400);
        }
        [$tipo, $ext] = TIPOS[$mime];

        $dir = DIR_SUBIDAS . '/' . $slug;
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        $id = date('Ymd-His') . '-' . bin2hex(random_bytes(4));
        $rel = 'subidas/' . $slug . '/' . $id . '.' . $ext;
        if (!@move_uploaded_file($f['tmp_name'], __DIR__ . '/' . $rel)) {
            json(['error' => 'No se pudo guardar el archivo.'], 500);
        }
        @chmod(__DIR__ . '/' . $rel, 0644);

        $medio = [
            'id'      => $id,
            'tipo'    => $tipo,
            'archivo' => $rel,
            'mime'    => $mime,
            'bytes'   => (int) $f['size'],
            'nombre'  => mb_substr((string) ($f['name'] ?? ''), 0, 120),
            'subido'  => date('c'),
            'miniatura' => null,
        ];
        if ($tipo === 'imagen') {
            $medio['miniatura'] = miniatura(__DIR__ . '/' . $rel, $dir, $id);
            $dim = @getimagesize(__DIR__ . '/' . $rel);
            if ($dim) {
                $medio['ancho'] = $dim[0];
                $medio['alto']  = $dim[1];
            }
        }

        $reg = receta($medios, $slug);
        $reg['propias'][] = $medio;
        // La primera foto propia toma la portada sola: es lo que Ariel quiere
        // cuando por fin cocina el plato y le saca una foto de verdad.
        if ($tipo === 'imagen' && ($reg['portada']['origen'] ?? '') !== 'propia') {
            $reg['portada'] = ['origen' => 'propia', 'ref' => $id];
        }
        $medios[$slug] = $reg;
        guardarMedios($medios);
        json(['ok' => true, 'medio' => $medio, 'receta' => $reg]);
    }

    // ── Enlace de YouTube ───────────────────────────────────────────────────
    case 'youtube': {
        $id = idYoutube((string) ($_POST['url'] ?? ''));
        if ($id === null) {
            json(['error' => 'No reconocí el enlace. Pegá la URL del video o del short.'], 400);
        }
        $reg = receta($medios, $slug);
        if (!in_array($id, $reg['youtube'], true)) {
            $reg['youtube'][] = $id;
        }
        $medios[$slug] = $reg;
        guardarMedios($medios);
        json(['ok' => true, 'video' => $id, 'receta' => $reg]);
    }

    // ── Quitar un medio propio o un enlace ──────────────────────────────────
    case 'quitar': {
        $id  = (string) ($_POST['id'] ?? '');
        $reg = receta($medios, $slug);

        $reg['youtube'] = array_values(array_filter(
            $reg['youtube'], static fn($y) => $y !== $id
        ));

        $quedan = [];
        foreach ($reg['propias'] as $m) {
            if ($m['id'] !== $id) {
                $quedan[] = $m;
                continue;
            }
            // Se borra el archivo, no sólo la entrada: si no, el hosting se
            // llena de videos de 300 MB que ya nadie referencia.
            foreach ([$m['archivo'] ?? '', $m['miniatura'] ?? ''] as $r) {
                if ($r && str_starts_with($r, 'subidas/')) {
                    @unlink(__DIR__ . '/' . $r);
                }
            }
        }
        $reg['propias'] = $quedan;

        // Si lo que se borró era la portada, hay que soltarla o el sitio queda
        // apuntando a un archivo que ya no está.
        if (($reg['portada']['ref'] ?? null) === $id) {
            $reg['portada'] = $reg['elegida'] === null
                ? null
                : ['origen' => 'candidata', 'ref' => $reg['elegida']];
        }
        $medios[$slug] = $reg;
        guardarMedios($medios);
        json(['ok' => true, 'receta' => $reg]);
    }

    // ── Qué imagen usa el sitio ─────────────────────────────────────────────
    case 'portada': {
        $origen = (string) ($_POST['origen'] ?? '');
        $ref    = (string) ($_POST['ref'] ?? '');
        $reg    = receta($medios, $slug);
        if ($origen === 'candidata') {
            $i = (int) $ref;
            if ($i < 0 || $i > 3) {
                json(['error' => 'Índice fuera de rango.'], 400);
            }
            $reg['portada'] = ['origen' => 'candidata', 'ref' => $i];
            $reg['elegida'] = $i;
        } elseif ($origen === 'propia') {
            $existe = false;
            foreach ($reg['propias'] as $m) {
                if ($m['id'] === $ref && $m['tipo'] === 'imagen') {
                    $existe = true;
                }
            }
            if (!$existe) {
                json(['error' => 'Esa foto no está.'], 400);
            }
            $reg['portada'] = ['origen' => 'propia', 'ref' => $ref];
        } else {
            json(['error' => 'Origen inválido.'], 400);
        }
        $medios[$slug] = $reg;
        guardarMedios($medios);
        json(['ok' => true, 'receta' => $reg]);
    }
}

json(['error' => 'Acción desconocida.'], 400);


/**
 * Miniatura de 800 px de ancho para la galería del panel.
 *
 * No es cosmética: una foto de iPhone son 4 MB y 4032 px. Sin miniatura, abrir
 * el panel con veinte fotos propias baja ochenta megas por el celular de Ariel,
 * que es exactamente donde va a usar esto.
 *
 * Devuelve `null` si GD no puede con el formato (HEIC, sobre todo): el panel
 * muestra entonces el original y no se rompe nada.
 */
function miniatura(string $origen, string $dir, string $id): ?string
{
    if (!function_exists('imagecreatetruecolor')) {
        return null;
    }
    $info = @getimagesize($origen);
    if (!$info) {
        return null;
    }
    [$w, $h, $tipo] = $info;

    // Techo de píxeles antes de decodificar: una imagen de 20.000 × 20.000 son
    // 1,6 GB en memoria y tumba el proceso con el memory_limit de 256 MB.
    if ($w * $h > 50_000_000) {
        return null;
    }

    $src = match ($tipo) {
        IMAGETYPE_JPEG => @imagecreatefromjpeg($origen),
        IMAGETYPE_PNG  => @imagecreatefrompng($origen),
        IMAGETYPE_WEBP => @imagecreatefromwebp($origen),
        IMAGETYPE_GIF  => @imagecreatefromgif($origen),
        default        => null,
    };
    if (!$src) {
        return null;
    }

    $ancho = min(800, $w);
    $alto  = (int) round($h * $ancho / $w);
    $dst = imagecreatetruecolor($ancho, $alto);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $ancho, $alto, $w, $h);

    $rel = basename($dir) . '/' . $id . '-mini.webp';
    $ok = @imagewebp($dst, $dir . '/' . $id . '-mini.webp', 80);
    imagedestroy($src);
    imagedestroy($dst);
    return $ok ? 'subidas/' . $rel : null;
}
