"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tags, 
  Settings, 
  ChevronLeft,
  BarChart3,
  Boxes,
  TicketPercent,
  Store,
  Zap,
  Gift,
  Sparkles,
  X,
  ExternalLink,
  LogOut
} from "lucide-react";

interface AdminSidebarProps {
  isMobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isMobileOpen, setMobileOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeOrders, setActiveOrders] = useState(0);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
    import('@/lib/api').then(({ adminApi }) => {
      adminApi.getDashboardStats()
        .then(res => setActiveOrders(res.data.data.activeOrders))
        .catch(() => {});
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("eloria_admin_token");
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  const navItems = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Analytics", href: "/admin/dashboard/analytics", icon: BarChart3 },
    { label: "Point of Sale", href: "/admin/dashboard/pos", icon: Store },
    { label: "Products", href: "/admin/dashboard/products", icon: Package },
    { label: "Bundles", href: "/admin/dashboard/bundles", icon: Gift },
    { label: "Inventory", href: "/admin/dashboard/inventory", icon: Boxes },
    { label: "Orders", href: "/admin/dashboard/orders", icon: ShoppingCart, badge: activeOrders > 0 ? activeOrders : undefined },
    { label: "Customers", href: "/admin/dashboard/customers", icon: Users },
    { label: "Discounts", href: "/admin/dashboard/discounts", icon: TicketPercent },
    { label: "Promos", href: "/admin/dashboard/deals", icon: Zap },
    { label: "Categories", href: "/admin/dashboard/categories", icon: Tags },
  ];

  const sidebarVariants = {
    expanded: { width: "264px" },
    collapsed: { width: "78px" }
  };

  const Content = (
    <div className="relative flex flex-col h-full bg-[#12100E] text-[#EDE5DA] border-r border-white/[0.06] select-none overflow-hidden">
      
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#9E472A]/15 rounded-full blur-[60px]" />
        <div className="absolute top-1/3 -right-20 w-40 h-40 bg-amber-600/10 rounded-full blur-[60px]" />
      </div>

      {/* Header / Brand Logo */}
      <div className="h-28 flex items-center justify-center border-b border-white/[0.06] relative z-10 shrink-0 w-full py-4">
        {!isCollapsed ? (
          <div className="flex items-center justify-center w-full px-4">
            <img src="/logo-bg.png" alt="Eloria" className="h-16 w-auto object-contain mx-auto transition-all" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <img src="/logo-bg.png" alt="Eloria" className="h-8 w-auto object-contain mx-auto transition-all" />
          </div>
        )}
        
        {/* Mobile Close Button */}
        {isMobileOpen && (
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-3 px-2.5 flex flex-col gap-1 overflow-y-auto scrollbar-none relative z-10">
        {!isCollapsed && (
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1 px-3 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#D97757]" />
            <span>Studio Menu</span>
          </div>
        )}

        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin/dashboard");
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="relative group block"
            >
              {isActive && (
                <motion.div 
                  layoutId="activeSidebarIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-[#D97757] to-[#B85738] rounded-xl shadow-[0_4px_16px_rgba(217,119,87,0.3)]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative z-10 min-h-[44px] ${
                isActive 
                  ? "text-white font-medium" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
              } ${isCollapsed ? "justify-center" : "justify-start"}`}>
                <item.icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${isActive ? "text-white" : "text-zinc-500 group-hover:text-[#D97757]"}`} />
                
                {!isCollapsed && (
                  <span className="text-xs tracking-wide flex-grow truncate">{item.label}</span>
                )}
                
                {!isCollapsed && mounted && item.badge && !isActive && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#D97757]/20 text-[#FFA98F] border border-[#D97757]/30">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}

        <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-col gap-1">
          {!isCollapsed && (
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1 px-3 font-semibold">
              System
            </div>
          )}
          
          <Link 
            href="/admin/dashboard/settings"
            onClick={() => setMobileOpen(false)}
            className="relative group block"
          >
            {pathname === "/admin/dashboard/settings" && (
              <motion.div 
                layoutId="activeSidebarIndicator"
                className="absolute inset-0 bg-gradient-to-r from-[#D97757] to-[#B85738] rounded-xl shadow-[0_4px_16px_rgba(217,119,87,0.3)]"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative z-10 min-h-[44px] ${
              pathname === "/admin/dashboard/settings"
                ? "text-white font-medium" 
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
            } ${isCollapsed ? "justify-center" : "justify-start"}`}>
              <Settings className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${pathname === "/admin/dashboard/settings" ? "text-white" : "text-zinc-500 group-hover:text-[#D97757]"}`} />
              {!isCollapsed && <span className="text-xs tracking-wide flex-grow">Settings</span>}
            </div>
          </Link>

          {/* Visit Website */}
          <a
            href="https://eloria-frontend.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative z-10 text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] min-h-[44px] group block ${isCollapsed ? "justify-center" : "justify-start"}`}
          >
            <ExternalLink className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105 text-zinc-500 group-hover:text-[#D97757]" />
            {!isCollapsed && <span className="text-xs tracking-wide flex-grow">Visit Website</span>}
          </a>
          
          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative z-10 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 min-h-[44px] group ${isCollapsed ? "justify-center" : "justify-start"}`}
          >
            <LogOut className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105 text-zinc-500 group-hover:text-red-400" />
            {!isCollapsed && <span className="text-xs tracking-wide flex-grow text-left">Logout</span>}
          </button>
        </div>
      </div>

      {/* Collapse Action */}
      <div className="p-3 border-t border-white/[0.06] shrink-0 relative z-10 bg-[#0d0b0a]">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] transition-all text-zinc-400 hover:text-white border border-white/[0.04] min-h-[44px] ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!isCollapsed && <span className="text-[10px] uppercase tracking-wider font-semibold ml-1">Collapse Sidebar</span>}
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <motion.aside
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block h-screen sticky top-0 shrink-0 z-40"
      >
        {Content}
      </motion.aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[90] md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-[264px] z-[100] md:hidden h-screen shadow-2xl"
            >
              {Content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};