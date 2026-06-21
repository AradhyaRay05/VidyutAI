"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  TrendingUp,
  IndianRupee,
  PiggyBank,
  Leaf,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const overviewCards = [
  {
    label: "Current Usage",
    value: 324,
    suffix: " kWh",
    change: "+5.2%",
    changeType: "up" as const,
    icon: Zap,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Predicted Usage",
    value: 352,
    suffix: " kWh",
    change: "+8.6%",
    changeType: "up" as const,
    icon: TrendingUp,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    label: "Estimated Bill",
    value: 4850,
    prefix: "₹",
    suffix: "",
    change: "+12%",
    changeType: "up" as const,
    icon: IndianRupee,
    color: "text-danger",
    bg: "bg-danger/10",
  },
  {
    label: "Potential Savings",
    value: 1200,
    prefix: "₹",
    suffix: "",
    change: "+18%",
    changeType: "down" as const,
    icon: PiggyBank,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "Carbon Reduction",
    value: 14,
    suffix: "%",
    change: "-14%",
    changeType: "down" as const,
    icon: Leaf,
    color: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
  },
];

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {overviewCards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
        >
          <Card className="group hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <Badge
                  variant={card.changeType === "down" && card.label.includes("Carbon") ? "success" : card.changeType === "up" && !card.label.includes("Savings") ? "danger" : "success"}
                  className="text-[10px]"
                >
                  {card.changeType === "up" ? (
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-0.5" />
                  )}
                  {card.change}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: "var(--font-nav)" }}>
                {card.label}
              </p>
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                {card.prefix && <span>{card.prefix}</span>}
                <AnimatedNumber value={card.value} />
                {card.suffix && <span className="text-base font-normal text-muted-foreground">{card.suffix}</span>}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
