import { Phone, Star } from "lucide-react";
import { Fragment } from "react";
import { BubbleCanvas } from "@/components/templates/studio/BubbleCanvas";
import { ButtonArrow, buttonClasses } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { Practice } from "@/lib/practices";
import { cn, formatCount, telHref } from "@/lib/utils";

const vars = (v: Record<string, string | number>) => v as React.CSSProperties;

/**
 * Bold, playful hero. The headline is server-rendered and animated with CSS (keyed to the preloader),
 * so it paints without waiting for JavaScript. The bubble simulation is the only client piece.
 */
export function StudioHero({ practice }: { practice: Practice }) {
  const words: { text: string; scribble?: boolean; accent?: boolean }[] = [
    { text: "Big," },
    { text: "bright" },
    { text: "smiles", scribble: true },
    { text: "start" },
    { text: "in" },
    ...practice.city.split(/\s+/).map((text, i, all) => ({
      text: i === all.length - 1 ? `${text}.` : text,
      accent: true,
    })),
  ];

  return (
    <section id="top" aria-labelledby="studio-hero-title" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container-page grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p
            className="studio-rise inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium"
            style={vars({ "--d": "0s" })}
          >
            <span aria-hidden="true" className="size-2 rounded-full bg-[var(--pop-mint)] ring-4 ring-[var(--pop-mint)]/30" />
            Dentist in {practice.city}, {practice.state}
          </p>

          <h1
            id="studio-hero-title"
            className="mt-6 font-display text-[clamp(3.1rem,8.6vw,7.6rem)] leading-[0.9] font-extrabold tracking-[-0.045em]"
          >
            <span className="sr-only">Big, bright smiles start in {practice.city}.</span>
            <span aria-hidden="true">
              {words.map((word, i) => (
                <Fragment key={i}>
                  <span className="relative inline-block">
                    <span className="reveal-mask">
                      <span
                        className={cn("studio-word", word.accent && "text-accent-deep")}
                        style={vars({ "--i": i })}
                      >
                        {word.text}
                      </span>
                    </span>
                    {word.scribble && (
                      <svg
                        viewBox="0 0 300 30"
                        preserveAspectRatio="none"
                        className="pointer-events-none absolute -bottom-[0.12em] left-0 h-[0.28em] w-full text-[var(--pop-sun)]"
                      >
                        <path
                          className="studio-scribble"
                          pathLength={1}
                          d="M4 20 C 60 6, 120 4, 170 12 S 260 24, 296 8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="9"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </span>
                  {i < words.length - 1 && " "}
                </Fragment>
              ))}
            </span>
          </h1>

          <p
            className="studio-rise mt-7 max-w-xl text-lg leading-relaxed text-muted md:text-xl"
            style={vars({ "--d": "0.45s" })}
          >
            {practice.name} makes every visit easy, unhurried and genuinely friendly, from first checkup to your
            brightest smile yet.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <span className="studio-rise" style={vars({ "--d": "0.6s" })}>
              <MagneticButton>
                <a href="#booking" className={buttonClasses("primary", "min-h-14 px-7 text-base")}>
                  Book a visit <ButtonArrow />
                </a>
              </MagneticButton>
            </span>
            <span className="studio-rise" style={vars({ "--d": "0.7s" })}>
              <a
                href={telHref(practice.phone)}
                className={buttonClasses("outline", "min-h-14 border-2 border-ink px-6 text-base")}
                aria-label={`Call ${practice.name} at ${practice.phone}`}
              >
                <Phone aria-hidden="true" className="size-4" />
                {practice.phone}
              </a>
            </span>
          </div>
        </div>

        <div className="order-first lg:order-none lg:col-span-5">
          <div
            className="relative aspect-[5/4] touch-pan-y overflow-hidden rounded-[var(--radius-media)] border border-line bg-[radial-gradient(circle_at_20%_15%,color-mix(in_oklab,var(--pop-sky)_70%,white)_0%,transparent_45%),radial-gradient(circle_at_85%_30%,color-mix(in_oklab,var(--pop-pink)_65%,white)_0%,transparent_45%),radial-gradient(circle_at_50%_95%,color-mix(in_oklab,var(--pop-mint)_75%,white)_0%,transparent_55%),linear-gradient(160deg,#fff,#f4f1ea)] lg:aspect-[4/5]"
            data-cursor="hover"
          >
            <BubbleCanvas className="absolute inset-0 size-full" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-card/80 px-3 py-1 text-xs font-medium whitespace-nowrap text-muted backdrop-blur"
            >
              Psst. Tap a bubble.
            </span>
          </div>

          {/* Stickers. Only non-factual phrases, plus the rating when the practice has one. */}
          <ul className="relative -mt-6 flex flex-wrap justify-center gap-2 px-2 lg:-mt-8 lg:justify-start">
            <li
              className="studio-sticker rounded-full bg-[var(--pop-sun)] px-4 py-2 text-sm font-bold shadow-[0_8px_20px_-10px_rgb(0_0_0/0.35)] hover:animate-[studio-wiggle_0.5s_ease]"
              style={vars({ "--d": "0.85s", "--rot": "-6deg" })}
            >
              Gentle care ✦
            </li>
            <li
              className="studio-sticker rounded-full bg-[var(--pop-pink)] px-4 py-2 text-sm font-bold shadow-[0_8px_20px_-10px_rgb(0_0_0/0.35)] hover:animate-[studio-wiggle_0.5s_ease]"
              style={vars({ "--d": "0.95s", "--rot": "4deg" })}
            >
              New patients welcome
            </li>
            {practice.rating !== undefined && (
              <li
                className="studio-sticker inline-flex items-center gap-1.5 rounded-full bg-[var(--pop-sky)] px-4 py-2 text-sm font-bold shadow-[0_8px_20px_-10px_rgb(0_0_0/0.35)] hover:animate-[studio-wiggle_0.5s_ease]"
                style={vars({ "--d": "1.05s", "--rot": "-3deg" })}
              >
                <Star aria-hidden="true" className="size-4 fill-current" />
                {practice.rating.toFixed(1)}
                {practice.reviews !== undefined && (
                  <span className="font-medium">· {formatCount(practice.reviews)} reviews</span>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
