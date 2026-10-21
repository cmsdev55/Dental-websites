import { cn } from "@/lib/utils";

/**
 * Accent call-to-action wrapped in a 1.5px rotating aqua→violet light ring.
 * The ring is a conic gradient layer that spins with `transform`, so it never repaints.
 */
export function GlowButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group relative inline-flex overflow-hidden rounded-full p-[1.5px] shadow-[0_0_40px_-8px_var(--glow-a)] transition-transform duration-300 active:scale-[0.97]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="lumen-spin absolute top-1/2 left-1/2 aspect-square w-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,var(--glow-a)_70deg,var(--glow-b)_140deg,transparent_200deg)]"
      />
      <span className="relative inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-accent px-7 text-base font-medium tracking-tight text-accent-ink transition-colors duration-300 group-hover:bg-[color-mix(in_oklab,var(--accent)_85%,white)]">
        {children}
      </span>
    </a>
  );
}
