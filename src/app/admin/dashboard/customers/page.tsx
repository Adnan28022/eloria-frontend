"use client";

import React, { useEffect, useState } from "react";
import { Search, Mail, Eye, Trash2, Download } from "lucide-react";
import { adminApi, formatPKR } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi.getCustomers()
      .then(res => setCustomers(res.data.data))
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    setCustomers(prev => prev.filter(c => c._id !== id));
    try { await adminApi.deleteCustomer(id); toast.success('Customer removed'); }
    catch { toast.error('Failed to delete customer'); }
  };

  const handleExport = () => {
    if (customers.length === 0) {
      toast.error('No customers to export');
      return;
    }
    const headers = ["ID", "Name", "Email", "Phone", "Orders Count", "Total Spent", "Status", "Joined Date"];
    const rows = customers.map(c => [
      c._id,
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone || ''}"`,
      c.ordersCount,
      c.totalSpent,
      c.status,
      new Date(c.createdAt).toISOString().split('T')[0]
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Eloria_Customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Customers exported successfully');
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl mb-2">Customers</h1>
          <p className="text-charcoal/60 font-light text-sm">Manage customer accounts and view their purchase history.</p>
        </div>
        <button onClick={handleExport} className="bg-charcoal text-ivory px-6 py-3 rounded-lg text-xs uppercase tracking-widest font-medium hover:bg-terracotta transition-colors shadow-lg flex items-center justify-center gap-2 shrink-0">
          <Download className="w-4 h-4" /> Export Excel/CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-charcoal/5 overflow-hidden">
        <div className="p-4 border-b border-charcoal/10 bg-[#fcfbf9]">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white border border-charcoal/10 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:border-terracotta transition-colors" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-charcoal/5 rounded-lg animate-pulse" />)}</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfbf9] text-[10px] uppercase tracking-widest text-charcoal/50 border-b border-charcoal/10">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Orders</th>
                  <th className="p-4 font-medium">Total Spent</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-charcoal/40 text-sm">
                    {customers.length === 0 ? 'No customers yet. They appear automatically when orders are placed.' : `No customers found matching "${search}"`}
                  </td></tr>
                ) : filtered.map((customer) => (
                  <tr key={customer._id} className="border-b border-charcoal/5 hover:bg-charcoal/[0.02] transition-colors group">
                    <td className="p-4">
                      <p className="text-sm font-medium">{customer.name}</p>
                      <div className="flex items-center gap-1 text-[10px] text-charcoal/50 mt-1"><Mail className="w-3 h-3" />{customer.email}</div>
                    </td>
                    <td className="p-4 text-sm font-medium">{customer.ordersCount}</td>
                    <td className="p-4 font-serif text-base">{formatPKR(customer.totalSpent)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${customer.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-charcoal/5 text-charcoal/60 border-charcoal/10'}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(customer._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
