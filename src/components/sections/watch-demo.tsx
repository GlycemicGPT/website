"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Battery, Mic, X, Bell, MessageSquare } from "lucide-react";

// --- Types ---

interface WatchState {
  phase: "face" | "rising" | "alert" | "chat" | "corrected";
  bg: number;
  trend: string;
  iob: string;
  time: string;
}

const states: WatchState[] = [
  { phase: "face", bg: 142, trend: "\u2192", iob: "0.45", time: "02:30" },
  { phase: "rising", bg: 195, trend: "\u2197", iob: "1.2", time: "02:35" },
  { phase: "alert", bg: 245, trend: "\u2191", iob: "1.2", time: "02:40" },
  { phase: "chat", bg: 210, trend: "\u2198", iob: "2.8", time: "02:48" },
  { phase: "corrected", bg: 128, trend: "\u2192", iob: "0.3", time: "03:15" },
];

// --- Watch Frame ---

function WatchFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[170px] sm:w-[185px]">
      {/* Crown button */}
      <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 h-6 w-2 rounded-r-sm bg-zinc-600" />
      {/* Bezel */}
      <div className="rounded-full border-[3px] border-zinc-700 bg-zinc-800 p-1 shadow-xl">
        {/* Screen */}
        <div className="overflow-hidden rounded-full bg-black aspect-square flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}

// --- Watch Face Screen (matches actual GlycemicGPT watch face) ---

function WatchFaceScreen({ state }: { state: WatchState }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-3 py-2">
      {/* Battery icon */}
      <Battery className="h-3 w-3 text-zinc-500 mb-0.5" />

      {/* BG Value + trend arrow (white, not colored) */}
      <div className="flex items-baseline gap-1">
        <span className="text-[28px] font-bold tabular-nums text-white leading-none">
          {state.bg}
        </span>
        <span className="text-base text-white">
          {state.trend}
        </span>
      </div>

      {/* BG label */}
      <span className="text-[8px] text-zinc-500 uppercase tracking-wider">
        BG
      </span>

      {/* IoB */}
      <span className="text-[9px] text-zinc-400 mt-1">
        IoB: {state.iob} u
      </span>

      {/* Mini glucose graph -- actual dot trend like the main chart */}
      <div className="relative w-[82%] mt-1.5 h-[22px] rounded-md overflow-hidden">
        {/* Background with target range band */}
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="absolute inset-x-0 top-[30%] bottom-[20%] bg-green-900/30" />
        {/* Graph dots -- SVG mini scatter plot */}
        <svg viewBox="0 0 100 30" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Target range lines */}
          <line x1="0" y1="8" x2="100" y2="8" stroke="#F59E0B" strokeWidth="0.3" strokeOpacity="0.3" strokeDasharray="2 2" />
          <line x1="0" y1="22" x2="100" y2="22" stroke="#F59E0B" strokeWidth="0.3" strokeOpacity="0.3" strokeDasharray="2 2" />
          {/* Glucose dots showing a trend pattern */}
          {state.phase === "rising" || state.phase === "alert" ? (
            /* Rising/high pattern */
            <>
              {[[5,20],[10,19],[15,18],[20,16],[25,15],[30,14],[35,13],[40,12],[42,11],[48,10],[53,9],[58,8],[63,7],[68,6],[73,5],[78,5],[83,4],[88,4],[93,3]].map(([x,y], i) => (
                <circle key={i} cx={x} cy={y} r="1.2" fill={y < 8 ? "#F59E0B" : y < 5 ? "#EF4444" : "#22C55E"} />
              ))}
            </>
          ) : (
            /* In-range / stable pattern */
            <>
              {[[5,16],[10,15],[15,14],[20,15],[25,16],[30,14],[35,13],[40,14],[42,15],[48,14],[53,13],[58,14],[63,15],[68,14],[73,13],[78,14],[83,15],[88,14],[93,15]].map(([x,y], i) => (
                <circle key={i} cx={x} cy={y} r="1.2" fill="#22C55E" />
              ))}
            </>
          )}
        </svg>
      </div>

      {/* Time (large, bold, matching real watch) */}
      <span className="text-[22px] font-bold text-white mt-1 tabular-nums leading-none">
        {state.time}
      </span>

      {/* Complication icons row (Alerts + AI Chat) */}
      <div className="flex items-center gap-4 mt-1">
        <div className="flex flex-col items-center">
          <Bell className="h-2.5 w-2.5 text-amber-400" />
          <span className="text-[6px] text-zinc-600">Alerts</span>
        </div>
        <span className="text-[7px] text-emerald-600 font-medium">
          GlycemicGPT
        </span>
        <div className="flex flex-col items-center">
          <MessageSquare className="h-2.5 w-2.5 text-blue-400" />
          <span className="text-[6px] text-zinc-600">AI Chat</span>
        </div>
      </div>
    </div>
  );
}

// --- Alert Screen ---

function AlertScreen({ state }: { state: WatchState }) {
  const isUrgent = state.bg > 200 || state.bg < 55;
  const alertColor = isUrgent ? "#EF4444" : "#FBBF24";

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-5 py-4">
      <span
        className="text-[10px] font-bold uppercase tracking-wider"
        style={{ color: alertColor }}
      >
        High Glucose
      </span>
      <span
        className="text-2xl font-bold mt-1 tabular-nums"
        style={{ color: alertColor }}
      >
        {state.bg}
      </span>
      <span className="text-[8px] text-zinc-500">mg/dL</span>
      <span className="text-[9px] text-zinc-400 mt-2 text-center leading-snug">
        Consider correction bolus
      </span>
      <div className="mt-2 flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1 border border-zinc-700">
        <X className="h-2.5 w-2.5 text-zinc-400" />
        <span className="text-[9px] text-zinc-400">Dismiss</span>
      </div>
    </div>
  );
}

// --- Chat Screen ---

function ChatScreen() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 py-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 mb-1.5">
        <Mic className="h-3.5 w-3.5 text-white" />
      </div>
      <span className="text-[10px] text-white font-semibold">
        &ldquo;How am I doing?&rdquo;
      </span>
      <div className="mt-1.5 rounded-lg bg-zinc-800 border border-zinc-700 px-2 py-1.5 max-w-[90%]">
        <span className="text-[8px] text-zinc-300 leading-snug block">
          Trending high after lunch. Correction delivered. Back in range within 90 min.
        </span>
      </div>
      <span className="text-[7px] text-zinc-600 mt-1.5">Tap mic to ask</span>
    </div>
  );
}

// --- Main Component ---

export function WatchDemo() {
  const prefersReducedMotion = useReducedMotion();
  const [stateIdx, setStateIdx] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setStateIdx((i) => (i + 1) % states.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const current = states[stateIdx];

  return (
    <WatchFrame>
      <AnimatePresence mode="wait">
        <motion.div
          key={current.phase}
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {current.phase === "alert" ? (
            <AlertScreen state={current} />
          ) : current.phase === "chat" ? (
            <ChatScreen />
          ) : (
            <WatchFaceScreen state={current} />
          )}
        </motion.div>
      </AnimatePresence>
    </WatchFrame>
  );
}
