import { Phone } from "lucide-react";
import { ButtonArrow, buttonClasses } from "@/components/ui/Button";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import { scaleIn } from "@/lib/animations";
import type { Practice } from "@/lib/practices";
import { telHref } from "@/lib/utils";

/** New-patient banner. The offer itself is a labeled placeholder; we never invent prices or deals. */
export function OfferBanner({ practice }: { practice: Practice }) {
  return (
    <section aria-labelledby="offer-title" className="container-page pb-20 md:pb-28">
      <Reveal
        variants={scaleIn}
        className="relative isolate overflow-hidden rounded-[2.5rem] bg-accent px-6 py-14 text-accent-ink sm:px-10 md:px-16 md:py-20"
      >
        <RotatingBadge />
        <div
          aria-hidden="true"
          className="absolute -right-24 -bottom-24 -z-10 size-96 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,white_45%,transparent),transparent)]"
        />

        <div className="max-w-2xl">
          <p className="eyebrow">New patients</p>
          <h2 id="offer-title" className="mt-4 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] font-light">
            Your first visit, <span className="italic">made simple.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">
            Add your new-patient special here, for example a welcome exam, x-rays and cleaning. We&rsquo;ll set the
            wording and price with you.
          </p>
          <PlaceholderBadge className="mt-5">Placeholder offer</PlaceholderBadge>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#booking" className={buttonClasses("primary", "min-h-14 px-7 text-base")}>
              Book your first visit <ButtonArrow />
            </a>
            <a
              href={telHref(practice.phone)}
              className={buttonClasses(
                "outline",
                "min-h-14 border-[color-mix(in_oklab,var(--accent-ink)_35%,transparent)] px-6 text-base text-accent-ink hover:border-accent-ink",
              )}
            >
              <Phone aria-hidden="true" className="size-4" />
              {practice.phone}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/** A slowly spinning circular label, purely decorative. */
function RotatingBadge() {
  const text = "New patients · Welcome · New patients · Welcome · ";
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      className="absolute top-8 right-8 hidden size-40 animate-[spin_28s_linear_infinite] motion-reduce:animate-none lg:block xl:size-48"
    >
      <defs>
        <path id="offer-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <text className="fill-current text-[15px] font-medium tracking-[0.32em] uppercase">
        <textPath href="#offer-circle">{text}</textPath>
      </text>
      <circle cx="100" cy="100" r="5" className="fill-current" />
    </svg>
  );
}
