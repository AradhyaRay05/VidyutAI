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

interface PredictionRecord {
  date: string;
  predicted_kwh?: number;
  predicted?: number;
  confidence_score?: number;
}

interface TooltipPayloadItem {
  value: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-nav)" }}>{label}</p>
      <p className="text-xs text-muted-foreground">
        Predicted: <span className="font-medium text-foreground">{payload[0]?.value?.toFixed(1)} kWh</span>
      </p>
    </div>
  );
};

interface PredictionChartProps {
  predictions?: PredictionRecord[];
}

export function PredictionChart({ predictions = [] }: PredictionChartProps) {
  if (predictions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
        No prediction data available
      </div>
    );
  }

  const data = predictions.map((p) => ({
    date: typeof p.date === "string" ? p.date.slice(5) : p.date,
    predicted: p.predicted_kwh || p.predicted || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7B39FC" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#7B39FC" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="predicted" stroke="#7B39FC" fill="url(#predGradient)" strokeWidth={2} dot={{ r: 4, fill: "#7B39FC", stroke: "#fff", strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
