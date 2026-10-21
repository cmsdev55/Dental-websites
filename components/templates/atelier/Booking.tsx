import { Phone } from "lucide-react";
import { EYEBROW } from "@/components/templates/atelier/ui";
import { BookingCard } from "@/components/shared/BookingCard";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import type { Practice } from "@/lib/practices";
import { cn, telHref } from "@/lib/utils";

export function Booking({ practice }: { practice: Practice }) {
  return (
    <section id="booking" aria-labelledby="booking-title" className="section-y border-t border-line">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal as="p" className={cn("text-accent-deep", EYEBROW)}>
            Appointments
          </Reveal>
          <RevealText
            id="booking-title"
            text="Reserve your *visit.*"
            className="mt-5 text-[clamp(2.8rem,6.5vw,5.75rem)] leading-[0.96] font-light tracking-[-0.01em]"
          />
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted">
              Choose a treatment and a time that suits you. The team at {practice.name} will call to confirm.
            </p>
            <a
              href={telHref(practice.phone)}
              className="group mt-10 flex max-w-md items-center justify-between border-y border-line py-5"
            >
              <span>
                <span className={cn("block text-muted", EYEBROW)}>Prefer to talk?</span>
                <span className="mt-1 block font-display text-3xl font-light">{practice.phone}</span>
              </span>
              <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-ink transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-110">
                <Phone aria-hidden="true" className="size-4" />
              </span>
            </a>
            <p className="mt-6 max-w-md text-sm text-muted">
              Preview form: requests aren&rsquo;t sent anywhere yet. On the live site they go straight to the front
              desk.
            </p>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" delay={0.1}>
          <BookingCard practice={practice} className="shadow-[0_50px_100px_-60px_rgb(43_30_23/0.45)]" />
        </Reveal>
      </div>
    </section>
  );
}
