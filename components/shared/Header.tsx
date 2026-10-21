"use client";

import { Menu, Phone } from "lucide-react";
import { m, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { MobileMenu } from "@/components/shared/MobileMenu";
import { buttonClasses } from "@/components/ui/Button";
import { EASE_EXPO_OUT } from "@/lib/animations";
import { navLinks } from "@/lib/content";
import type { Practice } from "@/lib/practices";
import { cn, telHref } from "@/lib/utils";

/**
 * Header layouts:
 * - bar     Editorial: wordmark left, links, phone + CTA right.
 * - glass   Lumen: dark glass, links grouped in a floating capsule, glowing CTA.
 * - pill    Studio: the whole header is a floating rounded pill.
 * - center  Atelier: links split around a centered, letter-spaced wordmark.
 */
export type HeaderVariant = "bar" | "glass" | "pill" | "center";

/** Transparent over the hero, frosted once scrolled; hides on scroll down, returns on scroll up. */
export function Header({ practice, variant = "bar" }: { practice: Practice; variant?: HeaderVariant }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (Math.abs(y - previous) < 4) return;
    setHidden(y > previous && y > 200);
  });

  const menuToggle = (
    <button
      ref={menuButton}
      type="button"
      onClick={() => setMenuOpen(true)}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-line lg:hidden"
      aria-label="Open menu"
      aria-expanded={menuOpen}
      aria-controls="mobile-menu"
    >
      <Menu aria-hidden="true" className="size-5" />
    </button>
  );

  const wordmark = (className: string) => (
    <a href="#top" className={cn("min-w-0 truncate", className)} aria-label={`${practice.name}, back to top`}>
      {practice.name}
    </a>
  );

  const links = (className: string, linkClassName: string, list: readonly { href: string; label: string }[] = navLinks) => (
    <ul className={className}>
      {list.map((link) => (
        <li key={link.href}>
          <a href={link.href} className={linkClassName}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );

  let inner: React.ReactNode;

  if (variant === "pill") {
    inner = (
      <div className="px-3 pt-3">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 rounded-full border border-line bg-card/85 pr-2 pl-5 shadow-[0_12px_40px_-20px_rgb(0_0_0/0.3)] backdrop-blur-xl">
          <span className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true" className="size-3 shrink-0 rounded-full bg-[var(--pop-sun)] ring-4 ring-[var(--pop-sun)]/30" />
            {wordmark("font-display text-lg font-bold tracking-tight")}
          </span>
          <nav aria-label="Main" className="hidden lg:block">
            {links(
              "flex items-center gap-1 text-sm font-medium",
              "rounded-full px-4 py-2 transition-colors hover:bg-[var(--pop-mint)]/40",
            )}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <a href="#booking" className={buttonClasses("primary", "hidden min-h-12 px-5 text-sm md:inline-flex")}>
              Book a visit
            </a>
            {menuToggle}
          </div>
        </div>
      </div>
    );
  } else if (variant === "center") {
    const half = Math.ceil(navLinks.length / 2);
    inner = (
      <div className="container-page grid h-[4.5rem] grid-cols-[1fr_auto] items-center gap-6 border-b border-line md:h-24 lg:grid-cols-[1fr_auto_1fr]">
        <nav aria-label="Main" className="hidden lg:block">
          {links(
            "flex items-center gap-8 text-[0.7rem] font-medium tracking-[0.22em] uppercase",
            "transition-colors hover:text-accent-deep",
            navLinks.slice(0, half),
          )}
        </nav>
        {wordmark("font-display text-base tracking-[0.1em] uppercase md:text-2xl md:tracking-[0.18em] lg:text-center")}
        <div className="flex items-center justify-end gap-8">
          <nav aria-label="More" className="hidden lg:block">
            {links(
              "flex items-center gap-8 text-[0.7rem] font-medium tracking-[0.22em] uppercase",
              "transition-colors hover:text-accent-deep",
              navLinks.slice(half),
            )}
          </nav>
          <a
            href="#booking"
            className="hidden border-b border-current pb-1 text-[0.7rem] font-medium tracking-[0.22em] uppercase transition-colors hover:text-accent-deep md:inline-block"
          >
            Book a visit
          </a>
          {menuToggle}
        </div>
      </div>
    );
  } else if (variant === "glass") {
    inner = (
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
        <span className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden="true" className="relative grid size-2.5 shrink-0 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/60 motion-reduce:animate-none" />
            <span className="size-2.5 rounded-full bg-accent shadow-[0_0_12px_var(--glow-a)]" />
          </span>
          {wordmark("font-display text-lg font-semibold tracking-tight")}
        </span>
        <nav aria-label="Main" className="hidden lg:block">
          {links(
            "flex items-center gap-1 rounded-full border border-line bg-card/50 p-1 text-sm backdrop-blur-xl",
            "block rounded-full px-4 py-2 text-ink/75 transition-colors hover:bg-white/8 hover:text-ink",
          )}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="#booking"
            className={buttonClasses(
              "accent",
              "hidden min-h-11 px-5 text-sm shadow-[0_0_30px_-6px_var(--glow-a)] md:inline-flex",
            )}
          >
            Book a visit
          </a>
          {menuToggle}
        </div>
      </div>
    );
  } else {
    inner = (
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
        {wordmark("font-display text-xl tracking-tight md:text-2xl")}
        <nav aria-label="Main" className="hidden lg:block">
          {links(
            "flex items-center gap-8 text-sm",
            "relative py-2 text-ink/80 transition-colors hover:text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-[var(--ease-expo)] hover:after:origin-left hover:after:scale-x-100",
          )}
        </nav>
        <div className="flex shrink-0 items-center gap-2 md:gap-4">
          <a
            href={telHref(practice.phone)}
            className="hidden items-center gap-2 text-sm font-medium xl:inline-flex"
            aria-label={`Call ${practice.name} at ${practice.phone}`}
          >
            <Phone aria-hidden="true" className="size-4" />
            {practice.phone}
          </a>
          <a href="#booking" className={buttonClasses("primary", "hidden min-h-11 px-5 text-sm md:inline-flex")}>
            Book a visit
          </a>
          {menuToggle}
        </div>
      </div>
    );
  }

  return (
    <>
      <m.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !menuOpen ? "-120%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE_EXPO_OUT }}
        onFocusCapture={() => setHidden(false)}
      >
        {/* Glass layer fades in with opacity only. The pill variant carries its own background. */}
        {variant !== "pill" && (
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 border-b border-line bg-surface/75 shadow-[0_10px_30px_-20px_rgb(0_0_0/0.25)] backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-500",
              scrolled ? "opacity-100" : "opacity-0",
            )}
          />
        )}
        <div className="intro-fade relative" style={{ "--d": "0.35s" } as React.CSSProperties}>
          {inner}
        </div>
      </m.header>

      <MobileMenu
        practice={practice}
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
          menuButton.current?.focus();
        }}
      />
    </>
  );
}
