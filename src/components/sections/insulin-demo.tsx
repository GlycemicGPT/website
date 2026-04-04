"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { Syringe, ListChecks } from "lucide-react";
import { allBolusData, filterByPeriod, formatDateTime } from "@/lib/sample-data";

const INSULIN_PERIODS = [
  { label: "24H", hours: 24 },
  { label: "3D", hours: 72 },
  { label: "7D", hours: 168 },
  { label: "14D", hours: 336 },
  { label: "30D", hours: 720 },
] as const;

// Static sample insulin summary stats (would be computed from real data)
const summaryStats = [
  { label: "TDD", value: "41.2", unit: "U/day", sub: "" },
  { label: "Basal", value: "27.5", unit: "U", sub: "67% of TDD" },
  { label: "Bolus", value: "13.6", unit: "U", sub: "33% of TDD" },
  { label: "Corrections", value: "13.3", unit: "U", sub: "U/day avg" },
  { label: "Bolus Count", value: "21", unit: "", sub: "3.0/day avg" },
  { label: "Correction Count", value: "14", unit: "", sub: "2.0/day avg" },
];

export function InsulinDemoSection() {
  const [summaryPeriodIdx, setSummaryPeriodIdx] = useState(3); // 14D
  const [bolusPeriodIdx, setBolusPeriodIdx] = useState(2); // 7D
  const prefersReducedMotion = useReducedMotion();

  const bolusPeriod = INSULIN_PERIODS[bolusPeriodIdx];
  const bolusData = filterByPeriod(allBolusData, bolusPeriod.hours)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10); // Show latest 10

  return (
    <AnimatedSection className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <div className="space-y-6">
        {/* Insulin Summary */}
        <motion.div
          className="rounded-xl border border-border bg-card p-4 sm:p-6"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Syringe className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold">Insulin Summary</h3>
              <span className="text-xs text-muted-foreground">
                {INSULIN_PERIODS[summaryPeriodIdx].label === "24H"
                  ? "24 Hours"
                  : `${INSULIN_PERIODS[summaryPeriodIdx].label.replace("D", " Days")}`}
              </span>
            </div>
            <div className="flex gap-0.5">
              {INSULIN_PERIODS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => setSummaryPeriodIdx(i)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    i === summaryPeriodIdx
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {summaryStats.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className="text-2xl font-bold tabular-nums">
                  {stat.value}
                  {stat.unit && (
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      {stat.unit}
                    </span>
                  )}
                </div>
                {stat.sub && (
                  <div className="text-xs text-primary">{stat.sub}</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Boluses Table */}
        <motion.div
          className="rounded-xl border border-border bg-card p-4 sm:p-6"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold">Recent Boluses</h3>
              <span className="text-xs text-muted-foreground">
                {INSULIN_PERIODS[bolusPeriodIdx].label === "24H"
                  ? "24 Hours"
                  : `${INSULIN_PERIODS[bolusPeriodIdx].label.replace("D", " Days")}`}
              </span>
            </div>
            <div className="flex gap-0.5">
              {INSULIN_PERIODS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => setBolusPeriodIdx(i)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    i === bolusPeriodIdx
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Time</th>
                  <th className="pb-2 pr-4 font-medium">Units</th>
                  <th className="pb-2 pr-4 font-medium">Type</th>
                  <th className="pb-2 pr-4 font-medium">BG</th>
                  <th className="pb-2 pr-4 font-medium">IoB</th>
                  <th className="pb-2 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody>
                {bolusData.map((bolus, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="py-2.5 pr-4 text-xs">
                      {formatDateTime(bolus.timestamp)}
                    </td>
                    <td className="py-2.5 pr-4 font-medium tabular-nums">
                      {bolus.units} U
                    </td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          bolus.type === "meal"
                            ? "bg-blue-500/15 text-blue-400"
                            : "bg-amber-500/15 text-amber-400"
                        }`}
                      >
                        {bolus.type === "meal" ? "Manual" : "Auto"}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                      ---
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                      ---
                    </td>
                    <td className="py-2.5 text-xs text-muted-foreground">
                      {bolus.type === "meal"
                        ? "Meal bolus"
                        : "Automated correction"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
