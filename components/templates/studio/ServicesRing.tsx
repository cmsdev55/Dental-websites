"use client";

import {
  Anchor,
  ChevronLeft,
  ChevronRight,
  ClockAlert,
  Gem,
  ScanFace,
  Sparkles,
  ToothbrushSparkles,
  type LucideIcon,
} from "lucide-react";
import {
  m,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { services, type ServiceIcon } from "@/lib/content";
import { cn } from "@/lib/utils";

const icons: Record<ServiceIcon, LucideIcon> = {
  cleaning: ToothbrushSparkles,
  whitening: Sparkles,
  aligners: ScanFace,
  implants: Anchor,
  veneers: Gem,
  emergency: ClockAlert,
};

const colors = ["var(--pop-sun)", "var(--pop-sky)", "var(--pop-pink)", "var(--pop-mint)", "var(--pop-sky)", "var(--pop-sun)"];
const STEP = 360 / services.length;
const AUTOPLAY_MS = 3400;
const mod = (n: number, m: number) => ((n % m) + m) % m;

export function ServicesRing() {
  return (
    <section id="services" aria-labelledby="studio-services-title" className="section-y overflow-hidden">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal as="p" className="eyebrow text-accent-deep">
            What we do
          </Reveal>
          <RevealText
            accentItalic={false}
            id="studio-services-title"
            text="A full menu of *smile care.*"
            className="font-display mt-4 text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-extrabold tracking-[-0.04em]"
          />
          <Reveal delay={0.15}>
            <p className="mt-5 text-lg text-muted">
              Spin through the essentials. From checkups to complete makeovers, everything is explained in plain
              language before we begin.
            </p>
            <p className="mt-2 text-sm text-muted">Sample service menu, tailored to the treatments you offer.</p>
          </Reveal>
        </div>

        <Ring />

        {/* Reduced motion: a calm grid instead of a spinning ring. */}
        <ul className="mt-14 hidden gap-4 motion-reduce:grid sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <li key={service.title} className="min-h-[19rem]">
              <ServiceCard index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceCard({ index, active = false }: { index: number; active?: boolean }) {
  const service = services[index];
  const Icon = icons[service.icon];
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-[var(--radius-card)] border-2 p-7 text-ink transition-[border-color,box-shadow] duration-500",
        active ? "border-ink shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)]" : "border-transparent",
      )}
      style={{ background: colors[index] }}
    >
      <div className="flex items-start justify-between">
        <span className="grid size-14 place-items-center rounded-2xl bg-card shadow-[0_6px_0_rgb(0_0_0/0.12)]">
          <Icon aria-hidden="true" className="size-6" strokeWidth={1.75} />
        </span>
        <span className="font-display text-sm font-bold tabular-nums">0{index + 1}</span>
      </div>
      <h3 className="mt-auto pt-10 font-display text-2xl leading-tight font-bold tracking-tight md:text-[1.75rem]">
        {service.title}
      </h3>
      <p className="mt-3 leading-relaxed text-ink/80">{service.body}</p>
    </div>
  );
}

/**
 * Six cards on a CSS 3D cylinder. It steps to the next card on its own, spins with a drag or swipe
 * (then settles on the nearest card), and responds to the buttons and arrow keys.
 */
function Ring() {
  const stage = useRef<HTMLDivElement>(null);
  const rotation = useMotionValue(0);
  const spin = useSpring(rotation, { stiffness: 90, damping: 20, mass: 0.9 });
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const drag = useRef<{ x: number; start: number; lastX: number; lastT: number; velocity: number; moved: boolean } | null>(
    null,
  );
  const inView = useInView(stage, { amount: 0.35 });

  useMotionValueEvent(rotation, "change", (r) => setActive(mod(Math.round(-r / STEP), services.length)));

  const goTo = (delta: number) => rotation.set(Math.round(rotation.get() / STEP) * STEP - delta * STEP);

  useEffect(() => {
    if (!inView || hovering || drag.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => goTo(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
    // goTo only reads the rotation value, so re-running on `active` is enough.
  }, [inView, hovering, active]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest("button")) return;
    drag.current = {
      x: event.clientX,
      start: rotation.get(),
      lastX: event.clientX,
      lastT: event.timeStamp,
      velocity: 0,
      moved: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = event.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setInteracted(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (!d.moved) return;
    const dt = Math.max(1, event.timeStamp - d.lastT);
    d.velocity = (event.clientX - d.lastX) / dt;
    d.lastX = event.clientX;
    d.lastT = event.timeStamp;
    rotation.set(d.start + dx * 0.32);
  };

  const release = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    // Fling: carry the release velocity forward, then settle on the nearest card.
    const projected = rotation.get() + d.velocity * 220 * 0.32;
    rotation.set(Math.round(projected / STEP) * STEP);
  };

  return (
    <div
      className="relative mt-12 motion-reduce:hidden md:mt-16"
      role="region"
      aria-roledescription="carousel"
      aria-label="Services"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          setInteracted(true);
          goTo(1);
        }
        if (event.key === "ArrowLeft") {
          setInteracted(true);
          goTo(-1);
        }
      }}
    >
      <div
        ref={stage}
        className="studio-ring cursor-grab touch-pan-y py-6 select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        data-cursor="hover"
      >
        <div className="studio-ring__cylinder">
          <m.div className="studio-ring__spin" style={{ rotateY: spin }}>
            {services.map((service, i) => (
              <Face key={service.title} index={i} spin={spin} active={active === i} />
            ))}
          </m.div>
        </div>
      </div>

      <p className="sr-only" aria-live={interacted ? "polite" : "off"}>
        {`Showing ${services[active].title}, ${active + 1} of ${services.length}`}
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            setInteracted(true);
            goTo(-1);
          }}
          aria-label="Previous service"
          className="grid size-12 place-items-center rounded-full border-2 border-ink transition-transform hover:-translate-x-0.5"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>
        <span className="min-w-[12ch] text-center font-display text-sm font-bold">
          <span className="tabular-nums">0{active + 1}</span> / 0{services.length}
        </span>
        <button
          type="button"
          onClick={() => {
            setInteracted(true);
            goTo(1);
          }}
          aria-label="Next service"
          className="grid size-12 place-items-center rounded-full bg-primary text-primary-ink transition-transform hover:translate-x-0.5"
        >
          <ChevronRight aria-hidden="true" className="size-5" />
        </button>
      </div>
    </div>
  );
}

/** One face of the cylinder; it fades as it turns away from the viewer. */
function Face({ index, spin, active }: { index: number; spin: MotionValue<number>; active: boolean }) {
  const opacity = useTransform(spin, (r) => {
    const angle = mod(index * STEP + r + 180, 360) - 180;
    return 1 - Math.min(1, Math.abs(angle) / 180) * 0.6;
  });
  return (
    <m.article
      className="studio-ring__face"
      style={{ "--i": index, opacity } as MotionStyle}
      aria-label={`${index + 1} of ${services.length}: ${services[index].title}`}
    >
      <ServiceCard index={index} active={active} />
    </m.article>
  );
}
