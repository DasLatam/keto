#!/usr/bin/env bash
#
# Sube el panel de medios a Ferozo (https://www.baudry.com.ar/keto-panel/).
#
#   scripts/subir_panel.sh            # sólo el código PHP (segundos)
#   scripts/subir_panel.sh --imagenes # además las 49×4 candidatas (27 MB)
#
# Las credenciales salen de ~/.config/keto/ferozo.env, que está fuera del repo
# a propósito: este script sí se commitea.
#
# Se usa lftp y no curl porque son 193 archivos: curl abre una conexión FTP por
# archivo y Ferozo tarda ~1,5 s en cada handshake TLS, o sea cinco minutos de
# puro saludo. `mirror` los manda por cuatro conexiones reusadas.
#
# NO borra nada del servidor: `subidas/` y `datos/` son de la aplicación y no
# tienen copia acá. Por eso `mirror` va sin `--delete`.

set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONF="${KETO_FEROZO_ENV:-$HOME/.config/keto/ferozo.env}"

if [[ ! -r "$CONF" ]]; then
  echo "Falta $CONF con FTP_HOST/FTP_USER/FTP_PASS/FTP_BASE." >&2
  exit 1
fi
# shellcheck disable=SC1090
source "$CONF"

CON_IMAGENES=0
[[ "${1:-}" == "--imagenes" ]] && CON_IMAGENES=1

if [[ $CON_IMAGENES -eq 1 && ! -d "$RAIZ/.revision-imagenes" ]]; then
  echo "No está .revision-imagenes/. Corré antes:" >&2
  echo "  /usr/bin/python3 scripts/bajar_imagenes.py --buscar" >&2
  exit 1
fi

# Ferozo exige TLS en el canal de control. El certificado es del hosting y no
# del dominio, así que la verificación se apaga: si no, lftp corta el saludo.
comandos=$(cat <<LFTP
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ssl:verify-certificate no
set net:timeout 20
set net:max-retries 3
set mirror:parallel-transfer-count 4
open -u "$FTP_USER","$FTP_PASS" "$FTP_HOST"
mkdir -p "$FTP_BASE"
cd "$FTP_BASE"
put $RAIZ/panel/index.php   -o index.php
put $RAIZ/panel/api.php     -o api.php
put $RAIZ/panel/lib.php     -o lib.php
put $RAIZ/panel/medios.php  -o medios.php
put $RAIZ/panel/recetas.json -o recetas.json
put $RAIZ/panel/publicadas.json -o publicadas.json
put $RAIZ/panel/.htaccess   -o .htaccess
LFTP
)

if [[ $CON_IMAGENES -eq 1 ]]; then
  # Sólo `elecciones.json` queda afuera: es la hoja de trabajo de la revisión
  # y no aporta nada en un servidor público. El resto son los .webp y los
  # meta.json con la atribución de cada candidata.
  comandos+=$'\n'"mirror -R --parallel=4 --exclude-glob=elecciones.json \
    $RAIZ/.revision-imagenes candidatas"
fi
comandos+=$'\nbye'

echo "→ Subiendo el panel a $FTP_BASE …"
lftp -c "$comandos"

echo "→ Verificando…"
if curl -fsS --max-time 30 -o /dev/null -w '  index.php  → HTTP %{http_code}\n' "$PANEL_URL/"; then :; fi
curl -fsS --max-time 30 "$PANEL_URL/medios.php" | head -c 200; echo
echo
echo "Panel: $PANEL_URL/"
