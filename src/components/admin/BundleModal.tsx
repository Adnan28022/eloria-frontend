"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Upload, CheckCircle2, Image as ImageIcon, Tag, LayoutList, Eye, Percent, Package } from "lucide-react";
import { adminApi, formatPKR } from "@/lib/api";
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
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [discount, setDiscount] = useState<string>(bundle?.discount || "");

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

  // Auto calculate price from selected products
  const selectedProducts = useMemo(
    () => products.filter(p => formData.products.includes(p._id)),
    [products, formData.products]
  );

  const originalTotal = useMemo(
    () => selectedProducts.reduce((sum, p) => sum + parseFloat(p.price || 0), 0),
    [selectedProducts]
  );

  const discountPercent = parseFloat(discount) || 0;
  const discountedPrice = discountPercent > 0
    ? Math.round(originalTotal * (1 - discountPercent / 100))
    : originalTotal;
  const savings = originalTotal - discountedPrice;

  // Auto-fill price when products change or discount changes
  useEffect(() => {
    if (originalTotal > 0) {
      setFormData(prev => ({
        ...prev,
        price: discountedPrice > 0 ? String(discountedPrice) : prev.price,
        compareAtPrice: originalTotal > 0 ? String(originalTotal) : prev.compareAtPrice
      }));
    }
  }, [discountedPrice, originalTotal]);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, name, slug: !bundle ? generateSlug(name) : prev.slug }));
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
      products: prev.products.includes(id)
        ? prev.products.filter((pid: string) => pid !== id)
        : [...prev.products, id]
    }));
  };

  return (
    <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl flex flex-col max-h-[92vh] overflow-hidden border border-charcoal/5"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:px-8 border-b border-charcoal/5 bg-[#fcfbf9] shrink-0">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal">{bundle ? "Edit Bundle" : "Create New Bundle"}</h2>
            <p className="text-xs text-charcoal/50 mt-1 font-medium">Group products together with auto-calculated pricing.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Preview Toggle */}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "form" ? "preview" : "form")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === "preview"
                  ? "bg-terracotta text-white shadow-md"
                  : "bg-charcoal/5 text-charcoal hover:bg-charcoal/10"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {activeTab === "preview" ? "Back to Edit" : "Live Preview"}
            </button>
            <button onClick={onClose} className="p-3 text-charcoal/40 hover:bg-white hover:shadow-sm rounded-full transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

            <AnimatePresence mode="wait">
              {activeTab === "form" ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 hide-scrollbar"
                >
                  {/* Name + Status */}
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Bundle Name *</label>
                      <input required type="text" value={formData.name} onChange={handleNameChange}
                        className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all shadow-sm"
                        placeholder="e.g. Glowing Skin Kit" />
                    </div>
                    <div className="w-1/4 space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Status</label>
                      <select value={formData.isActive.toString()} onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                        className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-terracotta transition-all shadow-sm cursor-pointer font-medium">
                        <option value="true">Active</option>
                        <option value="false">Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Slug * (URL-friendly)</label>
                    <input required type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-terracotta transition-all shadow-sm font-mono text-xs"
                      placeholder="glowing-skin-kit" />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Description *</label>
                    <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-terracotta transition-all shadow-sm resize-none h-20"
                      placeholder="Describe the bundle benefits..." />
                  </div>

                  {/* Auto Price Calculator */}
                  <div className="p-5 rounded-2xl bg-terracotta/5 border border-terracotta/10 space-y-4">
                    <div className="flex items-center gap-2 text-terracotta mb-1">
                      <Tag className="w-4 h-4" />
                      <h3 className="font-serif text-lg leading-none">Smart Pricing</h3>
                    </div>

                    {/* Discount Percent Input */}
                    <div className="flex gap-4 items-end">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-terracotta/70">
                          <Percent className="w-3 h-3 inline mr-1" />Discount % (applied on sum of products)
                        </label>
                        <input
                          type="number" min="0" max="100" value={discount}
                          onChange={e => setDiscount(e.target.value)}
                          className="w-full bg-white border border-terracotta/20 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-terracotta font-bold shadow-sm"
                          placeholder="e.g. 20 (for 20% off)" />
                      </div>
                      {originalTotal > 0 && (
                        <div className="flex-1 bg-white rounded-xl p-3 border border-terracotta/20">
                          <p className="text-[9px] uppercase tracking-widest text-charcoal/40 mb-1">Auto Calculated</p>
                          <p className="text-charcoal/50 text-xs line-through">{formatPKR(originalTotal)}</p>
                          <p className="text-terracotta font-bold text-lg">{formatPKR(discountedPrice)}</p>
                          {savings > 0 && <p className="text-green-600 text-[10px] font-bold">Save {formatPKR(savings)}</p>}
                        </div>
                      )}
                    </div>

                    {/* Manual Price Override */}
                    <div className="flex gap-4">
                      <div className="w-1/2 space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-terracotta/70">Bundle Price (Rs) *</label>
                        <input required type="number" min="0" value={formData.price}
                          onChange={e => setFormData({ ...formData, price: e.target.value })}
                          className="w-full bg-white border border-terracotta/20 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-terracotta text-charcoal font-bold shadow-sm"
                          placeholder="Auto-filled from discount" />
                      </div>
                      <div className="w-1/2 space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-terracotta/70">Compare At (Rs)</label>
                        <input type="number" min="0" value={formData.compareAtPrice}
                          onChange={e => setFormData({ ...formData, compareAtPrice: e.target.value })}
                          className="w-full bg-white border border-terracotta/20 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-terracotta text-charcoal font-medium shadow-sm"
                          placeholder="Auto-filled from products sum" />
                      </div>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Main Image *</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                        <input required type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                          className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-terracotta transition-all shadow-sm"
                          placeholder="URL or click upload..." />
                      </div>
                      <label className="bg-charcoal text-ivory px-4 rounded-xl flex items-center justify-center cursor-pointer hover:bg-terracotta transition-colors shadow-sm shrink-0">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          if (!e.target.files?.length) return;
                          const toastId = toast.loading("Uploading image...");
                          try {
                            const res = await adminApi.uploadImages([e.target.files[0]]);
                            setFormData(prev => ({ ...prev, image: res.data.urls[0] }));
                            toast.success("Image uploaded", { id: toastId });
                          } catch { toast.error("Upload failed", { id: toastId }); }
                        }} />
                      </label>
                    </div>
                    {formData.image && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 rounded-xl overflow-hidden border border-charcoal/10 shadow-sm">
                        <img src={formData.image} alt="Preview" className="w-full h-32 object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* Live Preview Panel */
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 overflow-y-auto p-6 sm:p-8 hide-scrollbar"
                >
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-charcoal/50 mb-4">Live Bundle Preview</h3>
                  <div className="bg-[#fcfbf9] rounded-2xl border border-charcoal/10 overflow-hidden shadow-lg max-w-sm mx-auto">
                    {formData.image ? (
                      <img src={formData.image} alt={formData.name} className="w-full h-52 object-cover" />
                    ) : (
                      <div className="w-full h-52 bg-charcoal/5 flex items-center justify-center">
                        <Package className="w-12 h-12 text-charcoal/20" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h2 className="font-serif text-xl text-charcoal">{formData.name || "Bundle Name"}</h2>
                          <p className="text-xs text-charcoal/50 mt-1 line-clamp-2">{formData.description || "Bundle description will appear here..."}</p>
                        </div>
                        {formData.isActive ? (
                          <span className="bg-green-100 text-green-700 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-md">Active</span>
                        ) : (
                          <span className="bg-charcoal/10 text-charcoal/50 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-md">Draft</span>
                        )}
                      </div>

                      <div className="flex items-end gap-3 mb-4">
                        {formData.price && <span className="font-serif text-2xl text-terracotta">{formatPKR(parseFloat(formData.price))}</span>}
                        {formData.compareAtPrice && parseFloat(formData.compareAtPrice) > parseFloat(formData.price) && (
                          <span className="text-charcoal/40 text-sm line-through">{formatPKR(parseFloat(formData.compareAtPrice))}</span>
                        )}
                        {discountPercent > 0 && (
                          <span className="bg-terracotta text-white text-[9px] font-bold px-2 py-1 rounded-md">{discountPercent}% OFF</span>
                        )}
                      </div>

                      {selectedProducts.length > 0 && (
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-charcoal/40 mb-2 font-bold">Includes {selectedProducts.length} products</p>
                          <div className="space-y-1.5">
                            {selectedProducts.map(p => (
                              <div key={p._id} className="flex items-center gap-2">
                                <img src={p.image || '/prod-1.png'} className="w-7 h-7 rounded-md object-cover" alt="" />
                                <span className="text-xs text-charcoal truncate flex-1">{p.name}</span>
                                <span className="text-[10px] text-charcoal/50 shrink-0">{formatPKR(p.price)}</span>
                              </div>
                            ))}
                          </div>
                          {savings > 0 && (
                            <div className="mt-3 bg-green-50 text-green-700 rounded-lg p-2 text-xs font-bold text-center">
                              Customer saves {formatPKR(savings)} with this bundle!
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right Column: Product Selection */}
            <div className="w-full md:w-[360px] bg-[#fcfbf9] border-l border-charcoal/5 flex flex-col shrink-0">
              <div className="p-5 border-b border-charcoal/5 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-serif text-lg text-charcoal flex items-center gap-2">
                    <LayoutList className="w-4 h-4 text-terracotta" /> Include Products
                  </h3>
                  <p className="text-[10px] text-charcoal/50 font-medium mt-0.5">
                    {formData.products.length} selected
                    {originalTotal > 0 && ` · Sum: ${formatPKR(originalTotal)}`}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-1.5 hide-scrollbar">
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
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                          isSelected ? 'bg-white border-terracotta shadow-sm' : 'bg-transparent border-transparent hover:bg-white hover:border-charcoal/5'
                        }`}
                      >
                        <input type="checkbox" className="hidden" checked={isSelected} onChange={() => handleProductToggle(p._id)} />
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border shrink-0 ${isSelected ? 'bg-terracotta border-terracotta' : 'border-charcoal/20 bg-white'}`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-charcoal/5 overflow-hidden shrink-0">
                          <img src={p.image || '/prod-1.png'} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className={`text-sm font-semibold truncate ${isSelected ? 'text-terracotta' : 'text-charcoal'}`}>{p.name}</span>
                          <span className="text-[10px] uppercase tracking-widest text-charcoal/40">{formatPKR(p.price)}</span>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>

              {originalTotal > 0 && (
                <div className="p-4 bg-terracotta/5 border-t border-terracotta/10 shrink-0">
                  <div className="flex justify-between text-xs text-charcoal/60 mb-1">
                    <span>Products Total</span>
                    <span className="font-bold">{formatPKR(originalTotal)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-xs text-terracotta mb-1">
                      <span>Discount ({discountPercent}%)</span>
                      <span className="font-bold">- {formatPKR(savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-charcoal border-t border-terracotta/10 pt-2 mt-1">
                    <span>Bundle Price</span>
                    <span className="text-terracotta">{formatPKR(discountedPrice)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
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
