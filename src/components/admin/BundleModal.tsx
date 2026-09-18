"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, CheckCircle2, Image as ImageIcon, Tag, LayoutList } from "lucide-react";
import { adminApi } from "@/lib/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface BundleModalProps {
  bundle?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BundleModal({ bundle, onClose, onSuccess }: BundleModalProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: bundle?.name || "",
    slug: bundle?.slug || "",
    description: bundle?.description || "",
    price: bundle?.price || "",
    compareAtPrice: bundle?.compareAtPrice || "",
    image: bundle?.image || "",
    isActive: bundle?.isActive !== undefined ? bundle.isActive : true,
    products: bundle?.products?.map((p: any) => p._id) || []
  });

  useEffect(() => {
    adminApi.getProducts().then(res => setProducts(res.data.data)).catch(() => {});
  }, []);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: !bundle ? generateSlug(name) : prev.slug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.price || !formData.image) {
      return toast.error("Please fill all required fields");
    }
    if (formData.products.length === 0) {
      return toast.error("Please select at least one product for the bundle");
    }
    
    setLoading(true);
    try {
      if (bundle) {
        await adminApi.updateBundle(bundle._id, formData);
        toast.success("Bundle updated");
      } else {
        await adminApi.createBundle(formData);
        toast.success("Bundle created");
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save bundle");
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
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal">{bundle ? "Edit Bundle" : "Create New Bundle"}</h2>
            <p className="text-xs text-charcoal/50 mt-1 font-medium">Group multiple products together for a special price.</p>
          </div>
          <button onClick={onClose} className="p-3 text-charcoal/40 hover:bg-white hover:shadow-sm rounded-full transition-all relative z-10"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Left Column: Form Details */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 hide-scrollbar relative">
              
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Bundle Name *</label>
                  <input required type="text" value={formData.name} onChange={handleNameChange} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all shadow-sm" placeholder="e.g. Glowing Skin Kit" />
                </div>
                <div className="w-1/3 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Status</label>
                  <select value={formData.isActive.toString()} onChange={e => setFormData({...formData, isActive: e.target.value === 'true'})} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all shadow-sm cursor-pointer font-medium">
                    <option value="true">Active</option>
                    <option value="false">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Slug * (URL-friendly)</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-terracotta transition-all shadow-sm font-mono text-xs" placeholder="glowing-skin-kit" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Description *</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all shadow-sm resize-none h-24" placeholder="Describe the bundle benefits..." />
              </div>

              <div className="p-5 rounded-2xl bg-terracotta/5 border border-terracotta/10 space-y-4">
                <div className="flex items-center gap-2 text-terracotta mb-2">
                  <Tag className="w-4 h-4" />
                  <h3 className="font-serif text-lg leading-none">Pricing</h3>
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2 space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-terracotta/70">Bundle Price (Rs) *</label>
                    <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white border border-terracotta/20 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-terracotta text-charcoal font-bold shadow-sm" placeholder="e.g. 5000" />
                  </div>
                  <div className="w-1/2 space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-terracotta/70">Compare At Price (Rs)</label>
                    <input type="number" min="0" value={formData.compareAtPrice} onChange={e => setFormData({...formData, compareAtPrice: e.target.value})} className="w-full bg-white border border-terracotta/20 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-terracotta text-charcoal font-medium shadow-sm" placeholder="e.g. 7500 (Original sum)" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Main Image *</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                    <input required type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all shadow-sm" placeholder="URL or click upload..." />
                  </div>
                  <label className="bg-charcoal text-ivory px-4 rounded-xl flex items-center justify-center cursor-pointer hover:bg-terracotta transition-colors shadow-sm shrink-0">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      if (!e.target.files?.length) return;
                      const file = e.target.files[0];
                      const toastId = toast.loading("Uploading image...");
                      try {
                        const res = await adminApi.uploadImages([file]);
                        setFormData(prev => ({ ...prev, image: res.data.urls[0] }));
                        toast.success("Image uploaded", { id: toastId });
                      } catch (err) {
                        toast.error("Upload failed", { id: toastId });
                      }
                    }} />
                  </label>
                </div>
                {formData.image && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 rounded-xl overflow-hidden border border-charcoal/10 shadow-sm relative group bg-[#fcfbf9]">
                    <img src={formData.image} alt="Preview" className="w-full h-32 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
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
                          <span className="text-[10px] uppercase tracking-widest text-charcoal/40 mt-0.5">Rs {p.price}</span>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
              <div className="p-4 bg-terracotta/5 border-t border-terracotta/10 text-[10px] text-terracotta/80 text-center font-medium leading-relaxed shrink-0">
                You must select at least one product for this bundle to be valid.
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-charcoal/5 bg-white flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-charcoal/60 hover:bg-charcoal/5 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-8 py-3 bg-charcoal text-ivory rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-terracotta transition-all shadow-lg hover:shadow-terracotta/30 disabled:opacity-50 flex items-center gap-2">
              {loading && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full" />}
              {bundle ? "Save Changes" : "Create Bundle"}
            </button>
          </div>
        </form>

      </motion.div>
    </div>
  );
}
