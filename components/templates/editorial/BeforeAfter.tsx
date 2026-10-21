"use client";

import { CompareSlider } from "@/components/shared/CompareSlider";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";

export function BeforeAfter({ practiceName }: { practiceName: string }) {
  return (
    <section id="results" aria-labelledby="results-title" className="section-y">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal as="p" className="eyebrow text-accent-deep">
            Smile gallery
          </Reveal>
          <RevealText
            id="results-title"
            text="Small changes, *big confidence.*"
            className="mt-4 text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.02] font-light"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Drag the handle to compare. Real before-and-after cases from {practiceName} will appear here, shared only
              with patient permission.
            </p>
            <PlaceholderBadge className="mt-6">Placeholder images, not real patient results</PlaceholderBadge>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-7" delay={0.1}>
          <CompareSlider />
        </Reveal>
      </div>
    </section>
  );
}
