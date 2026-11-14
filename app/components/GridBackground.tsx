import type { ReactNode } from "react";

interface GridBackgroundProps {
  children: ReactNode;
}

export function GridBackground({ children }: GridBackgroundProps) {
  const gridSize = "clamp(48px, 6vw, 80px)";

  return (
    <div
      className="min-h-screen w-full bg-[#FCFDF7] dark:bg-gray-950"
      style={{
        backgroundImage: `
          linear-gradient(to right, var(--grid-line-color, rgba(189, 193, 205, 0.35)) 1px, transparent 1px),
          linear-gradient(to bottom, var(--grid-line-color, rgba(189, 193, 205, 0.35)) 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize} ${gridSize}`,
      }}
    >
      {children}
    </div>
  );
}
