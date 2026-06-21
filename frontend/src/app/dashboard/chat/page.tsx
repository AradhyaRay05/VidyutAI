"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/ui/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  TrendingDown,
  Clock,
} from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const quickActions = [
  { icon: Zap, label: "Why was my bill high?" },
  { icon: TrendingDown, label: "How to save ₹1000?" },
  { icon: Clock, label: "Best time to use AC?" },
];

const aiResponses: Record<string, string> = {
  "why was my bill high": "Your bill increased by 14% this month (₹4,850 vs ₹4,250 last month). The main contributors are:\n\n1. **Air Conditioner**: Usage increased by 22% due to higher temperatures (avg 38°C vs 34°C last month)\n2. **Peak Hour Consumption**: 68% of usage occurred during peak tariff hours (12-8 PM)\n3. **Weekend Usage**: Saturday and Sunday consumption was 35% higher than weekdays\n\nI recommend shifting AC usage to after 8 PM and setting the thermostat to 24°C to save approximately ₹650 next month.",
  "how to save": "Based on your consumption patterns, here's a plan to save ₹1,000/month:\n\n1. **Shift AC to off-peak hours** (8 PM - 6 AM): Save ₹450\n2. **Set AC to 25°C instead of 22°C**: Save ₹280\n3. **Use washing machine with full loads only**: Save ₹150\n4. **Unplug devices on standby**: Save ₹120\n\n**Total Potential Savings: ₹1,000/month**\n\nWould you like me to create a detailed schedule for implementing these changes?",
  "best time": "The best time to use high-power appliances like AC and washing machine is during **off-peak hours**:\n\n- **Off-peak**: 10 PM - 6 AM (lowest tariff rates)\n- **Shoulder**: 6 AM - 12 PM, 8 PM - 10 PM (moderate rates)\n- **Peak**: 12 PM - 8 PM (highest rates - avoid heavy usage)\n\nBy shifting just 3 hours of AC usage from peak to off-peak, you can save approximately **₹350/month**.",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(aiResponses)) {
    if (lower.includes(key)) return response;
  }
  return `Based on your energy data analysis:\n\nYour current consumption pattern shows an average of **324 kWh/month** with an estimated bill of **₹4,850**.\n\nHere are my observations:\n- Peak usage occurs between 1 PM - 5 PM (AC usage)\n- Weekend consumption is 35% higher than weekdays\n- Your energy efficiency score is **83/100** (Good)\n\nI recommend checking the **Insights** page for detailed AI-powered recommendations, or try the **Cost Simulator** to model different scenarios.`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your VidyutAI energy assistant. I can help you understand your consumption patterns, suggest ways to save energy, and answer questions about your electricity usage. What would you like to know?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const msgIdRef = useRef(2);

  const getNextId = useCallback(() => {
    msgIdRef.current += 1;
    return msgIdRef.current;
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: getNextId(),
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const delay = 1500;
    setTimeout(() => {
      const aiMsg: Message = {
        id: getNextId(),
        role: "assistant",
        content: getAIResponse(text),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  }, [getNextId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      <FadeUp>
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>
            AI Assistant
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ask anything about your energy consumption
          </p>
        </div>
      </FadeUp>

      <Card className="flex-1 flex flex-col h-[calc(100%-5rem)]">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-base" style={{ fontFamily: "var(--font-nav)" }}>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            VidyutAI Assistant
            <Badge variant="success" className="text-[10px] ml-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5 inline-block" />
              Online
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-white"
                    : "bg-muted border border-border"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                <p className={`text-[10px] mt-2 ${msg.role === "user" ? "text-white/60" : "text-muted-foreground"}`}>
                  {msg.timestamp}
                </p>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted border border-border rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>

        <div className="border-t border-border p-4">
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => sendMessage(action.label)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors whitespace-nowrap cursor-pointer"
              >
                <action.icon className="h-3 w-3" />
                {action.label}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your energy usage..."
              className="flex-1 h-10 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button type="submit" size="icon" className="shrink-0" disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
