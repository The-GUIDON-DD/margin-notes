import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { arrowRight, type Doodle, doodles } from "./doodles";
import {
  HandwritingDefs,
  HandwrittenParagraph,
  planHandwriting,
} from "./handwriting";

/** Design pixels → responsive length (see `--u` in app.css). */
const u = (n: number) => `calc(var(--u) * ${n})`;

/** Delay between prototype "variants" while the collage draws itself in. */
const STEP_MS = 380;
const FIRST_STEP = 2;

/** Inertial smooth scrolling (wheel + in-page anchors like "Scroll"). */
function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.08,
      anchors: { duration: 1.6, easing: (t) => 1 - (1 - t) ** 4 },
    });
    return () => lenis.destroy();
  }, []);
}

export function Landing() {
  useSmoothScroll();

  return (
    <main className="landing overflow-x-clip bg-paper text-ink">
      <Intro />
      <Collage />
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Intro (Figma: intro pt.1, intro pt.2, TGD, scroll)                          */
/* -------------------------------------------------------------------------- */

const introText: CSSProperties = {
  fontSize: u(42),
  lineHeight: u(56.45),
};

/** Intro copy, one entry per Figma text-path line. */
const INTRO_PT1 = [
  "somewhere between the formulas and the deadlines, there's always a little drawing. an eye, a",
  "dragon, your seatmate mid-lecture. nobody asked for it, and it was never meant to be seen.",
];
const INTRO_PT2 = [
  "notebooks get tossed or shoved into drawers, and the margins go with them. here are some we",
  "found. take a look around, then add one of your own.",
];

/* One pen writes both paragraphs in order (speed: PEN_SPEED in handwriting.tsx). */
const INTRO_PLAN = planHandwriting([INTRO_PT1, INTRO_PT2], {
  startMs: 300,
  pauseMs: 250,
});

const fadeInAfterWriting = (extraMs: number) =>
  ({ "--ink-delay": `${INTRO_PLAN.endMs + extraMs}ms` }) as CSSProperties;

function Intro() {
  return (
    <section
      className="flex flex-col items-center font-hand"
      style={{ minHeight: u(952), paddingTop: u(263), paddingBottom: u(111) }}
    >
      <div
        className="flex flex-col"
        style={{ width: `min(${u(805.33)}, 100% - 32px)` }}
      >
        <HandwritingDefs text={[...INTRO_PT1, ...INTRO_PT2].join("")} />

        <p
          className="handwritten"
          style={{ ...introText, maxWidth: u(784.23) }}
        >
          <HandwrittenParagraph plan={INTRO_PLAN.paragraphs[0]} />
        </p>

        <p
          className="handwritten"
          style={{ ...introText, marginTop: u(41.18), marginLeft: u(2) }}
        >
          <HandwrittenParagraph plan={INTRO_PLAN.paragraphs[1]} />
        </p>

        <p
          className="ink-in relative self-end"
          style={{
            ...fadeInAfterWriting(150),
            marginTop: u(22.11),
            marginRight: u(2.62),
            width: u(99.71),
            height: u(45),
          }}
        >
          <span
            className="absolute inset-y-0 left-0 whitespace-nowrap text-right"
            style={{ right: "5.73%", fontSize: u(42) }}
          >
            The Guidon
          </span>
          <img
            src="/landing/guidon-underline.svg"
            alt=""
            className="absolute max-w-none"
            style={{
              left: u(2.76),
              top: u(42.46),
              width: u(97.95),
              height: u(3.42),
            }}
          />
        </p>
      </div>

      <a
        href="#doodles"
        className="scroll-cue ink-in relative block"
        style={{
          ...fadeInAfterWriting(650),
          marginTop: u(155),
          width: u(58),
          height: u(101),
        }}
      >
        <img
          src="/landing/scroll-arrow.svg"
          alt=""
          className="scroll-arrow absolute max-w-none"
          style={{ left: u(19), top: u(-1), width: u(20), height: u(45.7) }}
        />
        <span
          className="absolute inset-x-0 bottom-0 text-center"
          style={{ top: u(56), fontSize: u(42), lineHeight: "normal" }}
        >
          Scroll
        </span>
      </a>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Collage (Figma: Title / Variant1 → Variant9 + background grid)             */
/* -------------------------------------------------------------------------- */

type RevealState = "idle" | "pending" | "shown";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen (e.g. reload mid-page): leave it fully drawn.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.5) return;

    setState("pending");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, state] as const;
}

const stepDelay = (step: number) =>
  ({
    "--reveal-delay": `${(step - FIRST_STEP) * STEP_MS}ms`,
  }) as CSSProperties;

function Collage() {
  const [ref, state] = useReveal();

  return (
    <section
      id="doodles"
      aria-labelledby="landing-title"
      className="relative overflow-hidden"
      style={{ height: u(950) }}
    >
      <div
        ref={ref}
        data-reveal={state}
        className="collage absolute top-0 left-1/2"
        style={{ width: u(1440), height: u(950), marginLeft: u(-720) }}
      >
        <GridPaper />

        <div className="absolute inset-0 overflow-hidden">
          {/* Figma paints the title text-path beneath the doodles. */}
          <h1
            id="landing-title"
            data-step
            className="absolute whitespace-nowrap text-center font-display"
            style={{
              ...stepDelay(8),
              left: u(486.5),
              top: u(432.43),
              width: u(483.41),
              fontSize: u(79),
              lineHeight: 1,
            }}
          >
            Margin Notes
          </h1>

          {doodles.map((d, i) => (
            <DoodleImage key={d.id} doodle={d} tilt={i % 2 ? 2.5 : -2.5} />
          ))}

          <a
            href="/gallery"
            data-step
            className="cta absolute block text-black"
            style={{
              ...stepDelay(8),
              left: u(614),
              top: u(539),
              width: u(214),
              height: u(59),
            }}
          >
            {/* Hover motion lives on this wrapper so it isn't slowed by the
                reveal transition delay on the link itself. */}
            <span className="cta-body absolute inset-0 block">
              <img
                src="/landing/cta-outline.svg"
                alt=""
                className="absolute max-w-none"
                style={{
                  left: u(-1),
                  top: u(-1),
                  width: u(216),
                  height: u(55.51),
                }}
              />
              <span
                className="absolute flex flex-col justify-center text-center font-hand"
                style={{
                  top: u(6.86),
                  right: u(50.03),
                  bottom: 0,
                  left: u(29.53),
                  fontSize: u(36),
                  lineHeight: "normal",
                }}
              >
                EXPLORE
              </span>
              <img
                src="/landing/cta-arrow.svg"
                alt=""
                className="cta-arrow absolute max-w-none"
                style={{
                  left: u(166.81),
                  top: u(21.65),
                  width: u(16.99),
                  height: u(15.77),
                }}
              />
            </span>
          </a>

          <DoodleImage doodle={arrowRight} tilt={-6} />
        </div>
      </div>
    </section>
  );
}

/** Figma "grid" mask groups: a fading grey gradient masked by graph paper. */
function GridPaper() {
  return (
    <>
      {[-29.11, 973.89].map((left) => {
        const maskSize = `${u(1067.09)} ${u(849.97)}`;
        const maskPosition = `${u(29.11)} ${u(267.64)}`;
        return (
          <div
            key={left}
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              left: u(left),
              top: u(-167.63),
              width: u(1109),
              height: u(1188),
              backgroundImage:
                "linear-gradient(to bottom, rgba(189,193,205,0) 0%, rgba(189,193,205,0.4) 50.402%)",
              maskImage: "url(/landing/grid.png)",
              maskMode: "alpha",
              maskRepeat: "no-repeat",
              maskSize,
              maskPosition,
              WebkitMaskImage: "url(/landing/grid.png)",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: maskSize,
              WebkitMaskPosition: maskPosition,
            }}
          />
        );
      })}
    </>
  );
}

/** Doodles smaller than this (in design px²) get a bigger hover pop. */
const SMALL_DOODLE_AREA = 40_000;

function DoodleImage({ doodle: d, tilt }: { doodle: Doodle; tilt: number }) {
  const hoverStyle = {
    "--tilt": `${tilt}deg`,
    "--hover-scale": d.w * d.h < SMALL_DOODLE_AREA ? 1.15 : 1.03,
  } as CSSProperties;

  const img = d.crop ? (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={d.src}
        alt={d.label}
        loading="lazy"
        decoding="async"
        className="absolute max-w-none"
        style={{
          left: `${d.crop.left}%`,
          top: `${d.crop.top}%`,
          width: `${d.crop.width}%`,
          height: `${d.crop.height}%`,
        }}
      />
    </div>
  ) : (
    <img
      src={d.src}
      alt={d.label}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 size-full max-w-none object-cover"
    />
  );

  return (
    <div
      data-step
      className="doodle absolute"
      style={{
        ...stepDelay(d.step),
        left: u(d.x),
        top: u(d.y),
        width: u(d.w),
        height: u(d.h),
      }}
    >
      <div className="doodle-hover absolute inset-0" style={hoverStyle}>
        {d.inner ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative flex-none"
              style={{
                width: u(d.inner.w),
                height: u(d.inner.h),
                transform: d.inner.transform,
                opacity: d.opacity,
              }}
            >
              {img}
            </div>
          </div>
        ) : (
          <div
            className="relative size-full"
            style={{ transform: d.transform, opacity: d.opacity }}
          >
            {img}
          </div>
        )}
      </div>
    </div>
  );
}
