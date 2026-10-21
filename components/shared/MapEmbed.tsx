import type { Practice } from "@/lib/practices";
import { cn, mapsEmbedUrl } from "@/lib/utils";

/** Google Maps embed for "{name}, {city}, {state}". Native lazy-loading keeps it off the critical path. */
export function MapEmbed({ practice, className }: { practice: Practice; className?: string }) {
  return (
    <iframe
      title={`Map showing ${practice.name} in ${practice.city}, ${practice.state}`}
      src={mapsEmbedUrl(practice)}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={cn("block h-full min-h-[22rem] w-full border-0", className)}
    />
  );
}
