"use client";

import {
  Anchor,
  ArrowUpRight,
  ClockAlert,
  Gem,
  ScanFace,
  Sparkles,
  ToothbrushSparkles,
  type LucideIcon,
} from "lucide-react";
import { m } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { TiltCard } from "@/components/ui/TiltCard";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";
import { services, type ServiceIcon } from "@/lib/content";

const icons: Record<ServiceIcon, LucideIcon> = {
  cleaning: ToothbrushSparkles,
  whitening: Sparkles,
  aligners: ScanFace,
  implants: Anchor,
  veneers: Gem,
  emergency: ClockAlert,
};

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-y">
      <div className="container-page">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal as="p" className="eyebrow text-accent-deep">
              Services
            </Reveal>
            <RevealText
              id="services-title"
              text="Everything your smile needs, *in one calm place.*"
              className="mt-4 text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.02] font-light"
            />
          </div>
          <Reveal className="md:col-span-5" delay={0.15}>
            <p className="text-lg leading-relaxed text-muted">
              From routine cleanings to complete smile makeovers, care is planned around you and explained in plain
              language.
            </p>
            <p className="mt-3 text-sm text-muted">Sample service menu, tailored to the treatments you offer.</p>
          </Reveal>
        </div>

        <m.ul
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger(0.09)}
        >
          {services.map((service, i) => {
            const Icon = icons[service.icon];
            return (
              <m.li key={service.title} variants={fadeUp}>
                <TiltCard className="flex min-h-[19rem] flex-col rounded-[1.75rem] border border-line bg-card p-7 md:p-8">
                  <div className="flex items-start justify-between">
                    <span className="relative grid size-14 place-items-center rounded-2xl border border-line text-accent-deep transition-colors duration-500 group-hover:text-accent-ink">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 scale-50 rounded-2xl bg-accent opacity-0 transition-[transform,opacity] duration-500 ease-[var(--ease-expo)] group-hover:scale-100 group-hover:opacity-100"
                      />
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="relative size-6 group-hover:animate-[icon-pop_0.7s_var(--ease-expo)]"
                      />
                    </span>
                    <span className="font-display text-sm text-muted tabular-nums">0{i + 1}</span>
                  </div>
                  <h3 className="mt-auto pt-10 text-2xl font-normal tracking-tight md:text-[1.7rem]">
                    {service.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">{service.body}</p>
                  <a
                    href="#booking"
                    className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-medium text-ink"
                    aria-label={`Book: ${service.title}`}
                  >
                    Book this
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </TiltCard>
              </m.li>
            );
          })}
        </m.ul>
      </div>
    </section>
  );
}
