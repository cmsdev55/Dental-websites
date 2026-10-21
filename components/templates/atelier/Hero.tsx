import { Phone } from "lucide-react";
import { SilkCanvas } from "@/components/templates/atelier/SilkCanvas";
import { atelierButton, EYEBROW } from "@/components/templates/atelier/ui";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Stars } from "@/components/ui/Stars";
import { images } from "@/lib/images";
import type { Practice } from "@/lib/practices";
import { cn, formatCount, hasRating, hasReviews, telHref } from "@/lib/utils";

const vars = (values: Record<string, string | number>) => values as React.CSSProperties;

/**
 * Centered, typographic hero over flowing canvas silk, with the photo set in an arch.
 * The entrance is CSS keyed to the preloader (--intro), so nothing waits for JavaScript.
 */
export function Hero({ practice }: { practice: Practice }) {
  const lines = [
    { text: "Refined, gentle", italic: false },
    { text: "dentistry in", italic: false },
    { text: `${practice.city}.`, italic: true },
  ];

  return (
    <section
      id="top"
      aria-labelledby="atelier-hero-title"
      className="relative isolate overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28"
    >
      <SilkCanvas className="absolute inset-0 -z-10 h-full w-full" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-2/3 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--card)_90%,transparent),transparent)]"
      />

      <div className="container-page flex flex-col items-center text-center">
        <p className={cn("intro-fade text-accent-deep", EYEBROW)} style={vars({ "--d": "0s" })}>
          Dentistry <span aria-hidden="true">&middot;</span> {practice.city}, {practice.state}
        </p>

        <h1
          id="atelier-hero-title"
          className="mt-7 max-w-5xl font-display text-[clamp(3.1rem,9vw,8.25rem)] leading-[0.96] font-light tracking-[-0.015em]"
        >
          <span className="sr-only">Refined, gentle dentistry in {practice.city}.</span>
          <span aria-hidden="true">
            {lines.map((line, i) => (
              <span key={line.text} className="atelier-line" style={vars({ "--line": i })}>
                <span className={line.italic ? "text-accent-deep italic" : undefined}>{line.text}</span>
              </span>
            ))}
          </span>
        </h1>

        <p
          className="intro-fade mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg"
          style={vars({ "--d": "0.45s" })}
        >
          Considered care, unhurried appointments and natural-looking results at {practice.name}, designed around
          you from the very first conversation.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <span className="intro-spring" style={vars({ "--d": "0.6s" })}>
            <MagneticButton strength={0.25}>
              <a href="#booking" className={atelierButton("solid")}>
                Book an appointment
              </a>
            </MagneticButton>
          </span>
          <a
            href={telHref(practice.phone)}
            className={cn("intro-fade inline-flex items-center gap-2 border-b border-current pb-1", EYEBROW)}
            style={vars({ "--d": "0.7s" })}
            aria-label={`Call ${practice.name} at ${practice.phone}`}
          >
            <Phone aria-hidden="true" className="size-3.5" />
            {practice.phone}
          </a>
        </div>

        {hasRating(practice) && (
          <p
            className="intro-fade mt-8 flex items-center gap-3 text-sm text-muted"
            style={vars({ "--d": "0.8s" })}
          >
            <Stars value={practice.rating} className="text-xs" />
            <span>
              <span className="font-medium text-ink">{practice.rating.toFixed(1)}</span>
              {hasReviews(practice) && <> &middot; {formatCount(practice.reviews)} reviews</>}
            </span>
          </p>
        )}

        <div className="atelier-arch-in relative mt-16 w-full max-w-[26rem] md:mt-20 md:max-w-[30rem]">
          <span
            aria-hidden="true"
            className="absolute inset-0 translate-x-3 -translate-y-3 rounded-t-full border border-[var(--gold)] md:translate-x-5 md:-translate-y-5"
          />
          <ParallaxImage
            src={images.hero.src}
            alt={images.hero.alt}
            sizes="(min-width: 768px) 30rem, 90vw"
            priority
            fromTop
            amount={8}
            className="aspect-[3/4] rounded-t-full bg-primary/10"
          />
          <div
            aria-hidden="true"
            className="atelier-scroll-cue absolute -bottom-20 left-1/2 hidden h-14 w-px -translate-x-1/2 overflow-hidden bg-line md:block"
          />
        </div>
      </div>
    </section>
  );
}
