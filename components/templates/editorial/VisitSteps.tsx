"use client";

import { m, useScroll } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { loadGsap, MEDIA, refreshScrollTriggersWhenReady } from "@/lib/animations";
import { visitSteps } from "@/lib/content";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";

const TITLE = "Your visit, *step by step.*";

/**
 * Desktop/tablet: the section pins while you scroll through four steps; a progress line fills
 * and the photos crossfade (GSAP ScrollTrigger, scrubbed).
 * Phones, short screens and reduced motion: a simple stacked timeline with the same content.
 */
export function VisitSteps() {
  return (
    <section id="visit" aria-labelledby="visit-title" className="on-primary bg-primary text-primary-ink">
      <PinnedSteps />
      <StackedSteps />
    </section>
  );
}

function PinnedSteps() {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  const lenis = useLenis();

  useEffect(() => {
    const query = window.matchMedia(MEDIA.pinnable);
    let revert: (() => void) | undefined;
    let disposed = false;

    // GSAP is only downloaded once a screen qualifies for pinning (never on phones).
    const start = async () => {
      if (revert || !query.matches) return;
      const { gsap, ScrollTrigger } = await loadGsap();
      if (disposed || revert || !root.current) return;

      const mm = gsap.matchMedia(root);
      mm.add(MEDIA.pinnable, () => {
        const photos = gsap.utils.toArray<HTMLElement>("[data-step-photo]", root.current);
        const count = visitSteps.length;

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * (count - 0.5)}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.min(count - 1, Math.floor(self.progress * count))),
          },
        });

        timeline.fromTo(fill.current, { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0);
        photos.forEach((photo, i) => {
          if (i === 0) return;
          timeline.fromTo(
            photo,
            { opacity: 0, scale: 1.08 },
            { opacity: 1, scale: 1, duration: 0.1, ease: "power2.out" },
            i / count - 0.05,
          );
        });
      });

      // Keep ScrollTrigger in lockstep with Lenis' smoothed scroll position.
      const unsubscribe = lenis?.on("scroll", ScrollTrigger.update);
      refreshScrollTriggersWhenReady(ScrollTrigger);
      revert = () => {
        unsubscribe?.();
        mm.revert();
      };
    };

    start();
    query.addEventListener("change", start);
    return () => {
      disposed = true;
      query.removeEventListener("change", start);
      revert?.();
    };
  }, [lenis]);

  return (
    <div ref={root} className="hidden h-svh pinnable:block">
      <div className="container-page grid h-full grid-cols-12 items-center gap-10 py-24">
        <div className="col-span-6 xl:col-span-5">
          <p className="eyebrow text-accent">Your visit</p>
          <RevealText
            id="visit-title"
            text={TITLE}
            className="mt-4 text-[clamp(2.5rem,4.6vw,4.5rem)] leading-[1.02] font-light"
            accentClassName="text-accent"
          />

          <div className="relative mt-10 pl-12 lg:mt-14">
            <span aria-hidden="true" className="absolute top-3 bottom-3 left-[11px] w-px bg-[var(--line-on-primary)]">
              <span ref={fill} className="block h-full w-full origin-top scale-y-0 bg-accent" />
            </span>
            <ol className="space-y-6 lg:space-y-8">
              {visitSteps.map((step, i) => (
                <li
                  key={step.title}
                  aria-current={active === i ? "step" : undefined}
                  className="relative"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1.5 -left-12 grid size-6 place-items-center rounded-full border text-[0.65rem] tabular-nums transition-[transform,background-color,color] duration-500",
                      active >= i
                        ? "scale-100 border-accent bg-accent text-accent-ink"
                        : "scale-90 border-[var(--line-on-primary)] bg-primary text-primary-muted",
                    )}
                  >
                    {i + 1}
                  </span>
                  <h3
                    className={cn(
                      "text-2xl font-normal tracking-tight transition-opacity duration-500 lg:text-3xl",
                      active === i ? "opacity-100" : "opacity-65",
                    )}
                  >
                    {step.title}
                  </h3>
                  {/* Only the active step's description shows; the others stay in the DOM for screen readers. */}
                  <p
                    className={cn(
                      "mt-2 max-w-md leading-relaxed text-primary-muted transition-opacity duration-500",
                      active === i ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="relative col-span-6 col-start-7 h-[min(72svh,46rem)] overflow-hidden rounded-[2rem] bg-white/5 xl:col-span-6 xl:col-start-7">
          {images.steps.map((photo, i) => (
            <div
              key={photo.src}
              data-step-photo
              className="absolute inset-0 will-change-[opacity,transform]"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="50vw" className="object-cover" />
            </div>
          ))}
          <div
            aria-hidden="true"
            className="absolute right-5 bottom-5 rounded-full bg-primary/70 px-4 py-2 font-display text-sm tabular-nums backdrop-blur"
          >
            0{active + 1} <span className="text-primary-muted">/ 0{visitSteps.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StackedSteps() {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 75%", "end 60%"] });

  return (
    <div className="container-page section-y pinnable:hidden">
      <p className="eyebrow text-accent">Your visit</p>
      <h2 className="mt-4 text-[clamp(2.4rem,9vw,3.5rem)] leading-[1.04] font-light">
        Your visit, <span className="text-accent italic">step by step.</span>
      </h2>

      <ol ref={list} className="relative mt-12 space-y-14 pl-12">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[11px] w-px bg-[var(--line-on-primary)]">
          <m.span style={{ scaleY: scrollYProgress }} className="block h-full w-full origin-top bg-accent" />
        </span>
        {visitSteps.map((step, i) => (
          <Reveal as="li" key={step.title} className="relative">
            <span
              aria-hidden="true"
              className="absolute top-1 -left-12 grid size-6 place-items-center rounded-full border border-accent bg-accent text-[0.65rem] text-accent-ink tabular-nums"
            >
              {i + 1}
            </span>
            <h3 className="text-2xl font-normal tracking-tight">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-primary-muted">{step.body}</p>
            <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl bg-white/5">
              <Image
                src={images.steps[i].src}
                alt={images.steps[i].alt}
                fill
                sizes="(min-width: 768px) 90vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
