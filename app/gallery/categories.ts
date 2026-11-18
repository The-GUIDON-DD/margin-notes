export interface Category {
  slug: string;
  label: string;
}

export interface CategoryGroup {
  /** URL segment: /gallery/:group/:slug */
  group: "doodle" | "subject";
  heading: string;
  items: Category[];
}

export const categoryGroups: CategoryGroup[] = [
  {
    group: "doodle",
    heading: "by Doodle:",
    items: [
      { slug: "animals", label: "Animals" },
      { slug: "persons", label: "Persons" },
      { slug: "objects", label: "Objects" },
      { slug: "abstract", label: "Abstract" },
      { slug: "calligraphy", label: "Calligraphy" },
    ],
  },
  {
    group: "subject",
    heading: "by Subject:",
    items: [
      { slug: "theology", label: "Theology" },
      { slug: "statistics", label: "Statistics" },
      { slug: "calculus", label: "Calculus" },
      { slug: "organic-chemistry", label: "Organic Chemistry" },
      { slug: "social-science", label: "Social Science" },
    ],
  },
];
