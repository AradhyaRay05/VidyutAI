"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/ui/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Calculator,
  Thermometer,
  Wind,
  Sun,
  Clock,
  TrendingDown,
  IndianRupee,
  Lightbulb,
  Database,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface DailyRecord {
  date: string;
  total_kwh: number;
  total_cost: number;
}

interface ApplianceRecord {
  appliance_name: string;
  total_kwh: number;
  total_cost: number;
}

export default function SimulatorPage() {
  const { token } = useAuth();
  const [acHours, setAcHours] = useState([8]);
  const [fanHours, setFanHours] = useState([12]);
  const [solarPanels, setSolarPanels] = useState([0]);
  const [workingHours, setWorkingHours] = useState([10]);
  const [dailyData, setDailyData] = useState<DailyRecord[]>([]);
  const [applianceData, setApplianceData] = useState<ApplianceRecord[]>([]);
  const [hasData, setHasData] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [dailyRes, applianceRes] = await Promise.all([
        fetch(API_BASE + "/api/data/daily?days=30", { headers: { Authorization: "Bearer " + token } }),
        fetch(API_BASE + "/api/data/appliances", { headers: { Authorization: "Bearer " + token } }),
      ]);
      if (dailyRes.ok) {
        const d = await dailyRes.json();
        if (d.data && d.data.length > 0) {
          setDailyData(d.data);
          setHasData(true);
        }
      }
      if (applianceRes.ok) {
        const a = await applianceRes.json();
        if (a.data && a.data.length > 0) {
          setApplianceData(a.data);
        }
      }
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const simulation = useMemo(() => {
    const baseCost = dailyData.length > 0
      ? dailyData.reduce((sum, d) => sum + (d.total_cost || 0), 0)
      : 4850;

    const acCost = acHours[0] * 45;
    const fanCost = fanHours[0] * 3;
    const solarSaving = solarPanels[0] * 180;
    const workingImpact = workingHours[0] > 8 ? (workingHours[0] - 8) * 25 : 0;

    const estimatedBill = Math.max(1500, baseCost + acCost + fanCost + workingImpact - solarSaving);
    const savings = baseCost - estimatedBill;

    return {
      baseCost: Math.round(baseCost),
      bill: Math.round(estimatedBill),
      savings: Math.round(Math.max(0, savings)),
      acContribution: estimatedBill > 0 ? Math.round((acCost / estimatedBill) * 100) : 0,
      fanContribution: estimatedBill > 0 ? Math.round((fanCost / estimatedBill) * 100) : 0,
      solarSaving: Math.round(solarSaving),
    };
  }, [acHours, fanHours, solarPanels, workingHours, dailyData]);

  return (
    <div className="space-y-6">
      <FadeUp>
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>
            Cost Simulator
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Adjust parameters to simulate different energy scenarios
          </p>
        </div>
      </FadeUp>

      {hasData && (
        <FadeUp>
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base" style={{ fontFamily: "var(--font-nav)" }}>
                <Database className="h-5 w-5 text-primary" />
                Your Uploaded Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Records</p>
                  <p className="text-lg font-bold" style={{ fontFamily: "var(--font-headline)" }}>{dailyData.length} days</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Usage</p>
                  <p className="text-lg font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                    {dailyData.reduce((s, d) => s + (d.total_kwh || 0), 0).toFixed(1)} kWh
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Cost</p>
                  <p className="text-lg font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                    ₹{simulation.baseCost}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Appliances</p>
                  <p className="text-lg font-bold" style={{ fontFamily: "var(--font-headline)" }}>{applianceData.length}</p>
                </div>
              </div>

              {applianceData.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-2" style={{ fontFamily: "var(--font-nav)" }}>
                    Appliance Breakdown
                  </p>
                  {applianceData.slice(0, 6).map((a) => {
                    const pct = applianceData.reduce((s, d) => s + (d.total_kwh || 0), 0);
                    const width = pct > 0 ? ((a.total_kwh || 0) / pct) * 100 : 0;
                    return (
                      <div key={a.appliance_name} className="flex items-center gap-3">
                        <span className="text-xs w-28 truncate">{a.appliance_name}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: width + "%" }} />
                        </div>
                        <span className="text-xs font-medium w-16 text-right">
                          {(a.total_kwh || 0).toFixed(1)} kWh
                        </span>
                        <span className="text-xs text-muted-foreground w-14 text-right">
                          ₹{(a.total_cost || 0).toFixed(0)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeUp>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FadeUp className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-nav)" }}>
                <Calculator className="h-5 w-5 text-primary" />
                What-If Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium" style={{ fontFamily: "var(--font-nav)" }}>
                      Daily AC Usage
                    </span>
                  </div>
                  <Badge variant="default">{acHours[0]} hours/day</Badge>
                </div>
                <Slider value={acHours} onValueChange={setAcHours} max={24} min={0} step={1} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 hrs</span><span>24 hrs</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium" style={{ fontFamily: "var(--font-nav)" }}>
                      Daily Fan Usage
                    </span>
                  </div>
                  <Badge variant="default">{fanHours[0]} hours/day</Badge>
                </div>
                <Slider value={fanHours} onValueChange={setFanHours} max={24} min={0} step={1} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 hrs</span><span>24 hrs</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium" style={{ fontFamily: "var(--font-nav)" }}>
                      Solar Panels
                    </span>
                  </div>
                  <Badge variant="default">{solarPanels[0]} panels</Badge>
                </div>
                <Slider value={solarPanels} onValueChange={setSolarPanels} max={20} min={0} step={1} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>None</span><span>20 panels</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium" style={{ fontFamily: "var(--font-nav)" }}>
                      Working Hours (Appliances Active)
                    </span>
                  </div>
                  <Badge variant="default">{workingHours[0]} hours/day</Badge>
                </div>
                <Slider value={workingHours} onValueChange={setWorkingHours} max={18} min={4} step={1} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>4 hrs</span><span>18 hrs</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="space-y-4">
            <Card className="border-primary/30">
              <CardContent className="p-6 text-center">
                <IndianRupee className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "var(--font-nav)" }}>
                  Expected Monthly Bill
                </p>
                <motion.p
                  key={simulation.bill}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-bold"
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  ₹<AnimatedNumber value={simulation.bill} />
                </motion.p>
                {hasData && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on your uploaded data (₹{simulation.baseCost} base)
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-success/30">
              <CardContent className="p-6 text-center">
                <TrendingDown className="h-8 w-8 text-success mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "var(--font-nav)" }}>
                  Expected Savings
                </p>
                <motion.p
                  key={simulation.savings}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-bold text-success"
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  ₹<AnimatedNumber value={simulation.savings} />
                </motion.p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-3">
                <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-nav)" }}>
                  Breakdown
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Base Cost (from data)</span>
                    <span className="font-medium">₹{simulation.baseCost}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">AC Impact</span>
                    <span className="font-medium">{simulation.acContribution}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fan Impact</span>
                    <span className="font-medium">{simulation.fanContribution}%</span>
                  </div>
                  {solarPanels[0] > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Solar Saving</span>
                      <span className="font-medium text-success">-₹{simulation.solarSaving}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    {acHours[0] > 10
                      ? "Reducing AC usage by 2 hours could save ₹270/month"
                      : solarPanels[0] === 0
                      ? "Installing 5 solar panels could save ₹900/month"
                      : "Great choices! You're on track for significant savings."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
