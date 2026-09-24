"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, Users, Percent, MapPin, CalendarDays } from "lucide-react";
import { adminApi, formatPKR } from "@/lib/api";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as any as any, stiffness: 300, damping: 24 } }
};

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
  const isPositive = (trend ?? 0) >= 0;

  return (
    <motion.div 
      variants={itemVariants} 
      whileHover={{ y: -5, transition: { duration: 0.25, ease: "easeOut" } }}
      className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-[#EDE4D8] shadow-[0_4px_24px_rgba(40,30,20,0.03)] hover:border-terracotta/35 hover:shadow-[0_16px_36px_rgba(194,142,121,0.14)] transition-all duration-300 relative overflow-hidden group"
    >
      {/* Light Shimmer Sweep Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none z-20" />

      {/* Radiant Ambient Corner Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-terracotta/20 via-amber-200/20 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none z-0" />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-[#F5EBE1]/60 rounded-full blur-xl pointer-events-none z-0" />

      {/* Top Bar: Icon + Trend Pill */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FAF5F0] to-[#F3EAE0] border border-[#E8DCCF] flex items-center justify-center text-terracotta shadow-xs group-hover:bg-gradient-to-br group-hover:from-terracotta group-hover:to-[#B85738] group-hover:text-white transition-all duration-300">
          <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
        </div>
        
        <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border shadow-xs transition-colors ${
          isPositive 
            ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' 
            : 'bg-rose-500/10 text-rose-700 border-rose-500/20'
        }`}>
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" /> : <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />}
          <span>{Math.abs(trend ?? 0).toFixed(1)}%</span>
        </div>
      </div>

      {/* Label with Live Dot */}
      <p className="text-charcoal/50 text-[10px] uppercase tracking-widest font-bold mb-1.5 relative z-10 flex items-center justify-between">
        <span>{label}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 group-hover:scale-125 transition-transform" />
      </p>

      {/* Big Counter Value */}
      <h3 className="font-serif text-3xl md:text-4xl text-charcoal tracking-tight relative z-10">
        {isCurrency ? formatPKR(animated) : animated.toLocaleString()}
      </h3>

      {/* Animated Activity Progress Line */}
      <div className="w-full bg-[#F3EFEA] h-1.5 rounded-full overflow-hidden mt-4 relative z-10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.max(isPositive ? 68 + (trend || 0) : 42, 25), 95)}%` }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-terracotta via-[#D97757] to-amber-500 rounded-full group-hover:brightness-110 transition-all"
        />
      </div>

      <div className="flex justify-between items-center text-[10px] text-charcoal/40 font-medium mt-2 relative z-10">
        <span>Live Performance</span>
        <span className="text-terracotta font-semibold">Real-time</span>
      </div>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAnalytics()
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const chartData = data?.monthlyData || Array(12).fill({ month: '-', revenue: 0, newCustomers: 0 });
  const maxRevenue = Math.max(...chartData.map((d: any) => d.revenue), 1);
  const maxDaySales = data?.salesByDay ? Math.max(...data.salesByDay.map((d: any) => d.value)) : 1;

  if (loading) return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="bg-white p-6 rounded-3xl h-36 animate-pulse border border-charcoal/5" />)}
      </div>
    </div>
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-10 max-w-[1600px] mx-auto">
      <motion.div variants={itemVariants}>
        <h1 className="font-serif text-3xl md:text-4xl mb-2 text-charcoal">Advanced Analytics</h1>
        <p className="text-charcoal/60 font-light text-sm">Deep insights into your store's performance and customer behavior.</p>
      </motion.div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Revenue" rawValue={data?.totalRevenue || 0} trend={data?.revenueGrowth || 0} icon={DollarSign} isCurrency />
        <StatCard label="Total Orders" rawValue={data?.totalOrders || 0} trend={data?.ordersGrowth || 0} icon={ShoppingBag} />
        <StatCard label="Average Order Value" rawValue={data?.averageOrderValue || 0} trend={5.2} icon={Users} isCurrency />
        <StatCard label="Conversion Rate" rawValue={parseFloat(data?.conversionRate || 0)} trend={-1.4} icon={Percent} />
      </div>

      {/* Main Revenue Chart */}
      <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-[#EDE4D8] shadow-[0_4px_24px_rgba(40,30,20,0.03)] hover:shadow-[0_12px_36px_rgba(194,142,121,0.08)] transition-all duration-300 relative overflow-hidden group">
        <div className="flex justify-between items-end mb-8 relative z-10">
          <div>
            <h3 className="font-serif text-xl md:text-2xl text-charcoal mb-1">Growth & Revenue Trajectory</h3>
            <p className="text-xs text-charcoal/50 uppercase tracking-widest font-semibold">Last 12 Months Performance</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/20 text-terracotta">
              <span className="w-2.5 h-2.5 rounded-full bg-terracotta shadow-[0_0_6px_rgba(217,119,87,0.8)]" />
              <span className="text-xs uppercase tracking-widest font-bold">Revenue</span>
            </div>
          </div>
        </div>
        
        {chartData.every((d: any) => d.revenue === 0) ? (
          <div className="h-72 flex items-center justify-center text-charcoal/40 text-sm bg-[#FAF8F5] rounded-2xl border border-charcoal/5 border-dashed">
            No analytics data available yet.
          </div>
        ) : (
          <div className="h-72 flex items-end gap-2 sm:gap-4 justify-between relative z-10">
            <div className="absolute left-0 top-0 bottom-6 w-full flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full border-t border-charcoal/10" />
              <div className="w-full border-t border-charcoal/10" />
              <div className="w-full border-t border-charcoal/10" />
              <div className="w-full border-t border-charcoal/10" />
            </div>
            
            {chartData.map((d: any, i: number) => (
              <div key={i} className="relative w-full flex flex-col justify-end items-center group/bar h-full">
                <div className="absolute -top-14 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-charcoal text-ivory text-[10px] px-3 py-2 rounded-xl shadow-xl whitespace-nowrap pointer-events-none z-20 flex flex-col items-center">
                  <span className="font-bold text-xs mb-0.5">{formatPKR(d.revenue)}</span>
                  <span className="text-ivory/60">{d.newCustomers} new customers</span>
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max((d.revenue / maxRevenue) * 100, 3)}%` }}
                  transition={{ duration: 1, delay: i * 0.05 + 0.3, type: "spring" as any as any }}
                  className="w-full max-w-[48px] bg-gradient-to-t from-terracotta/50 via-terracotta to-[#DF967E] rounded-t-xl group-hover/bar:from-terracotta group-hover/bar:to-terracotta/90 transition-all relative z-10 shadow-xs hover:brightness-110"
                />
                <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mt-4 shrink-0">{d.month}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Deep Dive Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sales by City */}
        <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-[#EDE4D8] shadow-[0_4px_24px_rgba(40,30,20,0.03)] hover:shadow-[0_12px_36px_rgba(194,142,121,0.08)] transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-xl text-charcoal">Top Cities by Revenue</h3>
            <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-6">
            {data?.salesByCity?.length > 0 ? data.salesByCity.map((city: any, i: number) => {
              const maxCitySales = Math.max(...data.salesByCity.map((c: any) => c.value));
              const percentage = Math.max((city.value / maxCitySales) * 100, 5);
              return (
                <div key={i} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-charcoal flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-terracotta" />
                      {city.name}
                    </span>
                    <span className="font-serif font-bold text-charcoal">{formatPKR(city.value)}</span>
                  </div>
                  <div className="w-full bg-[#F3EFEA] rounded-full h-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${percentage}%` }} 
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className="bg-gradient-to-r from-terracotta to-amber-500 h-full rounded-full group-hover:brightness-110 transition-all"
                    />
                  </div>
                </div>
              );
            }) : (
              <div className="text-sm text-charcoal/50 text-center py-4">No location data yet.</div>
            )}
          </div>
        </div>

        {/* Sales by Day of Week */}
        <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-[#EDE4D8] shadow-[0_4px_24px_rgba(40,30,20,0.03)] hover:shadow-[0_12px_36px_rgba(194,142,121,0.08)] transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-xl text-charcoal">Performance by Day</h3>
            <div className="w-10 h-10 rounded-xl bg-charcoal/5 flex items-center justify-center text-charcoal">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex items-end gap-2 justify-between h-56 mt-4">
            {data?.salesByDay?.length > 0 ? data.salesByDay.map((dayData: any, i: number) => (
              <div key={i} className="relative w-full flex flex-col justify-end items-center group/day h-full">
                <div className="absolute -top-10 opacity-0 group-hover/day:opacity-100 transition-opacity bg-charcoal text-ivory text-[10px] px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none z-10 font-serif font-bold">
                  {formatPKR(dayData.value)}
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max((dayData.value / maxDaySales) * 100, 6)}%` }}
                  transition={{ duration: 1, delay: 0.8 + (i * 0.05), type: "spring" as any as any }}
                  className="w-full max-w-[32px] bg-gradient-to-t from-charcoal/60 to-charcoal rounded-t-lg group-hover/day:from-terracotta group-hover/day:to-[#DF967E] transition-all relative z-10 shadow-xs"
                />
                <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mt-3 shrink-0">{dayData.day.substring(0,3)}</span>
              </div>
            )) : (
              <div className="w-full text-center text-sm text-charcoal/50 pb-8">No daily sales data yet.</div>
            )}
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}
