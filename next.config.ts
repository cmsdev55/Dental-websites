import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is pre-rendered to plain HTML in /out, so it can be hosted anywhere for free.
  output: "export",
  // /preview/slug/index.html works on every static host (Vercel, Cloudflare Pages, Netlify, S3).
  trailingSlash: true,
  reactStrictMode: true,
  webpack(config) {
    // `motion/react` re-exports framer-motion through `const motion = fm.motion`, which drags the full
    // feature bundle (drag, layout, projection) into every page and defeats <LazyMotion>.
    // Pointing it at framer-motion's own ESM entry restores tree-shaking. Same package, same API.
    config.resolve.alias = { ...config.resolve.alias, "motion/react$": "framer-motion" };
    return config;
  },
  images: {
    // Static export has no image server, so Unsplash's CDN does the resizing via a custom loader.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
