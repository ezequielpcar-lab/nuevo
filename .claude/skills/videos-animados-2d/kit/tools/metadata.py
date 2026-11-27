#!/usr/bin/env python3
"""Validate YouTube metadata (story/metadata.json) and write out/metadatos.txt ready to copy.

usage: python tools/metadata.py --project projects/<slug>            # check + write
       python tools/metadata.py --project projects/<slug> --base     # print the base topic from the voice file name

story/metadata.json:
{
  "base": "si tu corazon latiera lento",            # topic read from the voice file name
  "titles": [ {"title": "...", "emotion": "intriga", "thumb": 1}, ... ],   # exactly 3, thumb = 1..3
  "description": "...",                              # plain text, may contain chapters "00:00 ..." and #hashtags
  "tags": ["...", "..."]
}
YouTube limits (Data API): title <= 100 chars, description <= 5000 bytes, all tags <= 500 chars
(commas count, a tag with a space counts +2 for its quotes), no < or > in title or description.
"""
import argparse, json, os, re, sys

TAG_LIMIT, TAG_TARGET, DESC_BYTES, TITLE_MAX, TITLE_GOOD = 500, 450, 5000, 100, 70


def base_topic(cfg):
    v = os.path.basename(cfg.get("voiceover") or "")
    stem = os.path.splitext(v)[0]
    stem = re.sub(r"[_\-\.]+", " ", stem)
    stem = re.sub(r"\b(voz|voice|vo|audio|narracion|narración|final|v\d+|\d{6,})\b", " ", stem, flags=re.I)
    return re.sub(r"\s+", " ", stem).strip()


def tags_cost(tags):
    return sum(len(t) + (2 if " " in t else 0) for t in tags) + max(0, len(tags) - 1)


def to_sec(ts):
    p = [int(x) for x in ts.split(":")]
    return p[0] * 3600 + p[1] * 60 + p[2] if len(p) == 3 else p[0] * 60 + p[1]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--base", action="store_true", help="print the topic taken from the voice file name")
    a = ap.parse_args()
    P = a.project
    cfg = json.load(open(os.path.join(P, "config.json"), encoding="utf-8"))
    if a.base:
        print(base_topic(cfg) or "(sin nombre: usa la transcripción)")
        return
    md = json.load(open(os.path.join(P, "story", "metadata.json"), encoding="utf-8"))
    err, warn = [], []
    titles = md.get("titles", [])
    if len(titles) != 3:
        err.append(f"se esperaban 3 títulos, hay {len(titles)}")
    for i, t in enumerate(titles, 1):
        s = t.get("title", "")
        if not s: err.append(f"título {i} vacío")
        if len(s) > TITLE_MAX: err.append(f"título {i} tiene {len(s)} caracteres (máx. {TITLE_MAX})")
        elif len(s) > TITLE_GOOD: warn.append(f"título {i} tiene {len(s)} caracteres; ideal ≤ {TITLE_GOOD} para que no se corte")
        if re.search(r"[<>]", s): err.append(f"título {i} contiene < o > (YouTube no los acepta)")
        if not t.get("emotion"): warn.append(f"título {i} no indica la emoción")
    desc = md.get("description", "")
    nb = len(desc.encode("utf-8"))
    if nb > DESC_BYTES: err.append(f"la descripción pesa {nb} bytes (máx. {DESC_BYTES}; las tildes y emojis cuentan doble o más)")
    if re.search(r"[<>]", desc): err.append("la descripción contiene < o > (YouTube no los acepta)")
    first = desc.strip().split("\n")[0] if desc.strip() else ""
    if len(first) > 160: warn.append("la primera línea de la descripción pasa de ~150 caracteres; lo importante debe verse antes de 'más'")
    hashtags = re.findall(r"#\w+", desc)
    if not 3 <= len(hashtags) <= 5: warn.append(f"hay {len(hashtags)} hashtags; usa entre 3 y 5 (los 3 primeros salen arriba del título)")
    chap = re.findall(r"^\s*((?:\d{1,2}:)?\d{1,2}:\d{2})\s+\S", desc, flags=re.M)
    if chap:
        secs = [to_sec(c) for c in chap]
        if secs[0] != 0: err.append("los capítulos deben empezar en 00:00")
        if len(secs) < 3: err.append("YouTube necesita al menos 3 capítulos")
        if any(b - x < 10 for x, b in zip(secs, secs[1:])): err.append("cada capítulo debe durar al menos 10 segundos")
        if secs != sorted(secs): err.append("los capítulos deben ir en orden")
    tags = [t.strip() for t in md.get("tags", []) if t.strip()]
    if any(re.search(r"[<>,]", t) for t in tags): err.append("una etiqueta contiene < > o una coma dentro")
    cost = tags_cost(tags)
    if cost > TAG_LIMIT: err.append(f"las etiquetas suman {cost} caracteres (máx. {TAG_LIMIT}, contando comas y +2 por cada etiqueta con espacios)")
    elif cost > TAG_TARGET: warn.append(f"las etiquetas suman {cost}/{TAG_LIMIT}; deja margen (≤ {TAG_TARGET})")
    lower = [t.lower() for t in tags]
    if len(set(lower)) != len(lower): warn.append("hay etiquetas repetidas")

    os.makedirs(os.path.join(P, "out"), exist_ok=True)
    bar = "━" * 24
    thumbs_dir = os.path.join(P, "out", "miniaturas")
    lines = [bar, "TÍTULOS", bar]
    for i, t in enumerate(titles, 1):
        lines.append(f"{i}. {t.get('title','')}")
        extra = f"   Emoción: {t.get('emotion','')}"
        if t.get("thumb"): extra += f"  ·  Miniatura: miniatura_{t['thumb']}.png"
        lines.append(extra)
    lines += ["", bar, "DESCRIPCIÓN", bar, desc.strip(), "", bar, "ETIQUETAS", bar, ", ".join(tags), "", bar, "MINIATURAS", bar]
    if os.path.isdir(thumbs_dir):
        lines += [f"- {f}" for f in sorted(os.listdir(thumbs_dir)) if f.endswith(".png")]
    lines += ["(1280x720, listas para subir a YouTube)", ""]
    out = os.path.join(P, "out", "metadatos.txt")
    open(out, "w", encoding="utf-8").write("\n".join(lines))
    print(f"Tema base (nombre del audio): {md.get('base') or base_topic(cfg)}")
    print(f"Títulos: {[len(t.get('title','')) for t in titles]} caracteres · Descripción: {nb}/{DESC_BYTES} bytes · Etiquetas: {cost}/{TAG_LIMIT} · Hashtags: {len(hashtags)} · Capítulos: {len(chap)}")
    for w in warn: print("AVISO:", w)
    for e in err: print("ERROR:", e)
    print(("Con errores: corrígelos y vuelve a ejecutar. " if err else "OK. ") + f"Escrito {out}")
    sys.exit(1 if err else 0)


if __name__ == "__main__":
    main()
