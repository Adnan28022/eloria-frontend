"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#FAF7F2] text-charcoal relative overflow-hidden">
      {/* Subtle Ambient Background Gradient Lighting for All Admin Pages */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.12, 0.92, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 right-1/4 w-[420px] h-[420px] bg-[#F5DFD5]/40 rounded-full blur-[110px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 50, -30, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -left-20 w-[480px] h-[480px] bg-[#F9EBDD]/45 rounded-full blur-[130px]"
        />
        <motion.div
          animate={{
            x: [0, 35, -45, 0],
            y: [0, -35, 45, 0],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 right-10 w-[400px] h-[400px] bg-[#EDE1D4]/45 rounded-full blur-[110px]"
        />
      </div>

      <AdminSidebar isMobileOpen={isMobileOpen} setMobileOpen={setIsMobileOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <AdminTopbar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
