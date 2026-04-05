"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FileText, TrendingUp, AlertTriangle, Activity } from "lucide-react";

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[380px] sm:w-[440px]">
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
        {/* Content */}
        <div className="bg-background">{children}</div>
      </div>
    </div>
  );
}

export function BrowserDemo() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <BrowserFrame>
      {/* Sidebar hint */}
      <div className="flex">
        <div className="hidden sm:flex w-[100px] shrink-0 flex-col border-r border-border bg-muted/30 px-2 py-3">
          <div className="flex items-center gap-1.5 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny SVG in mockup */}
            <img src="/logo.svg" alt="" className="h-4 w-4" />
            <span className="text-[9px] font-bold">GlycemicGPT</span>
          </div>
          <div className="space-y-1">
            {["Dashboard", "Daily Briefs", "Alerts", "AI Chat", "Settings"].map((item, i) => (
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
            ))}
          </div>
        </div>

        {/* Main content - Daily Brief */}
        <div className="flex-1 px-3 py-3">
          <div className="mb-3">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <h3 className="text-[11px] font-semibold">Daily Brief</h3>
            </div>
            <p className="text-[9px] text-muted-foreground">Saturday, April 5</p>
          </div>

          {/* Brief content */}
          <motion.div
            className="space-y-2.5"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Greeting */}
            <div className="rounded-lg border border-border bg-muted/30 p-2.5">
              <p className="text-[10px] leading-relaxed">
                Good morning, Sarah. Here&apos;s your overnight summary. Glucose stayed
                in range <strong>82-156 mg/dL</strong> with no lows detected.
                Time in range yesterday was <strong>76%</strong>.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-1.5">
              <div className="rounded-lg border border-border p-2 text-center">
                <div className="text-[14px] font-bold text-green-400">76%</div>
                <div className="text-[8px] text-muted-foreground">In Range</div>
              </div>
              <div className="rounded-lg border border-border p-2 text-center">
                <div className="text-[14px] font-bold">148</div>
                <div className="text-[8px] text-muted-foreground">Avg mg/dL</div>
              </div>
              <div className="rounded-lg border border-border p-2 text-center">
                <div className="text-[14px] font-bold text-amber-400">2</div>
                <div className="text-[8px] text-muted-foreground">Highs</div>
              </div>
            </div>

            {/* Pattern insight */}
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-3 w-3 text-amber-400" />
                <span className="text-[9px] font-semibold text-amber-400">Pattern Detected</span>
              </div>
              <p className="text-[9px] text-muted-foreground leading-relaxed">
                Post-dinner highs for the 3rd day in a row. Average post-dinner peak: <strong>218 mg/dL</strong>.
                Consider adjusting your evening carb ratio.
              </p>
            </div>

            {/* Recommendation */}
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Activity className="h-3 w-3 text-blue-400" />
                <span className="text-[9px] font-semibold text-blue-400">AI Recommendation</span>
              </div>
              <p className="text-[9px] text-muted-foreground leading-relaxed">
                Your overall trend is improving. Basal rates look well-tuned overnight. Focus on the dinner ratio
                and you could hit 80%+ in range this week.
              </p>
            </div>

            {/* Disclaimer */}
            <p className="flex items-center gap-1 text-[8px] text-muted-foreground">
              <AlertTriangle className="h-2.5 w-2.5" />
              Not medical advice. Consult your healthcare provider.
            </p>
          </motion.div>
        </div>
      </div>
    </BrowserFrame>
  );
}
