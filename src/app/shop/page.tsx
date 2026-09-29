"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Eye, Heart } from "lucide-react";

export default function ShopPage() {
  const { addToCart, openCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  React.useEffect(() => {
    setLoading(true);
    import('@/lib/api').then(({ publicApi }) => {
      publicApi.getProducts({ category }).then(res => {
        setProducts(res.data.data);
      }).catch(() => {}).finally(() => setLoading(false));
    });
  }, [category]);

  const [categories, setCategories] = useState<string[]>(["all"]);

  React.useEffect(() => {
    import('@/lib/api').then(({ publicApi }) => {
      publicApi.getCategories().then(res => {
        const catNames = res.data.data.map((c: any) => c.slug);
        setCategories(["all", ...catNames]);
      }).catch(() => {});
    });
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      <Navbar />

      <main className="flex-grow">
        <PageHero 
          titleStart="All"
          titleHighlight="Formulations"
          description="Explore our complete collection of scientifically formulated skincare designed to nurture, protect, and restore your skin's natural balance."
          backgroundImage="/ProdHero.jfif"
          align="center"
          overlayOpacity={0.4}
          height="sm"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" }
          ]}
        />
        
        <section className="py-24 md:py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-charcoal/10 pb-8">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal">The Collection</h2>
              <p className="text-charcoal/60 text-sm font-light">Showing all {products.length} formulations</p>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6 text-[10px] uppercase tracking-widest font-medium text-charcoal/60">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setCategory(cat)}
                  className={`hover:text-terracotta transition-colors capitalize ${category === cat ? 'text-terracotta border-b border-terracotta' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {loading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="flex flex-col space-y-4 animate-pulse">
                  <div className="bg-[#EDE5DA] aspect-[3/4] rounded-2xl w-full" />
                  <div className="h-4 bg-[#EDE5DA] w-3/4 rounded-md" />
                  <div className="h-3 bg-[#EDE5DA] w-1/2 rounded-md" />
                </div>
              ))
            ) : products.map((product, i) => (
              <Link href={`/product/${product.slug}`} passHref key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                  className="group flex flex-col cursor-pointer h-full"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] mb-3 sm:mb-5 overflow-hidden bg-[#f4efe6] rounded-2xl shrink-0 shadow-xs group-hover:shadow-md transition-shadow">
                    {/* Badges */}
                    {(product.isBestSeller || product.isNew) && (
                      <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 z-20 pointer-events-none">
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-ivory/90 backdrop-blur-md text-charcoal text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold rounded-full shadow-xs">
                          {product.isBestSeller ? "Bestseller" : "New"}
                        </span>
                      </div>
                    )}

                    {/* Actions Overlay (Always visible on mobile, hover-revealed on desktop) */}
                    <div className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 z-20 opacity-100 sm:opacity-0 sm:-translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300 flex flex-col gap-1.5 sm:gap-2">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          isInWishlist(product.slug) ? removeFromWishlist(product.slug) : addToWishlist(product);
                        }}
                        aria-label="Toggle Wishlist"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-ivory/95 backdrop-blur-md text-charcoal flex items-center justify-center shadow-md hover:bg-terracotta hover:text-ivory transition-colors"
                      >
                        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isInWishlist(product.slug) ? "fill-terracotta text-terracotta" : ""}`} />
                      </button>
                    </div>

                    {/* Images with fallbacks and lazy loading */}
                    <img
                      src={product.image || product.images?.[0] || "/prod-1.png"}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/prod-1.png";
                      }}
                      className="w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-700 ease-in-out group-hover:opacity-0"
                    />
                    <img
                      src={product.images?.[1] || product.image || "/prod-1.png"}
                      alt={`${product.name} alternate view`}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/prod-1.png";
                      }}
                      className="w-full h-full object-cover object-center absolute inset-0 opacity-0 transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-105"
                    />

                    {/* Desktop Add to Cart Overlay */}
                    <div className="hidden sm:block absolute inset-x-3 bottom-3 z-20 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                          openCart();
                        }}
                        className="w-full py-3 bg-ivory/95 backdrop-blur-md text-charcoal hover:bg-charcoal hover:text-ivory transition-colors duration-300 text-[10px] uppercase tracking-[0.22em] font-medium flex items-center justify-center rounded-xl shadow-lg"
                      >
                        Quick Add — {(product.price).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-grow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1 sm:gap-2">
                      <h3 className="font-serif text-sm sm:text-lg text-charcoal leading-snug group-hover:text-terracotta transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-serif text-sm sm:text-base text-charcoal font-medium">
                          {(product.price).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="font-serif text-xs text-charcoal/40 line-through">
                            {(product.originalPrice).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-charcoal/60 uppercase tracking-widest font-medium line-clamp-1">
                      {product.tagline || product.category}
                    </p>

                    {/* Mobile Quick Add Button */}
                    <div className="sm:hidden mt-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                          openCart();
                        }}
                        className="w-full py-1.5 bg-[#FAF7F2] hover:bg-terracotta hover:text-white border border-[#E8E0D5] text-charcoal rounded-lg text-[9px] uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        + Add to Bag
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
