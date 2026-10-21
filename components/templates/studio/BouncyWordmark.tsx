"use client";

import { m } from "motion/react";
import { Fragment } from "react";
import { EASE_EXPO_OUT, viewportOnce } from "@/lib/animations";

const pops = ["var(--pop-sun)", "var(--pop-pink)", "var(--pop-sky)", "var(--pop-mint)"];

/**
 * The practice name, huge and extra-bold. Letters rise in on scroll, then hop and pick up a
 * pop color under the cursor (transform-only; MotionConfig turns the hop off for reduced motion).
 */
export function BouncyWordmark({ name }: { name: string }) {
  const words = name.split(/\s+/);
  const longest = Math.max(...words.map((w) => w.length));
  const oneLine = `calc((min(100vw, 88rem) - 8rem) / ${(name.length * 0.56).toFixed(2)})`;
  const perWord = `min(calc((100vw - 2.5rem) / ${(Math.max(longest, 6) * 0.64).toFixed(2)}), 5.5rem)`;
  let index = 0;

  return (
    <m.p
      aria-hidden="true"
      className="font-display leading-[0.9] font-extrabold tracking-[-0.05em] text-balance"
      style={{ fontSize: `min(12rem, max(${oneLine}, ${perWord}))` }}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {words.map((word, w) => (
        <Fragment key={w}>
          <span className="inline-block whitespace-nowrap">
            {[...word].map((char) => {
              const i = index++;
              // Outer span hops on hover (outside the mask so it isn't clipped); inner span rises in.
              return (
                <m.span
                  key={i}
                  className="inline-block cursor-default"
                  whileHover={{
                    y: "-12%",
                    color: pops[i % pops.length],
                    transition: { type: "spring", stiffness: 500, damping: 12 },
                  }}
                >
                  <span className="reveal-mask">
                    <m.span
                      className="inline-block"
                      variants={{
                        hidden: { y: "105%" },
                        show: { y: "0%", transition: { duration: 1.1, ease: EASE_EXPO_OUT, delay: i * 0.03 } },
                      }}
                    >
                      {char}
                    </m.span>
                  </span>
                </m.span>
              );
            })}
          </span>
          {w < words.length - 1 && " "}
        </Fragment>
      ))}
    </m.p>
  );
}
