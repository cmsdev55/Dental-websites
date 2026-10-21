import { CompareSlider } from "@/components/shared/CompareSlider";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";

export function StudioResults({ practiceName }: { practiceName: string }) {
  return (
    <section id="results" aria-labelledby="studio-results-title" className="section-y">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="relative lg:order-last lg:col-span-7" delay={0.1}>
          <div className="relative rounded-[calc(var(--radius-media)+0.5rem)] border-[6px] border-ink bg-ink shadow-[12px_12px_0_var(--pop-sky)]">
            <CompareSlider />
          </div>
          <span
            aria-hidden="true"
            className="absolute -top-5 right-6 rotate-[6deg] rounded-full bg-[var(--pop-sun)] px-4 py-2 text-sm font-bold text-ink shadow-[0_8px_20px_-10px_rgb(0_0_0/0.4)]"
          >
            Drag me ↔
          </span>
        </Reveal>

        <div className="lg:col-span-5">
          <Reveal as="p" className="eyebrow text-accent-deep">
            Smile gallery
          </Reveal>
          <RevealText
            accentItalic={false}
            id="studio-results-title"
            text="Little tweaks, *big grins.*"
            className="font-display mt-4 text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.95] font-extrabold tracking-[-0.04em]"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Slide to compare. Real before-and-after cases from {practiceName} will live here, always shared with
              patient permission.
            </p>
            <PlaceholderBadge className="mt-6">Placeholder images, not real patient results</PlaceholderBadge>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
