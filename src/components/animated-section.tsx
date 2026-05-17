"use client";

import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "@/lib/use-reveal";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
}: AnimatedSectionProps) {
  const { ref, state } = useReveal<HTMLElement>();
  const style: CSSProperties | undefined = delay
    ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
    : undefined;
  const classes = className ? `reveal ${className}` : "reveal";
  return (
    <section
      ref={ref}
      className={classes}
      data-reveal-state={state === "idle" ? undefined : state}
      style={style}
    >
      {children}
    </section>
  );
}
