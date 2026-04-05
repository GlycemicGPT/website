export interface GlucoseReading {
  timestamp: number; // ms since epoch
  value: number;
}

export interface BasalSegment {
  timestamp: number;
  rate: number; // u/hr
}

export interface BolusEvent {
  timestamp: number;
  units: number;
  type: "meal" | "correction";
}

// Generate 30 days of realistic CGM data ending at a fixed point.
// Using a fixed anchor ensures data doesn't change on page re-renders.
const DAYS = 30;
const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
// Pin to April 5, 2026 3:00 PM -- stable across renders and builds
const NOW = new Date("2026-04-05T15:00:00").getTime();
const START = NOW - DAYS * 24 * 60 * 60 * 1000;

// Seeded pseudo-random for deterministic output across renders
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateGlucoseData(): GlucoseReading[] {
  const data: GlucoseReading[] = [];
  const rand = seededRandom(42);

  // Pre-generate per-day variation so each day feels different
  const dayVariations: { shift: number; bkfSpike: number; lunchSpike: number; dinnerSpike: number; dawn: number }[] = [];
  for (let d = 0; d < DAYS; d++) {
    dayVariations.push({
      shift: (rand() - 0.5) * 30,         // -15 to +15 overall shift
      bkfSpike: 30 + rand() * 40,          // 30-70 spike magnitude
      lunchSpike: 25 + rand() * 35,        // 25-60
      dinnerSpike: 30 + rand() * 45,       // 30-75
      dawn: 20 + rand() * 30,              // 20-50 dawn phenomenon
    });
  }

  // Smoothed random walk for CGM-like noise (no sudden jumps)
  let smoothNoise = 0;

  for (let ts = START; ts <= NOW; ts += INTERVAL_MS) {
    const date = new Date(ts);
    const hour = date.getHours() + date.getMinutes() / 60;
    const dayIndex = Math.floor((ts - START) / (24 * 60 * 60 * 1000));
    const dv = dayVariations[Math.min(dayIndex, dayVariations.length - 1)];

    let base: number;

    if (hour < 4) {
      base = 110 + Math.sin(hour * 0.3) * 5;
    } else if (hour < 7) {
      // Dawn phenomenon (variable per day)
      base = 110 + ((hour - 4) / 3) * dv.dawn;
    } else if (hour < 8) {
      // Breakfast spike start
      base = 110 + dv.dawn + (hour - 7) * dv.bkfSpike;
    } else if (hour < 10.5) {
      // Post-breakfast correction (gradual)
      const peak = 110 + dv.dawn + dv.bkfSpike;
      base = peak - ((hour - 8) / 2.5) * (peak - 130);
    } else if (hour < 12) {
      // Mid-morning stability
      base = 130 + Math.sin((hour - 10.5) * 1.2) * 8;
    } else if (hour < 13) {
      // Lunch spike
      base = 130 + (hour - 12) * dv.lunchSpike;
    } else if (hour < 15.5) {
      // Post-lunch correction
      const peak = 130 + dv.lunchSpike;
      base = peak - ((hour - 13) / 2.5) * (peak - 125);
    } else if (hour < 18) {
      // Afternoon
      base = 125 + Math.sin((hour - 15.5) * 0.6) * 10;
    } else if (hour < 19.5) {
      // Dinner spike
      base = 130 + ((hour - 18) / 1.5) * dv.dinnerSpike;
    } else if (hour < 22) {
      // Post-dinner correction
      const peak = 130 + dv.dinnerSpike;
      base = peak - ((hour - 19.5) / 2.5) * (peak - 120);
    } else {
      // Evening settling
      base = 120 - ((hour - 22) / 2) * 10;
    }

    base += dv.shift;

    // Smooth random walk: small steps, CGM-like (max ~3 mg/dL change per 5 min)
    smoothNoise += (rand() - 0.5) * 6;
    smoothNoise *= 0.92; // decay toward zero
    const value = Math.round(Math.max(55, Math.min(320, base + smoothNoise)));

    data.push({ timestamp: ts, value });
  }

  return data;
}

function generateBasalData(): BasalSegment[] {
  const segments: BasalSegment[] = [];
  const rates = [
    { hour: 0, rate: 0.8 },
    { hour: 3, rate: 0.9 },
    { hour: 6, rate: 1.2 },
    { hour: 9, rate: 0.85 },
    { hour: 12, rate: 1.0 },
    { hour: 15, rate: 0.9 },
    { hour: 18, rate: 1.1 },
    { hour: 21, rate: 0.85 },
  ];

  for (let day = 0; day < DAYS; day++) {
    const dayStart = START + day * 24 * 60 * 60 * 1000;
    for (const { hour, rate } of rates) {
      segments.push({
        timestamp: dayStart + hour * 60 * 60 * 1000,
        rate,
      });
    }
  }

  return segments;
}

function generateBolusData(): BolusEvent[] {
  const events: BolusEvent[] = [];
  const rand = seededRandom(99);

  for (let day = 0; day < DAYS; day++) {
    const dayStart = START + day * 24 * 60 * 60 * 1000;

    // Breakfast bolus ~7:00-7:30
    events.push({
      timestamp: dayStart + (7 * 60 + Math.round(rand() * 30)) * 60 * 1000,
      units: 4 + Math.round(rand() * 3 * 10) / 10,
      type: "meal",
    });

    // Lunch bolus ~12:00-12:30
    events.push({
      timestamp: dayStart + (12 * 60 + Math.round(rand() * 30)) * 60 * 1000,
      units: 3.5 + Math.round(rand() * 2.5 * 10) / 10,
      type: "meal",
    });

    // Dinner bolus ~18:00-18:45
    events.push({
      timestamp: dayStart + (18 * 60 + Math.round(rand() * 45)) * 60 * 1000,
      units: 4.5 + Math.round(rand() * 3 * 10) / 10,
      type: "meal",
    });

    // Occasional correction bolus ~15:00-16:00 (50% of days)
    if (rand() > 0.5) {
      events.push({
        timestamp: dayStart + (15 * 60 + Math.round(rand() * 60)) * 60 * 1000,
        units: 0.5 + Math.round(rand() * 1.5 * 10) / 10,
        type: "correction",
      });
    }
  }

  return events;
}

export const allGlucoseData = generateGlucoseData();
export const allBasalData = generateBasalData();
export const allBolusData = generateBolusData();

/** Filter data to a time window ending at `now`. */
export function filterByPeriod<T extends { timestamp: number }>(
  data: T[],
  periodHours: number
): T[] {
  const cutoff = NOW - periodHours * 60 * 60 * 1000;
  return data.filter((d) => d.timestamp >= cutoff);
}

/** Get the basal rate at a given timestamp (step function). */
export function getBasalAt(timestamp: number): number {
  let rate = 0.8;
  for (const seg of allBasalData) {
    if (seg.timestamp <= timestamp) {
      rate = seg.rate;
    } else {
      break;
    }
  }
  return rate;
}

export function getRangeLabel(value: number): string {
  if (value < 55) return "Very Low";
  if (value < 70) return "Low";
  if (value <= 180) return "In Range";
  if (value <= 250) return "High";
  return "Very High";
}

export function getRangeColor(value: number): string {
  if (value < 55) return "#EF4444";
  if (value < 70) return "#F59E0B";
  if (value <= 180) return "#22C55E";
  if (value <= 250) return "#F59E0B";
  return "#EF4444";
}

export function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m} ${ampm}`;
}

export function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDateTime(ts: number): string {
  return `${formatDate(ts)} ${formatTime(ts)}`;
}

/** Period definitions matching the platform's chart-periods.ts */
export const PERIODS = [
  { label: "3H", hours: 3 },
  { label: "6H", hours: 6 },
  { label: "12H", hours: 12 },
  { label: "24H", hours: 24 },
  { label: "3D", hours: 72 },
  { label: "7D", hours: 168 },
  { label: "14D", hours: 336 },
  { label: "30D", hours: 720 },
] as const;

/** Returns true for multi-day periods (>= 3D) -- used for dot sizing */
export function isMultiDay(hours: number): boolean {
  return hours >= 72;
}

/**
 * LTTB (Largest Triangle Three Buckets) downsampling.
 * Preserves visual shape while reducing point count.
 * Matches the platform's downsample implementation.
 */
export function lttbDownsample<T extends { timestamp: number; value: number }>(
  data: T[],
  targetPoints: number
): T[] {
  if (data.length <= targetPoints) return data;

  const result: T[] = [data[0]]; // always keep first
  const bucketSize = (data.length - 2) / (targetPoints - 2);

  let prevIndex = 0;

  for (let i = 1; i < targetPoints - 1; i++) {
    const rangeStart = Math.floor((i - 1) * bucketSize) + 1;
    const rangeEnd = Math.min(Math.floor(i * bucketSize) + 1, data.length - 1);

    // Average of next bucket for area calculation
    const nextStart = Math.floor(i * bucketSize) + 1;
    const nextEnd = Math.min(Math.floor((i + 1) * bucketSize) + 1, data.length - 1);
    let avgX = 0;
    let avgY = 0;
    let count = 0;
    for (let j = nextStart; j < nextEnd; j++) {
      avgX += data[j].timestamp;
      avgY += data[j].value;
      count++;
    }
    if (count > 0) {
      avgX /= count;
      avgY /= count;
    }

    // Find point in current bucket that forms largest triangle
    let maxArea = -1;
    let maxIndex = rangeStart;
    const prev = data[prevIndex];
    for (let j = rangeStart; j < rangeEnd; j++) {
      const area = Math.abs(
        (prev.timestamp - avgX) * (data[j].value - prev.value) -
        (prev.timestamp - data[j].timestamp) * (avgY - prev.value)
      );
      if (area > maxArea) {
        maxArea = area;
        maxIndex = j;
      }
    }

    result.push(data[maxIndex]);
    prevIndex = maxIndex;
  }

  result.push(data[data.length - 1]); // always keep last
  return result;
}
