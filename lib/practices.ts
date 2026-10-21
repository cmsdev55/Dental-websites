import raw from "@/data/practices.json";

/** Completely different site designs. Each has its own layout, typography and signature graphics. */
export const TEMPLATES = ["editorial", "lumen", "studio", "atelier"] as const;
export type TemplateName = (typeof TEMPLATES)[number];

/** Color themes. They recolor the Editorial template; the other templates have their own art direction. */
export const THEMES = ["navy", "teal", "sand", "sage"] as const;
export type ThemeName = (typeof THEMES)[number];

export interface HoursRow {
  days: string;
  time: string;
}

export interface Practice {
  slug: string;
  name: string;
  city: string;
  state: string;
  phone: string;
  template: TemplateName;
  theme: ThemeName;
  doctor?: string;
  rating?: number;
  reviews?: number;
  /** Years in practice. Only shown when you add it by hand; never inferred. */
  years?: number;
  /** Street address. Improves the map pin and JSON-LD when provided. */
  address?: string;
  /** Real opening hours. Without them the page shows clearly labeled sample hours. */
  hours?: HoursRow[];
}

const text = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const number = (value: unknown): number | undefined => {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

function parseHours(value: unknown): HoursRow[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const rows = value
    .map((row) => ({ days: text(row?.days), time: text(row?.time) }))
    .filter((row): row is HoursRow => Boolean(row.days && row.time));
  return rows.length ? rows : undefined;
}

function normalize(input: Record<string, unknown>, index: number): Practice {
  const slug = text(input.slug);
  const name = text(input.name);
  const city = text(input.city);
  const state = text(input.state);
  const phone = text(input.phone);

  if (!slug || !name || !city || !state || !phone) {
    throw new Error(
      `data/practices.json entry #${index + 1} needs slug, name, city, state and phone (got ${JSON.stringify(input)}).`,
    );
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`data/practices.json: slug "${slug}" must be lowercase letters, numbers and dashes.`);
  }

  const rating = number(input.rating);
  const reviews = number(input.reviews);
  const years = number(input.years);
  const theme = THEMES.find((t) => t === input.theme) ?? "navy";
  const template = TEMPLATES.find((t) => t === input.template) ?? "editorial";

  return {
    slug,
    name,
    city,
    state,
    phone,
    template,
    theme,
    doctor: text(input.doctor),
    rating: rating !== undefined && rating > 0 && rating <= 5 ? Math.round(rating * 10) / 10 : undefined,
    reviews: reviews !== undefined && reviews >= 1 ? Math.round(reviews) : undefined,
    years: years !== undefined && years >= 1 ? Math.round(years) : undefined,
    address: text(input.address),
    hours: parseHours(input.hours),
  };
}

const practices: Practice[] = (raw as Record<string, unknown>[]).map(normalize);

const seen = new Set<string>();
for (const p of practices) {
  if (seen.has(p.slug)) throw new Error(`data/practices.json: duplicate slug "${p.slug}".`);
  seen.add(p.slug);
}

export function getAllPractices(): Practice[] {
  return practices;
}

export function getPractice(slug: string): Practice | undefined {
  return practices.find((p) => p.slug === slug);
}
