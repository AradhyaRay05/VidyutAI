"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { predictionForecast } from "@/lib/mock-data";

interface TooltipPayloadItem {
  value: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-nav)" }}>{label}</p>
      <p className="text-xs text-muted-foreground">
        Predicted: <span className="font-medium text-foreground">{payload[0]?.value} kWh</span>
      </p>
      <p className="text-xs text-muted-foreground">
        Range: <span className="font-medium text-foreground">{payload[1]?.value} - {payload[2]?.value} kWh</span>
      </p>
    </div>
  );
};

export function PredictionChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={predictionForecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7B39FC" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#7B39FC" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="predicted" stroke="#7B39FC" fill="url(#predGradient)" strokeWidth={2} dot={{ r: 4, fill: "#7B39FC", stroke: "#fff", strokeWidth: 2 }} />
        <Area type="monotone" dataKey="lower" stroke="#F59E0B" fill="none" strokeWidth={1} strokeDasharray="3 3" dot={false} />
        <Area type="monotone" dataKey="upper" stroke="#F59E0B" fill="url(#rangeGradient)" strokeWidth={1} strokeDasharray="3 3" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
