"use client";

import { useTheme } from "next-themes";
import { useState, useCallback } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const ref = useCallback((node: HTMLButtonElement | null) => {
    if (node) setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button ref={ref} className={cn("h-9 w-9 rounded-lg cursor-pointer", className)} />
    );
  }

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-all duration-300 hover:bg-accent-soft hover:text-primary cursor-pointer",
        className
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" && <Moon className="h-4 w-4" />}
      {theme === "light" && <Sun className="h-4 w-4" />}
      {theme === "system" && <Monitor className="h-4 w-4" />}
    </button>
  );
}
