"use client";

import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "@/lib/use-reveal";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in milliseconds. */
  delay?: number;
  style?: CSSProperties;
}

/**
 * Drop-in replacement for the `motion.div + initial/whileInView + transition.delay`
 * pattern. Uses one IntersectionObserver per element via {@link useReveal} and
 * CSS transitions. No framer-motion dependency.
 *
 * Static HTML default is visible; the hook only hides elements that are below
 * the fold at hydration time, then transitions them to visible when scrolled in.
 */
export function Reveal({ children, className = "", delay = 0, style }: RevealProps) {
  const { ref, state } = useReveal<HTMLDivElement>();
  const mergedStyle: CSSProperties = {
    ...(delay
      ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
      : null),
    ...style,
  };
  const classes = className ? `reveal ${className}` : "reveal";
  return (
    <div
      ref={ref}
      className={classes}
      data-reveal-state={state === "idle" ? undefined : state}
      style={mergedStyle}
    >
      {children}
    </div>
  );
}
