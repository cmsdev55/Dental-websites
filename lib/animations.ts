import type { Transition, Variants } from "motion/react";

/* ------------------------------------------------------------------ */
/* Easing                                                              */
/* ------------------------------------------------------------------ */

/** GSAP "expo.out" as a cubic-bezier, so Motion, GSAP and CSS all share one feel. */
export const EASE_EXPO_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const springSoft: Transition = { type: "spring", stiffness: 160, damping: 22, mass: 0.6 };
export const springSnappy: Transition = { type: "spring", stiffness: 380, damping: 30 };

/* ------------------------------------------------------------------ */
/* Motion variants                                                     */
/* ------------------------------------------------------------------ */

/** Default viewport for whileInView reveals: fire once, slightly before fully in view. */
export const viewportOnce = { once: true, margin: "0px 0px -12% 0px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_EXPO_OUT } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE_EXPO_OUT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE_EXPO_OUT } },
};

/** Text that rises out of an overflow-hidden mask. */
export const maskRise: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 1.1, ease: EASE_EXPO_OUT } },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Returns `variants` with a delay added to the "show" transition (variant transitions win over the prop). */
export function withDelay(variants: Variants, delay: number): Variants {
  const show = variants.show;
  if (!delay || !show || typeof show === "function") return variants;
  return { ...variants, show: { ...show, transition: { ...show.transition, delay } } };
}

/** Horizontal slide used by the booking steps and carousel; `custom` is the direction (1 | -1). */
export const slideX: Variants = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.55, ease: EASE_EXPO_OUT } },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0, transition: { duration: 0.3, ease: EASE_IN_OUT } }),
};

/* ------------------------------------------------------------------ */
/* GSAP helpers                                                        */
/* ------------------------------------------------------------------ */

type Gsap = typeof import("gsap").gsap;
type ScrollTriggerType = typeof import("gsap/ScrollTrigger").ScrollTrigger;

let gsapPromise: Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerType }> | undefined;

/**
 * Load GSAP + ScrollTrigger on demand and register the plugin once.
 * Only screens that actually run a scroll-driven section download it, so phones never pay for it.
 */
export function loadGsap() {
  gsapPromise ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    return { gsap, ScrollTrigger };
  });
  return gsapPromise;
}

/** Media queries for GSAP sections, so heavy scroll effects only run where they make sense. */
export const MEDIA = {
  /** Tablet/desktop, tall enough to pin, and no reduced-motion request. Matches the `pinnable:` CSS variant. */
  pinnable: "(min-width: 768px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

/** Recalculate trigger positions once late-loading fonts and images have settled. */
export function refreshScrollTriggersWhenReady(ScrollTrigger: ScrollTriggerType) {
  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  if (document.readyState === "complete") refresh();
  else window.addEventListener("load", refresh, { once: true });
}
