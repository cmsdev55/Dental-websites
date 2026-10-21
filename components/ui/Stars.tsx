import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Five stars filled to the nearest half. Decorative: always pair with the number as text. */
export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("inline-flex gap-0.5 text-accent", className)}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, Math.round((value - i) * 2) / 2));
        return (
          <span key={i} className="relative inline-block size-[1em]">
            <Star className="absolute inset-0 size-full opacity-30" strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="size-[1em] fill-current" strokeWidth={1.5} />
            </span>
          </span>
        );
      })}
    </span>
  );
}
