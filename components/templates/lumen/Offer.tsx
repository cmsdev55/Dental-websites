import { Phone } from "lucide-react";
import { ButtonArrow, buttonClasses } from "@/components/ui/Button";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import { scaleIn } from "@/lib/animations";
import type { Practice } from "@/lib/practices";
import { telHref } from "@/lib/utils";

/** New-patient card framed by a slowly rotating light ring. The offer itself is a labeled placeholder. */
export function Offer({ practice }: { practice: Practice }) {
  return (
    <section aria-labelledby="offer-title" className="container-page pb-20 md:pb-28">
      <Reveal variants={scaleIn}>
        <div className="relative overflow-hidden rounded-[calc(var(--radius-card)+0.5rem)] p-px">
          <span
            aria-hidden="true"
            className="lumen-spin lumen-spin--slow absolute top-1/2 left-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,var(--glow-a)_60deg,transparent_120deg,transparent_180deg,var(--glow-b)_240deg,transparent_300deg)]"
          />
          <div className="relative isolate overflow-hidden rounded-[calc(var(--radius-card)+0.5rem-1px)] bg-card px-6 py-14 sm:px-10 md:px-16 md:py-20">
            <div
              aria-hidden="true"
              className="absolute -top-32 -right-24 -z-10 size-[28rem] rounded-full bg-[radial-gradient(closest-side,rgb(143_124_255/0.22),transparent)]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-40 -left-20 -z-10 size-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(124_227_247/0.16),transparent)]"
            />
            <div className="max-w-2xl">
              <p className="eyebrow text-accent">New patients</p>
              <h2
                id="offer-title"
                className="mt-4 font-display text-[clamp(2.2rem,4.8vw,4rem)] leading-[1.04] font-light tracking-[-0.035em]"
              >
                Your first visit, <span className="lumen-gradient-text">beautifully simple.</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Add your new-patient special here, for example a welcome exam, x-rays and cleaning. We&rsquo;ll set the
                wording and price with you.
              </p>
              <PlaceholderBadge tone="dark" className="mt-5">
                Placeholder offer
              </PlaceholderBadge>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#booking" className={buttonClasses("primary", "min-h-14 px-7 text-base")}>
                  Book your first visit <ButtonArrow />
                </a>
                <a href={telHref(practice.phone)} className={buttonClasses("outline", "min-h-14 px-6 text-base")}>
                  <Phone aria-hidden="true" className="size-4" />
                  {practice.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
