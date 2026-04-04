"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import {
  Bluetooth,
  Smartphone,
  Server,
  Monitor,
  Brain,
} from "lucide-react";

const mainFlow = [
  { id: "pump", label: "Insulin Pump", sublabel: "BLE", icon: Bluetooth },
  { id: "mobile", label: "Mobile App", sublabel: "Android + Wear OS", icon: Smartphone },
  { id: "backend", label: "Backend API", sublabel: "FastAPI + PostgreSQL", icon: Server },
  { id: "web", label: "Web Dashboard", sublabel: "Next.js + SSE", icon: Monitor },
];

const sidecar = { id: "ai", label: "AI Sidecar", sublabel: "5 Provider Types", icon: Brain };

function ConnectorArrow({ vertical = false }: { vertical?: boolean }) {
  return (
    <div className={`flex items-center justify-center ${vertical ? "py-1" : "px-1"}`}>
      <div className="relative overflow-hidden">
        <div
          className={`${
            vertical ? "h-10 w-px" : "h-px w-8 sm:w-12"
          } bg-border`}
        />
        {/* Arrow head */}
        <div
          className={`absolute ${
            vertical
              ? "-bottom-1 left-1/2 -translate-x-1/2 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-border"
              : "-right-1 top-1/2 -translate-y-1/2 border-t-[4px] border-b-[4px] border-l-[5px] border-t-transparent border-b-transparent border-l-border"
          }`}
        />
        {/* Animated dot - CSS animation for perfectly synced, smooth looping */}
        <div
          className={`absolute rounded-full bg-primary ${
            vertical
              ? "left-1/2 -translate-x-1/2 h-1.5 w-1.5 animate-dot-vertical"
              : "top-1/2 -translate-y-1/2 h-1.5 w-1.5 animate-dot-horizontal"
          }`}
        />
      </div>
    </div>
  );
}

interface NodeCardProps {
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
  prefersReducedMotion: boolean | null;
}

function NodeCard({ label, sublabel, icon: Icon, index, prefersReducedMotion }: NodeCardProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-4 py-5 text-center min-w-[140px] sm:min-w-[160px]"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Icon className="h-5 w-5 text-primary" />
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-xs text-muted-foreground">{sublabel}</div>
    </motion.div>
  );
}

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

      {/* Desktop: two-row layout */}
      <div className="hidden md:flex flex-col items-center gap-0">
        {/* Row 1: AI Sidecar + vertical connector, aligned above Backend (3rd of 4 nodes) */}
        {/* Offset: each node ~160px + each connector ~48px = ~208px per slot.
            Backend is at index 2 = offset 2 slots from left edge of the flow.
            Total flow width = 4*160 + 3*48 = 784px. Center of Backend = 2*208 + 80 = 496px from left.
            Center of flow = 392px. So sidecar needs to shift right by 496-392 = 104px from center. */}
        <div className="flex flex-col items-center" style={{ transform: "translateX(104px)" }}>
          <motion.div
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-4 py-5 text-center min-w-[160px]"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <sidecar.icon className="h-5 w-5 text-primary" />
            <div className="text-sm font-semibold">{sidecar.label}</div>
            <div className="text-xs text-muted-foreground">{sidecar.sublabel}</div>
          </motion.div>
          <ConnectorArrow vertical />
        </div>

        {/* Row 2: Main horizontal flow */}
        <div className="flex items-center justify-center">
          {mainFlow.map((node, i) => (
            <div key={node.id} className="flex items-center">
              <NodeCard
                label={node.label}
                sublabel={node.sublabel}
                icon={node.icon}
                index={i}
                prefersReducedMotion={prefersReducedMotion}
              />
              {i < mainFlow.length - 1 && <ConnectorArrow />}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical flow */}
      <div className="flex flex-col items-center gap-0 md:hidden">
        {mainFlow.map((node, i) => (
          <div key={node.id} className="flex flex-col items-center">
            <NodeCard
              label={node.label}
              sublabel={node.sublabel}
              icon={node.icon}
              index={i}
              prefersReducedMotion={prefersReducedMotion}
            />
            {i < mainFlow.length - 1 && <ConnectorArrow vertical />}
            {/* Show AI Sidecar branching off Backend on mobile */}
            {node.id === "backend" && (
              <div className="my-2 flex items-center gap-2">
                <div className="h-px w-8 bg-border" />
                <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-4 py-4 text-center">
                  <sidecar.icon className="h-5 w-5 text-primary" />
                  <div className="text-xs font-semibold">{sidecar.label}</div>
                  <div className="text-[10px] text-muted-foreground">{sidecar.sublabel}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
