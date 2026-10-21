"use client";

import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { visitSteps } from "@/lib/content";
import { images } from "@/lib/images";

const colors = ["var(--pop-sun)", "var(--pop-sky)", "var(--pop-pink)", "var(--pop-mint)"];

/**
 * The four visit steps as big sticky cards that stack on top of each other as you scroll;
 * cards underneath ease back and shrink slightly, like a deck being dealt.
 */
export function VisitStack() {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start start", "end end"] });

  return (
    <section id="visit" aria-labelledby="studio-visit-title" className="section-y">
      <div className="container-page">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <Reveal as="p" className="eyebrow text-accent-deep">
              Your visit
            </Reveal>
            <RevealText
              accentItalic={false}
              id="studio-visit-title"
              text="Four easy steps to a *brighter you.*"
              className="font-display mt-4 text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-extrabold tracking-[-0.04em]"
            />
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-md text-lg text-muted md:justify-self-end">
              No surprises and no rushing. Here&rsquo;s exactly what happens, from booking to that first selfie.
            </p>
          </Reveal>
        </div>

        <ol ref={list} className="mt-14">
          {visitSteps.map((step, i) => (
            <StackCard key={step.title} index={i} progress={scrollYProgress} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function StackCard({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const count = visitSteps.length;
  const step = visitSteps[index];
  // Each card starts shrinking once the next one begins to cover it.
  const start = (index + 1) / count - 0.12;
  const scale = useTransform(progress, [Math.max(0, start), 1], [1, 1 - (count - 1 - index) * 0.05]);
  const y = useTransform(progress, [Math.max(0, start), 1], [0, -(count - 1 - index) * 10]);

  return (
    <li
      className="sticky mb-[12svh] last:mb-0"
      style={{ top: `calc(6rem + ${index * 1.25}rem)` }}
      aria-label={`Step ${index + 1} of ${count}: ${step.title}`}
    >
      <m.div
        style={{ scale, y, background: colors[index] }}
        className="grid origin-top gap-6 rounded-[var(--radius-card)] p-6 text-ink shadow-[0_-12px_40px_-20px_rgb(0_0_0/0.35)] sm:p-8 md:min-h-[min(70svh,32rem)] md:grid-cols-2 md:items-center md:gap-10 md:p-12"
      >
        <div>
          <span
            aria-hidden="true"
            className="block font-display text-[clamp(4.5rem,11vw,8.5rem)] leading-[0.8] font-extrabold tracking-[-0.06em] text-ink/15"
          >
            0{index + 1}
          </span>
          <h3 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-none font-extrabold tracking-[-0.03em]">
            {step.title}
          </h3>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink/80">{step.body}</p>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[calc(var(--radius-card)-0.75rem)] bg-card/40 md:aspect-[4/3]">
          <Image
            src={images.steps[index].src}
            alt={images.steps[index].alt}
            fill
            sizes="(min-width: 768px) 42vw, 90vw"
            className="object-cover"
          />
        </div>
      </m.div>
    </li>
  );
}
