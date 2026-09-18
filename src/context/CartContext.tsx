"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("eloria_cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("eloria_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => (item.product._id || item.product.id) === (product._id || product.id));
      if (existing) {
        return prev.map((item) =>
          (item.product._id || item.product.id) === (product._id || product.id) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => (item.product._id || item.product.id) !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        (item.product._id || item.product.id) === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, isCartOpen, openCart, closeCart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
