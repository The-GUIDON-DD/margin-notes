/**
 * Doodle layout for the "Title" collage (Figma: Title / Property 1=Variant9, node 5480:1017).
 *
 * All numbers are design pixels on the 1440 × 950 Figma canvas. They are scaled at
 * runtime with the `--u` CSS unit (see app.css) so the collage keeps its proportions.
 *
 * `step` mirrors the prototype's Title variants (2 → 9): each step is one variant in
 * which the doodle first appears. Array order is the Figma paint order (bottom → top).
 */

export type Crop = {
  /** Image offset / size as a percentage of the crop box (Figma image fill crop). */
  left: number;
  top: number;
  width: number;
  height: number;
};

export type Doodle = {
  id: string;
  label: string;
  src: string;
  step: number;
  /** Outer box on the design canvas. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Image crop inside the box; omitted means `object-fit: cover` on the whole box. */
  crop?: Crop;
  /** Rotated inner box, centered in the outer box (Figma rotated layers). */
  inner?: { w: number; h: number; transform: string };
  /** Transform applied to the whole (unrotated) box. */
  transform?: string;
  opacity?: number;
};

const SPRITES = "/landing/doodle-sprites.png";
const ROSE_EYE = "/landing/rose-eye.png";

export const doodles: Doodle[] = [
  {
    id: "duhalation",
    label: "Sketch of a tree spirit and the word Duhalation",
    src: "/landing/duhalation.png",
    step: 4,
    x: 1077,
    y: 0,
    w: 364,
    h: 962,
    crop: { left: -0.05, top: -2.08, width: 100.1, height: 102.08 },
  },
  {
    id: "biochem",
    label: "Pencil dragon above biochemistry notes",
    src: "/landing/biochem-dragon.png",
    step: 5,
    x: -174,
    y: 523,
    w: 672,
    h: 464,
    crop: { left: -0.03, top: -5.96, width: 100.06, height: 105.96 },
  },
  {
    id: "figures",
    label: "Line drawings of cartoon figures",
    src: "/landing/figures.png",
    step: 7,
    x: 471,
    y: 672,
    w: 543,
    h: 278,
    crop: { left: -106.73, top: -190.2, width: 213.27, height: 290.25 },
  },
  {
    id: "monty",
    label: "Sketch captioned have some Monty-vation",
    src: "/landing/monty.png",
    step: 2,
    x: 127,
    y: 194,
    w: 353,
    h: 478,
    crop: { left: -140.52, top: -0.04, width: 240.55, height: 100.08 },
  },
  {
    id: "rose",
    label: "Red ink rose",
    src: ROSE_EYE,
    step: 2,
    x: 1003,
    y: 769,
    w: 189,
    h: 291,
    crop: { left: -330.16, top: -186.94, width: 429.89, height: 354.81 },
  },
  {
    id: "eye",
    label: "Colourful marker eye",
    src: ROSE_EYE,
    step: 6,
    x: 32,
    y: -34,
    w: 189,
    h: 291,
    transform: "rotate(180deg) scale(1, -1)",
    crop: { left: 0.06, top: -127.32, width: 429.89, height: 354.81 },
  },
  {
    id: "theo",
    label: "Theology notes on individualism",
    src: "/landing/theo-individualism.png",
    step: 3,
    x: 497,
    y: 94,
    w: 542,
    h: 269,
    crop: { left: -0.07, top: -26.14, width: 100.13, height: 267.61 },
  },
  {
    id: "heart",
    label: "",
    src: "/landing/heart.png",
    step: 9,
    x: 15,
    y: 314,
    w: 147.13,
    h: 152.63,
    inner: { w: 113, h: 122, transform: "rotate(-19.42deg)" },
  },
  {
    id: "heart-small",
    label: "",
    src: "/landing/heart.png",
    step: 9,
    x: 88.99,
    y: 405,
    w: 68.64,
    h: 70.07,
    inner: { w: 48.82, h: 52.72, transform: "rotate(30deg)" },
  },
  {
    id: "crown",
    label: "",
    src: SPRITES,
    step: 9,
    x: 272,
    y: 127,
    w: 83,
    h: 84,
    opacity: 0.8,
    crop: { left: -214.49, top: 0, width: 886.96, height: 874.29 },
  },
  {
    id: "firework",
    label: "",
    src: SPRITES,
    step: 9,
    x: 355,
    y: 49,
    w: 94,
    h: 90.84,
    opacity: 0.7,
    inner: { w: 71.97, h: 63.35, transform: "rotate(-30deg) scale(-1, 1)" },
    crop: { left: -217.25, top: -320.06, width: 545.67, height: 618.45 },
  },
  {
    id: "star",
    label: "",
    src: SPRITES,
    step: 9,
    x: 1378,
    y: 713,
    w: 83,
    h: 84,
    opacity: 0.8,
    crop: { left: -114.29, top: -699.41, width: 886.96, height: 874.29 },
  },
  {
    id: "flower",
    label: "",
    src: "/landing/flower.png",
    step: 9,
    x: 411,
    y: 847,
    w: 76.07,
    h: 81.1,
    opacity: 0.7,
    inner: { w: 66, h: 72, transform: "rotate(-8.64deg)" },
    crop: { left: -398.77, top: -36.36, width: 913.58, height: 560.23 },
  },
  {
    id: "sparks",
    label: "",
    src: "/landing/sparks.png",
    step: 9,
    x: 857,
    y: 257,
    w: 189,
    h: 189,
  },
  {
    id: "arrow-left",
    label: "",
    src: SPRITES,
    step: 9,
    x: 408,
    y: 501,
    w: 140.3,
    h: 140.3,
    opacity: 0.7,
    inner: { w: 102.44, h: 95.98, transform: "rotate(45deg)" },
    crop: { left: -145.87, top: -131.81, width: 718.65, height: 765.16 },
  },
];

/** "image 26" — the curved arrow to the right of the CTA; painted above the CTA. */
export const arrowRight: Doodle = {
  id: "arrow-right",
  label: "",
  src: SPRITES,
  step: 9,
  x: 909.94,
  y: 539.03,
  w: 102.53,
  h: 107.25,
  opacity: 0.7,
  inner: { w: 112.25, h: 36.23, transform: "rotate(47.51deg) scale(-1, 1)" },
  crop: { left: -551.31, top: -887.88, width: 655.86, height: 2027.08 },
};
