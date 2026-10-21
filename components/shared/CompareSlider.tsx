"use client";

import { MoveHorizontal } from "lucide-react";
import { animate, m, useInView, useMotionValue, useMotionValueEvent, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { EASE_IN_OUT } from "@/lib/animations";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * Draggable comparison. The "before" layer is revealed with two opposing translates
 * (transform only, no clip/width animation), and the handle follows a spring for a physical feel.
 */
export function CompareSlider({
  className,
  labels = "top",
}: {
  className?: string;
  /** Where the Before/After tags sit. Use "middle" for frames that cut off the top corners (e.g. arches). */
  labels?: "top" | "middle";
}) {
  const labelY = labels === "middle" ? "top-1/2 -translate-y-1/2" : "top-4";
  const frame = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLSpanElement>(null);
  const dragging = useRef(false);
  const touched = useRef(false);
  const target = useMotionValue(50);
  const position = useSpring(target, { stiffness: 320, damping: 32, mass: 0.6 });
  const inView = useInView(frame, { once: true, amount: 0.6 });

  const outerX = useTransform(position, (p) => `${p - 100}%`);
  const innerX = useTransform(position, (p) => `${100 - p}%`);
  const handleX = useTransform(position, (p) => `${p}%`);

  // Keep the slider's ARIA value in sync without re-rendering on every pointer move.
  useMotionValueEvent(target, "change", (value) => {
    const percent = Math.round(value);
    handle.current?.setAttribute("aria-valuenow", String(percent));
    handle.current?.setAttribute("aria-valuetext", `${percent}% before, ${100 - percent}% after`);
  });

  // A one-time nudge so visitors discover the slider is interactive.
  useEffect(() => {
    if (!inView || touched.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const controls = animate(target, [50, 68, 34, 50], { duration: 2.4, ease: EASE_IN_OUT, delay: 0.4 });
    return () => controls.stop();
  }, [inView, target]);

  const setFromPointer = (clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    target.set(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    touched.current = true;
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setFromPointer(event.clientX);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = event.shiftKey ? 20 : 5;
    const keys: Record<string, number> = {
      ArrowLeft: target.get() - step,
      ArrowDown: target.get() - step,
      ArrowRight: target.get() + step,
      ArrowUp: target.get() + step,
      Home: 0,
      End: 100,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    touched.current = true;
    target.set(Math.min(100, Math.max(0, keys[event.key])));
  };

  return (
    <div
      ref={frame}
      className={cn(
        "relative aspect-[4/3] cursor-ew-resize touch-pan-y overflow-hidden rounded-[var(--radius-media)] bg-primary/10 select-none",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={(event) => dragging.current && setFromPointer(event.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      data-cursor="hover"
    >
      {/* After */}
      <Image
        src={images.smile.src}
        alt={`After (placeholder): ${images.smile.alt}`}
        fill
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-cover object-[50%_35%]"
      />

      {/* Before: the same placeholder photo, desaturated and warmed to simulate a "before" */}
      <m.div className="absolute inset-0 overflow-hidden" style={{ x: outerX }}>
        <m.div className="absolute inset-0" style={{ x: innerX }}>
          <Image
            src={images.smile.src}
            alt={`Before (placeholder, digitally tinted): ${images.smile.alt}`}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover object-[50%_35%] [filter:sepia(0.45)_saturate(0.7)_brightness(0.9)_contrast(0.95)]"
          />
        </m.div>
      </m.div>

      <span
        className={cn(
          "pointer-events-none absolute left-4 rounded-full bg-black/55 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur",
          labelY,
        )}
      >
        Before
      </span>
      <span
        className={cn(
          "pointer-events-none absolute right-4 rounded-full bg-black/55 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur",
          labelY,
        )}
      >
        After
      </span>
      <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-[0.7rem] font-medium whitespace-nowrap text-white backdrop-blur">
        Placeholder: your real cases go here
      </span>

      {/* Handle: a full-width layer translated by p%, so its left edge sits on the divide. */}
      <m.div className="pointer-events-none absolute inset-0" style={{ x: handleX }}>
        <span className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_20px_rgb(0_0_0/0.3)]" />
        <m.span
          ref={handle}
          role="slider"
          tabIndex={0}
          aria-label="Before and after comparison"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={50}
          aria-valuetext="50% before, 50% after"
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute top-1/2 left-0 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-[0_10px_30px_-5px_rgb(0_0_0/0.4)] focus-visible:outline-accent"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          <MoveHorizontal aria-hidden="true" className="size-5" />
        </m.span>
      </m.div>
    </div>
  );
}
