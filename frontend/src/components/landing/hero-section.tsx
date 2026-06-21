"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { FadeUp } from "@/components/ui/motion";
import {
  Zap,
  TrendingDown,
  ArrowRight,
  Play,
  Sun,
  Moon,
  Snowflake,
  Flame,
  Building2,
  Home,
} from "lucide-react";
import Link from "next/link";

const modes = [
  { id: "day", label: "Day", icon: Sun },
  { id: "night", label: "Night", icon: Moon },
  { id: "summer", label: "Summer", icon: Flame },
  { id: "winter", label: "Winter", icon: Snowflake },
  { id: "office", label: "Office", icon: Building2 },
  { id: "home", label: "Home", icon: Home },
];

const modeData: Record<string, { bill: number; savings: number; confidence: number }> = {
  day: { bill: 4650, savings: 1320, confidence: 96 },
  night: { bill: 3200, savings: 980, confidence: 94 },
  summer: { bill: 6800, savings: 2100, confidence: 92 },
  winter: { bill: 2400, savings: 650, confidence: 95 },
  office: { bill: 12500, savings: 3800, confidence: 91 },
  home: { bill: 4650, savings: 1320, confidence: 96 },
};

export function HeroSection() {
  const [activeMode, setActiveMode] = useState("day");
  const data = modeData[activeMode];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark dark:bg-grid-dark bg-grid opacity-50" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center space-y-8">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-4 w-4" />
              <span style={{ fontFamily: "var(--font-nav)" }}>AI-Powered Energy Intelligence</span>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              Know Tomorrow&apos;s
              <br />
              <span className="text-gradient">Energy Usage</span> Today
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground">
              AI predicts your electricity consumption, detects anomalies, and optimizes
              your energy costs before they happen.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="flex flex-wrap justify-center gap-2 py-4">
              {modes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer",
                      activeMode === mode.id
                        ? "bg-primary text-white shadow-lg glow-primary"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                    )}
                    style={{ fontFamily: "var(--font-btn)" }}
                  >
                    <Icon className="h-4 w-4" />
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="mx-auto max-w-lg">
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-xl">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: "var(--font-nav)" }}>Predicted Bill</p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-headline)" }}>
                      ₹<AnimatedNumber value={data.bill} />
                    </p>
                  </div>
                  <div className="text-center border-x border-border">
                    <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: "var(--font-nav)" }}>Potential Savings</p>
                    <p className="text-2xl sm:text-3xl font-bold text-success" style={{ fontFamily: "var(--font-headline)" }}>
                      ₹<AnimatedNumber value={data.savings} />
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: "var(--font-nav)" }}>Confidence</p>
                    <p className="text-2xl sm:text-3xl font-bold text-primary" style={{ fontFamily: "var(--font-headline)" }}>
                      <AnimatedNumber value={data.confidence} />%
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <TrendingDown className="h-3 w-3 text-success" />
                  <span>AI-optimized predictions based on your usage patterns</span>
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.5}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary-light hover:shadow-xl glow-primary"
                style={{ fontFamily: "var(--font-btn)" }}
              >
                Start Energy Analysis
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-4 text-base font-semibold text-foreground transition-all duration-300 hover:bg-muted hover:border-primary/30 cursor-pointer"
                style={{ fontFamily: "var(--font-btn)" }}
              >
                <Play className="h-5 w-5 text-primary" />
                Watch Demo
              </button>
            </div>
          </FadeUp>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </motion.div>
      </div>
    </section>
  );
}
