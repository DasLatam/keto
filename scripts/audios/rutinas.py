"""Guiones de los audios de rutina: elongación de la mañana y fuerza en casa.

No interviene ningún modelo de lenguaje. El texto sale entero de
`src/data/ejercicios.js` — el `como` y el `tip` de cada ejercicio ya están
escritos para que una persona los siga — y lo único que se agrega son las
entradas, las transiciones y las cuentas regresivas. Meter un modelo acá sería
darle la oportunidad de inventar una instrucción de ejercicio físico, que es
justo donde una invención lastima a alguien.

Lo que sí es una decisión de diseño es el **tiempo**: el guion no es una lista de
frases sino una partitura, con silencios de duración exacta. Ver `dosis.py`.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field

from dosis import PREPARARSE, PREPARARSE_POR_DEFECTO, Tramo, interpretar

# Con las 3 series que pide la rutina, la sesión de fuerza completa son 58
# minutos. Ariel pidió 30/40. El tope baja a 2 series y deja la sesión en unos
# 40, que es una prescripción legítima para cuando el tiempo es el límite —
# **y el audio lo dice en voz alta** en vez de simular que la rutina es más
# corta de lo que es. Con `--series 3` sale la versión completa.
TOPE_SERIES = 2

AVISO_FINAL = 10.0    # a cuántos segundos del final avisar
MINIMO_AVISO = 25.0   # sólo en tramos que valga la pena avisar


@dataclass
class Habla:
    """Una frase que dice la voz."""
    texto: str


@dataclass
class Silencio:
    """Un tramo de trabajo real, con avisos opcionales adentro.

    `cortes` son frases que se dicen **dentro** del silencio, en el segundo
    indicado desde su inicio. El armador las encaja sin estirar el tramo: si la
    frase se dijera "encima" del silencio sumando su propia duración, dieciséis
    ejercicios con dos avisos cada uno correrían el audio varios minutos, y a la
    mitad de la sesión la voz iría atrasada respecto del cuerpo.
    """
    segundos: float
    cortes: list[tuple[float, str]] = field(default_factory=list)


Pieza = Habla | Silencio


def _sin_marcas(t: str) -> str:
    """Saca lo que se lee bien y se escucha mal.

    Las comillas angulares y los guiones largos son tipografía: en la voz de
    piper salen como una pausa rara o directamente como nada. Los porcentajes y
    las abreviaturas sí se expanden, porque «60-70 %» leído literal es «sesenta
    guión setenta por ciento».
    """
    t = t.replace("«", "").replace("»", "")
    t = t.replace("—", ",").replace("–", ",")
    t = re.sub(r"(\d)\s*-\s*(\d)", r"\1 a \2", t)
    t = t.replace("%", " por ciento")
    t = re.sub(r"\s{2,}", " ", t)
    return t.strip()


def _tope(tramos: list[Tramo], tope: int) -> list[Tramo]:
    """Recorta a `tope` series, descartando también el descanso sobrante."""
    salida: list[Tramo] = []
    serie = 1
    for t in tramos:
        m = re.fullmatch(r"Serie (\d+)\.", t.aviso or "")
        if m:
            serie = int(m.group(1))
        if serie > tope:
            break
        salida.append(t)
    # Si quedó un «Descansá» al final, sobra: no hay serie siguiente.
    while salida and salida[-1].aviso == "Descansá.":
        salida.pop()
    return salida


def _tramo_a_pieza(t: Tramo) -> list[Pieza]:
    piezas: list[Pieza] = []
    if t.aviso:
        piezas.append(Habla(t.aviso))
    # La cuenta la arma `dosis.py`, que es el único que sabe si el tramo son
    # doce repeticiones, cuarenta segundos de plancha o cinco respiraciones. Acá
    # sólo queda el respaldo para un tramo largo que no traiga cuenta propia.
    cortes = list(t.cortes)
    if not cortes and t.segundos >= MINIMO_AVISO:
        cortes.append((t.segundos - AVISO_FINAL, "Diez segundos."))
    piezas.append(Silencio(t.segundos, cortes))
    return piezas


def guion(rutina: dict, tope_series: int = TOPE_SERIES) -> list[Pieza]:
    """La partitura completa de una rutina."""
    piezas: list[Pieza] = []
    ejercicios = [(b, e) for b in rutina["bloques"] for e in b["ejercicios"]]

    # ── Entrada ─────────────────────────────────────────────────────────────
    piezas.append(Habla(f"{rutina['nombre']}. {_sin_marcas(rutina['veredicto'])}"))
    if rutina.get("elementos"):
        # En minúscula: la lista viene capitalizada porque en la página son ítems
        # de una lista, y encadenada en una sola frase queda "Vas a necesitar:
        # Una silla firme, Una pared libre", que leído en voz alta suena a que
        # cada ítem empieza una oración nueva.
        cosas = [e[0].lower() + e[1:] if e else e for e in rutina["elementos"]]
        piezas.append(Habla("Vas a necesitar: " + ", ".join(cosas[:-1])
                            + (" y " if len(cosas) > 1 else "") + cosas[-1] + "."))
    piezas.append(Habla(
        "Este audio va en tiempo real: cuando yo me calle, hacé el ejercicio, "
        "y cuando vuelva a hablar es que se terminó. No hace falta que mires el reloj."
    ))
    piezas.append(Habla(
        "Te voy contando mientras trabajás, así que seguí mi cuenta y no la tuya. "
        "Antes de cada ejercicio te digo dónde ponerte, y te doy unos segundos "
        "para acomodarte."
    ))

    recortado = any(
        len(_tope(interpretar(e["dosis"]), tope_series)) < len(interpretar(e["dosis"]))
        for _, e in ejercicios
    )
    if recortado:
        # Que la rutina escrita tenga tres series y el audio haga dos no se
        # disimula: se dice. Un audio que se calla esto está mintiendo sobre
        # cuánto entrenó quien lo siguió.
        nombres = {1: "una serie", 2: "dos series", 3: "tres series"}
        piezas.append(Habla(
            f"Vamos a hacer {nombres.get(tope_series, f'{tope_series} series')} de cada ejercicio, para que la sesión "
            "entre en unos cuarenta minutos. La rutina de la página tiene tres: "
            "si te sobra tiempo, sumá la tercera al final de cada ejercicio."
        ))
    piezas.append(Habla("Cuando estés listo, empezamos."))
    piezas.append(Silencio(8.0))

    # ── Ejercicios ──────────────────────────────────────────────────────────
    prepararse = PREPARARSE.get(rutina.get("tipo", ""), PREPARARSE_POR_DEFECTO)
    bloque_actual = None
    ultima_posicion = None
    for i, (bloque, ej) in enumerate(ejercicios):
        if bloque is not bloque_actual:
            bloque_actual = bloque
            piezas.append(Habla(f"Bloque: {bloque['nombre']}. {_sin_marcas(bloque['nota'])}"))

        piezas.append(Habla(f"{ej['nombre']}. {ej['dosis']}."))

        # ── Dónde ponerse, y recién después el tiempo de ponerse ───────────
        #
        # Antes esto era al revés: la voz decía «acomodate para el que sigue»,
        # se callaba, y recién entonces nombraba el ejercicio. Quien lo hacía
        # con los ojos cerrados se quedaba parado sin saber si el que venía era
        # en el piso o de pie, y el silencio de acomodarse se le iba en esperar.
        # Ahora primero se dice de pie, boca arriba o de rodillas, y el silencio
        # llega cuando ya se sabe hacia dónde moverse.
        posicion = _sin_marcas(ej.get("posicion", ""))
        if posicion and posicion != ultima_posicion:
            piezas.append(Habla(posicion))
            piezas.append(Silencio(prepararse))
            ultima_posicion = posicion
        elif posicion:
            # Misma postura que el anterior: repetirla entera suena a que la voz
            # no se acuerda de lo que acaba de decir, y acomodarse no lleva
            # tiempo si ya se está en el lugar.
            piezas.append(Habla("Quedate en la misma posición."))
            piezas.append(Silencio(prepararse / 2))

        piezas.append(Habla(_sin_marcas(ej["como"])))
        # El tip va antes del trabajo y no después: es el error que hay que
        # evitar mientras se hace, no un comentario sobre lo que ya pasó.
        piezas.append(Habla(_sin_marcas(ej["tip"])))

        tramos = _tope(interpretar(ej["dosis"]), tope_series)
        if not tramos:
            continue
        piezas.append(Habla("Empezá."))
        for t in tramos:
            piezas.extend(_tramo_a_pieza(t))

        if i < len(ejercicios) - 1:
            piezas.append(Habla("Muy bien."))

    # ── Cierre ──────────────────────────────────────────────────────────────
    piezas.append(Habla(
        f"Terminamos. {_sin_marcas(rutina['cuando'])} "
        "Nos vemos en la próxima."
    ))
    return piezas


def estimar(piezas: list[Pieza], ppm: float = 172.0) -> float:
    """Duración estimada en segundos, antes de sintetizar.

    Es una estimación: la real la da el wav. Sirve para ajustar los parámetros
    de `dosis.py` sin esperar los veinte minutos que tarda piper.
    """
    total = 0.0
    for p in piezas:
        if isinstance(p, Habla):
            total += len(p.texto.split()) / ppm * 60
        else:
            total += p.segundos
    return total


# ── Persistencia de la partitura ────────────────────────────────────────────
# Un guion de caminata cuesta media hora de modelo. Guardarlo apenas está hecho
# es lo que permite reintentar la síntesis, ajustar una pausa o regenerar un solo
# audio sin volver a pagar esa media hora — y sobre todo, que si el motor se
# queda sin cuota en la tercera caminata no se pierdan las dos primeras.

def a_json(piezas: list[Pieza]) -> list[dict]:
    salida = []
    for p in piezas:
        if isinstance(p, Habla):
            salida.append({"t": "habla", "texto": p.texto})
        else:
            salida.append({"t": "silencio", "seg": p.segundos, "cortes": p.cortes})
    return salida


def de_json(datos: list[dict]) -> list[Pieza]:
    piezas: list[Pieza] = []
    for d in datos:
        if d["t"] == "habla":
            piezas.append(Habla(d["texto"]))
        else:
            piezas.append(Silencio(d["seg"], [tuple(c) for c in d.get("cortes", [])]))
    return piezas
