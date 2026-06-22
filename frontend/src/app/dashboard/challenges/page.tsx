"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/ui/motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Target,
  Clock,
  Award,
  CheckCircle2,
  Flame,
  Upload,
} from "lucide-react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Challenge {
  id: number;
  title: string;
  description: string;
  progress: number;
  reward: string;
  daysLeft: number;
  status: string;
}

export default function ChallengesPage() {
  const { token } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(API_BASE + "/api/ai/challenges", { headers: { Authorization: "Bearer " + token } });
      if (res.ok) {
        const d = await res.json();
        setChallenges(d.challenges || []);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Generating personalized challenges...</p>
        </div>
      </div>
    );
  }

  const hasData = challenges.length > 0 && !challenges[0].title.includes("Upload");
  const completedCount = challenges.filter((c) => c.status === "completed").length;
  const activeCount = challenges.filter((c) => c.status === "active").length;

  if (!hasData) {
    return (
      <div className="space-y-6">
        <FadeUp>
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>Energy Challenges</h1>
            <p className="text-sm text-muted-foreground mt-1">Upload data to unlock personalized challenges</p>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <Card className="border-primary/30">
            <CardContent className="p-12 text-center">
              <Upload className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-headline)" }}>No Challenges Yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">Upload your electricity data to get personalized energy challenges based on your actual usage patterns.</p>
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
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>Energy Challenges</h1>
          <p className="text-sm text-muted-foreground mt-1">Personalized challenges based on your energy data</p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FadeUp>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Target className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>{activeCount}</p><p className="text-xs text-muted-foreground">Active Challenges</p></div>
          </CardContent></Card>
        </FadeUp>
        <FadeUp delay={0.05}>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-success" /></div>
            <div><p className="text-2xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>{completedCount}</p><p className="text-xs text-muted-foreground">Completed</p></div>
          </CardContent></Card>
        </FadeUp>
        <FadeUp delay={0.1}>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center"><Award className="h-5 w-5 text-warning" /></div>
            <div><p className="text-2xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>{completedCount}</p><p className="text-xs text-muted-foreground">Badges Earned</p></div>
          </CardContent></Card>
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {challenges.map((challenge, index) => (
          <FadeUp key={challenge.id} delay={index * 0.05}>
            <Card className={`hover:border-primary/30 transition-all duration-300 ${challenge.status === "completed" ? "border-success/30 bg-success/5" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${challenge.status === "completed" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                      {challenge.status === "completed" ? <CheckCircle2 className="h-5 w-5" /> : <Flame className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-nav)" }}>{challenge.title}</h3>
                      <p className="text-xs text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                  <Badge variant={challenge.status === "completed" ? "success" : "default"} className="text-[10px]">{challenge.status}</Badge>
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
                    <Award className="h-3 w-3" /><span>{challenge.reward}</span>
                  </div>
                  {challenge.daysLeft > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /><span>{challenge.daysLeft} days left</span>
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
