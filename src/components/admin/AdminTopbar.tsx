"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Menu, User as UserIcon, LogOut, Package, AlertCircle } from "lucide-react";
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

  // Close dropdowns on outside click
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

  // Fetch notifications
  useEffect(() => {
    import('@/lib/api').then(({ adminApi }) => {
      adminApi.getDashboardStats().then(res => {
        const data = res.data.data;
        const newNotifs = [];
        
        if (data.activeOrders > 0) {
          newNotifs.push({
            id: 'orders',
            type: 'info',
            title: 'New Orders to Fulfill',
            message: `You have ${data.activeOrders} active orders pending fulfillment.`,
            href: '/admin/dashboard/orders',
            icon: Package
          });
        }
        
        if (data.lowStockProducts && data.lowStockProducts.length > 0) {
          newNotifs.push({
            id: 'stock',
            type: 'alert',
            title: 'Low Stock Alert',
            message: `${data.lowStockProducts.length} products are running dangerously low on stock.`,
            href: '/admin/dashboard/inventory',
            icon: AlertCircle
          });
        }

        setNotifications(newNotifs);
      }).catch(() => {});
    });
  }, []);

  // Generate breadcrumb
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumb = segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ");

  return (
    <header className="h-20 bg-white border-b border-charcoal/5 sticky top-0 z-30 px-6 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-charcoal hover:bg-charcoal/5 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:block text-xs uppercase tracking-widest text-charcoal/60 font-medium">
          {breadcrumb}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-[#fcfbf9] border border-charcoal/10 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:border-terracotta transition-colors w-64"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-charcoal/60 hover:text-charcoal transition-colors focus:outline-none"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-terracotta rounded-full border-2 border-white" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-3 w-80 bg-white border border-charcoal/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden"
              >
                <div className="p-4 border-b border-charcoal/10 flex justify-between items-center bg-[#fcfbf9]">
                  <h4 className="font-serif text-charcoal">Notifications</h4>
                  <span className="text-[10px] bg-charcoal text-white px-2 py-0.5 rounded-full font-bold">
                    {notifications.length} New
                  </span>
                </div>
                <div className="max-h-[300px] overflow-y-auto hide-scrollbar p-2">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <Link 
                        key={notif.id} 
                        href={notif.href}
                        onClick={() => setShowNotifications(false)}
                        className="flex gap-4 p-3 rounded-xl hover:bg-charcoal/5 transition-colors group"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'alert' ? 'bg-red-50 text-red-500 group-hover:bg-red-100' : 'bg-charcoal/5 text-charcoal group-hover:bg-charcoal/10'} transition-colors`}>
                          <notif.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${notif.type === 'alert' ? 'text-red-900' : 'text-charcoal'}`}>{notif.title}</p>
                          <p className="text-xs text-charcoal/60 mt-0.5 leading-relaxed">{notif.message}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-8 text-center text-charcoal/40 text-sm">
                      You're all caught up!
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
            className="flex items-center gap-3 p-1 rounded-full hover:bg-charcoal/5 transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 bg-charcoal text-ivory rounded-full flex items-center justify-center shadow-sm">
              <UserIcon className="w-4 h-4" />
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-3 w-56 bg-white border border-charcoal/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden"
              >
                <div className="p-4 border-b border-charcoal/10 bg-[#fcfbf9]">
                  <p className="font-serif text-sm text-charcoal">System Admin</p>
                  <p className="text-[10px] text-charcoal/60 mt-0.5">admin@eloria.com</p>
                </div>
                <div className="p-2 space-y-1">
                  <Link href="/admin/dashboard/settings" onClick={() => setShowProfile(false)} className="block w-full text-left px-4 py-2 text-xs text-charcoal hover:bg-[#fcfbf9] rounded-lg transition-colors font-medium">
                    Profile Settings
                  </Link>
                  <Link href="/admin/dashboard/settings" onClick={() => setShowProfile(false)} className="block w-full text-left px-4 py-2 text-xs text-charcoal hover:bg-[#fcfbf9] rounded-lg transition-colors font-medium">
                    Manage Store
                  </Link>
                  <div className="h-px bg-charcoal/5 my-1 mx-2" />
                  <button 
                    onClick={() => router.push("/admin/login")}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    <LogOut className="w-3 h-3" /> Sign Out
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
