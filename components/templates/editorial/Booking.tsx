"use client";

import { Phone } from "lucide-react";
import { BookingCard } from "@/components/shared/BookingCard";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import type { Practice } from "@/lib/practices";
import { telHref } from "@/lib/utils";

export function Booking({ practice }: { practice: Practice }) {
  return (
    <section id="booking" aria-labelledby="booking-title" className="section-y">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal as="p" className="eyebrow text-accent-deep">
            Book online
          </Reveal>
          <RevealText
            id="booking-title"
            text="Request your *visit.*"
            className="mt-4 text-[clamp(2.5rem,6vw,5rem)] leading-[1] font-light"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Choose a service and a time that suits you. The team at {practice.name} will call to confirm.
            </p>
            <a
              href={telHref(practice.phone)}
              className="group mt-8 inline-flex items-center gap-4 rounded-2xl border border-line p-4 pr-6 transition-colors hover:border-ink"
            >
              <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-ink">
                <Phone aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-muted">Prefer to talk?</span>
                <span className="text-lg font-medium">{practice.phone}</span>
              </span>
            </a>
            <p className="mt-6 max-w-md text-sm text-muted">
              Preview form: requests aren&rsquo;t sent anywhere yet. On the live site they go straight to the front
              desk.
            </p>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" delay={0.1}>
          <BookingCard practice={practice} />
        </Reveal>
      </div>
    </section>
  );
}

