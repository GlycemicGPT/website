"use client";

import dynamic from "next/dynamic";
import { AnimatedSection } from "@/components/animated-section";
import { glucoseData, getRangeLabel, getRangeColor } from "@/lib/sample-data";
import { TrendingDown, Minus } from "lucide-react";

const AreaChart = dynamic(
  () => import("recharts").then((m) => m.AreaChart),
  { ssr: false }
);
const Area = dynamic(
  () => import("recharts").then((m) => m.Area),
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
const ReferenceLine = dynamic(
  () => import("recharts").then((m) => m.ReferenceLine),
  { ssr: false }
);
const ReferenceArea = dynamic(
  () => import("recharts").then((m) => m.ReferenceArea),
  { ssr: false }
);
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);

// Show every 3 hours on the axis
const hourlyTicks = glucoseData
  .filter((d) => d.hour % 3 === 0 && d.time.endsWith(":00"))
  .map((d) => d.time);

interface TooltipPayloadItem {
  value: number;
  payload: { time: string; value: number };
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
  const data = payload[0];
  const value = data.value;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <div className="text-xs text-muted-foreground">{data.payload.time}</div>
      <div className="flex items-center gap-2">
        <span
          className="text-lg font-bold"
          style={{ color: getRangeColor(value) }}
        >
          {value}
        </span>
        <span className="text-xs text-muted-foreground">mg/dL</span>
      </div>
      <div
        className="text-xs font-medium"
        style={{ color: getRangeColor(value) }}
      >
        {getRangeLabel(value)}
      </div>
    </div>
  );
}

export function GlucoseChartSection() {
  const currentValue = glucoseData[glucoseData.length - 1].value;
  const prevValue = glucoseData[glucoseData.length - 4].value;
  const trend = currentValue - prevValue;

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
        {/* Current BG display */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <span
              className="text-4xl font-bold tabular-nums"
              style={{ color: getRangeColor(currentValue) }}
            >
              {currentValue}
            </span>
            <span className="text-sm text-muted-foreground">mg/dL</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            {Math.abs(trend) < 5 ? (
              <Minus className="h-5 w-5" />
            ) : trend < 0 ? (
              <TrendingDown className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5 rotate-180" />
            )}
            <span className="text-sm">
              {trend > 0 ? "+" : ""}
              {trend} mg/dL
            </span>
          </div>
          <span
            className="ml-auto rounded-full px-3 py-1 text-xs font-medium"
            style={{
              color: getRangeColor(currentValue),
              backgroundColor: `${getRangeColor(currentValue)}15`,
            }}
          >
            {getRangeLabel(currentValue)}
          </span>
        </div>

        {/* Chart */}
        <div className="h-64 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={glucoseData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Target range shading */}
              <ReferenceArea y1={70} y2={180} fill="#22C55E" fillOpacity={0.04} />

              {/* Range lines */}
              <ReferenceLine
                y={180}
                stroke="#F59E0B"
                strokeDasharray="4 4"
                strokeWidth={1}
                strokeOpacity={0.5}
              />
              <ReferenceLine
                y={70}
                stroke="#F59E0B"
                strokeDasharray="4 4"
                strokeWidth={1}
                strokeOpacity={0.5}
              />

              <XAxis
                dataKey="time"
                ticks={hourlyTicks}
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[40, 280]}
                ticks={[70, 120, 180, 250]}
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#22C55E"
                strokeWidth={2}
                fill="url(#glucoseGradient)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AnimatedSection>
  );
}
