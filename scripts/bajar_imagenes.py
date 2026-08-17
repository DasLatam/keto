#!/usr/bin/env python3
"""Baja las fotos de las recetas desde Wikimedia Commons, con revisión humana.

El sitio va a tener AdSense, así que **todas las fotos tienen que tener licencia
de uso comercial**, con el crédito del autor guardado en
`src/data/creditos.json` y mostrado al pie de cada foto.

## Por qué Commons y no Openverse

Openverse era la fuente original. Dejó de servir por dos razones:

1. **Su API pasó a exigir autenticación** (devuelve 401 sin credenciales, y 429
   apenas se insiste). Registrar una aplicación es posible, pero
2. **su catálogo no da para esto**: indexa por título y etiquetas de terceros,
   con resultados muy sucios. Es la razón de fondo del desastre que había.

Commons es abierta, no pide credenciales, tiene fotos de altísima resolución y
—lo que más importa acá— **títulos descriptivos y precisos** («Avocado - single
and halved»), porque es un archivo curado y categorizado por personas.

## Por qué el flujo tiene dos pasos

La primera versión de este script bajaba **la primera candidata que descargara
bien** y la daba por buena. Openverse busca sobre títulos y etiquetas, no sobre
el contenido de la imagen, así que el resultado fue que más de veinte de las
cuarenta y nueve fotos no tenían nada que ver: «zapallitos rellenos» era un
tractor con estiércol, «ensalada de repollo» una hamburguesa con papas fritas y
«flan de coco» una captura de pantalla de la receta de otro sitio, con su URL y
su logo encima.

**Ninguna búsqueda automática puede garantizar que la foto muestre lo que dice.**
Así que el script ya no elige: baja candidatas y una persona mira y decide.

    python3 scripts/bajar_imagenes.py --buscar    # baja candidatas a revisión
    python3 scripts/bajar_imagenes.py --hojas     # arma las hojas de contacto
    python3 scripts/bajar_imagenes.py --aplicar   # publica las elegidas

## Por qué materia prima y no el plato terminado

Decisión de Ariel, 2026-08-17. Openverse tiene miles de fotos buenas de una palta
partida al medio y casi ninguna de un revuelto de zapallitos argentino. Buscar el
ingrediente sube muchísimo la tasa de acierto, y sobre todo **no promete un
resultado que la foto no muestra**: la foto ilustra de qué está hecho el plato,
no cómo va a quedar. Es una solución puente hasta tener fotos propias de los
platos ya cocinados.
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
REVISION = RAIZ / ".revision-imagenes"          # gitignorado: es material de trabajo
API = "https://commons.wikimedia.org/w/api.php"

ANCHO, ALTO = 1200, 800          # 3:2
CALIDAD = 82
CANDIDATAS = 4                   # cuántas se bajan por receta para elegir
# Commons pide un User-Agent que identifique la aplicación y dé cómo contactarla;
# con el genérico de requests responde 403.
UA = {"User-Agent": "keto-argentina/1.0 (https://ketofacil.vercel.app) requests"}

# Licencias aceptables, en orden de preferencia. Se descartan las NC (no
# comercial: el sitio lleva publicidad) y las ND (sin obras derivadas: acá se
# recorta y se redimensiona, que es exactamente una obra derivada).
#
# Las CC BY-SA se aceptan pero van últimas: obligan a licenciar la foto recortada
# bajo la misma licencia. Es asumible para una foto suelta bien atribuida, pero
# si hay una CC0 o una CC BY equivalente, mejor esa.
def rango_licencia(lic: str) -> int:
    l = lic.lower()
    if "nc" in l.split("-") or "nd" in l.split("-") or " nc" in l or " nd" in l:
        return 99
    if "cc0" in l or "public domain" in l or l.startswith("pd"):
        return 0
    if "cc by-sa" in l:
        return 2
    if "cc by" in l:
        return 1
    return 99

# Materia prima de cada receta: `(consulta, término obligatorio en el título)`.
#
# La consulta va en inglés porque Commons titula en inglés, y es de una o dos
# palabras: Commons cruza los términos con AND sobre un corpus curado, así que
# tres palabras dejan la búsqueda en cero. El segundo valor es el filtro duro: si
# esa palabra no aparece en el título de la imagen, la candidata se descarta
# antes de bajarla. Es lo que evita el tractor.
#
# A propósito **no se repite la misma materia en dos recetas**: si dos fotos
# fueran de huevos, el índice de recetas se vería como una lista de huevos.
MATERIAS = {
    'huevos-revueltos-con-palta'                    : ('avocado halved', 'avocado'),
    'omelette-de-jamon-crudo-y-provolone'           : ('prosciutto', 'prosciutto'),
    'huevos-fritos-en-grasa-de-panceta'             : ('raw bacon', 'bacon'),
    'tortilla-espanola-de-nabo'                     : ('turnip', 'turnip'),
    'panqueques-de-almendras'                       : ('almond meal', 'almond'),
    'revuelto-de-espinaca-y-queso-de-cabra'         : ('goat cheese', 'goat'),
    'huevos-duros-con-sal-y-oliva'                  : ('chicken eggs', 'egg'),
    'huevos-a-la-cazuela-con-espinaca'              : ('spinach leaves', 'spinach'),
    'tortilla-de-jamon-y-queso-al-microondas'       : ('gouda cheese', 'gouda'),
    'revuelto-gramajo-keto'                         : ('ham slices', 'ham'),
    'tortilla-de-acelga-y-queso'                    : ('swiss chard', 'swiss'),
    'vacio-al-horno-con-chimichurri'                : ('raw beef', 'beef'),
    'milanesas-de-pollo-con-almendras'              : ('raw chicken', 'chicken'),
    'matambrito-de-cerdo-con-rucula'                : ('arugula', 'arugula'),
    'revuelto-de-zapallitos-con-carne-picada'       : ('minced meat', 'meat'),
    'chicharron-de-cerdo-casero'                    : ('pork belly raw', 'pork belly'),
    'salmon-rosado-con-manteca-de-hierbas'          : ('salmon fillet', 'salmon'),
    'merluza-al-horno-con-manteca-y-limon'          : ('cod fillet', 'cod'),
    'lomo-al-champignon'                            : ('champignon mushrooms', 'mushroom'),
    'pechuga-rellena-con-espinaca-y-queso'          : ('mozzarella', 'mozzarella'),
    'pollo-al-verdeo-sin-harina'                    : ('scallions', 'scallion'),
    'pollo-al-curry-con-coco'                       : ('turmeric powder', 'turmeric'),
    'brochetas-de-pollo-y-morron'                   : ('bell pepper', 'pepper'),
    'ensalada-de-atun-y-huevo'                      : ('tuna steak', 'tuna'),
    'fideos-de-zucchini-con-crema-y-panceta'        : ('zucchini', 'zucchini'),
    'pizza-con-masa-de-coliflor'                    : ('cauliflower', 'cauliflower'),
    'crema-de-brocoli'                              : ('broccoli', 'broccoli'),
    'berenjenas-a-la-parmesana'                     : ('aubergine', 'aubergine'),
    'zapallitos-rellenos-con-carne'                 : ('summer squash', 'squash'),
    'ensalada-de-repollo-y-zanahoria'               : ('carrots bunch', 'carrot'),
    'sopa-de-zapallo-y-jengibre'                    : ('ginger root', 'ginger'),
    'sopa-crema-de-champignones'                    : ('Agaricus bisporus', 'agaricus'),
    'coliflor-gratinado-con-queso'                  : ('gruyere cheese', 'gruy'),
    'ensalada-caprese-con-palta'                    : ('tomatoes basil', 'tomato'),
    'palta-con-limon-y-sal'                         : ('lemons', 'lemon'),
    'provoleta-a-la-parrilla'                       : ('cheese wheel', 'cheese'),
    'aceitunas-y-queso-en-cubos'                    : ('green olives', 'olive'),
    'chips-de-queso-al-horno'                       : ('parmesan cheese', 'parmesan'),
    'tarta-de-jamon-y-queso-con-masa-de-almendras'  : ('shelled almonds', 'almond'),
    'bocaditos-de-queso-y-nuez'                     : ('walnut kernels', 'walnut kernel'),
    'mousse-de-chocolate-keto'                      : ('cocoa powder', 'cocoa'),
    'torta-de-chocolate-en-taza'                    : ('cacao beans', 'cacao'),
    'flan-de-coco-sin-azucar'                       : ('coconut', 'coconut'),
    'cheesecake-keto-sin-horno'                     : ('mascarpone', 'mascarpone'),
    'budin-de-limon-keto'                           : ('butter pack', 'butter'),
    'licuado-de-frutilla-y-coco'                    : ('strawberries', 'strawberr'),
    'yogur-con-nueces-y-frutos-rojos'               : ('walnuts', 'walnut'),
    'almendras-tostadas-al-pimenton'                : ('paprika', 'paprika'),
    'pan-keto-de-taza'                              : ('flax seeds', 'flax'),
}

# Nombre en castellano de la materia prima, para el pie de foto. El sitio dice
# qué se está mostrando: la foto ilustra el ingrediente, no el plato terminado, y
# callárselo sería vender una foto por otra.
NOMBRES = {
    "huevos-revueltos-con-palta": "palta",
    "omelette-de-jamon-crudo-y-provolone": "jamón crudo",
    "huevos-fritos-en-grasa-de-panceta": "panceta",
    "tortilla-espanola-de-nabo": "nabo",
    "panqueques-de-almendras": "harina de almendras",
    "revuelto-de-espinaca-y-queso-de-cabra": "queso de cabra",
    "huevos-duros-con-sal-y-oliva": "huevos",
    "huevos-a-la-cazuela-con-espinaca": "espinaca",
    "tortilla-de-jamon-y-queso-al-microondas": "queso de máquina",
    "revuelto-gramajo-keto": "jamón cocido",
    "tortilla-de-acelga-y-queso": "acelga",
    "vacio-al-horno-con-chimichurri": "vacío",
    "milanesas-de-pollo-con-almendras": "pechuga de pollo",
    "matambrito-de-cerdo-con-rucula": "rúcula",
    "revuelto-de-zapallitos-con-carne-picada": "carne picada",
    "chicharron-de-cerdo-casero": "panceta de cerdo",
    "salmon-rosado-con-manteca-de-hierbas": "salmón",
    "merluza-al-horno-con-manteca-y-limon": "pescado blanco",
    "lomo-al-champignon": "champiñones",
    "pechuga-rellena-con-espinaca-y-queso": "muzzarella",
    "pollo-al-verdeo-sin-harina": "cebolla de verdeo",
    "pollo-al-curry-con-coco": "cúrcuma",
    "brochetas-de-pollo-y-morron": "morrón",
    "ensalada-de-atun-y-huevo": "atún",
    "fideos-de-zucchini-con-crema-y-panceta": "zucchini",
    "pizza-con-masa-de-coliflor": "coliflor",
    "crema-de-brocoli": "brócoli",
    "berenjenas-a-la-parmesana": "berenjena",
    "zapallitos-rellenos-con-carne": "zapallitos",
    "ensalada-de-repollo-y-zanahoria": "zanahorias",
    "sopa-de-zapallo-y-jengibre": "jengibre",
    "sopa-crema-de-champignones": "champiñones",
    "coliflor-gratinado-con-queso": "queso para gratinar",
    "ensalada-caprese-con-palta": "tomate y albahaca",
    "palta-con-limon-y-sal": "limón",
    "provoleta-a-la-parrilla": "queso de horma",
    "aceitunas-y-queso-en-cubos": "aceitunas",
    "chips-de-queso-al-horno": "queso parmesano",
    "tarta-de-jamon-y-queso-con-masa-de-almendras": "frutos secos",
    "bocaditos-de-queso-y-nuez": "nueces peladas",
    "mousse-de-chocolate-keto": "cacao amargo",
    "torta-de-chocolate-en-taza": "cacao en grano",
    "flan-de-coco-sin-azucar": "coco",
    "cheesecake-keto-sin-horno": "mascarpone",
    "budin-de-limon-keto": "manteca",
    "licuado-de-frutilla-y-coco": "frutillas",
    "yogur-con-nueces-y-frutos-rojos": "nueces con cáscara",
    "almendras-tostadas-al-pimenton": "pimentón",
    "pan-keto-de-taza": "semillas de lino",
}

# Openverse indexa mucho dibujo, ilustración y foto de producto sobre fondo
# blanco. Y, como se descubrió a la mala, capturas de pantalla de recetas de
# otros sitios: esas traen la URL y el logo ajeno impresos en la imagen.
BASURA = re.compile(
    r"\b(logo|icon|clipart|drawing|illustration|vector|diagram|chart|label|"
    r"packaging|advertisement|poster|screenshot|recipe card|infographic|"
    r"tractor|farm machinery|field)\b", re.I)


ETIQUETA_HTML = re.compile(r"<[^>]+>")


def limpiar(html: str) -> str:
    """Commons devuelve el autor como HTML (un enlace a su página de usuario)."""
    return ETIQUETA_HTML.sub("", html or "").strip()


def buscar(consulta: str) -> list[dict]:
    """Candidatas de Commons, ya normalizadas al formato que usa el resto."""
    try:
        r = requests.get(
            API, headers=UA, timeout=30,
            params={
                "action": "query", "format": "json",
                "generator": "search",
                # `filetype:bitmap` deja afuera SVG y PDF, que en Commons son
                # muchísimos y acá no sirven para nada.
                "gsrsearch": f"filetype:bitmap {consulta}",
                "gsrnamespace": "6",          # espacio de nombres «File:»
                "gsrlimit": "50",
                "prop": "imageinfo",
                "iiprop": "url|size|extmetadata",
                # Se pide una miniatura de 1600 px en vez del original: hay
                # archivos de 8000 px y 20 MB, y acá se termina en 1200.
                "iiurlwidth": "1600",
            },
        )
    except Exception as e:
        print(f"    error de red: {str(e)[:70]}")
        return []
    if r.status_code != 200:
        print(f"    API devolvió {r.status_code}")
        return []

    paginas = (r.json().get("query") or {}).get("pages") or {}
    salida = []
    for p in paginas.values():
        info = (p.get("imageinfo") or [{}])[0]
        if not info:
            continue
        em = info.get("extmetadata") or {}
        salida.append({
            "titulo": p.get("title", "").removeprefix("File:").rsplit(".", 1)[0],
            "url": info.get("thumburl") or info.get("url"),
            "width": info.get("thumbwidth") or info.get("width") or 0,
            "height": info.get("thumbheight") or info.get("height") or 0,
            "ancho_real": info.get("width") or 0,
            "alto_real": info.get("height") or 0,
            "licencia": (em.get("LicenseShortName", {}).get("value") or "").strip(),
            "autor": limpiar(em.get("Artist", {}).get("value") or "")[:80],
            "fuente": info.get("descriptionurl") or info.get("url"),
        })
    # Primero las licencias más cómodas, y entre iguales las más grandes.
    salida.sort(key=lambda c: (rango_licencia(c["licencia"]), -c["ancho_real"]))
    return salida


def sirve(c: dict, obligatorio: str) -> bool:
    if rango_licencia(c["licencia"]) >= 99:
        return False

    an, al = c["ancho_real"], c["alto_real"]
    if an < 800 or al < 500:
        return False
    if not 1.0 <= an / max(1, al) <= 2.2:      # apaisada o cuadrada, no vertical
        return False
    if not c["url"]:
        return False

    titulo = c["titulo"]
    if BASURA.search(titulo):
        return False

    # El filtro que faltaba en la versión vieja: el término tiene que aparecer en
    # el título. En Commons el título es descriptivo y curado, así que este
    # filtro solo ya descarta el 90 % de lo que no corresponde.
    return obligatorio.lower() in titulo.lower()


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


def paso_buscar(solo: set[str] | None) -> int:
    """Baja hasta CANDIDATAS por receta a `.revision-imagenes/<slug>/`."""
    REVISION.mkdir(parents=True, exist_ok=True)
    for slug, (consulta, obligatorio) in MATERIAS.items():
        if solo and slug not in solo:
            continue

        carpeta = REVISION / slug
        carpeta.mkdir(exist_ok=True)
        meta_path = carpeta / "meta.json"
        if meta_path.exists() and not solo:
            continue

        print(f"  {slug} ← «{consulta}» (exige «{obligatorio}»)", flush=True)
        candidatas = [c for c in buscar(consulta) if sirve(c, obligatorio)]
        if not candidatas:
            print("    ⚠ sin candidatas usables")
            time.sleep(3.5)
            continue

        meta = []
        for c in candidatas:
            if len(meta) >= CANDIDATAS:
                break
            try:
                img = requests.get(c["url"], headers=UA, timeout=60)
                if img.status_code != 200 or len(img.content) < 8000:
                    continue
                i = len(meta)
                (carpeta / f"{i}.webp").write_bytes(encuadrar(img.content))
                meta.append({
                    "titulo": c["titulo"][:120],
                    "autor": c["autor"] or "Autor desconocido",
                    "licencia": c["licencia"],
                    "fuente": c["fuente"],
                })
            except Exception as e:
                print(f"    falló una candidata: {str(e)[:70]}")

        meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"    {len(meta)} candidata(s)", flush=True)
        time.sleep(1.0)     # cortesía con Commons, que no pone límite duro acá
    return 0


def paso_aplicar(elecciones: dict[str, int]) -> int:
    """Publica las candidatas elegidas y reescribe creditos.json.

    `elecciones` es `{slug: índice}`. Un slug ausente conserva lo que tenga.
    """
    creditos = {}
    if CREDITOS.exists():
        creditos = json.loads(CREDITOS.read_text(encoding="utf-8"))

    aplicadas = 0
    for slug, i in elecciones.items():
        origen = REVISION / slug / f"{i}.webp"
        meta_path = REVISION / slug / "meta.json"
        if not origen.exists() or not meta_path.exists():
            print(f"  ⚠ {slug}: falta la candidata {i}")
            continue

        meta = json.loads(meta_path.read_text(encoding="utf-8"))
        if i >= len(meta):
            print(f"  ⚠ {slug}: no hay metadatos para la candidata {i}")
            continue

        (DESTINO / f"{slug}.webp").write_bytes(origen.read_bytes())
        creditos[slug] = {**meta[i], "materia": NOMBRES.get(slug, "")}
        aplicadas += 1

    CREDITOS.write_text(json.dumps(creditos, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nAplicadas: {aplicadas}")
    return 0


def main() -> int:
    args = sys.argv[1:]
    solo = {a for a in args if not a.startswith("--")} or None

    if "--buscar" in args:
        return paso_buscar(solo)
    if "--aplicar" in args:
        ruta = REVISION / "elecciones.json"
        if not ruta.exists():
            print(f"Falta {ruta}: un JSON {{slug: índice}} con las elegidas.")
            return 1
        return paso_aplicar(json.loads(ruta.read_text(encoding="utf-8")))

    print(__doc__)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
