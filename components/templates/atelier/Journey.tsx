"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";
import { EYEBROW, ROMAN } from "@/components/templates/atelier/ui";
import { Reveal } from "@/components/ui/Reveal";
import { loadGsap, MEDIA, refreshScrollTriggersWhenReady } from "@/lib/animations";
import { visitSteps } from "@/lib/content";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";

const INTRO = "Calm from the first click to the final reveal: four unhurried steps, each one explained before it happens.";

/**
 * "Your visit" as a horizontal journey through four arches.
 * Tablet/desktop: the section pins and the row of arches glides sideways as you scroll (GSAP, loaded on demand),
 * with a gold progress thread and a gentle parallax inside each photo.
 * Phones and reduced motion: a swipeable row (phones) or a simple grid (larger screens).
 */
export function Journey() {
  return (
    <section id="visit" aria-labelledby="visit-title" className="on-primary bg-primary text-primary-ink">
      <PinnedJourney />
      <StaticJourney />
    </section>
  );
}

function PinnedJourney() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const thread = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const query = window.matchMedia(MEDIA.pinnable);
    let revert: (() => void) | undefined;
    let disposed = false;

    const start = async () => {
      if (revert || !query.matches) return;
      const { gsap, ScrollTrigger } = await loadGsap();
      if (disposed || revert || !root.current || !track.current) return;

      const mm = gsap.matchMedia(root);
      mm.add(MEDIA.pinnable, () => {
        const distance = () => Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth);

        const slide = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.fromTo(
          thread.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: 0.8 },
          },
        );

        // Each photo drifts against the direction of travel while its arch crosses the screen.
        gsap.utils.toArray<HTMLElement>("[data-journey-photo]", root.current).forEach((photo) => {
          gsap.fromTo(
            photo,
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: "none",
              scrollTrigger: { trigger: photo, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });

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
    <div ref={root} className="relative hidden h-svh overflow-hidden pinnable:block">
      <ol ref={track} className="flex h-full w-max items-center gap-10 px-10 xl:gap-16 xl:px-16">
        <li className="flex w-[min(30rem,38vw)] shrink-0 flex-col justify-center pr-6">
          <p className={cn("text-[var(--gold)]", EYEBROW)}>Your visit</p>
          <h2
            id="visit-title"
            className="mt-6 font-display text-[clamp(3rem,5.4vw,5.75rem)] leading-[0.96] font-light tracking-[-0.01em]"
          >
            A journey in <span className="italic">four</span> quiet steps.
          </h2>
          <p className="mt-8 max-w-sm leading-relaxed text-primary-muted">{INTRO}</p>
          <p className={cn("mt-12 flex items-center gap-4 text-primary-muted", EYEBROW)}>
            Scroll <span aria-hidden="true" className="h-px w-16 bg-[var(--gold)]" />
          </p>
        </li>
        {visitSteps.map((step, i) => (
          <li key={step.title} className="shrink-0">
            <JourneyCard index={i} title={step.title} body={step.body} photoSize="(min-width: 768px) 24rem, 80vw" />
          </li>
        ))}
        <li aria-hidden="true" className="w-[8vw] shrink-0" />
      </ol>

      <div className="pointer-events-none absolute inset-x-10 bottom-10 xl:inset-x-16">
        <span className="block h-px w-full bg-[var(--line-on-primary)]">
          <span ref={thread} className="block h-full w-full origin-left scale-x-0 bg-[var(--gold)]" />
        </span>
      </div>
    </div>
  );
}

function StaticJourney() {
  return (
    <div className="section-y pinnable:hidden">
      <div className="container-page">
        <p className={cn("text-[var(--gold)]", EYEBROW)}>Your visit</p>
        <h2 className="mt-5 font-display text-[clamp(2.6rem,9vw,4.5rem)] leading-[0.98] font-light tracking-[-0.01em]">
          A journey in <span className="italic">four</span> quiet steps.
        </h2>
        <p className="mt-6 max-w-md leading-relaxed text-primary-muted">{INTRO}</p>
      </div>
      <ol
        className="atelier-swipe container-page mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 pb-4 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible lg:grid-cols-4"
        aria-label="Visit steps"
      >
        {visitSteps.map((step, i) => (
          <Reveal as="li" key={step.title} delay={i * 0.06} className="w-[78vw] max-w-[20rem] shrink-0 snap-start md:w-auto md:max-w-none">
            <JourneyCard index={i} title={step.title} body={step.body} photoSize="(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 78vw" />
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

function JourneyCard({
  index,
  title,
  body,
  photoSize,
}: {
  index: number;
  title: string;
  body: string;
  photoSize: string;
}) {
  const photo = images.steps[index];
  return (
    <article className="flex flex-col">
      {/* Pinned layout sizes the arch from the viewport height so all four always fit on screen. */}
      <div className="relative aspect-[3/4] w-full pinnable:aspect-auto pinnable:h-[min(52svh,30rem)] pinnable:w-[calc(min(52svh,30rem)*0.75)]">
        <span
          aria-hidden="true"
          className="absolute inset-0 translate-x-2.5 -translate-y-2.5 rounded-t-full border border-[var(--gold)]/60"
        />
        <div className="absolute inset-0 overflow-hidden rounded-t-full bg-white/5">
          <div data-journey-photo className="absolute inset-y-0 -right-[10%] -left-[10%]">
            <Image src={photo.src} alt={photo.alt} fill sizes={photoSize} className="object-cover" />
          </div>
        </div>
      </div>
      <p className="mt-7 font-display text-3xl font-light text-[var(--gold)] italic">{ROMAN[index]}</p>
      <h3 className="mt-2 font-display text-[1.75rem] leading-tight font-normal tracking-[-0.01em]">{title}</h3>
      <p className="mt-3 max-w-[20rem] text-sm leading-relaxed text-primary-muted">{body}</p>
    </article>
  );
}
