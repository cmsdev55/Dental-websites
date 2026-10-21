"use client";

import Lenis from "lenis";
import { LazyMotion, MotionConfig } from "motion/react";
import { createContext, useContext, useEffect, useState } from "react";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

const LenisContext = createContext<Lenis | null>(null);

/** The active Lenis instance, or null when smooth scrolling is off (reduced motion, before mount). */
export function useLenis() {
  return useContext(LenisContext);
}

/** Glide to an element (or jump, without Lenis), then move focus there for keyboard and screen-reader users. */
export function scrollToElement(lenis: Lenis | null, target: HTMLElement) {
  const focusTarget = () => {
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  if (lenis && !lenis.isStopped) {
    lenis.scrollTo(target, { duration: 1.4, onComplete: focusTarget });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    focusTarget();
  }
}

/**
 * Lenis smooth scrolling plus the Motion config every section shares.
 * GSAP isn't imported here: sections that need ScrollTrigger load it on demand and
 * subscribe to this Lenis instance themselves (see VisitSteps).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      autoRaf: true,
    });
    setLenis(instance);

    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // In-page links glide to their section, then move focus there for keyboard and screen-reader users.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = decodeURIComponent(link.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (!target) return;

      event.preventDefault();
      history.pushState(null, "", `#${id}`);
      scrollToElement(lenis, target);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return (
    <LenisContext.Provider value={lenis}>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={loadFeatures}>{children}</LazyMotion>
      </MotionConfig>
    </LenisContext.Provider>
  );
}
