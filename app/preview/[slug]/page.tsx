import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Preloader } from "@/components/shared/Preloader";
import { templates } from "@/components/templates";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { JsonLd } from "@/components/ui/JsonLd";
import { getAllPractices, getPractice, type Practice } from "@/lib/practices";
import { siteConfig } from "@/lib/site";
import { brandColors } from "@/lib/themes";

type Props = { params: Promise<{ slug: string }> };

// Every practice is pre-rendered at build time; unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPractices().map((p) => ({ slug: p.slug }));
}

async function load(params: Props["params"]): Promise<Practice> {
  const { slug } = await params;
  const practice = getPractice(slug);
  if (!practice) notFound();
  return practice;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await load(params);
  const title = `${p.name} | Dentist in ${p.city}, ${p.state}`;
  const description = `${p.name} offers modern, gentle dentistry in ${p.city}, ${p.state}: checkups, cosmetic and restorative care. Book online or call ${p.phone}.`;
  const url = `/preview/${p.slug}/`;
  const image = { url: `/preview/${p.slug}/og.png`, width: 1200, height: 630, alt: `${p.name} website preview` };

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, siteName: p.name, locale: "en_US", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
    robots: siteConfig.indexPreviews ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export async function generateViewport({ params }: Props): Promise<Viewport> {
  const p = await load(params);
  return { themeColor: brandColors(p).surface, colorScheme: p.template === "lumen" ? "dark" : "light" };
}

function dentistSchema(p: Practice): Record<string, unknown> {
  // AggregateRating is intentionally omitted: Google's guidelines don't allow marking up
  // ratings collected on another site (e.g. Google reviews) on your own page.
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: p.name,
    url: `${siteConfig.siteUrl}/preview/${p.slug}/`,
    telephone: p.phone,
    image: `${siteConfig.siteUrl}/preview/${p.slug}/og.png`,
    address: {
      "@type": "PostalAddress",
      ...(p.address && { streetAddress: p.address }),
      addressLocality: p.city,
      addressRegion: p.state,
      addressCountry: "US",
    },
    ...(p.doctor && { employee: { "@type": "Person", name: p.doctor } }),
  };
}

export default async function PracticePreview({ params }: Props) {
  const practice = await load(params);
  const Template = templates[practice.template];

  return (
    <div
      data-template={practice.template}
      data-theme={practice.template === "editorial" ? practice.theme : undefined}
      className="min-h-svh bg-surface text-ink"
    >
      <JsonLd data={dentistSchema(practice)} />
      <a
        href="#main"
        className="sr-only z-[110] rounded-full bg-primary px-5 py-3 text-primary-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <Preloader name={practice.name} city={practice.city} state={practice.state} />

      <SmoothScroll>
        <CustomCursor />
        <Template practice={practice} />
      </SmoothScroll>
    </div>
  );
}
