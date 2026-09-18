"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cartTotal, cart, cartCount, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const orderData = {
      customer: {
        name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || '',
      },
      shippingAddress: {
        street: formData.get('street') as string,
        city: formData.get('city') as string,
        zip: formData.get('zip') as string,
        country: 'Pakistan',
      },
      items: cart.map(item => ({
        productId: item.product._id || item.product.id,
        productName: item.product.name,
        image: item.product.image || item.product.images?.[0],
        price: item.product.price,
        quantity: item.quantity,
      })),
      subtotal: cartTotal,
      shipping: 0, // Free shipping for all products
      total: cartTotal,
    };

    try {
      const { publicApi } = await import('@/lib/api');
      await publicApi.createOrder(orderData);
      setIsSuccess(true);
      if (clearCart) clearCart();
    } catch (error) {
      import('react-hot-toast').then(({ default: toast }) => {
        toast.error('Failed to place order');
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-6 md:px-12 max-w-6xl mx-auto w-full">
        <Link href="/cart" className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-charcoal/60 hover:text-terracotta transition-colors mb-10">
          <ChevronLeft className="w-4 h-4" /> Back to Cart
        </Link>
        
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#fcfbf9] p-8 md:p-10 rounded-2xl border border-charcoal/5 shadow-sm">
              <form onSubmit={handlePlaceOrder} className="flex flex-col gap-10">
                {/* Contact Info */}
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl border-b border-charcoal/10 pb-4">Contact Information</h2>
                  <input name="email" required type="email" placeholder="Email Address" className="w-full bg-white border border-charcoal/10 p-4 outline-none focus:border-terracotta transition-colors rounded-lg placeholder:text-charcoal/40 shadow-sm" />
                  <input name="phone" type="tel" placeholder="Phone Number" className="w-full bg-white border border-charcoal/10 p-4 outline-none focus:border-terracotta transition-colors rounded-lg placeholder:text-charcoal/40 shadow-sm" />
                </div>

                {/* Shipping Info */}
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl border-b border-charcoal/10 pb-4">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input name="firstName" required type="text" placeholder="First Name" className="w-full bg-white border border-charcoal/10 p-4 outline-none focus:border-terracotta transition-colors rounded-lg placeholder:text-charcoal/40 shadow-sm" />
                    <input name="lastName" required type="text" placeholder="Last Name" className="w-full bg-white border border-charcoal/10 p-4 outline-none focus:border-terracotta transition-colors rounded-lg placeholder:text-charcoal/40 shadow-sm" />
                  </div>
                  <input name="street" required type="text" placeholder="Street Address" className="w-full bg-white border border-charcoal/10 p-4 outline-none focus:border-terracotta transition-colors rounded-lg placeholder:text-charcoal/40 shadow-sm" />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="city" required type="text" placeholder="City" className="w-full bg-white border border-charcoal/10 p-4 outline-none focus:border-terracotta transition-colors rounded-lg placeholder:text-charcoal/40 shadow-sm" />
                    <input name="zip" required type="text" placeholder="Postal Code" className="w-full bg-white border border-charcoal/10 p-4 outline-none focus:border-terracotta transition-colors rounded-lg placeholder:text-charcoal/40 shadow-sm" />
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl border-b border-charcoal/10 pb-4">Payment</h2>
                  <div className="border border-charcoal/10 p-6 space-y-4 bg-white rounded-xl shadow-sm">
                    <div className="text-sm font-medium text-charcoal/60 mb-2">Cash on Delivery (COD)</div>
                    <p className="text-xs text-charcoal/50 font-light">Payment will be collected at the time of delivery.</p>
                  </div>
                </div>

                <button type="submit" disabled={submitting || cart.length === 0} className="w-full bg-charcoal text-ivory py-5 rounded-xl uppercase tracking-[0.2em] text-xs font-medium hover:bg-terracotta hover:-translate-y-0.5 transition-all shadow-xl disabled:opacity-50">
                  {submitting ? 'Placing Order...' : `Place Order — ${(cartTotal).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#fcfbf9] p-8 md:p-10 rounded-2xl sticky top-32 border border-charcoal/5 shadow-sm">
              <h2 className="font-serif text-2xl mb-8">Summary</h2>
              
              <div className="flex flex-col gap-4 mb-8 max-h-[40vh] overflow-y-auto pr-4">
                {cart.map((item) => (
                  <div key={item.product._id || item.product.id} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-[#f4efe6] rounded overflow-hidden shrink-0">
                      <img src={item.product.image || item.product.images?.[0] || "/prod-1.png"} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex justify-between items-center text-sm">
                      <div>
                        <p className="font-serif">{item.product.name}</p>
                        <p className="text-charcoal/50 text-[10px] uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p>{(item.product.price * item.quantity).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8 text-sm text-charcoal/80 border-t border-charcoal/10 pt-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>{(cartTotal).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-terracotta font-medium uppercase tracking-widest text-[10px]">Free</span>
                </div>
              </div>

              <div className="pt-6 border-t border-charcoal/10 flex justify-between items-center">
                <span className="font-serif text-xl">Total</span>
                <span className="font-serif text-2xl">{(cartTotal).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal (SweetAlert Replacement) */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm px-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring" as any as any, damping: 25, stiffness: 300 }}
              className="bg-ivory p-10 md:p-16 rounded-3xl max-w-lg w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-terracotta" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" as any as any, bounce: 0.5 }}
                className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
              
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">Order Confirmed!</h2>
              <p className="text-charcoal/70 mb-8 font-light">
                Thank you for choosing Eloria. Your beautifully curated skincare ritual is being prepared and will be shipped shortly.
              </p>
              
              <button
                onClick={() => {
                  setIsSuccess(false);
                  router.push("/");
                }}
                className="bg-charcoal text-ivory px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-medium hover:bg-terracotta transition-colors shadow-lg w-full"
              >
                Return to Home
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
