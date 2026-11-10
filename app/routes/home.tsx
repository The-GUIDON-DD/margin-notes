import { Landing } from "../landing/landing";

export function meta() {
  return [
    { title: "Margin Notes" },
    {
      name: "description",
      content:
        "The little drawings in the margins of our notebooks, collected by The Guidon.",
    },
  ];
}

export default function Home() {
  return <Landing />;
}
