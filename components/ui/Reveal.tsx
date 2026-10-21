"use client";

import { m, type Variants } from "motion/react";
import { fadeUp, viewportOnce, withDelay } from "@/lib/animations";

/** Fades and lifts its children into view once. Works around server-rendered content. */
export function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeUp,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  as?: "div" | "li" | "p" | "span";
}) {
  const Tag = { div: m.div, li: m.li, p: m.p, span: m.span }[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={withDelay(variants, delay)}
    >
      {children}
    </Tag>
  );
}
