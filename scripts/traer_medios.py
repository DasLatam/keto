#!/usr/bin/env python3
"""Trae al repo lo que se eligió y se subió desde el panel de Ferozo.

    /usr/bin/python3 scripts/traer_medios.py            # ver qué cambiaría
    /usr/bin/python3 scripts/traer_medios.py --aplicar  # escribir los archivos

El panel (https://www.baudry.com.ar/keto-panel/) es donde Ariel revisa las 49
recetas y sube sus fotos. Pero el sitio es Astro estático en Vercel y se
despliega desde git, así que la **foto grande de cada receta tiene que estar en
el repo**: es el LCP de la página, y pedirla por JavaScript la volvería lo último
en aparecer. Este script es ese puente.

Lo que NO trae: los videos y las fotos secundarias. Ésos los muestra el
componente `MediosPropios.astro` pidiéndolos en vivo, para que aparezcan sin
esperar un build. Ver el README.

Después de correrlo con `--aplicar` hay que construir y publicar:

    MAX=4G /home/hpp/agente/scripts/pesado.sh npm run build
    git add -A && git commit && git push
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from io import BytesIO
from pathlib import Path
from urllib.parse import quote

import requests
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "public" / "img" / "recetas"
CREDITOS = RAIZ / "src" / "data" / "creditos.json"
REVISION = RAIZ / ".revision-imagenes"
PUBLICADAS = RAIZ / "panel" / "publicadas.json"

ANCHO, ALTO = 1200, 800      # el mismo 3:2 que usa bajar_imagenes.py
CALIDAD = 82

CONF = Path(os.environ.get("KETO_FEROZO_ENV", Path.home() / ".config/keto/ferozo.env"))


def config() -> dict[str, str]:
    """Lee ~/.config/keto/ferozo.env. Fuera del repo: este script sí se commitea."""
    if not CONF.is_file():
        sys.exit(f"Falta {CONF} con FTP_HOST/FTP_USER/FTP_PASS/FTP_BASE/PANEL_URL.")
    d = {}
    for linea in CONF.read_text(encoding="utf-8").splitlines():
        linea = linea.strip()
        if linea and not linea.startswith("#") and "=" in linea:
            k, v = linea.split("=", 1)
            d[k.strip()] = v.strip()
    return d


def bajar_manifiesto(cfg: dict[str, str]) -> dict:
    """`datos/medios.json`, por FTP.

    Por FTP y no por HTTP a propósito: `datos/` está detrás de un
    `Require all denied` justamente para que el estado del panel no sea público.
    """
    url = (f"ftp://{quote(cfg['FTP_USER'], safe='')}:{quote(cfg['FTP_PASS'], safe='')}"
           f"@{cfg['FTP_HOST']}{cfg['FTP_BASE']}/datos/medios.json")
    r = subprocess.run(["curl", "-sS", "--ssl-reqd", "--max-time", "60", url],
                       capture_output=True, text=True)
    if r.returncode != 0 or not r.stdout.strip():
        # Que todavía no exista es lo normal: significa que nadie tocó el panel.
        print("  (el panel todavía no guardó nada)")
        return {}
    return json.loads(r.stdout)


def encuadrar(datos: bytes) -> bytes:
    """Recorte centrado a 3:2 y redimensión a 1200×800 WEBP."""
    im = Image.open(BytesIO(datos))
    # Las fotos de celular traen la orientación en EXIF: sin esto, una vertical
    # sacada con el teléfono de costado se publica acostada.
    try:
        from PIL import ImageOps
        im = ImageOps.exif_transpose(im)
    except Exception:
        pass
    im = im.convert("RGB")

    objetivo = ANCHO / ALTO
    an, al = im.size
    if an / al > objetivo:
        nuevo = int(al * objetivo)
        izq = (an - nuevo) // 2
        im = im.crop((izq, 0, izq + nuevo, al))
    else:
        nuevo = int(an / objetivo)
        arriba = (al - nuevo) // 2
        im = im.crop((0, arriba, an, arriba + nuevo))
    im = im.resize((ANCHO, ALTO), Image.LANCZOS)
    salida = BytesIO()
    im.save(salida, "WEBP", quality=CALIDAD, method=6)
    return salida.getvalue()


def main() -> int:
    aplicar = "--aplicar" in sys.argv[1:]
    cfg = config()
    manifiesto = bajar_manifiesto(cfg)
    if not manifiesto:
        print("Nada que traer.")
        return 0

    creditos = json.loads(CREDITOS.read_text(encoding="utf-8")) if CREDITOS.exists() else {}
    publicadas = json.loads(PUBLICADAS.read_text(encoding="utf-8")) if PUBLICADAS.exists() else {}
    cambios: list[str] = []

    for slug, reg in sorted(manifiesto.items()):
        portada = reg.get("portada") or {}
        origen, ref = portada.get("origen"), portada.get("ref")

        # ── Otra de las candidatas de Commons ────────────────────────────────
        if origen == "candidata":
            i = int(ref)
            if publicadas.get(slug) == i:
                continue                       # ya es la que está en el sitio
            cand = REVISION / slug / f"{i}.webp"
            meta_p = REVISION / slug / "meta.json"
            if not cand.exists() or not meta_p.exists():
                print(f"  ⚠ {slug}: falta la candidata {i} en .revision-imagenes/ "
                      f"(corré bajar_imagenes.py --buscar)")
                continue
            meta = json.loads(meta_p.read_text(encoding="utf-8"))
            if i >= len(meta):
                print(f"  ⚠ {slug}: no hay metadatos para la candidata {i}")
                continue

            cambios.append(f"  {slug}: candidata {publicadas.get(slug)} → {i}")
            if aplicar:
                (DESTINO / f"{slug}.webp").write_bytes(cand.read_bytes())
                # Se conserva la `materia` que ya tenía: es el ingrediente, y no
                # cambia porque se cambie de foto del mismo ingrediente.
                creditos[slug] = {**meta[i], "materia": creditos.get(slug, {}).get("materia", "")}
                publicadas[slug] = i

        # ── Una foto propia: el plato de verdad ──────────────────────────────
        elif origen == "propia":
            medio = next((m for m in reg.get("propias", [])
                          if m.get("id") == ref and m.get("tipo") == "imagen"), None)
            if not medio:
                print(f"  ⚠ {slug}: la portada apunta a una foto que ya no está")
                continue
            if creditos.get(slug, {}).get("propia") == ref:
                continue                       # ya publicada

            url = f"{cfg['PANEL_URL']}/{medio['archivo']}"
            cambios.append(f"  {slug}: foto propia ({medio.get('nombre') or medio['id']})")
            if not aplicar:
                continue
            try:
                r = requests.get(url, timeout=120)
                r.raise_for_status()
                (DESTINO / f"{slug}.webp").write_bytes(encuadrar(r.content))
            except Exception as e:
                print(f"  ⚠ {slug}: no pude bajar la foto — {str(e)[:80]}")
                continue

            # `materia` se vacía y `propia` queda marcada: es lo que hace que la
            # página deje de decir «el ingrediente principal, no el plato
            # terminado». Con una foto del plato real esa aclaración pasa de
            # honesta a falsa.
            creditos[slug] = {
                "titulo": medio.get("nombre") or "Foto propia",
                "autor": "Ariel Baudry",
                "licencia": "Foto propia",
                "fuente": None,
                "materia": "",
                "propia": ref,
            }
            publicadas.pop(slug, None)

    if not cambios:
        print("Nada nuevo: el sitio ya refleja lo que dice el panel.")
        return 0

    print(("Se aplicaron" if aplicar else "Cambiaría") + f" {len(cambios)}:")
    print("\n".join(cambios))

    if aplicar:
        CREDITOS.write_text(json.dumps(creditos, ensure_ascii=False, indent=2) + "\n",
                            encoding="utf-8")
        PUBLICADAS.write_text(json.dumps(publicadas, ensure_ascii=False, indent=2) + "\n",
                              encoding="utf-8")
        print("\nFalta construir y publicar:")
        print("  MAX=4G /home/hpp/agente/scripts/pesado.sh npm run build")
        print("  git add -A && git commit -m 'Fotos nuevas desde el panel' && git push")
        print("  ./scripts/subir_panel.sh      # para que el panel muestre el estado nuevo")
    else:
        print("\n(nada escrito: agregá --aplicar)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
