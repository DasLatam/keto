"""Guiones de los tres audios de caminata.

La idea es de Ariel: cuarenta y cinco minutos caminando escuchando el sitio, para
que los conceptos y las recetas queden fijados sin sentarse a leer nada.

**El problema de fondo y cómo se resuelve.** Tres audios de 45 minutos son unas
23.000 palabras habladas. Todo el contenido aprovechable del sitio —evidencia,
comparativas, productos, plan semanal, recetas— son unas 11.000. Falta la mitad.

La salida no es inventar contenido nuevo, sino **reescribir el que hay en forma
hablada**, que legítimamente ocupa casi el doble: un texto escrito se puede
releer, uno hablado no, así que necesita repetir la idea, anticiparla y
recapitularla. Y como el objetivo es fijar, la repetición no es relleno: es el
punto. Por eso los tres programas se reparten el material por tema y cada uno
cierra repasando lo suyo.

El permiso que se le da al modelo termina exactamente ahí. No puede traer ningún
dato que el sitio no tenga, y eso no se pide por favor: se verifica. Cada bloque
generado pasa por `numeros.inventados()`, que compara los números del guion
contra los de la fuente, en dígitos y en palabras. Si aparece uno nuevo, el
bloque se rechaza y se vuelve a pedir diciendo cuál sobró.
"""
from __future__ import annotations

import re
import sys
import textwrap

sys.path.insert(0, "/home/hpp/videosyt")
from pipeline import llm                                    # noqa: E402

import numeros                                              # noqa: E402
from rutinas import Habla, Pieza, Silencio, _sin_marcas     # noqa: E402

PPM = 172                # ritmo de Daniela en modo relajado, medido en videosyt
INTENTOS = 3             # cuántas veces se le da otra oportunidad a un bloque

# Techo de estiramiento. Pedirle a un modelo que saque 900 palabras de un párrafo
# de 150 no da un texto más completo: da relleno, y el relleno es donde aparecen
# los datos inventados. Si un programa necesita más que esto para llegar a la
# duración pedida, el script avisa en vez de simular que llegó.
EXPANSION_MAXIMA = 2.6

SISTEMA = (
    "Sos el narrador de un audio que una persona escucha mientras camina, sola, "
    "con auriculares. Hablás en español rioplatense, de vos, en tono de "
    "conversación tranquila: oraciones cortas, sin listas, sin markdown, sin "
    "emojis, sin títulos, sin acotaciones. Como quien escucha no puede volver "
    "atrás, anticipás lo que vas a decir, lo decís y lo repetís con otras "
    "palabras antes de seguir.\n\n"
    "REGLA ABSOLUTA: no podés introducir ningún dato, número, porcentaje, fecha, "
    "nombre propio, marca, estudio ni institución que no esté en el material que "
    "te dan. Ni siquiera uno que te parezca obvio o que sepas que es cierto. "
    "Podés reformular, explicar, dar ejemplos con los datos que ya están, hacer "
    "transiciones y repasar. Nada más. Si te falta información para llenar el "
    "largo pedido, repetí y desarrollá lo que hay: es preferible."
)


# ── Renderizado de las fuentes ──────────────────────────────────────────────

def _articulo(a: dict) -> tuple[str, str]:
    partes = [a["titulo"], a["bajada"], a["resumen_directo"]]
    for s in a["secciones"]:
        partes.append(s["titulo"])
        partes.extend(s["parrafos"])
    for f in a.get("faq", []):
        partes.append(f"{f['p']} {f['r']}")
    return a["titulo"], "\n\n".join(partes)


def _negociacion(n: dict) -> tuple[str, str]:
    partes = [n["titulo"], n["pregunta"], n["resumen"], n["veredicto"]]
    for o in n.get("opciones", []):
        partes.append(
            f"{o['nombre']}: {o.get('porcion', '')}, {o.get('carbos', '?')} gramos "
            f"de carbohidratos. {o.get('nota', '')}"
        )
    partes.extend(n.get("desarrollo", []))
    for f in n.get("faq", []):
        partes.append(f"{f['p']} {f['r']}")
    return n["titulo"], "\n\n".join(partes)


def _receta(r: dict) -> tuple[str, str]:
    m = r["macros"]
    partes = [
        f"{r['nombre']}. Rinde {r['porciones']} porción o porciones, "
        f"{r['minutos']} minutos de preparación.",
        f"Por porción: {m['calorias']} calorías, {m['grasas']} gramos de grasa, "
        f"{m['proteinas']} de proteína y {m['carbos']} de carbohidratos netos.",
        "Ingredientes: " + "; ".join(r["ingredientes"]) + ".",
        "Preparación: " + " ".join(r["pasos"]),
        "El detalle que cambia el resultado: " + r["tip"],
    ]
    return r["nombre"], "\n\n".join(partes)


def _gondola(cat: dict, productos: list[dict]) -> tuple[str, str]:
    partes = [f"Góndola de {cat['nombre'].lower()}."]
    for p in productos:
        partes.append(
            f"{p['nombre']}: {'entra' if p['apto'] else 'no entra'}, "
            f"{p['carbos']} gramos de carbohidratos. "
            f"{'Marcas: ' + p['marcas'] + '. ' if p.get('marcas') else ''}{p.get('nota', '')}"
        )
    return cat["nombre"], "\n\n".join(partes)


def _plan(plan: list[dict], recetas: dict) -> tuple[str, str]:
    partes = ["La semana completa, día por día, sin repetir ninguna receta."]
    for d in plan:
        comidas = [f"{k}: {recetas[v]['nombre']}"
                   for k, v in d.items() if k != "dia" and v in recetas]
        partes.append(f"{d['dia']}. " + ". ".join(comidas) + ".")
    return "El plan de la semana", "\n\n".join(partes)


# ── Los tres programas ──────────────────────────────────────────────────────

def programas(datos: dict) -> list[dict]:
    """Qué material lleva cada caminata.

    El reparto no es por tamaño sino por tema, para que cada audio tenga un hilo:
    uno explica por qué la dieta funciona, otro contesta las objeciones que te
    van a hacer, y el tercero es operativo, del súper y la semana. Las recetas se
    reparten por comida, así la caminata de la mañana trae desayunos.
    """
    porslug = {r["slug"]: r for r in datos["recetas"]}
    neg = {n["slug"]: n for n in datos["negociaciones"]}
    por_comida = {}
    for r in datos["recetas"]:
        por_comida.setdefault(r["comida"], []).append(r)

    def negs(*slugs):
        return [neg[s] for s in slugs if s in neg]

    # Las comparativas se reparten entre el 2 y el 3 porque son la fuente más
    # gorda del sitio (5.800 palabras) y el programa 3 es el más flaco.
    usadas_2 = [n["slug"] for n in datos["negociaciones"]][:6]
    usadas_3 = [n["slug"] for n in datos["negociaciones"]][6:]

    cats = {c["id"]: c for c in datos["categorias"]}
    prods = {}
    for p in datos["productos"]:
        prods.setdefault(p["categoria"], []).append(p)

    return [
        {
            "n": 1,
            "slug": "caminata-1-por-que-funciona",
            "titulo": "Caminata 1 — Por qué funciona",
            "bajada": "La evidencia, en cuarenta y cinco minutos, y seis desayunos.",
            "fuentes": (
                [_articulo(a) for a in datos["articulos"]]
                + [_receta(r) for r in por_comida.get("desayuno", [])[:6]]
            ),
        },
        {
            "n": 2,
            "slug": "caminata-2-lo-que-te-van-a-decir",
            "titulo": "Caminata 2 — Lo que te van a decir",
            "bajada": "El alcohol, la fruta, las gaseosas: qué se negocia y qué no. Y seis almuerzos.",
            "fuentes": (
                [_negociacion(n) for n in negs(*usadas_2)]
                + [_receta(r) for r in por_comida.get("almuerzo", [])[:6]]
            ),
        },
        {
            "n": 3,
            "slug": "caminata-3-el-super-y-la-semana",
            "titulo": "Caminata 3 — El súper y la semana",
            "bajada": "Qué poner en el changuito, góndola por góndola, y la semana armada. Con seis cenas.",
            "fuentes": (
                [_gondola(cats[c], ps) for c, ps in prods.items() if c in cats]
                + [_plan(datos["planSemanal"], porslug)]
                + [_negociacion(n) for n in negs(*usadas_3)]
                + [_receta(r) for r in por_comida.get("cena", [])[:6]]
            ),
        },
    ]


# ── Expansión ───────────────────────────────────────────────────────────────

def _palabras(t: str) -> int:
    return len(t.split())


def expandir(titulo: str, fuente: str, objetivo: int, motor: llm.Motor) -> str:
    """Reescribe un bloque en forma hablada, verificando que no invente números."""
    reproche = ""
    for intento in range(1, INTENTOS + 1):
        prompt = textwrap.dedent(f"""\
            Reescribí el siguiente material del sitio como {objetivo} palabras de
            audio para escuchar caminando. Tema del bloque: «{titulo}».

            Cómo tiene que sonar:
            - Arrancá enganchando con lo anterior, sin decir "en este bloque".
            - Explicá el porqué, no sólo el qué.
            - Antes de terminar, repetí en una frase la idea que hay que retener.
            - Nada de listas ni enumeraciones largas: se escucha, no se lee.
            - Los números, escribilos con palabras.

            {reproche}
            MATERIAL (no salgas de acá):
            ---
            {fuente}
            ---""")
        texto = motor.pedir(prompt, sistema=SISTEMA, timeout=600)
        texto = _limpiar(texto)

        colados = numeros.inventados(fuente, texto)
        if not colados:
            return texto

        lista = ", ".join(str(int(n) if n == int(n) else n) for n in sorted(colados))
        print(f"      intento {intento}: aparecieron números que no están en la "
              f"fuente ({lista}); lo pido de nuevo", flush=True)
        reproche = (
            f"ATENCIÓN: en tu respuesta anterior escribiste estos números, que NO "
            f"están en el material: {lista}. Sacálos. No los reemplaces por otros "
            f"ni por 'muchos' o 'la mayoría': si el dato no está, la frase no va.\n")

    # Tres intentos y sigue inventando: se usa la fuente tal cual. Un bloque más
    # corto y textual es mejor que uno largo con un dato falso.
    print(f"      ⚠ «{titulo}»: se usa el texto del sitio sin reescribir", flush=True)
    return fuente


def _limpiar(t: str) -> str:
    """Saca lo que un modelo mete igual aunque se le pida que no."""
    t = re.sub(r"^\s*#{1,6}\s*", "", t, flags=re.M)          # títulos markdown
    t = re.sub(r"\*\*(.+?)\*\*", r"\1", t)                    # negritas
    t = re.sub(r"^\s*[-*•]\s+", "", t, flags=re.M)            # viñetas
    t = re.sub(r"\n{3,}", "\n\n", t)
    return _sin_marcas(t).strip()


# ── Armado del guion ────────────────────────────────────────────────────────

def _oraciones(parrafo: str) -> list[str]:
    """Una frase por wav: es lo que le sienta bien a piper y lo que permite
    intercalar las pausas donde corresponde."""
    partes = re.split(r"(?<=[.!?…])\s+", parrafo.strip())
    return [p.strip() for p in partes if p.strip()]


def guion(programa: dict, minutos: float, motor: llm.Motor,
          rutina_caminata: dict) -> list[Pieza]:
    """La partitura de una caminata.

    Además del contenido, el audio **marca el ritmo de la caminata**, con los
    tramos que ya define la rutina del sitio: cinco minutos de entrada en calor,
    treinta de ritmo sostenido y cinco de vuelta a la calma. Sin eso sería un
    podcast que da la casualidad de durar cuarenta minutos.
    """
    objetivo_total = int(minutos * PPM)
    fuentes = programa["fuentes"]
    crudo = sum(_palabras(f) for _, f in fuentes)

    # Presupuesto de palabras por bloque, proporcional a lo que trae cada uno,
    # con techo de expansión. Lo que no se puede estirar se dice y no se disimula.
    reservado = 420                       # entrada, marcas de ritmo y cierre
    disponible = max(objetivo_total - reservado, 0)
    factor = disponible / crudo if crudo else 1.0
    if factor > EXPANSION_MAXIMA:
        alcanzable = (crudo * EXPANSION_MAXIMA + reservado) / PPM
        print(f"  ⚠ con este material la caminata llega a {alcanzable:.0f} min, "
              f"no a {minutos:.0f}: haría falta estirar ×{factor:.1f} y el techo "
              f"es ×{EXPANSION_MAXIMA}", flush=True)
        disponible = int(crudo * EXPANSION_MAXIMA)

    piezas: list[Pieza] = []
    tramos = {e["nombre"]: e for b in rutina_caminata["bloques"]
              for e in b["ejercicios"]}
    # Presupuesto que se va corrigiendo. Los modelos no aciertan el largo pedido:
    # gemini se pasa un 30 % con holgura. Con nueve bloques, ese sesgo convierte
    # una caminata de 45 minutos en una de 58. En vez de calibrar un factor por
    # motor —que envejece con cada versión del modelo—, después de cada bloque se
    # reparte lo que queda entre los bloques que faltan.
    restante = disponible

    # ── Entrada y calentamiento ─────────────────────────────────────────────
    piezas.append(Habla(f"{programa['titulo']}. {programa['bajada']}"))
    calor = tramos.get("Entrada en calor")
    if calor:
        piezas.append(Habla(
            f"Arrancamos con cinco minutos de entrada en calor. {_sin_marcas(calor['como'])}"))
    piezas.append(Habla("Yo mientras tanto te voy contando."))

    # ── Cuerpo ──────────────────────────────────────────────────────────────
    dicho = 0
    marcado_ritmo = False
    for i, (titulo, fuente) in enumerate(fuentes, 1):
        crudo_restante = sum(_palabras(f) for _, f in fuentes[i - 1:])
        # La porción de lo que queda que le toca a este bloque, según su tamaño.
        parte = _palabras(fuente) / crudo_restante if crudo_restante else 1.0
        objetivo = max(120, min(int(restante * parte),
                                int(_palabras(fuente) * EXPANSION_MAXIMA)))
        print(f"    [{i}/{len(fuentes)}] {titulo} "
              f"({_palabras(fuente)} → {objetivo} palabras)", flush=True)
        texto = expandir(titulo, fuente, objetivo, motor)
        restante = max(0, restante - _palabras(texto))

        for parrafo in texto.split("\n\n"):
            for o in _oraciones(parrafo):
                piezas.append(Habla(o))
                dicho += _palabras(o)
            piezas.append(Silencio(0.7))      # aire entre párrafos

        # A los cinco minutos de audio, el cuerpo ya entró en calor.
        if not marcado_ritmo and dicho >= 5 * PPM:
            sostenido = tramos.get("Ritmo sostenido")
            if sostenido:
                piezas.append(Habla(
                    "Pasaron los primeros cinco minutos: subí a ritmo sostenido. "
                    + _sin_marcas(sostenido["como"])))
                piezas.append(Silencio(1.2))
            marcado_ritmo = True

    # ── Vuelta a la calma y repaso ──────────────────────────────────────────
    calma = tramos.get("Vuelta a la calma")
    if calma:
        # La entrada nombra el tramo y nada más: el `como` de este ejercicio ya
        # arranca con "Bajá el ritmo de a poco", y adelantarlo acá hacía que la
        # voz dijera la misma frase dos veces seguidas.
        piezas.append(Habla("Últimos cinco minutos, vuelta a la calma. "
                            + _sin_marcas(calma["como"])))
        piezas.append(Silencio(1.2))

    repaso = _repaso(programa, motor)
    for o in _oraciones(repaso):
        piezas.append(Habla(o))
    piezas.append(Habla("Eso es todo por hoy. Nos vemos en la próxima caminata."))
    return piezas


def _repaso(programa: dict, motor: llm.Motor) -> str:
    """El cierre: cinco minutos repasando lo de este audio.

    Se genera desde los mismos títulos y no desde el texto ya expandido, para que
    el repaso no arrastre una frase inventada que se le haya colado al cuerpo.
    """
    fuente = "\n\n".join(f"{t}\n{f}" for t, f in programa["fuentes"])
    titulos = "\n".join(f"- {t}" for t, _ in programa["fuentes"])
    prompt = textwrap.dedent(f"""\
        Cerrá el audio con un repaso hablado de unas 500 palabras de los temas
        que se recorrieron, en este orden:

        {titulos}

        Una o dos frases por tema, quedándote con lo único que hay que recordar
        de cada uno. Terminá con una sola idea para llevarse.

        MATERIAL (no salgas de acá):
        ---
        {fuente}
        ---""")
    texto = _limpiar(motor.pedir(prompt, sistema=SISTEMA, timeout=600))
    colados = numeros.inventados(fuente, texto)
    if colados:
        print(f"    ⚠ el repaso trajo números de más ({sorted(colados)}); "
              f"se arma uno sin números", flush=True)
        return " ".join(t for t, _ in programa["fuentes"]) + \
            ". Eso fue lo que recorrimos hoy."
    return texto
