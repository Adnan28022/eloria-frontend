"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { X, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPKR } from "@/lib/api";

export const CartDrawer: React.FC = () => {
  const { isCartOpen, closeCart, cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const router = useRouter();

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[90]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-ivory shadow-2xl z-[100] flex flex-col border-l border-charcoal/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-charcoal/10 bg-[#fcfbf9]">
              <h2 className="font-serif text-2xl text-charcoal">Your Bag ({cartCount})</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-charcoal/5 rounded-full transition-colors text-charcoal/60 hover:text-charcoal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-5 sm:p-6 flex flex-col gap-6 hide-scrollbar">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-60 gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#f4efe6] flex items-center justify-center mb-2">
                    <X className="w-6 h-6 text-charcoal/30" />
                  </div>
                  <p className="font-serif text-xl">Your bag is empty</p>
                  <button
                    onClick={() => {
                      closeCart();
                      router.push("/shop");
                    }}
                    className="mt-4 uppercase tracking-[0.2em] text-[10px] border-b border-charcoal pb-1 hover:text-terracotta hover:border-terracotta transition-colors font-bold"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => {
                    const productId = item.product._id || item.product.id || '';
                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: 20 }}
                        transition={{ duration: 0.2 }}
                        key={productId} 
                        className="flex gap-4 group"
                      >
                        <div className="w-20 h-24 sm:h-28 bg-[#f4efe6] rounded-md overflow-hidden shrink-0 relative block">
                          <img
                            src={item.product.image || item.product.images?.[0] || "/prod-1.png"}
                            alt={item.product.name}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/prod-1.png";
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col flex-grow justify-between py-0.5">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <Link href={`/product/${item.product.slug}`} onClick={closeCart} className="font-serif text-[15px] sm:text-base leading-snug hover:text-terracotta transition-colors pr-2 line-clamp-2">
                                {item.product.name}
                              </Link>
                              <span className="font-serif text-sm sm:text-base ml-2 shrink-0">{formatPKR(item.product.price)}</span>
                            </div>
                            <p className="text-charcoal/60 text-[9px] uppercase tracking-widest">{item.product.category}</p>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center border border-charcoal/20 rounded-md">
                              <button
                                onClick={() => updateQuantity(productId, item.quantity - 1)}
                                className="p-1 sm:p-1.5 hover:text-terracotta transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(productId, item.quantity + 1)}
                                className="p-1 sm:p-1.5 hover:text-terracotta transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(productId)}
                              className="text-charcoal/40 hover:text-red-500 transition-colors uppercase text-[9px] tracking-widest flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-5 sm:p-6 bg-[#fcfbf9] border-t border-charcoal/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif text-lg text-charcoal/80">Subtotal</span>
                  <span className="font-serif text-2xl">{formatPKR(cartTotal)}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      closeCart();
                      router.push("/checkout");
                    }}
                    className="w-full py-4 sm:py-3.5 bg-charcoal text-ivory text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-terracotta transition-colors text-center shadow-lg rounded-xl"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => {
                      closeCart();
                      router.push("/cart");
                    }}
                    className="w-full py-3.5 sm:py-3 border border-charcoal/20 text-charcoal text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-charcoal/5 hover:border-charcoal transition-colors text-center rounded-xl"
                  >
                    View Full Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
