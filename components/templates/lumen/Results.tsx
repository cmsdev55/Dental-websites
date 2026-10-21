import { CompareSlider } from "@/components/shared/CompareSlider";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";

export function Results({ practiceName }: { practiceName: string }) {
  return (
    <section id="results" aria-labelledby="results-title" className="section-y overflow-x-clip">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal as="p" className="eyebrow text-accent">
            Smile gallery
          </Reveal>
          <RevealText
            id="results-title"
            text="See the difference, *in a swipe.*"
            className="mt-4 font-display text-[clamp(2.2rem,4.8vw,4rem)] leading-[1.04] font-light tracking-[-0.035em]"
            accentClassName="lumen-gradient-text"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Drag the handle to compare. Real before-and-after cases from {practiceName} will appear here, shared only
              with patient permission.
            </p>
            <PlaceholderBadge tone="dark" className="mt-6">
              Placeholder images, not real patient results
            </PlaceholderBadge>
          </Reveal>
        </div>

        <Reveal className="relative lg:col-span-7" delay={0.1}>
          <div
            aria-hidden="true"
            className="absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(124_227_247/0.16),transparent)] blur-2xl"
          />
          <div className="rounded-[calc(var(--radius-media)+0.75rem)] border border-line bg-card/50 p-2.5 shadow-[0_0_80px_-30px_var(--glow-a)] backdrop-blur-xl md:p-3">
            <CompareSlider className="aspect-[16/11]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
