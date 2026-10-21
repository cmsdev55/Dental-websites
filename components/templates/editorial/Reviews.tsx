"use client";

import { ChevronLeft, ChevronRight, Pause, Play, Quote, UserRound } from "lucide-react";
import { AnimatePresence, m, useInView, type Variants } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Stars } from "@/components/ui/Stars";
import { EASE_EXPO_OUT, EASE_IN_OUT } from "@/lib/animations";
import { sampleReviews } from "@/lib/content";
import type { Practice } from "@/lib/practices";
import { formatCount } from "@/lib/utils";

const AUTOPLAY_MS = 6500;

const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, scale: 0.94, x: dir * 70 }),
  center: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.8, ease: EASE_EXPO_OUT } },
  exit: (dir: number) => ({ opacity: 0, scale: 0.96, x: dir * -70, transition: { duration: 0.4, ease: EASE_IN_OUT } }),
};

function heading(p: Practice): string {
  if (p.rating !== undefined && p.reviews !== undefined)
    return `Rated ${p.rating.toFixed(1)} across ${formatCount(p.reviews)} *reviews.*`;
  if (p.rating !== undefined) return `Rated ${p.rating.toFixed(1)} by *patients.*`;
  if (p.reviews !== undefined) return `${formatCount(p.reviews)} reviews *and counting.*`;
  return "Kind words from *patients.*";
}

export function Reviews({ practice }: { practice: Practice }) {
  const count = sampleReviews.length;
  const [[index, direction], setSlide] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const region = useRef<HTMLDivElement>(null);
  const inView = useInView(region, { amount: 0.4 });
  const playing = !paused && !hovering && inView;

  // Respect reduced motion: no autoplay until the visitor presses play.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  const go = useCallback(
    (delta: number) => setSlide(([current]) => [(current + delta + count) % count, Math.sign(delta) || 1]),
    [count],
  );

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, index, go]);

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section-y overflow-hidden">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal as="p" className="eyebrow text-accent-deep">
              Reviews
            </Reveal>
            <RevealText
              id="reviews-title"
              text={heading(practice)}
              className="mt-4 max-w-3xl text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.02] font-light"
            />
          </div>
          <Reveal delay={0.2}>
            <PlaceholderBadge>Sample &ndash; your Google reviews will appear here</PlaceholderBadge>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-12 md:mt-16">
          <div
            ref={region}
            role="region"
            aria-roledescription="carousel"
            aria-label="Patient reviews"
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => setHovering(false)}
            onFocusCapture={() => setHovering(true)}
            onBlurCapture={() => setHovering(false)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") go(1);
              if (event.key === "ArrowLeft") go(-1);
            }}
          >
            <div className="grid" aria-live={playing ? "off" : "polite"}>
              <AnimatePresence initial={false} custom={direction}>
                <m.figure
                  key={index}
                  custom={direction}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.45}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70 || info.velocity.x < -450) go(1);
                    else if (info.offset.x > 70 || info.velocity.x > 450) go(-1);
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  className="col-start-1 row-start-1 cursor-grab rounded-[2rem] border border-line bg-card p-8 select-none active:cursor-grabbing md:p-14"
                >
                  <div className="flex items-center justify-between">
                    <Quote aria-hidden="true" className="size-10 text-accent" strokeWidth={1.25} />
                    <span className="rounded-full border border-dashed border-[color-mix(in_oklab,var(--ink)_30%,transparent)] px-3 py-1 text-xs font-medium">
                      Sample review
                    </span>
                  </div>
                  <blockquote className="mt-8 font-display text-[clamp(1.5rem,3.2vw,2.6rem)] leading-[1.2] font-light tracking-tight">
                    &ldquo;{sampleReviews[index]}&rdquo;
                  </blockquote>
                  <figcaption className="mt-10 flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-muted">
                      <UserRound aria-hidden="true" className="size-5" />
                    </span>
                    <span>
                      <span className="block font-medium">Patient name</span>
                      <Stars value={5} className="mt-1 text-sm" />
                    </span>
                  </figcaption>
                </m.figure>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                {sampleReviews.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => go(i - index)}
                    aria-label={`Show review ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className="group grid h-11 place-items-center px-1"
                  >
                    <span
                      className="relative block h-1 w-10 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--ink)_15%,transparent)] transition-transform duration-500 group-hover:scale-y-150"
                    >
                      {i === index && (
                        <m.span
                          key={`${index}-${playing}`}
                          className="absolute inset-0 origin-left bg-accent-deep"
                          initial={{ scaleX: playing ? 0 : 1 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: playing ? AUTOPLAY_MS / 1000 : 0, ease: "linear" }}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? "Play reviews" : "Pause reviews"}
                  className="grid size-12 place-items-center rounded-full border border-line transition-colors hover:border-ink"
                >
                  {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous review"
                  className="grid size-12 place-items-center rounded-full border border-line transition-colors hover:border-ink"
                >
                  <ChevronLeft aria-hidden="true" className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next review"
                  className="grid size-12 place-items-center rounded-full bg-primary text-primary-ink transition-transform hover:scale-105"
                >
                  <ChevronRight aria-hidden="true" className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
