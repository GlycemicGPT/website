"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatedSection } from "@/components/animated-section";
import {
  allGlucoseData,
  filterByPeriod,
  getRangeColor,
  formatTime,
  formatDate,
  formatDateTime,
  PERIODS,
  type GlucoseReading,
} from "@/lib/sample-data";
import { ArrowRight } from "lucide-react";

const ComposedChart = dynamic(
  () => import("recharts").then((m) => m.ComposedChart),
  { ssr: false }
);
const Scatter = dynamic(
  () => import("recharts").then((m) => m.Scatter),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((m) => m.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((m) => m.YAxis),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((m) => m.Tooltip),
  { ssr: false }
);
const ReferenceArea = dynamic(
  () => import("recharts").then((m) => m.ReferenceArea),
  { ssr: false }
);
const ReferenceLine = dynamic(
  () => import("recharts").then((m) => m.ReferenceLine),
  { ssr: false }
);
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const ZAxis = dynamic(
  () => import("recharts").then((m) => m.ZAxis),
  { ssr: false }
);

interface TooltipPayloadItem {
  payload: { timestamp: number; value?: number };
  dataKey: string;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  const value = data.value ?? 0;

  const idx = allGlucoseData.findIndex((d) => d.timestamp === data.timestamp);
  const prev = idx > 3 ? allGlucoseData[idx - 3].value : value;
  const diff = value - prev;
  let trend = "Stable";
  let trendArrow = "\u2192";
  if (diff > 10) {
    trend = "Rising";
    trendArrow = "\u2197";
  } else if (diff > 3) {
    trend = "Rising slowly";
    trendArrow = "\u2197";
  } else if (diff < -10) {
    trend = "Falling";
    trendArrow = "\u2198";
  } else if (diff < -3) {
    trend = "Falling slowly";
    trendArrow = "\u2198";
  }

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <div
        className="text-lg font-bold"
        style={{ color: getRangeColor(value) }}
      >
        {value} mg/dL {trendArrow}
      </div>
      <div className="text-xs text-muted-foreground">{trend}</div>
      <div className="text-xs text-muted-foreground">
        {formatDateTime(data.timestamp)}
      </div>
    </div>
  );
}

function getXTicks(data: GlucoseReading[], periodHours: number): number[] {
  if (data.length === 0) return [];
  const first = data[0].timestamp;
  const last = data[data.length - 1].timestamp;
  const ticks: number[] = [];

  let intervalMs: number;
  if (periodHours <= 6) intervalMs = 60 * 60 * 1000;
  else if (periodHours <= 24) intervalMs = 3 * 60 * 60 * 1000;
  else if (periodHours <= 72) intervalMs = 12 * 60 * 60 * 1000;
  else intervalMs = 24 * 60 * 60 * 1000;

  let t = Math.ceil(first / intervalMs) * intervalMs;
  while (t <= last) {
    ticks.push(t);
    t += intervalMs;
  }
  return ticks;
}

function formatXTick(ts: number, periodHours: number): string {
  if (periodHours <= 24) return formatTime(ts);
  if (periodHours <= 72) return `${formatDate(ts)} ${formatTime(ts)}`;
  return formatDate(ts);
}

export function GlucoseChartSection() {
  const [periodIdx, setPeriodIdx] = useState(3); // default 24H
  const period = PERIODS[periodIdx];

  const glucoseData = filterByPeriod(allGlucoseData, period.hours);

  const inRange = glucoseData.filter((d) => d.value >= 70 && d.value <= 180);
  const highLow = glucoseData.filter(
    (d) => (d.value > 180 && d.value <= 250) || (d.value >= 55 && d.value < 70)
  );
  const urgent = glucoseData.filter((d) => d.value > 250 || d.value < 55);

  const currentValue =
    glucoseData.length > 0 ? glucoseData[glucoseData.length - 1].value : 0;
  const xTicks = getXTicks(glucoseData, period.hours);

  // Auto-scale Y axis to data range (matching platform behavior)
  const allValues = glucoseData.map((d) => d.value);
  const dataMin = Math.min(...allValues);
  const dataMax = Math.max(...allValues);
  const yMin = Math.max(40, Math.floor((dataMin - 20) / 10) * 10);
  const yMax = Math.min(400, Math.ceil((dataMax + 20) / 10) * 10);

  // Generate Y axis ticks that include the range boundaries
  const yTicks: number[] = [];
  const yStep = yMax - yMin > 200 ? 70 : 50;
  for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
    yTicks.push(y);
  }

  return (
    <AnimatedSection className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Real-Time Glucose Monitoring
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Interactive demo built with the same technology powering the platform.
          Switch time periods and hover to explore the data.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        {/* Hero BG card */}
        <div
          className="mb-4 rounded-lg p-4 sm:p-6"
          style={{
            backgroundColor:
              currentValue >= 70 && currentValue <= 180
                ? "rgba(34, 197, 94, 0.1)"
                : currentValue > 250 || currentValue < 55
                  ? "rgba(239, 68, 68, 0.1)"
                  : "rgba(245, 158, 11, 0.1)",
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <span
              className="text-5xl font-bold tabular-nums sm:text-6xl"
              style={{ color: getRangeColor(currentValue) }}
            >
              {currentValue}
            </span>
            <ArrowRight
              className="h-8 w-8"
              style={{ color: getRangeColor(currentValue) }}
            />
          </div>
          <div className="mt-1 text-center text-sm text-muted-foreground">
            mg/dL
          </div>

          <div className="mt-4 flex items-center justify-center gap-6 text-center text-xs sm:gap-10 sm:text-sm">
            <div className="border-r border-border pr-6 sm:pr-10">
              <div className="font-medium text-muted-foreground">IOB</div>
              <div className="font-semibold">2.1u</div>
            </div>
            <div className="border-r border-border pr-6 sm:pr-10">
              <div className="font-medium text-muted-foreground">BASAL</div>
              <div className="font-semibold">4.37 u/hr</div>
            </div>
            <div className="border-r border-border pr-6 sm:pr-10">
              <div className="font-medium text-muted-foreground">BATTERY</div>
              <div className="font-semibold">35%</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">RESERVOIR</div>
              <div className="font-semibold">235u</div>
            </div>
          </div>
        </div>

        {/* Chart header with working period buttons */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Glucose Trend</span>
            <span className="text-xs text-muted-foreground">
              Drag chart to zoom
            </span>
          </div>
          <div className="flex gap-0.5">
            {PERIODS.map((p, i) => (
              <button
                key={p.label}
                onClick={() => setPeriodIdx(i)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  i === periodIdx
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart -- matches platform: scatter dots only, no basal/bolus overlay */}
        <div className="h-64 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              margin={{ top: 10, right: 5, left: -15, bottom: 0 }}
            >
              {/* Target range shading */}
              <ReferenceArea
                y1={70}
                y2={180}
                fill="#22C55E"
                fillOpacity={0.06}
              />

              {/* Dotted grid lines matching platform */}
              <ReferenceLine
                y={yMax}
                stroke="currentColor"
                strokeDasharray="3 6"
                strokeWidth={0.5}
                strokeOpacity={0.15}
              />
              {yTicks.map((y) => (
                <ReferenceLine
                  key={y}
                  y={y}
                  stroke="currentColor"
                  strokeDasharray="3 6"
                  strokeWidth={0.5}
                  strokeOpacity={0.15}
                />
              ))}

              <XAxis
                dataKey="timestamp"
                type="number"
                domain={["dataMin", "dataMax"]}
                ticks={xTicks}
                tickFormatter={(ts: number) => formatXTick(ts, period.hours)}
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
                allowDuplicatedCategory={false}
              />
              <YAxis
                domain={[yMin, yMax]}
                ticks={yTicks}
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              {/* Larger dots to match platform density */}
              <ZAxis range={[35, 35]} />
              <Tooltip content={<CustomTooltip />} cursor={false} />

              {/* Glucose scatter dots -- same 3 categories as the platform */}
              <Scatter
                data={inRange}
                dataKey="value"
                fill="#22C55E"
                name="In Range"
              />
              <Scatter
                data={highLow}
                dataKey="value"
                fill="#F59E0B"
                name="High/Low"
              />
              <Scatter
                data={urgent}
                dataKey="value"
                fill="#EF4444"
                name="Urgent"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend -- matches platform: 3 items only */}
        <div className="mt-3 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
            70-180 Target
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
            High/Low
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
            Urgent
          </span>
        </div>
      </div>
    </AnimatedSection>
  );
}
