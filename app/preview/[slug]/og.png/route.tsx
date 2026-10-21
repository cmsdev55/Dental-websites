import { ImageResponse } from "next/og";
import { getAllPractices, getPractice, type Practice, type TemplateName } from "@/lib/practices";
import { themeColors } from "@/lib/themes";

/**
 * A branded share card per practice, rendered once at build time to /preview/<slug>/og.png.
 * It's what shows up when you text or email a preview link, and the gallery thumbnail, so each
 * card is styled like its design. (A real .png path, so every host serves it as an image.)
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPractices().map((p) => ({ slug: p.slug }));
}

const rgba = (hex: string, alpha: number) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/** Fetch a Google font as TTF (Satori can't read woff2). Falls back to the built-in font if offline. */
async function loadFont(query: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${query}`).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

interface CardStyle {
  font: { family: string; query: string; weight: 300 | 400 | 600 | 800 };
  bg: string;
  ink: string;
  muted: string;
  accent: string;
  tagline: string;
  nameWeight: number;
  nameTracking: number;
  uppercase?: boolean;
  decor: React.ReactNode;
}

function cardStyle(template: TemplateName, p: Practice): CardStyle {
  switch (template) {
    case "lumen":
      return {
        font: { family: "Sora", query: "Sora:wght@600", weight: 600 },
        bg: "#070a10",
        ink: "#eef2f8",
        muted: "#a1acbd",
        accent: "#7ce3f7",
        tagline: "The future of gentle dentistry",
        nameWeight: 600,
        nameTracking: -3,
        decor: (
          <>
            <div style={{ position: "absolute", top: -260, right: -160, width: 720, height: 720, borderRadius: 9999, background: `radial-gradient(circle, ${rgba("#7ce3f7", 0.35)} 0%, ${rgba("#7ce3f7", 0)} 65%)` }} />
            <div style={{ position: "absolute", top: 290, right: 160, width: 640, height: 640, borderRadius: 9999, background: `radial-gradient(circle, ${rgba("#8f7cff", 0.3)} 0%, ${rgba("#8f7cff", 0)} 65%)` }} />
            <div style={{ position: "absolute", top: 150, right: 120, width: 300, height: 300, borderRadius: 9999, border: `2px solid ${rgba("#7ce3f7", 0.35)}` }} />
          </>
        ),
      };
    case "studio":
      return {
        font: { family: "Bricolage Grotesque", query: "Bricolage+Grotesque:wght@800", weight: 800 },
        bg: "#fbfaf6",
        ink: "#141414",
        muted: "#555555",
        accent: "#0d7350",
        tagline: "Big smiles start here",
        nameWeight: 800,
        nameTracking: -4,
        decor: (
          <>
            <div style={{ position: "absolute", top: -90, right: -60, width: 360, height: 360, borderRadius: 9999, background: "#ffd45c" }} />
            <div style={{ position: "absolute", top: 210, right: 230, width: 150, height: 150, borderRadius: 9999, background: "#8fe3c0" }} />
            <div style={{ position: "absolute", top: 468, right: 250, width: 230, height: 230, borderRadius: 9999, background: "#ffb3c7" }} />
            <div style={{ position: "absolute", top: 228, right: -20, width: 80, height: 80, borderRadius: 9999, background: "#9cc2ff" }} />
          </>
        ),
      };
    case "atelier":
      return {
        font: { family: "Cormorant Garamond", query: "Cormorant+Garamond:wght@400", weight: 400 },
        bg: "#f3ece3",
        ink: "#2b1e17",
        muted: "#6b594c",
        accent: "#9a4a28",
        tagline: "Refined, gentle dentistry",
        nameWeight: 400,
        nameTracking: -1,
        decor: (
          <>
            <div style={{ position: "absolute", top: 70, right: 60, width: 240, height: 560, borderRadius: "120px 120px 8px 8px", background: "#e6d8c6" }} />
            <div style={{ position: "absolute", top: 50, right: 40, width: 240, height: 560, borderRadius: "120px 120px 8px 8px", border: "2px solid #c6a15b" }} />
          </>
        ),
      };
    default: {
      const c = themeColors[p.theme];
      return {
        font: { family: "Fraunces", query: "Fraunces:opsz,wght@144,300", weight: 300 },
        bg: c.primary,
        ink: c.primaryInk,
        muted: rgba(c.primaryInk, 0.75),
        accent: c.accent,
        tagline: "Modern, gentle dentistry",
        nameWeight: 300,
        nameTracking: -3,
        decor: (
          <div style={{ position: "absolute", top: -220, right: -180, width: 640, height: 640, borderRadius: 9999, background: `radial-gradient(circle, ${rgba(c.accent, 0.4)} 0%, ${rgba(c.accent, 0)} 70%)` }} />
        ),
      };
    }
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const practice = getPractice(slug);
  if (!practice) return new Response("Not found", { status: 404 });

  const s = cardStyle(practice.template, practice);
  const font = await loadFont(s.font.query);
  const name = practice.name;
  const nameSize = name.length > 28 ? 76 : name.length > 18 ? 92 : 112;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: s.bg,
          color: s.ink,
          fontFamily: font ? s.font.family : "serif",
          position: "relative",
        }}
      >
        {s.decor}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: s.accent }}>
          <div style={{ width: 48, height: 2, background: s.accent }} />
          {`Dentist in ${practice.city}, ${practice.state}`}
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 780 }}>
          <div style={{ fontSize: nameSize, lineHeight: 1.02, letterSpacing: s.nameTracking, fontWeight: s.nameWeight }}>{name}</div>
          <div style={{ marginTop: 28, fontSize: 36, color: s.muted }}>{s.tagline}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: s.muted }}>
          <span>{practice.phone}</span>
          <span>Website preview</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: font ? [{ name: s.font.family, data: font, weight: s.font.weight, style: "normal" }] : undefined,
    },
  );
}
