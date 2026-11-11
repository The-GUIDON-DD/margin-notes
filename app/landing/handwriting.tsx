import type { CSSProperties } from "react";
import {
  ASCENT,
  DESCENT,
  GLYPHS,
  PEN_WIDTH,
  SPACE_ADVANCE,
  UNITS_PER_EM,
} from "./handwriting-glyphs";

/*
 * Handwriting animation. One pen writes the text in order: it draws each
 * letter's centreline strokes (from scripts/generate-handwriting-glyphs.py) at
 * a steady speed, lifting briefly between strokes and words. As each letter is
 * finished, the real font outline fades in under the ink, so the end result is
 * exactly the Light And Airy text.
 */

/**
 * Pen timing. Most strokes are short, so MIN_STROKE_MS sets the overall pace
 * (~2 strokes per letter); PEN_SPEED (font units/ms) only slows long strokes.
 * Current values write the intro in about 5.5s.
 */
export const PEN_SPEED = 45;
const MIN_STROKE_MS = 8;
const PEN_LIFT_MS = 0;
const WORD_GAP_MS = 10;

type PlannedStroke = { id: string; startMs: number; durationMs: number };
type PlannedGlyph = {
  char: string;
  x: number;
  strokes: PlannedStroke[];
  endMs: number;
};
type PlannedWord = { text: string; width: number; glyphs: PlannedGlyph[] };
export type PlannedParagraph = {
  lines: { text: string; words: PlannedWord[] }[];
};

const glyphId = (char: string) => `hw-${char.codePointAt(0)}`;
const strokeId = (char: string, k: number) => `${glyphId(char)}-${k}`;

/**
 * Lays out paragraphs (each a list of lines) on one shared timeline.
 * `pauseMs` is added between paragraphs. Pure, so it runs once at module load.
 */
export function planHandwriting(
  paragraphs: string[][],
  { startMs, pauseMs }: { startMs: number; pauseMs: number },
) {
  let t = startMs;
  const planned: PlannedParagraph[] = paragraphs.map((lines, p) => {
    if (p > 0) t += pauseMs;
    return {
      lines: lines.map((line) => ({
        text: line,
        words: line.split(" ").map((text) => {
          let x = 0;
          const glyphs = [...text].map((char) => {
            const glyph = GLYPHS[char];
            const strokes = (glyph?.strokes ?? []).map((_, k) => {
              const durationMs = Math.max(
                MIN_STROKE_MS,
                (glyph?.lengths[k] ?? 0) / PEN_SPEED,
              );
              const stroke = { id: strokeId(char, k), startMs: t, durationMs };
              t += durationMs + PEN_LIFT_MS;
              return stroke;
            });
            const planned = { char, x, strokes, endMs: t };
            x += glyph?.advance ?? SPACE_ADVANCE;
            return planned;
          });
          t += WORD_GAP_MS;
          return { text, width: x, glyphs };
        }),
      })),
    };
  });
  return { paragraphs: planned, endMs: t };
}

/** Hidden <defs> with every glyph outline and pen stroke the text uses. */
export function HandwritingDefs({ text }: { text: string }) {
  const chars = [...new Set(text)].filter((char) => GLYPHS[char]);
  return (
    <svg aria-hidden className="absolute size-0 overflow-hidden">
      <defs>
        {chars.map((char) => (
          <g key={char}>
            <path
              id={glyphId(char)}
              d={GLYPHS[char]?.d}
              transform="scale(1 -1)"
            />
            {GLYPHS[char]?.strokes.map((d, k) => (
              <path
                key={d}
                id={strokeId(char, k)}
                d={d}
                transform="scale(1 -1)"
                pathLength={1}
              />
            ))}
          </g>
        ))}
      </defs>
    </svg>
  );
}

const LINE_HEIGHT_UNITS = ASCENT - DESCENT;
const ms = (n: number) => `${Math.round(n)}ms`;

/**
 * A planned paragraph. Each line breaks on its own at md+ (matching the Figma
 * line breaks) and wraps word by word on small screens. Screen readers get the
 * plain text; the drawing is hidden from them.
 */
export function HandwrittenParagraph({ plan }: { plan: PlannedParagraph }) {
  return (
    <>
      <span className="sr-only">
        {plan.lines.map((line) => line.text).join(" ")}
      </span>
      <span
        aria-hidden
        style={{ "--pen-width": PEN_WIDTH * 0.9 } as CSSProperties}
      >
        {plan.lines.map((line) => (
          <span key={line.text} className="md:block md:whitespace-nowrap">
            {line.words.map((word) => (
              <span key={`${word.glyphs[0]?.endMs}-${word.text}`}>
                <svg
                  aria-hidden
                  className="inline-block overflow-visible"
                  viewBox={`0 ${-ASCENT} ${word.width} ${LINE_HEIGHT_UNITS}`}
                  style={{
                    width: `${word.width / UNITS_PER_EM}em`,
                    height: `${LINE_HEIGHT_UNITS / UNITS_PER_EM}em`,
                    verticalAlign: `${DESCENT / UNITS_PER_EM}em`,
                  }}
                >
                  {word.glyphs.map((glyph) => (
                    <g
                      key={glyph.x}
                      style={{ "--t-end": ms(glyph.endMs) } as CSSProperties}
                    >
                      <use
                        href={`#${glyphId(glyph.char)}`}
                        x={glyph.x}
                        className="hw-fill"
                      />
                      {glyph.strokes.map((stroke) => (
                        <use
                          key={stroke.id}
                          href={`#${stroke.id}`}
                          x={glyph.x}
                          className="hw-stroke"
                          style={
                            {
                              "--t0": ms(stroke.startMs),
                              "--dur": ms(stroke.durationMs),
                            } as CSSProperties
                          }
                        />
                      ))}
                    </g>
                  ))}
                </svg>{" "}
              </span>
            ))}
          </span>
        ))}
      </span>
    </>
  );
}
