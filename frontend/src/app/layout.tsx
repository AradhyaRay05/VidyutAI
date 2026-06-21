import type { Metadata } from "next";
import { Manrope, Instrument_Serif, Inter, Cabin } from "next/font/google";
import { Providers } from "@/components/providers/providers";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VidyutAI - AI Energy Intelligence Platform",
  description: "AI-Powered Energy Intelligence for Smarter Electricity Decisions. Understand. Predict. Optimize. Save.",
  keywords: ["energy", "electricity", "AI", "prediction", "optimization", "smart meter", "savings"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${instrumentSerif.variable} ${inter.variable} ${cabin.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-nav: var(--font-manrope), sans-serif;
            --font-headline: var(--font-instrument-serif), serif;
            --font-body: var(--font-inter), sans-serif;
            --font-btn: var(--font-cabin), sans-serif;
          }
        `}} />
      </head>
      <body className="min-h-full flex flex-col font-body antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
