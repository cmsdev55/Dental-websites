"use client";

import { ArrowUpRight } from "lucide-react";
import { m, useMotionValue, useSpring, useTransform, useVelocity } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { EYEBROW } from "@/components/templates/atelier/ui";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";
import { services, type ServiceIcon } from "@/lib/content";
import { cn } from "@/lib/utils";

const PREVIEW_WIDTH = 256;
const PREVIEW_GAP = 48;

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

/** Placeholder photography per service (Unsplash). */
const photos: Record<ServiceIcon, { src: string; alt: string }> = {
  cleaning: { src: unsplash("1606811971618-4486d14f3f99"), alt: "Close-up of a gentle dental check with a mirror" },
  whitening: { src: unsplash("1580489944761-15a19d654956"), alt: "Woman with a bright, natural smile" },
  aligners: { src: unsplash("1609840114035-3c981b782dfe"), alt: "Person fitting a clear aligner" },
  implants: { src: unsplash("1593022356769-11f762e25ed9"), alt: "Model of a dental implant beside natural teeth" },
  veneers: { src: unsplash("1607990283143-e81e7a2c9349"), alt: "Person laughing with a confident smile" },
  emergency: { src: unsplash("1588776814546-daab30f310ce"), alt: "Two dentists caring for a patient" },
};

/**
 * An editorial treatment list. On desktop, hovering a row floats its photograph beside the cursor
 * (spring-smoothed, tilting with the cursor's speed); on touch screens each row shows a small thumbnail.
 */
export function Services() {
  const list = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 24, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 180, damping: 24, mass: 0.6 });
  const velocity = useVelocity(springX);
  const rotate = useSpring(useTransform(velocity, [-1800, 1800], [-9, 9], { clamp: true }), {
    stiffness: 120,
    damping: 20,
  });

  const onPointerMove = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse" || !list.current) return;
    const rect = list.current.getBoundingClientRect();
    // The preview sits to the right of the cursor (so it never hides the row title), kept inside the list.
    x.set(Math.min(event.clientX - rect.left, rect.width - PREVIEW_WIDTH - PREVIEW_GAP));
    y.set(event.clientY - rect.top);
  };

  return (
    <section id="services" aria-labelledby="services-title" className="section-y pt-0 md:pt-0">
      <div className="container-page">
        <div className="grid gap-8 border-b border-line pb-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal as="p" className={cn("text-accent-deep", EYEBROW)}>
              Treatments
            </Reveal>
            <RevealText
              id="services-title"
              text="A considered menu of *care.*"
              className="mt-5 text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.98] font-light tracking-[-0.01em]"
            />
          </div>
          <Reveal className="md:col-span-4 md:col-start-9" delay={0.15}>
            <p className="leading-relaxed text-muted">
              From routine cleanings to subtle cosmetic refinements, every treatment begins with listening.
            </p>
            <p className="mt-3 text-sm text-muted">Sample service menu, tailored to the treatments you offer.</p>
          </Reveal>
        </div>

        <div
          ref={list}
          className="relative"
          onPointerMove={onPointerMove}
          onPointerLeave={() => setActive(null)}
        >
          <m.ol initial="hidden" whileInView="show" viewport={viewportOnce} variants={stagger(0.07)}>
            {services.map((service, i) => (
              <m.li key={service.title} variants={fadeUp} className="border-b border-line">
                <a
                  href="#booking"
                  aria-label={`Book: ${service.title}`}
                  onPointerEnter={(event) => event.pointerType === "mouse" && setActive(i)}
                  className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 py-7 md:grid-cols-[4rem_1fr_minmax(0,22rem)_auto] md:gap-x-8 md:py-10"
                >
                  {/* Small arch thumbnail on touch screens */}
                  <span className="relative row-span-2 h-[4.5rem] w-14 shrink-0 overflow-hidden rounded-t-full bg-primary/10 md:hidden">
                    <Image src={photos[service.icon].src} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span className={cn("hidden text-muted tabular-nums md:block", EYEBROW)}>0{i + 1}</span>

                  {/* Title: the italic twin crossfades in on hover (opacity + transform only). */}
                  <span className="relative block font-display text-[clamp(1.75rem,4.2vw,3.5rem)] leading-[1.05] font-light tracking-[-0.01em]">
                    <span className="block transition-[opacity,transform] duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 group-hover:opacity-0 md:group-hover:translate-x-5">
                      {service.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 block text-accent-deep italic opacity-0 transition-[opacity,transform] duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 group-hover:opacity-100 md:group-hover:translate-x-5"
                    >
                      {service.title}
                    </span>
                  </span>

                  <span className="col-start-2 text-sm leading-relaxed text-muted md:col-start-3 md:row-start-1 md:text-base">
                    {service.body}
                  </span>
                  <span className="col-start-3 row-span-2 row-start-1 grid size-11 place-items-center rounded-full border border-line transition-[background-color,color,border-color] duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink md:col-start-4 md:row-span-1 md:size-14">
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:rotate-45"
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-[var(--gold)] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100"
                  />
                </a>
              </m.li>
            ))}
          </m.ol>

          {/* Cursor-following preview (mouse only; hidden on touch screens) */}
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-10 hidden [@media(hover:hover)_and_(pointer:fine)]:lg:block"
            style={{ x: springX, y: springY, rotate }}
          >
            <m.div
              className="relative -mt-44 ml-12 h-[22rem] w-64 overflow-hidden rounded-t-full shadow-[0_40px_80px_-30px_rgb(43_30_23/0.5)]"
              initial={false}
              animate={{ opacity: active === null ? 0 : 1, scale: active === null ? 0.85 : 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {services.map((service, i) => (
                <m.div
                  key={service.icon}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.12 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image src={photos[service.icon].src} alt="" fill sizes="256px" className="object-cover" />
                </m.div>
              ))}
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
