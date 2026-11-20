import { data } from "react-router";
import { CATEGORY_PAGES, type CategorySlug } from "../gallery/doodles";
import { GalleryPage } from "../gallery/gallery-page";
import type { Route } from "./+types/doodles";

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  const page = CATEGORY_PAGES[params.category as CategorySlug];
  if (!page) throw data("Not found", { status: 404 });
  return { page };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: `${loaderData?.page.title ?? "Doodles"} · Margin Notes` }];
}

export default function Doodles({ loaderData }: Route.ComponentProps) {
  return <GalleryPage page={loaderData.page} />;
}
