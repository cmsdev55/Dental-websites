import { Phone } from "lucide-react";
import { ButtonArrow, buttonClasses } from "@/components/ui/Button";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import { scaleIn } from "@/lib/animations";
import type { Practice } from "@/lib/practices";
import { telHref } from "@/lib/utils";

/** Sun-yellow sticker card with a spinning starburst. The offer itself is a labeled placeholder. */
export function StudioOffer({ practice }: { practice: Practice }) {
  return (
    <section aria-labelledby="studio-offer-title" className="container-page pb-20 md:pb-28">
      <Reveal
        variants={scaleIn}
        className="relative isolate overflow-hidden rounded-[var(--radius-card)] border-[6px] border-ink bg-[var(--pop-sun)] px-6 py-14 text-ink shadow-[12px_12px_0_var(--ink)] sm:px-10 md:px-16 md:py-20"
      >
        <Starburst />
        <div className="relative max-w-2xl">
          <p className="eyebrow">New patients</p>
          <h2
            id="studio-offer-title"
            className="mt-4 font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-extrabold tracking-[-0.04em]"
          >
            Your first visit, made easy.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">
            Add your new-patient special here, for example a welcome exam, x-rays and cleaning. We&rsquo;ll set the
            wording and price with you.
          </p>
          <PlaceholderBadge className="mt-5">Placeholder offer</PlaceholderBadge>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#booking" className={buttonClasses("primary", "min-h-14 px-7 text-base")}>
              Claim your first visit <ButtonArrow />
            </a>
            <a href={telHref(practice.phone)} className={buttonClasses("outline", "min-h-14 border-2 border-ink px-6 text-base")}>
              <Phone aria-hidden="true" className="size-4" />
              {practice.phone}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Starburst() {
  const points = 14;
  const path = Array.from({ length: points * 2 }, (_, i) => {
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? 98 : 80;
    return `${i === 0 ? "M" : "L"}${(100 + Math.cos(angle) * r).toFixed(1)},${(100 + Math.sin(angle) * r).toFixed(1)}`;
  }).join(" ");

  return (
    <div
      aria-hidden="true"
      className="absolute -top-6 -right-10 grid size-44 place-items-center sm:top-8 sm:right-8 md:size-52"
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full animate-[spin_24s_linear_infinite] motion-reduce:animate-none">
        <path d={`${path} Z`} className="fill-[var(--pop-pink)] stroke-ink" strokeWidth="5" strokeLinejoin="round" />
      </svg>
      <span className="relative rotate-[-10deg] text-center font-display text-lg leading-tight font-extrabold uppercase md:text-xl">
        New
        <br />
        patients
      </span>
    </div>
  );
}
