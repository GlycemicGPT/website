export interface GlucoseReading {
  time: string;
  value: number;
  hour: number;
}

function generateGlucoseData(): GlucoseReading[] {
  const data: GlucoseReading[] = [];

  for (let i = 0; i < 288; i++) {
    const hour = (i * 5) / 60;
    const minutes = i * 5;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const time = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

    let base: number;

    if (hour < 4) {
      // Overnight: stable 110-125
      base = 115 + Math.sin(hour * 0.5) * 8;
    } else if (hour < 7) {
      // Dawn phenomenon: gradual rise 115->160
      base = 115 + ((hour - 4) / 3) * 50;
    } else if (hour < 8) {
      // Breakfast spike start
      base = 165 + (hour - 7) * 55;
    } else if (hour < 9.5) {
      // Post-breakfast peak and correction
      base = 220 - ((hour - 8) / 1.5) * 70;
    } else if (hour < 12) {
      // Mid-morning settling
      base = 150 - ((hour - 9.5) / 2.5) * 20;
    } else if (hour < 13) {
      // Lunch spike
      base = 130 + (hour - 12) * 60;
    } else if (hour < 15) {
      // Post-lunch correction
      base = 190 - ((hour - 13) / 2) * 55;
    } else if (hour < 18) {
      // Afternoon stable
      base = 135 + Math.sin((hour - 15) * 0.8) * 12;
    } else if (hour < 19) {
      // Dinner spike
      base = 140 + (hour - 18) * 55;
    } else if (hour < 21) {
      // Post-dinner correction
      base = 195 - ((hour - 19) / 2) * 60;
    } else {
      // Evening settling
      base = 135 - ((hour - 21) / 3) * 20;
    }

    // Add realistic noise
    const noise = (Math.sin(i * 2.7) * 8 + Math.cos(i * 1.3) * 5);
    const value = Math.round(Math.max(65, Math.min(260, base + noise)));

    data.push({ time, value, hour });
  }

  return data;
}

export const glucoseData = generateGlucoseData();

export const currentBG = glucoseData[glucoseData.length - 1];

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
