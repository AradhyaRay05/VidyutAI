"use client";

import { useState, useEffect, useCallback } from "react";
import { FadeUp } from "@/components/ui/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConsumptionChart } from "@/components/charts/consumption-chart";
import { MonthlyTrendChart } from "@/components/charts/monthly-trend-chart";
import { EfficiencyGauge } from "@/components/charts/efficiency-gauge";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Download,
  Calendar,
  TrendingDown,
  Zap,
  IndianRupee,
  Leaf,
  Lightbulb,
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

interface PredictionRecord {
  date: string;
  predicted_kwh?: number;
  predicted?: number;
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
  savings: number;
  priority: string;
}

export default function ReportsPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [dailyData, setDailyData] = useState<DailyRecord[]>([]);
  const [monthlyData, setMonthlyData] = useState<Array<Record<string, unknown>>>([]);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [efficiency, setEfficiency] = useState<{ score: number; label: string }>({ score: 0, label: "..." });
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: "Bearer " + token };
      const [sumRes, dailyRes, monthlyRes, predRes, recRes, effRes] = await Promise.all([
        fetch(API_BASE + "/api/dashboard/summary?days=30", { headers }),
        fetch(API_BASE + "/api/data/daily?days=30", { headers }),
        fetch(API_BASE + "/api/data/monthly?months=12", { headers }),
        fetch(API_BASE + "/api/predict/daily?days=7", { headers }),
        fetch(API_BASE + "/api/ai/recommendations", { headers }),
        fetch(API_BASE + "/api/ai/efficiency-score", { headers }),
      ]);
      if (sumRes.ok) { const d = await sumRes.json(); setStats(d.stats || {}); }
      if (dailyRes.ok) { const d = await dailyRes.json(); setDailyData((d.data || []) as DailyRecord[]); }
      if (monthlyRes.ok) { const d = await monthlyRes.json(); setMonthlyData(d.data || []); }
      if (predRes.ok) { const d = await predRes.json(); setPredictions((d.predictions || []) as PredictionRecord[]); }
      if (recRes.ok) { const d = await recRes.json(); setRecommendations(d.recommendations || []); }
      if (effRes.ok) { const d = await effRes.json(); setEfficiency(d); }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const downloadPDF = async () => {
    if (!token) return;
    setPdfLoading(true);
    try {
      const res = await fetch(API_BASE + "/api/reports/pdf", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error("Failed to generate report");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "VidyutAI_Report_" + new Date().toISOString().slice(0, 10) + ".pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Generating your smart report...</p>
        </div>
      </div>
    );
  }

  const hasData = dailyData.length > 0;

  if (!hasData) {
    return (
      <div className="space-y-6">
        <FadeUp>
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>Smart Reports</h1>
            <p className="text-sm text-muted-foreground mt-1">Upload data to generate AI-powered reports</p>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <Card className="border-primary/30">
            <CardContent className="p-12 text-center">
              <Upload className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-headline)" }}>No Report Data</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">Upload your electricity usage data to generate smart reports with predictions, efficiency analysis, and recommendations.</p>
              <Link href="/dashboard/upload" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light transition-all" style={{ fontFamily: "var(--font-btn)" }}>
                <Upload className="h-4 w-4" /> Upload Your Data
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
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>Smart Reports</h1>
            <p className="text-sm text-muted-foreground mt-1">AI-generated report based on your {dailyData.length} days of data</p>
          </div>
          <Button size="lg" className="gap-2" onClick={downloadPDF} disabled={pdfLoading}>
            {pdfLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Download className="h-4 w-4" />}
            {pdfLoading ? "Generating..." : "Export PDF Report"}
          </Button>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { icon: Zap, label: "Total Usage", value: `${(stats.current_usage || 0).toFixed(0)} kWh`, sub: "This month" },
          { icon: IndianRupee, label: "Total Cost", value: `₹${(stats.estimated_bill || 0).toFixed(0)}`, sub: "This month" },
          { icon: TrendingDown, label: "Savings", value: `₹${(stats.potential_savings || 0).toFixed(0)}`, sub: "Potential" },
          { icon: Leaf, label: "Carbon", value: `${(stats.carbon_kg || 0).toFixed(1)} kg`, sub: "CO₂ produced" },
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
                Consumption Trend + Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ConsumptionChart dailyData={dailyData} predictions={predictions} />
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.1}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base" style={{ fontFamily: "var(--font-nav)" }}>Efficiency Rating</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <EfficiencyGauge score={efficiency.score} />
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
              {recommendations.map((rec, index) => (
                <div key={rec.id} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{index + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{rec.title}</p>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                  {rec.savings > 0 && <Badge variant="success" className="text-[10px]">Save ₹{rec.savings}/mo</Badge>}
                  <Badge variant={rec.priority === "high" ? "danger" : rec.priority === "medium" ? "warning" : "default"} className="text-[10px]">{rec.priority}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeUp>
    </div>
  );
}
