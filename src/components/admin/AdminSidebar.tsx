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
  Gift
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
    { label: "Settings", href: "/admin/dashboard/settings", icon: Settings },
  ];

  const sidebarVariants = {
    expanded: { width: "270px" },
    collapsed: { width: "84px" }
  };

  const Content = (
    <div className="relative flex flex-col h-full bg-[#EDE5DA] text-[#2C2420] border-r border-[#DECFC0] shadow-[4px_0_24px_rgba(40,30,20,0.06)] overflow-hidden">
      
      {/* GPU-Accelerated Static Ambient Warm Glow (Zero Lag) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-terracotta/25 rounded-full blur-2xl transform-gpu" />
        <div className="absolute top-1/2 -right-16 w-52 h-52 bg-amber-200/30 rounded-full blur-2xl transform-gpu" />
        <div className="absolute -bottom-16 left-2 w-48 h-48 bg-[#DFCFC0]/60 rounded-full blur-2xl transform-gpu" />
      </div>

      {/* Header / Bigger Logo */}
      <div className="h-20 flex items-center justify-center px-4 border-b border-[#DECFC0]/80 relative z-10 shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center justify-center py-2 px-3 rounded-2xl bg-white/75 border border-[#DFD1C2] shadow-xs w-full max-w-[220px]">
            <img 
              src="/logo-bg.png" 
              alt="Eloria" 
              className="h-11 md:h-12 w-auto object-contain max-w-[190px] drop-shadow-xs" 
            />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-2xl bg-white/80 border border-[#DFD1C2] flex items-center justify-center shadow-xs overflow-hidden p-1.5">
            <img src="/logo-bg.png" alt="Eloria" className="w-full h-full object-contain" />
          </div>
        )}
      </div>

      {/* Nav Items - Strictly Fits In Viewport, Never Scrolls */}
      <div className="flex-1 py-3 px-2.5 flex flex-col justify-between overflow-hidden relative z-10">
        <div className="flex flex-col gap-1">
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
                    className="absolute inset-0 bg-gradient-to-r from-terracotta to-[#C97B63] rounded-xl shadow-[0_3px_14px_rgba(194,142,121,0.38)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                
                <div className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-150 relative z-10 ${
                  isActive 
                    ? "text-white font-semibold" 
                    : "text-charcoal/70 hover:text-charcoal hover:bg-white/60"
                } ${isCollapsed ? "justify-center" : "justify-start"}`}>
                  <item.icon className={`w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110 ${isActive ? "text-white" : "text-charcoal/50 group-hover:text-terracotta"}`} />
                  
                  {!isCollapsed && (
                    <span className="text-[13px] tracking-wide flex-grow truncate">{item.label}</span>
                  )}

                  {/* Active Indicator Dot */}
                  {isActive && !isCollapsed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] shrink-0" />
                  )}
                  
                  {!isCollapsed && mounted && item.badge && !isActive && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-terracotta/15 text-terracotta shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Profile & Collapse Toggle */}
      <div className="p-2.5 border-t border-[#DECFC0]/80 shrink-0 relative z-10 bg-white/40 backdrop-blur-sm">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 px-2.5 py-2 mb-1.5 rounded-xl bg-white/70 border border-[#DECFC0] shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-terracotta to-[#C97B63] text-white flex items-center justify-center font-serif font-bold text-xs shadow-xs shrink-0">
              E
            </div>
            <div className="flex flex-col overflow-hidden min-w-0">
              <span className="text-xs font-semibold text-charcoal truncate">Eloria Admin</span>
              <span className="text-[10px] text-charcoal/50 truncate">store@eloria.com</span>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center p-2 rounded-xl hover:bg-white/80 transition-all text-charcoal/60 hover:text-charcoal border border-transparent hover:border-[#DECFC0] shadow-xs ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!isCollapsed && <span className="text-[10px] uppercase tracking-widest font-bold">Collapse</span>}
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Fixed Height, Never Scrolls */}
      <motion.aside
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block h-screen sticky top-0 shrink-0 z-40 overflow-hidden"
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
        className="fixed inset-y-0 left-0 w-[270px] z-[100] md:hidden h-full overflow-hidden"
      >
        {Content}
      </motion.aside>
    </>
  );
};
