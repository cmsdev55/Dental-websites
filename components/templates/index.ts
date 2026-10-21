import { AtelierTemplate } from "@/components/templates/atelier";
import { EditorialTemplate } from "@/components/templates/editorial";
import { LumenTemplate } from "@/components/templates/lumen";
import { StudioTemplate } from "@/components/templates/studio";
import type { Practice, TemplateName } from "@/lib/practices";

/**
 * Every design, keyed by the `template` field in data/practices.json.
 * Heavy, optional pieces (three.js for Lumen, GSAP for pinned sections) are loaded on demand,
 * so a page only pays for them when its design actually uses them.
 */
export const templates: Record<TemplateName, (props: { practice: Practice }) => React.ReactNode> = {
  editorial: EditorialTemplate,
  lumen: LumenTemplate,
  studio: StudioTemplate,
  atelier: AtelierTemplate,
};
