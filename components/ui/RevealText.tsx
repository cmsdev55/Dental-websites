"use client";

import { m } from "motion/react";
import { Fragment } from "react";
import { maskRise, stagger, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/utils";

const tags = { h1: m.h1, h2: m.h2, h3: m.h3, p: m.p };

/**
 * A heading whose words rise out of masks, one after another, when it scrolls into view.
 * Wrap a word in *asterisks* to set it in italic accent: "Care that starts with *listening*."
 */
export function RevealText({
  id,
  text,
  as = "h2",
  className,
  accentClassName = "text-accent-deep",
  accentItalic = true,
  delay = 0,
}: {
  id?: string;
  text: string;
  as?: keyof typeof tags;
  className?: string;
  accentClassName?: string;
  /** Set false for display faces without an italic (e.g. Sora). */
  accentItalic?: boolean;
  delay?: number;
}) {
  const Tag = tags[as];
  const plain = text.replace(/\*/g, "");
  // Tag every word inside *…* (which may span several words) as accented.
  let open = false;
  const words = text.split(/\s+/).map((raw) => {
    const starts = raw.startsWith("*");
    const ends = /\*[.,!?]?$/.test(raw);
    const accent = open || starts;
    open = (open || starts) && !ends;
    return { text: raw.replace(/\*/g, ""), accent };
  });

  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={stagger(0.06, delay)}
    >
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={i}>
            <span className="reveal-mask">
              <m.span
                variants={maskRise}
                className={cn("inline-block", word.accent && cn(accentItalic && "italic", accentClassName))}
              >
                {word.text}
              </m.span>
            </span>
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
