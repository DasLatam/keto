#!/usr/bin/env python3
"""Genera los audios de guía del sitio.

    cd /home/hpp/keto
    node scripts/audios/exportar.mjs                       # refrescar el contenido
    /usr/bin/python3 scripts/audios/generar.py --plan      # ver qué saldría, sin generar
    MAX=6G /home/hpp/agente/scripts/pesado.sh \
        /usr/bin/python3 scripts/audios/generar.py --todo  # generar de verdad

Opciones:
    --plan              muestra duraciones estimadas y presupuesto de palabras
    --rutinas           sólo elongación y fuerza (no usan modelo de lenguaje)
    --caminatas         sólo las cinco caminatas
    --todo              las siete
    --solo SLUG         una sola
    --minutos N         duración objetivo de cada caminata (por defecto 45)
    --series N          tope de series en el audio de fuerza (por defecto 2)
    --motor NOMBRE      gemini | mistral | ollama | claude (por defecto gemini)

Correrlo enjaulado con `pesado.sh` no es opcional: piper levanta tres procesos
con un modelo de 114 MB cada uno y el armado del wav de una caminata son unos
230 MB en memoria. Ver el CLAUDE.md de `/home/hpp/agente`.
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))

import caminatas                                   # noqa: E402
import voz                                         # noqa: E402
from rutinas import (Habla, Silencio, a_json, de_json, estimar,   # noqa: E402
                     guion as guion_rutina)

RAIZ = AQUI.parent.parent
CONTENIDO = RAIZ / "storage" / "contenido.json"
DESTINO = RAIZ / "storage" / "audios"
CACHE = RAIZ / "storage" / "cache_voz"
MANIFIESTO = DESTINO / "audios.json"
GUIONES = DESTINO / "guiones"


def cargar() -> dict:
    if not CONTENIDO.exists():
        sys.exit("Falta storage/contenido.json. Corré: node scripts/audios/exportar.mjs")
    return json.loads(CONTENIDO.read_text(encoding="utf-8"))


def rutina_por_slug(datos: dict, slug: str) -> dict:
    for r in datos["rutinas"]:
        if r["slug"] == slug:
            return r
    sys.exit(f"No existe la rutina {slug}")


def main() -> int:
    ap = argparse.ArgumentParser(add_help=True)
    ap.add_argument("--plan", action="store_true")
    ap.add_argument("--rutinas", action="store_true")
    ap.add_argument("--caminatas", action="store_true")
    ap.add_argument("--todo", action="store_true")
    ap.add_argument("--solo", default=None)
    ap.add_argument("--minutos", type=float, default=45.0)
    ap.add_argument("--series", type=int, default=2)
    ap.add_argument("--motor", default="gemini")
    ap.add_argument("--rehacer-guiones", action="store_true",
                    help="ignora los guiones guardados y vuelve a pedírselos al motor")
    a = ap.parse_args()

    if not (a.plan or a.rutinas or a.caminatas or a.todo or a.solo):
        ap.print_help()
        return 1

    datos = cargar()
    hacer_rutinas = a.todo or a.rutinas or a.plan or bool(a.solo)
    hacer_caminatas = a.todo or a.caminatas or a.plan or bool(a.solo)

    # ── Las dos rutinas ─────────────────────────────────────────────────────
    trabajos: list[tuple[str, str, str, list]] = []
    if hacer_rutinas:
        for slug, titulo in (("elongacion-manana", "Elongación de la mañana"),
                             ("fuerza-en-casa", "Fuerza en casa")):
            if a.solo and a.solo != slug:
                continue
            r = rutina_por_slug(datos, slug)
            trabajos.append((slug, titulo, "rutina", guion_rutina(r, a.series)))

    # ── Las tres caminatas ──────────────────────────────────────────────────
    progs = caminatas.programas(datos)
    if hacer_caminatas and not a.plan:
        GUIONES.mkdir(parents=True, exist_ok=True)
        motor = None
        cam = rutina_por_slug(datos, "caminata-40")
        for p in progs:
            if a.solo and a.solo != p["slug"]:
                continue
            guardado = GUIONES / f"{p['slug']}.json"

            if guardado.exists() and not a.rehacer_guiones:
                piezas = de_json(json.loads(guardado.read_text(encoding="utf-8")))
                print(f"  {p['titulo']}: guion guardado "
                      f"({estimar(piezas) / 60:.0f} min)", flush=True)
            else:
                if motor is None:
                    motor = caminatas.MotorConReintento(a.motor)
                    print(f"Motor: {motor} (cadena: {', '.join(motor.cadena)})\n")
                print(f"  {p['titulo']}")
                t0 = time.time()
                piezas = caminatas.guion(p, a.minutos, motor, cam)
                # Se guarda apenas está, antes de sintetizar: si el motor se
                # queda sin cuota en la caminata siguiente, ésta ya está a salvo.
                guardado.write_text(
                    json.dumps(a_json(piezas), ensure_ascii=False, indent=1),
                    encoding="utf-8")
                print(f"    guion listo en {(time.time() - t0) / 60:.1f} min "
                      f"→ {guardado.relative_to(RAIZ)}\n", flush=True)

            trabajos.append((p["slug"], p["titulo"], "caminata", piezas))
        if motor and motor.avisos:
            print("Avisos del motor:")
            for av in motor.avisos:
                print(f"  · {av}")
            print()

    # ── Plan: lo que saldría, sin gastar un token ni un minuto de CPU ───────
    if a.plan:
        print("RUTINAS (sin modelo de lenguaje, el texto es el del sitio)\n")
        for slug, titulo, _, piezas in trabajos:
            habla = sum(1 for p in piezas if isinstance(p, Habla))
            sil = sum(p.segundos for p in piezas if isinstance(p, Silencio))
            print(f"  {slug:<22} {estimar(piezas) / 60:5.1f} min "
                  f"({habla} frases · {sil / 60:.1f} min de silencio real)")

        print(f"\nCAMINATAS (objetivo {a.minutos:.0f} min = "
              f"{int(a.minutos * caminatas.PPM)} palabras habladas)\n")
        for p in progs:
            crudo = sum(len(f.split()) for _, f in p["fuentes"])
            objetivo = int(a.minutos * caminatas.PPM) - 420
            factor = objetivo / crudo if crudo else 0
            techo = caminatas.EXPANSION_MAXIMA
            real = min(factor, techo)
            alcanza = (crudo * real + 420) / caminatas.PPM
            marca = "" if factor <= techo else f"  ⚠ llega a {alcanza:.0f} min"
            print(f"  {p['slug']:<32} {len(p['fuentes']):2d} bloques · "
                  f"{crudo:5d} palabras · ×{factor:.1f}{marca}")
        return 0

    # ── Generación ──────────────────────────────────────────────────────────
    DESTINO.mkdir(parents=True, exist_ok=True)
    manifiesto = json.loads(MANIFIESTO.read_text(encoding="utf-8")) \
        if MANIFIESTO.exists() else {}

    for slug, titulo, clase, piezas in trabajos:
        print(f"→ {titulo}", flush=True)
        t0 = time.time()
        info = voz.generar(piezas, DESTINO, slug, titulo, CACHE)
        info |= {"titulo": titulo, "clase": clase, "generado": time.strftime("%Y-%m-%d")}
        manifiesto[slug] = info
        print(f"   {info['minutos']} min · {info['bytes'] / 1048576:.1f} MB · "
              f"{(time.time() - t0) / 60:.1f} min de proceso\n", flush=True)

    MANIFIESTO.write_text(json.dumps(manifiesto, ensure_ascii=False, indent=2) + "\n",
                          encoding="utf-8")
    total = sum(v["minutos"] for v in manifiesto.values())
    peso = sum(v["bytes"] for v in manifiesto.values()) / 1048576
    print(f"{len(manifiesto)} audios · {total:.0f} min · {peso:.1f} MB")
    print(f"Manifiesto: {MANIFIESTO.relative_to(RAIZ)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
