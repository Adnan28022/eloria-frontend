"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Package, Sparkles } from "lucide-react";
import { adminApi, formatPKR } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

// Count-up animation hook
function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function StatCard({ label, rawValue, trend, icon: Icon, isCurrency = false }: any) {
  const animated = useCountUp(rawValue);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white/85 backdrop-blur-xl p-6 rounded-3xl shadow-[0_4px_25px_rgba(44,37,35,0.03)] border border-white/80 hover:border-terracotta/20 hover:shadow-[0_14px_35px_rgba(194,142,121,0.12)] transition-all duration-300 relative overflow-hidden group"
    >
      {/* Animated Floating Gradient Glow Aura */}
      <motion.div 
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.7, 0.35],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-8 -top-8 w-28 h-28 bg-gradient-to-br from-terracotta/20 to-amber-200/30 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" 
      />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-terracotta/10 to-amber-50/50 border border-terracotta/15 flex items-center justify-center text-terracotta shadow-sm group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${
          trend >= 0 ? 'bg-green-50/80 text-green-700 border border-green-200/60' : 'bg-red-50/80 text-red-700 border border-red-200/60'
        }`}>
          {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(trend).toFixed(1)}%
        </div>
      </div>
      <p className="text-charcoal/50 text-[10px] uppercase tracking-widest mb-1.5 font-bold relative z-10">{label}</p>
      <h3 className="font-serif text-3xl md:text-4xl text-charcoal relative z-10">
        {isCurrency ? formatPKR(animated) : animated.toLocaleString()}
      </h3>
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as any, stiffness: 300, damping: 24 } }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getDashboardStats();
        setStats(res.data.data);
      } catch {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = stats?.monthlyRevenue || Array(12).fill({ month: '-', revenue: 0 });
  const maxRevenue = Math.max(...chartData.map((d: any) => d.revenue), 1);

  if (loading) return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/70 p-6 rounded-3xl h-36 animate-pulse border border-charcoal/5" />
        ))}
      </div>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-8 pb-10 max-w-[1600px] mx-auto"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-terracotta" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-terracotta">Executive Suite</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">Dashboard Overview</h1>
          <p className="text-charcoal/60 font-light text-sm mt-1">Real-time store performance metrics and deep insights.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/dashboard/orders" className="px-6 py-2.5 bg-white/80 backdrop-blur-md border border-[#EBE3D7] text-charcoal text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-white transition-all shadow-sm">
            View Orders
          </Link>
          <Link href="/admin/dashboard/products" className="px-6 py-2.5 bg-charcoal text-ivory text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-terracotta transition-all shadow-lg hover:shadow-terracotta/20">
            Add Product
          </Link>
        </div>
      </motion.div>

      {/* Primary Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Revenue" rawValue={stats?.totalRevenue || 0} trend={stats?.revenueGrowth || 0} icon={DollarSign} isCurrency />
        <StatCard label="Active Orders" rawValue={stats?.activeOrders || 0} trend={stats?.ordersGrowth || 0} icon={ShoppingBag} />
        <StatCard label="Total Customers" rawValue={stats?.totalCustomers || 0} trend={12.5} icon={Users} />
        <StatCard label="Total Products" rawValue={stats?.totalProducts || 0} trend={4.2} icon={Package} />
      </motion.div>

      {/* Middle Section: Chart & Insights */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-8 bg-white/85 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_4px_30px_rgba(44,37,35,0.03)] border border-white/80 relative overflow-hidden group hover:shadow-[0_12px_40px_rgba(194,142,121,0.08)] transition-all duration-300">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-12 -top-12 w-48 h-48 bg-terracotta/10 rounded-full blur-3xl pointer-events-none"
          />

          <div className="flex justify-between items-end mb-8 relative z-10">
            <div>
              <h3 className="font-serif text-2xl text-charcoal mb-1">Revenue History</h3>
              <p className="text-xs text-charcoal/50 uppercase tracking-widest font-semibold">Last 12 Months</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-charcoal/50 uppercase tracking-widest mb-1 font-bold">Monthly Average</p>
              <p className="font-serif text-2xl text-terracotta font-bold">{formatPKR((stats?.totalRevenue || 0) / 12)}</p>
            </div>
          </div>
          
          {chartData.every((d: any) => d.revenue === 0) ? (
            <div className="h-64 flex items-center justify-center text-charcoal/40 text-sm bg-[#FAF7F2]/60 rounded-2xl border border-charcoal/5 border-dashed">
              No revenue data recorded yet. Place orders to see real-time chart.
            </div>
          ) : (
            <div className="h-64 flex items-end gap-2 sm:gap-3 md:gap-4 justify-between relative z-10">
              <div className="absolute left-0 top-0 bottom-6 w-full flex flex-col justify-between pointer-events-none opacity-20">
                <div className="w-full border-t border-charcoal/10" />
                <div className="w-full border-t border-charcoal/10" />
                <div className="w-full border-t border-charcoal/10" />
                <div className="w-full border-t border-charcoal/10" />
              </div>
              
              {chartData.map((d: any, i: number) => (
                <div key={i} className="relative w-full flex flex-col justify-end items-center group/bar h-full">
                  <div className="absolute -top-12 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-charcoal text-ivory text-[10px] px-3 py-2 rounded-xl shadow-xl whitespace-nowrap pointer-events-none z-20 flex flex-col items-center">
                    <span className="font-bold">{formatPKR(d.revenue)}</span>
                    <span className="text-ivory/60">{d.orders} orders</span>
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max((d.revenue / maxRevenue) * 100, 2)}%` }}
                    transition={{ duration: 1, delay: i * 0.05 + 0.3, type: "spring" }}
                    className="w-full max-w-[40px] bg-gradient-to-t from-charcoal/70 to-charcoal rounded-t-xl group-hover/bar:from-terracotta group-hover/bar:to-[#DF967E] transition-all relative z-10 shadow-sm"
                  />
                  <span className="text-[9px] text-charcoal/50 uppercase tracking-widest mt-4 shrink-0 font-bold">{d.month}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actionable Insights */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white/85 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_4px_30px_rgba(44,37,35,0.03)] border border-white/80 flex-1 flex flex-col justify-center relative overflow-hidden group hover:shadow-[0_12px_40px_rgba(194,142,121,0.08)] transition-all duration-300">
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.5, 0.25] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" 
            />
            <h3 className="font-serif text-xl text-charcoal mb-1 relative z-10">Average Order Value</h3>
            <p className="text-[10px] text-charcoal/50 uppercase tracking-widest font-bold mb-6 relative z-10">Across all orders</p>
            <div className="flex items-end gap-3 relative z-10">
              <h2 className="font-serif text-4xl md:text-5xl text-terracotta">{formatPKR(stats?.averageOrderValue || 0)}</h2>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#1F1C1B] via-[#2A2421] to-[#1F1C1B] p-6 md:p-8 rounded-3xl shadow-xl text-[#FAF7F2] flex-1 flex flex-col justify-center relative overflow-hidden group">
            {/* Ambient Interior Glow */}
            <motion.div 
              animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.45, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-44 h-44 bg-terracotta/30 rounded-full blur-3xl pointer-events-none" 
            />
            <div className="relative z-10">
              <h3 className="font-serif text-xl mb-1 text-white">Conversion Status</h3>
              <p className="text-[10px] text-[#FAF7F2]/50 uppercase tracking-widest mb-6 font-bold">Store Efficiency</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span>Store Traffic Conversion</span>
                    <span className="font-bold text-terracotta">4.8%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 1.5, delay: 0.5 }} className="bg-gradient-to-r from-terracotta to-[#DF967E] h-2 rounded-full shadow-[0_0_10px_rgba(194,142,121,0.5)]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span>Cart Abandonment</span>
                    <span className="font-bold text-white">62%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '62%' }} transition={{ duration: 1.5, delay: 0.7 }} className="bg-white/90 h-2 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Section: Tables & Lists */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-12 bg-white/85 backdrop-blur-xl rounded-3xl shadow-[0_4px_30px_rgba(44,37,35,0.03)] border border-white/80 overflow-hidden flex flex-col hover:shadow-[0_12px_40px_rgba(194,142,121,0.08)] transition-all duration-300">
          <div className="p-6 md:p-8 border-b border-[#EBE3D7]/60 flex justify-between items-center">
            <div>
              <h3 className="font-serif text-2xl text-charcoal">Recent Orders</h3>
              <p className="text-xs text-charcoal/50 font-light mt-0.5">Real-time fulfillment tracking</p>
            </div>
            <Link href="/admin/dashboard/orders" className="text-xs text-terracotta uppercase tracking-widest font-bold hover:underline">
              View All Orders →
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            {stats?.recentOrders?.length > 0 ? (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[#FAF7F2]/70 text-[10px] uppercase tracking-widest text-charcoal/50 border-b border-[#EBE3D7]/60">
                    <th className="p-4 font-bold">Order ID</th>
                    <th className="p-4 font-bold">Customer</th>
                    <th className="p-4 font-bold">Total</th>
                    <th className="p-4 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order: any, i: number) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                      key={order._id} 
                      className="border-b border-[#EBE3D7]/40 hover:bg-[#FAF7F2]/80 transition-colors"
                    >
                      <td className="p-4 font-mono font-bold text-xs text-charcoal/80">#{order._id?.substring(0, 8)}</td>
                      <td className="p-4 text-sm font-semibold text-charcoal">{order.customer?.name}</td>
                      <td className="p-4 font-serif text-base text-charcoal font-medium">{formatPKR(order.total)}</td>
                      <td className="p-4 text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border backdrop-blur-md shadow-xs ${
                          order.status === 'Delivered' ? 'bg-green-50/80 text-green-700 border-green-200' :
                          order.status === 'Processing' ? 'bg-blue-50/80 text-blue-700 border-blue-200' :
                          order.status === 'Shipped' ? 'bg-purple-50/80 text-purple-700 border-purple-200' :
                          order.status === 'Cancelled' ? 'bg-red-50/80 text-red-700 border-red-200' :
                          'bg-amber-50/80 text-amber-700 border-amber-200'
                        }`}>{order.status}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-charcoal/40 text-sm">
                No orders yet.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
