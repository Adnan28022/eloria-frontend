"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#fcfbf9] text-charcoal">
      <AdminSidebar isMobileOpen={isMobileOpen} setMobileOpen={setIsMobileOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
