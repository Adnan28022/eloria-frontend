"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { adminApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    adminApi.getCategories()
      .then(res => setCategories(res.data.data))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.target as HTMLFormElement);
    try {
      const res = await adminApi.createCategory({
        name: fd.get("name"),
        slug: (fd.get("name") as string).toLowerCase().replace(/\s+/g, '-'),
        description: fd.get("description"),
      });
      setCategories([...categories, res.data.data]);
      toast.success('Category added');
      setAddModal(false);
    } catch {
      toast.error('Failed to add category');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await adminApi.deleteCategory(deleteModal._id);
      setCategories(categories.filter(c => c._id !== deleteModal._id));
      toast.success('Category deleted');
      setDeleteModal(null);
    } catch {
      toast.error('Failed to delete');
    } finally { setSubmitting(false); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.target as HTMLFormElement);
    try {
      const res = await adminApi.updateCategory(editModal._id, {
        name: fd.get("name"),
        slug: (fd.get("name") as string).toLowerCase().replace(/\s+/g, '-'),
        description: fd.get("description"),
      });
      setCategories(categories.map(c => c._id === editModal._id ? res.data.data : c));
      toast.success('Category updated');
      setEditModal(null);
    } catch {
      toast.error('Failed to update category');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl mb-2">Categories</h1>
          <p className="text-charcoal/60 font-light text-sm">Organize your products into collections.</p>
        </div>
        <button onClick={() => setAddModal(true)} className="bg-charcoal text-ivory px-6 py-3 rounded-lg text-xs uppercase tracking-widest font-medium hover:bg-terracotta transition-colors shadow-lg flex items-center justify-center gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-charcoal/5 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-charcoal/40 text-sm">Loading categories...</div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-[#fcfbf9] text-[10px] uppercase tracking-widest text-charcoal/50 border-b border-charcoal/10">
                  <th className="p-4 font-medium">Category Name</th>
                  <th className="p-4 font-medium">Slug</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-charcoal/40 text-sm">No categories found.</td></tr>
                ) : categories.map((cat) => (
                  <tr key={cat._id} className="border-b border-charcoal/5 hover:bg-charcoal/[0.02] transition-colors group">
                    <td className="p-4 font-medium text-sm">{cat.name}</td>
                    <td className="p-4 text-sm text-charcoal/70">{cat.slug}</td>
                    <td className="p-4 text-sm text-charcoal/70">{cat.description || '-'}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button onClick={() => setEditModal(cat)} className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteModal(cat)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {addModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm px-6">
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-charcoal/10 flex justify-between items-center bg-[#fcfbf9]">
              <h3 className="font-serif text-2xl">Add Category</h3>
              <button onClick={() => setAddModal(false)} className="text-charcoal/40 hover:text-terracotta"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6">
              <form id="add-cat-form" onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">Name</label>
                  <input name="name" required className="w-full mt-1 border border-charcoal/10 rounded-lg py-2 px-3 text-sm focus:border-terracotta outline-none" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">Description</label>
                  <textarea name="description" className="w-full mt-1 border border-charcoal/10 rounded-lg py-2 px-3 text-sm focus:border-terracotta outline-none" rows={3} />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-charcoal/10 flex justify-end gap-3 bg-[#fcfbf9]">
              <button onClick={() => setAddModal(false)} className="px-6 py-2 border border-charcoal/10 rounded-lg text-xs uppercase tracking-widest font-medium hover:bg-charcoal/5">Cancel</button>
              <button type="submit" form="add-cat-form" disabled={submitting} className="px-6 py-2 bg-charcoal text-white rounded-lg text-xs uppercase tracking-widest font-medium hover:bg-terracotta disabled:opacity-60">
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm px-6">
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-charcoal/10 flex justify-between items-center bg-[#fcfbf9]">
              <h3 className="font-serif text-2xl">Edit Category</h3>
              <button onClick={() => setEditModal(null)} className="text-charcoal/40 hover:text-terracotta"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6">
              <form id="edit-cat-form" onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">Name</label>
                  <input name="name" defaultValue={editModal.name} required className="w-full mt-1 border border-charcoal/10 rounded-lg py-2 px-3 text-sm focus:border-terracotta outline-none" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">Description</label>
                  <textarea name="description" defaultValue={editModal.description} className="w-full mt-1 border border-charcoal/10 rounded-lg py-2 px-3 text-sm focus:border-terracotta outline-none" rows={3} />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-charcoal/10 flex justify-end gap-3 bg-[#fcfbf9]">
              <button onClick={() => setEditModal(null)} className="px-6 py-2 border border-charcoal/10 rounded-lg text-xs uppercase tracking-widest font-medium hover:bg-charcoal/5">Cancel</button>
              <button type="submit" form="edit-cat-form" disabled={submitting} className="px-6 py-2 bg-charcoal text-white rounded-lg text-xs uppercase tracking-widest font-medium hover:bg-terracotta disabled:opacity-60">
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm px-6">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white p-8 rounded-2xl max-w-sm w-full shadow-2xl">
            <h3 className="font-serif text-2xl mb-4 text-red-600">Delete Category</h3>
            <p className="text-charcoal/70 mb-6 text-sm">Delete <strong>{deleteModal.name}</strong>? This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModal(null)} className="px-4 py-2 border border-charcoal/10 rounded-lg text-sm hover:bg-charcoal/5">Cancel</button>
              <button onClick={handleDelete} disabled={submitting} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-60">
                {submitting ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
