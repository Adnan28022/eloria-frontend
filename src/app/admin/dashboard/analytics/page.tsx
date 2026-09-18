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
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
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

function StatCard({ label, value, rawValue, trend, icon: Icon, isCurrency = false }: any) {
  const animated = useCountUp(rawValue);
  return (
    <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-charcoal/5 hover:shadow-[4px_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-terracotta/5 rounded-full blur-2xl group-hover:bg-terracotta/10 transition-colors" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-[#fcfbf9] border border-charcoal/5 flex items-center justify-center">
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
      <motion.div variants={itemVariants} className="bg-white p-6 md:p-8 rounded-3xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-charcoal/5 hover:shadow-[4px_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="font-serif text-xl text-charcoal mb-1">Growth & Revenue Trajectory</h3>
            <p className="text-xs text-charcoal/50 uppercase tracking-widest">Last 12 Months</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-terracotta/80" />
              <span className="text-xs text-charcoal/60 uppercase tracking-widest font-medium">Revenue</span>
            </div>
          </div>
        </div>
        
        {chartData.every((d: any) => d.revenue === 0) ? (
          <div className="h-72 flex items-center justify-center text-charcoal/40 text-sm bg-[#fcfbf9] rounded-2xl border border-charcoal/5 border-dashed">
            No analytics data available yet.
          </div>
        ) : (
          <div className="h-72 flex items-end gap-2 sm:gap-4 justify-between relative">
            <div className="absolute left-0 top-0 bottom-6 w-full flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full border-t border-charcoal/10" />
              <div className="w-full border-t border-charcoal/10" />
              <div className="w-full border-t border-charcoal/10" />
              <div className="w-full border-t border-charcoal/10" />
            </div>
            
            {chartData.map((d: any, i: number) => (
              <div key={i} className="relative w-full flex flex-col justify-end items-center group/bar h-full">
                <div className="absolute -top-14 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-charcoal text-ivory text-[10px] px-3 py-2 rounded-xl shadow-xl whitespace-nowrap pointer-events-none z-10 flex flex-col items-center">
                  <span className="font-bold text-xs mb-0.5">{formatPKR(d.revenue)}</span>
                  <span className="text-ivory/60">{d.newCustomers} new customers</span>
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max((d.revenue / maxRevenue) * 100, 2)}%` }}
                  transition={{ duration: 1, delay: i * 0.05 + 0.3, type: "spring" }}
                  className="w-full max-w-[48px] bg-gradient-to-t from-terracotta/40 to-terracotta rounded-t-lg group-hover/bar:from-terracotta group-hover/bar:to-terracotta/90 transition-colors relative z-10"
                />
                <span className="text-[10px] font-medium text-charcoal/50 uppercase tracking-widest mt-4 shrink-0">{d.month}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Deep Dive Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sales by City */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-charcoal/5 hover:shadow-[4px_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-xl text-charcoal">Top Cities by Revenue</h3>
            <MapPin className="w-5 h-5 text-charcoal/30" />
          </div>
          
          <div className="space-y-6">
            {data?.salesByCity?.length > 0 ? data.salesByCity.map((city: any, i: number) => {
              const maxCitySales = Math.max(...data.salesByCity.map((c: any) => c.value));
              const percentage = Math.max((city.value / maxCitySales) * 100, 5);
              return (
                <div key={i} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-charcoal flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta/50" />
                      {city.name}
                    </span>
                    <span className="font-serif">{formatPKR(city.value)}</span>
                  </div>
                  <div className="w-full bg-[#fcfbf9] rounded-full h-1.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${percentage}%` }} 
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className="bg-charcoal h-full rounded-full group-hover:bg-terracotta transition-colors"
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
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-charcoal/5 hover:shadow-[4px_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-xl text-charcoal">Performance by Day</h3>
            <CalendarDays className="w-5 h-5 text-charcoal/30" />
          </div>
          
          <div className="flex items-end gap-2 justify-between h-56 mt-4">
            {data?.salesByDay?.length > 0 ? data.salesByDay.map((dayData: any, i: number) => (
              <div key={i} className="relative w-full flex flex-col justify-end items-center group/day h-full">
                <div className="absolute -top-10 opacity-0 group-hover/day:opacity-100 transition-opacity bg-charcoal text-ivory text-[10px] px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none z-10 font-serif">
                  {formatPKR(dayData.value)}
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max((dayData.value / maxDaySales) * 100, 5)}%` }}
                  transition={{ duration: 1, delay: 0.8 + (i * 0.05), type: "spring" }}
                  className="w-full max-w-[32px] bg-charcoal/10 rounded-t-md group-hover/day:bg-charcoal transition-colors relative z-10"
                />
                <span className="text-[10px] font-medium text-charcoal/50 uppercase tracking-widest mt-3 shrink-0">{dayData.day.substring(0,3)}</span>
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
