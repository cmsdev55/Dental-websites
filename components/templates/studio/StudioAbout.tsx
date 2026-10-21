import { Check } from "lucide-react";
import Image from "next/image";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { images } from "@/lib/images";
import type { Practice } from "@/lib/practices";
import { scaleIn } from "@/lib/animations";

const values = [
  { label: "We explain before we treat", color: "var(--pop-mint)" },
  { label: "Questions always welcome", color: "var(--pop-sky)" },
  { label: "Comfort first, every visit", color: "var(--pop-pink)" },
];

/** Team intro with a blob-masked placeholder photo and a spinning "say hello" badge. */
export function StudioAbout({ practice }: { practice: Practice }) {
  const subject = practice.doctor ?? "your care team";

  return (
    <section id="about" aria-labelledby="studio-about-title" className="section-y overflow-x-clip bg-card">
      <div className="container-page grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal variants={scaleIn} className="relative mx-auto w-full max-w-md lg:col-span-5">
          <div className="studio-blob relative aspect-[4/5] overflow-hidden bg-[var(--pop-sky)]">
            <Image
              src={images.doctor.src}
              alt={images.doctor.alt}
              fill
              sizes="(min-width: 1024px) 36vw, 90vw"
              className="object-cover"
            />
          </div>
          <PlaceholderBadge className="absolute top-4 left-4">Placeholder photo</PlaceholderBadge>
          <HelloBadge />
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal as="p" className="eyebrow text-accent-deep">
            Meet {subject}
          </Reveal>
          <RevealText
            accentItalic={false}
            id="studio-about-title"
            text="Friendly faces, *gentle hands.*"
            className="font-display mt-4 text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-extrabold tracking-[-0.04em]"
          />

          <Reveal delay={0.1}>
            <div className="mt-8 rounded-[1.5rem] border-2 border-dashed border-[color-mix(in_oklab,var(--ink)_30%,transparent)] p-6">
              <PlaceholderBadge>Placeholder bio</PlaceholderBadge>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                This is where {practice.doctor ? `${practice.doctor}'s` : "your team's"} story goes: training, approach to
                care and what patients can expect at {practice.name}. We&rsquo;ll write it together from your real
                details.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-8 flex flex-wrap gap-2">
              {values.map((value) => (
                <li
                  key={value.label}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-ink"
                  style={{ background: value.color }}
                >
                  <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
                  {value.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HelloBadge() {
  return (
    <div
      aria-hidden="true"
      className="absolute -right-3 -bottom-6 grid size-32 place-items-center rounded-full bg-[var(--pop-sun)] text-ink shadow-[0_16px_30px_-16px_rgb(0_0_0/0.45)] sm:-right-8 md:size-36"
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full animate-[spin_16s_linear_infinite] motion-reduce:animate-none">
        <defs>
          <path id="studio-hello-circle" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
        </defs>
        <text className="fill-current text-[19px] font-bold tracking-[0.25em] uppercase">
          <textPath href="#studio-hello-circle">Say hello · Say hello · Say hello ·</textPath>
        </text>
      </svg>
      <span className="font-display text-2xl font-extrabold">Hi!</span>
    </div>
  );
}
