"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";

interface WishlistContextType {
  wishlist: Product[];
  wishlistCount: number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("eloria_wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("eloria_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount: wishlist.length,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      isWishlistOpen,
      openWishlist: () => setIsWishlistOpen(true),
      closeWishlist: () => setIsWishlistOpen(false)
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
