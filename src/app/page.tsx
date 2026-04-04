"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/sections/hero";
import { FeaturesSection } from "@/components/sections/features";
import { ArchitectureSection } from "@/components/sections/architecture";
import { GlucoseChartSection } from "@/components/sections/glucose-chart";
import { StatsSection } from "@/components/sections/stats";
import { ConnectSection } from "@/components/sections/connect";
import { GettingStartedSection } from "@/components/sections/getting-started";

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
