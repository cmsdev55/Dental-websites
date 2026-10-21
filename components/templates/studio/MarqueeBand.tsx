import { Fragment } from "react";
import { MarqueeRow } from "@/components/ui/MarqueeRow";
import { marqueeItems } from "@/lib/content";

const dots = ["var(--pop-sun)", "var(--pop-pink)", "var(--pop-sky)", "var(--pop-mint)"];

/** Two tilted bands that cross like tape: black over mint, drifting in opposite directions. */
export function MarqueeBand() {
  const items = (separatorOffset: number) =>
    marqueeItems.map((item, i) => (
      <Fragment key={item}>
        <span className="font-display text-2xl leading-none font-extrabold tracking-tight uppercase md:text-4xl">{item}</span>
        <span
          aria-hidden="true"
          className="mx-5 inline-block size-3 shrink-0 rounded-full md:mx-8 md:size-4"
          style={{ background: dots[(i + separatorOffset) % dots.length] }}
        />
      </Fragment>
    ));

  return (
    <section aria-label="Specialties" className="relative overflow-hidden py-10 md:py-16">
      <ul className="sr-only">
        {marqueeItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div aria-hidden="true" className="relative h-36 md:h-48">
        <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[2.5deg] bg-[var(--pop-mint)] py-3 text-ink md:py-4">
          <MarqueeRow speed={34} direction={1} className="motion-reduce:hidden">
            {items(2)}
          </MarqueeRow>
          <p className="hidden truncate px-6 text-center font-display text-2xl font-extrabold uppercase motion-reduce:block">
            {marqueeItems.slice(0, 5).join(" · ")}
          </p>
        </div>
        <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 -rotate-[2.5deg] bg-primary py-4 text-primary-ink shadow-[0_20px_40px_-20px_rgb(0_0_0/0.5)] md:py-5">
          <MarqueeRow speed={48} className="motion-reduce:hidden">
            {items(0)}
          </MarqueeRow>
          <p className="hidden truncate px-6 text-center font-display text-2xl font-extrabold uppercase motion-reduce:block">
            {marqueeItems.slice(5).join(" · ")}
          </p>
        </div>
      </div>
    </section>
  );
}
