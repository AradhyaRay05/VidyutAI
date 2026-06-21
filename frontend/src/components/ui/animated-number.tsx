"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export function AnimatedNumber({
  value,
  duration = 2000,
  prefix = "",
  suffix = "",
  className,
  decimals = 0,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = null;
    const startValue = displayValue;

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startValue + (value - startValue) * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}
