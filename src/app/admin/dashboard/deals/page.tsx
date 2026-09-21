"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Trash2, Copy, RefreshCw, Tag, Calendar, ShoppingBag, Percent, Hash, CheckCircle2, XCircle, Zap } from "lucide-react";
import { adminApi, formatPKR } from "@/lib/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as any, stiffness: 300, damping: 24 } }
};

function generateCode(length = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function PromosPage() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({
    code: "",
    type: "Percentage",
    value: "",
    minOrder: "",
    expiryDate: "",
    isActive: true,
  });

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getDiscounts();
      setDiscounts(res.data.data);
    } catch { toast.error("Failed to load promos"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDiscounts(); }, []);

  const handleGenerate = () => setForm(prev => ({ ...prev, code: generateCode() }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.value) return toast.error("Fill all required fields");
    setFormLoading(true);
    try {
      await adminApi.createDiscount({
        code: form.code.toUpperCase(),
        type: form.type,
        value: form.value,
        expiryDate: form.expiryDate || "Never",
        isActive: form.isActive,
        minOrder: form.minOrder ? parseFloat(form.minOrder) : 0,
      });
      toast.success("Promo code created!");
      setForm({ code: "", type: "Percentage", value: "", minOrder: "", expiryDate: "", isActive: true });
      setShowForm(false);
      fetchDiscounts();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create promo");
    } finally { setFormLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promo code?")) return;
    try {
      await adminApi.deleteDiscount(id);
      setDiscounts(prev => prev.filter(d => d._id !== id));
      toast.success("Promo deleted");
    } catch { toast.error("Failed to delete"); }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied: ${code}`);
  };

  const filtered = discounts.filter(d =>
    d.code?.toLowerCase().includes(search.toLowerCase())
  );

  const isExpired = (expiry: string) => {
    if (!expiry || expiry === "Never") return false;
    return new Date() > new Date(expiry);
  };

  return (
    <div className="p-6 md:p-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl mb-2 text-charcoal">Promo Codes</h1>
          <p className="text-charcoal/60 font-light text-sm">Generate and manage discount codes for your customers.</p>
        </div>
        <button
          onClick={() => { setShowForm(true); handleGenerate(); }}
          className="bg-charcoal text-ivory px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-terracotta transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Promo Code
        </button>
      </div>

      {/* Create Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg border border-charcoal/5"
            >
              <div className="flex items-center justify-between p-6 border-b border-charcoal/5 bg-[#fcfbf9] rounded-t-[2rem]">
                <div>
                  <h2 className="font-serif text-2xl text-charcoal">Create Promo Code</h2>
                  <p className="text-xs text-charcoal/50 mt-1">Generate a new discount code for customers.</p>
                </div>
                <button onClick={() => setShowForm(false)} className="p-3 text-charcoal/40 hover:bg-white rounded-full transition-all">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Promo Code Generator */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60 flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Promo Code *
                  </label>
                  <div className="flex gap-2">
                    <input
                      required
                      type="text"
                      value={form.code}
                      onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      className="flex-1 bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-terracotta font-mono font-bold tracking-widest uppercase shadow-sm"
                      placeholder="e.g. ELORIA20"
                    />
                    <button
                      type="button"
                      onClick={handleGenerate}
                      className="bg-charcoal/5 hover:bg-charcoal/10 text-charcoal px-4 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Auto
                    </button>
                  </div>
                </div>

                {/* Type + Value */}
                <div className="flex gap-4">
                  <div className="w-2/5 space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Discount Type *</label>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-terracotta shadow-sm cursor-pointer"
                    >
                      <option value="Percentage">Percentage (%)</option>
                      <option value="Fixed Amount">Fixed Amount (Rs)</option>
                    </select>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">
                      {form.type === "Percentage" ? "Discount % *" : "Amount (Rs) *"}
                    </label>
                    <div className="relative">
                      {form.type === "Percentage"
                        ? <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal/40" />
                        : <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-charcoal/40 font-bold">Rs</span>
                      }
                      <input
                        required type="number" min="1" max={form.type === "Percentage" ? "100" : undefined}
                        value={form.value}
                        onChange={e => setForm({ ...form, value: e.target.value })}
                        className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-terracotta shadow-sm font-bold"
                        placeholder={form.type === "Percentage" ? "e.g. 20" : "e.g. 500"}
                      />
                    </div>
                  </div>
                </div>

                {/* Minimum Order */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60 flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3" /> Minimum Order Amount (Rs)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-charcoal/40 font-bold">Rs</span>
                    <input
                      type="number" min="0"
                      value={form.minOrder}
                      onChange={e => setForm({ ...form, minOrder: e.target.value })}
                      className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-terracotta shadow-sm"
                      placeholder="0 = no minimum"
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Expiry Date (leave blank = never expires)
                  </label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-terracotta shadow-sm"
                  />
                </div>

                {/* Status */}
                <div className="flex items-center justify-between bg-[#fcfbf9] rounded-xl p-4 border border-charcoal/5">
                  <div>
                    <p className="text-sm font-bold text-charcoal">Active Status</p>
                    <p className="text-[10px] text-charcoal/50">Deactivate to temporarily disable this code</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, isActive: !form.isActive })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${form.isActive ? "bg-terracotta" : "bg-charcoal/20"}`}
                  >
                    <motion.div animate={{ x: form.isActive ? 24 : 2 }} className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm" />
                  </button>
                </div>

                {/* Preview */}
                {form.code && form.value && (
                  <div className="bg-gradient-to-br from-terracotta/10 to-terracotta/5 border border-terracotta/20 rounded-xl p-4">
                    <p className="text-[9px] uppercase tracking-widest text-terracotta/70 font-bold mb-2">Preview</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono font-bold text-lg text-charcoal tracking-widest">{form.code}</p>
                        <p className="text-xs text-charcoal/60 mt-1">
                          {form.type === "Percentage" ? `${form.value}% off` : `Rs ${parseFloat(form.value || "0").toLocaleString()} off`}
                          {form.minOrder ? ` · Min order ${formatPKR(parseFloat(form.minOrder))}` : ""}
                          {form.expiryDate ? ` · Expires ${new Date(form.expiryDate).toLocaleDateString("en-PK")}` : " · Never expires"}
                        </p>
                      </div>
                      <Tag className="w-6 h-6 text-terracotta" />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-charcoal/60 hover:bg-charcoal/5 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={formLoading} className="flex-1 py-3 bg-charcoal text-ivory rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-terracotta transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                    {formLoading && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full" />}
                    Create Promo
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative mb-8 max-w-xs">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search promo codes..."
          className="w-full bg-white border border-charcoal/10 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all shadow-sm"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Codes", value: discounts.length, icon: Tag, color: "text-charcoal" },
          { label: "Active", value: discounts.filter(d => d.isActive && !isExpired(d.expiryDate)).length, icon: CheckCircle2, color: "text-green-600" },
          { label: "Expired", value: discounts.filter(d => isExpired(d.expiryDate)).length, icon: Calendar, color: "text-red-500" },
          { label: "Inactive", value: discounts.filter(d => !d.isActive).length, icon: XCircle, color: "text-charcoal/40" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 border border-charcoal/5 shadow-sm">
            <div className={`flex items-center gap-2 ${stat.color} mb-1`}>
              <stat.icon className="w-4 h-4" />
              <p className="text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
            </div>
            <p className="font-serif text-3xl text-charcoal">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Promo List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-charcoal/20 border-t-terracotta rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-charcoal/5">
          <Zap className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
          <h3 className="font-serif text-xl mb-2 text-charcoal">No Promo Codes</h3>
          <p className="text-sm text-charcoal/50 mb-6">Create your first promo code to offer discounts.</p>
          <button onClick={() => { setShowForm(true); handleGenerate(); }} className="bg-charcoal text-ivory px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-terracotta transition-all shadow-lg inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Promo Code
          </button>
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(d => {
            const expired = isExpired(d.expiryDate);
            const statusOk = d.isActive && !expired;
            return (
              <motion.div
                key={d._id}
                variants={itemVariants}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${statusOk ? "border-charcoal/5" : "border-charcoal/5 opacity-70"}`}
              >
                {/* Coupon top bar */}
                <div className={`h-1.5 w-full ${statusOk ? "bg-gradient-to-r from-terracotta to-amber-400" : "bg-charcoal/10"}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${statusOk ? "bg-terracotta/10" : "bg-charcoal/5"}`}>
                        <Tag className={`w-4 h-4 ${statusOk ? "text-terracotta" : "text-charcoal/30"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-lg text-charcoal tracking-widest">{d.code}</span>
                          <button onClick={() => handleCopy(d.code)} className="text-charcoal/30 hover:text-terracotta transition-colors">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                          expired ? "bg-red-100 text-red-600"
                          : !d.isActive ? "bg-charcoal/10 text-charcoal/40"
                          : "bg-green-100 text-green-700"
                        }`}>
                          {expired ? "Expired" : d.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(d._id)} className="text-charcoal/30 hover:text-red-500 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs text-charcoal/60">
                    <div className="flex items-center gap-2">
                      <Percent className="w-3 h-3 text-terracotta shrink-0" />
                      <span>
                        {d.type === "Percentage" ? `${d.value}% discount` : `Rs ${parseFloat(d.value || 0).toLocaleString()} flat off`}
                      </span>
                    </div>
                    {d.minOrder > 0 && (
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-3 h-3 text-terracotta shrink-0" />
                        <span>Min order: {formatPKR(d.minOrder)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-terracotta shrink-0" />
                      <span>{d.expiryDate && d.expiryDate !== "Never"
                        ? `Expires: ${new Date(d.expiryDate).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}`
                        : "Never expires"}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
