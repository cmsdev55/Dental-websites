import type { TemplateName } from "@/lib/practices";

/** How each design is described in the public gallery. */
export const templateInfo: Record<TemplateName, { label: string; tagline: string; description: string }> = {
  editorial: {
    label: "Editorial",
    tagline: "Refined & photographic",
    description: "Elegant serif type, generous photography and a pinned, story-like walk through the visit.",
  },
  lumen: {
    label: "Lumen",
    tagline: "Dark & cinematic",
    description: "A real-time 3D tooth, glowing details and a starfield. Modern, high-tech and memorable.",
  },
  studio: {
    label: "Studio",
    tagline: "Bright & playful",
    description: "Bold type, interactive bubbles and a 3D services carousel. Friendly for families and kids.",
  },
  atelier: {
    label: "Atelier",
    tagline: "Warm & luxurious",
    description: "Flowing silk animation, arched frames and quiet luxury for boutique cosmetic practices.",
  },
};
