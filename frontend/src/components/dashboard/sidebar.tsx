"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Lightbulb,
  Calculator,
  FileText,
  MessageSquare,
  Trophy,
  Zap,
  Upload,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const sidebarItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/upload", icon: Upload, label: "Upload Data" },
  { href: "/dashboard/insights", icon: Lightbulb, label: "AI Insights" },
  { href: "/dashboard/simulator", icon: Calculator, label: "Cost Simulator" },
  { href: "/dashboard/reports", icon: FileText, label: "Reports" },
  { href: "/dashboard/chat", icon: MessageSquare, label: "AI Assistant" },
  { href: "/dashboard/challenges", icon: Trophy, label: "Challenges" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border bg-card text-foreground shadow-md cursor-pointer"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300",
          "lg:translate-x-0",
          collapsed ? "lg:w-[68px]" : "lg:w-[240px]",
          mobileOpen ? "w-[240px] translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            {(!collapsed || mobileOpen) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-bold tracking-tight"
                style={{ fontFamily: "var(--font-nav)" }}
              >
                Vidyut<span className="text-primary">AI</span>
              </motion.span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavigate}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-primary bg-accent-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1 bottom-1 w-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon className="h-5 w-5 shrink-0" />
                {(!collapsed || mobileOpen) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate"
                    style={{ fontFamily: "var(--font-nav)" }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-4 border-t border-border space-y-1">
          <div className={cn("flex items-center gap-2 px-3 py-2", (collapsed && !mobileOpen) && "justify-center")}>
            <ThemeToggle />
            {(!collapsed || mobileOpen) && <span className="text-xs text-muted-foreground">Theme</span>}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight className="h-5 w-5 shrink-0" /> : <ChevronLeft className="h-5 w-5 shrink-0" />}
            {!collapsed && <span>Collapse</span>}
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {(!collapsed || mobileOpen) && <span>Sign Out</span>}
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
