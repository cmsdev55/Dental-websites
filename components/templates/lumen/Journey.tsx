"use client";

import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { visitSteps } from "@/lib/content";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * "Your visit": a glowing beam fills the timeline as you scroll, and each step lights up as the
 * beam reaches it. Scroll-linked with Motion (transform/opacity only), no pinning.
 */
export function Journey() {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 65%", "end 55%"] });

  return (
    <section id="visit" aria-labelledby="visit-title" className="section-y relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -z-10 size-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(143_124_255/0.1),transparent)]"
      />
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal as="p" className="eyebrow text-accent">
            Your visit
          </Reveal>
          <RevealText
            id="visit-title"
            text="Four calm steps to a *brighter smile.*"
            className="mt-4 font-display text-[clamp(2.2rem,4.8vw,4rem)] leading-[1.04] font-light tracking-[-0.035em]"
            accentClassName="lumen-gradient-text"
          />
        </div>

        <ol ref={list} className="relative mx-auto mt-16 max-w-6xl space-y-16 md:mt-24 md:space-y-28">
          {/* Track + beam */}
          <span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[11px] w-px bg-line md:left-1/2 md:-translate-x-1/2"
          >
            <m.span
              style={{ scaleY: scrollYProgress }}
              className="absolute inset-0 origin-top bg-gradient-to-b from-accent via-accent to-[var(--glow-b)] shadow-[0_0_16px_2px_var(--glow-a)]"
            />
          </span>

          {visitSteps.map((step, i) => (
            <Step key={step.title} index={i} title={step.title} body={step.body} progress={scrollYProgress} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({
  index,
  title,
  body,
  progress,
}: {
  index: number;
  title: string;
  body: string;
  progress: MotionValue<number>;
}) {
  const count = visitSteps.length;
  const at = index / count;
  const lit = useTransform(progress, [at - 0.02, at + 0.12], [0, 1]);
  const opacity = useTransform(lit, [0, 1], [0.35, 1]);
  const dotScale = useTransform(lit, [0, 1], [0.6, 1]);
  const imageScale = useTransform(lit, [0, 1], [1.12, 1]);
  const flip = index % 2 === 1;

  return (
    <li className="relative grid gap-6 pl-12 md:grid-cols-2 md:gap-20 md:pl-0">
      <m.span
        aria-hidden="true"
        style={{ scale: dotScale }}
        className="absolute top-1 left-0 grid size-6 place-items-center rounded-full border border-accent bg-surface shadow-[0_0_20px_var(--glow-a)] md:top-8 md:left-1/2 md:-translate-x-1/2"
      >
        <span className="size-2 rounded-full bg-accent" />
      </m.span>

      <m.div style={{ opacity }} className={cn("md:py-6", flip ? "md:order-2 md:pl-4" : "md:pr-4 md:text-right")}>
        <p className="font-display text-sm text-accent tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
        <h3 className="mt-3 font-display text-3xl font-light tracking-tight md:text-4xl">{title}</h3>
        <p className={cn("mt-3 max-w-md leading-relaxed text-muted", !flip && "md:ml-auto")}>{body}</p>
      </m.div>

      <m.div
        style={{ opacity }}
        className={cn(
          "relative aspect-[16/10] overflow-hidden rounded-[var(--radius-media)] border border-line bg-card",
          flip && "md:order-1",
        )}
      >
        <m.div style={{ scale: imageScale }} className="absolute inset-0">
          <Image
            src={images.steps[index].src}
            alt={images.steps[index].alt}
            fill
            sizes="(min-width: 768px) 45vw, 90vw"
            className="object-cover brightness-[0.8] saturate-[0.85]"
          />
        </m.div>
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-[var(--glow-b)]/10"
        />
      </m.div>
    </li>
  );
}
