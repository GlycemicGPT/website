"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";

const nodes = [
  { id: "pump", label: "Insulin Pump", sublabel: "BLE", x: 15, y: 55 },
  { id: "mobile", label: "Mobile App", sublabel: "Android + Wear OS", x: 35, y: 55 },
  { id: "backend", label: "Backend API", sublabel: "FastAPI + PostgreSQL", x: 55, y: 55 },
  { id: "web", label: "Web Dashboard", sublabel: "Next.js + SSE", x: 85, y: 55 },
  { id: "ai", label: "AI Sidecar", sublabel: "5 Provider Types", x: 70, y: 20 },
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
        <svg viewBox="0 0 100 75" className="mx-auto w-full max-w-4xl" aria-label="Architecture diagram">
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
                  strokeWidth="0.4"
                  opacity="0.15"
                  className="text-foreground"
                />
                {/* Animated dot */}
                {!prefersReducedMotion && (
                  <circle r="0.8" fill="currentColor" className="text-primary" opacity="0.8">
                    <animateMotion
                      dur={`${conn.duration}s`}
                      repeatCount="indefinite"
                      path={`M${from.x},${from.y} L${to.x},${to.y}`}
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Direction arrows on connection lines */}
          {connections.map((conn) => {
            const from = nodes.find((n) => n.id === conn.from)!;
            const to = nodes.find((n) => n.id === conn.to)!;
            const mx = (from.x + to.x) / 2;
            const my = (from.y + to.y) / 2;
            const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);
            return (
              <g key={`arrow-${conn.from}-${conn.to}`} transform={`translate(${mx},${my}) rotate(${angle})`}>
                <polygon
                  points="-1.2,-0.8 1.2,0 -1.2,0.8"
                  fill="currentColor"
                  className="text-muted-foreground"
                  opacity="0.4"
                />
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => (
            <motion.g
              key={node.id}
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              <rect
                x={node.x - 12}
                y={node.y - 9}
                width="24"
                height="18"
                rx="2.5"
                fill="currentColor"
                className="text-card"
                stroke="currentColor"
                strokeWidth="0.4"
                style={{ stroke: "var(--border)" }}
              />
              <text
                x={node.x}
                y={node.y - 1.5}
                textAnchor="middle"
                className="fill-foreground"
                style={{ fontSize: "3px", fontWeight: 600 }}
              >
                {node.label}
              </text>
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                className="fill-muted-foreground"
                style={{ fontSize: "2.2px" }}
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
              <div className="text-xs text-muted-foreground">
                {node.sublabel}
              </div>
            </div>
            {i < nodes.length - 1 && node.id !== "ai" && (
              <div className="ml-auto text-muted-foreground">{"\u2192"}</div>
            )}
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}
