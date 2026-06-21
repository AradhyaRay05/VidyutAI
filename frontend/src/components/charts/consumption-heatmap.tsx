"use client";

import { hourlyPattern } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ConsumptionHeatmap() {
  const maxVal = Math.max(...hourlyPattern.map((d) => d.kwh));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Low</span>
        <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-primary/20 via-primary/50 to-primary" />
        <span>High</span>
      </div>
      <div className="grid grid-cols-12 gap-1">
        {hourlyPattern.map((item, i) => {
          const intensity = item.kwh / maxVal;
          return (
            <div key={i} className="group relative">
              <div
                className={cn(
                  "aspect-square rounded-md transition-all duration-200 cursor-pointer hover:scale-110 hover:shadow-lg",
                  "flex items-center justify-center"
                )}
                style={{
                  backgroundColor: `rgba(123, 57, 252, ${0.1 + intensity * 0.9})`,
                }}
              >
                <span className="text-[9px] font-medium text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.kwh.toFixed(1)}
                </span>
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="bg-card border border-border rounded px-2 py-1 text-[10px] whitespace-nowrap shadow-lg">
                  {item.hour}: {item.kwh} kWh
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground pt-2">
        <span>12 AM</span>
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>11 PM</span>
      </div>
    </div>
  );
}
