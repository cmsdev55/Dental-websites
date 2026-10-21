import { ImageResponse } from "next/og";
import { getAllPractices, getPractice } from "@/lib/practices";
import { brandColors, themeColors } from "@/lib/themes";

// A branded share card per practice, rendered once at build time.
// This is what shows up when you text or email a preview link.
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Website preview";

export function generateStaticParams() {
  return getAllPractices().map((p) => ({ slug: p.slug }));
}

const rgba = (hex: string, alpha: number) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/** Fetch Fraunces as TTF for the card. Falls back to the built-in font if offline. */
async function loadFraunces(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@144,300").then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const practice = getPractice(slug);
  const c = practice ? brandColors(practice) : themeColors.navy;
  const font = await loadFraunces();
  const name = practice?.name ?? "Dental practice";
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
          background: c.primary,
          color: c.primaryInk,
          fontFamily: font ? "Fraunces" : "serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -180,
            width: 640,
            height: 640,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${rgba(c.accent, 0.4)} 0%, ${rgba(c.accent, 0)} 70%)`,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: c.accent }}>
          <div style={{ width: 48, height: 2, background: c.accent }} />
          {practice ? `Dentist in ${practice.city}, ${practice.state}` : "Dentist"}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: nameSize, lineHeight: 1.02, letterSpacing: -3, maxWidth: 1000 }}>{name}</div>
          <div style={{ marginTop: 28, fontSize: 36, opacity: 0.8 }}>Modern, gentle dentistry</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, opacity: 0.85 }}>
          <span>{practice?.phone ?? ""}</span>
          <span>Website preview</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Fraunces", data: font, weight: 300, style: "normal" }] : undefined,
    },
  );
}
