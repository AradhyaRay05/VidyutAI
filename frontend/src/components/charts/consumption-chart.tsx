"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
          {entry.name}: <span className="font-medium text-foreground">{entry.value} kWh</span>
        </p>
      ))}
    </div>
  );
};

interface DailyRecord {
  date: string;
  total_kwh?: number;
  kwh?: number;
  total_cost?: number;
  cost?: number;
}

interface PredictionRecord {
  date: string;
  predicted_kwh?: number;
  predicted?: number;
  confidence_score?: number;
}

interface ConsumptionChartProps {
  dailyData?: DailyRecord[];
  predictions?: PredictionRecord[];
}

export function ConsumptionChart({ dailyData = [], predictions = [] }: ConsumptionChartProps) {
  const actualData = dailyData.slice(-21).map((d) => ({
    date: typeof d.date === "string" ? d.date.slice(5) : d.date,
    kwh: d.total_kwh || d.kwh || 0,
  }));

  const predData = predictions.map((p) => ({
    date: typeof p.date === "string" ? p.date.slice(5) : p.date,
    predicted: p.predicted_kwh || p.predicted || 0,
  }));

  const combined: Array<{ date: string; kwh?: number; predicted?: number }> = [...actualData.map(d => ({ ...d }))];
  for (const p of predData) {
    const existing = combined.find((d) => d.date === p.date);
    if (existing) {
      existing.predicted = p.predicted;
    } else {
      combined.push({ date: p.date, kwh: undefined, predicted: p.predicted });
    }
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={combined} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7B39FC" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7B39FC" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area type="monotone" dataKey="kwh" stroke="#7B39FC" fill="url(#colorKwh)" strokeWidth={2} name="Actual" dot={false} activeDot={{ r: 5, fill: "#7B39FC", stroke: "#fff", strokeWidth: 2 }} />
        {predData.length > 0 && (
          <Area type="monotone" dataKey="predicted" stroke="#22C55E" fill="url(#colorPredicted)" strokeWidth={2} strokeDasharray="5 5" name="Predicted" dot={false} activeDot={{ r: 5, fill: "#22C55E", stroke: "#fff", strokeWidth: 2 }} />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
