"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Trash2, Plus, Minus, Tag, CheckCircle, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import api, { formatPKR as formatCurrency } from "@/lib/api";
import toast from "react-hot-toast";

interface CouponData {
  code: string;
  type: string;
  value: string;
  discountAmount: number;
  finalTotal: number;
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const formatPKR = formatCurrency;

  const finalTotal = appliedCoupon ? appliedCoupon.finalTotal : cartTotal;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await api.post("/api/discounts/validate", {
        code: couponCode.trim(),
        cartTotal,
      });
      if (res.data.success) {
        setAppliedCoupon(res.data.data);
        toast.success(res.data.message || "Coupon applied!");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || "Invalid coupon code";
      setCouponError(msg);
      toast.error(msg);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.success("Coupon removed");
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      <Navbar />

      <main className="flex-grow pb-20 xl:pb-0 w-full">
        <PageHero
          titleStart="Your"
          titleHighlight="Bag"
          backgroundImage="/CartHero.jfif"
          height="sm"
          overlayOpacity={0.4}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
          ]}
        />

        <div className="max-w-6xl mx-auto px-6 md:px-12 mt-12 md:mt-20">
          <div className="mb-8 md:mb-12">
            <p className="text-charcoal/60 uppercase tracking-widest text-xs">
              {cartCount} {cartCount === 1 ? "Item" : "Items"}
            </p>
          </div>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border-t border-b border-charcoal/10">
              <p className="font-serif text-xl sm:text-2xl text-charcoal/60 mb-6 text-center">Your bag is currently empty.</p>
              <Link
                href="/shop"
                className="bg-charcoal text-ivory px-8 py-4 rounded-xl uppercase tracking-[0.25em] text-[10px] font-medium hover:bg-terracotta transition-colors shadow-lg"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

              {/* Cart Items */}
              <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
                <AnimatePresence mode="popLayout">
                  {cart.map((item, index) => {
                    const productId = item.product._id || item.product.id || "";
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        key={productId || index}
                        className="flex gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-charcoal/10"
                      >
                        <Link href={`/product/${item.product.slug}`} className="w-24 sm:w-32 aspect-[3/4] bg-[#f4efe6] overflow-hidden rounded-xl shrink-0 block">
                          <img 
                            src={item.product.image || item.product.images?.[0] || '/prod-1.png'} 
                            alt={item.product.name} 
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/prod-1.png';
                            }}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                          />
                        </Link>

                        <div className="flex flex-col flex-grow justify-between py-1">
                          <div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
                              <Link href={`/product/${item.product.slug}`} className="font-serif text-[15px] sm:text-lg hover:text-terracotta transition-colors pr-4 line-clamp-2">
                                {item.product.name}
                              </Link>
                              <span className="font-serif text-sm sm:text-lg shrink-0">{formatPKR(item.product.price)}</span>
                            </div>
                            <p className="text-charcoal/60 text-[9px] sm:text-[10px] uppercase tracking-widest">{item.product.category}</p>
                          </div>

                          <div className="flex justify-between items-end mt-4">
                            <div className="flex items-center border border-charcoal/20 rounded-lg">
                              <button
                                onClick={() => updateQuantity(productId, item.quantity - 1)}
                                className="p-2 sm:p-2.5 hover:text-terracotta transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 sm:w-8 text-center text-xs">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(productId, item.quantity + 1)}
                                className="p-2 sm:p-2.5 hover:text-terracotta transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(productId)}
                              className="text-charcoal/40 hover:text-red-500 transition-colors uppercase text-[9px] sm:text-[10px] tracking-widest flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-5">
                <div className="bg-[#fcfbf9] p-6 sm:p-8 md:p-10 rounded-2xl sticky top-24 sm:top-32 border border-charcoal/5 shadow-sm">
                  <h2 className="font-serif text-xl sm:text-2xl mb-6 sm:mb-8">Order Summary</h2>

                  {/* Coupon Section */}
                  <div className="mb-6 sm:mb-8">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-charcoal/50 mb-3 flex items-center gap-2">
                      <Tag className="w-3 h-3" /> Coupon Code
                    </p>

                    <AnimatePresence mode="wait">
                      {appliedCoupon ? (
                        <motion.div
                          key="applied"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex items-center justify-between bg-terracotta/10 border border-terracotta/30 rounded-xl px-4 py-3 sm:py-4"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-terracotta shrink-0" />
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-terracotta tracking-widest">{appliedCoupon.code}</p>
                              <p className="text-[9px] sm:text-[10px] text-charcoal/60">
                                {appliedCoupon.type === "Percentage"
                                  ? `${appliedCoupon.value}% off`
                                  : `Rs ${parseFloat(appliedCoupon.value).toLocaleString()} off`}
                              </p>
                            </div>
                          </div>
                          <button onClick={handleRemoveCoupon} className="text-charcoal/40 hover:text-red-500 transition-colors p-1">
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="input"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex gap-2"
                        >
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value.toUpperCase());
                              setCouponError("");
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                            placeholder="Enter code"
                            className={`flex-1 border ${couponError ? "border-red-400" : "border-charcoal/20"} rounded-xl px-4 py-3 sm:py-3.5 text-xs bg-white focus:outline-none focus:border-terracotta transition-colors uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal w-full shadow-sm`}
                          />
                          <button
                            onClick={handleApplyCoupon}
                            disabled={couponLoading || !couponCode.trim()}
                            className="bg-charcoal text-ivory px-4 sm:px-6 py-3 sm:py-3.5 text-[9px] sm:text-[10px] uppercase tracking-widest rounded-xl hover:bg-terracotta transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap shadow-sm shrink-0"
                          >
                            {couponLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Apply"}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {couponError && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-[10px] mt-2 ml-1"
                      >
                        {couponError}
                      </motion.p>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4 mb-6 sm:mb-8 text-xs sm:text-sm text-charcoal/80">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPKR(cartTotal)}</span>
                    </div>
                    {appliedCoupon && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex justify-between text-terracotta"
                      >
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" /> Discount ({appliedCoupon.code})
                        </span>
                        <span>- {formatPKR(appliedCoupon.discountAmount)}</span>
                      </motion.div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-terracotta font-medium uppercase tracking-widest text-[9px] sm:text-[10px]">Free</span>
                    </div>
                  </div>

                  <div className="pt-5 sm:pt-6 border-t border-charcoal/10 flex justify-between items-center mb-6 sm:mb-8">
                    <span className="font-serif text-lg sm:text-xl">Total</span>
                    <div className="text-right">
                      {appliedCoupon && (
                        <p className="text-charcoal/40 text-xs sm:text-sm line-through mb-0.5">{formatPKR(cartTotal)}</p>
                      )}
                      <span className="font-serif text-xl sm:text-2xl">{formatPKR(finalTotal)}</span>
                    </div>
                  </div>

                  <Link
                    href={`/checkout?coupon=${appliedCoupon?.code || ""}&discount=${appliedCoupon?.discountAmount || 0}`}
                    className="w-full bg-charcoal text-ivory py-4 sm:py-5 uppercase tracking-[0.2em] text-[10px] sm:text-[11px] font-medium hover:bg-terracotta transition-colors shadow-xl flex items-center justify-center rounded-xl"
                  >
                    Proceed to Checkout
                  </Link>

                  <p className="text-center text-charcoal/50 text-[9px] sm:text-[10px] mt-5 sm:mt-6 tracking-wide">
                    Secure checkout. Free shipping on all orders.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
