"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { MessageSquare, Send, AlertTriangle } from "lucide-react";

interface DemoMessage {
  role: "user" | "assistant";
  content: string;
}

const conversation: DemoMessage[] = [
  {
    role: "user",
    content: "How was my glucose control this week?",
  },
  {
    role: "assistant",
    content:
      "Based on your data from the past 7 days, your time in range (70-180 mg/dL) was **72%**, which is above the recommended 70% target. Your average glucose was **148 mg/dL** with a GMI of **6.8%**.\n\nYou had 3 significant highs above 250, all post-dinner -- consider reviewing your dinner carb ratios with your care team.",
  },
  {
    role: "user",
    content: "Why do I keep spiking after dinner?",
  },
  {
    role: "assistant",
    content:
      "Looking at your dinner patterns over the past week, your post-dinner spikes average **215 mg/dL**, peaking about 90 minutes after eating.\n\nYour breakfast and lunch ratios are keeping you in range -- it's specifically the evening meals showing this pattern. The spike magnitude suggests the **carb ratio may need adjustment** for dinner.",
  },
  {
    role: "user",
    content: "What should I tell my endo at my appointment?",
  },
  {
    role: "assistant",
    content:
      "Here's a summary for your endocrinologist:\n\n- **Time in range:** 72% (7-day)\n- **Average glucose:** 148 mg/dL\n- **GMI:** 6.8%\n- **Key pattern:** Post-dinner highs suggesting carb ratio adjustment needed\n- **Basal rates:** Well-tuned overnight, dawn phenomenon managed\n- **Corrections:** Effective, returning to target within 2 hours",
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-2 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

function ChatBubble({
  message,
  prefersReducedMotion,
}: {
  message: DemoMessage;
  prefersReducedMotion: boolean | null;
}) {
  const isUser = message.role === "user";

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-muted text-foreground"
        }`}
      >
        {message.content.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-1" : ""}>
            {line.split("**").map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j}>{part}</strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </p>
        ))}
        {!isUser && (
          <p className="mt-1.5 pt-1 border-t border-border/50 text-[10px] text-muted-foreground flex items-center gap-0.5">
            <AlertTriangle className="h-2.5 w-2.5" />
            Not medical advice
          </p>
        )}
      </div>
    </motion.div>
  );
}

function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[300px] sm:w-[340px]">
      {/* Phone frame */}
      <div className="rounded-[2.5rem] border-2 border-border bg-background p-2 shadow-xl">
        {/* Notch */}
        <div className="mx-auto mb-1 h-5 w-24 rounded-full bg-border/50" />
        {/* Screen */}
        <div className="overflow-hidden rounded-[2rem] border border-border bg-background">
          {children}
        </div>
        {/* Home indicator */}
        <div className="mx-auto mt-1 h-1 w-16 rounded-full bg-border/50" />
      </div>
    </div>
  );
}

export function AIChatDemoSection() {
  const prefersReducedMotion = useReducedMotion();
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleMessages(conversation.length);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    let messageIndex = 0;

    function showNext() {
      if (messageIndex >= conversation.length) {
        // Pause then reset
        timeoutId = setTimeout(() => {
          setVisibleMessages(0);
          setShowTyping(false);
          messageIndex = 0;
          timeoutId = setTimeout(showNext, 1000);
        }, 4000);
        return;
      }

      const msg = conversation[messageIndex];

      if (msg.role === "assistant") {
        // Show typing indicator first
        setShowTyping(true);
        timeoutId = setTimeout(() => {
          setShowTyping(false);
          setVisibleMessages(messageIndex + 1);
          messageIndex++;
          timeoutId = setTimeout(showNext, 2000);
        }, 1500);
      } else {
        // User messages appear quickly
        setVisibleMessages(messageIndex + 1);
        messageIndex++;
        timeoutId = setTimeout(showNext, 800);
      }
    }

    // Start after initial delay
    timeoutId = setTimeout(showNext, 1500);

    return () => clearTimeout(timeoutId);
  }, [prefersReducedMotion]);

  return (
    <AnimatedSection className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-12 text-center">
        <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Your Personal Diabetes Assistant
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Ask questions about your glucose patterns, get daily briefs, and
          prepare for appointments -- powered by AI that understands your data.
        </p>
      </div>

      <PhoneMockup>
        {/* Chat header */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600">
            <MessageSquare className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <div className="text-xs font-semibold">AI Chat</div>
            <div className="text-[10px] text-muted-foreground">
              Ask about your glucose data
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex h-[360px] flex-col gap-2 overflow-hidden px-3 py-2">
          <AnimatePresence mode="popLayout">
            {conversation
              .slice(0, visibleMessages)
              .map((msg, i) => (
                <ChatBubble
                  key={`msg-${i}`}
                  message={msg}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
          </AnimatePresence>

          {showTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="rounded-2xl bg-muted px-3 py-2">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t border-border px-3 py-2">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-1.5">
            <span className="flex-1 text-[10px] text-muted-foreground">
              Ask about your glucose data...
            </span>
            <Send className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <p className="mt-1 text-center text-[8px] text-muted-foreground">
            Not medical advice. Consult your healthcare provider.
          </p>
        </div>
      </PhoneMockup>
    </AnimatedSection>
  );
}
