"""Síntesis con piper y armado de la partitura en un solo archivo.

Reusa la voz de **Daniela** (`es_AR-daniela-high`) que ya usa videosyt, y el
intérprete de Plan B, que es el único del servidor con piper instalado. Ver
`/home/hpp/videosyt/pipeline/config.py`.

Lo que este módulo hace y el de videosyt no: **respetar el reloj**. Allá los
silencios son pausas de estilo entre frases; acá un silencio es el tiempo en que
alguien está sosteniendo una plancha, y tiene que durar lo que dice que dura.
Por eso los avisos que caen adentro de un tramo ("Diez segundos") no se suman al
tramo: se encajan, y el tramo termina en el segundo que le corresponde.
"""
from __future__ import annotations

import hashlib
import json
import subprocess
import sys
import wave
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from rutinas import Habla, Pieza, Silencio

# Prestado de videosyt, declarado acá arriba para que se vea de qué depende.
PLANB = Path("/home/hpp/planb/bot")
PYTHON_PIPER = PLANB / ".venv" / "bin" / "python"
VOZ = PLANB / "voces" / "es_AR-daniela-high.onnx"
WORKER = Path("/home/hpp/videosyt/pipeline/tts_worker.py")

# El ritmo "relajado" de videosyt. Daniela habla rápido: el length_scale casi no
# la frena, así que el aire real se lo da el silencio entre frases.
LENGTH_SCALE = 1.22
PAUSA_FRASE = 0.55      # entre dos frases habladas seguidas

FFMPEG = "/usr/bin/ffmpeg"   # el de linuxbrew no: ver el CLAUDE.md de agente


def _id(texto: str) -> str:
    """Nombre de archivo estable a partir del texto.

    Con el hash del texto, regenerar un audio después de cambiar una sola frase
    reusa los otros ciento veinte wavs. Sin esto, cada ajuste de una coma cuesta
    veinte minutos de piper.
    """
    return hashlib.sha1(texto.encode("utf-8")).hexdigest()[:16]


def sintetizar(textos: list[str], cache: Path, workers: int = 3) -> dict[str, dict]:
    """Un wav por frase en `cache/`. Reanudable: no repite lo que ya está."""
    cache.mkdir(parents=True, exist_ok=True)
    unicos = list(dict.fromkeys(textos))
    faltan = [t for t in unicos if not (cache / f"{_id(t)}.wav").exists()]

    if faltan:
        print(f"  sintetizando {len(faltan)} frases nuevas "
              f"(de {len(unicos)}) con la voz de Daniela…", flush=True)
        shards = [faltan[i::workers] for i in range(workers)]
        with ThreadPoolExecutor(max_workers=workers) as ex:
            list(ex.map(lambda sh: _shard(sh, cache), [s for s in shards if s]))

    info = {}
    for t in unicos:
        ruta = cache / f"{_id(t)}.wav"
        with wave.open(str(ruta), "rb") as w:
            info[t] = {
                "ruta": ruta,
                "muestras": w.getnframes(),
                "rate": w.getframerate(),
                "canales": w.getnchannels(),
                "ancho": w.getsampwidth(),
                "seg": w.getnframes() / w.getframerate(),
            }
    return info


def _shard(textos: list[str], cache: Path) -> None:
    cfg = {
        "modelo": str(VOZ),
        "length_scale": LENGTH_SCALE,
        "salida": str(cache),
        "bloques": [{"id": _id(t), "texto": t} for t in textos],
    }
    tmp = cache / f".cfg-{_id(''.join(textos))}.json"
    tmp.write_text(json.dumps(cfg), encoding="utf-8")
    r = subprocess.run([str(PYTHON_PIPER), str(WORKER), str(tmp)],
                       capture_output=True, text=True)
    tmp.unlink(missing_ok=True)
    if r.returncode != 0:
        raise RuntimeError(f"piper falló: {r.stderr[-500:]}")


def armar(piezas: list[Pieza], info: dict[str, dict], salida: Path) -> float:
    """Pega la partitura en un wav y devuelve su duración real en segundos.

    El pegado se hace acá con el módulo `wave` y no con ffmpeg a propósito: así
    los segundos que salen del cálculo son exactamente las muestras que quedan
    en el archivo, sin depender de cómo redondee un filtro de concatenación.
    """
    primero = next(iter(info.values()))
    rate, canales, ancho = primero["rate"], primero["canales"], primero["ancho"]
    bytes_por_seg = rate * canales * ancho

    def silencio(seg: float) -> bytes:
        return b"\x00" * (int(round(seg * rate)) * canales * ancho)

    with wave.open(str(salida), "wb") as out:
        out.setnchannels(canales)
        out.setsampwidth(ancho)
        out.setframerate(rate)
        escritos = 0

        anterior_hablada = False
        for p in piezas:
            if isinstance(p, Habla):
                if anterior_hablada:
                    out.writeframes(silencio(PAUSA_FRASE))
                    escritos += int(round(PAUSA_FRASE * rate))
                datos = _leer(info[p.texto]["ruta"])
                out.writeframes(datos)
                escritos += len(datos) // (canales * ancho)
                anterior_hablada = True
                continue

            # ── Silencio con avisos encajados adentro ───────────────────────
            anterior_hablada = False
            # `inicio` se fija antes del bucle: los cortes se ubican respecto del
            # arranque del tramo, no de lo último escrito. Calculándolos contra
            # `escritos` —que avanza al escribir cada aviso— el segundo corte de
            # un mismo tramo se correría por lo que duró el primero.
            inicio = escritos
            fin = inicio + int(round(p.segundos * rate))
            for en, texto in sorted(p.cortes):
                arranque = inicio + int(round(en * rate))
                datos = _leer(info[texto]["ruta"])
                dur = len(datos) // (canales * ancho)
                # Si el aviso no entra antes del final, se saltea: estirar el
                # tramo para que quepa arruinaría justo lo que el aviso avisa.
                if arranque < escritos or arranque + dur > fin:
                    continue
                out.writeframes(silencio((arranque - escritos) / rate))
                out.writeframes(datos)
                escritos = arranque + dur
            if fin > escritos:
                out.writeframes(silencio((fin - escritos) / rate))
                escritos = fin

    return escritos / rate


def _leer(ruta: Path) -> bytes:
    with wave.open(str(ruta), "rb") as w:
        return w.readframes(w.getnframes())


def a_mp3(wav: Path, mp3: Path, titulo: str, album: str = "Keto Argentina") -> None:
    """Codifica a MP3 mono 64 kbps, que para voz es transparente y pesa poco.

    64 kbps mono son unos 480 KB por minuto: una caminata de 45 minutos entra en
    21 MB, que es lo que hace que se pueda bajar al teléfono con datos.
    """
    r = subprocess.run([
        FFMPEG, "-y", "-loglevel", "error",
        "-i", str(wav),
        "-ac", "1", "-ar", "44100", "-b:a", "64k", "-codec:a", "libmp3lame",
        "-metadata", f"title={titulo}",
        "-metadata", f"album={album}",
        "-metadata", "artist=Keto Argentina",
        "-metadata", "genre=Speech",
        str(mp3),
    ], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"ffmpeg falló: {r.stderr[-400:]}")


def generar(piezas: list[Pieza], destino: Path, nombre: str, titulo: str,
            cache: Path) -> dict:
    """De la partitura al MP3. Devuelve duración y peso."""
    textos = [p.texto for p in piezas if isinstance(p, Habla)]
    textos += [t for p in piezas if isinstance(p, Silencio) for _, t in p.cortes]

    info = sintetizar(textos, cache)
    destino.mkdir(parents=True, exist_ok=True)
    wav = destino / f"{nombre}.wav"
    mp3 = destino / f"{nombre}.mp3"

    dur = armar(piezas, info, wav)
    a_mp3(wav, mp3, titulo)
    wav.unlink()          # el wav son 120 MB y ya no hace falta

    return {"archivo": mp3.name, "segundos": round(dur, 1),
            "minutos": round(dur / 60, 1), "bytes": mp3.stat().st_size}
