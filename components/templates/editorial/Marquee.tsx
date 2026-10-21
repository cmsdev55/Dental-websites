"use client";

import { Fragment } from "react";
import { MarqueeRow } from "@/components/ui/MarqueeRow";

/** Two endless rows of specialties drifting in opposite directions; hovering eases them to a crawl. */
export function Marquee({ items }: { items: string[] }) {
  const reversed = [...items].reverse();

  return (
    <section aria-label="Specialties" className="overflow-hidden border-y border-line py-10 md:py-14">
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {/* Reduced motion: a still line of text instead of moving rows. CSS switches, so there's no hydration flash. */}
      <p
        aria-hidden="true"
        className="container-page hidden text-center font-display text-2xl leading-relaxed font-light motion-reduce:block md:text-3xl"
      >
        {items.join(" · ")}
      </p>
      <div aria-hidden="true" className="space-y-3 motion-reduce:hidden md:space-y-5">
          <MarqueeRow speed={42}>
            {items.map((item) => (
              <Fragment key={item}>
                <span className="font-display text-[clamp(2.25rem,6vw,5rem)] leading-none font-light tracking-tight">
                  {item}
                </span>
                <Star />
              </Fragment>
            ))}
          </MarqueeRow>
          <MarqueeRow speed={30} direction={1}>
            {reversed.map((item) => (
              <Fragment key={item}>
                <span className="font-display text-[clamp(1.5rem,3.5vw,2.75rem)] leading-none text-muted italic">
                  {item}
                </span>
                <span className="mx-6 inline-block size-1.5 rounded-full bg-accent md:mx-10" />
              </Fragment>
            ))}
          </MarqueeRow>
      </div>
    </section>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="mx-6 inline-block size-6 shrink-0 text-accent md:mx-10 md:size-8" fill="currentColor">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}
