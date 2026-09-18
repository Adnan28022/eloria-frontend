"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertCircle, CheckCircle2, XCircle, Package, Minus, Plus, RefreshCcw } from "lucide-react";
import { adminApi, formatPKR } from "@/lib/api";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetch = async () => {
    try {
      const res = await adminApi.getInventory();
      setInventory(res.data.data);
    } catch { toast.error('Failed to load inventory'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleStockUpdate = async (id: string, value: number) => {
    if (value < 0) return;
    
    // Optimistic UI update
    setInventory(prev => prev.map(item => {
      if (item._id !== id) return item;
      let status = 'In Stock';
      if (value === 0) status = 'Out of Stock';
      else if (value < 10) status = 'Low Stock';
      return { ...item, availableStock: value, status };
    }));

    setUpdating(id);
    try {
      await adminApi.updateInventory(id, value);
    } catch {
      toast.error('Failed to update stock');
      fetch(); // Revert on failure
    } finally { setUpdating(null); }
  };

  const getStatus = (status: string) => {
    if (status === 'Out of Stock') return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' };
    if (status === 'Low Stock') return { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' };
    return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' };
  };

  const filtered = inventory.filter(i =>
    (i.productName || i.product?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    i.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-10 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl mb-2 text-charcoal">Inventory Management</h1>
          <p className="text-charcoal/60 font-light text-sm">Track stock levels, SKUs, and replenish your catalog.</p>
        </div>
        <button onClick={() => { setLoading(true); fetch(); }} className="bg-white text-charcoal border border-charcoal/10 px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-[#fcfbf9] hover:border-charcoal/20 transition-all shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto">
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </motion.div>

      {/* Main Content Area */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-charcoal/5 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[4px_10px_30px_rgba(0,0,0,0.04)]">
        
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-charcoal/5 bg-[#fcfbf9]">
          <div className="relative w-full max-w-md group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 group-focus-within:text-terracotta transition-colors" />
            <input 
              type="text" 
              placeholder="Search by product name or SKU..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full bg-white border border-charcoal/10 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all shadow-sm" 
            />
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
                <Package className="w-8 h-8 text-charcoal/30" />
              </div>
              <h3 className="font-serif text-xl mb-2 text-charcoal">No Inventory Found</h3>
              <p className="text-sm text-charcoal/50 mb-6">We couldn't find any inventory records matching your search.</p>
              <button onClick={() => setSearch('')} className="text-xs uppercase tracking-widest font-bold text-terracotta hover:underline">Clear Search</button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-charcoal/50 border-b border-charcoal/5">
                  <th className="p-4 sm:p-6 font-medium">Product Details</th>
                  <th className="p-4 sm:p-6 font-medium">SKU</th>
                  <th className="p-4 sm:p-6 font-medium">Status</th>
                  <th className="p-4 sm:p-6 font-medium">Price</th>
                  <th className="p-4 sm:p-6 font-medium text-right">Adjust Stock</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((item) => {
                    const s = getStatus(item.status);
                    return (
                      <motion.tr 
                        layout 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                        key={item._id} 
                        className="border-b border-charcoal/5 hover:bg-[#fcfbf9] transition-colors group"
                      >
                        <td className="p-4 sm:p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-charcoal/5 overflow-hidden shrink-0 border border-charcoal/10 relative group-hover:shadow-md transition-shadow">
                              <img src={item.product?.image || '/prod-1.png'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-charcoal truncate max-w-[250px]">{item.productName || item.product?.name}</p>
                              {item.product?.category && <p className="text-[10px] text-charcoal/40 uppercase tracking-widest mt-1">{item.product.category}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 sm:p-6">
                          <span className="font-mono text-xs text-charcoal/60 bg-charcoal/5 px-2 py-1 rounded-md">{item.sku}</span>
                        </td>
                        <td className="p-4 sm:p-6">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border ${s.bg} ${s.color} ${s.border} shadow-sm`}>
                            <s.icon className="w-3.5 h-3.5" />{item.status}
                          </div>
                        </td>
                        <td className="p-4 sm:p-6 font-serif text-base text-charcoal">
                          {formatPKR(item.product?.price || 0)}
                        </td>
                        <td className="p-4 sm:p-6">
                          <div className="flex items-center justify-end gap-1">
                            <div className={`flex items-center bg-white border rounded-xl overflow-hidden shadow-sm transition-colors ${updating === item._id ? 'border-terracotta/30 opacity-70' : 'border-charcoal/10 hover:border-charcoal/20'}`}>
                              <button 
                                onClick={() => handleStockUpdate(item._id, item.availableStock - 1)}
                                disabled={updating === item._id || item.availableStock <= 0}
                                className="w-10 h-10 flex items-center justify-center text-charcoal/50 hover:bg-charcoal/5 hover:text-charcoal disabled:opacity-30 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              
                              <input
                                type="number" 
                                min="0"
                                value={item.availableStock}
                                onChange={(e) => handleStockUpdate(item._id, Number(e.target.value))}
                                disabled={updating === item._id}
                                className="w-14 h-10 text-center font-serif text-lg bg-transparent outline-none focus:bg-charcoal/5 transition-colors disabled:opacity-50"
                              />
                              
                              <button 
                                onClick={() => handleStockUpdate(item._id, item.availableStock + 1)}
                                disabled={updating === item._id}
                                className="w-10 h-10 flex items-center justify-center text-charcoal/50 hover:bg-charcoal/5 hover:text-charcoal disabled:opacity-30 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            {updating === item._id && (
                              <div className="w-4 h-4 ml-2 rounded-full border-2 border-terracotta/30 border-t-terracotta animate-spin" />
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
