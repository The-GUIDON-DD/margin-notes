/**
 * Hand-drawn "bubble" outlines.
 *
 * Every bubble gets a wobbly closed path generated from a seed (its label), so
 * shapes are stable between renders but no two bubbles look alike. Paths for
 * the same point count share an identical command structure, which lets CSS
 * transition `d` between a resting and a hover shape.
 */

const VIEW_W = 200;
const VIEW_H = 80;
const POINTS = 10;

export const BLOB_VIEWBOX = `0 0 ${VIEW_W} ${VIEW_H}`;

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — tiny deterministic PRNG. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * `variant` reshuffles only the radii, keeping each point at the same angle,
 * so the rest → hover morph wobbles in place instead of twisting.
 */
export function blobPath(seed: string, variant = "", wobble = 0.05): string {
  const rand = rng(hash(seed));
  const radius = rng(hash(`${seed}:${variant}`));
  const cx = VIEW_W / 2;
  const cy = VIEW_H / 2;
  // Squarer than an ellipse so long labels still have room at the ends.
  const rx = VIEW_W / 2 - 3;
  const ry = VIEW_H / 2 - 3;
  const start = rand() * Math.PI * 2;

  const pts: [number, number][] = [];
  for (let i = 0; i < POINTS; i++) {
    const t = start + (i / POINTS) * Math.PI * 2 + (rand() - 0.5) * 0.25;
    const k = 1 - radius() * wobble * 2;
    // Superellipse (n≈3) for the rounded-rectangle feel of the mockup.
    const cos = Math.cos(t);
    const sin = Math.sin(t);
    const x = Math.sign(cos) * Math.abs(cos) ** (2 / 3);
    const y = Math.sign(sin) * Math.abs(sin) ** (2 / 3);
    pts.push([cx + x * rx * k, cy + y * ry * k]);
  }

  // Closed Catmull-Rom spline → cubic Béziers.
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < POINTS; i++) {
    const p0 = pts[(i - 1 + POINTS) % POINTS];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % POINTS];
    const p3 = pts[(i + 2) % POINTS];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${r1(c1x)} ${r1(c1y)} ${r1(c2x)} ${r1(c2y)} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return `${d}Z`;
}

/** Small, stable tilt in degrees (−range..range) for a seed. */
export function tiltFor(seed: string, range = 2): number {
  const rand = rng(hash(`${seed}:tilt`));
  return r1((rand() * 2 - 1) * range);
}
