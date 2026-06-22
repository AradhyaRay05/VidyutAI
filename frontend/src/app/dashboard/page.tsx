"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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
import { useAuth } from "@/components/providers/auth-provider";
import {
  BarChart3,
  Activity,
  Clock,
  TrendingUp,
  Zap,
  Brain,
  Upload,
} from "lucide-react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface DailyRecord {
  date: string;
  total_kwh?: number;
  kwh?: number;
  total_cost?: number;
  cost?: number;
}

interface ApplianceRecord {
  appliance_name: string;
  total_kwh: number;
  total_cost: number;
}

interface PredictionRecord {
  date: string;
  predicted_kwh?: number;
  predicted?: number;
  confidence_score?: number;
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
  savings: number;
  priority: string;
  category: string;
}

interface Anomaly {
  date: string;
  type: string;
  value: number;
  expected: number;
  deviation: number;
  description: string;
  severity: string;
}

interface DashboardData {
  stats: Record<string, number | string | null>;
  dailyData: DailyRecord[];
  applianceData: ApplianceRecord[];
  predictions: PredictionRecord[];
  anomalies: Anomaly[];
  recommendations: Recommendation[];
  efficiency: Record<string, unknown>;
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: "Bearer " + token };
      const [summaryRes, dailyRes, applianceRes, predRes, anomalyRes, recRes, effRes] = await Promise.all([
        fetch(API_BASE + "/api/dashboard/summary?days=30", { headers }),
        fetch(API_BASE + "/api/data/daily?days=30", { headers }),
        fetch(API_BASE + "/api/data/appliances", { headers }),
        fetch(API_BASE + "/api/predict/daily?days=7", { headers }),
        fetch(API_BASE + "/api/ai/anomalies", { headers }),
        fetch(API_BASE + "/api/ai/recommendations", { headers }),
        fetch(API_BASE + "/api/ai/efficiency-score", { headers }),
      ]);

      const summary = summaryRes.ok ? await summaryRes.json() : { stats: {} };
      const daily = dailyRes.ok ? await dailyRes.json() : { data: [] };
      const appliance = applianceRes.ok ? await applianceRes.json() : { data: [] };
      const pred = predRes.ok ? await predRes.json() : { predictions: [] };
      const anomaly = anomalyRes.ok ? await anomalyRes.json() : { anomalies: [] };
      const rec = recRes.ok ? await recRes.json() : { recommendations: [] };
      const eff = effRes.ok ? await effRes.json() : { score: 50, label: "No Data" };

      setData({
        stats: summary.stats,
        dailyData: (daily.data || []) as DailyRecord[],
        applianceData: (appliance.data || []) as ApplianceRecord[],
        predictions: (pred.predictions || []) as PredictionRecord[],
        anomalies: (anomaly.anomalies || []) as Anomaly[],
        recommendations: (rec.recommendations || []) as Recommendation[],
        efficiency: eff,
      });
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const hasData = data && data.dailyData && data.dailyData.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading your energy data...</p>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="space-y-6">
        <FadeUp>
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>
              Energy Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your data to see AI-powered insights
            </p>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <Card className="border-primary/30">
            <CardContent className="p-12 text-center">
              <Upload className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-headline)" }}>
                No Energy Data Yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Upload your electricity usage data via CSV or add records manually to unlock AI-powered analytics, predictions, and recommendations.
              </p>
              <Link
                href="/dashboard/upload"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light transition-all"
                style={{ fontFamily: "var(--font-btn)" }}
              >
                <Upload className="h-4 w-4" />
                Upload Your Data
              </Link>
            </CardContent>
          </Card>
        </FadeUp>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>
              Energy Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time energy intelligence based on your data
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success" className="gap-1.5">
              <Activity className="h-3 w-3" />
              {data.dailyData.length} days of data
            </Badge>
            <Badge variant="default" className="gap-1.5">
              <Clock className="h-3 w-3" />
              Last updated: now
            </Badge>
          </div>
        </div>
      </FadeUp>

      <OverviewCards stats={data.stats} />

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
              <ConsumptionChart dailyData={data.dailyData} predictions={data.predictions} />
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
              <PredictionChart predictions={data.predictions} />
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-success" />
                <span>AI prediction based on your consumption patterns</span>
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
              <ApplianceDonut applianceData={data.applianceData} />
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
              <EfficiencyGauge score={data.efficiency.score as number} />
            </CardContent>
          </Card>
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeUp>
          <RecommendationsPanel recommendations={data.recommendations} />
        </FadeUp>
        <FadeUp delay={0.1}>
          <AnomalyPanel anomalies={data.anomalies} />
        </FadeUp>
      </div>
    </div>
  );
}
