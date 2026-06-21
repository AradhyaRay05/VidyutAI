"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Zap, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/insights", label: "Insights" },
  { href: "/dashboard/simulator", label: "Simulator" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Zap className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 h-7 w-7 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-nav)" }}>
              Vidyut<span className="text-primary">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent-soft"
                  )}
                  style={{ fontFamily: "var(--font-nav)" }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-light hover:shadow-md glow-primary-sm"
              style={{ fontFamily: "var(--font-btn)" }}
            >
              Sign In
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border text-foreground cursor-pointer"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="px-2 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-accent-soft text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-primary"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
