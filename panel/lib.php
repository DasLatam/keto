<?php
/**
 * Núcleo del panel de medios de Keto Argentina: configuración, sesión, login y
 * el almacén JSON. Lo comparten `index.php`, `api.php` y `medios.php`.
 *
 * Vive en el hosting de Ferozo por la misma razón que el contador: el sitio es
 * Astro estático en Vercel y no tiene backend, y acá ya hay PHP corriendo. No se
 * suma ningún tercero.
 */

declare(strict_types=1);

// ── Credenciales ────────────────────────────────────────────────────────────
const USUARIO = 'ariel';

/**
 * La contraseña **no se guarda en claro**. Esto es `password_hash()` de la que
 * eligió Ariel; el archivo viaja por FTP y termina en un hosting compartido, así
 * que lo que se lea acá no tiene que servir para entrar a ningún otro lado.
 *
 * Para cambiarla: `php -r 'echo password_hash("LA NUEVA", PASSWORD_DEFAULT);'`
 * y pegar el resultado acá.
 */
const CLAVE_HASH = '$2y$12$YLVpYNsh0bguQISH7Fxs6O3EpjYjY64ISHoZ3QDAx2cXf5b7pXYp.';

// ── Rutas ───────────────────────────────────────────────────────────────────
const DIR_DATOS   = __DIR__ . '/datos';
const DIR_SUBIDAS = __DIR__ . '/subidas';
const DIR_CAND    = __DIR__ . '/candidatas';
const ARCH_MEDIOS = DIR_DATOS . '/medios.json';
const ARCH_INTENTOS = DIR_DATOS . '/intentos.json';

/** Orígenes que pueden leer `medios.php`. Mismo criterio que el contador: se
 *  listan explícitos en vez de `*`, para que el manifiesto no quede servido a
 *  cualquier sitio que quiera incrustarlo. */
const ORIGENES = [
    'https://ketofacil.vercel.app',
    'https://www.baudry.com.ar',
    'https://baudry.com.ar',
    'http://localhost:4321',
];

/** Extensiones aceptadas, y a qué se mapean. La lista es blanca a propósito: se
 *  acepta lo que sabemos servir, no "todo menos php". */
const TIPOS = [
    'image/jpeg' => ['imagen', 'jpg'],
    'image/png'  => ['imagen', 'png'],
    'image/webp' => ['imagen', 'webp'],
    'image/gif'  => ['imagen', 'gif'],
    'image/heic' => ['imagen', 'heic'],   // el iPhone saca esto por defecto
    'image/heif' => ['imagen', 'heic'],
    'video/mp4'  => ['video', 'mp4'],
    'video/quicktime' => ['video', 'mov'],
    'video/webm' => ['video', 'webm'],
];

const MAX_BYTES = 400 * 1024 * 1024;   // 400 MB: un video de celular de unos minutos

// ── Preparación del disco ───────────────────────────────────────────────────

/**
 * Crea los directorios y, sobre todo, los `.htaccess` que los protegen.
 *
 * `/public_html/` es raíz web en Ferozo. Sin estas dos reglas el panel sería un
 * agujero: `datos/` expondría el registro de intentos de login, y `subidas/`
 * **ejecutaría como PHP cualquier cosa que se suba con ese nombre**, que es la
 * forma clásica de convertir un formulario de subida en una shell remota.
 */
function preparar(): void
{
    foreach ([DIR_DATOS, DIR_SUBIDAS, DIR_CAND] as $d) {
        if (!is_dir($d)) {
            @mkdir($d, 0755, true);
        }
    }

    $denegar = "Require all denied\n"
        . "<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n";
    if (!file_exists(DIR_DATOS . '/.htaccess')) {
        @file_put_contents(DIR_DATOS . '/.htaccess', $denegar);
    }

    // Las subidas SÍ se sirven por web (el sitio y el panel las muestran), así
    // que acá no se puede denegar todo: lo que hay que matar es la ejecución.
    $sinPhp = <<<'HT'
        # Estos archivos los sube una persona por formulario: se sirven, no se ejecutan.
        <IfModule mod_php.c>
          php_flag engine off
        </IfModule>
        RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .php8 .phar .cgi .pl
        RemoveType .php .phtml .php3 .php4 .php5 .php7 .php8 .phar
        AddType text/plain .php .phtml .phar .cgi .pl .py .sh
        <FilesMatch "\.(?i:php|phtml|phar|cgi|pl|py|sh|htaccess)$">
          Require all denied
        </FilesMatch>
        HT;
    if (!file_exists(DIR_SUBIDAS . '/.htaccess')) {
        @file_put_contents(DIR_SUBIDAS . '/.htaccess', $sinPhp . "\n");
    }
}

// ── Almacén ─────────────────────────────────────────────────────────────────

/** Lee el manifiesto de medios. Devuelve `[]` si todavía no existe. */
function leerMedios(): array
{
    if (!is_readable(ARCH_MEDIOS)) {
        return [];
    }
    $d = json_decode((string) file_get_contents(ARCH_MEDIOS), true);
    return is_array($d) ? $d : [];
}

/**
 * Escribe el manifiesto de forma atómica: se escribe un temporal y se renombra.
 * `rename()` en el mismo filesystem es atómico, así que un pedido que lea
 * mientras otro escribe ve el archivo viejo entero o el nuevo entero, nunca uno
 * a medio escribir. Con `file_put_contents` directo, dos subidas simultáneas
 * dejan el JSON roto y se pierde el trabajo de revisión de las 49 recetas.
 */
function guardarMedios(array $d): bool
{
    // `publicada` es un dato derivado de `publicadas.json`: guardarlo acá lo
    // dejaría congelado y mintiendo en cuanto se publique un build nuevo.
    foreach ($d as $slug => $r) {
        unset($d[$slug]['publicada']);
    }
    $tmp = ARCH_MEDIOS . '.tmp' . getmypid();
    $json = json_encode($d, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false || @file_put_contents($tmp, $json, LOCK_EX) === false) {
        return false;
    }
    return @rename($tmp, ARCH_MEDIOS);
}

/**
 * Qué candidata sirve **hoy** el sitio, por receta.
 *
 * Es una copia de `.revision-imagenes/elecciones.json`, o sea del build que está
 * publicado. Sin esto el panel abriría con las 49 recetas en blanco, como si
 * nunca se hubiera elegido nada, cuando en realidad ya están todas elegidas: lo
 * primero que haría Ariel sería rehacer un trabajo que ya estaba hecho.
 */
function publicadas(): array
{
    static $d = null;
    if ($d === null) {
        $d = json_decode((string) @file_get_contents(__DIR__ . '/publicadas.json'), true);
        $d = is_array($d) ? $d : [];
    }
    return $d;
}

/**
 * El registro de una receta, con los campos siempre presentes.
 *
 * `elegida` arranca en lo que está publicado: mientras Ariel no toque nada, el
 * panel refleja el sitio. `publicada` va aparte y no cambia nunca desde el
 * panel — es la que sirve para ver, de un vistazo, qué elecciones quedaron
 * pendientes de un build.
 */
function receta(array $medios, string $slug): array
{
    $r = $medios[$slug] ?? [];
    $publicada = publicadas()[$slug] ?? null;
    return [
        'elegida'   => $r['elegida'] ?? $publicada,   // índice 0-3 de las candidatas
        'publicada' => $publicada,                    // la que sirve el sitio ahora
        'propias'   => $r['propias'] ?? [],           // fotos y videos subidos
        'youtube'   => $r['youtube'] ?? [],           // ids de YouTube
        'portada'   => $r['portada'] ?? ($publicada === null
            ? null : ['origen' => 'candidata', 'ref' => $publicada]),
    ];
}

/** Las 49 recetas, en el orden en que las muestra el sitio. */
function recetas(): array
{
    $d = json_decode((string) @file_get_contents(__DIR__ . '/recetas.json'), true);
    return is_array($d) ? $d : [];
}

// ── Sesión y login ──────────────────────────────────────────────────────────

function abrirSesion(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/keto-panel/',
        'secure'   => true,       // el sitio es HTTPS: la cookie no viaja en claro
        'httponly' => true,       // ningún script puede leerla
        'samesite' => 'Strict',   // no se manda desde otro sitio: corta el CSRF
    ]);
    session_name('ketopanel');
    session_start();
}

function autenticado(): bool
{
    abrirSesion();
    return ($_SESSION['ok'] ?? false) === true;
}

/**
 * Registro de intentos fallidos por IP.
 *
 * El panel tiene un solo usuario y una contraseña corta: sin freno, probarlas
 * todas desde afuera es cuestión de horas. Con esto, a partir del quinto fallo
 * cada intento espera, y a los diez la IP queda afuera quince minutos.
 */
function frenoLogin(): int
{
    $ip = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '?')[0]);
    $reg = json_decode((string) @file_get_contents(ARCH_INTENTOS), true) ?: [];
    $ahora = time();

    // Se olvidan los intentos de más de 15 minutos, y de paso se poda el archivo.
    foreach ($reg as $k => $v) {
        if (($v['ultimo'] ?? 0) < $ahora - 900) {
            unset($reg[$k]);
        }
    }
    $n = $reg[$ip]['n'] ?? 0;
    @file_put_contents(ARCH_INTENTOS, json_encode($reg), LOCK_EX);
    return (int) $n;
}

function anotarFallo(): void
{
    $ip = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '?')[0]);
    $reg = json_decode((string) @file_get_contents(ARCH_INTENTOS), true) ?: [];
    $reg[$ip] = ['n' => ($reg[$ip]['n'] ?? 0) + 1, 'ultimo' => time()];
    @file_put_contents(ARCH_INTENTOS, json_encode($reg), LOCK_EX);
}

function limpiarFallos(): void
{
    $ip = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '?')[0]);
    $reg = json_decode((string) @file_get_contents(ARCH_INTENTOS), true) ?: [];
    unset($reg[$ip]);
    @file_put_contents(ARCH_INTENTOS, json_encode($reg), LOCK_EX);
}

/**
 * Verifica usuario y contraseña.
 *
 * `hash_equals` para el usuario y `password_verify` para la clave: los dos
 * comparan en tiempo constante. Un `===` sobre la contraseña filtra, por lo que
 * tarda, cuántos caracteres del principio son correctos.
 */
function intentarLogin(string $usuario, string $clave): bool
{
    $fallos = frenoLogin();
    if ($fallos >= 10) {
        return false;                       // bloqueado por 15 minutos
    }
    if ($fallos >= 5) {
        sleep(min(5, $fallos - 4));         // penalización creciente
    }

    $ok = hash_equals(USUARIO, $usuario) && password_verify($clave, CLAVE_HASH);
    if (!$ok) {
        anotarFallo();
        return false;
    }
    abrirSesion();
    session_regenerate_id(true);            // sin esto, un id fijado de antemano sigue sirviendo
    $_SESSION['ok'] = true;
    $_SESSION['desde'] = time();
    limpiarFallos();
    return true;
}

// ── Utilidades ──────────────────────────────────────────────────────────────

/** Token anti-CSRF de la sesión. */
function token(): string
{
    abrirSesion();
    if (empty($_SESSION['token'])) {
        $_SESSION['token'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['token'];
}

function tokenValido(string $t): bool
{
    abrirSesion();
    return !empty($_SESSION['token']) && hash_equals($_SESSION['token'], $t);
}

/** Responde JSON y termina. */
function json(array $d, int $codigo = 200): never
{
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($d, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Extrae el id de un enlace de YouTube. Acepta las cuatro formas que se copian
 * en la práctica: `watch?v=`, `youtu.be/`, `/shorts/` y `/embed/`, y también un
 * id pelado.
 */
function idYoutube(string $url): ?string
{
    $url = trim($url);
    if (preg_match('~^[A-Za-z0-9_-]{11}$~', $url)) {
        return $url;
    }
    $patrones = [
        '~youtube\.com/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})~',
        '~youtu\.be/([A-Za-z0-9_-]{11})~',
        '~youtube\.com/shorts/([A-Za-z0-9_-]{11})~',
        '~youtube\.com/embed/([A-Za-z0-9_-]{11})~',
        '~youtube\.com/live/([A-Za-z0-9_-]{11})~',
    ];
    foreach ($patrones as $p) {
        if (preg_match($p, $url, $m)) {
            return $m[1];
        }
    }
    return null;
}

/** Un slug sólo puede ser uno de las 49 recetas: cualquier otra cosa es un
 *  intento de escribir fuera de la carpeta. */
function slugValido(string $slug): bool
{
    foreach (recetas() as $r) {
        if ($r['slug'] === $slug) {
            return true;
        }
    }
    return false;
}
