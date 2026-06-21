"use client";

import { FadeUp } from "@/components/ui/motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { challenges } from "@/lib/mock-data";
import {
  Target,
  Clock,
  Award,
  CheckCircle2,
  Flame,
} from "lucide-react";

const statusColors = {
  active: "default" as const,
  completed: "success" as const,
};

export default function ChallengesPage() {
  const completedCount = challenges.filter((c) => c.status === "completed").length;
  const activeCount = challenges.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-6">
      <FadeUp>
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>
            Energy Challenges
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete challenges to earn badges and reduce your energy footprint
          </p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FadeUp>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>{activeCount}</p>
                <p className="text-xs text-muted-foreground">Active Challenges</p>
              </div>
            </CardContent>
          </Card>
        </FadeUp>
        <FadeUp delay={0.05}>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>{completedCount}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </FadeUp>
        <FadeUp delay={0.1}>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>{completedCount}</p>
                <p className="text-xs text-muted-foreground">Badges Earned</p>
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {challenges.map((challenge, index) => (
          <FadeUp key={challenge.id} delay={index * 0.05}>
            <Card className={`hover:border-primary/30 transition-all duration-300 ${
              challenge.status === "completed" ? "border-success/30 bg-success/5" : ""
            }`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      challenge.status === "completed"
                        ? "bg-success/10 text-success"
                        : "bg-primary/10 text-primary"
                    }`}>
                      {challenge.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Flame className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-nav)" }}>
                        {challenge.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                  <Badge variant={statusColors[challenge.status as keyof typeof statusColors]} className="text-[10px]">
                    {challenge.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Award className="h-3 w-3" />
                    <span>{challenge.reward}</span>
                  </div>
                  {challenge.daysLeft > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{challenge.daysLeft} days left</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}
