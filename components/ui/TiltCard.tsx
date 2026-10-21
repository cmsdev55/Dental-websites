"use client";

import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** A card that tilts in 3D toward the cursor, with a soft glare that follows it. Mouse only. */
export function TiltCard({
  children,
  className,
  max = 7,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18, mass: 0.5 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const glareX = useTransform(px, [0, 1], ["-25%", "25%"]);
  const glareY = useTransform(py, [0, 1], ["-25%", "25%"]);

  const onPointerMove = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse" || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="h-full [perspective:1100px]">
      <m.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn("group relative h-full overflow-hidden", className)}
      >
        {children}
        <m.span
          aria-hidden="true"
          style={{ x: glareX, y: glareY }}
          className="pointer-events-none absolute -inset-1/2 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </m.div>
    </div>
  );
}
