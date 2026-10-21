import { cn } from "@/lib/utils";

/** Small, widely letter-spaced capitals used for labels throughout Atelier. */
export const EYEBROW = "text-[0.7rem] font-medium tracking-[0.28em] uppercase";

/** Atelier's quiet, letter-spaced pill buttons. */
export function atelierButton(variant: "solid" | "line" | "light" = "solid", className?: string) {
  return cn(
    "group inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-8 text-[0.72rem] font-medium tracking-[0.22em] uppercase transition-[background-color,color,border-color] duration-500",
    variant === "solid" && "bg-accent text-accent-ink hover:bg-[color-mix(in_oklab,var(--accent)_86%,black)]",
    variant === "line" && "border border-[color-mix(in_oklab,var(--ink)_32%,transparent)] text-ink hover:border-ink",
    variant === "light" && "border border-[var(--line-on-primary)] text-primary-ink hover:border-primary-ink",
    className,
  );
}

/** A thin gold rule with a small diamond at its center. Decorative. */
export function Ornament({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 12"
      className={cn("h-3 w-28 text-[var(--gold)]", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M0 6h50M70 6h50" />
      <path d="M60 1.5 64.5 6 60 10.5 55.5 6Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const ROMAN = ["I", "II", "III", "IV", "V", "VI"];
