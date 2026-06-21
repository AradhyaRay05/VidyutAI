"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { applianceBreakdown } from "@/lib/mock-data";

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
        Consumption: <span className="font-medium text-foreground">{data.kwh} kWh</span>
      </p>
      <p className="text-xs text-muted-foreground">
        Cost: <span className="font-medium text-foreground">₹{data.cost}</span>
      </p>
      <p className="text-xs text-muted-foreground">
        Share: <span className="font-medium text-foreground">{data.percent}%</span>
      </p>
    </div>
  );
};

export function ApplianceDonut() {
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={applianceBreakdown}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="percent"
            strokeWidth={0}
          >
            {applianceBreakdown.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full max-w-sm">
        {applianceBreakdown.map((item) => (
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
