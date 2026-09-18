"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Package, AlertCircle } from "lucide-react";
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

function StatCard({ label, value, rawValue, trend, icon: Icon, isCurrency = false }: any) {
  const animated = useCountUp(rawValue);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-charcoal/5 hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-terracotta/5 rounded-full blur-2xl group-hover:bg-terracotta/10 transition-colors" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-[#fcfbf9] border border-charcoal/5 flex items-center justify-center">
          <Icon className="w-6 h-6 text-terracotta" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${trend >= 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(trend).toFixed(1)}%
        </div>
      </div>
      <p className="text-charcoal/50 text-xs uppercase tracking-widest mb-1 font-medium relative z-10">{label}</p>
      <h3 className="font-serif text-3xl text-charcoal relative z-10">
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
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
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
          <div key={i} className="bg-white p-6 rounded-3xl h-36 animate-pulse border border-charcoal/5" />
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
          <h1 className="font-serif text-3xl md:text-4xl mb-2 text-charcoal">Dashboard Overview</h1>
          <p className="text-charcoal/60 font-light text-sm">Real-time store performance metrics and deep insights.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/dashboard/orders" className="px-6 py-2.5 bg-white border border-charcoal/10 text-charcoal text-xs uppercase tracking-widest font-medium rounded-xl hover:bg-[#fcfbf9] transition-colors shadow-sm">
            View Orders
          </Link>
          <Link href="/admin/dashboard/products" className="px-6 py-2.5 bg-charcoal text-ivory text-xs uppercase tracking-widest font-medium rounded-xl hover:bg-terracotta transition-colors shadow-lg">
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
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-charcoal/5 relative overflow-hidden group hover:shadow-[4px_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="font-serif text-xl text-charcoal mb-1">Revenue History</h3>
              <p className="text-xs text-charcoal/50 uppercase tracking-widest">Last 12 Months</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1">Average / Month</p>
              <p className="font-serif text-2xl text-charcoal">{formatPKR((stats?.totalRevenue || 0) / 12)}</p>
            </div>
          </div>
          
          {chartData.every((d: any) => d.revenue === 0) ? (
            <div className="h-64 flex items-center justify-center text-charcoal/40 text-sm bg-[#fcfbf9] rounded-xl border border-charcoal/5 border-dashed">
              No revenue data yet. Place some orders to see the chart.
            </div>
          ) : (
            <div className="h-64 flex items-end gap-2 sm:gap-3 md:gap-4 justify-between relative">
              <div className="absolute left-0 top-0 bottom-6 w-full flex flex-col justify-between pointer-events-none opacity-20">
                <div className="w-full border-t border-charcoal/10" />
                <div className="w-full border-t border-charcoal/10" />
                <div className="w-full border-t border-charcoal/10" />
                <div className="w-full border-t border-charcoal/10" />
              </div>
              
              {chartData.map((d: any, i: number) => (
                <div key={i} className="relative w-full flex flex-col justify-end items-center group/bar h-full">
                  <div className="absolute -top-12 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-charcoal text-ivory text-[10px] px-3 py-2 rounded-lg shadow-xl whitespace-nowrap pointer-events-none z-10 flex flex-col items-center">
                    <span className="font-bold">{formatPKR(d.revenue)}</span>
                    <span className="text-ivory/60">{d.orders} orders</span>
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max((d.revenue / maxRevenue) * 100, 2)}%` }}
                    transition={{ duration: 1, delay: i * 0.05 + 0.5, type: "spring" }}
                    className="w-full max-w-[40px] bg-gradient-to-t from-charcoal/80 to-charcoal rounded-t-md group-hover/bar:from-terracotta group-hover/bar:to-terracotta/80 transition-colors relative z-10 shadow-sm"
                  />
                  <span className="text-[9px] text-charcoal/50 uppercase tracking-widest mt-4 shrink-0">{d.month}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actionable Insights */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-charcoal/5 flex-1 flex flex-col justify-center relative overflow-hidden group hover:shadow-[4px_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-terracotta/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
            <h3 className="font-serif text-xl text-charcoal mb-2">Average Order Value</h3>
            <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-6">Across all time</p>
            <div className="flex items-end gap-3">
              <h2 className="font-serif text-4xl md:text-5xl text-terracotta">{formatPKR(stats?.averageOrderValue || 0)}</h2>
            </div>
          </div>
          
          <div className="bg-charcoal p-6 rounded-2xl shadow-xl text-ivory flex-1 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <h3 className="font-serif text-xl mb-2">Conversion Status</h3>
              <p className="text-xs text-ivory/60 uppercase tracking-widest mb-6">Current Performance</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Store Traffic Conversion</span>
                    <span className="font-bold">4.8%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 1.5, delay: 0.8 }} className="bg-terracotta h-1.5 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Cart Abandonment</span>
                    <span className="font-bold">62%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '62%' }} transition={{ duration: 1.5, delay: 1 }} className="bg-white h-1.5 rounded-full" />
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
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-charcoal/5 overflow-hidden flex flex-col hover:shadow-[4px_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
          <div className="p-6 border-b border-charcoal/5 flex justify-between items-center">
            <h3 className="font-serif text-xl">Recent Orders</h3>
            <Link href="/admin/dashboard/orders" className="text-xs text-terracotta uppercase tracking-widest font-medium hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto flex-1">
            {stats?.recentOrders?.length > 0 ? (
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-[#fcfbf9] text-[10px] uppercase tracking-widest text-charcoal/50 border-b border-charcoal/10">
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Total</th>
                    <th className="p-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order: any, i: number) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                      key={order._id} 
                      className="border-b border-charcoal/5 hover:bg-[#fcfbf9] transition-colors"
                    >
                      <td className="p-4 font-medium text-xs">#{order._id?.substring(0, 8)}</td>
                      <td className="p-4 text-sm font-medium">{order.customer?.name}</td>
                      <td className="p-4 font-serif text-base">{formatPKR(order.total)}</td>
                      <td className="p-4 text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                          order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                          order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          order.status === 'Shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-orange-50 text-orange-700 border-orange-200'
                        }`}>{order.status}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-charcoal/50 text-sm">No recent orders.</div>
            )}
          </div>
        </div>

        {/* Right column lists */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Top Products */}
          <div className="bg-white p-6 rounded-2xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-charcoal/5 hover:shadow-[4px_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl">Top Selling</h3>
              <TrendingUp className="w-4 h-4 text-charcoal/30" />
            </div>
            <div className="space-y-4">
              {stats?.topProducts?.length > 0 ? stats.topProducts.map((p: any, i: number) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }} key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#fcfbf9] border border-transparent hover:border-charcoal/5 transition-colors">
                  <img src={p.image || '/prod-1.png'} className="w-12 h-12 rounded-lg object-cover bg-charcoal/5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-charcoal/50">{p.sold} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-sm">{formatPKR(p.revenue)}</p>
                  </div>
                </motion.div>
              )) : (
                <div className="text-sm text-charcoal/50 text-center py-4">No sales data yet.</div>
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white p-6 rounded-2xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-red-100 hover:shadow-[4px_10px_30px_rgba(255,0,0,0.04)] transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl text-red-900">Low Stock Alerts</h3>
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
            <div className="space-y-4">
              {stats?.lowStockProducts?.length > 0 ? stats.lowStockProducts.map((p: any, i: number) => (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }} key={p.id} className="flex items-center gap-4 p-3 rounded-xl bg-red-50/50 border border-red-100/50 hover:bg-red-50 transition-colors">
                  <img src={p.image || '/prod-1.png'} className="w-10 h-10 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-red-950 truncate">{p.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                      {p.stock} left
                    </span>
                  </div>
                </motion.div>
              )) : (
                <div className="text-sm text-green-600 text-center py-4 font-medium flex items-center justify-center gap-2">
                  All products are well stocked.
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* NEW Row: Category Sales & Customer Demographics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales by Category */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-charcoal/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-serif text-xl text-charcoal">Sales by Category</h3>
            <span className="text-xs text-charcoal/50 uppercase tracking-widest">Lifetime Revenue</span>
          </div>
          
          <div className="space-y-6">
            {stats?.salesByCategory?.length > 0 ? stats.salesByCategory.map((cat: any, i: number) => {
              const maxCatRevenue = Math.max(...stats.salesByCategory.map((c: any) => c.value));
              const percentage = Math.max((cat.value / maxCatRevenue) * 100, 2);
              return (
                <div key={i} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-charcoal group-hover:text-terracotta transition-colors">{cat.name}</span>
                    <span className="font-serif">{formatPKR(cat.value)}</span>
                  </div>
                  <div className="w-full bg-[#fcfbf9] rounded-full h-2 overflow-hidden border border-charcoal/5">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${percentage}%` }} 
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="bg-gradient-to-r from-charcoal to-terracotta h-full rounded-full"
                    />
                  </div>
                </div>
              );
            }) : (
              <div className="text-center text-charcoal/50 text-sm py-8">No category data available.</div>
            )}
          </div>
        </div>

        {/* Customer Demographics & Recent Customers */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-charcoal/5 flex-1">
            <h3 className="font-serif text-xl mb-6 text-charcoal">Customer Insights</h3>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full border-8 border-[#fcfbf9] relative flex items-center justify-center shrink-0">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-charcoal/5" />
                  <motion.circle 
                    cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" 
                    strokeDasharray="289"
                    initial={{ strokeDashoffset: 289 }}
                    animate={{ strokeDashoffset: 289 - (289 * ((stats?.customerStats?.returning || 0) / Math.max(stats?.totalCustomers || 1, 1))) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-terracotta" 
                  />
                </svg>
                <div className="text-center">
                  <p className="font-bold text-lg leading-none">{Math.round(((stats?.customerStats?.returning || 0) / Math.max(stats?.totalCustomers || 1, 1)) * 100)}%</p>
                  <p className="text-[8px] uppercase tracking-widest text-charcoal/50 mt-1">Return</p>
                </div>
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-charcoal/5" /> New
                  </p>
                  <p className="font-bold text-lg">{stats?.customerStats?.new || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-terracotta" /> Returning
                  </p>
                  <p className="font-bold text-lg">{stats?.customerStats?.returning || 0}</p>
                </div>
              </div>
            </div>

            <h4 className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-4 border-b border-charcoal/5 pb-2">Recent Signups</h4>
            <div className="space-y-4">
              {stats?.recentCustomers?.map((c: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal font-bold text-xs shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-[10px] text-charcoal/50 truncate">{c.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
