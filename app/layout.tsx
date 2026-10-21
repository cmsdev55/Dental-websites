import type { Metadata } from "next";
import { Bricolage_Grotesque, Cormorant_Garamond, Inter, Sora } from "next/font/google";
import localFont from "next/font/local";
import { siteConfig } from "@/lib/site";
import "./globals.css";

/**
 * Fraunces, self-hosted at its display optical size (opsz 144), Latin subset only.
 * The full variable font from Google is ~150KB; these two cuts are ~55KB, which keeps
 * the hero fast on mobile. Files come from Google Fonts (SIL OFL 1.1, see app/fonts/OFL.txt).
 */
const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-144-300-400.woff2", weight: "300 400", style: "normal" },
    { path: "./fonts/fraunces-144-italic-300.woff2", weight: "300", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  // Display faces are not preloaded: each template uses one, and the browser only downloads
  // the faces a page actually renders. Preloading all four would waste bandwidth on every page.
  preload: false,
});

/** Lumen */
const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-sora",
  display: "swap",
  preload: false,
});

/** Studio */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
  preload: false,
});

/** Atelier */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const PRELOADER_SCRIPT = `try{var k="preloader:"+location.pathname.replace(/\\/$/,"");if(sessionStorage.getItem(k))document.documentElement.setAttribute("data-preloader","skip");else sessionStorage.setItem(k,"1")}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: `Website previews by ${siteConfig.agencyName}`,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The preloader script sets data-preloader on <html> before hydration.
    <html lang="en" className={`${fraunces.variable} ${sora.variable} ${bricolage.variable} ${cormorant.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        {/* Runs before first paint: skip the preloader if this page was already seen this session. */}
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
