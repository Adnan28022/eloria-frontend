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
  Menu,
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
  ];

  const sidebarVariants = {
    expanded: { width: "280px" },
    collapsed: { width: "88px" }
  };

  const Content = (
    <div className="flex flex-col h-full bg-[#161413] text-[#FBF3EC]/70 border-r border-[#FBF3EC]/5 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      {/* Header */}
      <div className="h-32 flex items-center justify-center px-4 border-b border-[#FBF3EC]/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-terracotta/10 blur-[40px] rounded-full" />
        
        {!isCollapsed && (
          <img src="/logo-bg.png" alt="Eloria" className="h-12 w-auto object-contain relative z-10 drop-shadow-lg brightness-0 invert" />
        )}
        {isCollapsed && (
          <img src="/logo-bg.png" alt="Eloria" className="h-8 w-auto object-contain relative z-10 brightness-0 invert" />
        )}
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto hide-scrollbar">
        <div className="text-[10px] uppercase tracking-widest text-[#FBF3EC]/30 mb-2 px-4 font-semibold">
          {!isCollapsed && "Core Management"}
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
                  className="absolute inset-0 bg-terracotta rounded-xl shadow-[0_0_15px_rgba(194,142,121,0.4)]"
                  initial={false}
                  transition={{ type: "spring" as any as any, stiffness: 350, damping: 30 }}
                />
              )}
              
              <div className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative z-10 ${
                isActive 
                  ? "text-white font-medium" 
                  : "hover:text-[#FBF3EC] hover:bg-[#FBF3EC]/5"
              } ${isCollapsed ? "justify-center" : "justify-start"}`}>
                <item.icon className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isActive ? "text-white" : "text-[#FBF3EC]/50 group-hover:text-terracotta"}`} />
                
                {!isCollapsed && (
                  <span className="text-sm tracking-wide flex-grow">{item.label}</span>
                )}
                
                {!isCollapsed && mounted && item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm transition-colors duration-300 ${isActive ? 'bg-white text-terracotta' : 'bg-[#FBF3EC]/10 text-[#FBF3EC]'}`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}

        <div className="mt-8 text-[10px] uppercase tracking-widest text-[#FBF3EC]/30 mb-2 px-4 font-semibold">
          {!isCollapsed && "System & Preferences"}
        </div>
        
        <Link 
          href="/admin/dashboard/settings"
          onClick={() => setMobileOpen(false)}
          className="relative group block"
        >
          {pathname === "/admin/dashboard/settings" && (
            <motion.div 
              layoutId="activeSidebar"
              className="absolute inset-0 bg-terracotta rounded-xl shadow-[0_0_15px_rgba(194,142,121,0.4)]"
              initial={false}
              transition={{ type: "spring" as any as any, stiffness: 350, damping: 30 }}
            />
          )}
          <div className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative z-10 ${
            pathname === "/admin/dashboard/settings"
              ? "text-white font-medium" 
              : "hover:text-[#FBF3EC] hover:bg-[#FBF3EC]/5"
          } ${isCollapsed ? "justify-center" : "justify-start"}`}>
            <Settings className={`w-5 h-5 shrink-0 transition-colors duration-300 ${pathname === "/admin/dashboard/settings" ? "text-white" : "text-[#FBF3EC]/50 group-hover:text-terracotta"}`} />
            {!isCollapsed && <span className="text-sm tracking-wide">Settings</span>}
          </div>
        </Link>
      </div>

      {/* User Profile / Collapse Toggle */}
      <div className="p-4 border-t border-[#FBF3EC]/5 mt-auto">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-[#FBF3EC]/5 border border-[#FBF3EC]/5">
            <div className="w-8 h-8 rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta font-bold text-xs shrink-0">
              AD
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-[#FBF3EC] truncate">Admin User</span>
              <span className="text-[10px] text-[#FBF3EC]/40 truncate">admin@eloria.com</span>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center p-3 rounded-xl hover:bg-[#FBF3EC]/5 transition-colors text-[#FBF3EC]/50 hover:text-[#FBF3EC] ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!isCollapsed && <span className="text-[10px] uppercase tracking-widest font-semibold">Collapse Panel</span>}
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block h-screen sticky top-0 shrink-0 z-40 overflow-hidden bg-[#161413]"
      >
        {Content}
      </motion.aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[90] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isMobileOpen ? 0 : "-100%" }}
        transition={{ type: "spring" as any as any, damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 w-[280px] z-[100] md:hidden"
      >
        {Content}
      </motion.aside>
    </>
  );
};
