import type { Practice, ThemeName } from "@/lib/practices";

interface BrandColors {
  primary: string;
  primaryInk: string;
  accent: string;
  surface: string;
  ink: string;
}

/**
 * Hex values for places CSS variables can't reach (browser theme-color, Open Graph images).
 * Keep in sync with the [data-theme] and [data-template] blocks in app/globals.css.
 */
export const themeColors: Record<ThemeName, BrandColors> = {
  navy: { primary: "#0f2442", primaryInk: "#f7f2e8", accent: "#c9a45c", surface: "#f8f6f1", ink: "#0e1b2c" },
  teal: { primary: "#083b3e", primaryInk: "#f2f8f6", accent: "#f28a6e", surface: "#f3f7f6", ink: "#0a2224" },
  sand: { primary: "#3a2a21", primaryInk: "#f7efe4", accent: "#c4925f", surface: "#f5efe7", ink: "#2a1d16" },
  sage: { primary: "#27312d", primaryInk: "#eff3ec", accent: "#a6bca3", surface: "#f2f4ef", ink: "#1b211e" },
};

const templateColors = {
  lumen: { primary: "#070a10", primaryInk: "#eef2f8", accent: "#7ce3f7", surface: "#070a10", ink: "#eef2f8" },
  studio: { primary: "#141414", primaryInk: "#fbfaf6", accent: "#8fe3c0", surface: "#fbfaf6", ink: "#141414" },
  atelier: { primary: "#2b1e17", primaryInk: "#f3ece3", accent: "#c6a15b", surface: "#f3ece3", ink: "#2b1e17" },
} satisfies Record<string, BrandColors>;

/** Editorial follows the practice's color theme; the other templates have fixed art direction. */
export function brandColors(p: Practice): BrandColors {
  return p.template === "editorial" ? themeColors[p.theme] : templateColors[p.template];
}
