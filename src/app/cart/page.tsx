"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Trash2, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      <Navbar />

      <main className="flex-grow pb-16 w-full">
        <PageHero 
          titleStart="Your"
          titleHighlight="Bag"
          backgroundImage="/CartHero.jfif"
          height="sm"
          overlayOpacity={0.4}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" }
          ]}
        />
        
        <div className="max-w-6xl mx-auto px-6 md:px-12 mt-12 md:mt-20">
          <div className="mb-12">
            <p className="text-charcoal/60 uppercase tracking-widest text-xs">
              {cartCount} {cartCount === 1 ? "Item" : "Items"}
            </p>
          </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-t border-b border-charcoal/10">
            <p className="font-serif text-2xl text-charcoal/60 mb-6">Your bag is currently empty.</p>
            <Link 
              href="/shop" 
              className="bg-charcoal text-ivory px-8 py-4 uppercase tracking-[0.25em] text-[10px] font-medium hover:bg-terracotta transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            
            {/* Cart Items */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              {cart.map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={item.product._id || item.product.id || index} 
                  className="flex gap-6 pb-8 border-b border-charcoal/10"
                >
                  <div className="w-24 md:w-32 aspect-[3/4] bg-[#f4efe6] overflow-hidden rounded-lg shrink-0">
                    <img src={item.product.image || item.product.images?.[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex flex-col flex-grow justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <Link href={`/product/${item.product.slug}`} className="font-serif text-lg hover:text-terracotta transition-colors">
                          {item.product.name}
                        </Link>
                        <span className="font-serif text-lg">{(item.product.price).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}</span>
                      </div>
                      <p className="text-charcoal/60 text-[10px] uppercase tracking-widest">{item.product.category}</p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-charcoal/20 rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.product._id || item.product.id, item.quantity - 1)}
                          className="p-2 hover:text-terracotta transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product._id || item.product.id, item.quantity + 1)}
                          className="p-2 hover:text-terracotta transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.product._id || item.product.id)}
                        className="text-charcoal/40 hover:text-red-500 transition-colors uppercase text-[10px] tracking-widest flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-[#fcfbf9] p-8 md:p-10 rounded-2xl sticky top-32 border border-charcoal/5 shadow-sm">
                <h2 className="font-serif text-2xl mb-8">Order Summary</h2>
                
                <div className="space-y-4 mb-8 text-sm text-charcoal/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{(cartTotal).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-terracotta font-medium uppercase tracking-widest text-[10px]">Free</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-charcoal/10 flex justify-between items-center mb-8">
                  <span className="font-serif text-xl">Total</span>
                  <span className="font-serif text-2xl">{(cartTotal).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}</span>
                </div>

                <Link href="/checkout" className="w-full bg-charcoal text-ivory py-4 uppercase tracking-[0.2em] text-[11px] font-medium hover:bg-terracotta transition-colors shadow-lg flex items-center justify-center">
                  Proceed to Checkout
                </Link>

                <p className="text-center text-charcoal/50 text-[10px] mt-6 tracking-wide">
                  Secure checkout. Free shipping on orders over $150.
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
