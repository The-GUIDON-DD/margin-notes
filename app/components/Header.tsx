import { Link, type UIMatch, useMatches } from "react-router";

/**
 * Routes set the header subtitle through their `handle` export:
 *
 *   export const handle: RouteHandle = { title: "Animals" };
 *
 * or, for dynamic routes, derive it from the match:
 *
 *   export const handle: RouteHandle = {
 *     title: (match) => match.params.category,
 *   };
 *
 * The deepest matching route that defines a title wins.
 */
export interface RouteHandle {
  title?: string | ((match: UIMatch) => string | undefined);
}

function usePageTitle(): string | undefined {
  const matches = useMatches();

  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const title = (match.handle as RouteHandle | undefined)?.title;
    const resolved = typeof title === "function" ? title(match) : title;
    if (resolved) return resolved;
  }

  return undefined;
}

export function Header() {
  const pageTitle = usePageTitle();

  return (
    <header className="grid grid-cols-2 items-center gap-x-4 gap-y-4 px-4 pt-6 pb-4 sm:px-8 md:grid-cols-[1fr_auto_1fr] md:items-start md:px-12 md:pt-8">
      <nav className="justify-self-start md:pt-2">
        <Link
          to="/gallery"
          className="font-hand text-2xl leading-none uppercase transition-opacity hover:opacity-60 md:text-3xl"
        >
          Explore
        </Link>
      </nav>

      <div className="col-span-2 row-start-1 flex flex-col items-center text-center md:col-span-1 md:col-start-2">
        <Link
          to="/"
          className="font-display text-3xl leading-none sm:text-4xl md:text-5xl"
        >
          Margin Notes
        </Link>
        {pageTitle && (
          <h1 className="mt-1 font-hand text-base leading-none uppercase md:text-xl">
            {pageTitle}
          </h1>
        )}
      </div>

      <Link
        to="/contribute"
        className="group relative justify-self-end font-hand text-xl leading-none uppercase md:col-start-3 md:text-2xl"
      >
        <span className="relative flex items-center gap-2 px-4 pt-2 pb-1.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:-rotate-2 md:px-5">
          <img
            src="/landing/cta-outline.svg"
            alt=""
            className="absolute inset-0 h-full w-full max-w-none"
          />
          <span className="relative">Contribute</span>
          <img
            src="/landing/cta-arrow.svg"
            alt=""
            className="relative h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
          />
        </span>
      </Link>
    </header>
  );
}
