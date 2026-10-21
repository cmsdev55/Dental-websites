"use client";

import { Pause, Play, Quote, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Stars } from "@/components/ui/Stars";
import { sampleReviews } from "@/lib/content";
import type { Practice } from "@/lib/practices";
import { cn, formatCount } from "@/lib/utils";

function heading(p: Practice): string {
  if (p.rating !== undefined && p.reviews !== undefined)
    return `Rated ${p.rating.toFixed(1)} across ${formatCount(p.reviews)} *reviews.*`;
  if (p.rating !== undefined) return `Rated ${p.rating.toFixed(1)} by *patients.*`;
  if (p.reviews !== undefined) return `${formatCount(p.reviews)} reviews *and counting.*`;
  return "Kind words from *patients.*";
}

// Each column starts at a different review so neighbouring cards never match.
const columns = [
  { start: 0, duration: "46s", down: false, className: "" },
  { start: 2, duration: "54s", down: true, className: "hidden md:block" },
  { start: 4, duration: "50s", down: false, className: "hidden lg:block" },
];

/**
 * Three columns of sample reviews drifting endlessly (CSS transform loop), masked at the edges.
 * Pauses on hover/focus and via the pause button; reduced motion shows them still.
 */
export function Reviews({ practice }: { practice: Practice }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section-y overflow-hidden">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal as="p" className="eyebrow text-accent">
              Reviews
            </Reveal>
            <RevealText
              id="reviews-title"
              text={heading(practice)}
              className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,4.8vw,4rem)] leading-[1.04] font-light tracking-[-0.035em]"
              accentClassName="lumen-gradient-text"
            />
          </div>
          <Reveal delay={0.2} className="flex flex-wrap items-center gap-3">
            <PlaceholderBadge tone="dark">Sample &ndash; your Google reviews will appear here</PlaceholderBadge>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              aria-label={paused ? "Play moving reviews" : "Pause moving reviews"}
              className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:border-ink"
            >
              {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
            </button>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div
            className="lumen-reviews lumen-mask-y mt-12 grid h-[34rem] gap-4 overflow-hidden md:h-[40rem] md:grid-cols-2 lg:grid-cols-3"
            data-paused={paused}
          >
            {columns.map((column, c) => {
              const list = [...sampleReviews.slice(column.start), ...sampleReviews.slice(0, column.start)];
              return (
                <div key={c} className={column.className}>
                  <ul
                    className={cn("lumen-column space-y-4", column.down && "lumen-column--down")}
                    style={{ "--duration": column.duration } as React.CSSProperties}
                  >
                    {[...list, ...list].map((quote, i) => (
                      <li key={i} aria-hidden={i >= list.length || c > 0 ? true : undefined}>
                        <ReviewCard quote={quote} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ReviewCard({ quote }: { quote: string }) {
  return (
    <figure className="rounded-[var(--radius-card)] border border-line bg-card/70 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <Stars value={5} className="text-sm" />
        <span className="rounded-full border border-dashed border-[color-mix(in_oklab,var(--ink)_30%,transparent)] px-2.5 py-0.5 text-[0.7rem] font-medium">
          Sample review
        </span>
      </div>
      <blockquote className="mt-5 leading-relaxed text-ink/90">
        <Quote aria-hidden="true" className="mb-2 size-5 text-accent" strokeWidth={1.5} />
        {quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 text-sm">
        <span className="grid size-9 place-items-center rounded-full bg-white/5 text-muted">
          <UserRound aria-hidden="true" className="size-4" />
        </span>
        <span className="font-medium">Patient name</span>
      </figcaption>
    </figure>
  );
}
