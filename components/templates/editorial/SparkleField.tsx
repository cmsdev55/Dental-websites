"use client";

import { useEffect, useRef } from "react";

interface Sparkle {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
  drift: number;
  tint: number;
}

/**
 * Canvas layer of four-point sparkles that twinkle, drift upward and brighten near the cursor.
 * Starts when the browser is idle (never competes with first paint), pauses off-screen and in
 * background tabs, caps pixel density, and draws a single still frame for reduced motion.
 */
export function SparkleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const styles = getComputedStyle(canvas);
    const accent = styles.getPropertyValue("--accent").trim() || "#c9a45c";
    const ink = styles.getPropertyValue("--primary").trim() || "#0f2442";
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let sparkles: Sparkle[] = [];
    let frame = 0;
    let visible = false;
    let started = false;
    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, rect.width < 768 ? 1.5 : 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(60, (width * height) / 18000));
      sparkles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 2 + Math.random() * 5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.2,
        drift: 4 + Math.random() * 10,
        tint: Math.random(),
      }));
    };

    const star = (x: number, y: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.quadraticCurveTo(x, y, x, y + r);
      ctx.quadraticCurveTo(x, y, x - r, y);
      ctx.quadraticCurveTo(x, y, x, y - r);
      ctx.fill();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = time / 1000;
      for (const s of sparkles) {
        if (!still) {
          s.y -= (s.drift / 60) * 0.5;
          if (s.y < -10) {
            s.y = height + 10;
            s.x = Math.random() * width;
          }
        }
        const twinkle = still ? 0.6 : (Math.sin(t * s.speed + s.phase) + 1) / 2;
        const near = Math.max(0, 1 - Math.hypot(s.x - pointer.x, s.y - pointer.y) / 160);
        ctx.globalAlpha = Math.min(1, 0.15 + twinkle * 0.55 + near * 0.6);
        ctx.fillStyle = s.tint > 0.3 ? accent : ink;
        star(s.x, s.y, s.size * (0.55 + twinkle * 0.45 + near * 0.8));
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      draw(time);
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      if (!started) return;
      if (still) draw(0);
      else if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      play();
    });
    const resizeObserver = new ResizeObserver(() => {
      resize();
      play();
    });

    const start = () => {
      started = true;
      resize();
      observer.observe(canvas);
      resizeObserver.observe(canvas);
      canvas.style.opacity = "1";
      play();
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const idleId = idle(start);

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", play);

    return () => {
      cancelIdle(idleId);
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", play);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ opacity: 0, transition: "opacity 1.2s ease" }}
    />
  );
}
