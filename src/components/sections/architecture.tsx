"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";

const nodes = [
  {
    id: "pump",
    label: "Insulin Pump",
    sublabel: "BLE",
    x: 12,
    y: 50,
    color: "var(--color-primary)",
  },
  {
    id: "mobile",
    label: "Mobile App",
    sublabel: "Android + Wear OS",
    x: 33,
    y: 50,
    color: "var(--color-primary)",
  },
  {
    id: "backend",
    label: "Backend API",
    sublabel: "FastAPI + PostgreSQL",
    x: 50,
    y: 50,
    color: "var(--color-primary)",
  },
  {
    id: "web",
    label: "Web Dashboard",
    sublabel: "Next.js + SSE",
    x: 78,
    y: 50,
    color: "var(--color-primary)",
  },
  {
    id: "ai",
    label: "AI Sidecar",
    sublabel: "5 Provider Types",
    x: 55,
    y: 15,
    color: "var(--color-primary)",
  },
];

const connections = [
  { from: "pump", to: "mobile", duration: 2.3 },
  { from: "mobile", to: "backend", duration: 2.7 },
  { from: "backend", to: "web", duration: 2.1 },
  { from: "backend", to: "ai", duration: 2.5 },
];

export function ArchitectureSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatedSection className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-12 text-center" id="platform">
        <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl scroll-mt-20">
          Platform Architecture
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          From pump to dashboard in real time. Every component self-hosted on
          your infrastructure.
        </p>
      </div>

      {/* Desktop diagram */}
      <div className="hidden md:block">
        <svg viewBox="0 0 100 70" className="w-full" aria-label="Architecture diagram">
          {/* Connection lines */}
          {connections.map((conn) => {
            const from = nodes.find((n) => n.id === conn.from)!;
            const to = nodes.find((n) => n.id === conn.to)!;
            return (
              <g key={`${conn.from}-${conn.to}`}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="currentColor"
                  strokeWidth="0.3"
                  opacity="0.2"
                  className="text-foreground"
                />
                {/* Animated dot */}
                {!prefersReducedMotion && (
                  <motion.circle
                    r="0.6"
                    fill="currentColor"
                    className="text-primary"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{
                      duration: conn.duration,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <animateMotion
                      dur={`${conn.duration}s`}
                      repeatCount="indefinite"
                      path={`M${from.x},${from.y} L${to.x},${to.y}`}
                    />
                  </motion.circle>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => (
            <motion.g
              key={node.id}
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <rect
                x={node.x - 10}
                y={node.y - 8}
                width="20"
                height="16"
                rx="2"
                fill="currentColor"
                className="text-card"
                stroke="currentColor"
                strokeWidth="0.3"
                style={{ stroke: "var(--border)" }}
              />
              <text
                x={node.x}
                y={node.y - 1}
                textAnchor="middle"
                className="fill-foreground text-[2.5px] font-semibold"
              >
                {node.label}
              </text>
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                className="fill-muted-foreground text-[2px]"
              >
                {node.sublabel}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>

      {/* Mobile: vertical list */}
      <div className="flex flex-col gap-3 md:hidden">
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {i + 1}
            </div>
            <div>
              <div className="text-sm font-semibold">{node.label}</div>
              <div className="text-xs text-muted-foreground">{node.sublabel}</div>
            </div>
            {i < nodes.length - 1 && node.id !== "ai" && (
              <div className="ml-auto text-muted-foreground">→</div>
            )}
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}
