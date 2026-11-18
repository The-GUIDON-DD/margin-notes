import type { CSSProperties } from "react";
import { Link } from "react-router";
import { BLOB_VIEWBOX, blobPath, tiltFor } from "./blob";

interface CategoryBubbleProps {
  to: string;
  label: string;
  /** Position in the page, used to stagger the entrance animation. */
  index: number;
}

export function CategoryBubble({ to, label, index }: CategoryBubbleProps) {
  const rest = blobPath(label);
  const hover = blobPath(label, "hover", 0.04);
  const tilt = tiltFor(label);

  return (
    <span
      className="bubble-in inline-block"
      style={{ "--i": index } as CSSProperties}
    >
      <Link
        to={to}
        className="bubble group relative inline-flex items-center justify-center px-[1.2em] pt-[0.85em] pb-[0.75em] font-hand leading-none whitespace-nowrap uppercase sm:px-[1.6em]"
        style={
          {
            "--tilt": `${tilt}deg`,
            "--tilt-hover": `${-tilt * 1.5 || -2}deg`,
            "--d-rest": `path("${rest}")`,
            "--d-hover": `path("${hover}")`,
          } as CSSProperties
        }
      >
        <svg
          viewBox={BLOB_VIEWBOX}
          preserveAspectRatio="none"
          aria-hidden="true"
          className="bubble-svg absolute inset-0 h-full w-full overflow-visible"
        >
          <path
            className="bubble-shape"
            d={rest}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="relative">{label}</span>
      </Link>
    </span>
  );
}
