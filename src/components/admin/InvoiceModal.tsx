import React from 'react';
import { motion } from 'framer-motion';
import { X, Printer } from 'lucide-react';
import { formatPKR } from '@/lib/api';

export default function InvoiceModal({ order, onClose }: { order: any, onClose: () => void }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm px-6 py-12">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#fcfbf9] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-full print:bg-white print:max-w-none print:shadow-none print:w-full print:h-full print:fixed print:inset-0 print:z-[300]">
        
        {/* Header - Hidden on print */}
        <div className="p-6 border-b border-charcoal/10 flex justify-between items-center bg-white print:hidden">
          <h3 className="font-serif text-2xl">Order Invoice</h3>
          <div className="flex gap-4">
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-lg text-xs uppercase tracking-widest font-medium hover:bg-terracotta transition-colors">
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
            <button onClick={onClose} className="text-charcoal/40 hover:text-terracotta"><X className="w-6 h-6" /></button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8 md:p-12 overflow-y-auto" id="invoice-content">
          <div className="flex justify-between items-start border-b border-charcoal/10 pb-8 mb-8">
            <div>
              <img src="/eloria-logo.png" alt="Eloria Skincare" className="h-10 md:h-14 mb-4 object-contain" />
              <p className="text-sm text-charcoal/60 font-light">Eloria Skincare<br/>Lahore, Pakistan</p>
            </div>
            <div className="text-right">
              <h2 className="font-serif text-2xl mb-2 text-terracotta">INVOICE</h2>
              <p className="text-sm text-charcoal/60"><strong>Order #:</strong> {order.orderId}</p>
              <p className="text-sm text-charcoal/60"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-sm text-charcoal/60"><strong>Status:</strong> {order.status}</p>
            </div>
          </div>

          <div className="flex justify-between border-b border-charcoal/10 pb-8 mb-8">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-2">Bill To</h3>
              <p className="text-sm font-medium">{order.customer?.name}</p>
              <p className="text-sm text-charcoal/60">{order.customer?.email}</p>
              <p className="text-sm text-charcoal/60">{order.customer?.phone}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-2">Ship To</h3>
              <p className="text-sm text-charcoal/60">{order.shippingAddress?.street}</p>
              <p className="text-sm text-charcoal/60">{order.shippingAddress?.city}, {order.shippingAddress?.zip}</p>
              <p className="text-sm text-charcoal/60">{order.shippingAddress?.country}</p>
            </div>
          </div>

          <table className="w-full text-left border-collapse mb-8">
            <thead>
              <tr className="border-b border-charcoal/20 text-xs uppercase tracking-widest text-charcoal/40">
                <th className="py-3 font-bold">Item Description</th>
                <th className="py-3 font-bold text-center">Qty</th>
                <th className="py-3 font-bold text-right">Price</th>
                <th className="py-3 font-bold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: any, i: number) => (
                <tr key={i} className="border-b border-charcoal/10">
                  <td className="py-4">
                    <p className="font-medium text-sm">{item.productName}</p>
                  </td>
                  <td className="py-4 text-center text-sm text-charcoal/70">{item.quantity}</td>
                  <td className="py-4 text-right text-sm text-charcoal/70">{formatPKR(item.price)}</td>
                  <td className="py-4 text-right font-medium text-sm">{formatPKR(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end border-t-2 border-charcoal/20 pt-6 mt-6">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm text-charcoal/70">
                <span>Subtotal</span>
                <span>{formatPKR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-charcoal/70">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : formatPKR(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-lg font-serif pt-3 border-t border-charcoal/10 text-charcoal">
                <span>Total</span>
                <span>{formatPKR(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-xs text-charcoal/40">
            <p>Payment Method: Cash on Delivery</p>
            <p>Thank you for choosing Eloria Skincare.</p>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}
