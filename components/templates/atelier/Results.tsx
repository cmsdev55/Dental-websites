import { EYEBROW } from "@/components/templates/atelier/ui";
import { CompareSlider } from "@/components/shared/CompareSlider";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { cn } from "@/lib/utils";

/** Before/after comparison set in a tall arch with a gold hairline. */
export function Results({ practiceName }: { practiceName: string }) {
  return (
    <section id="results" aria-labelledby="results-title" className="section-y">
      <div className="container-page grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal as="p" className={cn("text-accent-deep", EYEBROW)}>
            Before &amp; after
          </Reveal>
          <RevealText
            id="results-title"
            text="Quietly *transformative.*"
            className="mt-5 text-[clamp(2.6rem,6vw,5.25rem)] leading-[0.98] font-light tracking-[-0.01em]"
          />
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted">
              Drag the handle to compare. Real cases from {practiceName} will be shown here, only ever with each
              patient&rsquo;s permission.
            </p>
            <PlaceholderBadge className="mt-7">Placeholder images, not real patient results</PlaceholderBadge>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
          <div className="relative mx-auto max-w-[32rem]">
            <span
              aria-hidden="true"
              className="absolute -inset-3 rounded-t-full border border-[var(--gold)]/70 md:-inset-5"
            />
            <CompareSlider labels="middle" className="aspect-[4/5]! rounded-t-full rounded-b-[var(--radius-media)]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
