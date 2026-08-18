<?php
/**
 * Manifiesto público de medios, en sólo lectura.
 *
 * Lo consume el sitio: las páginas de receta lo piden por fetch y, si hay algo,
 * dibujan el bloque «Fotos y videos del cocinero» con lo que Ariel subió desde
 * el panel. Así una foto sacada en la cocina aparece en el sitio **sin esperar
 * un build**, que es lo que hace que el panel se use.
 *
 * La foto de portada es aparte: esa sí entra al repo con
 * `scripts/traer_medios.py` y se sirve estática, porque es la imagen grande de
 * la página y cargarla por JavaScript la volvería lo último en aparecer.
 *
 *   GET                → todas las recetas que tienen algo
 *   GET ?slug=xxx      → sólo esa
 */

declare(strict_types=1);
require __DIR__ . '/lib.php';

$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origen, ORIGENES, true)) {
    header('Access-Control-Allow-Origin: ' . $origen);
    header('Vary: Origin');
}
header('Content-Type: application/json; charset=utf-8');
// Cinco minutos: el sitio no necesita el segundo exacto, y sin cache cada visita
// a una receta golpea el hosting compartido.
header('Cache-Control: public, max-age=300');
header('X-Robots-Tag: noindex');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    http_response_code(204);
    exit;
}

/** URL absoluta: el sitio corre en otro dominio, así que las rutas relativas de
 *  `medios.json` no le sirven de nada. */
function absoluta(string $rel): string
{
    $esquema = (($_SERVER['HTTPS'] ?? '') === 'on' || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
        ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'www.baudry.com.ar';
    $base = rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? '/keto-panel/medios.php'), '/');
    return $esquema . '://' . $host . $base . '/' . ltrim($rel, '/');
}

$medios = leerMedios();
$pedido = (string) ($_GET['slug'] ?? '');
$salida = [];

foreach ($medios as $slug => $_) {
    if ($pedido !== '' && $slug !== $pedido) {
        continue;
    }
    if (!slugValido($slug)) {
        continue;   // restos de una receta que ya no existe
    }
    $r = receta($medios, $slug);

    $items = [];
    foreach ($r['propias'] as $m) {
        // Si el archivo no está en disco no se publica: un 404 dentro de un
        // <img> del sitio es un hueco que nadie sabe de dónde salió.
        if (!is_file(__DIR__ . '/' . ($m['archivo'] ?? ''))) {
            continue;
        }
        $items[] = [
            'id'    => $m['id'],
            'tipo'  => $m['tipo'],
            'url'   => absoluta($m['archivo']),
            'vista' => absoluta($m['miniatura'] ?: $m['archivo']),
            'mime'  => $m['mime'] ?? null,
            'ancho' => $m['ancho'] ?? null,
            'alto'  => $m['alto'] ?? null,
            'fecha' => $m['subido'] ?? null,
        ];
    }

    if (!$items && !$r['youtube']) {
        continue;
    }
    $salida[$slug] = [
        'medios'  => $items,
        'youtube' => array_values($r['youtube']),
        'portada' => $r['portada'],
    ];
}

echo json_encode([
    'recetas'     => (object) $salida,   // objeto siempre, aunque esté vacío: el sitio hace $salida[slug]
    'actualizado' => is_file(ARCH_MEDIOS) ? date('c', (int) filemtime(ARCH_MEDIOS)) : null,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
