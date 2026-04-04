"use client";

import dynamic from "next/dynamic";
import { AnimatedSection } from "@/components/animated-section";
import {
  glucoseData,
  getRangeColor,
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

// Show every 3 hours on the axis
const hourlyTicks = glucoseData
  .filter((d) => d.hour % 3 === 0 && d.time.endsWith(":00"))
  .map((d) => d.time);

// Split data by range for colored dots
const inRangeData = glucoseData.filter((d) => d.value >= 70 && d.value <= 180);
const highLowData = glucoseData.filter(
  (d) => (d.value > 180 && d.value <= 250) || (d.value >= 55 && d.value < 70)
);
const urgentData = glucoseData.filter((d) => d.value > 250 || d.value < 55);

interface TooltipPayloadItem {
  payload: GlucoseReading;
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
  const value = data.value;

  const trendIdx = glucoseData.findIndex((d) => d.time === data.time);
  const prevVal = trendIdx > 3 ? glucoseData[trendIdx - 3].value : value;
  const diff = value - prevVal;
  let trendText = "Stable";
  if (diff > 10) trendText = "Rising";
  else if (diff > 3) trendText = "Rising slowly";
  else if (diff < -10) trendText = "Falling";
  else if (diff < -3) trendText = "Falling slowly";

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <div
        className="text-lg font-bold"
        style={{ color: getRangeColor(value) }}
      >
        {value} mg/dL{" "}
        <span className="text-sm font-normal">
          {diff >= 0 ? "\u2192" : "\u2198"}
        </span>
      </div>
      <div className="text-xs text-muted-foreground">{trendText}</div>
      <div className="text-xs text-muted-foreground">
        {data.time.replace(/^(\d+):(\d+)$/, (_, h, m) => {
          const hour = parseInt(h);
          const ampm = hour >= 12 ? "PM" : "AM";
          const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          return `${h12}:${m} ${ampm}`;
        })}
      </div>
    </div>
  );
}

export function GlucoseChartSection() {
  const currentValue = glucoseData[glucoseData.length - 1].value;

  return (
    <AnimatedSection className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Real-Time Glucose Monitoring
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Interactive chart built with the same technology powering the
          platform. Hover to explore 24 hours of glucose data.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        {/* Hero BG card - matches platform design */}
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

          {/* Pump stats row - matches platform */}
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

        {/* Chart title with time period buttons */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Glucose Trend</span>
            <span className="text-xs text-muted-foreground">
              Drag chart to zoom
            </span>
          </div>
          <div className="flex gap-1">
            {["3H", "6H", "12H", "24H", "3D", "7D"].map((period, i) => (
              <button
                key={period}
                className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                  i === 3
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Scatter dot chart - matches platform design */}
        <div className="h-64 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              {/* Target range shading */}
              <ReferenceArea
                y1={70}
                y2={180}
                fill="#22C55E"
                fillOpacity={0.08}
              />

              {/* Range boundary lines */}
              <ReferenceLine
                y={300}
                stroke="currentColor"
                strokeDasharray="4 4"
                strokeWidth={0.5}
                strokeOpacity={0.3}
              />
              <ReferenceLine
                y={235}
                stroke="currentColor"
                strokeDasharray="4 4"
                strokeWidth={0.5}
                strokeOpacity={0.3}
              />
              <ReferenceLine
                y={170}
                stroke="currentColor"
                strokeDasharray="4 4"
                strokeWidth={0.5}
                strokeOpacity={0.3}
              />
              <ReferenceLine
                y={105}
                stroke="currentColor"
                strokeDasharray="4 4"
                strokeWidth={0.5}
                strokeOpacity={0.3}
              />

              <XAxis
                dataKey="time"
                type="category"
                ticks={hourlyTicks}
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
                allowDuplicatedCategory={false}
              />
              <YAxis
                domain={[40, 320]}
                ticks={[40, 105, 170, 235, 300]}
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <ZAxis range={[30, 30]} />
              <Tooltip
                content={<CustomTooltip />}
                cursor={false}
              />

              {/* In-range dots (green) */}
              <Scatter
                data={inRangeData}
                dataKey="value"
                fill="#22C55E"
                name="In Range"
              />
              {/* High/Low dots (orange) */}
              <Scatter
                data={highLowData}
                dataKey="value"
                fill="#F59E0B"
                name="High/Low"
              />
              {/* Urgent dots (red) */}
              <Scatter
                data={urgentData}
                dataKey="value"
                fill="#EF4444"
                name="Urgent"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
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
