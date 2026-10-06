"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Menu, User as UserIcon, LogOut, Package, AlertCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface AdminTopbarProps {
  onMenuClick: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ onMenuClick }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    import('@/lib/api').then(({ adminApi }) => {
      adminApi.getDashboardStats().then(res => {
        const data = res.data.data;
        const newNotifs = [];
        
        if (data.activeOrders > 0) {
          newNotifs.push({
            id: 'orders',
            type: 'info',
            title: 'Pending Fulfillment',
            message: `${data.activeOrders} new customer orders are awaiting shipment.`,
            href: '/admin/dashboard/orders',
            icon: Package
          });
        }
        
        if (data.lowStockProducts && data.lowStockProducts.length > 0) {
          newNotifs.push({
            id: 'stock',
            type: 'alert',
            title: 'Inventory Alert',
            message: `${data.lowStockProducts.length} items are running critically low.`,
            href: '/admin/dashboard/inventory',
            icon: AlertCircle
          });
        }

        setNotifications(newNotifs);
      }).catch(() => {});
    });
  }, []);

  // Clean, modern breadcrumb generator
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-100 sticky top-0 z-30 px-6 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Modern Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-2 text-xs font-medium text-zinc-500">
          <span>Admin</span>
          {segments.slice(1).map((segment, index) => (
            <React.Fragment key={segment}>
              <ChevronRight className="w-3 h-3 text-zinc-400" />
              <span className={index === segments.length - 2 ? "text-zinc-900 font-semibold capitalize" : "capitalize text-zinc-500"}>
                {segment}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Quick search..." 
            className="bg-zinc-50 border border-zinc-200/80 rounded-xl py-2 pl-9 pr-4 text-xs text-zinc-800 placeholder-zinc-400 outline-none focus:border-[#D97757] focus:bg-white transition-all w-56 shadow-2xs"
          />
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-xl transition-all"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#D97757] rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white border border-zinc-200/80 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden z-50"
              >
                <div className="p-3.5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <h4 className="font-semibold text-xs text-zinc-900">Notifications</h4>
                  <span className="text-[10px] bg-zinc-900 text-white px-2 py-0.5 rounded-full font-medium">
                    {notifications.length} New
                  </span>
                </div>
                <div className="max-h-[280px] overflow-y-auto p-1.5 space-y-1">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <Link 
                        key={notif.id} 
                        href={notif.href}
                        onClick={() => setShowNotifications(false)}
                        className="flex gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors group"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notif.type === 'alert' ? 'bg-red-50 text-red-500' : 'bg-zinc-100 text-zinc-700'}`}>
                          <notif.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-800">{notif.title}</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{notif.message}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="py-8 text-center text-zinc-400 text-xs">
                      No new notifications right now.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-zinc-100/80 transition-all border border-transparent hover:border-zinc-200"
          >
            <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center shadow-xs text-xs font-semibold">
              <UserIcon className="w-4 h-4" />
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white border border-zinc-200/80 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden z-50"
              >
                <div className="p-3.5 border-b border-zinc-100 bg-zinc-50/50">
                  <p className="font-semibold text-xs text-zinc-900">System Admin</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5 truncate">admin@eloria.com</p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  <Link href="/admin/dashboard/settings" onClick={() => setShowProfile(false)} className="block px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors font-medium">
                    Account Settings
                  </Link>
                  <Link href="/admin/dashboard/settings" onClick={() => setShowProfile(false)} className="block px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors font-medium">
                    Store Preferences
                  </Link>
                  <div className="h-px bg-zinc-100 my-1" />
                  <button 
                    onClick={() => router.push("/admin/login")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};