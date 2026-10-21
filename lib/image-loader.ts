"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Static exports have no Next.js image server, so we let Unsplash's CDN resize,
 * compress and convert (AVIF/WebP) every image for each srcset width.
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith("/")) return `${src}?w=${width}`;

  const url = new URL(src);
  if (url.hostname === "images.unsplash.com") {
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 70));
  }
  return url.href;
}
