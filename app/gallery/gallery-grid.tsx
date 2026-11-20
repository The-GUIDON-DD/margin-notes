import type { CSSProperties } from "react";
import { DOODLES, type GalleryPage } from "./doodles";
import { NoteCard } from "./note-card";

/**
 * Gallery grid: the collage of note cards on the "by Doodle" and "by Subject"
 * pages.
 *
 * ≥768px: cards sit exactly where the Figma frame puts them, scaled with the
 * viewport (--g = one Figma px; 1:1 at 1440px wide).
 * <768px: the same cards flow into one or two columns in reading order,
 * keeping each card's shape.
 */
export function GalleryGrid({ page }: { page: GalleryPage }) {
  // Reading order (top-to-bottom, then left-to-right) for mobile and tabbing.
  const cards = [...page.cards].sort((a, b) => a.y - b.y || a.x - b.x);

  return (
    <div
      className="gallery-grid"
      style={{ "--page-h": page.height } as CSSProperties}
    >
      {cards.map((card) => {
        const doodle = DOODLES[card.id];
        if (!doodle) return null;
        return (
          <div
            key={`${card.id}-${card.x}-${card.y}`}
            className="gallery-grid__slot"
            style={
              {
                "--x": card.x,
                "--y": card.y,
                "--w": card.w,
                "--h": card.h,
              } as CSSProperties
            }
          >
            <NoteCard doodle={doodle} />
          </div>
        );
      })}
    </div>
  );
}
