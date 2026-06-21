import Link from "next/link";
import { Zap, Mail, Globe, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold" style={{ fontFamily: "var(--font-nav)" }}>
                Vidyut<span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-Powered Energy Intelligence for Smarter Electricity Decisions.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-nav)" }}>Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link href="/dashboard/insights" className="hover:text-foreground transition-colors">Insights</Link></li>
              <li><Link href="/dashboard/simulator" className="hover:text-foreground transition-colors">Simulator</Link></li>
              <li><Link href="/dashboard/reports" className="hover:text-foreground transition-colors">Reports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-nav)" }}>Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span>AI Predictions</span></li>
              <li><span>Anomaly Detection</span></li>
              <li><span>Cost Optimization</span></li>
              <li><span>Smart Reports</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-nav)" }}>Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                <ExternalLink className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 VidyutAI. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
