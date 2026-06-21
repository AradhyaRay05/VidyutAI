"use client";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";

const stats = [
  { value: 30, suffix: "%", label: "Average Savings", description: "Reduced electricity bills" },
  { value: 24, suffix: "/7", label: "Smart Monitoring", description: "Continuous tracking" },
  { value: 96, suffix: "%", label: "Prediction Accuracy", description: "ML-powered forecasts" },
  { value: 100, suffix: "%", label: "Data Privacy", description: "Your data stays yours" },
];

export function StatsSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark opacity-30" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Trusted by <span className="text-gradient">smart homeowners</span>
          </h2>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <StaggerItem key={stat.label} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-headline)" }}>
                <AnimatedNumber value={stat.value} />
                <span className="text-primary">{stat.suffix}</span>
              </div>
              <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-nav)" }}>
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
