"use client";

import {
  BarChart3,
  Brain,
  Shield,
  Zap,
  TrendingDown,
  Leaf,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI Predictions",
    description: "Machine learning models predict your future electricity consumption with 95%+ accuracy.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Interactive dashboards with real-time consumption tracking, heatmaps, and trend analysis.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: TrendingDown,
    title: "Cost Optimization",
    description: "AI-powered recommendations to reduce your electricity bill by up to 30%.",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: Zap,
    title: "Anomaly Detection",
    description: "Instant alerts for unusual consumption patterns, potential leaks, and equipment issues.",
    color: "text-danger",
    bg: "bg-danger/10",
  },
  {
    icon: Shield,
    title: "What-If Simulation",
    description: "Simulate scenarios like solar installation, AC reduction, and price changes before committing.",
    color: "text-[#06B6D4]",
    bg: "bg-[#06B6D4]/10",
  },
  {
    icon: Leaf,
    title: "Carbon Tracking",
    description: "Monitor your carbon footprint and track your contribution to a greener planet.",
    color: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Everything you need to
            <br />
            <span className="text-gradient">master your energy</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From prediction to optimization, VidyutAI gives you complete control over your electricity consumption.
          </p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <Card className="group h-full hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ fontFamily: "var(--font-nav)" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
