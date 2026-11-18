import { CategoryBubble } from "../gallery/CategoryBubble";
import { type CategoryGroup, categoryGroups } from "../gallery/categories";

export function meta() {
  return [
    { title: "Explore · Margin Notes" },
    {
      name: "description",
      content: "Browse margin doodles by what was drawn or by subject.",
    },
  ];
}

export default function Gallery() {
  let index = 0;

  return (
    // Sizes are fluid and tuned against the 1440px wireframe: the two groups
    // sit at the edges of a ~73vw band, bubble text ~2.5vw. Everything inside
    // scales with `em`. Stacked (< lg), the text scales with the phone width.
    <main className="mx-auto flex w-full flex-col items-center gap-y-[2.2em] px-4 pt-[clamp(2.5rem,6vw,6rem)] pb-24 text-[clamp(1.5rem,5.4vw,2rem)] sm:px-8 lg:w-[73vw] lg:max-w-[1400px] lg:flex-row lg:items-start lg:justify-between lg:px-0 lg:text-[min(2.5vw,2.75rem)]">
      {categoryGroups.map((group, g) => (
        <section
          key={group.group}
          aria-labelledby={`group-${group.group}`}
          className="flex flex-col items-center"
        >
          <GroupHeading group={group} accent={g === 0 ? "dashes" : "burst"} />
          <ul className="mt-[1.4em] flex w-fit max-w-full flex-col items-start gap-y-[0.55em]">
            {pairs(group.items).map((row) => (
              <li
                key={row[0].slug}
                className="flex flex-wrap items-center gap-x-[0.6em] gap-y-[0.55em]"
              >
                {row.map((item) => (
                  <CategoryBubble
                    key={item.slug}
                    to={`/gallery/${group.group}/${item.slug}`}
                    label={item.label}
                    index={index++}
                  />
                ))}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

/** Wireframe lays bubbles out two per row, left-aligned. */
function pairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return rows;
}

function GroupHeading({
  group,
  accent,
}: {
  group: CategoryGroup;
  accent: "dashes" | "burst";
}) {
  return (
    <h2
      id={`group-${group.group}`}
      className="bubble-in relative font-hand text-[1.05em] leading-none"
    >
      {group.heading}
      {/* Hand-drawn underline */}
      <svg
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute -bottom-[0.3em] -left-[0.3em] h-[0.25em] w-[calc(100%+0.6em)] overflow-visible"
      >
        <path
          d="M1 5C20 3.5 45 4.5 60 3.8S90 3 99 4.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {accent === "dashes" ? <Dashes /> : <Burst />}
    </h2>
  );
}

/** Little emphasis strokes, top-left of the heading. */
function Dashes() {
  return (
    <svg
      viewBox="0 0 30 26"
      aria-hidden="true"
      className="absolute -top-[1.3em] -left-[0.9em] h-[1.1em] w-[1.25em] overflow-visible text-ink/70"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M2 22 9 15" />
      <path d="M9 18 13 6" />
      <path d="M17 17 20 3" />
      <path d="M23 18 27 8" />
    </svg>
  );
}

/** Zig-zag spark, top-right of the heading. */
function Burst() {
  return (
    <svg
      viewBox="0 0 30 30"
      aria-hidden="true"
      className="absolute -top-[1.3em] -right-[1.5em] h-[1.25em] w-[1.25em] overflow-visible text-ink/70"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6 9 11 10 3 14 12 20 6 17 15 27 14 18 19 24 25" />
    </svg>
  );
}
