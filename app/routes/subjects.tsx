import { data } from "react-router";
import { SUBJECT_PAGES, type SubjectSlug } from "../gallery/doodles";
import { GalleryPage } from "../gallery/gallery-page";
import type { Route } from "./+types/subjects";

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  const page = SUBJECT_PAGES[params.subject as SubjectSlug];
  if (!page) throw data("Not found", { status: 404 });
  return { page };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: `${loaderData?.page.title ?? "Subjects"} · Margin Notes` }];
}

export default function Subjects({ loaderData }: Route.ComponentProps) {
  return <GalleryPage page={loaderData.page} />;
}
