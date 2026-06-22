"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/ui/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Zap,
  DollarSign,
  BarChart3,
  Upload,
} from "lucide-react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Insight {
  type: string;
  priority: string;
  icon: string;
  title: string;
  text: string;
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
  savings: number;
  priority: string;
}

const impactColors: Record<string, string> = {
  high: "bg-danger/10 text-danger border-danger/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-primary/10 text-primary border-primary/20",
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  consumption: TrendingUp,
  cost: DollarSign,
  efficiency: Zap,
  behavior: BarChart3,
  default: Lightbulb,
};

export default function InsightsPage() {
  const { token } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [efficiency, setEfficiency] = useState<{ score: number; label: string }>({ score: 0, label: "Loading..." });
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: "Bearer " + token };
      const [insRes, recRes, effRes, sumRes] = await Promise.all([
        fetch(API_BASE + "/api/dashboard/insights", { headers }),
        fetch(API_BASE + "/api/ai/recommendations", { headers }),
        fetch(API_BASE + "/api/ai/efficiency-score", { headers }),
        fetch(API_BASE + "/api/dashboard/summary?days=7", { headers }),
      ]);
      if (insRes.ok) { const d = await insRes.json(); setInsights(d.insights || []); }
      if (recRes.ok) { const d = await recRes.json(); setRecommendations(d.recommendations || []); }
      if (effRes.ok) { const d = await effRes.json(); setEfficiency(d); }
      if (sumRes.ok) { const d = await sumRes.json(); setSummary(d.stats || {}); }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Analyzing your energy data...</p>
        </div>
      </div>
    );
  }

  if (insights.length === 0 && recommendations.length === 0) {
    return (
      <div className="space-y-6">
        <FadeUp>
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>Energy Insights</h1>
            <p className="text-sm text-muted-foreground mt-1">Upload data to get AI-powered analysis</p>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <Card className="border-primary/30">
            <CardContent className="p-12 text-center">
              <Upload className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-headline)" }}>No Data to Analyze</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">Upload your electricity usage data to get personalized AI insights and recommendations.</p>
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
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>Energy Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-powered analysis based on your actual consumption data</p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FadeUp className="lg:col-span-2">
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = categoryIcons[insight.type] || categoryIcons.default;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className="hover:border-primary/30 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${impactColors[insight.priority] || impactColors.medium}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-base font-semibold" style={{ fontFamily: "var(--font-nav)" }}>{insight.title}</h3>
                            <Badge className={`text-[10px] ${impactColors[insight.priority] || impactColors.medium}`}>{insight.priority} impact</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{insight.text}</p>
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
                <CardTitle className="text-base" style={{ fontFamily: "var(--font-nav)" }}>Weekly Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Consumption</span>
                  <span className="text-sm font-semibold">{(summary.current_usage || 0).toFixed(1)} kWh</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Cost</span>
                  <span className="text-sm font-semibold">₹{(summary.estimated_bill || 0).toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Efficiency Score</span>
                  <span className="text-sm font-semibold text-primary">{efficiency.score}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <span className="text-sm font-semibold">{efficiency.label}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base" style={{ fontFamily: "var(--font-nav)" }}>Top Savings Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <TrendingDown className="h-4 w-4 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{rec.title}</p>
                      {rec.savings > 0 && <p className="text-xs text-success">Save ₹{rec.savings}/mo</p>}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
