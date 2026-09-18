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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {loading ? (
               <div className="col-span-full py-20 text-center text-charcoal/40 text-sm uppercase tracking-widest">Loading products...</div>
            ) : products.map((product, i) => (
              <Link href={`/product/${product.slug}`} passHref key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
                  className="group flex flex-col cursor-pointer h-full"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-[#f4efe6] rounded-2xl shrink-0">
                  {/* Badges */}
                  {(product.isBestSeller || product.isNew) && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 bg-ivory/90 backdrop-blur-md text-charcoal text-[9px] uppercase tracking-[0.25em] font-bold rounded-full shadow-sm">
                        {product.isBestSeller ? "Bestseller" : "New"}
                      </span>
                    </div>
                  )}

                  {/* Actions Overlay */}
                  <div className="absolute top-4 right-4 z-20 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex flex-col gap-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        isInWishlist(product.slug) ? removeFromWishlist(product.slug) : addToWishlist(product);
                      }}
                      className="w-8 h-8 rounded-full bg-ivory/95 backdrop-blur-md text-charcoal flex items-center justify-center shadow-md hover:bg-terracotta hover:text-ivory transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.slug) ? "fill-terracotta text-terracotta" : ""}`} />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-ivory/95 backdrop-blur-md text-charcoal flex items-center justify-center shadow-md hover:bg-charcoal hover:text-ivory transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Images */}
                  <img
                    src={product.image || product.images?.[0] || "/prod-1.png"}
                    alt={product.name}
                    className="w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-700 ease-in-out group-hover:opacity-0"
                  />
                  <img
                    src={product.images?.[1] || product.image || "/prod-1.png"}
                    alt={`${product.name} alternate view`}
                    className="w-full h-full object-cover object-center absolute inset-0 opacity-0 transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-105"
                  />

                  {/* Add to Cart Overlay */}
                  <div className="absolute inset-x-4 bottom-4 z-20 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                        openCart();
                      }}
                      className="w-full py-3.5 bg-ivory/95 backdrop-blur-md text-charcoal hover:bg-charcoal hover:text-ivory transition-colors duration-300 text-[10px] uppercase tracking-[0.25em] font-medium flex items-center justify-center rounded-xl shadow-lg"
                    >
                      Quick Add — {(product.price).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="font-serif text-xl text-charcoal leading-tight group-hover:text-terracotta transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className="font-serif text-lg text-charcoal shrink-0">{(product.price).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="font-serif text-xs text-charcoal/40 line-through">{(product.originalPrice).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-charcoal/60 uppercase tracking-widest font-medium">
                    {product.tagline || product.category}
                  </p>
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
