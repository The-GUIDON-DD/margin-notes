"""Extract Light And Airy glyph data for the intro's handwriting animation.

For each character this writes:
  - d:       the real glyph outline (shown once the letter is finished)
  - strokes: single-line pen strokes down the middle of the glyph, in a
             rough writing order (found by thinning a rendered glyph to a
             1px skeleton and tracing it)
  - lengths: length of each stroke, so the pen can move at a steady speed
All coordinates are font units, y up. Output: app/landing/handwriting-glyphs.ts

    python3 scripts/generate-handwriting-glyphs.py

Requires fonttools, numpy, scipy and Pillow.
"""

import json
import math
import string
from pathlib import Path

import numpy as np
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "public/fonts/LightAndAiry.ttf"
OUT = ROOT / "app/landing/handwriting-glyphs.ts"
CHARS = string.ascii_lowercase + string.digits + ".,'’-!?:;()\"&"

SIZE = 1000  # render at 1px = 1 font unit (unitsPerEm is 1000)
PAD = 60
MIN_SPUR = 18  # prune skeleton branches shorter than this (thinning noise)
SIMPLIFY = 3.0  # Ramer–Douglas–Peucker tolerance, font units

NEIGHBOURS = [(-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1)]


def render(char: str, font: ImageFont.FreeTypeFont, ascent: int, descent: int):
    left, _, right, _ = font.getbbox(char, anchor="ls")
    width = int(right - min(left, 0)) + 2 * PAD
    height = ascent - descent + 2 * PAD
    origin_x = PAD - min(left, 0)
    baseline = PAD + ascent
    img = Image.new("L", (width, height), 0)
    ImageDraw.Draw(img).text((origin_x, baseline), char, font=font, fill=255, anchor="ls")
    return np.array(img) > 127, origin_x, baseline


def thin(mask: np.ndarray) -> np.ndarray:
    """Zhang–Suen thinning, vectorised."""
    img = mask.astype(np.uint8)
    changed = True
    while changed:
        changed = False
        for step in (0, 1):
            p = np.pad(img, 1)
            n = [p[1 + dy : p.shape[0] - 1 + dy, 1 + dx : p.shape[1] - 1 + dx] for dy, dx in NEIGHBOURS]
            p2, p3, p4, p5, p6, p7, p8, p9 = n
            b = sum(n)
            seq = n + [n[0]]
            a = sum(((seq[i] == 0) & (seq[i + 1] == 1)).astype(np.uint8) for i in range(8))
            if step == 0:
                c1, c2 = p2 * p4 * p6, p4 * p6 * p8
            else:
                c1, c2 = p2 * p4 * p8, p2 * p6 * p8
            kill = (img == 1) & (b >= 2) & (b <= 6) & (a == 1) & (c1 == 0) & (c2 == 0)
            if kill.any():
                img[kill] = 0
                changed = True
    return img.astype(bool)


def neighbours(pixels: set, p):
    y, x = p
    return [(y + dy, x + dx) for dy, dx in NEIGHBOURS if (y + dy, x + dx) in pixels]


def prune(pixels: set) -> set:
    pixels = set(pixels)
    for _ in range(3):
        removed = False
        for p in [q for q in pixels if len(neighbours(pixels, q)) == 1]:
            branch, cur, prev = [p], p, None
            while True:
                nxt = [q for q in neighbours(pixels, cur) if q != prev and q not in branch]
                if len(nxt) != 1 or len(neighbours(pixels, nxt[0])) > 2:
                    break
                prev, cur = cur, nxt[0]
                branch.append(cur)
                if len(branch) > MIN_SPUR:
                    break
            touches_junction = any(len(neighbours(pixels, q)) > 2 for q in neighbours(pixels, branch[-1]))
            if len(branch) <= MIN_SPUR and touches_junction:
                pixels -= set(branch)
                removed = True
        if not removed:
            break
    return pixels


def trace(pixels: set) -> list:
    """Walk the skeleton into polylines, preferring straight continuations."""
    unvisited_edges = {frozenset((p, q)) for p in pixels for q in neighbours(pixels, p)}
    strokes = []

    def free(p):
        return [q for q in neighbours(pixels, p) if frozenset((p, q)) in unvisited_edges]

    while unvisited_edges:
        # Start at an endpoint if any are left (topmost, then leftmost), else anywhere.
        candidates = [p for p in pixels if free(p)]
        ends = [p for p in candidates if len(neighbours(pixels, p)) == 1]
        start = min(ends or candidates, key=lambda p: (p[0], p[1]))
        path, cur, heading = [start], start, None
        while True:
            options = free(cur)
            if not options:
                break
            if heading is None:
                nxt = min(options, key=lambda q: (q[0], q[1]))
            else:
                nxt = min(options, key=lambda q: -((q[0] - cur[0]) * heading[0] + (q[1] - cur[1]) * heading[1]))
            unvisited_edges.discard(frozenset((cur, nxt)))
            # also drop diagonal shortcuts around this step so we don't double back
            for q in neighbours(pixels, cur):
                if q in neighbours(pixels, nxt) and q != nxt:
                    unvisited_edges.discard(frozenset((cur, q)))
                    unvisited_edges.discard(frozenset((q, nxt)))
            heading = (nxt[0] - cur[0], nxt[1] - cur[1])
            path.append(nxt)
            cur = nxt
        if len(path) > 4:
            strokes.append(path)
    return strokes


def rdp(points, eps):
    if len(points) < 3:
        return points
    (x1, y1), (x2, y2) = points[0], points[-1]
    dx, dy = x2 - x1, y2 - y1
    norm = math.hypot(dx, dy) or 1.0
    dists = [abs(dy * x - dx * y + x2 * y1 - y2 * x1) / norm for x, y in points]
    i = max(range(len(points)), key=dists.__getitem__)
    if dists[i] > eps:
        return rdp(points[: i + 1], eps)[:-1] + rdp(points[i:], eps)
    return [points[0], points[-1]]


def simplify(points, eps):
    """RDP that survives closed loops (start == end), e.g. the letter o."""
    if len(points) > 3 and math.dist(points[0], points[-1]) < 3:
        mid = len(points) // 2
        return rdp(points[: mid + 1], eps)[:-1] + rdp(points[mid:], eps)
    return rdp(points, eps)


def drop_noise(polylines, min_len=15, near=30):
    """Remove tiny strokes that hang off longer ones; keep isolated dots."""
    def length(pts):
        return sum(math.dist(a, b) for a, b in zip(pts, pts[1:]))

    kept = []
    for pts in polylines:
        if length(pts) >= min_len:
            kept.append(pts)
            continue
        others = [q for o in polylines if o is not pts and length(o) >= min_len for q in o]
        if not any(math.dist(p, q) < near for p in pts for q in others):
            kept.append(pts)  # an isolated dot, like the one on an i
    return kept


def orient(points):
    """Write strokes top-to-bottom, or left-to-right if mostly horizontal."""
    (x1, y1), (x2, y2) = points[0], points[-1]
    if abs(x2 - x1) > abs(y2 - y1) * 1.5:
        return points if x1 <= x2 else points[::-1]
    return points if y1 >= y2 else points[::-1]  # y up: larger y is higher


def main() -> None:
    tt = TTFont(FONT)
    glyph_set = tt.getGlyphSet()
    cmap = tt.getBestCmap()
    ascent, descent = tt["hhea"].ascent, tt["hhea"].descent
    pil_font = ImageFont.truetype(str(FONT), SIZE)

    glyphs = {}
    for char in CHARS:
        name = cmap.get(ord(char))
        if name is None:
            continue
        pen = SVGPathPen(glyph_set, ntos=lambda n: str(round(n)))
        glyph_set[name].draw(pen)

        mask, origin_x, baseline = render(char, pil_font, ascent, descent)
        skeleton = prune({tuple(p) for p in np.argwhere(thin(mask))})
        polylines = []
        for path in trace(skeleton):
            pts = [(x - origin_x, baseline - y) for y, x in path]
            polylines.append(orient(simplify(pts, SIMPLIFY)))
        polylines = drop_noise(polylines)
        if not polylines:
            # Dots (e.g. a period) thin away entirely: dab the pen at the centre.
            ys, xs = np.nonzero(mask)
            cx, cy = xs.mean() - origin_x, baseline - ys.mean()
            polylines = [[(cx, cy + 4), (cx, cy - 4)]]
        # writing order: left to right by where each stroke starts
        polylines.sort(key=lambda pts: (round(min(p[0] for p in pts) / 40), -max(p[1] for p in pts)))

        strokes, lengths = [], []
        for pts in polylines:
            strokes.append("M" + "L".join(f"{round(x)} {round(y)}" for x, y in pts))
            lengths.append(round(sum(math.dist(a, b) for a, b in zip(pts, pts[1:]))))

        glyphs[char] = {
            "d": pen.getCommands(),
            "advance": glyph_set[name].width,
            "strokes": strokes,
            "lengths": lengths,
        }

    dist = ndimage.distance_transform_edt(render("l", pil_font, ascent, descent)[0])
    pen_width = round(float(np.percentile(dist[dist > 0], 95)) * 2)

    body = (
        "// Generated by scripts/generate-handwriting-glyphs.py — do not edit.\n"
        "// Light And Airy outlines and centreline pen strokes, font units (y up).\n\n"
        f"export const UNITS_PER_EM = {tt['head'].unitsPerEm};\n"
        f"export const ASCENT = {ascent};\n"
        f"export const DESCENT = {descent};\n"
        f"export const SPACE_ADVANCE = {glyph_set[cmap[32]].width};\n"
        f"/** Approximate stroke weight of the font, for the pen line. */\n"
        f"export const PEN_WIDTH = {pen_width};\n\n"
        "export type Glyph = {\n"
        "  d: string;\n  advance: number;\n  strokes: string[];\n  lengths: number[];\n};\n\n"
        "export const GLYPHS: Record<string, Glyph> =\n"
        f"  {json.dumps(glyphs, indent=2, ensure_ascii=False)};\n"
    )
    OUT.write_text(body)
    total = sum(len(g["strokes"]) for g in glyphs.values())
    print(f"Wrote {len(glyphs)} glyphs ({total} strokes, pen width {pen_width}) to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
