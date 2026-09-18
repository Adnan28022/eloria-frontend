"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, CheckCircle2, Image as ImageIcon, Tag, Calendar, LayoutList } from "lucide-react";
import { adminApi } from "@/lib/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface DealModalProps {
  deal?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DealModal({ deal, onClose, onSuccess }: DealModalProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: deal?.title || "",
    description: deal?.description || "",
    bannerImage: deal?.bannerImage || "",
    discountType: deal?.discountType || "percent",
    discountValue: deal?.discountValue || "",
    startDate: deal?.startDate ? new Date(deal.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: deal?.endDate ? new Date(deal.endDate).toISOString().split('T')[0] : "",
    status: deal?.status || "Active",
    products: deal?.products?.map((p: any) => p._id) || []
  });

  useEffect(() => {
    adminApi.getProducts().then(res => setProducts(res.data.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.discountValue || !formData.startDate || !formData.endDate) {
      return toast.error("Please fill all required fields");
    }
    
    setLoading(true);
    try {
      if (deal) {
        await adminApi.updateDeal(deal._id, formData);
        toast.success("Deal updated");
      } else {
        await adminApi.createDeal(formData);
        toast.success("Deal created");
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save deal");
    } finally {
      setLoading(false);
    }
  };

  const handleProductToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(id) ? prev.products.filter((pid: string) => pid !== id) : [...prev.products, id]
    }));
  };

  const toggleAllProducts = () => {
    if (formData.products.length === products.length) {
      setFormData(prev => ({ ...prev, products: [] }));
    } else {
      setFormData(prev => ({ ...prev, products: products.map(p => p._id) }));
    }
  };

  return (
    <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden border border-charcoal/5"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:px-8 border-b border-charcoal/5 bg-[#fcfbf9] shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal">{deal ? "Edit Deal" : "Create New Deal"}</h2>
            <p className="text-xs text-charcoal/50 mt-1 font-medium">Configure flash sales, discounts, and promotional banners.</p>
          </div>
          <button onClick={onClose} className="p-3 text-charcoal/40 hover:bg-white hover:shadow-sm rounded-full transition-all relative z-10"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Left Column: Form Details */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 hide-scrollbar relative">
              
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Deal Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all shadow-sm" placeholder="e.g. Summer Sale 2026" />
                </div>
                <div className="w-1/3 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all shadow-sm cursor-pointer font-medium">
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Ended">Ended</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Description (Optional)</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all shadow-sm resize-none h-24" placeholder="Brief description about the promotion..." />
              </div>

              <div className="p-5 rounded-2xl bg-terracotta/5 border border-terracotta/10 space-y-4">
                <div className="flex items-center gap-2 text-terracotta mb-2">
                  <Tag className="w-4 h-4" />
                  <h3 className="font-serif text-lg leading-none">Discount Configuration</h3>
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2 space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-terracotta/70">Discount Type</label>
                    <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value as any})} className="w-full bg-white border border-terracotta/20 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-terracotta cursor-pointer font-medium text-charcoal">
                      <option value="percent">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (Rs)</option>
                    </select>
                  </div>
                  <div className="w-1/2 space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-terracotta/70">Discount Value *</label>
                    <input required type="number" min="0" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} className="w-full bg-white border border-terracotta/20 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-terracotta text-charcoal font-bold" placeholder="e.g. 20" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-1/2 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60 flex items-center gap-1"><Calendar className="w-3 h-3"/> Start Date *</label>
                  <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-terracotta transition-all shadow-sm font-medium" />
                </div>
                <div className="w-1/2 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60 flex items-center gap-1"><Calendar className="w-3 h-3"/> End Date *</label>
                  <input required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-terracotta transition-all shadow-sm font-medium" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Banner Image</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                    <input type="text" value={formData.bannerImage} onChange={e => setFormData({...formData, bannerImage: e.target.value})} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all shadow-sm" placeholder="URL or click upload..." />
                  </div>
                  <label className="bg-charcoal text-ivory px-4 rounded-xl flex items-center justify-center cursor-pointer hover:bg-terracotta transition-colors shadow-sm shrink-0">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      if (!e.target.files?.length) return;
                      const file = e.target.files[0];
                      const toastId = toast.loading("Uploading image...");
                      try {
                        const res = await adminApi.uploadImages([file]);
                        setFormData(prev => ({ ...prev, bannerImage: res.data.urls[0] }));
                        toast.success("Image uploaded", { id: toastId });
                      } catch (err) {
                        toast.error("Upload failed", { id: toastId });
                      }
                    }} />
                  </label>
                </div>
                {formData.bannerImage && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 rounded-xl overflow-hidden border border-charcoal/10 shadow-sm relative group bg-[#fcfbf9]">
                    <img src={formData.bannerImage} alt="Banner Preview" className="w-full h-32 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium tracking-widest uppercase backdrop-blur-sm">Banner Preview</div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Column: Product Selection */}
            <div className="w-full md:w-[400px] bg-[#fcfbf9] border-l border-charcoal/5 flex flex-col shrink-0">
              <div className="p-6 border-b border-charcoal/5 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-serif text-lg text-charcoal flex items-center gap-2"><LayoutList className="w-4 h-4 text-terracotta"/> Included Products</h3>
                  <p className="text-[10px] text-charcoal/50 font-medium mt-1">{formData.products.length} selected</p>
                </div>
                <button type="button" onClick={toggleAllProducts} className="text-[10px] uppercase tracking-widest font-bold text-terracotta hover:underline bg-terracotta/10 px-3 py-1.5 rounded-lg">
                  {formData.products.length === products.length ? "Deselect All" : "Select All"}
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2 hide-scrollbar">
                {products.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-charcoal/40">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-6 h-6 border-2 border-charcoal/20 border-t-terracotta rounded-full mb-3" />
                    <p className="text-xs uppercase tracking-widest font-bold">Loading Products...</p>
                  </div>
                ) : (
                  products.map(p => {
                    const isSelected = formData.products.includes(p._id);
                    return (
                      <label 
                        key={p._id} 
                        className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all border ${
                          isSelected ? 'bg-white border-terracotta shadow-[0_4px_15px_rgba(194,142,121,0.1)]' : 'bg-transparent border-transparent hover:bg-white hover:border-charcoal/5 hover:shadow-sm'
                        }`}
                      >
                        <input type="checkbox" className="hidden" checked={isSelected} onChange={() => handleProductToggle(p._id)} />
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${isSelected ? 'bg-terracotta border-terracotta' : 'border-charcoal/20 bg-white'}`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-charcoal/5 overflow-hidden shrink-0">
                          <img src={p.image || '/prod-1.png'} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className={`text-sm font-semibold truncate transition-colors ${isSelected ? 'text-terracotta' : 'text-charcoal'}`}>{p.name}</span>
                          <span className="text-[10px] uppercase tracking-widest text-charcoal/40 mt-0.5">{p.category?.name || 'Uncategorized'}</span>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
              <div className="p-4 bg-terracotta/5 border-t border-terracotta/10 text-[10px] text-terracotta/80 text-center font-medium leading-relaxed shrink-0">
                If no products are selected, this deal will act as a store-wide promotion.
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-charcoal/5 bg-white flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-charcoal/60 hover:bg-charcoal/5 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-8 py-3 bg-charcoal text-ivory rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-terracotta transition-all shadow-lg hover:shadow-terracotta/30 disabled:opacity-50 flex items-center gap-2">
              {loading && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full" />}
              {deal ? "Save Changes" : "Publish Deal"}
            </button>
          </div>
        </form>

      </motion.div>
    </div>
  );
}
