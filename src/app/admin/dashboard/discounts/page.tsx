"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Tag, Calendar, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchDiscounts = async () => {
    try {
      const res = await adminApi.getDiscounts();
      setDiscounts(res.data.data);
    } catch { toast.error('Failed to load discounts'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDiscounts(); }, []);

  const handleDelete = async (id: string) => {
    setDiscounts(prev => prev.filter(d => d._id !== id));
    try { await adminApi.deleteDiscount(id); toast.success('Discount deleted'); }
    catch { toast.error('Failed to delete'); fetchDiscounts(); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.target as HTMLFormElement);
    try {
      const res = await adminApi.createDiscount({
        code: (fd.get("code") as string).toUpperCase(),
        type: fd.get("type"),
        value: fd.get("value"),
        expiryDate: fd.get("expiry") || 'Never',
      });
      toast.success('Discount created!');
      setDiscounts(prev => [res.data.data, ...prev]);
      setAddModal(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create discount');
    } finally { setSubmitting(false); }
  };

  const filtered = discounts.filter(d => d.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl mb-2">Discounts & Promotions</h1>
          <p className="text-charcoal/60 font-light text-sm">Manage discount codes and promotions.</p>
        </div>
        <button onClick={() => setAddModal(true)} className="bg-charcoal text-ivory px-6 py-3 rounded-lg text-xs uppercase tracking-widest font-medium hover:bg-terracotta transition-colors shadow-lg flex items-center justify-center gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Create Discount
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-charcoal/5 overflow-hidden">
        <div className="p-4 border-b border-charcoal/10 bg-[#fcfbf9]">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input type="text" placeholder="Search discount codes..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white border border-charcoal/10 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:border-terracotta transition-colors" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-charcoal/5 rounded-lg animate-pulse" />)}</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfbf9] text-[10px] uppercase tracking-widest text-charcoal/50 border-b border-charcoal/10">
                  <th className="p-4 font-medium">Code</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Value</th>
                  <th className="p-4 font-medium">Uses</th>
                  <th className="p-4 font-medium">Expiry</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-charcoal/40 text-sm">No discount codes yet.</td></tr>
                ) : filtered.map((item) => (
                  <tr key={item._id} className="border-b border-charcoal/5 hover:bg-charcoal/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-charcoal/5 flex items-center justify-center"><Tag className="w-4 h-4 text-charcoal/60" /></div>
                        <div>
                          <p className="font-bold text-sm tracking-wider">{item.code}</p>
                          <p className="text-[10px] text-charcoal/50 uppercase tracking-widest mt-0.5">{item.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${item.isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-charcoal/5 text-charcoal/60 border-charcoal/10'}`}>
                        {item.isActive ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td className="p-4 font-serif text-base">{item.value}</td>
                    <td className="p-4 text-sm text-charcoal/70">{item.usesCount} times</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-charcoal/70"><Calendar className="w-4 h-4 text-charcoal/40" />{item.expiryDate}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button onClick={() => handleDelete(item._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {addModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm px-6 py-12">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-charcoal/10 flex justify-between items-center bg-[#fcfbf9]">
                <h3 className="font-serif text-2xl">Create Discount</h3>
                <button onClick={() => setAddModal(false)} className="text-charcoal/40 hover:text-terracotta"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6">
                <form id="add-discount-form" onSubmit={handleAdd} className="space-y-4">
                  <div><label className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">Code</label><input name="code" placeholder="e.g. SUMMER20" required className="w-full mt-1 border border-charcoal/10 rounded-lg py-2 px-3 text-sm focus:border-terracotta outline-none uppercase" /></div>
                  <div><label className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">Type</label><select name="type" className="w-full mt-1 border border-charcoal/10 rounded-lg py-2 px-3 text-sm focus:border-terracotta outline-none bg-white"><option value="Percentage">Percentage</option><option value="Fixed Amount">Fixed Amount</option></select></div>
                  <div><label className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">Value (e.g. 20% or Rs 500)</label><input name="value" required className="w-full mt-1 border border-charcoal/10 rounded-lg py-2 px-3 text-sm focus:border-terracotta outline-none" /></div>
                  <div><label className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">Expiry</label><input type="date" name="expiry" className="w-full mt-1 border border-charcoal/10 rounded-lg py-2 px-3 text-sm focus:border-terracotta outline-none" /></div>
                </form>
              </div>
              <div className="p-6 border-t border-charcoal/10 flex justify-end gap-3 bg-[#fcfbf9]">
                <button onClick={() => setAddModal(false)} className="px-6 py-2 border border-charcoal/10 rounded-lg text-xs uppercase tracking-widest font-medium hover:bg-charcoal/5">Cancel</button>
                <button type="submit" form="add-discount-form" disabled={submitting} className="px-6 py-2 bg-charcoal text-white rounded-lg text-xs uppercase tracking-widest font-medium hover:bg-terracotta disabled:opacity-60">{submitting ? 'Creating...' : 'Create'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
