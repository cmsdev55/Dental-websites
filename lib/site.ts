export const siteConfig = {
  agencyName: process.env.NEXT_PUBLIC_AGENCY_NAME || "Your Agency",
  agencyUrl: process.env.NEXT_PUBLIC_AGENCY_URL || "",
  /** Explicit NEXT_PUBLIC_SITE_URL, else the production domain Vercel provides at build time. */
  siteUrl: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
  ).replace(/\/$/, ""),
  /** Keep previews out of search results until the practice has signed off. */
  indexPreviews: process.env.NEXT_PUBLIC_INDEX_PREVIEWS === "true",
};
