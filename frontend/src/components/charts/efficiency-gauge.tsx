"use client";

import { motion } from "framer-motion";
import { cn, calculateEfficiencyColor, calculateEfficiencyLabel } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface EfficiencyGaugeProps {
  score: number;
  className?: string;
}

export function EfficiencyGauge({ score, className }: EfficiencyGaugeProps) {
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22C55E" : score >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="hsl(var(--muted))"
            strokeWidth="10"
            fill="none"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>
            <AnimatedNumber value={score} />
          </span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <p className={cn("text-sm font-semibold", calculateEfficiencyColor(score))}>
          {calculateEfficiencyLabel(score)}
        </p>
        <p className="text-xs text-muted-foreground">Energy Efficiency Score</p>
      </div>
    </div>
  );
}
