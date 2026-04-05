"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/sections/hero";
import { FeaturesSection } from "@/components/sections/features";
import { ConnectSection } from "@/components/sections/connect";
import { ArchitectureSection } from "@/components/sections/architecture";
import { StatsSection } from "@/components/sections/stats";
import { GettingStartedSection } from "@/components/sections/getting-started";

// Lazy load the chart section -- Recharts is heavy (~500KB) and below the fold
const GlucoseChartSection = dynamic(
  () =>
    import("@/components/sections/glucose-chart").then(
      (m) => m.GlucoseChartSection
    ),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <Header />
      <main className="scroll-smooth">
        <HeroSection />
        <FeaturesSection />
        <ConnectSection />
        <GlucoseChartSection />
        <ArchitectureSection />
        <StatsSection />
        <GettingStartedSection />
      </main>
      <Footer />
    </>
  );
}
