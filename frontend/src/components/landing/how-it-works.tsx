"use client";

import { Upload, Brain, BarChart3, TrendingDown } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Data",
    description: "Connect your smart meter or upload electricity bills and usage data in seconds.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Analyzes Patterns",
    description: "Our ML models analyze your consumption patterns, appliance usage, and seasonal trends.",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Get Smart Insights",
    description: "Receive detailed analytics, predictions, anomaly alerts, and personalized recommendations.",
  },
  {
    icon: TrendingDown,
    step: "04",
    title: "Optimize & Save",
    description: "Implement AI suggestions, track savings, and watch your energy costs drop by up to 30%.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            How <span className="text-gradient">VidyutAI</span> works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From data to savings in four simple steps.
          </p>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StaggerItem key={step.step} className="relative">
              <div className="text-center space-y-4">
                <div className="relative inline-flex">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-nav)" }}>
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%+4px)] w-[calc(100%-40px)] h-px bg-gradient-to-r from-primary/30 to-transparent" />
              )}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
