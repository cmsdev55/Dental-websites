import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small, unmissable label for anything that isn't the practice's real content yet. */
export function PlaceholderBadge({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1 text-xs font-medium",
        tone === "light"
          ? "border-[color-mix(in_oklab,var(--ink)_30%,transparent)] bg-card/85 text-ink backdrop-blur"
          : "border-[var(--line-on-primary)] bg-primary/70 text-primary-ink backdrop-blur",
        className,
      )}
    >
      <Info aria-hidden="true" className="size-3.5 shrink-0" />
      {children}
    </span>
  );
}
