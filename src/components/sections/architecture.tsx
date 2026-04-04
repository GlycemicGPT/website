"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import {
  Bluetooth,
  Smartphone,
  Server,
  Monitor,
  Brain,
  Database,
} from "lucide-react";

const mainFlow = [
  { id: "devices", label: "Your Devices", sublabel: "Pump + CGM", icon: Bluetooth },
  { id: "mobile", label: "Mobile App", sublabel: "Android + Wear OS", icon: Smartphone },
  { id: "backend", label: "Platform Core", sublabel: "API + AI + RAG", icon: Server },
  { id: "web", label: "Web Dashboard", sublabel: "Real-Time Monitoring", icon: Monitor },
];

const auxNodes = [
  { id: "ai", label: "AI Engine", sublabel: "Analysis + Knowledge Base", icon: Brain },
  { id: "db", label: "Data Store", sublabel: "History + Vector Search", icon: Database },
];

function ConnectorArrow({ vertical = false }: { vertical?: boolean }) {
  return (
    <div className={`flex items-center justify-center ${vertical ? "py-1" : "px-1"}`}>
      <div className="relative overflow-hidden">
        <div
          className={`${
            vertical ? "h-10 w-px" : "h-px w-8 sm:w-12"
          } bg-border`}
        />
        <div
          className={`absolute ${
            vertical
              ? "-bottom-1 left-1/2 -translate-x-1/2 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-border"
              : "-right-1 top-1/2 -translate-y-1/2 border-t-[4px] border-b-[4px] border-l-[5px] border-t-transparent border-b-transparent border-l-border"
          }`}
        />
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
  small?: boolean;
}

function NodeCard({ label, sublabel, icon: Icon, index, prefersReducedMotion, small }: NodeCardProps) {
  return (
    <motion.div
      className={`flex flex-col items-center gap-2 rounded-xl border border-border bg-card text-center ${
        small ? "px-3 py-3 min-w-[130px]" : "px-4 py-5 min-w-[140px] sm:min-w-[160px]"
      }`}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Icon className={`text-primary ${small ? "h-4 w-4" : "h-5 w-5"}`} />
      <div className={`font-semibold ${small ? "text-xs" : "text-sm"}`}>{label}</div>
      <div className={`text-muted-foreground ${small ? "text-[10px]" : "text-xs"}`}>{sublabel}</div>
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
          From device to dashboard in real time. AI analysis and clinical
          knowledge retrieval built directly into the platform core.
        </p>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-col items-center gap-0">
        {/* Top row: AI Engine + Data Store above Platform Core */}
        <div className="flex items-end justify-center gap-6 mb-0">
          {auxNodes.map((node, i) => (
            <div key={node.id} className="flex flex-col items-center">
              <NodeCard
                label={node.label}
                sublabel={node.sublabel}
                icon={node.icon}
                index={i + 4}
                prefersReducedMotion={prefersReducedMotion}
                small
              />
              <ConnectorArrow vertical />
            </div>
          ))}
        </div>

        {/* Main horizontal flow */}
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
            {/* Show AI + Data Store branching off Platform Core on mobile */}
            {node.id === "backend" && (
              <div className="my-3 flex items-center gap-3">
                {auxNodes.map((aux) => (
                  <div key={aux.id} className="flex items-center gap-2">
                    <div className="h-px w-4 bg-border" />
                    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-3 text-center">
                      <aux.icon className="h-4 w-4 text-primary" />
                      <div className="text-xs font-semibold">{aux.label}</div>
                      <div className="text-[10px] text-muted-foreground">{aux.sublabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
