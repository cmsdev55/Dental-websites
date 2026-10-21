"use client";

import {
  Anchor,
  ArrowUpRight,
  ClockAlert,
  Gem,
  Phone,
  ScanFace,
  Sparkles,
  ToothbrushSparkles,
  type LucideIcon,
} from "lucide-react";
import { m, useMotionValue } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";
import { services, type ServiceIcon } from "@/lib/content";
import { cn, telHref } from "@/lib/utils";
import { TOOTH_SVG_PATH } from "./tooth-shape";

const icons: Record<ServiceIcon, LucideIcon> = {
  cleaning: ToothbrushSparkles,
  whitening: Sparkles,
  aligners: ScanFace,
  implants: Anchor,
  veneers: Gem,
  emergency: ClockAlert,
};

// Bento placement for the six services (lg: 4 columns).
const layout = [
  "md:col-span-2 lg:col-span-2 lg:row-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-1",
  "md:col-span-2 lg:col-span-4",
];

export function Services({ phone }: { phone: string }) {
  return (
    <section id="services" aria-labelledby="services-title" className="section-y">
      <div className="container-page">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal as="p" className="eyebrow text-accent">
              Services
            </Reveal>
            <RevealText
              id="services-title"
              text="Precision care, *start to finish.*"
              className="mt-4 font-display text-[clamp(2.2rem,4.8vw,4rem)] leading-[1.04] font-light tracking-[-0.035em]"
              accentClassName="lumen-gradient-text"
            />
          </div>
          <Reveal className="md:col-span-5" delay={0.15}>
            <p className="text-lg leading-relaxed text-muted">
              Everything from routine cleanings to complete smile makeovers, planned around you and explained in plain
              language.
            </p>
            <p className="mt-3 text-sm text-muted">Sample service menu, tailored to the treatments you offer.</p>
          </Reveal>
        </div>

        <m.ul
          className="mt-14 grid auto-rows-[minmax(15rem,auto)] gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger(0.08)}
        >
          {services.map((service, i) => (
            <m.li key={service.title} variants={fadeUp} className={layout[i]}>
              <Tile
                icon={icons[service.icon]}
                title={service.title}
                body={service.body}
                index={i}
                feature={i === 0}
                wide={i === services.length - 1}
                phone={phone}
              />
            </m.li>
          ))}
        </m.ul>
      </div>
    </section>
  );
}

/** A glass tile with a soft spotlight that follows the cursor (moved with transform only). */
function Tile({
  icon: Icon,
  title,
  body,
  index,
  feature,
  wide,
  phone,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  index: number;
  feature: boolean;
  wide: boolean;
  phone: string;
}) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);

  return (
    <article
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
      }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-card/70 p-6 md:p-8",
        wide && "md:flex-row md:items-center md:justify-between md:gap-10",
      )}
    >
      <m.span
        aria-hidden="true"
        style={{ x, y }}
        className="pointer-events-none absolute -top-48 -left-48 size-96 rounded-full bg-[radial-gradient(closest-side,rgb(124_227_247/0.16),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] border border-accent/0 transition-colors duration-500 group-hover:border-accent/30"
      />

      <div className={cn("relative flex items-start justify-between gap-4", wide && "md:flex-1")}>
        <div className={cn(wide && "md:flex md:items-center md:gap-8")}>
          <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent shadow-[0_0_24px_-6px_var(--glow-a)] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-110 group-hover:-rotate-6">
            <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </span>
          {wide && (
            <div className="mt-8 md:mt-0">
              <h3 className="font-display text-2xl font-light tracking-tight md:text-3xl">{title}</h3>
              <p className="mt-2 max-w-xl leading-relaxed text-muted">{body}</p>
            </div>
          )}
        </div>
        <span className="font-display text-xs text-muted tabular-nums">0{index + 1}</span>
      </div>

      {feature && <ScanIllustration />}

      {!wide && (
        <div className="relative mt-auto pt-10">
          <h3 className={cn("font-display font-light tracking-tight", feature ? "text-3xl md:text-4xl" : "text-xl md:text-2xl")}>
            {title}
          </h3>
          <p className="mt-2 leading-relaxed text-muted">{body}</p>
          <a
            href="#booking"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
            aria-label={`Book: ${title}`}
          >
            Book this
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      )}

      {wide && (
        <a
          href={telHref(phone)}
          className="relative mt-8 inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-full border border-accent/40 px-5 text-sm font-medium text-accent transition-colors hover:bg-accent/10 md:mt-0 md:self-center"
        >
          <Phone aria-hidden="true" className="size-4" /> Call {phone}
        </a>
      )}
    </article>
  );
}

/** A wireframe tooth on a dot grid with a scan line sweeping over it. */
function ScanIllustration() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto my-6 grid w-full max-w-[16rem] flex-1 place-items-center overflow-hidden rounded-2xl bg-[radial-gradient(rgb(124_227_247/0.18)_1px,transparent_1px)] [background-size:14px_14px] py-6 lg:max-w-[20rem]"
    >
      <svg viewBox="-1.3 -1.3 2.6 2.95" className="h-40 w-auto overflow-visible lg:h-52">
        <path d={TOOTH_SVG_PATH} fill="rgb(124 227 247 / 0.06)" stroke="#7ce3f7" strokeWidth="0.018" />
        <path
          d={TOOTH_SVG_PATH}
          fill="none"
          stroke="#8f7cff"
          strokeOpacity="0.5"
          strokeWidth="0.01"
          transform="translate(0.06 0.04) scale(0.9)"
        />
      </svg>
      <span className="lumen-scan absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-accent/25 to-transparent">
        <span className="absolute inset-x-0 top-1/2 h-px bg-accent shadow-[0_0_14px_2px_var(--glow-a)]" />
      </span>
    </div>
  );
}
