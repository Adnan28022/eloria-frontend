"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, Edit2, Trash2, Package, Tag, ArrowRight, Gift } from "lucide-react";
import { adminApi, formatPKR } from "@/lib/api";
import toast from "react-hot-toast";
import BundleModal from "@/components/admin/BundleModal";
import { motion, AnimatePresence } from "framer-motion";

export default function BundlesPage() {
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBundle, setEditingBundle] = useState<any>(null);

  const fetchBundles = async () => {
    try {
      const res = await adminApi.getBundles();
      setBundles(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch bundles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBundles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bundle?")) return;
    try {
      await adminApi.deleteBundle(id);
      toast.success("Bundle deleted");
      fetchBundles();
    } catch (err) {
      toast.error("Failed to delete bundle");
    }
  };

  const filteredBundles = bundles.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <Gift className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-4xl text-charcoal">Bundles & Kits</h1>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-charcoal/60 text-sm max-w-xl">
            Group products into money-saving bundles to increase average order value. These will be highlighted on the storefront.
          </motion.p>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setEditingBundle(null); setShowModal(true); }}
          className="bg-charcoal text-ivory px-6 py-3.5 rounded-2xl flex items-center gap-2 hover:bg-terracotta transition-all shadow-lg hover:shadow-terracotta/20 font-bold tracking-widest uppercase text-xs"
        >
          <Plus className="w-4 h-4" />
          Create Bundle
        </motion.button>
      </div>

      {/* Toolbar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-4 rounded-3xl shadow-sm border border-charcoal/5 flex flex-col md:flex-row gap-4 items-center justify-between relative z-10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search bundles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all"
          />
        </div>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-charcoal/20 border-t-terracotta rounded-full" />
        </div>
      ) : filteredBundles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-charcoal/5">
          <div className="w-20 h-20 bg-[#fcfbf9] rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-charcoal/20" />
          </div>
          <h3 className="font-serif text-2xl text-charcoal mb-2">No bundles found</h3>
          <p className="text-charcoal/50 text-sm">Create your first product bundle to boost sales.</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBundles.map((bundle) => (
            <motion.div key={bundle._id} variants={item} className="bg-white rounded-3xl overflow-hidden border border-charcoal/5 shadow-sm hover:shadow-xl hover:border-terracotta/20 transition-all group">
              
              {/* Card Image Header */}
              <div className="h-48 relative bg-[#fcfbf9] overflow-hidden">
                <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${bundle.isActive ? 'bg-emerald-500 text-white' : 'bg-charcoal/60 text-white'}`}>
                    {bundle.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <h3 className="font-serif text-2xl text-white leading-tight">{bundle.name}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-6">
                
                {/* Price Section */}
                <div className="flex items-center justify-between p-4 bg-terracotta/5 rounded-2xl border border-terracotta/10">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-terracotta" />
                    <span className="text-xs font-bold uppercase tracking-widest text-terracotta/80">Price</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-terracotta">{formatPKR(bundle.price)}</div>
                    {bundle.compareAtPrice && <div className="text-xs text-charcoal/40 line-through">Was {formatPKR(bundle.compareAtPrice)}</div>}
                  </div>
                </div>

                {/* Products List */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 flex items-center gap-1.5"><Package className="w-3.5 h-3.5"/> Included Products ({bundle.products?.length || 0})</h4>
                  <div className="space-y-2">
                    {bundle.products?.slice(0, 3).map((p: any) => (
                      <div key={p._id} className="flex items-center gap-3">
                        <img src={p.image || '/prod-1.png'} className="w-8 h-8 rounded-lg object-cover bg-charcoal/5" alt="" />
                        <span className="text-sm font-medium text-charcoal truncate flex-1">{p.name}</span>
                      </div>
                    ))}
                    {(bundle.products?.length || 0) > 3 && (
                      <div className="text-xs text-terracotta font-medium pl-11">+ {(bundle.products?.length || 0) - 3} more products</div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button onClick={() => { setEditingBundle(bundle); setShowModal(true); }} className="flex-1 py-3 bg-[#fcfbf9] border border-charcoal/10 rounded-xl text-xs font-bold uppercase tracking-widest text-charcoal hover:bg-charcoal hover:text-ivory transition-colors">Edit</button>
                  <button onClick={() => handleDelete(bundle._id)} className="w-12 h-12 flex items-center justify-center rounded-xl border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <BundleModal
            bundle={editingBundle}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              fetchBundles();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
