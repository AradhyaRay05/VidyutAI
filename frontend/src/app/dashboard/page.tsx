"use client";

import { OverviewCards } from "@/components/dashboard/overview-cards";
import { RecommendationsPanel, AnomalyPanel } from "@/components/dashboard/recommendations-panel";
import { ConsumptionChart } from "@/components/charts/consumption-chart";
import { ApplianceDonut } from "@/components/charts/appliance-donut";
import { ConsumptionHeatmap } from "@/components/charts/consumption-heatmap";
import { PredictionChart } from "@/components/charts/prediction-chart";
import { EfficiencyGauge } from "@/components/charts/efficiency-gauge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeUp } from "@/components/ui/motion";
import {
  BarChart3,
  Activity,
  Clock,
  TrendingUp,
  Zap,
  Brain,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>
              Energy Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time energy intelligence for your home
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success" className="gap-1.5">
              <Activity className="h-3 w-3" />
              Live Monitoring
            </Badge>
            <Badge variant="default" className="gap-1.5">
              <Clock className="h-3 w-3" />
              Last updated: 2 min ago
            </Badge>
          </div>
        </div>
      </FadeUp>

      <OverviewCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FadeUp className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-nav)" }}>
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Electricity Consumption
                </CardTitle>
                <Tabs defaultValue="daily">
                  <TabsList className="h-8">
                    <TabsTrigger value="daily" className="text-xs px-2 h-6">Daily</TabsTrigger>
                    <TabsTrigger value="weekly" className="text-xs px-2 h-6">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly" className="text-xs px-2 h-6">Monthly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <ConsumptionChart showPrediction={true} />
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.1}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-nav)" }}>
                <Brain className="h-5 w-5 text-primary" />
                AI Trend Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PredictionChart />
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-success" />
                <span>Predicted 8.6% increase next week based on weather patterns</span>
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FadeUp>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-nav)" }}>
                <Zap className="h-5 w-5 text-primary" />
                Appliance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ApplianceDonut />
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-nav)" }}>
                <Clock className="h-5 w-5 text-primary" />
                Usage Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ConsumptionHeatmap />
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.2}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-nav)" }}>
                <Activity className="h-5 w-5 text-primary" />
                Efficiency Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <EfficiencyGauge score={83} />
            </CardContent>
          </Card>
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeUp>
          <RecommendationsPanel />
        </FadeUp>
        <FadeUp delay={0.1}>
          <AnomalyPanel />
        </FadeUp>
      </div>
    </div>
  );
}
