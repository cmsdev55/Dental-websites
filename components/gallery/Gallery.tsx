"use client";

import { ArrowUpRight, Search, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { TemplateName } from "@/lib/practices";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  slug: string;
  name: string;
  city: string;
  state: string;
  template: TemplateName;
  primary: string;
}

export interface GalleryDesign {
  key: TemplateName;
  label: string;
  tagline: string;
  description: string;
  swatches: string[];
  count: number;
}

/** Public showcase: pick a design to filter, search by practice or city, open any live preview. */
export function Gallery({ items, designs }: { items: GalleryItem[]; designs: GalleryDesign[] }) {
  const [design, setDesign] = useState<TemplateName | "all">("all");
  const [query, setQuery] = useState("");
  const labels = Object.fromEntries(designs.map((d) => [d.key, d])) as Record<TemplateName, GalleryDesign>;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        (design === "all" || item.template === design) &&
        (!q || `${item.name} ${item.city} ${item.state}`.toLowerCase().includes(q)),
    );
  }, [items, design, query]);

  return (
    <>
      <section aria-labelledby="designs-title" className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="designs-title" className="text-3xl font-light md:text-4xl">
            Four designs
          </h2>
          <button
            type="button"
            onClick={() => setDesign("all")}
            aria-pressed={design === "all"}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              design === "all" ? "border-ink bg-ink text-surface" : "border-line hover:border-ink",
            )}
          >
            Show all designs
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {designs.map((d) => {
            const active = design === d.key;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setDesign(active ? "all" : d.key)}
                aria-pressed={active}
                className={cn(
                  "group flex flex-col rounded-[1.5rem] border bg-card p-6 text-left transition-[transform,border-color,box-shadow] duration-500 ease-[var(--ease-expo)] hover:-translate-y-1",
                  active
                    ? "border-accent-deep shadow-[0_24px_50px_-28px_rgb(0_0_0/0.45)]"
                    : "border-line hover:shadow-[0_24px_50px_-30px_rgb(0_0_0/0.35)]",
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span aria-hidden="true" className="flex -space-x-1.5">
                    {d.swatches.map((color, i) => (
                      <span
                        key={`${color}-${i}`}
                        className="size-6 rounded-full border-2 border-card shadow-[0_0_0_1px_var(--line)]"
                        style={{ background: color }}
                      />
                    ))}
                  </span>
                  <span className="text-xs text-muted tabular-nums">
                    {d.count} {d.count === 1 ? "preview" : "previews"}
                  </span>
                </span>
                <span className="mt-6 font-display text-2xl">{d.label}</span>
                <span className="eyebrow mt-1 text-accent-deep">{d.tagline}</span>
                <span className="mt-3 text-sm leading-relaxed text-muted">{d.description}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="previews-title" className="container-page mt-20 md:mt-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="previews-title" className="text-3xl font-light md:text-4xl">
              {design === "all" ? "All previews" : `${labels[design].label} previews`}
            </h2>
            <p className="mt-2 text-sm text-muted" aria-live="polite">
              Showing {visible.length} of {items.length}
            </p>
          </div>
          <label className="relative block w-full md:w-80">
            <span className="sr-only">Search by practice or city</span>
            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search practice or city"
              className="h-12 w-full rounded-full border border-line bg-card pr-11 pl-11 text-sm outline-none transition-colors focus:border-accent-deep"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-ink"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            )}
          </label>
        </div>

        {visible.length ? (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => (
              <li key={item.slug}>
                <a
                  href={`/preview/${item.slug}/`}
                  className="group block overflow-hidden rounded-[1.5rem] border border-line bg-card transition-[transform,box-shadow] duration-500 ease-[var(--ease-expo)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.4)]"
                >
                  <span className="relative block aspect-[1200/630] overflow-hidden" style={{ background: item.primary }}>
                    <Image
                      src={`/preview/${item.slug}/og.png`}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="flex items-start justify-between gap-4 p-5">
                    <span className="min-w-0">
                      <span className="block truncate font-display text-xl">{item.name}</span>
                      <span className="mt-0.5 block text-sm text-muted">
                        {item.city}, {item.state}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full border border-line px-3 py-1 text-xs font-medium">
                      {labels[item.template].label}
                    </span>
                  </span>
                  <span className="flex items-center justify-between border-t border-line px-5 py-4 text-sm">
                    <span className="text-muted">{labels[item.template].tagline}</span>
                    <span className="inline-flex items-center gap-1 font-medium">
                      View preview
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 rounded-[1.5rem] border border-dashed border-line p-10 text-center text-muted">
            No previews match &ldquo;{query}&rdquo;
            {design !== "all" && ` in the ${labels[design].label} design`}.
          </p>
        )}
      </section>
    </>
  );
}
