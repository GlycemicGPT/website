"use client";

import dynamic from "next/dynamic";
import { AnimatedSection } from "@/components/animated-section";
import {
  allGlucoseData,
  allBolusData,
  allBasalData,
  filterByPeriod,
  getBasalAt,
  getRangeColor,
  formatTime,
  formatDate,
  formatDateTime,
  PERIODS,
  isMultiDay,
  lttbDownsample,
  type GlucoseReading,
  type BolusEvent,
} from "@/lib/sample-data";

// Max visual points for chart rendering (matches platform)
const MAX_CHART_POINTS = 500;
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
const Area = dynamic(
  () => import("recharts").then((m) => m.Area),
  { ssr: false }
);

// --- Tooltip ---

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

  // Find the right payload item -- Recharts may include basal Area data too.
  // Prioritize: bolus (has units) > glucose (has value > 0) > first item
  let data = payload[0].payload;
  for (const item of payload) {
    if (item.payload.units != null) { data = item.payload; break; }
    if (item.payload.value && item.payload.value > 40 && !item.payload.rate) {
      data = item.payload;
      break;
    }
  }

  // Bolus tooltip
  if (data.units != null) {
    const isAuto = data.type === "correction";
    const color = isAuto ? "#3b82f6" : "#8b5cf6";
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <div className="text-sm font-bold" style={{ color }}>
          {data.units}u {isAuto ? "Auto Correction" : "Manual Bolus"}
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDateTime(data.timestamp)}
        </div>
      </div>
    );
  }

  // Glucose tooltip
  const value = data.value ?? 0;
  if (value < 40) return null; // Skip basal-only hits

  const basal = getBasalAt(data.timestamp);
  const idx = allGlucoseData.findIndex((d) => d.timestamp === data.timestamp);
  const prev = idx > 3 ? allGlucoseData[idx - 3].value : value;
  const diff = value - prev;
  let trend = "Stable";
  let trendArrow = "\u2192";
  if (diff > 10) { trend = "Rising"; trendArrow = "\u2197"; }
  else if (diff > 3) { trend = "Rising slowly"; trendArrow = "\u2197"; }
  else if (diff < -10) { trend = "Falling"; trendArrow = "\u2198"; }
  else if (diff < -3) { trend = "Falling slowly"; trendArrow = "\u2198"; }

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <div className="text-lg font-bold" style={{ color: getRangeColor(value) }}>
        {value} mg/dL {trendArrow}
      </div>
      <div className="text-xs text-muted-foreground">{trend}</div>
      <div className="text-xs text-muted-foreground">{formatDateTime(data.timestamp)}</div>
      <div className="mt-1 border-t border-border pt-1 text-xs text-muted-foreground">
        Basal: {basal} u/hr
      </div>
    </div>
  );
}

// --- Bolus marker shape (matches platform exactly) ---
// Auto corrections = blue diamond, Manual boluses = purple circle

function renderBolusMarker(props: {
  cx?: number;
  cy?: number;
  payload?: Record<string, unknown>;
}) {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null || !payload) return <g />;
  const p = payload as unknown as BolusEvent & { value: number };
  const isAuto = p.type === "correction";
  const color = isAuto ? "#3b82f6" : "#8b5cf6";
  const r = 5;
  return (
    <g>
      {isAuto ? (
        <polygon
          points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
          fill={color}
          opacity={0.9}
        />
      ) : (
        <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.9} />
      )}
      <text
        x={cx}
        y={cy - r - 3}
        textAnchor="middle"
        fill={color}
        fontSize={9}
        fontWeight={600}
      >
        {p.units.toFixed(1)}u
      </text>
      {isAuto && (
        <text
          x={cx}
          y={cy - r - 13}
          textAnchor="middle"
          fill={color}
          fontSize={7}
          opacity={0.8}
        >
          AUTO
        </text>
      )}
    </g>
  );
}

// --- Helpers ---

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
  while (t <= last) { ticks.push(t); t += intervalMs; }
  return ticks;
}

function formatXTick(ts: number, periodHours: number): string {
  if (periodHours <= 24) return formatTime(ts);
  if (periodHours <= 72) return `${formatDate(ts)} ${formatTime(ts)}`;
  return formatDate(ts);
}

// --- Main component ---

export function GlucoseChartSection() {
  // Demo locked to 24H -- other buttons shown for feature showcase only
  const periodIdx = 3; // 24H
  const period = PERIODS[periodIdx];

  const multiDay = isMultiDay(period.hours);
  const rawGlucose = filterByPeriod(allGlucoseData, period.hours);
  // LTTB downsample for longer periods (matches platform MAX_CHART_POINTS=500)
  const glucoseData = lttbDownsample(rawGlucose, MAX_CHART_POINTS);
  const bolusData = filterByPeriod(allBolusData, period.hours);
  const basalSegments = filterByPeriod(allBasalData, period.hours);

  // Dot size: r=4 for intraday, r=2 for multi-day (matches platform)
  const dotSize = multiDay ? 12 : 35;

  const inRange = glucoseData.filter((d) => d.value >= 70 && d.value <= 180);
  const highLow = glucoseData.filter(
    (d) => (d.value > 180 && d.value <= 250) || (d.value >= 55 && d.value < 70)
  );
  const urgent = glucoseData.filter((d) => d.value > 250 || d.value < 55);

  const currentValue = glucoseData.length > 0 ? glucoseData[glucoseData.length - 1].value : 0;
  const xTicks = getXTicks(glucoseData, period.hours);

  // Auto-scale Y axis
  const allValues = glucoseData.map((d) => d.value);
  const dataMin = Math.min(...allValues);
  const dataMax = Math.max(...allValues);
  const yMin = Math.max(40, Math.floor((dataMin - 20) / 10) * 10);
  const yMax = Math.min(400, Math.ceil((dataMax + 20) / 10) * 10);
  const yTicks: number[] = [];
  const yStep = yMax - yMin > 200 ? 70 : 50;
  for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) yTicks.push(y);

  // Build basal step data sampled at glucose timestamps for Area chart
  const basalLineData = glucoseData.map((g) => ({
    timestamp: g.timestamp,
    rate: getBasalAt(g.timestamp),
  }));

  // Insulin Y domain -- scale so basal occupies ~25% of chart height
  const maxRate = basalSegments.length > 0
    ? basalSegments.reduce((m, b) => Math.max(m, b.rate), 0)
    : 1.5;
  const insulinDomain = [0, maxRate * 4];

  // Bolus scatter data positioned near chart top
  const bolusY = yMax - (yMax - yMin) * 0.05;
  const bolusScatterData = bolusData.map((b) => ({ ...b, value: bolusY }));

  return (
    <AnimatedSection className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Real-Time Glucose Monitoring
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Interactive demo built with the same technology powering the platform.
          Hover over the chart to explore 24 hours of glucose, insulin, and basal data.
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
            <span className="text-5xl font-bold tabular-nums sm:text-6xl" style={{ color: getRangeColor(currentValue) }}>
              {currentValue}
            </span>
            <ArrowRight className="h-8 w-8" style={{ color: getRangeColor(currentValue) }} />
          </div>
          <div className="mt-1 text-center text-sm text-muted-foreground">mg/dL</div>
          <div className="mt-4 flex items-center justify-center gap-6 text-center text-xs sm:gap-10 sm:text-sm">
            <div className="border-r border-border pr-6 sm:pr-10">
              <div className="font-medium text-muted-foreground">IOB</div>
              <div className="font-semibold">0.45u</div>
            </div>
            <div className="border-r border-border pr-6 sm:pr-10">
              <div className="font-medium text-muted-foreground">BASAL</div>
              <div className="font-semibold">{basalLineData.length > 0 ? basalLineData[basalLineData.length - 1].rate.toFixed(2) : "0.85"} u/hr</div>
            </div>
            <div className="border-r border-border pr-6 sm:pr-10">
              <div className="font-medium text-muted-foreground">BATTERY</div>
              <div className="font-semibold">72%</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">RESERVOIR</div>
              <div className="font-semibold">185u</div>
            </div>
          </div>
        </div>

        {/* Chart header */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Glucose Trend</span>
            <span className="text-xs text-muted-foreground">Drag chart to zoom</span>
          </div>
          <div className="flex gap-0.5">
            {PERIODS.map((p, i) => (
              <span
                key={p.label}
                className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                  i === periodIdx ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 10, right: 30, left: -15, bottom: 0 }}>
              {/* Target range shading */}
              <ReferenceArea yAxisId="glucose" y1={70} y2={180} fill="#22C55E" fillOpacity={0.06} />

              {/* Grid lines */}
              {yTicks.map((y) => (
                <ReferenceLine key={y} yAxisId="glucose" y={y} stroke="currentColor" strokeDasharray="3 6" strokeWidth={0.5} strokeOpacity={0.15} />
              ))}

              {/* Basal rate filled area at chart bottom */}
              <Area
                yAxisId="insulin"
                data={basalLineData}
                dataKey="rate"
                type="stepAfter"
                fill="#3b82f6"
                fillOpacity={0.15}
                stroke="#3b82f6"
                strokeOpacity={0.6}
                strokeWidth={1}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />

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
                yAxisId="glucose"
                domain={[yMin, yMax]}
                ticks={yTicks}
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="insulin"
                orientation="right"
                domain={insulinDomain}
                ticks={[0.5, 1.0, 1.5]}
                tick={{ fontSize: 9 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}u`}
              />
              {/* Dot size: smaller for multi-day views (matches platform) */}
              <ZAxis range={[dotSize, dotSize]} />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "currentColor", strokeOpacity: 0.15, strokeDasharray: "3 3" }}
              />

              {/* Invisible line for tooltip hover detection across full X range */}
              <Line
                yAxisId="glucose"
                data={glucoseData}
                dataKey="value"
                stroke="transparent"
                strokeWidth={0}
                dot={false}
                activeDot={{ r: 5, fill: "currentColor", className: "fill-primary", strokeWidth: 0 }}
                isAnimationActive={false}
              />

              {/* Glucose scatter dots */}
              <Scatter yAxisId="glucose" data={inRange} dataKey="value" fill="#22C55E" name="In Range" />
              <Scatter yAxisId="glucose" data={highLow} dataKey="value" fill="#F59E0B" name="High/Low" />
              <Scatter yAxisId="glucose" data={urgent} dataKey="value" fill="#EF4444" name="Urgent" />

              {/* Bolus markers near chart top -- diamond for auto, circle for manual */}
              {bolusScatterData.length > 0 && (
                <Scatter
                  yAxisId="glucose"
                  data={bolusScatterData}
                  dataKey="value"
                  shape={renderBolusMarker}
                  name="Bolus"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend -- matches platform */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
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
            <span className="inline-block h-2 w-2 rotate-45 bg-[#3b82f6]" />
            Auto Correction
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#8b5cf6]" />
            Manual Bolus
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-4 rounded-sm bg-[#3b82f6] opacity-30" />
            Basal Rate
          </span>
        </div>
      </div>
    </AnimatedSection>
  );
}
