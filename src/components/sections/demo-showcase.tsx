"use client";

import { useState, useCallback } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { PhoneDemo } from "./phone-demo";
import { BrowserDemo } from "./browser-demo";

export function DemoShowcaseSection() {
  // Sync: browser starts its animation when phone enters daily brief alert
  const [briefTrigger, setBriefTrigger] = useState(0);
  const onDailyBriefAlert = useCallback(() => {
    setBriefTrigger((t) => t + 1);
  }, []);

  return (
    <AnimatedSection className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-12 text-center">
        <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          See the Platform in Action
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Manage diabetes from your phone or the web. AI-powered insights,
          real-time alerts, and daily briefs -- wherever you are.
        </p>
      </div>

      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-12">
        {/* Phone demo: AI Chat + Caregiver Alerts */}
        <div className="flex flex-col items-center gap-3">
          <PhoneDemo onDailyBriefAlert={onDailyBriefAlert} />
          <p className="text-sm font-semibold">Your Pocket Endo</p>
          <p className="max-w-[280px] text-center text-xs text-muted-foreground">
            AI chat, predictive insights, and caregiver alerts -- all from your
            phone.
          </p>
        </div>

        {/* Browser demo: Daily Briefs */}
        <div className="flex flex-col items-center gap-3">
          <BrowserDemo trigger={briefTrigger} />
          <p className="text-sm font-semibold">Your Dashboard, Anywhere</p>
          <p className="max-w-[400px] text-center text-xs text-muted-foreground">
            Morning briefs, pattern analysis, and trend reports delivered to your
            web dashboard.
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}
