"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Search, Eye, Trash2, Download, ShoppingBag, Receipt, Printer, PackageX, Truck, CheckCircle2, Clock } from "lucide-react";
import { adminApi, formatPKR } from "@/lib/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import InvoiceModal from "@/components/admin/InvoiceModal";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  Delivered: 'bg-green-50 text-green-600 border-green-100',
  Processing: 'bg-blue-50 text-blue-600 border-blue-100',
  Shipped: 'bg-purple-50 text-purple-600 border-purple-100',
  Cancelled: 'bg-red-50 text-red-600 border-red-100',
  Returned: 'bg-red-50 text-red-600 border-red-100',
  Pending: 'bg-orange-50 text-orange-600 border-orange-100',
};

const ALL_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [viewInvoice, setViewInvoice] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      const res = await adminApi.getOrders();
      setOrders(res.data.data);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    try {
      await adminApi.updateOrderStatus(id, status);
      toast.success(`Order status updated to ${status}`);
    } catch { toast.error('Failed to update status'); fetchOrders(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    setOrders(prev => prev.filter(o => o._id !== id));
    try {
      await adminApi.deleteOrder(id);
      toast.success('Order deleted');
    } catch { toast.error('Failed to delete order'); fetchOrders(); }
  };

  const handleExport = () => {
    if (orders.length === 0) return toast.error('No orders to export');
    const headers = ["Order ID", "Customer Name", "Customer Email", "Date", "Status", "Subtotal", "Shipping", "Total", "Items"];
    const rows = orders.map(o => [
      o.orderId, `"${o.customer?.name || ''}"`, `"${o.customer?.email || ''}"`,
      new Date(o.createdAt).toISOString().split('T')[0], o.status,
      o.subtotal, o.shipping, o.total,
      `"${o.items?.map((i: any) => `${i.productName} (x${i.quantity})`).join(', ')}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Eloria_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export successful');
  };

  // Derived Stats
  const stats = useMemo(() => {
    let pending = 0;
    let delivered = 0;
    let returnedCount = 0;
    let returnedAmount = 0;
    let totalRevenue = 0;

    orders.forEach(o => {
      if (o.status === 'Pending') pending++;
      else if (o.status === 'Delivered') { delivered++; totalRevenue += o.total; }
      else if (o.status === 'Returned') { returnedCount++; returnedAmount += o.total; }
    });

    return { pending, delivered, returnedCount, returnedAmount, totalRevenue, totalCount: orders.length };
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.orderId?.toLowerCase().includes(search.toLowerCase()) || o.customer?.name?.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === "All" || o.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [orders, search, activeTab]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-10 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl mb-2 text-charcoal">Orders</h1>
          <p className="text-charcoal/60 font-light text-sm">View, manage, and process customer orders.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="bg-white text-charcoal border border-charcoal/10 px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-[#fcfbf9] hover:border-charcoal/20 transition-all shadow-sm flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <Link href="/admin/dashboard/pos" className="bg-charcoal text-ivory px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-terracotta transition-all shadow-lg hover:shadow-terracotta/30 flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Open POS
          </Link>
        </div>
      </motion.div>

      {/* Stats Widgets */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-charcoal/5 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-charcoal/50 font-bold mb-1">Total Orders</p>
            <h3 className="font-serif text-2xl text-charcoal">{stats.totalCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal"><Receipt className="w-5 h-5" /></div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-charcoal/5 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-charcoal/50 font-bold mb-1">Pending Processing</p>
            <h3 className="font-serif text-2xl text-orange-600">{stats.pending}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600"><Clock className="w-5 h-5" /></div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-charcoal/5 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-charcoal/50 font-bold mb-1">Total Delivered</p>
            <h3 className="font-serif text-2xl text-green-600">{stats.delivered}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600"><CheckCircle2 className="w-5 h-5" /></div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-charcoal/5 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-charcoal/50 font-bold mb-1">Returned Value</p>
            <h3 className="font-serif text-2xl text-red-600">{formatPKR(stats.returnedAmount)}</h3>
            <p className="text-xs text-charcoal/50 mt-1">{stats.returnedCount} orders returned</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600"><PackageX className="w-5 h-5" /></div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-charcoal/5 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[4px_10px_30px_rgba(0,0,0,0.04)]">
        
        {/* Toolbar & Tabs */}
        <div className="border-b border-charcoal/5 bg-[#fcfbf9]">
          <div className="p-4 sm:p-6 pb-4">
            <div className="relative w-full max-w-md group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 group-focus-within:text-terracotta transition-colors" />
              <input 
                type="text" 
                placeholder="Search by Order ID or Customer Name..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="w-full bg-white border border-charcoal/10 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all shadow-sm" 
              />
            </div>
          </div>
          <div className="px-4 sm:px-6 flex overflow-x-auto hide-scrollbar gap-6">
            {["All", ...ALL_STATUSES].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs uppercase tracking-widest font-bold whitespace-nowrap border-b-2 transition-all ${activeTab === tab ? 'border-terracotta text-terracotta' : 'border-transparent text-charcoal/40 hover:text-charcoal/70'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Data View */}
        <div className="overflow-x-auto p-0 sm:p-2 bg-white">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-charcoal/5 rounded-2xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-charcoal/5 flex items-center justify-center mb-4">
                <Receipt className="w-8 h-8 text-charcoal/30" />
              </div>
              <h3 className="font-serif text-xl mb-2 text-charcoal">No Orders Found</h3>
              <p className="text-sm text-charcoal/50 mb-6">We couldn't find any orders matching your criteria.</p>
              <button onClick={() => { setSearch(''); setActiveTab('All'); }} className="text-xs uppercase tracking-widest font-bold text-terracotta hover:underline">Clear Filters</button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-charcoal/50 border-b border-charcoal/5">
                  <th className="p-4 sm:p-6 font-medium">Order ID & Date</th>
                  <th className="p-4 sm:p-6 font-medium">Customer Details</th>
                  <th className="p-4 sm:p-6 font-medium">Total Amount</th>
                  <th className="p-4 sm:p-6 font-medium">Fulfillment Status</th>
                  <th className="p-4 sm:p-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((order) => (
                    <motion.tr 
                      layout 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                      key={order._id} 
                      className="border-b border-charcoal/5 hover:bg-[#fcfbf9] transition-colors group"
                    >
                      <td className="p-4 sm:p-6">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm text-charcoal font-bold">{order.orderId}</span>
                          <span className="text-[10px] uppercase tracking-widest text-charcoal/50 mt-1">{new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-charcoal capitalize">{order.customer?.name}</span>
                          <span className="text-xs text-charcoal/60 mt-0.5 truncate max-w-[200px]">{order.customer?.email}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-6">
                        <div className="flex flex-col">
                          <span className="font-serif text-base text-charcoal">{formatPKR(order.total)}</span>
                          <span className="text-[10px] uppercase tracking-widest text-charcoal/40 mt-0.5">{order.items?.length || 0} items</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-6">
                        <div className="relative group/select inline-block">
                          <select
                            value={order.status}
                            onChange={e => handleStatusChange(order._id, e.target.value)}
                            className={`appearance-none outline-none cursor-pointer text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border shadow-sm transition-colors pr-8 ${STATUS_STYLES[order.status] || STATUS_STYLES.Pending}`}
                          >
                            {ALL_STATUSES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 sm:p-6 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setViewInvoice(order)} className="p-2 text-charcoal hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors tooltip" title="View & Print Invoice">
                            <Printer className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(order._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip" title="Delete Order">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {viewInvoice && (
          <InvoiceModal order={viewInvoice} onClose={() => setViewInvoice(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
