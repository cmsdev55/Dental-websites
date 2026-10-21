"use client";

import { animate, m, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE_EXPO_OUT } from "@/lib/animations";

/**
 * Counts from 0 to `value` the first time it scrolls into view.
 * The final value is server-rendered (and read by screen readers); an invisible copy
 * reserves its width so the count never shifts the layout.
 */
export function CountUp({
  value,
  decimals = 0,
  suffix = "",
  duration = 1.8,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const count = useMotionValue(value);
  const format = (n: number) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
  const display = useTransform(count, (n) => format(n) + suffix);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!inView) {
      count.set(0);
      return;
    }
    const controls = animate(count, value, { from: 0, duration, ease: EASE_EXPO_OUT });
    return () => controls.stop();
  }, [inView, count, value, duration]);

  const final = format(value) + suffix;

  return (
    <span ref={ref} className="inline-grid tabular-nums">
      <span className="sr-only">{final}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {final}
      </span>
      <m.span aria-hidden="true" className="col-start-1 row-start-1">
        {display}
      </m.span>
    </span>
  );
}
