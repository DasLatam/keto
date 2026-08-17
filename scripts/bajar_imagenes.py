#!/usr/bin/env python3
"""Baja una foto por receta desde Openverse y la deja lista para el sitio.

Por qué Openverse y no cualquier imagen de Google: el sitio va a tener AdSense,
así que **todas las fotos tienen que tener licencia de uso comercial**. Openverse
permite filtrar por eso (`license_type=commercial`) y devuelve el crédito del
autor, que se guarda en `src/data/creditos.json` y se muestra al pie de cada foto.

Qué hace con cada imagen:
  - la recorta a 3:2 y la achica a 1200 px de ancho (más no hace falta: es la
    foto de cabecera de una receta, no un fondo de pantalla);
  - la guarda como **WebP** con calidad 82, que pesa entre un tercio y la mitad
    que el JPEG equivalente. Con AdSense encima, cada kilobyte se paga en Core
    Web Vitals;
  - **no vuelve a bajar lo que ya está**, así que se puede correr las veces que
    haga falta sin castigar a la API.

    python3 scripts/bajar_imagenes.py            # sólo lo que falta
    python3 scripts/bajar_imagenes.py --rehacer  # baja todo de nuevo
"""
from __future__ import annotations

import json
import re
import sys
import time
from io import BytesIO
from pathlib import Path

import requests
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "public" / "img" / "recetas"
CREDITOS = RAIZ / "src" / "data" / "creditos.json"
API = "https://api.openverse.org/v1/images/"

ANCHO, ALTO = 1200, 800          # 3:2
CALIDAD = 82
UA = {"User-Agent": "keto-argentina/1.0 (sitio de recetas)"}

# Consulta en inglés por receta: Openverse indexa en inglés y cruza los términos
# con AND, así que van dos o tres palabras concretas y fotografiables.
CONSULTAS = {
    "huevos-revueltos-con-palta": "scrambled eggs avocado",
    "omelette-de-jamon-crudo-y-provolone": "cheese omelette plate",
    "huevos-fritos-en-grasa-de-panceta": "fried eggs bacon",
    "tortilla-espanola-de-nabo": "spanish omelette slice",
    "panqueques-de-almendras": "pancakes stack berries",
    "revuelto-de-espinaca-y-queso-de-cabra": "spinach eggs skillet",
    "yogur-con-nueces-y-frutos-rojos": "yogurt bowl berries nuts",
    "vacio-al-horno-con-chimichurri": "grilled beef chimichurri",
    "milanesas-de-pollo-con-almendras": "breaded chicken cutlet",
    "pollo-al-verdeo-sin-harina": "chicken cream sauce skillet",
    "ensalada-de-atun-y-huevo": "tuna egg salad",
    "matambrito-de-cerdo-con-rucula": "grilled pork arugula",
    "revuelto-de-zapallitos-con-carne-picada": "minced meat vegetables",
    "tarta-de-jamon-y-queso-con-masa-de-almendras": "quiche slice plate",
    "pan-keto-de-taza": "bread slices butter",
    "mousse-de-chocolate-keto": "chocolate mousse glass",
    "flan-de-coco-sin-azucar": "coconut custard dessert",
    "bocaditos-de-queso-y-nuez": "cheese balls nuts",
    "licuado-de-frutilla-y-coco": "strawberry smoothie glass",
    "almendras-tostadas-al-pimenton": "roasted almonds bowl",
    "torta-de-chocolate-en-taza": "chocolate mug cake",
    "tortilla-de-acelga-y-queso": "chard omelette",
    "fideos-de-zucchini-con-crema-y-panceta": "zucchini noodles bacon",
    "merluza-al-horno-con-manteca-y-limon": "baked white fish lemon",
    "pizza-con-masa-de-coliflor": "cauliflower crust pizza",
    "crema-de-brocoli": "broccoli soup bowl",
    "berenjenas-a-la-parmesana": "eggplant parmesan dish",
    "zapallitos-rellenos-con-carne": "stuffed zucchini baked",
    "huevos-duros-con-sal-y-oliva": "boiled eggs halved",
    "aceitunas-y-queso-en-cubos": "olives cheese cubes",
    "palta-con-limon-y-sal": "avocado half lemon",
}

# Openverse indexa mucho dibujo, ilustración y foto de producto sobre fondo
# blanco. En una receta eso queda pésimo, y el título es lo único con lo que se
# puede filtrar antes de descargar.
BASURA = re.compile(
    r"\b(logo|icon|clipart|drawing|illustration|vector|diagram|chart|label|"
    r"packaging|advertisement|poster)\b", re.I)


def buscar(consulta: str) -> list[dict]:
    r = requests.get(
        API, headers=UA, timeout=30,
        params={"q": consulta, "page_size": 20, "license_type": "commercial",
                "mature": "false"},
    )
    if r.status_code != 200:
        print(f"    API devolvió {r.status_code}")
        return []
    return r.json().get("results", [])


def sirve(c: dict) -> bool:
    # ND = NoDerivatives. `license_type=commercial` la deja pasar porque el uso
    # comercial sí está permitido, pero acá **recortamos y redimensionamos**, y
    # eso es una obra derivada. Filtrarla es obligatorio, no una precaución.
    if "nd" in (c.get("license") or "").lower().split("-"):
        return False
    an, al = c.get("width") or 0, c.get("height") or 0
    if an < 800 or al < 500:
        return False
    rel = an / max(1, al)
    if not 1.1 <= rel <= 2.2:      # apaisada; nada de verticales ni panorámicas
        return False
    return not BASURA.search(c.get("title") or "")


def encuadrar(datos: bytes) -> bytes:
    im = Image.open(BytesIO(datos)).convert("RGB")
    objetivo = ANCHO / ALTO
    an, al = im.size
    # Recorte centrado al 3:2 antes de redimensionar: así no se deforma nada.
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
    rehacer = "--rehacer" in sys.argv
    DESTINO.mkdir(parents=True, exist_ok=True)
    creditos = {}
    if CREDITOS.exists():
        creditos = json.loads(CREDITOS.read_text(encoding="utf-8"))

    nuevas = fallidas = 0
    for slug, consulta in CONSULTAS.items():
        destino = DESTINO / f"{slug}.webp"
        if destino.exists() and not rehacer:
            continue

        print(f"  {slug} ← «{consulta}»")
        candidatas = [c for c in buscar(consulta) if sirve(c)]
        if not candidatas:
            print("    sin candidatas usables")
            fallidas += 1
            time.sleep(3.5)
            continue

        guardada = False
        for c in candidatas[:5]:
            try:
                img = requests.get(c["url"], headers=UA, timeout=45)
                if img.status_code != 200 or len(img.content) < 8000:
                    continue
                destino.write_bytes(encuadrar(img.content))
                creditos[slug] = {
                    "titulo": (c.get("title") or "").strip()[:120],
                    "autor": (c.get("creator") or "Autor desconocido").strip()[:80],
                    "licencia": f"{c.get('license', '')} {c.get('license_version', '')}".strip().upper(),
                    "fuente": c.get("foreign_landing_url") or c.get("url"),
                }
                print(f"    ✓ {destino.stat().st_size // 1024} KB · {creditos[slug]['licencia']}")
                nuevas += 1
                guardada = True
                break
            except Exception as e:
                print(f"    falló una candidata: {str(e)[:80]}")
        if not guardada:
            fallidas += 1

        # Openverse sin API key deja 20 consultas por minuto. Vamos cómodos.
        time.sleep(3.5)

    CREDITOS.write_text(json.dumps(creditos, ensure_ascii=False, indent=2), encoding="utf-8")
    total = len(list(DESTINO.glob("*.webp")))
    print(f"\nNuevas: {nuevas} · fallidas: {fallidas} · total en disco: {total}/{len(CONSULTAS)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
