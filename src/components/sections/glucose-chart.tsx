"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatedSection } from "@/components/animated-section";
import {
  allGlucoseData,
  allBolusData,
  filterByPeriod,
  getBasalAt,
  getRangeColor,
  formatTime,
  formatDate,
  formatDateTime,
  PERIODS,
  type BolusEvent,
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
const Line = dynamic(
  () => import("recharts").then((m) => m.Line),
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
  payload: {
    timestamp: number;
    value?: number;
    units?: number;
    type?: string;
    rate?: number;
  };
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

  // Bolus tooltip
  if (data.units != null) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <div className="text-xs font-medium text-primary">
          {data.type === "meal" ? "Meal Bolus" : "Correction"}
        </div>
        <div className="text-sm font-bold">{data.units}u</div>
        <div className="text-xs text-muted-foreground">
          {formatDateTime(data.timestamp)}
        </div>
      </div>
    );
  }

  // Glucose tooltip
  const value = data.value ?? 0;
  const basal = getBasalAt(data.timestamp);
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
      <div className="text-lg font-bold" style={{ color: getRangeColor(value) }}>
        {value} mg/dL {trendArrow}
      </div>
      <div className="text-xs text-muted-foreground">{trend}</div>
      <div className="text-xs text-muted-foreground">
        {formatDateTime(data.timestamp)}
      </div>
      <div className="mt-1 border-t border-border pt-1 text-xs text-muted-foreground">
        Basal: {basal} u/hr
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
  const bolusData = filterByPeriod(allBolusData, period.hours);

  const basalData = glucoseData.map((g) => ({
    timestamp: g.timestamp,
    rate: getBasalAt(g.timestamp),
  }));

  const inRange = glucoseData.filter((d) => d.value >= 70 && d.value <= 180);
  const highLow = glucoseData.filter(
    (d) => (d.value > 180 && d.value <= 250) || (d.value >= 55 && d.value < 70)
  );
  const urgent = glucoseData.filter((d) => d.value > 250 || d.value < 55);

  const bolusPoints = bolusData.map((b) => ({ ...b, plotY: 50 }));

  const currentValue =
    glucoseData.length > 0 ? glucoseData[glucoseData.length - 1].value : 0;
  const xTicks = getXTicks(glucoseData, period.hours);

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
              <div className="font-semibold">
                {basalData.length > 0
                  ? basalData[basalData.length - 1].rate
                  : 0}{" "}
                u/hr
              </div>
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
              Hover to explore
            </span>
          </div>
          <div className="flex gap-1">
            {PERIODS.map((p, i) => (
              <button
                key={p.label}
                onClick={() => setPeriodIdx(i)}
                className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
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

        {/* Chart */}
        <div className="h-64 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              margin={{ top: 10, right: 30, left: -15, bottom: 0 }}
            >
              <ReferenceArea
                yAxisId="glucose"
                y1={70}
                y2={180}
                fill="#22C55E"
                fillOpacity={0.06}
              />
              <ReferenceLine
                yAxisId="glucose"
                y={250}
                stroke="currentColor"
                strokeDasharray="3 3"
                strokeWidth={0.5}
                strokeOpacity={0.2}
              />
              <ReferenceLine
                yAxisId="glucose"
                y={180}
                stroke="currentColor"
                strokeDasharray="3 3"
                strokeWidth={0.5}
                strokeOpacity={0.2}
              />
              <ReferenceLine
                yAxisId="glucose"
                y={70}
                stroke="currentColor"
                strokeDasharray="3 3"
                strokeWidth={0.5}
                strokeOpacity={0.2}
              />

              <XAxis
                dataKey="timestamp"
                type="number"
                domain={["dataMin", "dataMax"]}
                ticks={xTicks}
                tickFormatter={(ts: number) => formatXTick(ts, period.hours)}
                tick={{ fontSize: 10 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
                allowDuplicatedCategory={false}
              />
              <YAxis
                yAxisId="glucose"
                domain={[40, 300]}
                ticks={[70, 120, 180, 250]}
                tick={{ fontSize: 10 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="basal"
                orientation="right"
                domain={[0, 3]}
                ticks={[0.5, 1.0, 1.5]}
                tick={{ fontSize: 9 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}u`}
              />
              <ZAxis range={[20, 20]} />
              <Tooltip content={<CustomTooltip />} cursor={false} />

              {/* Basal rate step line */}
              <Line
                yAxisId="basal"
                data={basalData}
                dataKey="rate"
                type="stepAfter"
                stroke="#6366F1"
                strokeWidth={1.5}
                strokeOpacity={0.5}
                dot={false}
                activeDot={false}
              />

              {/* Glucose scatter dots */}
              <Scatter
                yAxisId="glucose"
                data={inRange}
                dataKey="value"
                fill="#22C55E"
                name="In Range"
              />
              <Scatter
                yAxisId="glucose"
                data={highLow}
                dataKey="value"
                fill="#F59E0B"
                name="High/Low"
              />
              <Scatter
                yAxisId="glucose"
                data={urgent}
                dataKey="value"
                fill="#EF4444"
                name="Urgent"
              />

              {/* Bolus markers */}
              <Scatter
                yAxisId="glucose"
                data={bolusPoints}
                dataKey="plotY"
                fill="#8B5CF6"
                name="Bolus"
                shape={(props: {
                  cx?: number;
                  cy?: number;
                  payload?: BolusEvent & { plotY: number };
                }) => {
                  if (!props.cx || !props.cy || !props.payload) return null;
                  const isMeal = props.payload.type === "meal";
                  return (
                    <g>
                      <polygon
                        points={`${props.cx},${props.cy - 8} ${props.cx - 5},${props.cy + 2} ${props.cx + 5},${props.cy + 2}`}
                        fill={isMeal ? "#8B5CF6" : "#EC4899"}
                        opacity={0.8}
                      />
                      <text
                        x={props.cx}
                        y={props.cy + 14}
                        textAnchor="middle"
                        fill="currentColor"
                        className="fill-muted-foreground"
                        style={{ fontSize: "8px" }}
                      >
                        {props.payload.units}u
                      </text>
                    </g>
                  );
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
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
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1 w-4 bg-[#6366F1] opacity-50" />
            Basal Rate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent border-b-[#8B5CF6]" />
            Meal Bolus
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent border-b-[#EC4899]" />
            Correction
          </span>
        </div>
      </div>
    </AnimatedSection>
  );
}
