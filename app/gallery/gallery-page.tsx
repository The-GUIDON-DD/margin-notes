import { Link } from "react-router";
import type { GalleryPage as GalleryPageData } from "./doodles";
import { GalleryGrid } from "./gallery-grid";

/**
 * A "by Doodle" / "by Subject" page: header, gallery grid, credits.
 *
 * The header and credits are lightweight stand-ins for the shared navbar and
 * footer (owned separately). Per request, there is no CONTRIBUTE button.
 */
export function GalleryPage({ page }: { page: GalleryPageData }) {
  return (
    <main className="gallery-page bg-paper text-ink">
      <header className="gallery-page__header">
        <Link to="/gallery" className="gallery-page__explore font-hand">
          EXPLORE
        </Link>
        <h1 className="gallery-page__title">
          <Link to="/" className="font-display">
            Margin Notes
          </Link>
          <span className="gallery-page__subtitle font-hand">
            {page.title.toUpperCase()}
          </span>
        </h1>
      </header>

      <GalleryGrid page={page} />

      <footer className="gallery-page__credits font-hand">
        <span className="font-sans">©</span> 2026 The Guidon
      </footer>
    </main>
  );
}
