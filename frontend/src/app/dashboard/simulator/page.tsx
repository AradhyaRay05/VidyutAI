"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/ui/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/ui/animated-number";
import {
  Calculator,
  Thermometer,
  Wind,
  Sun,
  Clock,
  TrendingDown,
  IndianRupee,
  Lightbulb,
} from "lucide-react";

export default function SimulatorPage() {
  const [acHours, setAcHours] = useState([8]);
  const [fanHours, setFanHours] = useState([12]);
  const [solarPanels, setSolarPanels] = useState([0]);
  const [workingHours, setWorkingHours] = useState([10]);

  const simulation = useMemo(() => {
    const baseCost = 4850;
    const acCost = acHours[0] * 45;
    const fanCost = fanHours[0] * 3;
    const solarSaving = solarPanels[0] * 180;
    const workingImpact = workingHours[0] > 8 ? (workingHours[0] - 8) * 25 : 0;

    const estimatedBill = Math.max(1500, baseCost + acCost + fanCost + workingImpact - solarSaving);
    const savings = baseCost - estimatedBill;

    return {
      bill: Math.round(estimatedBill),
      savings: Math.round(Math.max(0, savings)),
      acContribution: Math.round((acCost / estimatedBill) * 100),
      fanContribution: Math.round((fanCost / estimatedBill) * 100),
      solarSaving: Math.round(solarSaving),
    };
  }, [acHours, fanHours, solarPanels, workingHours]);

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
                <Slider
                  value={acHours}
                  onValueChange={setAcHours}
                  max={24}
                  min={0}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 hrs</span>
                  <span>24 hrs</span>
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
                <Slider
                  value={fanHours}
                  onValueChange={setFanHours}
                  max={24}
                  min={0}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 hrs</span>
                  <span>24 hrs</span>
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
                <Slider
                  value={solarPanels}
                  onValueChange={setSolarPanels}
                  max={20}
                  min={0}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>None</span>
                  <span>20 panels</span>
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
                <Slider
                  value={workingHours}
                  onValueChange={setWorkingHours}
                  max={18}
                  min={4}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>4 hrs</span>
                  <span>18 hrs</span>
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
                    <span className="text-muted-foreground">AC Contribution</span>
                    <span className="font-medium">{simulation.acContribution}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fan Contribution</span>
                    <span className="font-medium">{simulation.fanContribution}%</span>
                  </div>
                  {solarPanels[0] > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Solar Saving</span>
                      <span className="font-medium text-success">₹{simulation.solarSaving}</span>
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
