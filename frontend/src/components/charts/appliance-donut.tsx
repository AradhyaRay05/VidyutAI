"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#7B39FC", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#EC4899", "#8B5CF6", "#6B7280"];

interface ApplianceRecord {
  appliance_name: string;
  total_kwh: number;
  total_cost: number;
}

interface TooltipPayloadItem {
  payload: { name: string; kwh: number; cost: number; percent: number };
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) => {
  if (!active || !payload?.[0]) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-nav)" }}>{data.name}</p>
      <p className="text-xs text-muted-foreground">
        Consumption: <span className="font-medium text-foreground">{data.kwh.toFixed(1)} kWh</span>
      </p>
      <p className="text-xs text-muted-foreground">
        Cost: <span className="font-medium text-foreground">₹{data.cost.toFixed(0)}</span>
      </p>
      <p className="text-xs text-muted-foreground">
        Share: <span className="font-medium text-foreground">{data.percent}%</span>
      </p>
    </div>
  );
};

interface ApplianceDonutProps {
  applianceData?: ApplianceRecord[];
}

export function ApplianceDonut({ applianceData = [] }: ApplianceDonutProps) {
  if (applianceData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
        No appliance data available
      </div>
    );
  }

  const totalKwh = applianceData.reduce((sum, a) => sum + (a.total_kwh || 0), 0);
  const chartData = applianceData.slice(0, 8).map((a, i) => ({
    name: a.appliance_name,
    kwh: a.total_kwh || 0,
    cost: a.total_cost || 0,
    percent: totalKwh > 0 ? Math.round(((a.total_kwh || 0) / totalKwh) * 100) : 0,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="percent"
            strokeWidth={0}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full max-w-sm">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground truncate">{item.name}</span>
            <span className="text-xs font-medium ml-auto">{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
