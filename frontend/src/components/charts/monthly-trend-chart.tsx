"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { monthlyTrend } from "@/lib/mock-data";

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-nav)" }}>{label}</p>
      {payload.map((entry: TooltipPayloadItem, index: number) => (
        <p key={index} className="text-xs text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: entry.color }} />
          {entry.name}: <span className="font-medium text-foreground">
            {entry.name === "Cost" ? `₹${entry.value}` : `${entry.value} kWh`}
          </span>
        </p>
      ))}
    </div>
  );
};

export function MonthlyTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="kwh" name="Actual" fill="#7B39FC" radius={[4, 4, 0, 0]} />
        <Bar dataKey="predicted" name="Predicted" fill="#22C55E" radius={[4, 4, 0, 0]} opacity={0.7} />
      </BarChart>
    </ResponsiveContainer>
  );
}
