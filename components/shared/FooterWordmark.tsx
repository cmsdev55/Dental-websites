"use client";

import { m } from "motion/react";
import { Fragment } from "react";
import { EASE_EXPO_OUT, viewportOnce } from "@/lib/animations";

/** The practice name, set huge, with letters rising from a mask as the footer scrolls in. */
export function FooterWordmark({ name }: { name: string }) {
  const words = name.split(/\s+/);
  const longest = Math.max(...words.map((w) => w.length));
  // Wide screens: as large as fits the whole name on one line. Phones: let words wrap, sized so the
  // longest word always fits. Whichever is larger wins, capped at 13rem.
  const oneLine = `calc((min(100vw, 88rem) - 8rem) / ${(name.length * 0.5).toFixed(2)})`;
  const perWord = `min(calc((100vw - 2.5rem) / ${(Math.max(longest, 6) * 0.6).toFixed(2)}), 5.5rem)`;
  const size = `min(13rem, max(${oneLine}, ${perWord}))`;
  let index = 0;

  return (
    <m.p
      aria-hidden="true"
      className="font-display leading-[0.92] font-light tracking-[-0.04em] text-balance"
      style={{ fontSize: size }}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {words.map((word, w) => (
        <Fragment key={w}>
          <span className="reveal-mask whitespace-nowrap">
            {[...word].map((char) => {
              const i = index++;
              return (
                <m.span
                  key={i}
                  className="inline-block"
                  variants={{
                    hidden: { y: "105%" },
                    show: { y: "0%", transition: { duration: 1.2, ease: EASE_EXPO_OUT, delay: i * 0.035 } },
                  }}
                >
                  {char}
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
