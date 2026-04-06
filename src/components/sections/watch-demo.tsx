"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mic, X } from "lucide-react";

// --- Types ---

interface WatchState {
  phase: "face" | "rising" | "alert" | "chat" | "corrected";
  bg: number;
  trend: string;
  color: string;
  iob: string;
  time: string;
}

const states: WatchState[] = [
  { phase: "face", bg: 142, trend: "\u2192", color: "#22C55E", iob: "0.45", time: "2:30" },
  { phase: "rising", bg: 195, trend: "\u2197", color: "#F59E0B", iob: "1.2", time: "2:35" },
  { phase: "alert", bg: 245, trend: "\u2191", color: "#EF4444", iob: "1.2", time: "2:40" },
  { phase: "chat", bg: 210, trend: "\u2198", color: "#F59E0B", iob: "2.8", time: "2:48" },
  { phase: "corrected", bg: 128, trend: "\u2192", color: "#22C55E", iob: "0.3", time: "3:15" },
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

// --- Watch Face Screen ---

function WatchFaceScreen({ state }: { state: WatchState }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 py-3">
      {/* BG Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold tabular-nums" style={{ color: state.color }}>
          {state.bg}
        </span>
        <span className="text-lg" style={{ color: state.color }}>
          {state.trend}
        </span>
      </div>
      <span className="text-[9px] text-zinc-500 mt-0.5">mg/dL</span>

      {/* IoB */}
      <span className="text-[10px] text-zinc-400 mt-1.5">
        IoB: {state.iob} u
      </span>

      {/* Mini graph strip */}
      <div className="w-full mt-2 h-3 rounded-full overflow-hidden relative">
        <div className="absolute inset-0 bg-zinc-800" />
        <div
          className="absolute inset-y-0 left-[15%] right-[15%] rounded-full"
          style={{ backgroundColor: state.color, opacity: 0.2 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: state.color, right: "12%" }}
        />
      </div>

      {/* Time */}
      <span className="text-lg font-bold text-zinc-300 mt-2 tabular-nums">
        {state.time}
      </span>

      {/* Branding */}
      <span className="text-[7px] text-zinc-600 mt-0.5">GlycemicGPT</span>
    </div>
  );
}

// --- Alert Screen ---

function AlertScreen({ state }: { state: WatchState }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-5 py-4">
      <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
        High Glucose
      </span>
      <span className="text-2xl font-bold text-red-400 mt-1 tabular-nums">
        {state.bg}
      </span>
      <span className="text-[9px] text-zinc-500">mg/dL</span>
      <span className="text-[9px] text-zinc-400 mt-2 text-center leading-snug">
        Consider correction bolus
      </span>
      <div className="mt-2.5 flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1">
        <X className="h-2.5 w-2.5 text-zinc-400" />
        <span className="text-[9px] text-zinc-400">Dismiss</span>
      </div>
    </div>
  );
}

// --- Chat Screen ---

function ChatScreen() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-5 py-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 mb-2">
        <Mic className="h-4 w-4 text-white" />
      </div>
      <span className="text-[10px] text-zinc-300 font-semibold">
        &ldquo;How am I doing?&rdquo;
      </span>
      <div className="mt-2 rounded-lg bg-zinc-800 px-2.5 py-1.5 max-w-[85%]">
        <span className="text-[8px] text-zinc-300 leading-snug block">
          Trending high after lunch. Correction delivered. Should be back in range within 90 min.
        </span>
      </div>
      <span className="text-[7px] text-zinc-600 mt-2">Tap to ask</span>
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
