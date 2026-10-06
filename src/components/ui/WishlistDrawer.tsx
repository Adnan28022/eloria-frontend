"use client";

import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPKR } from "@/lib/api";

export const WishlistDrawer: React.FC = () => {
  const { wishlist, isWishlistOpen, closeWishlist, removeFromWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();
  const router = useRouter();

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
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-ivory shadow-2xl z-[101] flex flex-col border-l border-charcoal/10"
          >
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-charcoal/10 bg-[#fcfbf9]">
              <h2 className="font-serif text-2xl text-charcoal">Your Wishlist</h2>
              <button 
                onClick={closeWishlist}
                className="p-2 text-charcoal/60 hover:text-charcoal transition-colors rounded-full hover:bg-charcoal/5"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-5 sm:p-6 flex flex-col gap-6 hide-scrollbar">
              {wishlist.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-charcoal/50 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#f4efe6] flex items-center justify-center mb-2">
                    <Heart className="w-6 h-6 text-charcoal/30" />
                  </div>
                  <p className="font-serif text-xl">Your wishlist is currently empty.</p>
                  <button 
                    onClick={() => {
                      closeWishlist();
                      router.push("/shop");
                    }}
                    className="mt-4 uppercase tracking-[0.2em] text-[10px] font-bold border-b border-charcoal pb-1 hover:border-terracotta transition-colors text-charcoal hover:text-terracotta"
                  >
                    Continue Exploring
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {wishlist.map((item: any) => {
                    const productId = item._id || item.id || item.slug || '';
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
                        <div className="w-24 h-32 sm:h-36 bg-[#f4efe6] shrink-0 overflow-hidden rounded-lg relative block">
                          <img 
                            src={item.image || item.images?.[0] || "/prod-1.png"} 
                            alt={item.name} 
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/prod-1.png";
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                        <div className="flex-grow flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex justify-between items-start">
                              <Link href={`/product/${item.slug}`} onClick={closeWishlist}>
                                <h3 className="font-serif text-[15px] sm:text-lg text-charcoal leading-tight hover:text-terracotta transition-colors line-clamp-2 pr-2">{item.name}</h3>
                              </Link>
                              <button 
                                onClick={() => removeFromWishlist(productId)}
                                className="text-charcoal/40 hover:text-red-500 transition-colors p-1 shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-charcoal/50 mt-1">{item.category}</p>
                            <p className="mt-2 text-charcoal font-medium text-sm">{formatPKR(item.price)}</p>
                          </div>
                          
                          <button
                            onClick={() => {
                              addToCart(item);
                              removeFromWishlist(productId);
                              closeWishlist();
                              openCart();
                            }}
                            className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 sm:py-2 border border-charcoal/20 rounded-lg text-[10px] uppercase tracking-widest font-bold text-charcoal hover:bg-charcoal hover:text-ivory transition-colors"
                          >
                            <ShoppingBag className="w-3 h-3" /> Move to Bag
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {wishlist.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-charcoal/10 bg-[#fcfbf9]">
                <button 
                  onClick={() => {
                    closeWishlist();
                    router.push("/shop");
                  }}
                  className="w-full bg-charcoal text-ivory py-4 rounded-xl uppercase tracking-[0.2em] text-[10px] font-medium hover:bg-terracotta transition-colors shadow-lg"
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
