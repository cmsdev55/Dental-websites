"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TOOTH_SVG_PATH } from "./tooth-shape";

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The hero's 3D tooth. A matching SVG poster renders immediately (and stays if WebGL is unavailable);
 * three.js is fetched only after the page has loaded and the browser is idle, then the live canvas
 * crossfades in. The loop pauses off-screen and in hidden tabs; reduced motion gets one still frame.
 */
export function ToothStage({ className }: { className?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);
  // useId output contains characters that are awkward inside url(#…) references.
  const gradientId = `tooth${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    const start = async () => {
      if (disposed || !canvas.current || !stage.current || !webglAvailable()) return;
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const { createToothScene } = await import("./tooth-scene");
      if (disposed || !canvas.current || !stage.current) return;

      let scene: ReturnType<typeof createToothScene>;
      try {
        scene = createToothScene(canvas.current, { still, onFirstFrame: () => setLive(true) });
      } catch {
        return; // Keep the poster.
      }

      const section = stage.current.closest("section") ?? stage.current;
      let onScreen = true;
      const sync = () => scene.setActive(onScreen && document.visibilityState === "visible");
      const observer = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      });
      observer.observe(stage.current);

      const onPointer = (event: PointerEvent) => {
        scene.setPointer((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
      };
      const onScroll = () => {
        const rect = section.getBoundingClientRect();
        scene.setProgress(-rect.top / Math.max(rect.height, 1));
      };

      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", sync);
      onScroll();
      sync();

      cleanup = () => {
        observer.disconnect();
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", sync);
        scene.dispose();
      };
    };

    // Wait for the page to finish loading, then for an idle moment, so the 3D never competes with first paint.
    // Safari has no requestIdleCallback.
    const hasIdle = typeof window.requestIdleCallback === "function";
    let idleHandle = 0;
    const schedule = () => {
      idleHandle = hasIdle
        ? window.requestIdleCallback(() => void start(), { timeout: 2500 })
        : window.setTimeout(() => void start(), 800);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener("load", schedule);
      if (hasIdle) window.cancelIdleCallback(idleHandle);
      else window.clearTimeout(idleHandle);
      cleanup?.();
    };
  }, []);

  return (
    <div ref={stage} aria-hidden="true" className={cn("relative", className)}>
      {/* Poster: same silhouette and lighting mood as the 3D render. */}
      <div className={cn("absolute inset-0 transition-opacity duration-1000", live ? "opacity-0" : "opacity-100")}>
        <div className="lumen-orb absolute inset-[12%] rounded-full" />
        <svg viewBox="-1.3 -1.3 2.6 2.95" className="absolute inset-[24%] h-[52%] w-[52%] overflow-visible">
          <defs>
            <linearGradient id={`${gradientId}-enamel`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#dfe9f2" />
              <stop offset="100%" stopColor="#b9b2f2" />
            </linearGradient>
            <radialGradient id={`${gradientId}-shine`} cx="0.32" cy="0.22" r="0.55">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d={TOOTH_SVG_PATH} fill={`url(#${gradientId}-enamel)`} />
          <path d={TOOTH_SVG_PATH} fill={`url(#${gradientId}-shine)`} />
          <path d={TOOTH_SVG_PATH} fill="none" stroke="#7ce3f7" strokeOpacity="0.6" strokeWidth="0.015" />
        </svg>
      </div>
      <canvas
        ref={canvas}
        className={cn("absolute inset-0 h-full w-full transition-opacity duration-1000", live ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}
