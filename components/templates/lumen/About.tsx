import { Check } from "lucide-react";
import Image from "next/image";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { scaleIn } from "@/lib/animations";
import { images } from "@/lib/images";
import type { Practice } from "@/lib/practices";

const values = [
  "Every step explained before it happens",
  "Unhurried appointments with time for questions",
  "Comfort first, from the chair to the follow-up",
];

export function About({ practice }: { practice: Practice }) {
  const subject = practice.doctor ?? "your care team";

  return (
    <section id="about" aria-labelledby="about-title" className="section-y overflow-x-clip">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal variants={scaleIn} className="relative lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-media)] border border-line bg-card">
            {/* Duotone: a grayscale photo tinted aqua→violet through a color blend layer. */}
            <Image
              src={images.doctor.src}
              alt={images.doctor.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover grayscale"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(140deg,var(--glow-a),var(--glow-b))] opacity-55 mix-blend-color"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
            <PlaceholderBadge tone="dark" className="absolute top-4 left-4">
              Placeholder photo
            </PlaceholderBadge>
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-6 -left-6 -z-10 size-48 rounded-full bg-[radial-gradient(closest-side,rgb(124_227_247/0.25),transparent)]"
          />
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal as="p" className="eyebrow text-accent">
            Meet {subject}
          </Reveal>
          <RevealText
            id="about-title"
            text="Precision, with a *gentle touch.*"
            className="mt-4 font-display text-[clamp(2.2rem,4.8vw,4rem)] leading-[1.04] font-light tracking-[-0.035em]"
            accentClassName="lumen-gradient-text"
          />
          <Reveal delay={0.1}>
            <div className="mt-8 rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--ink)_30%,transparent)] bg-card/40 p-6">
              <PlaceholderBadge tone="dark">Placeholder bio</PlaceholderBadge>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                This is where {practice.doctor ? `${practice.doctor}'s` : "your team's"} story goes: training, approach
                to care and what patients can expect at {practice.name}. We&rsquo;ll write it together from your real
                details.
              </p>
            </div>
          </Reveal>
          <ul className="mt-8 space-y-3">
            {values.map((value, i) => (
              <Reveal as="li" key={value} delay={0.15 + i * 0.08} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                  <Check aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                </span>
                <span className="leading-relaxed">{value}</span>
              </Reveal>
            ))}
          </ul>
          {practice.doctor && (
            <Reveal delay={0.4}>
              <p className="mt-10 font-display text-2xl font-light">{practice.doctor}</p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
