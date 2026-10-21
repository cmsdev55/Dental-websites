import { Phone } from "lucide-react";
import { Fragment } from "react";
import { ButtonArrow, buttonClasses } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Stars } from "@/components/ui/Stars";
import type { Practice } from "@/lib/practices";
import { formatCount, hasRating, hasReviews, telHref } from "@/lib/utils";
import { GlowButton } from "./GlowButton";
import { ParticleField } from "./ParticleField";
import { ToothStage } from "./ToothStage";

const delay = (d: string) => ({ "--d": d }) as React.CSSProperties;

/**
 * Lumen hero: a dark stage with an aurora, star dust and a real-time 3D tooth.
 * The text entrance is pure CSS keyed to the preloader, so the headline (the LCP) never waits for JS.
 */
export function Hero({ practice }: { practice: Practice }) {
  const cityWords = practice.city.split(/\s+/);
  const words = [
    ...["The", "future", "of", "gentle", "dentistry", "in"].map((text) => ({ text, accent: false })),
    ...cityWords.map((text, i) => ({ text: i === cityWords.length - 1 ? `${text}.` : text, accent: true })),
  ];

  return (
    <section
      id="top"
      aria-labelledby="lumen-hero-title"
      className="relative isolate overflow-hidden pt-24 pb-16 md:pt-28 md:pb-24 lg:flex lg:min-h-svh lg:items-center lg:pt-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="lumen-aurora top-[-30%] left-[-25%] size-[90vw] max-h-[60rem] max-w-[60rem] bg-[radial-gradient(closest-side,rgb(124_227_247/0.16),transparent)]" />
        <div className="lumen-aurora lumen-aurora--b top-[-10%] right-[-30%] size-[80vw] max-h-[56rem] max-w-[56rem] bg-[radial-gradient(closest-side,rgb(143_124_255/0.2),transparent)]" />
        <div className="lumen-aurora lumen-aurora--c bottom-[-40%] left-[20%] size-[70vw] max-h-[50rem] max-w-[50rem] bg-[radial-gradient(closest-side,rgb(124_227_247/0.1),transparent)]" />
        <ParticleField />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-surface" />
      </div>

      <div className="container-page grid items-center gap-4 lg:grid-cols-12 lg:gap-8">
        <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-6">
          <p
            className="lumen-fade inline-flex items-center gap-2.5 rounded-full border border-line bg-card/60 py-1.5 pr-4 pl-3 text-xs font-medium tracking-wide text-muted backdrop-blur-xl"
            style={delay("0s")}
          >
            <span aria-hidden="true" className="relative grid size-2 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/70 motion-reduce:animate-none" />
              <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_var(--glow-a)]" />
            </span>
            Dentist in {practice.city}, {practice.state}
          </p>

          <h1
            id="lumen-hero-title"
            className="mt-6 font-display text-[clamp(2.6rem,6.4vw,5.75rem)] leading-[1.02] font-light tracking-[-0.045em]"
          >
            <span className="sr-only">The future of gentle dentistry in {practice.city}.</span>
            <span aria-hidden="true">
              {words.map((word, i) => (
                <Fragment key={i}>
                  <span className="reveal-mask">
                    <span
                      className={word.accent ? "lumen-word lumen-gradient-text font-normal" : "lumen-word"}
                      style={{ "--i": i } as React.CSSProperties}
                    >
                      {word.text}
                    </span>
                  </span>
                  {i < words.length - 1 && " "}
                </Fragment>
              ))}
            </span>
          </h1>

          <p className="lumen-fade mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl" style={delay("0.5s")}>
            {practice.name} pairs a calm, unhurried approach with modern dentistry, so every visit feels clear,
            comfortable and easy.
          </p>

          <div className="lumen-fade mt-9 flex flex-wrap items-center gap-3" style={delay("0.65s")}>
            <MagneticButton>
              <GlowButton href="#booking">
                Book your visit <ButtonArrow />
              </GlowButton>
            </MagneticButton>
            <a
              href={telHref(practice.phone)}
              className={buttonClasses("outline", "min-h-14 px-6 text-base backdrop-blur")}
              aria-label={`Call ${practice.name} at ${practice.phone}`}
            >
              <Phone aria-hidden="true" className="size-4" />
              {practice.phone}
            </a>
          </div>

          {hasRating(practice) && (
            <div
              className="lumen-fade mt-10 inline-flex items-center gap-3 rounded-2xl border border-line bg-card/50 px-4 py-3 backdrop-blur-xl"
              style={delay("0.8s")}
            >
              <span className="font-display text-2xl font-light">{practice.rating.toFixed(1)}</span>
              <span className="text-sm text-muted">
                <Stars value={practice.rating} className="text-sm" />
                <span className="mt-0.5 block">
                  {hasReviews(practice) ? `Average from ${formatCount(practice.reviews)} reviews` : "Average rating"}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2 lg:col-span-6">
          <div className="lumen-stage-in" style={delay("0.1s")}>
            <ToothStage className="mx-auto aspect-square h-[44svh] max-h-[26rem] w-auto max-w-full sm:max-h-[30rem] lg:h-auto lg:max-h-[46rem] lg:w-full" />
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="lumen-fade absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.65rem] tracking-[0.3em] text-muted uppercase lg:flex"
        style={delay("1.1s")}
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <span className="lumen-scan absolute inset-x-0 top-0 h-1/3 bg-accent" />
        </span>
      </div>
    </section>
  );
}
