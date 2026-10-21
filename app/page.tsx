import type { Metadata } from "next";
import { Gallery } from "@/components/gallery/Gallery";
import { getAllPractices, TEMPLATES } from "@/lib/practices";
import { siteConfig } from "@/lib/site";
import { templateInfo } from "@/lib/templates";
import { brandColors, templateSwatches } from "@/lib/themes";

export const metadata: Metadata = {
  title: `Website previews by ${siteConfig.agencyName}`,
  description: "Browse live dental website previews in four distinct designs and choose the one you love.",
  robots: siteConfig.indexPreviews ? { index: true, follow: true } : { index: false, follow: false },
};

/** Public gallery of every preview, so practices can browse the designs and pick one. */
export default function Home() {
  const practices = getAllPractices();
  const items = practices.map((p) => ({
    slug: p.slug,
    name: p.name,
    city: p.city,
    state: p.state,
    template: p.template,
    primary: brandColors(p).primary,
  }));
  const designs = TEMPLATES.map((key) => ({
    key,
    ...templateInfo[key],
    swatches: templateSwatches(key),
    count: items.filter((item) => item.template === key).length,
  }));

  return (
    <div data-theme="navy" className="min-h-svh bg-surface text-ink">
      <header className="container-page flex items-center justify-between gap-4 py-6">
        {siteConfig.agencyUrl ? (
          <a href={siteConfig.agencyUrl} className="font-display text-xl tracking-tight md:text-2xl">
            {siteConfig.agencyName}
          </a>
        ) : (
          <span className="font-display text-xl tracking-tight md:text-2xl">{siteConfig.agencyName}</span>
        )}
        <span className="text-sm text-muted tabular-nums">
          {items.length} {items.length === 1 ? "preview" : "previews"} · {designs.length} designs
        </span>
      </header>

      <main>
        <section className="container-page pt-12 pb-16 md:pt-20 md:pb-24">
          <p className="eyebrow text-accent-deep">Dental website previews</p>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.6rem,6.5vw,5.75rem)] leading-[1] font-light tracking-[-0.03em]">
            Find the website your practice <span className="text-accent-deep italic">deserves.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Every preview below is a complete, working website. Choose a design, open any preview to explore it, and
            pick the look you love. We&rsquo;ll tailor it to your practice.
          </p>
        </section>

        <Gallery items={items} designs={designs} />
      </main>

      <footer className="container-page mt-24 flex flex-col gap-2 border-t border-line py-8 text-sm text-muted md:flex-row md:justify-between">
        <p>
          Website previews by <span className="text-ink">{siteConfig.agencyName}</span>
        </p>
        <p>Photos, reviews and offers inside previews are placeholders.</p>
      </footer>
    </div>
  );
}
