import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "accent" | "primary" | "outline" | "outline-light" | "ghost";

const base =
  "group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-[0.95rem] font-medium tracking-tight transition-[transform,background-color,color,border-color] duration-300 ease-[var(--ease-expo)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  accent: "bg-accent text-accent-ink hover:bg-[color-mix(in_oklab,var(--accent)_88%,white)]",
  primary: "bg-primary text-primary-ink hover:bg-[color-mix(in_oklab,var(--primary)_88%,white)]",
  outline: "border border-[color-mix(in_oklab,var(--ink)_22%,transparent)] text-ink hover:border-ink",
  "outline-light": "border border-[var(--line-on-primary)] text-primary-ink hover:border-primary-ink",
  ghost: "text-ink hover:text-accent-deep",
};

export function buttonClasses(variant: Variant = "accent", className?: string) {
  return cn(base, variants[variant], className);
}

/** The small circular arrow that slides on hover. */
export function ButtonArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative -mr-2 grid size-8 place-items-center overflow-hidden rounded-full bg-current/10",
        className,
      )}
    >
      <ArrowRight className="size-4 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-6" />
      <ArrowRight className="absolute size-4 -translate-x-6 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0" />
    </span>
  );
}
