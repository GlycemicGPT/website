"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  prefix?: string;
}

function AnimatedStat({ value, suffix = "", label, prefix = "" }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- animation init
      setDisplay(value);
      return;
    }

    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * value);
      setDisplay(start);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [isInView, value, prefersReducedMotion]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-bold tabular-nums sm:text-4xl">
        {prefix}
        {display}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

const stats = [
  { value: 288, label: "CGM readings per day", suffix: "" },
  { value: 5, label: "AI providers supported", suffix: "" },
  { value: 100, label: "Self-hosted, your data", suffix: "%" },
  { value: 0, label: "Cloud dependencies", suffix: "" },
];

export function StatsSection() {
  return (
    <AnimatedSection className="border-y border-border bg-muted/30">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-4 py-16 sm:px-6 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <AnimatedStat {...stat} />
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}
