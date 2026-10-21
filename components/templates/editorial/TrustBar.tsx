import { HeartHandshake, MessagesSquare, Microscope, MapPin, Phone } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import type { Practice } from "@/lib/practices";
import { telHref } from "@/lib/utils";

/**
 * Real numbers only: rating, review count and years appear only when they're in the data.
 * With no numbers at all, the bar falls back to soft, non-factual care pillars.
 */
export function TrustBar({ practice }: { practice: Practice }) {
  const stats = [
    practice.rating !== undefined && {
      key: "rating",
      node: <CountUp value={practice.rating} decimals={1} />,
      label: "Average rating",
      extra: <Stars value={practice.rating} className="text-base" />,
    },
    practice.reviews !== undefined && {
      key: "reviews",
      node: <CountUp value={practice.reviews} />,
      label: "Patient reviews",
    },
    practice.years !== undefined && {
      key: "years",
      node: <CountUp value={practice.years} suffix="+" />,
      label: "Years of smiles",
    },
  ].filter((s): s is Exclude<typeof s, false> => Boolean(s));

  if (stats.length === 0) {
    const pillars = [
      { icon: HeartHandshake, label: "Gentle, unhurried visits" },
      { icon: MessagesSquare, label: "Clear explanations" },
      { icon: Microscope, label: "Modern techniques" },
      { icon: MapPin, label: `${practice.city}, ${practice.state}` },
    ];
    return (
      <section aria-label="Why patients choose us" className="border-y border-line">
        <ul className="container-page grid grid-cols-2 gap-x-6 gap-y-6 py-8 md:grid-cols-4 md:py-10">
          {pillars.map(({ icon: Icon, label }, i) => (
            <Reveal as="li" key={label} delay={i * 0.08} className="flex items-center gap-3 text-sm font-medium md:text-base">
              <Icon aria-hidden="true" className="size-5 shrink-0 text-accent-deep" strokeWidth={1.5} />
              {label}
            </Reveal>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section aria-label="At a glance" className="border-y border-line">
      <dl className="container-page grid grid-cols-2 md:grid-flow-col md:auto-cols-fr md:grid-cols-none">
        {stats.map((stat, i) => (
          <Reveal
            key={stat.key}
            delay={i * 0.1}
            className="flex flex-col-reverse justify-end gap-2 border-line py-8 pr-4 md:border-r md:py-12 md:pl-8 md:first:pl-0"
          >
            <dt className="text-sm text-muted">{stat.label}</dt>
            <dd className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-5xl leading-none font-light tracking-tight md:text-6xl">{stat.node}</span>
              {"extra" in stat && stat.extra}
            </dd>
          </Reveal>
        ))}
        <Reveal
          delay={stats.length * 0.1}
          className="col-span-2 flex items-center border-t border-line py-6 md:col-span-1 md:border-t-0 md:py-12 md:pl-8"
        >
          <dt className="sr-only">Phone</dt>
          <dd>
            <a href={telHref(practice.phone)} className="group flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-ink transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-110">
                <Phone aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-muted">Questions? Call us</span>
                <span className="text-lg font-medium">{practice.phone}</span>
              </span>
            </a>
          </dd>
        </Reveal>
      </dl>
    </section>
  );
}
