import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { HoursTable } from "@/components/shared/HoursTable";
import { MapEmbed } from "@/components/shared/MapEmbed";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import type { Practice } from "@/lib/practices";
import { mapsDirectionsUrl, telHref } from "@/lib/utils";

export function Location({ practice }: { practice: Practice }) {
  return (
    <section id="location" aria-labelledby="location-title" className="section-y pt-0 md:pt-0">
      <div className="container-page">
        <Reveal as="p" className="eyebrow text-accent-deep">
          Visit us
        </Reveal>
        <RevealText
          id="location-title"
          text={`Find us in *${practice.city}.*`}
          className="mt-4 text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.02] font-light"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <Reveal className="rounded-[2rem] border border-line bg-card p-7 md:p-10 lg:col-span-5">
            <dl className="space-y-8">
              <div className="flex gap-4">
                <dt className="mt-0.5">
                  <MapPin aria-hidden="true" className="size-5 text-accent-deep" />
                  <span className="sr-only">Address</span>
                </dt>
                <dd>
                  <span className="block font-medium">{practice.name}</span>
                  {practice.address && <span className="block text-muted">{practice.address}</span>}
                  <span className="block text-muted">
                    {practice.city}, {practice.state}
                  </span>
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="mt-0.5">
                  <Phone aria-hidden="true" className="size-5 text-accent-deep" />
                  <span className="sr-only">Phone</span>
                </dt>
                <dd>
                  <a href={telHref(practice.phone)} className="font-medium underline-offset-4 hover:underline">
                    {practice.phone}
                  </a>
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="mt-0.5">
                  <Clock aria-hidden="true" className="size-5 text-accent-deep" />
                  <span className="sr-only">Hours</span>
                </dt>
                <dd className="flex-1">
                  <HoursTable practice={practice} />
                </dd>
              </div>
            </dl>

            <a
              href={mapsDirectionsUrl(practice)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("primary", "mt-10 w-full")}
            >
              <Navigation aria-hidden="true" className="size-4" /> Get directions
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
          </Reveal>

          <Reveal delay={0.1} className="min-h-[22rem] overflow-hidden rounded-[2rem] border border-line bg-primary/10 lg:col-span-7">
            <MapEmbed practice={practice} className="grayscale-[35%]" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
