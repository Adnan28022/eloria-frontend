"use client";

import React, { useState, Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronLeft, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPKR } from "@/lib/api";

function CheckoutContent() {
  const { cartTotal, cart, cartCount, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const couponCode = searchParams.get("coupon") || "";
  const discountAmount = Number(searchParams.get("discount")) || 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const validateForm = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
    const requiredFields = ['email', 'firstName', 'lastName', 'street', 'city', 'zip', 'phone'];
    
    requiredFields.forEach(field => {
      const value = formData.get(field) as string;
      if (!value || value.trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.get('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get('email') as string)) {
      newErrors['email'] = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    if (!validateForm(formData)) {
      import('react-hot-toast').then(({ default: toast }) => {
        toast.error('Please fix the errors in the form');
      });
      return;
    }

    setSubmitting(true);
    
    const orderData = {
      customer: {
        name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
      },
      shippingAddress: {
        street: formData.get('street') as string,
        city: formData.get('city') as string,
        zip: formData.get('zip') as string,
        country: 'Pakistan',
      },
      orderNotes: formData.get('orderNotes') as string || '',
      items: cart.map(item => ({
        productId: item.product._id || item.product.id,
        productName: item.product.name,
        image: item.product.image || item.product.images?.[0],
        price: item.product.price,
        quantity: item.quantity,
      })),
      subtotal: cartTotal,
      shipping: 0,
      discount: discountAmount,
      couponCode: couponCode || undefined,
      total: finalTotal,
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

      <main className="flex-grow pt-24 md:pt-32 pb-20 xl:pb-0 px-6 md:px-12 max-w-6xl mx-auto w-full">
        <Link href="/cart" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-charcoal/60 hover:text-terracotta transition-colors mb-8 md:mb-10">
          <ChevronLeft className="w-4 h-4" /> Back to Bag
        </Link>
        
        <div className="mb-10 md:mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 xl:gap-24">
          
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#fcfbf9] p-6 sm:p-8 md:p-10 rounded-2xl border border-charcoal/5 shadow-sm">
              <form onSubmit={handlePlaceOrder} className="flex flex-col gap-8 md:gap-10" noValidate>
                {/* Contact Info */}
                <div className="space-y-5 md:space-y-6">
                  <h2 className="font-serif text-xl sm:text-2xl border-b border-charcoal/10 pb-3 md:pb-4">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <input 
                        name="email" 
                        type="email" 
                        placeholder="Email Address" 
                        className={`w-full bg-white border p-3.5 sm:p-4 outline-none focus:border-terracotta transition-colors rounded-xl placeholder:text-charcoal/40 shadow-sm ${errors.email ? 'border-red-400 bg-red-50/30' : 'border-charcoal/10'}`} 
                      />
                      {errors.email && <p className="text-red-500 text-[10px] mt-1.5 ml-1">{errors.email}</p>}
                    </div>

                    <div>
                      <input 
                        name="phone" 
                        type="tel" 
                        placeholder="Phone Number (e.g. 03001234567)" 
                        className={`w-full bg-white border p-3.5 sm:p-4 outline-none focus:border-terracotta transition-colors rounded-xl placeholder:text-charcoal/40 shadow-sm ${errors.phone ? 'border-red-400 bg-red-50/30' : 'border-charcoal/10'}`} 
                      />
                      {errors.phone && <p className="text-red-500 text-[10px] mt-1.5 ml-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="space-y-5 md:space-y-6">
                  <h2 className="font-serif text-xl sm:text-2xl border-b border-charcoal/10 pb-3 md:pb-4">Shipping Address</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input 
                          name="firstName" 
                          type="text" 
                          placeholder="First Name" 
                          className={`w-full bg-white border p-3.5 sm:p-4 outline-none focus:border-terracotta transition-colors rounded-xl placeholder:text-charcoal/40 shadow-sm ${errors.firstName ? 'border-red-400 bg-red-50/30' : 'border-charcoal/10'}`} 
                        />
                        {errors.firstName && <p className="text-red-500 text-[10px] mt-1.5 ml-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <input 
                          name="lastName" 
                          type="text" 
                          placeholder="Last Name" 
                          className={`w-full bg-white border p-3.5 sm:p-4 outline-none focus:border-terracotta transition-colors rounded-xl placeholder:text-charcoal/40 shadow-sm ${errors.lastName ? 'border-red-400 bg-red-50/30' : 'border-charcoal/10'}`} 
                        />
                        {errors.lastName && <p className="text-red-500 text-[10px] mt-1.5 ml-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <input 
                        name="street" 
                        type="text" 
                        placeholder="Street Address, Apartment, suite, etc." 
                        className={`w-full bg-white border p-3.5 sm:p-4 outline-none focus:border-terracotta transition-colors rounded-xl placeholder:text-charcoal/40 shadow-sm ${errors.street ? 'border-red-400 bg-red-50/30' : 'border-charcoal/10'}`} 
                      />
                      {errors.street && <p className="text-red-500 text-[10px] mt-1.5 ml-1">{errors.street}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input 
                          name="city" 
                          type="text" 
                          placeholder="City" 
                          className={`w-full bg-white border p-3.5 sm:p-4 outline-none focus:border-terracotta transition-colors rounded-xl placeholder:text-charcoal/40 shadow-sm ${errors.city ? 'border-red-400 bg-red-50/30' : 'border-charcoal/10'}`} 
                        />
                        {errors.city && <p className="text-red-500 text-[10px] mt-1.5 ml-1">{errors.city}</p>}
                      </div>
                      <div>
                        <input 
                          name="zip" 
                          type="text" 
                          placeholder="Postal Code" 
                          className={`w-full bg-white border p-3.5 sm:p-4 outline-none focus:border-terracotta transition-colors rounded-xl placeholder:text-charcoal/40 shadow-sm ${errors.zip ? 'border-red-400 bg-red-50/30' : 'border-charcoal/10'}`} 
                        />
                        {errors.zip && <p className="text-red-500 text-[10px] mt-1.5 ml-1">{errors.zip}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-5 md:space-y-6">
                  <h2 className="font-serif text-xl sm:text-2xl border-b border-charcoal/10 pb-3 md:pb-4">Additional Information</h2>
                  <div>
                    <textarea 
                      name="orderNotes" 
                      placeholder="Order notes (optional) - e.g. special notes for delivery" 
                      rows={3}
                      className="w-full bg-white border border-charcoal/10 p-3.5 sm:p-4 outline-none focus:border-terracotta transition-colors rounded-xl placeholder:text-charcoal/40 shadow-sm resize-none" 
                    />
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-5 md:space-y-6">
                  <h2 className="font-serif text-xl sm:text-2xl border-b border-charcoal/10 pb-3 md:pb-4">Payment</h2>
                  <div className="border border-charcoal/20 p-5 sm:p-6 bg-[#FAF7F2] rounded-xl shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-terracotta"></div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-4 h-4 rounded-full border-4 border-terracotta flex items-center justify-center">
                        <div className="w-2 h-2 bg-terracotta rounded-full"></div>
                      </div>
                      <div className="text-sm font-semibold text-charcoal">Cash on Delivery (COD)</div>
                    </div>
                    <p className="text-xs text-charcoal/60 font-light ml-7">Payment will be collected at the time of delivery securely.</p>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting || cart.length === 0} 
                  className="w-full bg-charcoal text-ivory py-4 sm:py-5 rounded-xl uppercase tracking-[0.2em] text-[10px] sm:text-xs font-medium hover:bg-terracotta hover:-translate-y-0.5 transition-all shadow-xl disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-charcoal mt-4"
                >
                  {submitting ? 'Placing Order...' : `Place Order — ${formatPKR(finalTotal)}`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#fcfbf9] p-6 sm:p-8 md:p-10 rounded-2xl sticky top-24 sm:top-32 border border-charcoal/5 shadow-sm">
              <h2 className="font-serif text-xl sm:text-2xl mb-6 sm:mb-8">Order Summary</h2>
              
              <div className="flex flex-col gap-4 sm:gap-5 mb-6 sm:mb-8 max-h-[40vh] overflow-y-auto pr-2 sm:pr-4 hide-scrollbar">
                {cart.map((item) => (
                  <div key={item.product._id || item.product.id} className="flex gap-4 items-center">
                    <div className="w-16 sm:w-20 aspect-[3/4] bg-[#f4efe6] rounded-lg overflow-hidden shrink-0">
                      <img 
                        src={item.product.image || item.product.images?.[0] || "/prod-1.png"} 
                        alt={item.product.name} 
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/prod-1.png";
                        }}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-serif text-sm sm:text-base leading-tight line-clamp-2">{item.product.name}</p>
                        <p className="text-sm font-medium shrink-0">{formatPKR(item.product.price * item.quantity)}</p>
                      </div>
                      <p className="text-charcoal/50 text-[9px] sm:text-[10px] uppercase tracking-widest mt-2">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-xs sm:text-sm text-charcoal/80 border-t border-charcoal/10 pt-5 sm:pt-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>{formatPKR(cartTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-terracotta">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Discount ({couponCode})
                    </span>
                    <span>- {formatPKR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-terracotta font-medium uppercase tracking-widest text-[9px] sm:text-[10px]">Free</span>
                </div>
              </div>

              <div className="pt-5 sm:pt-6 border-t border-charcoal/10 flex justify-between items-center">
                <span className="font-serif text-lg sm:text-xl">Total</span>
                <div className="text-right">
                  {discountAmount > 0 && (
                    <p className="text-charcoal/40 text-[10px] sm:text-xs line-through mb-0.5">{formatPKR(cartTotal)}</p>
                  )}
                  <span className="font-serif text-xl sm:text-2xl">{formatPKR(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
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
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-ivory p-8 sm:p-10 md:p-16 rounded-3xl max-w-lg w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-terracotta" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </motion.div>
              
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-charcoal mb-3 sm:mb-4">Order Confirmed!</h2>
              <p className="text-charcoal/70 mb-6 sm:mb-8 font-light text-sm sm:text-base">
                Thank you for choosing Eloria. Your beautifully curated skincare ritual is being prepared and will be shipped shortly.
              </p>
              
              <button
                onClick={() => {
                  setIsSuccess(false);
                  router.push("/");
                }}
                className="bg-charcoal text-ivory px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl uppercase tracking-[0.2em] text-[9px] sm:text-[10px] font-medium hover:bg-terracotta transition-colors shadow-lg w-full"
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
