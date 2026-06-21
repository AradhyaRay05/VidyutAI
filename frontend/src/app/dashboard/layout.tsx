"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="lg:ml-[240px] min-h-screen"
      >
        <div className="p-4 pt-16 lg:pt-6 lg:p-6 lg:p-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
