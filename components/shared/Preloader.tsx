import { Fragment } from "react";

/**
 * Pure-CSS intro: the practice name rises letter by letter, then a two-layer curtain wipes up.
 * Runs before any JavaScript loads (so it never delays the page) and finishes in ~1.5s.
 * A script in app/layout.tsx skips it on repeat visits in the same session; reduced motion skips it too.
 */
export function Preloader({ name, city, state }: { name: string; city: string; state: string }) {
  let index = 0;
  const words = name.split(/\s+/).map((word) => [...word].map((char) => ({ char, i: index++ })));
  // Spread the letters over at most ~0.35s, however long the name is.
  const stagger = Math.min(0.03, 0.35 / Math.max(index, 1));

  return (
    <div className="preloader" aria-hidden="true" style={{ "--stagger": `${stagger.toFixed(3)}s` } as React.CSSProperties}>
      <div className="preloader__curtain preloader__curtain--back" />
      <div className="preloader__curtain preloader__curtain--front">
        <div className="preloader__content flex max-w-5xl flex-col items-center px-6 text-center">
          {/* Painted in the very first frame, before any web font arrives. */}
          <svg viewBox="0 0 24 24" className="mb-8 size-6 text-accent" fill="currentColor">
            <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
          </svg>
          <p className="font-display text-[clamp(2.4rem,8.5vw,7rem)] leading-[1.05] font-light tracking-[-0.03em]">
            {words.map((chars, w) => (
              <Fragment key={w}>
                <span className="reveal-mask">
                  {chars.map(({ char, i }) => (
                    <span key={i} className="preloader__char" style={{ "--i": i } as React.CSSProperties}>
                      {char}
                    </span>
                  ))}
                </span>
                {w < words.length - 1 && " "}
              </Fragment>
            ))}
          </p>
          <span className="preloader__line mt-8 block h-px w-32 bg-accent" />
          <p className="preloader__meta eyebrow mt-5 text-primary-muted">
            Dentistry in {city}, {state}
          </p>
        </div>
      </div>
    </div>
  );
}
