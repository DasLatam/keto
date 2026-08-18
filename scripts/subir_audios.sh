#!/usr/bin/env bash
#
# Sube los audios de guía a Ferozo (https://www.baudry.com.ar/keto-audios/) y
# copia el manifiesto al repo para que el build sepa cuánto dura cada uno.
#
#   scripts/subir_audios.sh              # los que cambiaron
#   scripts/subir_audios.sh --todos      # todos, aunque no hayan cambiado
#
# Los MP3 **no van al repo**: son unos 90 MB entre los cinco y git guarda cada
# versión para siempre. Regenerar los audios tres veces dejaría 270 MB dentro de
# un sitio que compila a 5 MB de HTML. Van al mismo hosting que el contador y el
# panel, que es donde ya vive lo que el sitio necesita y no puede servir estático.

set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ORIGEN="$RAIZ/storage/audios"
CONF="${KETO_FEROZO_ENV:-$HOME/.config/keto/ferozo.env}"
BASE_REMOTA="/public_html/keto-audios"

[[ -r "$CONF" ]] || { echo "Falta $CONF" >&2; exit 1; }
# shellcheck disable=SC1090
source "$CONF"

if ! compgen -G "$ORIGEN/*.mp3" > /dev/null; then
  echo "No hay MP3 en $ORIGEN. Generalos con:" >&2
  echo "  MAX=8G /home/hpp/agente/scripts/pesado.sh /usr/bin/python3 scripts/audios/generar.py --todo" >&2
  exit 1
fi

# `--only-newer` compara fecha y tamaño contra lo que ya está en el servidor:
# resubir 90 MB por cambiar un audio de 7 son veinte minutos de FTP al pedo.
SOLO_NUEVOS="--only-newer"
[[ "${1:-}" == "--todos" ]] && SOLO_NUEVOS=""

echo "→ Subiendo audios a $BASE_REMOTA …"
du -sh "$ORIGEN" | sed 's/^/  /'

# Dos cosas sobre el mirror, aprendidas rompiéndolo:
#
#   --include-glob solo. Agregarle --exclude-glob=* detrás no acota, mata todo:
#   la primera versión de este script subió el .htaccess y ni un MP3.
#
#   --no-recursion porque los mp3 están todos en la raíz de storage/audios/, y
#   ahí abajo también viven guiones/ y los .log, que no van a un servidor público.
#
# Y los comentarios van acá afuera y no dentro del bloque de lftp: ese bloque es
# una string entre comillas dobles, así que bash ejecuta lo que haya entre
# backticks antes de que lftp llegue a verlo.
lftp -c "
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ssl:verify-certificate no
set net:timeout 30
set net:max-retries 3
open -u \"$FTP_USER\",\"$FTP_PASS\" \"$FTP_HOST\"
mkdir -p \"$BASE_REMOTA\"
cd \"$BASE_REMOTA\"
mirror -R $SOLO_NUEVOS --no-recursion --parallel=2 --include-glob=*.mp3 \"$ORIGEN\" .
put \"$RAIZ/scripts/audios/htaccess-audios\" -o .htaccess
bye
"

# El manifiesto va al repo: el build necesita la duración y el peso para
# mostrarlos sin tener que pedirle nada al servidor.
cp "$ORIGEN/audios.json" "$RAIZ/src/data/audios.json"
echo "  manifiesto copiado a src/data/audios.json"

echo "→ Verificando…"
/usr/bin/python3 - "$PANEL_URL" <<'PY'
import json, subprocess, sys
from pathlib import Path

base = sys.argv[1].rsplit("/", 1)[0] + "/keto-audios"
manifiesto = json.loads(Path("storage/audios/audios.json").read_text(encoding="utf-8"))
malos = 0
for slug, a in manifiesto.items():
    url = f"{base}/{a['archivo']}"
    r = subprocess.run(
        ["curl", "-fsS", "--max-time", "40", "-r", "0-1", "-o", "/dev/null",
         "-w", "%{http_code} %{content_type}", url],
        capture_output=True, text=True)
    ok = r.stdout.startswith("20")
    malos += 0 if ok else 1
    print(f"  {'✓' if ok else '✗'} {a['archivo']:<38} {a['minutos']:5.1f} min  {r.stdout}")
print(f"\n{base}/")
sys.exit(1 if malos else 0)
PY
