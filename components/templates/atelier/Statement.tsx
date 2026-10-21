"use client";

import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { EYEBROW, Ornament } from "@/components/templates/atelier/ui";
import { cn } from "@/lib/utils";

const TEXT =
  "We believe the best dentistry feels unhurried. Every visit begins with a conversation, every plan is explained in plain language, and every appointment is shaped to help you breathe a little easier.";

/** Words start at 4.5:1 contrast (never illegible) and deepen to full ink as the paragraph scrolls past. */
const FROM = "#7a685b";
const TO = "#2b1e17";

/** A large serif statement whose words darken one by one as you scroll through it. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const words = TEXT.split(" ");

  return (
    <section aria-labelledby="atelier-statement-title" className="section-y">
      <div className="container-page flex flex-col items-center text-center">
        <Ornament />
        <h2 id="atelier-statement-title" className={cn("mt-6 text-accent-deep", EYEBROW)}>
          Our approach
        </h2>
        <p
          ref={ref}
          className="mt-8 max-w-5xl font-display text-[clamp(1.9rem,4.4vw,3.9rem)] leading-[1.18] font-light tracking-[-0.01em]"
        >
          {words.map((word, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {word}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const color = useTransform(progress, range, [FROM, TO]);
  return (
    <>
      <m.span style={{ color }} className="motion-reduce:text-ink!">
        {children}
      </m.span>{" "}
    </>
  );
}
