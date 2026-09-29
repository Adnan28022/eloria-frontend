"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ChevronRight, Plus, Minus, Check, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, openCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"benefits" | "ingredients" | "howToUse">("benefits");

  useEffect(() => {
    import('@/lib/api').then(({ publicApi }) => {
      publicApi.getProductById(id as string)
        .then(res => setProduct(res.data.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
        <Navbar />
        <main className="flex-grow pt-24 md:pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto w-full animate-pulse">
          <div className="h-4 bg-[#EDE5DA] w-48 rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            <div className="aspect-[4/5] bg-[#EDE5DA] rounded-2xl w-full" />
            <div className="space-y-6">
              <div className="h-10 bg-[#EDE5DA] w-3/4 rounded-xl" />
              <div className="h-4 bg-[#EDE5DA] w-1/3 rounded" />
              <div className="h-8 bg-[#EDE5DA] w-1/4 rounded" />
              <div className="h-24 bg-[#EDE5DA] w-full rounded-2xl" />
              <div className="h-12 bg-[#EDE5DA] w-1/2 rounded-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center font-serif text-2xl text-charcoal py-24 px-6 text-center">
          <p className="mb-4">Product not found.</p>
          <Link href="/shop" className="text-xs uppercase tracking-widest text-terracotta border-b border-terracotta pb-1 font-sans font-bold">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const gallery = product.images?.length > 0 
    ? product.images 
    : (product.image ? [product.image] : ['/prod-1.png']);

  const handleAdd = () => {
    for(let i=0; i<quantity; i++) {
      addToCart(product);
    }
    openCart();
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      <Navbar />

      <main className="flex-grow pt-24 md:pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 md:mb-12 text-[10px] uppercase tracking-widest font-medium text-charcoal/50">
          <Link href="/" className="hover:text-terracotta transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-terracotta transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-charcoal truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-24">
          {/* Left: Image Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 sm:gap-6">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar shrink-0">
              {gallery.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-16 sm:w-20 h-20 sm:h-24 shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${activeImage === idx ? 'ring-2 ring-terracotta shadow-md' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx}`} 
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/prod-1.png";
                    }}
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-[#f4efe6] rounded-2xl overflow-hidden w-full shadow-sm">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={gallery[activeImage] || "/prod-1.png"}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  alt={product.name}
                  loading="eager"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/prod-1.png";
                  }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {(product.isBestSeller || product.isNew) && (
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 pointer-events-none">
                  <span className="px-3.5 py-1.5 bg-ivory/90 backdrop-blur-md text-charcoal text-[9px] uppercase tracking-[0.25em] font-bold rounded-full shadow-sm">
                    {product.isBestSeller ? "Bestseller" : "New"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">{product.name}</h1>
            <p className="text-charcoal/60 uppercase tracking-widest text-[11px] mb-8">{product.tagline}</p>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="font-serif text-3xl">{(product.price).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-serif text-xl text-charcoal/40 line-through">{(product.originalPrice).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}</span>
              )}
            </div>

            <p className="text-charcoal/80 font-light leading-relaxed mb-10 text-sm md:text-base">
              {product.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <div className="flex items-center justify-between border border-charcoal p-2 sm:w-32 h-14 shrink-0">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-terracotta">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-terracotta">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={handleAdd}
                className="flex-grow bg-charcoal text-ivory h-14 uppercase tracking-[0.2em] text-[11px] font-medium hover:bg-terracotta transition-colors shadow-xl"
              >
                Add to Bag — {((product.price * quantity)).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}
              </button>
              <button 
                onClick={() => isInWishlist(product.slug) ? removeFromWishlist(product.slug) : addToWishlist(product)}
                className="w-14 h-14 border border-charcoal/20 flex items-center justify-center shrink-0 hover:border-terracotta transition-colors"
              >
                <Heart className={`w-5 h-5 transition-colors ${isInWishlist(product.slug) ? "fill-terracotta text-terracotta" : "text-charcoal"}`} />
              </button>
            </div>

            {/* Accordion Tabs */}
            <div className="border-t border-charcoal/10 pt-8">
              <div className="flex gap-8 border-b border-charcoal/10 mb-8 overflow-x-auto hide-scrollbar">
                {(["benefits", "ingredients", "howToUse"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 uppercase tracking-[0.2em] text-[10px] font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === tab ? "text-charcoal" : "text-charcoal/40 hover:text-charcoal/70"
                    }`}
                  >
                    {tab.replace(/([A-Z])/g, ' $1').trim()}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-charcoal" />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-charcoal/80 font-light text-sm leading-relaxed"
                >
                  {activeTab === "benefits" && (
                    <ul className="space-y-3">
                      {product.benefits.map((benefit: string, i: number) => (
                        <li key={i} className="flex gap-3 items-start">
                          <Check className="w-4 h-4 mt-0.5 text-terracotta shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {activeTab === "ingredients" && (
                    <div className="space-y-4">
                      <p>Key Actives:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.ingredients.map((ing: any, i: number) => (
                          <span key={i} className="px-3 py-1.5 border border-charcoal/10 rounded-full text-xs">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "howToUse" && (
                    <p>{product.howToUse}</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
