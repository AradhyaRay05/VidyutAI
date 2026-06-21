"use client";

import { FadeUp } from "@/components/ui/motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <FadeUp>
          <div className="rounded-3xl border border-primary/20 bg-card/50 backdrop-blur-sm p-12 sm:p-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Zap className="h-8 w-8 text-primary" />
            </div>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              Start saving energy
              <br />
              <span className="text-gradient">today</span>
            </h2>

            <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-8">
              Join thousands of smart homeowners who are reducing their electricity
              bills with AI-powered insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary-light hover:shadow-xl glow-primary"
                style={{ fontFamily: "var(--font-btn)" }}
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="text-sm text-muted-foreground">No credit card required</p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
