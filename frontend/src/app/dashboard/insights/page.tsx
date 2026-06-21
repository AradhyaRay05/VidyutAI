"use client";

import { motion } from "framer-motion";
import { FadeUp } from "@/components/ui/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { energyInsights, aiRecommendations } from "@/lib/mock-data";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Zap,
  DollarSign,
  Leaf,
  BarChart3,
} from "lucide-react";

const impactColors = {
  high: "danger" as const,
  medium: "warning" as const,
  low: "default" as const,
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  consumption: TrendingUp,
  cost: DollarSign,
  efficiency: Zap,
  behavior: BarChart3,
};

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <FadeUp>
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>
            Energy Insights
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered analysis of your energy consumption patterns
          </p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FadeUp className="lg:col-span-2">
          <div className="space-y-4">
            {energyInsights.map((insight, index) => {
              const Icon = categoryIcons[insight.category] || Lightbulb;
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:border-primary/30 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          insight.impact === "high" ? "bg-danger/10 text-danger" :
                          insight.impact === "medium" ? "bg-warning/10 text-warning" :
                          "bg-primary/10 text-primary"
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-base font-semibold" style={{ fontFamily: "var(--font-nav)" }}>
                              {insight.title}
                            </h3>
                            <Badge variant={impactColors[insight.impact]} className="text-[10px] shrink-0">
                              {insight.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                            {insight.summary}
                          </p>
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-success/5 border border-success/20">
                            <Lightbulb className="h-4 w-4 text-success shrink-0 mt-0.5" />
                            <p className="text-sm text-success">
                              {insight.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base" style={{ fontFamily: "var(--font-nav)" }}>
                  Weekly Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Consumption</span>
                  <span className="text-sm font-semibold">224.8 kWh</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Cost</span>
                  <span className="text-sm font-semibold">₹1,574</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">vs Last Week</span>
                  <span className="text-sm font-semibold text-danger">+14%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Peak Day</span>
                  <span className="text-sm font-semibold">Wednesday</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Efficiency Score</span>
                  <span className="text-sm font-semibold text-primary">83/100</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base" style={{ fontFamily: "var(--font-nav)" }}>
                  Top Savings Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiRecommendations.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <TrendingDown className="h-4 w-4 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{rec.title}</p>
                      <p className="text-xs text-success">Save ₹{rec.savings}/mo</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4 text-center">
                <Leaf className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-nav)" }}>
                  Carbon Saved This Month
                </p>
                <p className="text-2xl font-bold text-success" style={{ fontFamily: "var(--font-headline)" }}>
                  12.4 kg CO₂
                </p>
                <p className="text-xs text-muted-foreground mt-1">Equivalent to planting 2 trees</p>
              </CardContent>
            </Card>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
