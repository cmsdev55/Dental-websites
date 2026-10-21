import { Phone } from "lucide-react";
import { BookingCard } from "@/components/shared/BookingCard";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import type { Practice } from "@/lib/practices";
import { telHref } from "@/lib/utils";

export function Booking({ practice }: { practice: Practice }) {
  return (
    <section id="booking" aria-labelledby="booking-title" className="section-y relative overflow-x-clip">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal as="p" className="eyebrow text-accent">
            Book online
          </Reveal>
          <RevealText
            id="booking-title"
            text="Request your *visit.*"
            className="mt-4 font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1] font-light tracking-[-0.04em]"
            accentClassName="lumen-gradient-text"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Choose a service and a time that suits you. The team at {practice.name} will call to confirm.
            </p>
            <a
              href={telHref(practice.phone)}
              className="group mt-8 inline-flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-card/60 p-4 pr-6 backdrop-blur transition-colors hover:border-accent/50"
            >
              <span className="grid size-12 place-items-center rounded-full bg-accent text-accent-ink shadow-[0_0_24px_-4px_var(--glow-a)]">
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

        <Reveal className="relative lg:col-span-7" delay={0.1}>
          <div
            aria-hidden="true"
            className="absolute -inset-10 -z-10 bg-[radial-gradient(50%_50%_at_30%_30%,rgb(124_227_247/0.14),transparent),radial-gradient(50%_50%_at_75%_75%,rgb(143_124_255/0.16),transparent)]"
          />
          <BookingCard practice={practice} className="bg-card/80 shadow-[0_0_80px_-30px_var(--glow-a)] backdrop-blur-xl" />
        </Reveal>
      </div>
    </section>
  );
}
