"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { springSnappy } from "@/lib/animations";

type CursorState = "hidden" | "default" | "hover";

const INTERACTIVE = 'a, button, [role="button"], [role="slider"], [role="tab"], label, summary, [data-cursor="hover"]';
const NATIVE = "input, textarea, select, iframe";

/** A small dot that trails the mouse and grows over anything clickable. Desktop mice only. */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("hidden");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 700, damping: 45, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 700, damping: 45, mass: 0.35 });

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!query.matches) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    setEnabled(true);

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as Element | null;
      if (target?.closest(NATIVE)) setState("hidden");
      else setState(target?.closest(INTERACTIVE) ? "hover" : "default");
    };
    const onLeave = () => setState("hidden");

    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[200] mix-blend-difference"
      style={{ x: springX, y: springY }}
    >
      <m.span
        className="block size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        initial={{ scale: 0 }}
        animate={{ scale: state === "hover" ? 3.6 : state === "hidden" ? 0 : 1 }}
        transition={springSnappy}
      />
    </m.div>
  );
}
