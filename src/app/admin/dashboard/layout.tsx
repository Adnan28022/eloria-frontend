"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#FAF8F5] text-charcoal relative overflow-hidden">
      {/* Zero-Lag GPU-Accelerated Static Ambient Gradients for Smooth 60fps Experience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-60">
        <div className="absolute -top-32 right-1/4 w-[480px] h-[480px] bg-gradient-to-br from-[#F5DFD5] to-transparent rounded-full blur-[80px] transform-gpu" />
        <div className="absolute top-1/3 -left-24 w-[500px] h-[500px] bg-gradient-to-tr from-[#F8EADA] to-transparent rounded-full blur-[90px] transform-gpu" />
        <div className="absolute -bottom-24 right-16 w-[420px] h-[420px] bg-gradient-to-tl from-[#EDE1D4] to-transparent rounded-full blur-[80px] transform-gpu" />
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
