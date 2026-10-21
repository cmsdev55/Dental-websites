"use client";

import { ArrowLeft, ArrowRight, Quote, Star, UserRound } from "lucide-react";
import { AnimatePresence, animate, m, useMotionValue, useTransform, type Variants } from "motion/react";
import { useState } from "react";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { EASE_EXPO_OUT, springSnappy } from "@/lib/animations";
import { sampleReviews } from "@/lib/content";
import type { Practice } from "@/lib/practices";
import { formatCount } from "@/lib/utils";

const colors = ["var(--pop-pink)", "var(--pop-sky)", "var(--pop-sun)", "var(--pop-mint)", "var(--pop-sky)"];
const tilts = [-2, 3, -4];
const mod = (n: number, m: number) => ((n % m) + m) % m;

type Exit = { kind: "next" | "prev"; dir: number };

const deck: Variants = {
  exit: ({ kind, dir }: Exit) =>
    kind === "next"
      ? { x: dir * 640, rotate: dir * 24, opacity: 0, transition: { duration: 0.55, ease: EASE_EXPO_OUT } }
      : { scale: 0.8, opacity: 0, transition: { duration: 0.3 } },
};

function heading(p: Practice): string {
  if (p.rating !== undefined && p.reviews !== undefined)
    return `${p.rating.toFixed(1)} stars from ${formatCount(p.reviews)} *happy reviews.*`;
  if (p.rating !== undefined) return `Rated ${p.rating.toFixed(1)} by *real patients.*`;
  if (p.reviews !== undefined) return `${formatCount(p.reviews)} reviews *and counting.*`;
  return "Kind words from *patients.*";
}

/** A deck of sample reviews: fling the top card away (or use the buttons) to reveal the next. */
export function ReviewStack({ practice }: { practice: Practice }) {
  const count = sampleReviews.length;
  const [index, setIndex] = useState(0);
  const [exit, setExit] = useState<Exit>({ kind: "next", dir: -1 });

  const next = (dir = -1) => {
    setExit({ kind: "next", dir });
    setIndex((i) => mod(i + 1, count));
  };
  const previous = () => {
    setExit({ kind: "prev", dir: 1 });
    setIndex((i) => mod(i - 1, count));
  };

  return (
    <section id="reviews" aria-labelledby="studio-reviews-title" className="section-y overflow-hidden">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal as="p" className="eyebrow text-accent-deep">
            Reviews
          </Reveal>
          <RevealText
            accentItalic={false}
            id="studio-reviews-title"
            text={heading(practice)}
            className="font-display mt-4 text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.95] font-extrabold tracking-[-0.04em]"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-lg text-muted">Swipe the card away, or use the arrows, to read the next one.</p>
            <PlaceholderBadge className="mt-6">Sample &ndash; your Google reviews will appear here</PlaceholderBadge>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Patient reviews"
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") next();
              if (event.key === "ArrowLeft") previous();
            }}
          >
            <div className="mx-auto grid max-w-xl pt-4 pb-8">
              <AnimatePresence initial={false} custom={exit}>
                {[2, 1, 0].map((depth) => {
                  const review = mod(index + depth, count);
                  return <Card key={review} review={review} depth={depth} onFling={next} />;
                })}
              </AnimatePresence>
            </div>

            <p className="sr-only" aria-live="polite">{`Review ${index + 1} of ${count}`}</p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={previous}
                aria-label="Previous review"
                className="grid size-12 place-items-center rounded-full border-2 border-ink transition-transform hover:-translate-x-0.5"
              >
                <ArrowLeft aria-hidden="true" className="size-5" />
              </button>
              <span className="min-w-[6ch] text-center font-display text-sm font-bold tabular-nums">
                {index + 1} / {count}
              </span>
              <button
                type="button"
                onClick={() => next()}
                aria-label="Next review"
                className="grid size-12 place-items-center rounded-full bg-primary text-primary-ink transition-transform hover:translate-x-0.5"
              >
                <ArrowRight aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Card({ review, depth, onFling }: { review: number; depth: number; onFling: (dir: number) => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 260], [-16, 16]);
  const top = depth === 0;

  return (
    <m.div
      className="col-start-1 row-start-1"
      style={{ zIndex: 10 - depth }}
      variants={deck}
      initial={{ scale: 0.84, y: 48, opacity: 0, rotate: tilts[depth] }}
      animate={{ scale: 1 - depth * 0.05, y: depth * 20, opacity: 1, rotate: top ? 0 : tilts[depth] }}
      exit="exit"
      transition={springSnappy}
      aria-hidden={!top}
    >
      <m.figure
        drag={top ? "x" : false}
        dragMomentum={false}
        style={{ x, rotate, background: colors[review] }}
        onDragEnd={(_, info) => {
          const dir = Math.sign(info.offset.x) || -1;
          if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 550) onFling(dir);
          else animate(x, 0, springSnappy);
        }}
        className="flex min-h-[22rem] cursor-grab touch-pan-y flex-col rounded-[var(--radius-card)] p-7 text-ink shadow-[0_24px_50px_-28px_rgb(0_0_0/0.5)] select-none active:cursor-grabbing md:p-10"
      >
        <div className="flex items-center justify-between">
          <Quote aria-hidden="true" className="size-9" strokeWidth={2} />
          <span className="rounded-full border-2 border-dashed border-ink/40 px-3 py-1 text-xs font-bold">
            Sample review
          </span>
        </div>
        <blockquote className="mt-6 font-display text-[clamp(1.35rem,2.6vw,1.9rem)] leading-snug font-bold tracking-tight">
          &ldquo;{sampleReviews[review]}&rdquo;
        </blockquote>
        <figcaption className="mt-auto flex items-center gap-3 pt-8">
          <span className="grid size-11 place-items-center rounded-full bg-card">
            <UserRound aria-hidden="true" className="size-5" />
          </span>
          <span>
            <span className="block font-semibold">Patient name</span>
            <span aria-hidden="true" className="mt-0.5 flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
            </span>
          </span>
        </figcaption>
      </m.figure>
    </m.div>
  );
}
