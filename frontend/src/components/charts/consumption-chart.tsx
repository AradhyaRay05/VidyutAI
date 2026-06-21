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
import { dailyConsumption, predictionForecast } from "@/lib/mock-data";

interface ConsumptionChartProps {
  timeRange?: "daily" | "weekly" | "monthly" | "yearly";
  showPrediction?: boolean;
}

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

export function ConsumptionChart({ showPrediction = true }: ConsumptionChartProps) {
  const chartData = dailyConsumption.slice(-14).map((d) => ({
    ...d,
    predicted: showPrediction ? d.predicted : undefined,
  }));

  const forecastData = predictionForecast.map((d) => ({
    date: d.date,
    kwh: undefined,
    predicted: d.predicted,
    lower: d.lower,
    upper: d.upper,
  }));

  const combinedData = [...chartData, ...forecastData];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={combinedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7B39FC" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7B39FC" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorRange" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {showPrediction && (
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="url(#colorRange)"
            name="Confidence Range"
            legendType="none"
          />
        )}
        {showPrediction && (
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="#09090B"
            name="Lower Bound"
            legendType="none"
          />
        )}
        <Area
          type="monotone"
          dataKey="kwh"
          stroke="#7B39FC"
          fill="url(#colorKwh)"
          strokeWidth={2}
          name="Actual"
          dot={false}
          activeDot={{ r: 5, fill: "#7B39FC", stroke: "#fff", strokeWidth: 2 }}
        />
        {showPrediction && (
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#22C55E"
            fill="url(#colorPredicted)"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Predicted"
            dot={false}
            activeDot={{ r: 5, fill: "#22C55E", stroke: "#fff", strokeWidth: 2 }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
