import { MapPin, Navigation, Phone } from "lucide-react";
import { HoursTable } from "@/components/shared/HoursTable";
import { MapEmbed } from "@/components/shared/MapEmbed";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import type { Practice } from "@/lib/practices";
import { mapsDirectionsUrl, telHref } from "@/lib/utils";

export function StudioLocation({ practice }: { practice: Practice }) {
  return (
    <section id="location" aria-labelledby="studio-location-title" className="section-y pt-0 md:pt-0">
      <div className="container-page">
        <Reveal as="p" className="eyebrow text-accent-deep">
          Come say hi
        </Reveal>
        <RevealText
          accentItalic={false}
          id="studio-location-title"
          text={`Find us in *${practice.city}.*`}
          className="font-display mt-4 text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.95] font-extrabold tracking-[-0.04em]"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <Reveal className="rounded-[var(--radius-card)] border-2 border-ink bg-[var(--pop-mint)]/35 p-7 md:p-10 lg:col-span-5">
            <div className="space-y-6">
              <p className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                <span>
                  <span className="block font-semibold">{practice.name}</span>
                  {practice.address && <span className="block text-muted">{practice.address}</span>}
                  <span className="block text-muted">
                    {practice.city}, {practice.state}
                  </span>
                </span>
              </p>
              <p className="flex gap-3">
                <Phone aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                <a href={telHref(practice.phone)} className="font-semibold underline-offset-4 hover:underline">
                  {practice.phone}
                </a>
              </p>
              <div>
                <h3 className="mb-3 font-display text-xl font-bold">Opening hours</h3>
                <HoursTable practice={practice} className="rounded-2xl bg-card p-4" />
              </div>
            </div>
            <a
              href={mapsDirectionsUrl(practice)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("primary", "mt-8 w-full")}
            >
              <Navigation aria-hidden="true" className="size-4" /> Get directions
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
          </Reveal>

          <Reveal
            delay={0.1}
            className="min-h-[22rem] overflow-hidden rounded-[var(--radius-card)] border-[6px] border-ink bg-[var(--pop-sky)]/30 shadow-[10px_10px_0_var(--pop-sun)] lg:col-span-7"
          >
            <MapEmbed practice={practice} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
