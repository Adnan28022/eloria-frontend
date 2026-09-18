"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { X, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
            transition={{ type: "spring" as any as any, damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-ivory shadow-2xl z-[100] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-charcoal/10">
              <h2 className="font-serif text-2xl text-charcoal">Your Bag ({cartCount})</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-charcoal/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-charcoal" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                  <p className="font-serif text-xl mb-4">Your bag is empty</p>
                  <button
                    onClick={closeCart}
                    className="uppercase tracking-[0.2em] text-[10px] border-b border-charcoal pb-1"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product._id || item.product.id} className="flex gap-4">
                    <div className="w-20 h-24 bg-[#f4efe6] rounded-md overflow-hidden shrink-0">
                      <img
                        src={item.product.image || item.product.images?.[0] || "/prod-1.png"}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <Link href={`/product/${item.product.slug}`} onClick={closeCart} className="font-serif text-base hover:text-terracotta transition-colors">
                            {item.product.name}
                          </Link>
                          <span className="font-serif text-base ml-2">{(item.product.price).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}</span>
                        </div>
                        <p className="text-charcoal/60 text-[9px] uppercase tracking-widest">{item.product.category}</p>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center border border-charcoal/20 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.product._id || item.product.id!, item.quantity - 1)}
                            className="p-1 hover:text-terracotta transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product._id || item.product.id!, item.quantity + 1)}
                            className="p-1 hover:text-terracotta transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product._id || item.product.id!)}
                          className="text-charcoal/40 hover:text-red-500 transition-colors uppercase text-[9px] tracking-widest"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-charcoal/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif text-lg">Subtotal</span>
                  <span className="font-serif text-xl">{(cartTotal).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      closeCart();
                      router.push("/cart");
                    }}
                    className="w-full py-3.5 border border-charcoal text-charcoal text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-charcoal/5 transition-colors text-center"
                  >
                    View Full Cart
                  </button>
                  <button
                    onClick={() => {
                      closeCart();
                      router.push("/checkout");
                    }}
                    className="w-full py-3.5 bg-charcoal text-ivory text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-terracotta transition-colors text-center shadow-lg"
                  >
                    Checkout
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
