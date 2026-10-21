import { MapPin, Phone } from "lucide-react";
import { Fragment } from "react";
import { ButtonArrow, buttonClasses } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SparkleField } from "@/components/templates/editorial/SparkleField";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Stars } from "@/components/ui/Stars";
import { images } from "@/lib/images";
import type { Practice } from "@/lib/practices";
import { formatCount, hasRating, hasReviews, telHref } from "@/lib/utils";

const delay = (d: string) => ({ "--d": d }) as React.CSSProperties;

/**
 * Server-rendered hero. Its entrance is CSS (see .intro-* in globals.css), timed to start
 * as the preloader curtain lifts, so the headline never waits for JavaScript.
 */
export function Hero({ practice }: { practice: Practice }) {
  const words = [
    ...["Modern,", "gentle", "dentistry", "in"].map((text) => ({ text, accent: false })),
    ...practice.city.split(/\s+/).map((text) => ({ text, accent: true })),
  ];

  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 lg:flex lg:min-h-svh lg:items-center lg:pt-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="blob top-[-25%] left-[-20%] size-[80vw] max-h-[60rem] max-w-[60rem] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_38%,transparent),transparent)]" />
        <div className="blob blob--b top-[5%] right-[-25%] size-[70vw] max-h-[56rem] max-w-[56rem] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--primary)_16%,transparent),transparent)]" />
        <div className="blob blob--c bottom-[-35%] left-[25%] size-[60vw] max-h-[48rem] max-w-[48rem] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_24%,transparent),transparent)]" />
        <div className="grain absolute inset-0 opacity-[0.06] mix-blend-multiply" />
        <SparkleField className="absolute inset-0 size-full" />
      </div>

      <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="intro-fade eyebrow text-accent-deep" style={delay("0s")}>
            Dentist in {practice.city}, {practice.state}
          </p>

          <h1 className="mt-5 font-display text-[clamp(2.9rem,7.4vw,7rem)] leading-[0.98] font-light tracking-[-0.035em]">
            <span className="sr-only">Modern, gentle dentistry in {practice.city}</span>
            <span aria-hidden="true">
              {words.map((word, i) => (
                <Fragment key={i}>
                  <span className="reveal-mask">
                    <span
                      className={word.accent ? "intro-word text-accent-deep italic" : "intro-word"}
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

          <p className="intro-fade mt-7 max-w-xl text-lg leading-relaxed text-muted md:text-xl" style={delay("0.45s")}>
            {practice.name} pairs a calm, unhurried approach with modern dentistry, so every visit feels easy, from your
            first call to your brightest smile.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <span className="intro-spring" style={delay("0.6s")}>
              <MagneticButton>
                <a href="#booking" className={buttonClasses("accent", "min-h-14 px-7 text-base")}>
                  Book your visit <ButtonArrow />
                </a>
              </MagneticButton>
            </span>
            <span className="intro-spring" style={delay("0.7s")}>
              <a
                href={telHref(practice.phone)}
                className={buttonClasses("outline", "min-h-14 px-6 text-base")}
                aria-label={`Call ${practice.name} at ${practice.phone}`}
              >
                <Phone aria-hidden="true" className="size-4" />
                {practice.phone}
              </a>
            </span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="intro-scale relative" style={delay("0.1s")}>
            <ParallaxImage
              src={images.hero.src}
              alt={images.hero.alt}
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
              fromTop
              className="aspect-[4/3] rounded-[2rem] bg-primary/10 sm:aspect-[16/10] lg:aspect-[4/5]"
            />

            <div
              className="intro-fade absolute -bottom-6 left-4 max-w-[17rem] rounded-2xl border border-white/40 bg-card/80 p-4 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.35)] backdrop-blur-xl sm:left-6 lg:-left-10"
              style={delay("0.9s")}
            >
              {hasRating(practice) ? (
                <div className="flex items-center gap-3">
                  <span className="font-display text-4xl leading-none">{practice.rating.toFixed(1)}</span>
                  <span className="text-sm leading-snug text-muted">
                    <Stars value={practice.rating} className="text-sm" />
                    <span className="mt-1 block">
                      {hasReviews(practice)
                        ? `Average from ${formatCount(practice.reviews)} reviews`
                        : "Average patient rating"}
                    </span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
                    <MapPin aria-hidden="true" className="size-5" />
                  </span>
                  <span className="text-sm leading-snug">
                    <span className="block font-medium">Gentle care, close to home</span>
                    <span className="text-muted">
                      {practice.city}, {practice.state}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
