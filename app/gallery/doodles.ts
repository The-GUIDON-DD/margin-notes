/**
 * Doodle data for the note cards and gallery grid, taken from the Figma
 * "ARTIST ARCHIVE" (Playground page). One entry per card component.
 *
 * Geometry notes (all from Figma):
 *  - crop:    where the photo sits inside the card, as % of the card
 *             (a Figma image-fill crop). "cover" = object-fit: cover.
 *  - zoom:    on hover the photo box grows outward by these % per side
 *             [top, right, bottom, left].
 *  - caption: the artist credit's corner, the dark band's height (% of the
 *             card), band opacity, text tone, and the gradient's base angle.
 */

export type Corner = "tl" | "tr" | "bl" | "br";

export type Crop =
  | "cover"
  | { left: number; top: number; width: number; height: number };

export type Doodle = {
  id: string;
  artist: string;
  /** Subject as written on the card, e.g. "Organic Chemistry". */
  subject: string;
  category: CategorySlug;
  src: string;
  /** Width / height of the card component in Figma. */
  aspect: number;
  crop: Crop;
  zoom: [top: number, right: number, bottom: number, left: number];
  caption: {
    corner: Corner;
    /** Band height as % of the card height. */
    band: number;
    bandOpacity: number;
    tone: "light" | "dark";
    angle: number;
    /** Extra inset of the credit from its side, % of card width. */
    offset?: number;
  };
};

export const CATEGORIES = {
  animals: "Animals",
  persons: "Persons",
  objects: "Objects",
  abstract: "Abstract",
  calligraphy: "Calligraphy",
} as const;
export type CategorySlug = keyof typeof CATEGORIES;

export const SUBJECTS = {
  theology: "Theology",
  statistics: "Statistics",
  calculus: "Calculus",
  "organic-chemistry": "Organic Chemistry",
  "social-science": "Social Science",
} as const;
export type SubjectSlug = keyof typeof SUBJECTS;

const img = (name: string) => `/doodles/${name}.png`;
const crop = (left: number, top: number, width: number, height: number) => ({
  left,
  top,
  width,
  height,
});
const even = (y: number, x: number): Doodle["zoom"] => [y, x, y, x];

const INGRID = "INGRID ONG";
const ONGTAO = "S ONGTAO";
const JUNE = "JUNE ACERON";
const JULIA = "JULIA MHITHAWI";
const ENRICO = "ENRICO CRUEL";
const LIZ = "LIZ SWA";

export const DOODLES: Record<string, Doodle> = {
  io1: {
    id: "io1",
    artist: INGRID,
    subject: "Organic Chemistry",
    category: "animals",
    src: img("io-favorites"),
    aspect: 294 / 511,
    crop: crop(0, 0, 200.51, 199.8),
    zoom: even(8.41, 8.5),
    caption: {
      corner: "br",
      band: 17.61,
      bandOpacity: 1,
      tone: "light",
      angle: 172.94,
    },
  },
  io2: {
    id: "io2",
    artist: INGRID,
    subject: "Statistics",
    category: "animals",
    src: img("io-first-year"),
    aspect: 294 / 511,
    crop: crop(0, 0, 200.51, 200.68),
    zoom: even(4.7, 4.76),
    caption: {
      corner: "tl",
      band: 17.61,
      bandOpacity: 1,
      tone: "light",
      angle: 172.94,
    },
  },
  io3: {
    id: "io3",
    artist: INGRID,
    subject: "Organic Chemistry",
    category: "animals",
    src: img("io-favorites"),
    aspect: 295.16 / 511,
    crop: crop(-0.09, -100.71, 200.51, 200.59),
    zoom: even(7.05, 7.09),
    caption: {
      corner: "tl",
      band: 17.61,
      bandOpacity: 1,
      tone: "light",
      angle: 172.94,
    },
  },
  io4: {
    id: "io4",
    artist: INGRID,
    subject: "Organic Chemistry",
    category: "animals",
    src: img("io-first-year"),
    aspect: 294 / 511,
    crop: crop(-100.54, -100.4, 200.51, 200.68),
    zoom: even(9.59, 9.52),
    caption: {
      corner: "br",
      band: 17.61,
      bandOpacity: 1,
      tone: "light",
      angle: 172.94,
    },
  },
  io8: {
    id: "io8",
    artist: INGRID,
    subject: "Filipino",
    category: "animals",
    src: img("io-filipino"),
    aspect: 630 / 1013,
    crop: crop(-0.03, -1.36, 100.06, 101.36),
    zoom: [10.86, 7.78, 3.95, 7.14],
    caption: {
      corner: "bl",
      band: 8.88,
      bandOpacity: 1,
      tone: "light",
      angle: 176.69,
    },
  },
  io9: {
    id: "io9",
    artist: INGRID,
    subject: "Calculus",
    category: "animals",
    src: img("io-calculus"),
    aspect: 640 / 459,
    crop: crop(-12.38, -202.65, 124.76, 302.65),
    zoom: even(4.36, 4.38),
    caption: {
      corner: "bl",
      band: 19.61,
      bandOpacity: 1,
      tone: "light",
      angle: 176.74,
    },
  },
  io10: {
    id: "io10",
    artist: INGRID,
    subject: "Organic Chemistry",
    category: "animals",
    src: img("io-favorites"),
    aspect: 306 / 532,
    crop: crop(-100.58, 0, 200.51, 199.8),
    zoom: even(8.27, 8.17),
    caption: {
      corner: "br",
      band: 16.92,
      bandOpacity: 1,
      tone: "light",
      angle: 173.22,
    },
  },
  io11: {
    id: "io11",
    artist: INGRID,
    subject: "Organic Chemistry",
    category: "animals",
    src: img("io-favorites"),
    aspect: 306 / 532,
    crop: crop(-100.5, -99.73, 200.51, 199.8),
    zoom: even(7.52, 7.52),
    caption: {
      corner: "tr",
      band: 16.92,
      bandOpacity: 1,
      tone: "light",
      angle: 173.22,
    },
  },
  io12: {
    id: "io12",
    artist: INGRID,
    subject: "Theology",
    category: "objects",
    src: img("io-theology"),
    aspect: 344 / 569,
    crop: crop(-11.91, 0.09, 123.6, 100),
    zoom: even(10.02, 10.17),
    caption: {
      corner: "tr",
      band: 15.82,
      bandOpacity: 1,
      tone: "light",
      angle: 173.96,
    },
  },
  io13: {
    id: "io13",
    artist: INGRID,
    subject: "Calculus",
    category: "objects",
    src: img("io-calculus"),
    aspect: 461 / 273,
    crop: crop(-2.13, 0, 104.34, 306.27),
    zoom: even(4.03, 3.9),
    caption: {
      corner: "br",
      band: 32.97,
      bandOpacity: 0.8,
      tone: "light",
      angle: 175.49,
    },
  },
  io14: {
    id: "io14",
    artist: INGRID,
    subject: "Calculus",
    category: "objects",
    src: img("io-calculus"),
    aspect: 461 / 273,
    crop: crop(-4.36, -103.17, 104.34, 306.27),
    zoom: even(4.4, 4.56),
    caption: {
      corner: "tl",
      band: 32.97,
      bandOpacity: 1,
      tone: "light",
      angle: 175.49,
    },
  },
  so1: {
    id: "so1",
    artist: ONGTAO,
    subject: "Theology",
    category: "abstract",
    src: img("so-tree"),
    aspect: 415 / 584,
    crop: "cover",
    zoom: [11.99, 8.19, 4.62, 8.19],
    caption: {
      corner: "tl",
      band: 20.55,
      bandOpacity: 0.8,
      tone: "light",
      angle: 173.33,
    },
  },
  so2: {
    id: "so2",
    artist: ONGTAO,
    subject: "Theology",
    category: "abstract",
    src: img("so-marker-bleed"),
    aspect: 407 / 584,
    crop: "cover",
    zoom: [6.51, 5.16, 3.94, 5.16],
    caption: {
      corner: "bl",
      band: 20.55,
      bandOpacity: 0.8,
      tone: "light",
      angle: 173.2,
    },
  },
  so3: {
    id: "so3",
    artist: ONGTAO,
    subject: "Theology",
    category: "persons",
    src: img("so-individualism"),
    aspect: 489 / 685,
    crop: crop(-2.75, 0, 105.73, 100),
    zoom: even(3.65, 3.68),
    caption: {
      corner: "br",
      band: 17.52,
      bandOpacity: 0.8,
      tone: "light",
      angle: 174.33,
    },
  },
  so4: {
    id: "so4",
    artist: ONGTAO,
    subject: "Art App",
    category: "objects",
    src: img("so-whiteflower"),
    aspect: 385 / 569,
    crop: "cover",
    zoom: [3.87, 3.38, 4.92, 4.94],
    caption: {
      corner: "tr",
      band: 21.09,
      bandOpacity: 0.8,
      tone: "light",
      angle: 172.82,
    },
  },
  ja1: {
    id: "ja1",
    artist: JUNE,
    subject: "Social Science",
    category: "persons",
    src: img("ja-socsci"),
    aspect: 303 / 687,
    crop: crop(0, -44.76, 181.01, 144.76),
    zoom: even(3.93, 3.96),
    caption: {
      corner: "bl",
      band: 17.47,
      bandOpacity: 0.8,
      tone: "light",
      angle: 170.9,
    },
  },
  ja2: {
    id: "ja2",
    artist: JUNE,
    subject: "Statistics",
    category: "persons",
    src: img("ja-stats-portrait"),
    aspect: 302 / 452,
    crop: crop(-6.3, -2.94, 106.3, 102.98),
    zoom: [0, 21.85, 21.68, 0],
    caption: {
      corner: "bl",
      band: 26.55,
      bandOpacity: 0.8,
      tone: "light",
      angle: 170.87,
    },
  },
  ja3: {
    id: "ja3",
    artist: JUNE,
    subject: "Statistics",
    category: "persons",
    src: img("ja-stats-figures"),
    aspect: 637 / 655,
    crop: crop(-0.02, -1.85, 104.18, 101.85),
    zoom: [9.47, 6.91, 4.43, 6.91],
    caption: {
      corner: "br",
      band: 18.32,
      bandOpacity: 0.8,
      tone: "light",
      angle: 175.64,
    },
  },
  ja4: {
    id: "ja4",
    artist: JUNE,
    subject: "Theology",
    category: "persons",
    src: img("ja-image-of-god"),
    aspect: 629 / 927,
    crop: "cover",
    zoom: [7.55, 4.61, 7.55, 10.49],
    caption: {
      corner: "br",
      band: 12.94,
      bandOpacity: 0.8,
      tone: "light",
      angle: 175.59,
    },
  },
  ja5: {
    id: "ja5",
    artist: JUNE,
    subject: "Statistics",
    category: "persons",
    src: img("ja-stats-sketch"),
    aspect: 629 / 664,
    crop: crop(-17.94, -24.85, 122.23, 154.51),
    zoom: [13.25, 13.35, 0, 0],
    caption: {
      corner: "br",
      band: 13.55,
      bandOpacity: 1,
      tone: "light",
      angle: 176.69,
    },
  },
  ja6: {
    id: "ja6",
    artist: JUNE,
    subject: "Statistics",
    category: "persons",
    src: img("ja-stats-group"),
    aspect: 629 / 439,
    crop: crop(0, -3.6, 103.8, 103.64),
    zoom: [4.33, 9.54, 9.57, 4.29],
    caption: {
      corner: "bl",
      band: 27.56,
      bandOpacity: 0.8,
      tone: "light",
      angle: 175.55,
    },
  },
  ja7: {
    id: "ja7",
    artist: JUNE,
    subject: "Enlit",
    category: "calligraphy",
    src: img("ja-calligraphy-1"),
    aspect: 652 / 478,
    crop: crop(-2.72, -0.84, 104.51, 100.84),
    zoom: [2.51, 1.07, 2.51, 3.83],
    caption: {
      corner: "tr",
      band: 25.1,
      bandOpacity: 0.8,
      tone: "light",
      angle: 175.74,
    },
  },
  ja8: {
    id: "ja8",
    artist: JUNE,
    subject: "Enlit",
    category: "calligraphy",
    src: img("ja-calligraphy-2"),
    aspect: 572 / 478,
    crop: crop(-0.05, -2.14, 100.09, 102.14),
    zoom: [2.51, 4.9, 2.51, 0],
    caption: {
      corner: "br",
      band: 25.1,
      bandOpacity: 0.8,
      tone: "light",
      angle: 175.15,
    },
  },
  jm1: {
    id: "jm1",
    artist: JULIA,
    subject: "Social Science",
    category: "persons",
    src: img("jm-socsci"),
    aspect: 437 / 685,
    crop: "cover",
    zoom: even(2.34, 2.29),
    caption: {
      corner: "bl",
      band: 17.52,
      bandOpacity: 0.8,
      tone: "light",
      angle: 173.66,
    },
  },
  jm2: {
    id: "jm2",
    artist: JULIA,
    subject: "History",
    category: "persons",
    src: img("jm-history"),
    aspect: 637 / 784,
    crop: crop(0, -1.58, 100, 103.29),
    zoom: [7.91, 3.92, 0, 3.92],
    caption: {
      corner: "br",
      band: 15.3,
      bandOpacity: 0.2,
      tone: "dark",
      angle: 175.64,
    },
  },
  ec1: {
    id: "ec1",
    artist: ENRICO,
    subject: "Calculus",
    category: "persons",
    src: img("ec-calculus"),
    aspect: 637 / 301,
    crop: crop(-22.89, -0.03, 122.89, 146.54),
    zoom: [7.64, 5.34, 5.32, 7.69],
    caption: {
      corner: "bl",
      band: 39.87,
      bandOpacity: 0.2,
      tone: "dark",
      angle: 175.64,
      offset: 13.97,
    },
  },
  ls1: {
    id: "ls1",
    artist: LIZ,
    subject: "DLQ",
    category: "abstract",
    src: img("ls-dlq"),
    aspect: 403 / 584,
    crop: crop(0, -1.44, 100, 101.49),
    zoom: even(7.88, 7.69),
    caption: {
      corner: "tr",
      band: 20.55,
      bandOpacity: 0.2,
      tone: "dark",
      angle: 173.13,
    },
  },
  ls2: {
    id: "ls2",
    artist: LIZ,
    subject: "Web Design",
    category: "persons",
    src: img("ls-web-design"),
    aspect: 310 / 452,
    crop: crop(-5.81, -0.08, 105.81, 100.15),
    zoom: [0, 0, 11.73, 11.61],
    caption: {
      corner: "tl",
      band: 26.55,
      bandOpacity: 0.2,
      tone: "dark",
      angle: 171.1,
    },
  },
};

/** A card's place on a gallery page, in Figma px (1440-wide frame). */
export type Placement = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type GalleryPage = {
  title: string;
  /** Height of the grid area: from the navbar's bottom (y = 152) to the credits. */
  height: number;
  cards: Placement[];
};

const NAVBAR = 152;
const page = (
  title: string,
  creditsY: number,
  cards: [id: string, x: number, y: number, w: number, h: number][],
): GalleryPage => ({
  title,
  height: creditsY - NAVBAR,
  cards: cards.map(([id, x, y, w, h]) => ({ id, x, y: y - NAVBAR, w, h })),
});

/** "by Doodle" pages (Figma: [High] Doodles - …). */
export const CATEGORY_PAGES: Record<CategorySlug, GalleryPage> = {
  animals: page("Animals", 1868, [
    ["io1", 66, 194, 294, 511],
    ["io2", 401, 194, 294, 511],
    ["io3", 733, 194, 295.16, 511],
    ["io4", 1079, 194, 294, 511],
    ["io9", 66, 743, 640, 459],
    ["io8", 743, 743, 630, 1013],
    ["io10", 66, 1224, 306, 532],
    ["io11", 400, 1224, 306, 532],
  ]),
  persons: page("Persons", 3313, [
    ["so3", 70, 194, 489, 685],
    ["ja1", 598, 195, 303, 687],
    ["jm1", 933, 197, 437, 685],
    ["ja2", 70, 921, 302, 452],
    ["ls2", 397, 921, 310, 452],
    ["ja4", 741, 921, 629, 927],
    ["jm2", 70, 1410, 637, 784],
    ["ja5", 741, 1888, 629, 664],
    ["ja3", 70, 2231, 637, 655],
    ["ja6", 741, 2579, 629, 439],
    ["ec1", 77, 2925, 637, 301],
  ]),
  objects: page("Objects", 940, [
    ["so4", 70, 195, 385, 569],
    ["io12", 507, 195, 344, 569],
    ["io13", 909, 195, 461, 273],
    ["io14", 909, 491, 461, 273],
  ]),
  abstract: page("Abstract", 940, [
    ["ls1", 70, 195, 403, 584],
    ["so1", 510, 195, 415, 584],
    ["so2", 963, 195, 407, 584],
  ]),
  calligraphy: page("Calligraphy", 940, [
    ["ja7", 70, 195, 652, 478],
    ["ja8", 798, 195, 572, 478],
  ]),
};

/** "by Subject" pages (Figma: [High] Subject - …). */
export const SUBJECT_PAGES: Record<SubjectSlug, GalleryPage> = {
  theology: page("Theology", 1838, [
    ["ja4", 63, 195, 527, 777],
    ["io12", 616, 195, 333, 550],
    ["so1", 979, 195, 391, 550],
    ["so2", 616, 765, 422, 605],
    ["so3", 63, 996, 528, 739],
  ]),
  statistics: page("Statistics", 1536, [
    ["io2", 70, 192, 294, 511],
    ["ja2", 390, 192, 341, 511],
    ["ja6", 758, 192, 612, 427],
    ["ja3", 758, 645, 610, 627],
    ["ja5", 70, 736, 661, 698],
  ]),
  calculus: page("Calculus", 1052, [
    ["io9", 63, 192, 640, 459],
    ["ec1", 733, 192, 637, 301],
    ["io13", 733, 533, 461, 273],
    ["io14", 63, 704, 461, 273],
  ]),
  "organic-chemistry": page("Organic Chemistry", 1328, [
    ["io4", 70, 192, 306, 532],
    ["io10", 403, 192, 306, 532],
    ["io11", 736, 192, 306, 532],
    ["io3", 1069, 192, 307, 532],
    ["io1", 70, 756, 306, 532],
  ]),
  "social-science": page("Social Science", 940, [
    ["ja1", 70, 192, 303, 687],
    ["jm1", 428, 194, 437, 685],
  ]),
};
