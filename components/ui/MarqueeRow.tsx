"use client";

import { m, useAnimationFrame, useInView, useMotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

/** An endless horizontal row (content is repeated 3×). Hovering eases it to a crawl; it pauses off-screen. */
export function MarqueeRow({
  children,
  speed,
  direction = -1,
  className,
}: {
  children: React.ReactNode;
  /** Pixels per second at full speed. */
  speed: number;
  direction?: 1 | -1;
  className?: string;
}) {
  const row = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const copyWidth = useRef(0);
  const factor = useRef(1);
  const targetFactor = useRef(1);
  const x = useMotionValue(0);
  const inView = useInView(row, { margin: "200px 0px" });

  useEffect(() => {
    if (!copy.current) return;
    const observer = new ResizeObserver(([entry]) => {
      copyWidth.current = entry.contentRect.width;
    });
    observer.observe(copy.current);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (!inView || !copyWidth.current) return;
    // Ease the speed toward its target so hover slows down smoothly instead of snapping.
    factor.current += (targetFactor.current - factor.current) * Math.min(1, delta / 220);
    const next = x.get() + direction * speed * factor.current * (delta / 1000);
    x.set(wrap(-copyWidth.current, 0, next));
  });

  return (
    <div
      ref={row}
      className={cn("flex overflow-hidden", className)}
      onPointerEnter={() => (targetFactor.current = 0.15)}
      onPointerLeave={() => (targetFactor.current = 1)}
    >
      <m.div className="flex shrink-0 items-center will-change-transform" style={{ x }}>
        <div ref={copy} className="flex shrink-0 items-center">
          {children}
        </div>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </m.div>
    </div>
  );
}
