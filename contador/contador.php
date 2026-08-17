<?php
/**
 * Contador de visitas de Keto Argentina.
 *
 * El sitio es Astro estático en Vercel y no tiene backend, así que el contador
 * vive acá, en el hosting de Ferozo, que ya corre PHP. El sitio lo consulta por
 * fetch y le suma el offset. Es la opción que no agrega ningún tercero: el dato
 * es nuestro y es auditable.
 *
 * Endpoints:
 *   GET ?a=up   → cuenta una visita (si no fue contada hoy) y devuelve el total
 *   GET ?a=get  → sólo lee, no cuenta
 *
 * Respuesta:
 *   {"visitas": 42, "base": 19751108, "total": 19751150}
 *
 * Instalación: subir esta carpeta a /public_html/keto-contador/ por FTP. El
 * directorio de datos y la clave se crean solos en el primer pedido.
 *
 * Privacidad (lo que declara /politica-de-privacidad del sitio, y tiene que
 * seguir siendo cierto): **no se guarda la IP**. Para no contar dos veces a la
 * misma persona se guarda un HMAC-SHA256 de IP + navegador con una clave secreta
 * local, truncado, y sólo por el día en curso. El hash no es reversible y la
 * clave no sale de este servidor. No se registra qué páginas se visitaron.
 */

declare(strict_types=1);

// ── Configuración ───────────────────────────────────────────────────────────
/** El número con el que arranca el contador, por pedido de Ariel: 8 de noviembre
 *  de 1975. No es un conteo inflado — es un offset explícito, y la respuesta lo
 *  devuelve por separado (`base` y `visitas`) justamente para que se pueda ver
 *  cuál es el número real de visitas contadas. */
const BASE = 19751108;

/** Orígenes autorizados a leer la respuesta. Sin esto, el navegador bloquea el
 *  fetch desde el sitio por la política de mismo origen. Se listan explícitos en
 *  lugar de usar `*` para que el endpoint no quede disponible para cualquiera. */
const ORIGENES = [
    'https://ketofacil.vercel.app',
    'https://www.baudry.com.ar',
    'https://baudry.com.ar',
    'http://localhost:4321',
];

const DIR_DATOS  = __DIR__ . '/datos';
const ARCH_TOTAL = DIR_DATOS . '/total.txt';
const ARCH_CLAVE = DIR_DATOS . '/clave.txt';
const DIR_VISTOS = DIR_DATOS . '/vistos';

// ── Cabeceras ───────────────────────────────────────────────────────────────
$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origen, ORIGENES, true)) {
    header('Access-Control-Allow-Origin: ' . $origen);
    header('Vary: Origin');
}
header('Content-Type: application/json; charset=utf-8');
// El contador tiene que devolver el número de ahora, no uno cacheado por el CDN.
header('Cache-Control: no-store, max-age=0');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    http_response_code(204);
    exit;
}

// ── Preparación del directorio de datos ─────────────────────────────────────
if (!is_dir(DIR_DATOS)) {
    @mkdir(DIR_DATOS, 0755, true);
}
if (!is_dir(DIR_VISTOS)) {
    @mkdir(DIR_VISTOS, 0755, true);
}

// `/public_html/` es raíz web en Ferozo: sin esto, `datos/clave.txt` sería
// descargable desde el navegador y el hash dejaría de ser irreversible en la
// práctica, porque cualquiera podría recalcularlo probando direcciones IP.
$htaccess = DIR_DATOS . '/.htaccess';
if (!file_exists($htaccess)) {
    @file_put_contents(
        $htaccess,
        "Require all denied\n<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n"
    );
}

/** Clave del HMAC. Se genera sola la primera vez y no se toca nunca más: si
 *  cambiara, todos los visitantes del día volverían a contarse. */
function clave(): string
{
    if (is_readable(ARCH_CLAVE)) {
        $k = trim((string) file_get_contents(ARCH_CLAVE));
        if ($k !== '') {
            return $k;
        }
    }
    $k = bin2hex(random_bytes(32));
    @file_put_contents(ARCH_CLAVE, $k, LOCK_EX);
    @chmod(ARCH_CLAVE, 0600);
    return $k;
}

/**
 * Identificador del visitante para el día de hoy. Deliberadamente pobre: IP y
 * navegador y nada más. Alcanza para no contar dos veces la misma visita y no
 * sirve para seguir a nadie entre días, porque la fecha entra en el hash.
 */
function huella(): string
{
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    // Con proxy, X-Forwarded-For puede traer una lista: la primera es el cliente.
    $ip = trim(explode(',', $ip)[0]);
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    return substr(hash_hmac('sha256', $ip . '|' . $ua . '|' . gmdate('Ymd'), clave()), 0, 32);
}

/** Borra las carpetas de días anteriores: los hashes son de un solo día y no hay
 *  ninguna razón para conservarlos más. */
function limpiar(string $hoy): void
{
    foreach ((array) glob(DIR_VISTOS . '/*', GLOB_ONLYDIR) as $dir) {
        if (basename($dir) === $hoy) {
            continue;
        }
        foreach ((array) glob($dir . '/*') as $f) {
            @unlink($f);
        }
        @rmdir($dir);
    }
}

/** Lee el total de visitas contadas. */
function leer(): int
{
    if (!is_readable(ARCH_TOTAL)) {
        return 0;
    }
    return (int) trim((string) file_get_contents(ARCH_TOTAL));
}

/**
 * Suma una visita de forma atómica. El `flock` no es opcional: sin él, dos
 * visitas simultáneas leen el mismo número, escriben el mismo número + 1 y una
 * de las dos se pierde.
 */
function sumar(): int
{
    $fh = @fopen(ARCH_TOTAL, 'c+');
    if ($fh === false) {
        return leer();
    }
    $n = leer();
    if (flock($fh, LOCK_EX)) {
        rewind($fh);
        $n = (int) trim((string) stream_get_contents($fh));
        $n++;
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, (string) $n);
        fflush($fh);
        flock($fh, LOCK_UN);
    }
    fclose($fh);
    return $n;
}

// ── Acción ──────────────────────────────────────────────────────────────────
$accion = $_GET['a'] ?? 'get';
$nuevo  = false;

if ($accion === 'up') {
    $hoy = gmdate('Ymd');
    $dirHoy = DIR_VISTOS . '/' . $hoy;
    if (!is_dir($dirHoy)) {
        @mkdir($dirHoy, 0755, true);
        limpiar($hoy);
    }

    $marca = $dirHoy . '/' . huella();
    if (!file_exists($marca)) {
        @touch($marca);
        $visitas = sumar();
        $nuevo = true;
    } else {
        $visitas = leer();
    }
} else {
    $visitas = leer();
}

echo json_encode([
    'visitas' => $visitas,
    'base'    => BASE,
    'total'   => BASE + $visitas,
    'nuevo'   => $nuevo,
], JSON_UNESCAPED_UNICODE);
