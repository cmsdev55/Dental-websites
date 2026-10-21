import { Phone } from "lucide-react";
import { BookingCard } from "@/components/shared/BookingCard";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import type { Practice } from "@/lib/practices";
import { telHref } from "@/lib/utils";

export function StudioBooking({ practice }: { practice: Practice }) {
  return (
    <section id="booking" aria-labelledby="studio-booking-title" className="section-y relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute top-24 -left-16 size-56 rounded-full bg-[var(--pop-sky)]/45" />
        <span className="absolute right-[-4rem] bottom-16 size-72 rounded-full bg-[var(--pop-pink)]/40" />
        <span className="absolute top-1/2 left-[45%] size-24 rounded-full bg-[var(--pop-sun)]/60" />
      </div>

      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal as="p" className="eyebrow text-accent-deep">
            Book online
          </Reveal>
          <RevealText
            accentItalic={false}
            id="studio-booking-title"
            text="Pick a time, *we'll handle the rest.*"
            className="font-display mt-4 text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.95] font-extrabold tracking-[-0.04em]"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Three quick steps and you&rsquo;re done. The team at {practice.name} will call to confirm.
            </p>
            <a
              href={telHref(practice.phone)}
              className="group mt-8 inline-flex items-center gap-4 rounded-full border-2 border-ink bg-card py-2 pr-6 pl-2 transition-transform hover:-translate-y-0.5"
            >
              <span className="grid size-12 place-items-center rounded-full bg-[var(--pop-mint)] text-ink">
                <Phone aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-muted">Rather chat?</span>
                <span className="text-lg font-semibold">{practice.phone}</span>
              </span>
            </a>
            <p className="mt-6 max-w-md text-sm text-muted">
              Preview form: requests aren&rsquo;t sent anywhere yet. On the live site they go straight to the front
              desk.
            </p>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" delay={0.1}>
          <BookingCard practice={practice} className="border-2 border-ink shadow-[10px_10px_0_var(--ink)]" />
        </Reveal>
      </div>
    </section>
  );
}
