"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GitHubIcon } from "@/components/icons";

const words = "Built by patients who got tired of waiting.".split(" ");

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4 pt-16">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground"
        >
          Open Source Diabetes Management Platform
        </motion.div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.3em]"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Real-time glucose monitoring, AI-powered analysis, caregiver alerts,
          and Wear OS support. Self-hosted, privacy-first, completely open source.
        </motion.p>

        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <a
            href="#getting-started"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/GlycemicGPT/GlycemicGPT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            <GitHubIcon className="h-4 w-4" />
            View on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
