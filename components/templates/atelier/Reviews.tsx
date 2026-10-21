"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { AnimatePresence, m, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EYEBROW, Ornament } from "@/components/templates/atelier/ui";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { EASE_EXPO_OUT, EASE_IN_OUT } from "@/lib/animations";
import { sampleReviews } from "@/lib/content";
import type { Practice } from "@/lib/practices";
import { cn, formatCount } from "@/lib/utils";

const AUTOPLAY_MS = 7000;

function heading(p: Practice): string {
  if (p.rating !== undefined && p.reviews !== undefined)
    return `Rated ${p.rating.toFixed(1)} across ${formatCount(p.reviews)} *reviews.*`;
  if (p.rating !== undefined) return `Rated ${p.rating.toFixed(1)} by *patients.*`;
  if (p.reviews !== undefined) return `${formatCount(p.reviews)} reviews *and counting.*`;
  return "Kind words from *patients.*";
}

/** One large italic quote at a time, crossfading. Autoplays only while visible (never with reduced motion). */
export function Reviews({ practice }: { practice: Practice }) {
  const count = sampleReviews.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const region = useRef<HTMLDivElement>(null);
  const inView = useInView(region, { amount: 0.4 });
  const playing = !paused && !holding && inView;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, index, go]);

  const control =
    "grid size-12 place-items-center rounded-full border border-line transition-colors duration-500 hover:border-ink";

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section-y overflow-hidden">
      <div className="container-page flex flex-col items-center text-center">
        <Reveal as="p" className={cn("text-accent-deep", EYEBROW)}>
          Reviews
        </Reveal>
        <RevealText
          id="reviews-title"
          text={heading(practice)}
          className="mt-5 max-w-4xl text-[clamp(2.4rem,5.4vw,4.75rem)] leading-[1] font-light tracking-[-0.01em]"
        />
        <Reveal delay={0.15} className="mt-7">
          <PlaceholderBadge>Sample &ndash; your Google reviews will appear here</PlaceholderBadge>
        </Reveal>

        <div
          ref={region}
          role="region"
          aria-roledescription="carousel"
          aria-label="Patient reviews"
          className="mt-14 w-full max-w-4xl md:mt-20"
          onPointerEnter={() => setHolding(true)}
          onPointerLeave={() => setHolding(false)}
          onFocusCapture={() => setHolding(true)}
          onBlurCapture={() => setHolding(false)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") go(1);
            if (event.key === "ArrowLeft") go(-1);
          }}
        >
          <Ornament className="mx-auto" />
          <div className="mt-10 grid min-h-[16rem] place-items-center md:min-h-[14rem]" aria-live={playing ? "off" : "polite"}>
            <AnimatePresence mode="wait" initial={false}>
              <m.figure
                key={index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: EASE_EXPO_OUT } }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.45, ease: EASE_IN_OUT } }}
              >
                <blockquote className="font-display text-[clamp(1.6rem,3.6vw,2.9rem)] leading-[1.25] font-light italic">
                  &ldquo;{sampleReviews[index]}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-center justify-center gap-3 text-sm">
                  <span className="font-medium">Patient name</span>
                  <span aria-hidden="true" className="h-px w-6 bg-[var(--gold)]" />
                  <span className="text-muted">Sample review</span>
                </figcaption>
              </m.figure>
            </AnimatePresence>
          </div>

          <div className="mt-12 flex items-center justify-center gap-3">
            <button type="button" onClick={() => go(-1)} aria-label="Previous review" className={control}>
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
            <p className={cn("w-24 tabular-nums", EYEBROW)} aria-hidden="true">
              0{index + 1} <span className="text-muted">/ 0{count}</span>
            </p>
            <button type="button" onClick={() => go(1)} aria-label="Next review" className={control}>
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play reviews" : "Pause reviews"}
              className={cn(control, "ml-3")}
            >
              {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
