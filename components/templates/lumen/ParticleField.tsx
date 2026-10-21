"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  phase: number;
}

/**
 * Canvas 2D star dust: tiny drifting particles at different depths, faint links between
 * near neighbours, and a subtle parallax toward the cursor. Pauses off-screen and in hidden tabs;
 * reduced motion draws a single still frame.
 */
export function ParticleField({ className, density = 9000 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, width < 768 ? 1.25 : 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(150, Math.round((width * height) / density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.25 + Math.random() * 0.75,
        vx: (Math.random() - 0.5) * 6,
        vy: -2 - Math.random() * 6,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (time: number, dt: number) => {
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      const points: { x: number; y: number; z: number }[] = [];
      for (const p of particles) {
        p.x += p.vx * p.z * dt;
        p.y += p.vy * p.z * dt;
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        const x = p.x + pointer.x * 18 * p.z;
        const y = p.y + pointer.y * 12 * p.z;
        points.push({ x, y, z: p.z });

        const twinkle = 0.55 + 0.45 * Math.sin(time * 0.0015 + p.phase);
        ctx.globalAlpha = (0.25 + p.z * 0.6) * twinkle;
        ctx.fillStyle = p.z > 0.8 ? "#eaffff" : "#7ce3f7";
        ctx.beginPath();
        ctx.arc(x, y, 0.4 + p.z * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Constellation links between close, foreground particles.
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = "#7ce3f7";
      const max = 95;
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        if (a.z < 0.55) continue;
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          if (b.z < 0.55) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d > max) continue;
          ctx.globalAlpha = (1 - d / max) * 0.14;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    let frame = 0;
    let last = performance.now();
    let onScreen = false;

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      draw(now, dt);
      frame = requestAnimationFrame(loop);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      if (still) return;
      if (onScreen && document.visibilityState === "visible") {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(canvas);
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (still) draw(0, 0);
    });
    resizeObserver.observe(canvas);
    const onPointer = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", sync);
    if (still) draw(0, 0);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
