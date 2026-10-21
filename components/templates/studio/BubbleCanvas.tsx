"use client";

import { useEffect, useRef } from "react";

interface Bubble {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
  wobble: number;
  vx: number;
  life: number;
  sprite: HTMLCanvasElement;
}

interface Burst {
  x: number;
  y: number;
  r: number;
  age: number;
  color: string;
}

const BURST_TIME = 0.45;

/** Read the template's pop colors so the bubbles always match the palette. */
function palette(el: HTMLElement): string[] {
  const css = getComputedStyle(el);
  const read = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  return [read("--pop-sun", "#ffd45c"), read("--pop-sky", "#9cc2ff"), read("--pop-pink", "#ffb3c7"), read("--pop-mint", "#8fe3c0")];
}

/** Pre-render one shaded bubble so each frame is a cheap drawImage. */
function makeSprite(r: number, color: string, glossy: boolean, dpr: number): HTMLCanvasElement {
  const size = Math.ceil(r * 2 * dpr) + 4;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  const c = r + 2 / dpr;

  const body = ctx.createRadialGradient(c - r * 0.35, c - r * 0.4, r * 0.05, c, c, r);
  if (glossy) {
    // Candy-like sphere: bright core falling off into a saturated, slightly darker rim.
    body.addColorStop(0, "rgba(255,255,255,0.95)");
    body.addColorStop(0.28, color);
    body.addColorStop(0.9, color);
    body.addColorStop(1, "rgba(20,20,20,0.18)");
  } else {
    // Soap bubble: clear in the middle, tinted towards the edge.
    body.addColorStop(0, "rgba(255,255,255,0.05)");
    body.addColorStop(0.62, "rgba(255,255,255,0.12)");
    body.addColorStop(0.9, color + "aa");
    body.addColorStop(1, "rgba(255,255,255,0.55)");
  }
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.fill();

  // Rim light
  ctx.strokeStyle = glossy ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.75)";
  ctx.lineWidth = Math.max(1, r * 0.04);
  ctx.beginPath();
  ctx.arc(c, c, r * 0.97, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();

  // Specular highlights
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.ellipse(c - r * 0.38, c - r * 0.42, r * 0.22, r * 0.12, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.arc(c + r * 0.42, c + r * 0.38, r * 0.07, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

/**
 * Glossy "mouthwash" bubbles that rise and wobble, drift away from the cursor or finger,
 * and occasionally pop. Click/tap a bubble to pop it. Decorative only (aria-hidden).
 * Paused off-screen and in hidden tabs; reduced motion renders a single still frame.
 */
export function BubbleCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const colors = palette(host);
    let width = 0;
    let height = 0;
    let dpr = 1;
    let bubbles: Bubble[] = [];
    let bursts: Burst[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let frame = 0;
    let last = 0;
    let visible = false;

    const random = (min: number, max: number) => min + Math.random() * (max - min);

    const spawn = (anywhere: boolean): Bubble => {
      const r = random(10, 46) * Math.min(1, width / 420 + 0.35);
      const glossy = Math.random() < 0.55;
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: random(r, width - r),
        y: anywhere ? random(r, height) : height + r + random(0, 60),
        r,
        speed: random(18, 42) + (46 - r) * 0.5,
        phase: random(0, Math.PI * 2),
        wobble: random(0.6, 1.6),
        vx: 0,
        life: random(5, 14),
        sprite: makeSprite(r, color, glossy, dpr),
      };
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, width < 768 ? 1.5 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(30, Math.max(14, (width * height) / 13000)));
      bubbles = Array.from({ length: count }, () => spawn(true));
    };

    const pop = (b: Bubble, i: number) => {
      bursts.push({ x: b.x, y: b.y, r: b.r, age: 0, color: colors[i % colors.length] });
      bubbles[i] = spawn(false);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const b of bubbles) {
        // Squash and stretch as the bubble wobbles.
        const s = Math.sin(time * b.wobble * 2 + b.phase) * 0.05;
        const size = b.sprite.width / dpr;
        ctx.drawImage(b.sprite, b.x - (size * (1 + s)) / 2, b.y - (size * (1 - s)) / 2, size * (1 + s), size * (1 - s));
      }
      for (const burst of bursts) {
        const t = burst.age / BURST_TIME;
        ctx.globalAlpha = 1 - t;
        ctx.strokeStyle = burst.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, burst.r * (1 + t * 0.7), 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        for (let k = 0; k < 7; k++) {
          const angle = (k / 7) * Math.PI * 2;
          const d = burst.r * (0.9 + t * 1.1);
          ctx.beginPath();
          ctx.arc(burst.x + Math.cos(angle) * d, burst.y + Math.sin(angle) * d, 2.2 * (1 - t), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    };

    const step = (dt: number, time: number) => {
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.y -= b.speed * dt;
        b.x += (Math.sin(time * b.wobble + b.phase) * 14 + b.vx) * dt;
        b.vx *= 0.94;
        b.life -= dt;

        if (pointer.active) {
          const dx = b.x - pointer.x;
          const dy = b.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          const reach = b.r + 90;
          if (dist < reach && dist > 0.01) {
            const force = (1 - dist / reach) * 900 * dt;
            b.vx += (dx / dist) * force * 4;
            b.y += (dy / dist) * force;
          }
        }
        b.x = Math.min(width - b.r * 0.5, Math.max(b.r * 0.5, b.x));

        if (b.y + b.r < 0) bubbles[i] = spawn(false);
        else if (b.life <= 0 && b.y < height * 0.75) pop(b, i);
      }
      bursts = bursts.filter((burst) => (burst.age += dt) < BURST_TIME);
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      step(dt, now / 1000);
      draw(now / 1000);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduce || frame || !visible || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const local = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const onMove = (event: PointerEvent) => {
      Object.assign(pointer, local(event), { active: true });
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onDown = (event: PointerEvent) => {
      const { x, y } = local(event);
      const hit = bubbles.findIndex((b) => Math.hypot(b.x - x, b.y - y) < b.r + 6);
      if (hit >= 0) pop(bubbles[hit], hit);
      if (reduce) draw(0);
    };

    resize();
    draw(0);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    observer.observe(host);
    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now() / 1000);
    });
    resizeObserver.observe(host);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
