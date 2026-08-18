"""Verificador de invención: qué números dice un texto que no estaban en la fuente.

Es la contracara del permiso que se le da al modelo. A los guiones de caminata
se les pide que reescriban el contenido del sitio en forma hablada, y eso
inevitablemente los deja escribir frases nuevas. Lo que **no** pueden hacer es
traer un dato que el sitio no tiene, porque después una voz lo lee con total
seguridad y el que camina no tiene cómo saber de dónde salió.

Un número es la forma más fácil de detectar eso, y la más peligrosa de inventar:
«el 80 % de la gente» suena igual de creíble sea cierto o no.

Contar sólo dígitos no alcanza, porque un modelo al que se le pide lenguaje
hablado escribe «veinte gramos», no «20 g». Así que se normalizan las dos cosas
al mismo terreno antes de comparar.

    /usr/bin/python3 scripts/audios/numeros.py     # autoprueba
"""
from __future__ import annotations

import re
import unicodedata

UNIDADES = {
    "cero": 0, "un": 1, "uno": 1, "una": 1, "dos": 2, "tres": 3, "cuatro": 4,
    "cinco": 5, "seis": 6, "siete": 7, "ocho": 8, "nueve": 9, "diez": 10,
    "once": 11, "doce": 12, "trece": 13, "catorce": 14, "quince": 15,
    "dieciseis": 16, "diecisiete": 17, "dieciocho": 18, "diecinueve": 19,
    "veinte": 20, "veintiuno": 21, "veintiun": 21, "veintidos": 22,
    "veintitres": 23, "veinticuatro": 24, "veinticinco": 25, "veintiseis": 26,
    "veintisiete": 27, "veintiocho": 28, "veintinueve": 29, "veintiuna": 21,
}
DECENAS = {"treinta": 30, "cuarenta": 40, "cincuenta": 50, "sesenta": 60,
           "setenta": 70, "ochenta": 80, "noventa": 90}
# Con las formas femeninas: el modelo escribe «doscientas sesenta calorías»,
# porque «caloría» es femenino. Sin ellas, «doscientas» no se reconoce y el
# número se lee como 60 — que es peor que no leerlo, porque marca inventado un
# dato que sí estaba.
CIENTOS = {"cien": 100, "ciento": 100,
           "doscientos": 200, "doscientas": 200, "trescientos": 300, "trescientas": 300,
           "cuatrocientos": 400, "cuatrocientas": 400, "quinientos": 500, "quinientas": 500,
           "seiscientos": 600, "seiscientas": 600, "setecientos": 700, "setecientas": 700,
           "ochocientos": 800, "ochocientas": 800, "novecientos": 900, "novecientas": 900}
MULTIPLOS = {"mil": 1000, "millon": 1_000_000, "millones": 1_000_000}

# Números que no cuentan como dato: ordenar una explicación («lo primero»,
# «segundo punto») o decir «una cosa» no es afirmar nada sobre el mundo. Sin esta
# lista, cualquier texto en castellano queda marcado como inventado.
LIBRES = {0, 1, 2, 3}


def _plano(t: str) -> str:
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    # «por ciento» lleva adentro la palabra «ciento», que vale 100. Sin sacarla,
    # todo texto con un porcentaje trae un 100 fantasma y «el 80 por ciento»
    # queda leído como dos números.
    return re.sub(r"\bpor\s*ciento\b|\bporciento\b", " ", t)


def numeros(texto: str) -> set[float]:
    """Todos los números de un texto, vengan en dígitos o en palabras."""
    t = _plano(texto)
    hallados: set[float] = set()

    # ── Dígitos ─────────────────────────────────────────────────────────────
    # Se acepta la coma decimal del castellano (2,4 kg) y el punto de miles.
    for m in re.finditer(r"\d+(?:[.,]\d+)?", t):
        crudo = m.group(0)
        if "," in crudo:
            crudo = crudo.replace(".", "").replace(",", ".")
        elif crudo.count(".") == 1 and len(crudo.split(".")[1]) == 3:
            crudo = crudo.replace(".", "")     # 1.500 son mil quinientos
        try:
            hallados.add(float(crudo))
        except ValueError:
            pass

    # ── Palabras ────────────────────────────────────────────────────────────
    palabras = re.findall(r"[a-z]+", t)
    i = 0
    while i < len(palabras):
        valor, consumidas = _leer_numero(palabras, i)
        if not consumidas:
            i += 1
            continue
        # «cuatro coma tres» es un solo número, 4,3 — y en la fuente está escrito
        # con dígitos. Sin unirlos acá, el guion hablado deja 4 y 3 sueltos y el
        # verificador denuncia como inventado un dato que copió bien.
        if (i + consumidas + 1 < len(palabras)
                and palabras[i + consumidas] == "coma"):
            dec, usadas = _leer_numero(palabras, i + consumidas + 1)
            if usadas:
                hallados.add(float(f"{valor}.{dec}"))
                i += consumidas + 1 + usadas
                continue
        hallados.add(float(valor))
        i += consumidas
    return hallados


def _leer_numero(p: list[str], i: int) -> tuple[int, int]:
    """Lee un número escrito en palabras desde la posición `i`.

    Devuelve `(valor, cuántas palabras consumió)`; `(0, 0)` si ahí no arranca un
    número. Maneja las formas compuestas del castellano —«treinta y cinco»,
    «dos mil quinientos»— porque son exactamente las que un modelo va a usar al
    hablar.
    """
    total = 0
    parcial = 0
    consumidas = 0
    n = len(p)

    while i + consumidas < n:
        w = p[i + consumidas]

        if w in CIENTOS:
            parcial += CIENTOS[w]
        elif w in DECENAS:
            parcial += DECENAS[w]
            # «treinta y cinco»
            if (i + consumidas + 2 < n and p[i + consumidas + 1] == "y"
                    and p[i + consumidas + 2] in UNIDADES):
                parcial += UNIDADES[p[i + consumidas + 2]]
                consumidas += 2
        elif w in UNIDADES:
            parcial += UNIDADES[w]
        elif w in MULTIPLOS:
            mult = MULTIPLOS[w]
            total += (parcial or 1) * mult
            parcial = 0
        else:
            break
        consumidas += 1

    valor = total + parcial
    return (valor, consumidas) if consumidas else (0, 0)


def inventados(fuente: str, salida: str) -> set[float]:
    """Números que aparecen en `salida` y no en `fuente`."""
    return {n for n in numeros(salida) - numeros(fuente) if n not in LIBRES}


# ── Autoprueba ──────────────────────────────────────────────────────────────

def autoprueba() -> int:
    casos = [
        # (texto, números que como mínimo tiene que encontrar)
        ("Son 4,3 MET y 90 kilos", {4.3, 90}),
        # El decimal hablado tiene que unirse: es el mismo 4,3 de la línea anterior.
        ("cuatro coma tres y noventa kilos", {4.3, 90.0}),
        ("entre 100 y 120 pasos por minuto", {100, 120}),
        ("unas doscientas sesenta calorías", {260}),
        ("treinta y cinco gramos", {35}),
        ("dos mil quinientas calorías", {2500}),
        ("el 60 al 70 por ciento", {60, 70}),
        ("veinticinco segundos por pierna", {25}),
        ("mil quinientos", {1500}),
    ]
    fallos = 0
    for texto, esperado in casos:
        obtenido = numeros(texto)
        # Se comprueba que estén los esperados, no que no haya de más. Encontrar
        # de más sólo hace al verificador más permisivo con la fuente (le da más
        # números "ya dichos"), nunca más severo con la salida.
        if esperado <= obtenido:
            print(f"  ✓ «{texto}» → {sorted(obtenido)}")
        else:
            print(f"  ✗ «{texto}»: esperaba ⊇ {sorted(esperado)}, dio {sorted(obtenido)}")
            fallos += 1

    print()
    fuente = "Caminar a paso sostenido son 4,3 MET. Para 90 kilos, unas 260 calorías."
    pruebas = [
        # Reformular con los mismos datos: no hay invención.
        ("Caminando a paso firme gastás alrededor de doscientas sesenta calorías "
         "si pesás noventa kilos.", set()),
        # Un porcentaje que no está en ningún lado: es exactamente lo que hay que cazar.
        ("Está demostrado que el ochenta por ciento de la gente lo logra.", {80.0}),
        # Un dato derivado, que suena razonable y tampoco está: también se caza.
        ("Son cuatro coma tres MET, y en media hora quemás 130 calorías.", {130.0}),
    ]
    for salida, esperado in pruebas:
        obtenido = inventados(fuente, salida)
        ok = obtenido == esperado
        fallos += 0 if ok else 1
        marca = "✓" if ok else "✗"
        print(f"  {marca} «{salida[:64]}…»")
        print(f"      inventados: {sorted(obtenido) or 'ninguno'}"
              + ("" if ok else f"   (esperaba {sorted(esperado) or 'ninguno'})"))

    print(f"\n{'✗ ' + str(fallos) + ' fallo(s)' if fallos else '✓ todo bien'}")
    return 1 if fallos else 0


if __name__ == "__main__":
    raise SystemExit(autoprueba())
