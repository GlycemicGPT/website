"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { Shield, Brain, Puzzle, Users } from "lucide-react";

const differentiators = [
  {
    icon: Shield,
    title: "Your Data, Your Server",
    description:
      "Self-hosted on your infrastructure. No cloud accounts, no data harvesting, no corporate access to your health records.",
  },
  {
    icon: Brain,
    title: "AI That Knows Your Patterns",
    description:
      "Not just alerts -- daily analysis briefs, pattern detection, and conversational AI that understands your insulin, your meals, your life.",
  },
  {
    icon: Puzzle,
    title: "Works Your Way",
    description:
      "BLE direct connect, cloud sync, or bridge from your existing platform. One app, any device, any setup.",
  },
  {
    icon: Users,
    title: "Built for Caregivers Too",
    description:
      "Real-time dashboards, escalating alerts, and instant notifications. Parents and partners stay informed without hovering.",
  },
];

export function StatsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatedSection className="border-y border-border bg-muted/30">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {differentiators.map((item, i) => (
          <motion.div
            key={item.title}
            className="flex flex-col items-center text-center"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-1.5 text-sm font-semibold">{item.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}
