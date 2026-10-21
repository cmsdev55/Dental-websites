import { atelierButton, EYEBROW, Ornament } from "@/components/templates/atelier/ui";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import { scaleIn } from "@/lib/animations";
import type { Practice } from "@/lib/practices";
import { cn, telHref } from "@/lib/utils";

/** New-patient card framed by a double gold hairline. The offer itself is a labeled placeholder. */
export function Offer({ practice }: { practice: Practice }) {
  return (
    <section aria-labelledby="offer-title" className="container-page pb-24 md:pb-32">
      <Reveal variants={scaleIn} className="relative border border-[var(--gold)] bg-card p-2 md:p-3">
        <div className="flex flex-col items-center border border-[var(--gold)]/60 px-6 py-16 text-center md:px-16 md:py-24">
          <Ornament />
          <p className={cn("mt-8 text-accent-deep", EYEBROW)}>For new patients</p>
          <h2
            id="offer-title"
            className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,5.4vw,4.75rem)] leading-[1] font-light tracking-[-0.01em]"
          >
            Your first visit, <span className="text-accent-deep italic">beautifully simple.</span>
          </h2>
          <p className="mt-7 max-w-xl leading-relaxed text-muted md:text-lg">
            Describe your new-patient welcome here, for example an exam, x-rays and a gentle clean. We&rsquo;ll
            finalise the wording and price with you.
          </p>
          <PlaceholderBadge className="mt-6">Placeholder offer</PlaceholderBadge>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <a href="#booking" className={atelierButton("solid")}>
              Reserve your visit
            </a>
            <a href={telHref(practice.phone)} className={cn("border-b border-current pb-1", EYEBROW)}>
              {practice.phone}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
