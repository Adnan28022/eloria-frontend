"use client";

import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const WishlistDrawer: React.FC = () => {
  const { wishlist, isWishlistOpen, closeWishlist, removeFromWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWishlist}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring" as any as any, damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-ivory shadow-2xl z-[101] flex flex-col border-l border-charcoal/10"
          >
            <div className="flex items-center justify-between p-6 border-b border-charcoal/10 bg-[#fcfbf9]">
              <h2 className="font-serif text-2xl text-charcoal">Your Wishlist</h2>
              <button 
                onClick={closeWishlist}
                className="p-2 text-charcoal/60 hover:text-charcoal transition-colors rounded-full hover:bg-charcoal/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
              {wishlist.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-charcoal/50 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#f4efe6] flex items-center justify-center mb-2">
                    <Trash2 className="w-6 h-6 text-charcoal/30" />
                  </div>
                  <p>Your wishlist is currently empty.</p>
                  <button 
                    onClick={closeWishlist}
                    className="mt-4 uppercase tracking-[0.2em] text-[10px] font-bold border-b border-charcoal/30 pb-1 hover:border-terracotta transition-colors text-charcoal hover:text-terracotta"
                  >
                    Continue Exploring
                  </button>
                </div>
              ) : (
                wishlist.map((item: any) => (
                  <div key={item._id || item.id} className="flex gap-4 group">
                    <Link href={`/product/${item.slug}`} onClick={closeWishlist} className="w-24 h-32 bg-[#f4efe6] shrink-0 overflow-hidden rounded-lg cursor-pointer block relative">
                      <img src={item.image || item.images?.[0] || "/prod-1.png"} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </Link>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link href={`/product/${item.slug}`} onClick={closeWishlist}>
                            <h3 className="font-serif text-lg text-charcoal leading-tight hover:text-terracotta transition-colors">{item.name}</h3>
                          </Link>
                          <button 
                            onClick={() => removeFromWishlist(item.slug)}
                            className="text-charcoal/40 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-charcoal/50 mt-1">{item.category}</p>
                        <p className="mt-2 text-charcoal font-medium">{(item.price).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          addToCart(item);
                          removeFromWishlist(item.slug);
                          closeWishlist();
                          openCart();
                        }}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-terracotta hover:text-charcoal transition-colors mt-4"
                      >
                        <ShoppingBag className="w-3 h-3" /> Move to Cart
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {wishlist.length > 0 && (
              <div className="p-6 border-t border-charcoal/10 bg-[#fcfbf9]">
                <button 
                  onClick={closeWishlist}
                  className="w-full bg-charcoal text-ivory py-4 uppercase tracking-[0.2em] text-[10px] font-medium hover:bg-terracotta transition-colors shadow-lg"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
