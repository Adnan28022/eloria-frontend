"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, X, Download, Image as ImageIcon, Tag, Package, LayoutGrid, LayoutList } from "lucide-react";
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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState<any>(null);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [addFiles, setAddFiles] = useState<File[]>([]);
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [viewMode, setViewMode] = useState<'list'|'grid'>('list');

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        adminApi.getProducts(),
        adminApi.getCategories()
      ]);
      setProducts(prodRes.data.data);
      setCategories(catRes.data.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await adminApi.deleteProduct(deleteModal._id);
      toast.success('Product deleted successfully');
      setProducts(prev => prev.filter(p => p._id !== deleteModal._id));
      setDeleteModal(null);
    } catch { toast.error('Failed to delete product'); }
    finally { setSubmitting(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.target as HTMLFormElement);
    
    let imageUrls: string[] = [];
    
    if (addFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      setSubmitting(false);
      return;
    }

    try {
      if (addFiles.length > 0) {
        const uploadRes = await adminApi.uploadImages(addFiles);
        imageUrls = uploadRes.data.data.urls;
      }
      
      const payload: any = {
        name: fd.get("name"),
        tagline: fd.get("tagline"),
        description: fd.get("description") || "New product",
        category: fd.get("category"),
        price: Number(fd.get("price")),
        originalPrice: fd.get("originalPrice") ? Number(fd.get("originalPrice")) : undefined,
        stock: Number(fd.get("stock")),
        skinType: fd.get("skinType") || "All Skin Types",
        howToUse: fd.get("howToUse") || "",
        benefits: fd.get("benefits") ? fd.get("benefits")?.toString().split(',').map(s=>s.trim()).filter(Boolean) : [],
        ingredients: fd.get("ingredients") ? fd.get("ingredients")?.toString().split(',').map(s=>s.trim()).filter(Boolean) : [],
        isFeatured: fd.get("isFeatured") === "on",
        isBestSeller: fd.get("isBestSeller") === "on",
        isNew: fd.get("isNew") === "on",
      };
      
      if (imageUrls.length > 0) {
        payload.image = imageUrls[0];
        payload.images = imageUrls;
      }
      
      const res = await adminApi.createProduct(payload);
      toast.success('Product added successfully!');
      setProducts(prev => [res.data.data, ...prev]);
      setAddModal(false);
      setAddFiles([]);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add product');
    } finally { setSubmitting(false); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.target as HTMLFormElement);
    
    let imageUrls = editModal.images || (editModal.image ? [editModal.image] : []);
    
    if (editFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      setSubmitting(false);
      return;
    }

    try {
      if (editFiles.length > 0) {
        const uploadRes = await adminApi.uploadImages(editFiles);
        imageUrls = uploadRes.data.data.urls; 
      }

      const payload: any = {
        name: fd.get("name"),
        tagline: fd.get("tagline"),
        description: fd.get("description"),
        category: fd.get("category"),
        price: Number(fd.get("price")),
        originalPrice: fd.get("originalPrice") ? Number(fd.get("originalPrice")) : undefined,
        stock: Number(fd.get("stock")),
        skinType: fd.get("skinType") || "All Skin Types",
        howToUse: fd.get("howToUse") || "",
        benefits: fd.get("benefits") ? fd.get("benefits")?.toString().split(',').map(s=>s.trim()).filter(Boolean) : [],
        ingredients: fd.get("ingredients") ? fd.get("ingredients")?.toString().split(',').map(s=>s.trim()).filter(Boolean) : [],
        isFeatured: fd.get("isFeatured") === "on",
        isBestSeller: fd.get("isBestSeller") === "on",
        isNew: fd.get("isNew") === "on",
      };
      
      if (imageUrls.length > 0) {
        payload.image = imageUrls[0];
        payload.images = imageUrls;
      }
      
      const res = await adminApi.updateProduct(editModal._id, payload);
      toast.success('Product updated successfully!');
      setProducts(prev => prev.map(p => p._id === editModal._id ? res.data.data : p));
      setEditModal(null);
      setEditFiles([]);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update product');
    } finally { setSubmitting(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, currentFiles: File[], setFiles: React.Dispatch<React.SetStateAction<File[]>>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    if (currentFiles.length + newFiles.length > 5) {
      toast.error('Maximum 5 images allowed total');
      return;
    }
    setFiles(prev => [...prev, ...newFiles]);
    e.target.value = ''; // Reset
  };

  const removeFile = (index: number, setFiles: React.Dispatch<React.SetStateAction<File[]>>) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleExport = () => {
    if (products.length === 0) return toast.error('No products to export');
    const headers = ["ID", "Name", "Slug", "Tagline", "Category", "Price", "Original Price", "Stock", "Best Seller", "New", "Featured"];
    const rows = products.map(p => [
      p._id, `"${p.name}"`, p.slug, `"${p.tagline || ''}"`, p.category, p.price, p.originalPrice || '', p.stock, p.isBestSeller, p.isNew, p.isFeatured
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Eloria_Products_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export successful');
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-10 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl mb-2 text-charcoal">Product Catalog</h1>
          <p className="text-charcoal/60 font-light text-sm">Manage your inventory, pricing, and showcase details.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="bg-white text-charcoal border border-charcoal/10 px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-[#fcfbf9] hover:border-charcoal/20 transition-all shadow-sm flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setAddModal(true)} className="bg-charcoal text-ivory px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-terracotta transition-all shadow-lg hover:shadow-terracotta/30 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> New Product
          </button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-charcoal/5 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[4px_10px_30px_rgba(0,0,0,0.04)]">
        
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-charcoal/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#fcfbf9]">
          <div className="relative w-full sm:max-w-md group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 group-focus-within:text-terracotta transition-colors" />
            <input 
              type="text" 
              placeholder="Search products by name..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full bg-white border border-charcoal/10 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all shadow-sm" 
            />
          </div>
          
          <div className="flex items-center gap-2 bg-charcoal/5 p-1 rounded-xl shrink-0 self-end sm:self-auto">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-charcoal' : 'text-charcoal/50 hover:text-charcoal'}`}>
              <LayoutList className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-charcoal' : 'text-charcoal/50 hover:text-charcoal'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data View */}
        <div className="p-0 sm:p-2 bg-white">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-charcoal/5 rounded-2xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-charcoal/5 flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-charcoal/30" />
              </div>
              <h3 className="font-serif text-xl mb-2 text-charcoal">No Products Found</h3>
              <p className="text-sm text-charcoal/50 mb-6">We couldn't find any products matching your search.</p>
              <button onClick={() => setSearch('')} className="text-xs uppercase tracking-widest font-bold text-terracotta hover:underline">Clear Search</button>
            </div>
          ) : viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-charcoal/50 border-b border-charcoal/5">
                    <th className="p-4 sm:p-6 font-medium">Product Details</th>
                    <th className="p-4 sm:p-6 font-medium">Category</th>
                    <th className="p-4 sm:p-6 font-medium">Price</th>
                    <th className="p-4 sm:p-6 font-medium">Stock</th>
                    <th className="p-4 sm:p-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((product) => (
                      <motion.tr 
                        layout 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                        key={product._id} 
                        className="border-b border-charcoal/5 hover:bg-[#fcfbf9] transition-colors group"
                      >
                        <td className="p-4 sm:p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-charcoal/5 overflow-hidden shrink-0 border border-charcoal/10 relative group-hover:shadow-md transition-shadow">
                              <img src={product.image || '/prod-1.png'} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-charcoal truncate">{product.name}</p>
                              <p className="text-[10px] text-charcoal/40 uppercase tracking-widest mt-1 truncate max-w-[200px]">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 sm:p-6">
                          <span className="inline-flex items-center gap-1.5 bg-[#fcfbf9] border border-charcoal/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-charcoal/70">
                            <Tag className="w-3 h-3" /> {product.category}
                          </span>
                        </td>
                        <td className="p-4 sm:p-6">
                          <div className="font-serif text-base text-charcoal">{formatPKR(product.price)}</div>
                          {product.originalPrice && <div className="text-[10px] line-through text-charcoal/40">{formatPKR(product.originalPrice)}</div>}
                        </td>
                        <td className="p-4 sm:p-6">
                          <div className={`inline-flex px-2 py-1 rounded text-xs font-bold ${product.stock > 10 ? 'bg-green-50 text-green-700' : product.stock > 0 ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
                            {product.stock} {product.stock === 0 ? 'Out of Stock' : 'Units'}
                          </div>
                        </td>
                        <td className="p-4 sm:p-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setEditModal(product)} className="p-2 text-charcoal/50 hover:text-charcoal hover:bg-white hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-charcoal/10"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteModal(product)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              <AnimatePresence>
                {filtered.map((product) => (
                  <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={product._id} className="bg-white border border-charcoal/10 rounded-2xl p-4 flex flex-col hover:shadow-xl transition-all duration-300 group">
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-charcoal/5 mb-4">
                      <img src={product.image || '/prod-1.png'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button onClick={() => setEditModal(product)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-sm text-charcoal flex items-center justify-center hover:bg-white hover:scale-110 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteModal(product)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-sm text-red-500 flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-sm text-charcoal truncate pr-2">{product.name}</h3>
                        <span className="font-serif text-sm shrink-0">{formatPKR(product.price)}</span>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-charcoal/50 mb-3">{product.category}</p>
                    </div>
                    <div className={`mt-auto text-[10px] uppercase tracking-widest font-bold py-1.5 px-3 rounded-lg text-center ${product.stock > 10 ? 'bg-green-50 text-green-700' : product.stock > 0 ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
                      {product.stock} in stock
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {/* Delete Modal */}
        {deleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/80 backdrop-blur-sm px-6">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.2)] text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl mb-2 text-charcoal">Delete Product?</h3>
              <p className="text-charcoal/60 mb-8 text-sm px-2">Are you sure you want to delete <strong>{deleteModal.name}</strong>? This action cannot be reversed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModal(null)} className="flex-1 py-3 rounded-xl text-sm font-medium text-charcoal bg-charcoal/5 hover:bg-charcoal/10 transition-colors">Cancel</button>
                <button onClick={handleDelete} disabled={submitting} className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors shadow-lg shadow-red-600/20">
                  {submitting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Add / Edit Modals */}
        {(addModal || editModal) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/80 backdrop-blur-sm px-4 sm:px-6 py-6 sm:py-12">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-3xl w-full max-w-5xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-full">
              
              <div className="px-8 py-6 border-b border-charcoal/10 flex justify-between items-center bg-[#fcfbf9]">
                <div>
                  <h3 className="font-serif text-2xl text-charcoal">{addModal ? 'Create New Product' : 'Edit Product'}</h3>
                  <p className="text-xs text-charcoal/50 mt-1">{addModal ? 'Add a new item to your catalog' : `Updating ${editModal?.name}`}</p>
                </div>
                <button onClick={() => { setAddModal(false); setEditModal(null); setAddFiles([]); setEditFiles([]); }} className="w-10 h-10 rounded-full bg-white border border-charcoal/10 flex items-center justify-center text-charcoal/40 hover:text-terracotta hover:border-terracotta hover:shadow-sm transition-all"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-8 overflow-y-auto bg-white">
                <form id="product-form" onSubmit={addModal ? handleAdd : handleEdit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  
                  {/* Left Col: Primary Details */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-[#fcfbf9] p-6 rounded-2xl border border-charcoal/5 space-y-5">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-charcoal mb-2 flex items-center gap-2"><Tag className="w-4 h-4 text-terracotta" /> Basic Information</h4>
                      
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold block mb-1.5 ml-1">Product Name *</label>
                        <input name="name" defaultValue={editModal?.name} required placeholder="e.g. Luminous Glow Serum" className="w-full bg-white border border-charcoal/10 rounded-xl py-2.5 px-4 text-sm focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all" />
                      </div>
                      
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold block mb-1.5 ml-1">Short Tagline *</label>
                        <input name="tagline" defaultValue={editModal?.tagline} required placeholder="e.g. For radiant and hydrated skin" className="w-full bg-white border border-charcoal/10 rounded-xl py-2.5 px-4 text-sm focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all" />
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold block mb-1.5 ml-1">Category *</label>
                          <select name="category" defaultValue={editModal?.category || categories[0]?.slug} className="w-full bg-white border border-charcoal/10 rounded-xl py-2.5 px-4 text-sm focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all">
                            {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold block mb-1.5 ml-1">Inventory Stock *</label>
                          <input name="stock" type="number" defaultValue={editModal?.stock} required min="0" placeholder="0" className="w-full bg-white border border-charcoal/10 rounded-xl py-2.5 px-4 text-sm focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#fcfbf9] p-6 rounded-2xl border border-charcoal/5 space-y-5">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-charcoal mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4 text-terracotta" /> Pricing</h4>
                      
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold block mb-1.5 ml-1">Sale Price (PKR) *</label>
                          <input name="price" type="number" defaultValue={editModal?.price} required min="0" placeholder="e.g. 2500" className="w-full bg-white border border-charcoal/10 rounded-xl py-2.5 px-4 text-sm focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all font-serif" />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold block mb-1.5 ml-1">Original Price (Optional)</label>
                          <input name="originalPrice" type="number" defaultValue={editModal?.originalPrice} min="0" placeholder="e.g. 3000" className="w-full bg-white border border-charcoal/10 rounded-xl py-2.5 px-4 text-sm focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all font-serif text-charcoal/60" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#fcfbf9] p-6 rounded-2xl border border-charcoal/5 space-y-4">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-charcoal mb-2 flex items-center gap-2"><Tag className="w-4 h-4 text-terracotta" /> Product Status</h4>
                      
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="checkbox" name="isFeatured" defaultChecked={editModal?.isFeatured} className="peer appearance-none w-5 h-5 border-2 border-charcoal/20 rounded-md checked:bg-terracotta checked:border-terracotta transition-colors" />
                            <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-charcoal/70 group-hover:text-charcoal transition-colors uppercase tracking-wider mt-0.5">Featured</span>
                        </label>
                        
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="checkbox" name="isBestSeller" defaultChecked={editModal?.isBestSeller} className="peer appearance-none w-5 h-5 border-2 border-charcoal/20 rounded-md checked:bg-terracotta checked:border-terracotta transition-colors" />
                            <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-charcoal/70 group-hover:text-charcoal transition-colors uppercase tracking-wider mt-0.5">Best Seller</span>
                        </label>
                        
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="checkbox" name="isNew" defaultChecked={editModal?.isNew} className="peer appearance-none w-5 h-5 border-2 border-charcoal/20 rounded-md checked:bg-terracotta checked:border-terracotta transition-colors" />
                            <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-charcoal/70 group-hover:text-charcoal transition-colors uppercase tracking-wider mt-0.5">New Arrival</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right Col: Media & Desc */}
                  <div className="lg:col-span-5 space-y-6 flex flex-col">
                    <div className="bg-[#fcfbf9] p-6 rounded-2xl border border-charcoal/5">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-charcoal mb-4 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-terracotta" /> Media & Description</h4>
                      
                      <div className="mb-5">
                        <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold block mb-1.5 ml-1">Product Description *</label>
                        <textarea name="description" defaultValue={editModal?.description} required placeholder="Describe the product in detail..." className="w-full min-h-[100px] bg-white border border-charcoal/10 rounded-xl py-3 px-4 text-sm focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all resize-none"></textarea>
                      </div>

                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold block ml-1">Product Gallery</label>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">{addModal ? addFiles.length : editFiles.length}/5 Files</span>
                        </div>
                        
                        <div className="border-2 border-dashed border-charcoal/20 hover:border-terracotta transition-colors rounded-2xl p-6 text-center bg-white relative overflow-hidden group">
                          <input 
                            type="file" 
                            onChange={(e) => handleFileChange(e, addModal ? addFiles : editFiles, addModal ? setAddFiles : setEditFiles)} 
                            multiple accept=".jpg,.jpeg,.png,.webp,.jfif" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                          />
                          <div className="flex flex-col items-center gap-2 relative z-0">
                            <div className="w-10 h-10 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal/40 group-hover:bg-terracotta/10 group-hover:text-terracotta transition-colors">
                              <Plus className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-medium text-charcoal">Click or drag images here</p>
                            <p className="text-[10px] text-charcoal/40 uppercase tracking-widest">JPG, PNG, WEBP, JFIF</p>
                          </div>
                        </div>

                        {/* Previews */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {(addModal ? addFiles : editFiles).map((file, i) => (
                            <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-charcoal/10 group/img shadow-sm">
                              <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeFile(i, addModal ? setAddFiles : setEditFiles)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {editModal && editFiles.length === 0 && (editModal.images?.length > 0 || editModal.image) && (
                            <div className="flex flex-wrap gap-2 opacity-60 grayscale hover:grayscale-0 transition-all">
                              {(editModal.images || [editModal.image]).map((url: string, i: number) => (
                                <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-charcoal/10 shadow-sm relative group/img">
                                  <img src={url} alt="current" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-charcoal/50 text-white opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm text-[8px] font-bold uppercase text-center p-1">Current</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Full Width: Extra Details */}
                  <div className="lg:col-span-12 bg-[#fcfbf9] p-6 rounded-2xl border border-charcoal/5">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-charcoal mb-4 flex items-center gap-2"><LayoutList className="w-4 h-4 text-terracotta" /> Additional Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-5">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold block mb-1.5 ml-1">Skin Type</label>
                          <select name="skinType" defaultValue={editModal?.skinType || "All Skin Types"} className="w-full bg-white border border-charcoal/10 rounded-xl py-2.5 px-4 text-sm focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all">
                            <option value="All Skin Types">All Skin Types</option>
                            <option value="Dry Skin">Dry Skin</option>
                            <option value="Oily Skin">Oily Skin</option>
                            <option value="Combination Skin">Combination Skin</option>
                            <option value="Sensitive Skin">Sensitive Skin</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold block mb-1.5 ml-1">Key Benefits (Comma separated)</label>
                          <input name="benefits" defaultValue={editModal?.benefits?.join(', ')} placeholder="e.g. Hydrates, Brightens, Anti-aging" className="w-full bg-white border border-charcoal/10 rounded-xl py-2.5 px-4 text-sm focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all" />
                        </div>
                      </div>
                      <div className="space-y-5">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold block mb-1.5 ml-1">Ingredients (Comma separated)</label>
                          <input name="ingredients" defaultValue={editModal?.ingredients?.join(', ')} placeholder="e.g. Hyaluronic Acid, Vitamin C, Niacinamide" className="w-full bg-white border border-charcoal/10 rounded-xl py-2.5 px-4 text-sm focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold block mb-1.5 ml-1">How To Use</label>
                          <textarea name="howToUse" defaultValue={editModal?.howToUse} placeholder="Apply 2-3 drops on clean skin..." className="w-full min-h-[50px] bg-white border border-charcoal/10 rounded-xl py-2.5 px-4 text-sm focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all resize-none"></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                </form>
              </div>

              <div className="px-8 py-5 border-t border-charcoal/10 flex justify-end gap-3 bg-[#fcfbf9]">
                <button type="button" onClick={() => { setAddModal(false); setEditModal(null); setAddFiles([]); setEditFiles([]); }} className="px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-bold text-charcoal hover:bg-white hover:shadow-sm border border-transparent hover:border-charcoal/10 transition-all">Cancel</button>
                <button type="submit" form="product-form" disabled={submitting} className="px-8 py-3 bg-charcoal text-ivory rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-terracotta disabled:opacity-60 transition-all shadow-lg hover:shadow-terracotta/30 flex items-center gap-2">
                  {submitting && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full" />}
                  {submitting ? 'Saving...' : addModal ? 'Publish Product' : 'Save Changes'}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
