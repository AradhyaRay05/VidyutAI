"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { aiRecommendations, anomalies } from "@/lib/mock-data";
import {
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import { motion } from "framer-motion";

export function RecommendationsPanel() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-nav)" }}>
            <Lightbulb className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
          <Badge variant="default">{aiRecommendations.length} active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {aiRecommendations.slice(0, 3).map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-all duration-200 cursor-pointer"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              rec.priority === "high" ? "bg-danger/10 text-danger" :
              rec.priority === "medium" ? "bg-warning/10 text-warning" :
              "bg-primary/10 text-primary"
            }`}>
              <Lightbulb className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-0.5" style={{ fontFamily: "var(--font-nav)" }}>{rec.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{rec.description}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <TrendingDown className="h-3 w-3 text-success" />
                <span className="text-xs font-medium text-success">Save ₹{rec.savings}/month</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AnomalyPanel() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-nav)" }}>
            <AlertTriangle className="h-5 w-5 text-warning" />
            Anomaly Detection
          </CardTitle>
          <Badge variant="warning">{anomalies.length} detected</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {anomalies.map((anomaly, index) => (
          <motion.div
            key={anomaly.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg border ${
              anomaly.severity === "high"
                ? "border-danger/30 bg-danger/5"
                : "border-warning/30 bg-warning/5"
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 ${
                  anomaly.severity === "high" ? "text-danger" : "text-warning"
                }`} />
                <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-nav)" }}>
                  {anomaly.severity === "high" ? "Potential Leak Detected" : "Unusual Consumption"}
                </span>
              </div>
              <Badge variant={anomaly.severity === "high" ? "danger" : "warning"} className="text-[10px]">
                {anomaly.deviation.toFixed(0)}% deviation
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{anomaly.description}</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-muted-foreground">
                Date: <span className="font-medium text-foreground">{anomaly.date}</span>
              </span>
              <span className="text-muted-foreground">
                Actual: <span className="font-medium text-danger">{anomaly.value} kWh</span>
              </span>
              <span className="text-muted-foreground">
                Expected: <span className="font-medium text-success">{anomaly.expected} kWh</span>
              </span>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
