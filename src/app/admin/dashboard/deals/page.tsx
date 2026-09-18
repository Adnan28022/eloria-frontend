"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Trash2, Edit, Zap, Calendar, Tag, CheckCircle2 } from "lucide-react";
import { adminApi, formatPKR } from "@/lib/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import DealModal from "@/components/admin/DealModal";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any>(null);

  const fetchDeals = async () => {
    try {
      const res = await adminApi.getDeals();
      setDeals(res.data.data);
    } catch { toast.error("Failed to load deals"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDeals(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this deal?")) return;
    try {
      await adminApi.deleteDeal(id);
      setDeals(prev => prev.filter(d => d._id !== id));
      toast.success("Deal deleted");
    } catch { toast.error("Failed to delete deal"); }
  };

  const handleOpenEdit = (deal: any) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  const filtered = deals.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));

  const getStatusColor = (status: string) => {
    if (status === 'Active') return 'bg-green-50 text-green-600 border-green-100';
    if (status === 'Scheduled') return 'bg-blue-50 text-blue-600 border-blue-100';
    if (status === 'Ended') return 'bg-red-50 text-red-600 border-red-100';
    return 'bg-charcoal/5 text-charcoal border-charcoal/10';
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-10 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl mb-2 text-charcoal">Deals & Promos</h1>
          <p className="text-charcoal/60 font-light text-sm">Manage front-page flash sales and website deals.</p>
        </div>
        <button onClick={() => { setEditingDeal(null); setIsModalOpen(true); }} className="bg-charcoal text-ivory px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-terracotta transition-all shadow-lg hover:shadow-terracotta/30 flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Create Deal
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
              placeholder="Search deals..." 
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
              {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-charcoal/5 rounded-2xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-charcoal/5 flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-charcoal/30" />
              </div>
              <h3 className="font-serif text-xl mb-2 text-charcoal">No Deals Found</h3>
              <p className="text-sm text-charcoal/50 mb-6">Create a deal to start a flash sale on your website.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              <AnimatePresence>
                {filtered.map((deal) => (
                  <motion.div 
                    layout 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
                    key={deal._id} 
                    className="border border-charcoal/10 rounded-2xl overflow-hidden hover:border-terracotta/30 hover:shadow-xl transition-all group bg-white flex flex-col relative"
                  >
                    <div className="h-32 bg-charcoal/5 relative overflow-hidden">
                      <img src={deal.bannerImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={deal.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <h3 className="font-serif text-white text-lg leading-tight line-clamp-1">{deal.title}</h3>
                        <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-md border backdrop-blur-md shadow-sm ${getStatusColor(deal.status)}`}>{deal.status}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-xs text-charcoal/60 mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(deal.startDate).toLocaleDateString()} - {new Date(deal.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-charcoal/60 mb-4">
                        <Tag className="w-3.5 h-3.5" />
                        {deal.discountType === 'percent' ? `${deal.discountValue}% OFF` : `Flat ${formatPKR(deal.discountValue)} OFF`}
                      </div>
                      
                      <div className="mt-auto flex gap-2">
                        <button onClick={() => handleOpenEdit(deal)} className="flex-1 py-2 bg-charcoal/5 text-charcoal hover:bg-charcoal/10 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"><Edit className="w-3.5 h-3.5" /> Edit</button>
                        <button onClick={() => handleDelete(deal._id)} className="w-10 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <DealModal 
            deal={editingDeal} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={() => { setIsModalOpen(false); fetchDeals(); }} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
