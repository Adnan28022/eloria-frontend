"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
  X
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

  React.useEffect(() => {
    setMounted(true);
    import('@/lib/api').then(({ adminApi }) => {
      adminApi.getDashboardStats().then(res => setActiveOrders(res.data.data.activeOrders)).catch(() => {});
    });
  }, []);

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
    expanded: { width: "270px" },
    collapsed: { width: "84px" }
  };

  const Content = (
    <div className="relative flex flex-col h-full bg-[#12100E] text-[#EDE5DA] border-r border-[#241E1A] shadow-none overflow-hidden">
      
      {/* Smooth GPU-Accelerated Animated Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35],
            x: [0, 8, 0],
            y: [0, -8, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-14 -left-12 w-56 h-56 bg-terracotta/30 rounded-full blur-3xl transform-gpu" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.18, 0.32, 0.18],
            x: [0, -12, 0],
            y: [0, 12, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 -right-16 w-52 h-52 bg-amber-500/20 rounded-full blur-3xl transform-gpu" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.25, 0.45, 0.25]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-16 left-4 w-48 h-48 bg-[#9E472A]/25 rounded-full blur-3xl transform-gpu" 
        />
      </div>

      {/* Header / Big Logo */}
      <div className="h-24 flex items-center justify-between px-4 border-b border-white/[0.08] relative z-10 shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center justify-center py-2 px-3.5 rounded-2xl bg-white/95 border border-white/25 shadow-xs flex-1 max-w-[210px] transition-transform duration-200 hover:scale-[1.02]">
            <img 
              src="/logo-bg.png" 
              alt="Eloria" 
              className="h-11 md:h-12 w-auto object-contain max-w-[180px]" 
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-white/95 border border-white/25 flex items-center justify-center shadow-xs overflow-hidden p-1.5 transition-transform duration-200 hover:scale-105 mx-auto">
            <img src="/logo-bg.png" alt="Eloria" className="w-full h-full object-contain" />
          </div>
        )}

        {/* Mobile Close Button */}
        {isMobileOpen && (
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded-xl text-[#A09388] hover:text-white hover:bg-white/10 transition-colors ml-2"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Items - Inner Scroll Only If Items Overflow */}
      <div className="flex-1 py-4 px-3 flex flex-col gap-1.5 overflow-y-auto hide-scrollbar relative z-10">
        <div className="text-[10px] uppercase tracking-widest text-[#8C8075] mb-2 px-3 font-bold flex items-center gap-1.5">
          {!isCollapsed && (
            <>
              <Sparkles className="w-3 h-3 text-terracotta animate-pulse" />
              <span>Studio Navigation</span>
            </>
          )}
        </div>

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
                  layoutId="activeSidebar"
                  className="absolute inset-0 bg-gradient-to-r from-terracotta via-[#D97757] to-[#B85738] rounded-2xl shadow-[0_4px_20px_rgba(217,119,87,0.4)] border border-white/20"
                  initial={false}
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 relative z-10 ${
                isActive 
                  ? "text-white font-semibold" 
                  : "text-[#B8AEA5] hover:text-white hover:bg-white/[0.08]"
              } ${isCollapsed ? "justify-center" : "justify-start"}`}>
                <item.icon className={`w-4 h-4 shrink-0 transition-all duration-200 group-hover:scale-110 ${isActive ? "text-white drop-shadow-sm" : "text-[#8C8075] group-hover:text-terracotta"}`} />
                
                {!isCollapsed && (
                  <span className="text-xs tracking-wide flex-grow truncate">{item.label}</span>
                )}

                {/* Active Indicator Glowing Dot */}
                {isActive && !isCollapsed && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)] shrink-0 animate-pulse" />
                )}
                
                {!isCollapsed && mounted && item.badge && !isActive && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-terracotta/20 text-[#FFA98F] border border-terracotta/30 shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}

        <div className="mt-4 text-[10px] uppercase tracking-widest text-[#8C8075] mb-1 px-3 font-bold">
          {!isCollapsed && "System"}
        </div>
        
        <Link 
          href="/admin/dashboard/settings"
          onClick={() => setMobileOpen(false)}
          className="relative group block"
        >
          {pathname === "/admin/dashboard/settings" && (
            <motion.div 
              layoutId="activeSidebar"
              className="absolute inset-0 bg-gradient-to-r from-terracotta via-[#D97757] to-[#B85738] rounded-2xl shadow-[0_4px_20px_rgba(217,119,87,0.4)] border border-white/20"
              initial={false}
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 relative z-10 ${
            pathname === "/admin/dashboard/settings"
              ? "text-white font-semibold" 
              : "text-[#B8AEA5] hover:text-white hover:bg-white/[0.08]"
          } ${isCollapsed ? "justify-center" : "justify-start"}`}>
            <Settings className={`w-4 h-4 shrink-0 transition-all duration-200 group-hover:scale-110 ${pathname === "/admin/dashboard/settings" ? "text-white drop-shadow-sm" : "text-[#8C8075] group-hover:text-terracotta"}`} />
            {!isCollapsed && <span className="text-xs tracking-wide flex-grow">Settings</span>}
            {pathname === "/admin/dashboard/settings" && !isCollapsed && (
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)] shrink-0 animate-pulse" />
            )}
          </div>
        </Link>
      </div>

      {/* User Profile & Collapse Toggle - Fixed Bottom */}
      <div className="p-3 border-t border-white/[0.08] shrink-0 relative z-10 bg-black/20 backdrop-blur-md">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 mb-2 rounded-2xl bg-white/[0.05] border border-white/[0.08] shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-terracotta to-[#9E472A] text-white flex items-center justify-center font-serif font-bold text-xs shadow-[0_2px_10px_rgba(217,119,87,0.35)] shrink-0">
              E
            </div>
            <div className="flex flex-col overflow-hidden min-w-0">
              <span className="text-xs font-semibold text-white/90 truncate">Eloria Admin</span>
              <span className="text-[10px] text-[#8C8075] truncate">store@eloria.com</span>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all text-[#A09388] hover:text-white border border-white/[0.05] hover:border-white/15 shadow-xs ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!isCollapsed && <span className="text-[10px] uppercase tracking-widest font-bold">Collapse</span>}
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Pinned Forever, Height 100vh */}
      <motion.aside
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block h-screen sticky top-0 shrink-0 z-40"
      >
        {Content}
      </motion.aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[90] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isMobileOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 w-[270px] z-[100] md:hidden h-screen"
      >
        {Content}
      </motion.aside>
    </>
  );
};
