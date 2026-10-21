import { Navigation } from "lucide-react";
import { atelierButton, EYEBROW } from "@/components/templates/atelier/ui";
import { HoursTable } from "@/components/shared/HoursTable";
import { MapEmbed } from "@/components/shared/MapEmbed";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import type { Practice } from "@/lib/practices";
import { cn, mapsDirectionsUrl, telHref } from "@/lib/utils";

export function Location({ practice }: { practice: Practice }) {
  return (
    <section id="location" aria-labelledby="location-title" className="section-y pt-0 md:pt-0">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <Reveal as="p" className={cn("text-accent-deep", EYEBROW)}>
            Visit the atelier
          </Reveal>
          <RevealText
            id="location-title"
            text={`Find us in *${practice.city}.*`}
            className="mt-5 text-[clamp(2.6rem,6vw,5.25rem)] leading-[0.98] font-light tracking-[-0.01em]"
          />
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <Reveal className="flex flex-col border border-line bg-card p-7 md:p-10 lg:col-span-5">
            <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <dt className={cn("text-muted", EYEBROW)}>Address</dt>
                <dd className="mt-3 font-display text-2xl leading-snug font-light">
                  {practice.name}
                  {practice.address && <span className="block">{practice.address}</span>}
                  <span className="block">
                    {practice.city}, {practice.state}
                  </span>
                </dd>
              </div>
              <div>
                <dt className={cn("text-muted", EYEBROW)}>Telephone</dt>
                <dd className="mt-3">
                  <a
                    href={telHref(practice.phone)}
                    className="font-display text-2xl font-light underline-offset-4 hover:underline"
                  >
                    {practice.phone}
                  </a>
                </dd>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <dt className={cn("text-muted", EYEBROW)}>Hours</dt>
                <dd className="mt-4">
                  <HoursTable practice={practice} />
                </dd>
              </div>
            </dl>
            <a
              href={mapsDirectionsUrl(practice)}
              target="_blank"
              rel="noopener noreferrer"
              className={atelierButton("solid", "mt-10 w-full lg:mt-auto")}
            >
              <Navigation aria-hidden="true" className="size-3.5" /> Get directions
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
          </Reveal>

          <Reveal
            delay={0.1}
            className="relative min-h-[24rem] overflow-hidden border border-line bg-primary/10 p-2 lg:col-span-7"
          >
            <div className="h-full min-h-[24rem] overflow-hidden">
              <MapEmbed practice={practice} className="h-full [filter:sepia(0.35)_saturate(0.75)_contrast(0.95)]" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
