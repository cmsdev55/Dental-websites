import { MapPin, Navigation, Phone } from "lucide-react";
import { HoursTable } from "@/components/shared/HoursTable";
import { MapEmbed } from "@/components/shared/MapEmbed";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import type { Practice } from "@/lib/practices";
import { mapsDirectionsUrl, telHref } from "@/lib/utils";

export function Location({ practice }: { practice: Practice }) {
  return (
    <section id="location" aria-labelledby="location-title" className="section-y pt-0 md:pt-0">
      <div className="container-page">
        <Reveal as="p" className="eyebrow text-accent">
          Visit us
        </Reveal>
        <RevealText
          id="location-title"
          text={`Find us in *${practice.city}.*`}
          className="mt-4 font-display text-[clamp(2.2rem,4.8vw,4rem)] leading-[1.04] font-light tracking-[-0.035em]"
          accentClassName="lumen-gradient-text"
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <Reveal className="relative min-h-[24rem] overflow-hidden rounded-[var(--radius-media)] border border-line bg-card lg:order-2 lg:col-span-8">
            <MapEmbed practice={practice} className="lumen-map absolute inset-0" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_60px_rgb(7_10_16/0.8)]"
            />
          </Reveal>

          <Reveal
            delay={0.1}
            className="rounded-[var(--radius-card)] border border-line bg-card/70 p-7 backdrop-blur-xl lg:order-1 lg:col-span-4"
          >
            <div className="flex gap-4">
              <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
              <p>
                <span className="block font-medium">{practice.name}</span>
                {practice.address && <span className="block text-muted">{practice.address}</span>}
                <span className="block text-muted">
                  {practice.city}, {practice.state}
                </span>
              </p>
            </div>
            <div className="mt-6 flex gap-4">
              <Phone aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
              <a href={telHref(practice.phone)} className="font-medium underline-offset-4 hover:underline">
                {practice.phone}
              </a>
            </div>
            <HoursTable practice={practice} className="mt-8" />
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
        </div>
      </div>
    </section>
  );
}
