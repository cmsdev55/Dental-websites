"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Ribbon {
  color: string;
  /** Vertical center as a fraction of the canvas height. */
  base: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  /** Spread between the strands that make up the ribbon, in px. */
  spread: number;
  strands: number;
  alpha: number;
}

const TAU = Math.PI * 2;

/**
 * Flowing silk ribbons in gold, terracotta and cream, drawn on a 2D canvas.
 * Each ribbon is a bundle of fine strands following layered sine waves, so it shimmers
 * like folded fabric. The cursor gently lifts the silk nearby. Decorative only.
 */
export function SilkCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const styles = getComputedStyle(canvas);
    const gold = styles.getPropertyValue("--gold").trim() || "#c6a15b";
    const terracotta = styles.getPropertyValue("--accent").trim() || "#a9542f";
    const cream = "#fffaf3";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let ribbons: Ribbon[] = [];
    const gradients = new Map<string, CanvasGradient>();
    const pointer = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, strength: 0, targetStrength: 0 };

    const buildRibbons = (small: boolean): Ribbon[] => {
      const all: Ribbon[] = [
        { color: gold, base: 0.44, amplitude: 46, frequency: 0.0021, speed: 0.16, phase: 0, spread: 2.2, strands: 14, alpha: 0.26 },
        { color: terracotta, base: 0.52, amplitude: 58, frequency: 0.0016, speed: 0.11, phase: 1.7, spread: 2.6, strands: 12, alpha: 0.13 },
        { color: cream, base: 0.4, amplitude: 38, frequency: 0.0026, speed: 0.2, phase: 3.1, spread: 1.8, strands: 12, alpha: 0.7 },
        { color: gold, base: 0.62, amplitude: 34, frequency: 0.003, speed: 0.13, phase: 4.4, spread: 1.6, strands: 10, alpha: 0.18 },
        { color: terracotta, base: 0.3, amplitude: 28, frequency: 0.0034, speed: 0.09, phase: 2.4, spread: 1.4, strands: 8, alpha: 0.08 },
        { color: cream, base: 0.7, amplitude: 52, frequency: 0.0019, speed: 0.15, phase: 5.2, spread: 2.4, strands: 10, alpha: 0.6 },
        { color: gold, base: 0.22, amplitude: 24, frequency: 0.0028, speed: 0.07, phase: 0.9, spread: 1.2, strands: 7, alpha: 0.12 },
      ];
      return small ? all.slice(0, 5).map((r) => ({ ...r, strands: Math.ceil(r.strands * 0.6) })) : all;
    };

    const gradientFor = (color: string, alpha: number) => {
      const key = `${color}-${alpha}`;
      let gradient = gradients.get(key);
      if (!gradient) {
        gradient = ctx.createLinearGradient(0, 0, width, 0);
        const rgba = (a: number) => {
          const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
          return `rgba(${r}, ${g}, ${b}, ${a})`;
        };
        gradient.addColorStop(0, rgba(0));
        gradient.addColorStop(0.25, rgba(alpha));
        gradient.addColorStop(0.75, rgba(alpha));
        gradient.addColorStop(1, rgba(0));
        gradients.set(key, gradient);
      }
      return gradient;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const small = width < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ribbons = buildRibbons(small);
      gradients.clear();
    };

    const draw = (time: number) => {
      const t = time / 1000;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      // Ease the cursor's influence in and out so the silk never snaps.
      pointer.x += (pointer.targetX - pointer.x) * 0.08;
      pointer.y += (pointer.targetY - pointer.y) * 0.08;
      pointer.strength += (pointer.targetStrength - pointer.strength) * 0.05;

      const step = width < 768 ? 22 : 18;
      const sigma = Math.max(120, width * 0.12);

      for (const ribbon of ribbons) {
        ctx.strokeStyle = gradientFor(ribbon.color, ribbon.alpha);
        for (let s = 0; s < ribbon.strands; s++) {
          const offset = (s - ribbon.strands / 2) * ribbon.spread;
          ctx.beginPath();
          let previousX = -40;
          let previousY = 0;
          for (let x = -40; x <= width + 40; x += step) {
            const wave =
              Math.sin(x * ribbon.frequency + t * ribbon.speed * TAU * 0.25 + ribbon.phase) * ribbon.amplitude +
              Math.sin(x * ribbon.frequency * 2.3 - t * ribbon.speed * 0.9 + ribbon.phase * 1.7) * ribbon.amplitude * 0.35;
            // Strands fan apart and gather again along the ribbon, like folds in silk.
            const fold = 1 + 0.9 * Math.sin(x * 0.004 + t * 0.35 + ribbon.phase + s * 0.05);
            let y = ribbon.base * height + wave + offset * fold * 3;
            if (pointer.strength > 0.01) {
              const dx = x - pointer.x;
              const influence = Math.exp(-(dx * dx) / (2 * sigma * sigma)) * pointer.strength;
              y += (pointer.y - y) * 0.12 * influence;
            }
            if (x === -40) ctx.moveTo(x, y);
            else ctx.quadraticCurveTo(previousX, previousY, (previousX + x) / 2, (previousY + y) / 2);
            previousX = x;
            previousY = y;
          }
          ctx.stroke();
        }
      }
    };

    resize();
    draw(0);
    canvas.setAttribute("data-ready", "");

    if (reduce) {
      const onResize = () => {
        resize();
        draw(0);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let frame = 0;
    let visible = true;
    const loop = (time: number) => {
      draw(time);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    observer.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = event.clientX - rect.left;
      pointer.targetY = event.clientY - rect.top;
      pointer.targetStrength = event.clientY >= rect.top && event.clientY <= rect.bottom ? 1 : 0;
      if (pointer.x < -1000) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
      }
    };
    const onPointerLeave = () => (pointer.targetStrength = 0);

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    start();

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("atelier-silk pointer-events-none", className)} />;
}
