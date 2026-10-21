"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * An image that drifts slower than the page as you scroll.
 * The image layer is oversized by 15% top and bottom so the movement never reveals an edge.
 */
export function ParallaxImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
  imageClassName,
  amount = 10,
  fromTop = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  /** Travel distance as a % of the image layer. Keep ≤ 11. */
  amount?: number;
  /** Start at rest at the top of the page (use for the hero). */
  fromTop?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Read through a ref so the server and first client render produce identical markup.
  const still = useRef(false);
  still.current = Boolean(reduce);
  const [from, to] = fromTop ? [0, amount] : [-amount, amount];
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: fromTop ? ["start start", "end start"] : ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, (progress) => (still.current ? "0%" : `${from + (to - from) * progress}%`));

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <m.div className="absolute inset-x-0 -top-[15%] -bottom-[15%]" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          // next/image 15 only adds fetchpriority to the <img> and preload when it's passed explicitly.
          fetchPriority={priority ? "high" : undefined}
          className={cn("object-cover", imageClassName)}
        />
      </m.div>
    </div>
  );
}
