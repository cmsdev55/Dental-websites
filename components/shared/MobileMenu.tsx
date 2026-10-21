"use client";

import { Phone, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef } from "react";
import { scrollToElement, useLenis } from "@/components/providers/SmoothScroll";
import { ButtonArrow, buttonClasses } from "@/components/ui/Button";
import { EASE_EXPO_OUT, EASE_IN_OUT } from "@/lib/animations";
import { navLinks } from "@/lib/content";
import type { Practice } from "@/lib/practices";
import { telHref } from "@/lib/utils";

const links = [...navLinks, { href: "#booking", label: "Book a visit" }];

/** Full-screen menu that drops in like a curtain, with links rising in one after another. */
export function MobileMenu({
  practice,
  open,
  onClose,
}: {
  practice: Practice;
  open: boolean;
  onClose: () => void;
}) {
  const lenis = useLenis();
  const panel = useRef<HTMLDivElement>(null);

  // Close first, then scroll once the menu has released the page (Lenis resets any scroll started while paused).
  const navigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const id = event.currentTarget.hash.slice(1);
    onClose();
    window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!target) return;
      history.pushState(null, "", `#${id}`);
      scrollToElement(lenis, target);
    }, 80);
  };

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      // Keep Tab inside the open menu.
      if (event.key === "Tab" && panel.current) {
        const focusable = panel.current.querySelectorAll<HTMLElement>("a, button");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("a")?.focus());

    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
      lenis?.start();
    };
  }, [open, lenis, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          ref={panel}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="on-primary fixed inset-0 z-[60] flex flex-col bg-primary text-primary-ink lg:hidden"
          initial={{ y: "-100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%", transition: { duration: 0.6, ease: EASE_IN_OUT, delay: 0.1 } }}
          transition={{ duration: 0.75, ease: EASE_IN_OUT }}
        >
          <div className="container-page flex h-[4.5rem] items-center justify-between">
            <span className="truncate font-display text-xl">{practice.name}</span>
            <button
              type="button"
              onClick={onClose}
              className="grid size-11 place-items-center rounded-full border border-[var(--line-on-primary)]"
              aria-label="Close menu"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          <nav aria-label="Mobile" className="container-page flex flex-1 flex-col justify-center">
            <ul className="space-y-1">
              {links.map((link, i) => (
                <li key={link.href} className="overflow-hidden">
                  <m.a
                    href={link.href}
                    onClick={navigate}
                    className="block py-1.5 font-display text-[clamp(2.25rem,10vw,3.5rem)] leading-tight font-light tracking-tight"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%", transition: { delay: 0.3 + i * 0.06, duration: 0.9, ease: EASE_EXPO_OUT } }}
                    exit={{ y: "110%", transition: { duration: 0.3, ease: EASE_IN_OUT } }}
                  >
                    <span className="mr-4 align-middle font-sans text-xs tracking-widest text-primary-muted">
                      0{i + 1}
                    </span>
                    {link.label}
                  </m.a>
                </li>
              ))}
            </ul>
          </nav>

          <m.div
            className="container-page flex flex-col gap-3 pb-[max(2rem,env(safe-area-inset-bottom))]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.65, duration: 0.8, ease: EASE_EXPO_OUT } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <a href="#booking" onClick={navigate} className={buttonClasses("accent", "w-full")}>
              Book your visit <ButtonArrow />
            </a>
            <a href={telHref(practice.phone)} className={buttonClasses("outline-light", "w-full")}>
              <Phone aria-hidden="true" className="size-4" /> Call {practice.phone}
            </a>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
