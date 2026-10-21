"use client";

import { Check } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { RevealText } from "@/components/ui/RevealText";
import { EASE_EXPO_OUT, fadeUp, stagger, viewportOnce } from "@/lib/animations";
import { images } from "@/lib/images";
import type { Practice } from "@/lib/practices";

const values = [
  "We explain before we treat, in plain language",
  "Unhurried appointments with time for your questions",
  "Comfort first, from the chair to the follow-up",
];

export function About({ practice }: { practice: Practice }) {
  const reduce = useReducedMotion();
  const subject = practice.doctor ?? "your care team";

  return (
    <section id="about" aria-labelledby="about-title" className="section-y bg-card">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          {/* Clip-path wipe from the bottom up, with the photo settling from a gentle zoom. */}
          <m.div
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-primary/10"
            initial={{ clipPath: "inset(100% 0% 0% 0% round 2rem)", opacity: 0 }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0% round 2rem)", opacity: 1 }}
            viewport={viewportOnce}
            // Reduced motion: skip the wipe and just fade (markup stays identical for hydration).
            transition={{
              clipPath: reduce ? { duration: 0 } : { duration: 1.4, ease: EASE_EXPO_OUT },
              opacity: { duration: reduce ? 0.6 : 0.3 },
            }}
          >
            <m.div
              className="absolute inset-0"
              initial={{ scale: 1.25 }}
              whileInView={{ scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 1.8, ease: EASE_EXPO_OUT }}
            >
              <Image
                src={images.doctor.src}
                alt={images.doctor.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </m.div>
            <PlaceholderBadge tone="dark" className="absolute top-4 left-4">
              Placeholder photo
            </PlaceholderBadge>
          </m.div>
        </div>

        <m.div
          className="lg:col-span-6 lg:col-start-7"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger(0.1, 0.2)}
        >
          <m.p variants={fadeUp} className="eyebrow text-accent-deep">
            Meet {subject}
          </m.p>
          <RevealText
            id="about-title"
            text="Care that starts with *listening.*"
            className="mt-4 text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.02] font-light"
          />

          <m.div
            variants={fadeUp}
            className="mt-8 rounded-2xl border border-dashed border-[color-mix(in_oklab,var(--ink)_30%,transparent)] p-6"
          >
            <PlaceholderBadge>Placeholder bio</PlaceholderBadge>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              This is where {practice.doctor ? `${practice.doctor}'s` : "your team's"} story goes: training, approach to
              care and what patients can expect at {practice.name}. We&rsquo;ll write it together from your real
              details.
            </p>
          </m.div>

          <m.ul variants={stagger(0.08)} className="mt-8 space-y-3">
            {values.map((value) => (
              <m.li key={value} variants={fadeUp} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
                  <Check aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                </span>
                <span className="leading-relaxed">{value}</span>
              </m.li>
            ))}
          </m.ul>

          {practice.doctor && (
            <m.p variants={fadeUp} className="mt-10 font-display text-3xl font-light italic">
              {practice.doctor}
            </m.p>
          )}
        </m.div>
      </div>
    </section>
  );
}
