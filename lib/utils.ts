import type { Practice } from "@/lib/practices";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** "(718) 273-1849" → "tel:+17182731849" */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`;
  return `tel:${digits}`;
}

export function mapsQuery(p: Practice): string {
  return [p.name, p.address, p.city, p.state].filter(Boolean).join(", ");
}

export function mapsEmbedUrl(p: Practice): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery(p))}&output=embed`;
}

export function mapsDirectionsUrl(p: Practice): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery(p))}`;
}

export function hasRating(p: Practice): p is Practice & { rating: number } {
  return typeof p.rating === "number";
}

export function hasReviews(p: Practice): p is Practice & { reviews: number } {
  return typeof p.reviews === "number";
}

export function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
