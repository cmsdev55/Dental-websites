"use client";

import { CalendarCheck, Phone } from "lucide-react";
import { m, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { EASE_EXPO_OUT } from "@/lib/animations";
import { telHref } from "@/lib/utils";

/** Sticky Call / Book bar for phones. Slides up once the visitor scrolls past the top of the hero. */
export function MobileBar({ phone }: { phone: string }) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 320));

  return (
    <m.div
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
      initial={false}
      animate={{ y: visible ? "0%" : "120%" }}
      transition={{ duration: 0.6, ease: EASE_EXPO_OUT }}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="grid grid-cols-2 gap-2 rounded-full border border-line bg-surface/85 p-1.5 shadow-[0_20px_40px_-15px_rgb(0_0_0/0.35)] backdrop-blur-xl">
        <a
          href={telHref(phone)}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-medium text-ink"
        >
          <Phone aria-hidden="true" className="size-4" /> Call
        </a>
        <a
          href="#booking"
          className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent text-sm font-medium text-accent-ink"
        >
          <CalendarCheck aria-hidden="true" className="size-4" /> Book
        </a>
      </div>
    </m.div>
  );
}
