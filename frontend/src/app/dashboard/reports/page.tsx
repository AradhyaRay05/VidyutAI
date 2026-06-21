"use client";

import { FadeUp } from "@/components/ui/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MonthlyTrendChart } from "@/components/charts/monthly-trend-chart";
import { EfficiencyGauge } from "@/components/charts/efficiency-gauge";
import { aiRecommendations } from "@/lib/mock-data";
import {
  Download,
  Calendar,
  TrendingDown,
  Zap,
  IndianRupee,
  Leaf,
  Lightbulb,
} from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>
              Smart Reports
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              AI-generated energy intelligence reports
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF Report
          </Button>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { icon: Zap, label: "Total Usage", value: "324 kWh", sub: "This month" },
          { icon: IndianRupee, label: "Total Cost", value: "₹4,850", sub: "This month" },
          { icon: TrendingDown, label: "Savings", value: "₹1,200", sub: "Potential" },
          { icon: Leaf, label: "Carbon", value: "12.4 kg", sub: "CO₂ saved" },
        ].map((stat, i) => (
          <FadeUp key={stat.label} delay={i * 0.05}>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold" style={{ fontFamily: "var(--font-headline)" }}>{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          </FadeUp>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FadeUp className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-nav)" }}>
                <Calendar className="h-5 w-5 text-primary" />
                Monthly Consumption Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyTrendChart />
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.1}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base" style={{ fontFamily: "var(--font-nav)" }}>
                Efficiency Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <EfficiencyGauge score={83} />
            </CardContent>
          </Card>
        </FadeUp>
      </div>

      <FadeUp>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-nav)" }}>
              <Lightbulb className="h-5 w-5 text-primary" />
              AI Recommendations Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiRecommendations.map((rec, index) => (
                <div
                  key={rec.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{rec.title}</p>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    Save ₹{rec.savings}/mo
                  </Badge>
                  <Badge variant={rec.priority === "high" ? "danger" : rec.priority === "medium" ? "warning" : "default"} className="text-[10px]">
                    {rec.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeUp>
    </div>
  );
}
