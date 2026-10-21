import { HeartHandshake, MessagesSquare, Microscope, ShieldCheck } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import type { Practice } from "@/lib/practices";

const card =
  "relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-card/60 p-6 backdrop-blur-xl before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-accent/70 before:to-transparent md:p-8";

/** Glass stat cards. Only real numbers from the data are shown; with none, soft care pillars instead. */
export function ProofStrip({ practice }: { practice: Practice }) {
  const stats = [
    practice.rating !== undefined && {
      key: "rating",
      value: <CountUp value={practice.rating} decimals={1} />,
      label: "Average rating",
      extra: <Stars value={practice.rating} className="text-sm" />,
    },
    practice.reviews !== undefined && {
      key: "reviews",
      value: <CountUp value={practice.reviews} />,
      label: "Patient reviews",
    },
    practice.years !== undefined && {
      key: "years",
      value: <CountUp value={practice.years} suffix="+" />,
      label: "Years of smiles",
    },
  ].filter((s): s is Exclude<typeof s, false> => Boolean(s));

  if (stats.length === 0) {
    const pillars = [
      { icon: HeartHandshake, label: "Gentle, unhurried visits" },
      { icon: MessagesSquare, label: "Clear explanations" },
      { icon: Microscope, label: "Modern techniques" },
      { icon: ShieldCheck, label: "Comfort first" },
    ];
    return (
      <section aria-label="Why patients choose us" className="container-page pb-6">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {pillars.map(({ icon: Icon, label }, i) => (
            <Reveal as="li" key={label} delay={i * 0.08} className={card}>
              <Icon aria-hidden="true" className="size-5 text-accent" strokeWidth={1.5} />
              <p className="mt-6 font-display text-lg leading-snug font-light md:text-xl">{label}</p>
            </Reveal>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section aria-label="At a glance" className="container-page pb-6">
      <dl className="grid gap-3 sm:grid-cols-2 md:auto-cols-fr md:grid-flow-col md:grid-cols-none md:gap-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.key} delay={i * 0.1} className={card}>
            <div className="flex flex-col-reverse gap-3">
              <dt className="text-sm text-muted">{stat.label}</dt>
              <dd className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-5xl leading-none font-light tracking-tight md:text-6xl">
                  {stat.value}
                </span>
                {"extra" in stat && stat.extra}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
