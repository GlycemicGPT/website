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
  HelpCircle,
  Droplets,
  FileText,
  Lightbulb,
} from "lucide-react";

const mainFlow = [
  { id: "devices", label: "Your Devices", sublabel: "Pump + CGM", icon: Bluetooth },
  { id: "mobile", label: "Mobile App", sublabel: "Android + Wear OS", icon: Smartphone },
  { id: "backend", label: "Platform Core", sublabel: "API + Orchestration", icon: Server },
  { id: "web", label: "Web Dashboard", sublabel: "Real-Time Monitoring", icon: Monitor },
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

/** AI Engine module -- larger card containing Brain + RAG Data Store with internal connector */
function AIEngineModule({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
  return (
    <motion.div
      className="rounded-2xl border border-primary/20 bg-card/50 px-6 py-5"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-primary">
        AI Engine
      </div>
      <div className="flex items-center gap-0">
        {/* Brain / Analysis */}
        <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-3 text-center min-w-[120px]">
          <Brain className="h-5 w-5 text-primary" />
          <div className="text-xs font-semibold">Analysis</div>
          <div className="text-[10px] text-muted-foreground">5 Provider Types</div>
        </div>

        {/* Bidirectional connector: two lines with data-type icons flowing each direction */}
        <div className="flex flex-col items-center justify-center gap-2.5 px-2">
          {/* Line 1: Analysis → Knowledge Base (queries + health context) */}
          <div className="relative h-4 w-20 overflow-hidden">
            <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-border" />
            <HelpCircle className="absolute top-1/2 -translate-y-1/2 h-3 w-3 text-primary animate-icon-right" style={{ animationDelay: "0s" }} />
            <Droplets className="absolute top-1/2 -translate-y-1/2 h-3 w-3 text-red-400 animate-icon-right" style={{ animationDelay: "1.5s" }} />
          </div>
          {/* Line 2: Knowledge Base → Analysis (docs + insights) */}
          <div className="relative h-4 w-20 overflow-hidden">
            <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-border" />
            <FileText className="absolute top-1/2 -translate-y-1/2 h-3 w-3 text-primary animate-icon-left" style={{ animationDelay: "0.5s" }} />
            <Lightbulb className="absolute top-1/2 -translate-y-1/2 h-3 w-3 text-amber-400 animate-icon-left" style={{ animationDelay: "2s" }} />
          </div>
        </div>

        {/* RAG Data Store */}
        <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-3 text-center min-w-[120px]">
          <Database className="h-5 w-5 text-primary" />
          <div className="text-xs font-semibold">Knowledge Base</div>
          <div className="text-[10px] text-muted-foreground">RAG + Vector Search</div>
        </div>
      </div>
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
        {/* AI Engine module - centered above Platform Core (3rd node) */}
        <div className="flex flex-col items-center" style={{ transform: "translateX(104px)" }}>
          <AIEngineModule prefersReducedMotion={prefersReducedMotion} />
          <ConnectorArrow vertical />
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
            {/* Show connector arrow -- skip between backend and web since AI Engine goes between them */}
            {i < mainFlow.length - 1 && node.id !== "backend" && <ConnectorArrow vertical />}
            {/* Show AI Engine module between Platform Core and Web Dashboard on mobile */}
            {node.id === "backend" && (
              <div className="my-0">
                <ConnectorArrow vertical />
                <div className="rounded-2xl border border-primary/20 bg-card/50 px-5 py-4">
                  <div className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-primary">
                    AI Engine
                  </div>
                  <div className="flex items-center gap-0">
                    <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-3 text-center min-w-[100px]">
                      <Brain className="h-5 w-5 text-primary" />
                      <div className="text-xs font-semibold">Analysis</div>
                      <div className="text-[10px] text-muted-foreground">5 Provider Types</div>
                    </div>

                    {/* Bidirectional connector with data-type icons */}
                    <div className="flex flex-col items-center justify-center gap-2 px-1.5">
                      <div className="relative h-4 w-12 overflow-hidden">
                        <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-border" />
                        <HelpCircle className="absolute top-1/2 -translate-y-1/2 h-3 w-3 text-primary animate-icon-right" style={{ animationDelay: "0s" }} />
                        <Droplets className="absolute top-1/2 -translate-y-1/2 h-3 w-3 text-red-400 animate-icon-right" style={{ animationDelay: "1.5s" }} />
                      </div>
                      <div className="relative h-4 w-12 overflow-hidden">
                        <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-border" />
                        <FileText className="absolute top-1/2 -translate-y-1/2 h-3 w-3 text-primary animate-icon-left" style={{ animationDelay: "0.5s" }} />
                        <Lightbulb className="absolute top-1/2 -translate-y-1/2 h-3 w-3 text-amber-400 animate-icon-left" style={{ animationDelay: "2s" }} />
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-3 text-center min-w-[100px]">
                      <Database className="h-5 w-5 text-primary" />
                      <div className="text-xs font-semibold">Knowledge Base</div>
                      <div className="text-[10px] text-muted-foreground">RAG + Vector Search</div>
                    </div>
                  </div>
                </div>
                <ConnectorArrow vertical />
              </div>
            )}
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
