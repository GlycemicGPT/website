"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, TrendingUp, AlertTriangle, Activity, Sun } from "lucide-react";

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[520px]">
      <div className="rounded-xl border border-border bg-background shadow-xl overflow-hidden">
        {/* macOS-style window chrome */}
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <div className="ml-3 flex-1 rounded-md bg-background/80 px-3 py-0.5 text-center text-[9px] text-muted-foreground">
            glycemicgpt.org/dashboard/briefs
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

// Animated section that fades in with a delay
function RevealBlock({
  children,
  delay,
  reduced,
}: {
  children: React.ReactNode;
  delay: number;
  reduced: boolean | null;
}) {
  const [visible, setVisible] = useState(reduced ? true : false);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay, reduced]);

  if (!visible) return null;

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

export function BrowserDemo() {
  const prefersReducedMotion = useReducedMotion();
  const [cycle, setCycle] = useState(0);

  // Reset and replay the animation every ~20 seconds
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => setCycle((c) => c + 1), 22000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <BrowserFrame>
      <div className="flex" key={cycle}>
        {/* Sidebar */}
        <div className="hidden sm:flex w-[110px] shrink-0 flex-col border-r border-border bg-muted/30 px-2 py-3">
          <div className="flex items-center gap-1.5 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny SVG in mockup */}
            <img src="/logo.svg" alt="" className="h-4 w-4" />
            <span className="text-[9px] font-bold">GlycemicGPT</span>
          </div>
          <div className="space-y-1">
            {["Dashboard", "Daily Briefs", "Alerts", "AI Chat", "Knowledge Base", "Settings"].map(
              (item, i) => (
                <div
                  key={item}
                  className={`rounded-md px-2 py-1 text-[8px] ${
                    i === 1
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        {/* Main content - Animated Daily Brief */}
        <div className="flex-1 px-4 py-4 min-h-[400px]">
          {/* Header */}
          <RevealBlock delay={0} reduced={prefersReducedMotion}>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-semibold">Daily Brief</h3>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Saturday, April 5
              </p>
            </div>
          </RevealBlock>

          {/* Greeting */}
          <RevealBlock delay={800} reduced={prefersReducedMotion}>
            <div className="mb-3 rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[10px] font-semibold">Good morning, Sarah</span>
              </div>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                Here&apos;s your overnight summary. Glucose stayed in range{" "}
                <strong className="text-foreground">82-156 mg/dL</strong> with
                no lows detected. Overall time in range yesterday was{" "}
                <strong className="text-foreground">76%</strong>.
              </p>
            </div>
          </RevealBlock>

          {/* Stats row */}
          <RevealBlock delay={2000} reduced={prefersReducedMotion}>
            <div className="mb-3 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-border p-2.5 text-center">
                <div className="text-lg font-bold text-green-400">76%</div>
                <div className="text-[9px] text-muted-foreground">
                  Time in Range
                </div>
              </div>
              <div className="rounded-lg border border-border p-2.5 text-center">
                <div className="text-lg font-bold">148</div>
                <div className="text-[9px] text-muted-foreground">
                  Avg mg/dL
                </div>
              </div>
              <div className="rounded-lg border border-border p-2.5 text-center">
                <div className="text-lg font-bold text-amber-400">2</div>
                <div className="text-[9px] text-muted-foreground">
                  Highs Yesterday
                </div>
              </div>
            </div>
          </RevealBlock>

          {/* Pattern insight */}
          <RevealBlock delay={3500} reduced={prefersReducedMotion}>
            <div className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[10px] font-semibold text-amber-400">
                  Pattern Detected
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Post-dinner highs for the <strong className="text-foreground">3rd day in a row</strong>.
                Average post-dinner peak:{" "}
                <strong className="text-foreground">218 mg/dL</strong>. Consider
                adjusting your evening carb ratio or pre-bolus timing.
              </p>
            </div>
          </RevealBlock>

          {/* AI Recommendation */}
          <RevealBlock delay={5000} reduced={prefersReducedMotion}>
            <div className="mb-3 rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Activity className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-[10px] font-semibold text-blue-400">
                  AI Recommendation
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Your overall trend is improving week over week. Basal rates look
                well-tuned overnight. Focus on the dinner carb ratio and you
                could hit <strong className="text-foreground">80%+ in range</strong>{" "}
                this week.
              </p>
            </div>
          </RevealBlock>

          {/* Disclaimer */}
          <RevealBlock delay={6500} reduced={prefersReducedMotion}>
            <p className="flex items-center gap-1 text-[8px] text-muted-foreground">
              <AlertTriangle className="h-2.5 w-2.5" />
              Not medical advice. Consult your healthcare provider.
            </p>
          </RevealBlock>
        </div>
      </div>
    </BrowserFrame>
  );
}
