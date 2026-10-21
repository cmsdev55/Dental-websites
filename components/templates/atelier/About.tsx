"use client";

import { m } from "motion/react";
import Image from "next/image";
import { EYEBROW, Ornament } from "@/components/templates/atelier/ui";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { RevealText } from "@/components/ui/RevealText";
import { EASE_EXPO_OUT, fadeUp, stagger, viewportOnce } from "@/lib/animations";
import { images } from "@/lib/images";
import type { Practice } from "@/lib/practices";
import { cn } from "@/lib/utils";

const values = [
  "Time to talk before any treatment begins",
  "Conservative, clearly explained recommendations",
  "Comfort considered in every detail",
];

export function About({ practice }: { practice: Practice }) {
  const subject = practice.doctor ?? "your care team";

  return (
    <section id="about" aria-labelledby="about-title" className="section-y bg-card">
      <div className="container-page grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-[19rem] sm:max-w-[26rem]">
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-4 translate-y-4 rounded-t-full border border-[var(--gold)] md:-translate-x-6 md:translate-y-6"
            />
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-primary/10">
              {/* The photo settles from a slow zoom while a cream veil lifts off it (transform only). */}
              <m.div
                className="absolute inset-0"
                initial={{ scale: 1.22 }}
                whileInView={{ scale: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 2, ease: EASE_EXPO_OUT }}
              >
                <Image
                  src={images.doctor.src}
                  alt={images.doctor.alt}
                  fill
                  sizes="(min-width: 1024px) 26rem, 90vw"
                  className="object-cover"
                />
              </m.div>
              <m.div
                aria-hidden="true"
                className="absolute inset-0 origin-top bg-card"
                initial={{ scaleY: 1 }}
                whileInView={{ scaleY: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
              />
              <PlaceholderBadge tone="dark" className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                Placeholder photo
              </PlaceholderBadge>
            </div>
          </div>
        </div>

        <m.div
          className="lg:col-span-6 lg:col-start-7"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger(0.1, 0.15)}
        >
          <m.p variants={fadeUp} className={cn("text-accent-deep", EYEBROW)}>
            Meet {subject}
          </m.p>
          <RevealText
            id="about-title"
            text="Artistry, guided by *listening.*"
            className="mt-5 text-[clamp(2.6rem,5.6vw,5rem)] leading-[0.98] font-light tracking-[-0.01em]"
          />

          <m.div
            variants={fadeUp}
            className="mt-10 border border-dashed border-[color-mix(in_oklab,var(--ink)_30%,transparent)] p-6 md:p-8"
          >
            <PlaceholderBadge>Placeholder bio</PlaceholderBadge>
            <p className="mt-4 leading-relaxed text-muted md:text-lg">
              This is where {practice.doctor ? `${practice.doctor}'s` : "your team's"} story will live: training,
              philosophy of care and what patients can expect at {practice.name}. We&rsquo;ll write it together from
              your real details.
            </p>
          </m.div>

          <m.ul variants={stagger(0.08)} className="mt-10 divide-y divide-line border-y border-line">
            {values.map((value, i) => (
              <m.li key={value} variants={fadeUp} className="flex items-baseline gap-5 py-4">
                <span className="w-6 shrink-0 font-display text-lg text-accent-deep italic">{["i", "ii", "iii"][i]}</span>
                <span className="leading-relaxed">{value}</span>
              </m.li>
            ))}
          </m.ul>

          {practice.doctor && (
            <m.div variants={fadeUp} className="mt-10 flex items-center gap-5">
              <Ornament className="w-16" />
              <p className="font-display text-4xl font-light italic">{practice.doctor}</p>
            </m.div>
          )}
        </m.div>
      </div>
    </section>
  );
}
