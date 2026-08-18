"""De «3 series de 12» a segundos reales de silencio.

Esto es el corazón de los audios de rutina, y lo que los separa de un podcast
sobre ejercicios: cuando la voz dice «sostené treinta segundos», el audio tiene
que **callarse treinta segundos de verdad**. Si no, hay que estar mirando el
reloj, y entonces el audio no sirvió para nada.

Las 26 formas de `dosis` que usa `src/data/ejercicios.js` están cubiertas y
verificadas por `autoprueba()` al final del archivo:

    /usr/bin/python3 scripts/audios/dosis.py

Los segundos por repetición no son inventados: salen de cronometrar el
movimiento que describe cada `como`. Una sentadilla a la silla hecha como la
describe el texto —bajar controlado, tocar, subir— son unos tres segundos. Los
valores están arriba, en un solo lugar, para poder ajustarlos escuchando.
"""
from __future__ import annotations

import re
from dataclasses import dataclass

# ── Cuánto dura cada cosa ───────────────────────────────────────────────────
SEG_REPETICION   = 3.0    # una repetición normal (bajar y subir controlado)
SEG_REP_LENTA    = 4.5    # «repeticiones lentas»: el texto pide una respiración
SEG_RESPIRACION  = 10.0   # inhalar contando 4 + exhalar contando 6
SEG_VUELTA       = 4.0    # una vuelta de cuello o de hombros, despacio
DESCANSO_SERIE   = 32.0   # entre series del mismo ejercicio

# Cuánto se calla el audio entre un ejercicio y el siguiente. Depende del tipo:
# en elongación se está en la alfombra y sólo hay que cambiar de postura, en
# fuerza hay que pisar una banda, mover la silla o darse vuelta. Un solo número
# para los dos deja la elongación con huecos muertos o la fuerza corriendo.
PREPARARSE = {"elongacion": 8.0, "fuerza": 15.0, "cardio": 10.0}
PREPARARSE_POR_DEFECTO = 12.0

# Cuando la dosis da un rango («8 a 15»), se toma el punto medio: es lo que hace
# la mayoría, y el audio tiene que durar lo que le va a durar a la mayoría.
def _delrango(a: float, b: float) -> float:
    return (a + b) / 2


@dataclass
class Tramo:
    """Un tramo de trabajo: lo que la voz dice al entrar, y cuánto se calla."""
    aviso: str | None
    segundos: float


# ── Reconocedores ───────────────────────────────────────────────────────────
# Cada uno devuelve la lista de tramos, o None si el patrón no es el suyo.
# El orden importa: «3 series de 30 a 45 segundos» tiene que probarse antes que
# «30 a 45 segundos», o el primer reconocedor se lleva la mitad de la frase.

_LADOS = {
    "lado":   "Cambiá de lado.",
    "pierna": "Cambiá de pierna.",
    "brazo":  "Cambiá de brazo.",
}


def _cuenta_de_serie(cuerpo: str) -> tuple[float, str | None]:
    """El contenido de una serie: cuántos segundos dura y si tiene dos lados."""
    cuerpo = cuerpo.strip()

    porlado = None
    m = re.search(r"\bpor (lado|pierna|brazo)\b", cuerpo)
    if m:
        porlado = _LADOS[m.group(1)]
        cuerpo = cuerpo[: m.start()].strip()

    # «30 a 45 segundos» / «20 segundos»
    m = re.fullmatch(r"(\d+)(?:\s*a\s*(\d+))?\s*segundos?", cuerpo)
    if m:
        a = float(m.group(1))
        seg = _delrango(a, float(m.group(2))) if m.group(2) else a
        return seg, porlado

    # «12» / «8 a 15»
    m = re.fullmatch(r"(\d+)(?:\s*a\s*(\d+))?", cuerpo)
    if m:
        a = float(m.group(1))
        reps = _delrango(a, float(m.group(2))) if m.group(2) else a
        return reps * SEG_REPETICION, porlado

    raise ValueError(f"no sé cuánto dura una serie de «{cuerpo}»")


def _series(d: str) -> list[Tramo] | None:
    """«3 series de 12», «2 series de 10 por lado», «3 series de 30 a 45 segundos»."""
    m = re.fullmatch(r"(\d+)\s*series?\s+de\s+(.+)", d, re.I)
    if not m:
        return None
    n = int(m.group(1))
    seg, porlado = _cuenta_de_serie(m.group(2))

    tramos: list[Tramo] = []
    for i in range(n):
        # La primera serie no lleva aviso: lo dijo la instrucción del ejercicio.
        entrada = None if i == 0 else f"Serie {i + 1}."
        tramos.append(Tramo(entrada, seg))
        if porlado:
            tramos.append(Tramo(porlado, seg))
        if i < n - 1:
            tramos.append(Tramo("Descansá.", DESCANSO_SERIE))
    return tramos


def _segundos(d: str) -> list[Tramo] | None:
    """«40 segundos», «30 segundos por lado», «25 segundos por pierna»."""
    m = re.fullmatch(r"(\d+)(?:\s*a\s*(\d+))?\s*segundos?(?:\s+por\s+(lado|pierna|brazo))?", d, re.I)
    if not m:
        return None
    a = float(m.group(1))
    seg = _delrango(a, float(m.group(2))) if m.group(2) else a
    tramos = [Tramo(None, seg)]
    if m.group(3):
        tramos.append(Tramo(_LADOS[m.group(3)], seg))
    return tramos


def _minutos(d: str) -> list[Tramo] | None:
    """«5 minutos», «30 minutos». Los tramos de la caminata."""
    m = re.fullmatch(r"(\d+)\s*minutos?", d, re.I)
    return [Tramo(None, float(m.group(1)) * 60)] if m else None


def _repeticiones(d: str) -> list[Tramo] | None:
    """«8 repeticiones lentas»."""
    m = re.fullmatch(r"(\d+)\s*repeticiones?(\s+lentas?)?", d, re.I)
    if not m:
        return None
    seg = SEG_REP_LENTA if m.group(2) else SEG_REPETICION
    return [Tramo(None, int(m.group(1)) * seg)]


def _respiraciones(d: str) -> list[Tramo] | None:
    """«5 respiraciones»."""
    m = re.fullmatch(r"(\d+)\s*respiraciones?", d, re.I)
    return [Tramo(None, int(m.group(1)) * SEG_RESPIRACION)] if m else None


def _vueltas(d: str) -> list[Tramo] | None:
    """«4 vueltas a cada lado»."""
    m = re.fullmatch(r"(\d+)\s*vueltas?\s+a\s+cada\s+lado", d, re.I)
    if not m:
        return None
    seg = int(m.group(1)) * SEG_VUELTA
    return [Tramo(None, seg), Tramo("Ahora para el otro lado.", seg)]


def _dos_sentidos(d: str) -> list[Tramo] | None:
    """«10 atrás, 10 adelante»."""
    m = re.fullmatch(r"(\d+)\s*(\w+),\s*(\d+)\s*(\w+)", d, re.I)
    if not m:
        return None
    return [
        Tramo(None, int(m.group(1)) * SEG_REPETICION),
        Tramo(f"Ahora {m.group(4)}.", int(m.group(3)) * SEG_REPETICION),
    ]


RECONOCEDORES = (_series, _segundos, _minutos, _repeticiones,
                 _respiraciones, _vueltas, _dos_sentidos)


def interpretar(dosis: str) -> list[Tramo]:
    """Los tramos de silencio de un ejercicio.

    Devuelve `[]` para las dosis que **no son tiempo**, como «Cada 10 minutos» o
    «Contá 20 segundos»: son indicaciones de autocontrol dentro de la caminata,
    no un ejercicio que haya que cronometrar. Callarse diez minutos ahí sería
    tomarse la frase al pie de la letra en el peor sentido.
    """
    d = dosis.strip()
    if re.match(r"^(cada|cont[áa])\b", d, re.I):
        return []
    for r in RECONOCEDORES:
        tramos = r(d)
        if tramos is not None:
            return tramos
    raise ValueError(f"dosis no reconocida: «{dosis}»")


def duracion(dosis: str) -> float:
    """Segundos de trabajo real de un ejercicio, sin contar lo que se habla."""
    return sum(t.segundos for t in interpretar(dosis))


# ── Autoprueba ──────────────────────────────────────────────────────────────

def autoprueba() -> int:
    """Corre las 26 dosis reales del sitio y muestra en qué queda cada una.

    Se leen de `ejercicios.js` y no de una lista escrita a mano: si mañana se
    agrega un ejercicio con una forma nueva, esto falla acá y no en medio de una
    generación de cuarenta minutos.
    """
    import json
    from pathlib import Path

    raiz = Path(__file__).resolve().parent.parent.parent
    datos = json.loads((raiz / "storage" / "contenido.json").read_text(encoding="utf-8"))

    vistas: dict[str, int] = {}
    for rutina in datos["rutinas"]:
        for bloque in rutina["bloques"]:
            for ej in bloque["ejercicios"]:
                vistas[ej["dosis"]] = vistas.get(ej["dosis"], 0) + 1

    fallos = 0
    print(f"{len(vistas)} dosis distintas\n")
    for d in sorted(vistas):
        try:
            tramos = interpretar(d)
            total = sum(t.segundos for t in tramos)
            detalle = "sin tiempo" if not tramos else \
                f"{len(tramos)} tramo(s), {total / 60:5.2f} min"
            print(f"  {d:<32} → {detalle}")
        except ValueError as e:
            print(f"  {d:<32} → ✗ {e}")
            fallos += 1

    print(f"\n{'✗ ' + str(fallos) + ' sin reconocer' if fallos else '✓ todas reconocidas'}")
    return 1 if fallos else 0


if __name__ == "__main__":
    raise SystemExit(autoprueba())
