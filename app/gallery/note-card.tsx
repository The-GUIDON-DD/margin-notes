import type { CSSProperties } from "react";
import type { Corner, Doodle } from "./doodles";

/**
 * Note card (Figma: Artist Archive cards, Default + Variant2).
 *
 * Default: a cropped notebook-page photo. Hover / focus (Variant2): the photo
 * grows outward by the card's own zoom insets, a dark band fades in on one
 * edge and the artist credit appears in that corner.
 *
 * The card fills its parent, so the gallery grid decides its size. Caption
 * text is sized in --card-u units (one design px), set by the grid.
 */
export function NoteCard({ doodle }: { doodle: Doodle }) {
  const { crop, zoom, caption } = doodle;
  const [top, right, bottom, left] = zoom;
  const isTop = caption.corner.startsWith("t");
  const isRight = caption.corner.endsWith("r");

  const style = {
    // Hover zoom: the same box as Figma's outward insets, as a transform.
    "--zoom-x": `${(right - left) / 2}%`,
    "--zoom-y": `${(bottom - top) / 2}%`,
    "--zoom-sx": 1 + (left + right) / 100,
    "--zoom-sy": 1 + (top + bottom) / 100,
    "--band-height": `${caption.band}%`,
    "--band-opacity": caption.bandOpacity,
    "--band-angle": `${bandAngle(caption.corner, caption.angle)}deg`,
  } as CSSProperties;

  return (
    <figure
      // biome-ignore lint/a11y/noNoninteractiveTabindex: lets keyboard and touch users reveal the credit
      tabIndex={0}
      className="note-card"
      data-tone={caption.tone}
      style={style}
    >
      <div className="note-card__photo">
        <img
          src={doodle.src}
          alt={altText(doodle)}
          loading="lazy"
          decoding="async"
          className={
            crop === "cover"
              ? "absolute inset-0 size-full max-w-none object-cover"
              : "absolute max-w-none"
          }
          style={
            crop === "cover"
              ? undefined
              : {
                  left: `${crop.left}%`,
                  top: `${crop.top}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`,
                }
          }
        />
      </div>

      <div
        aria-hidden
        className="note-card__band"
        style={isTop ? { top: 0 } : { bottom: 0 }}
      />

      <figcaption
        className="note-card__credit font-hand"
        style={{
          ...(isTop ? { top: 0 } : { bottom: 0 }),
          ...(isRight
            ? { right: offset(caption.offset), textAlign: "right" }
            : { left: offset(caption.offset), textAlign: "left" }),
        }}
      >
        <span className="note-card__artist">{doodle.artist}</span>
        <span className="note-card__subject">in {doodle.subject}</span>
      </figcaption>
    </figure>
  );
}

const offset = (percent?: number) => (percent ? `${percent}%` : 0);

const altText = (d: Doodle) =>
  `Notebook doodle by ${titleCase(d.artist)}, drawn in ${d.subject}`;

const titleCase = (s: string) =>
  s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Figma draws every band with the same gradient, then rotates/flips the band
 * to the caption's corner. These are the equivalent CSS angles.
 */
function bandAngle(corner: Corner, angle: number) {
  switch (corner) {
    case "br":
      return angle;
    case "bl":
      return 360 - angle;
    case "tl":
      return (angle + 180) % 360;
    case "tr":
      return 180 - angle;
  }
}
