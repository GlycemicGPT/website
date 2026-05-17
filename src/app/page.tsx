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

// Lazy-loaded heavy sections -- both pull in libs (Recharts ~500KB, framer-motion
// ~30KB gzipped + parse cost) that aren't needed for initial paint. These sections
// are below the fold and have their own reveal-on-scroll anyway.
const GlucoseChartSection = dynamic(
  () =>
    import("@/components/sections/glucose-chart").then(
      (m) => m.GlucoseChartSection
    ),
  { ssr: false }
);
const DemoShowcaseSection = dynamic(
  () =>
    import("@/components/sections/demo-showcase").then(
      (m) => m.DemoShowcaseSection
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
        <DemoShowcaseSection />
        <ArchitectureSection />
        <StatsSection />
        <GettingStartedSection />
      </main>
      <Footer />
    </>
  );
}
