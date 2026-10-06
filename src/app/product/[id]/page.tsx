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
import { publicApi, formatPKR } from "@/lib/api";
import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/types";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart, openCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"benefits" | "ingredients" | "howToUse">("benefits");

  useEffect(() => {
    publicApi.getProductById(id as string)
      .then(res => {
        const prod = res.data.data;
        setProduct(prod);
        
        // Fetch related products
        publicApi.getProducts()
          .then(relatedRes => {
            const all = relatedRes.data.data as Product[];
            // Filter out current product and try to match category if possible
            let related = all.filter(p => (p._id || p.id) !== (prod._id || prod.id));
            const sameCategory = related.filter(p => p.category === prod.category);
            
            if (sameCategory.length >= 4) {
              setRelatedProducts(sameCategory.slice(0, 4));
            } else {
              setRelatedProducts(related.slice(0, 4));
            }
          })
          .catch(() => {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
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

  const gallery = product.images?.length ? product.images : (product.image ? [product.image] : ['/prod-1.png']);
  const productId = product._id || product.id || product.slug || '';

  const handleAdd = () => {
    for(let i=0; i<quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} ${product.name} added to cart`, {
      style: {
        background: '#3A322C',
        color: '#FBF3EC',
        borderRadius: '12px',
        fontSize: '14px',
      },
      iconTheme: {
        primary: '#C28E79',
        secondary: '#FBF3EC',
      },
    });
    openCart();
  };

  const toggleWishlist = () => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const hasBenefits = Array.isArray(product.benefits) && product.benefits.length > 0;
  const hasIngredients = Array.isArray(product.ingredients) && product.ingredients.length > 0;
  const hasHowToUse = !!product.howToUse;

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      <Navbar />

      <main className="flex-grow pt-24 md:pt-32 pb-20 xl:pb-0 px-6 md:px-12 max-w-[1400px] mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 md:mb-12 text-[10px] uppercase tracking-widest font-medium text-charcoal/50">
          <Link href="/" className="hover:text-terracotta transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-terracotta transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-charcoal truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-24 mb-24">
          {/* Left: Image Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 sm:gap-6">
            {/* Thumbnails */}
            {gallery.length > 1 && (
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
            )}

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
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 leading-tight">{product.name}</h1>
            <p className="text-charcoal/60 uppercase tracking-widest text-[10px] sm:text-[11px] mb-6 sm:mb-8">{product.tagline || product.category}</p>
            
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <span className="font-serif text-2xl sm:text-3xl">{formatPKR(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-serif text-lg sm:text-xl text-charcoal/40 line-through">
                  {formatPKR(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-charcoal/80 font-light leading-relaxed mb-8 sm:mb-10 text-sm md:text-base">
              {product.description || "No description provided for this formulation."}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-16">
              <div className="flex items-center justify-between border border-charcoal p-2 sm:w-32 h-12 sm:h-14 shrink-0 rounded-xl sm:rounded-none">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-terracotta transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-terracotta transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={handleAdd}
                className="flex-grow bg-charcoal text-ivory h-12 sm:h-14 rounded-xl sm:rounded-none uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-[11px] font-medium hover:bg-terracotta transition-colors shadow-lg sm:shadow-xl"
              >
                Add to Bag — {formatPKR(product.price * quantity)}
              </button>
              <button 
                onClick={toggleWishlist}
                className="w-full sm:w-14 h-12 sm:h-14 border border-charcoal/20 flex items-center justify-center shrink-0 rounded-xl sm:rounded-none hover:border-terracotta hover:text-terracotta transition-colors"
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 transition-colors ${isInWishlist(productId) ? "fill-terracotta text-terracotta" : "text-charcoal"}`} />
              </button>
            </div>

            {/* Accordion Tabs */}
            <div className="border-t border-charcoal/10 pt-6 sm:pt-8">
              <div className="flex gap-6 sm:gap-8 border-b border-charcoal/10 mb-6 sm:mb-8 overflow-x-auto hide-scrollbar">
                {(["benefits", "ingredients", "howToUse"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 sm:pb-4 uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[9px] sm:text-[10px] font-medium transition-colors relative whitespace-nowrap ${
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

              <div className="min-h-[150px]">
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
                      hasBenefits ? (
                        <ul className="space-y-3">
                          {product.benefits!.map((benefit: string, i: number) => (
                            <li key={i} className="flex gap-3 items-start">
                              <Check className="w-4 h-4 mt-0.5 text-terracotta shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-charcoal/50 italic">No specific benefits listed.</p>
                      )
                    )}
                    {activeTab === "ingredients" && (
                      hasIngredients ? (
                        <div className="space-y-4">
                          <p>Key Actives:</p>
                          <div className="flex flex-wrap gap-2">
                            {product.ingredients!.map((ing: string, i: number) => (
                              <span key={i} className="px-3 py-1.5 border border-charcoal/10 rounded-full text-xs">
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-charcoal/50 italic">Ingredient list not available.</p>
                      )
                    )}
                    {activeTab === "howToUse" && (
                      hasHowToUse ? (
                        <p>{product.howToUse}</p>
                      ) : (
                        <p className="text-charcoal/50 italic">Usage instructions not provided.</p>
                      )
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-charcoal/10 pt-16 md:pt-24 mt-12 mb-12">
            <div className="flex justify-between items-end mb-10">
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal">Complete Your Routine</h2>
              <Link href="/shop" className="hidden sm:inline-block text-[10px] uppercase tracking-widest font-bold text-terracotta border-b border-terracotta pb-1 hover:text-charcoal hover:border-charcoal transition-colors">
                Shop All
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {relatedProducts.map((rp, i) => (
                <motion.div
                  key={rp._id || rp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <ProductCard 
                    product={rp}
                    onAddToCart={(p) => {
                      addToCart(p);
                      toast.success(`${p.name} added to cart`, {
                        style: { background: '#3A322C', color: '#FBF3EC' }
                      });
                      openCart();
                    }}
                    onToggleWishlist={(p) => {
                      const id = p._id || p.id || p.slug || '';
                      if (isInWishlist(id)) {
                        removeFromWishlist(id);
                        toast.success('Removed from wishlist');
                      } else {
                        addToWishlist(p);
                        toast.success('Added to wishlist');
                      }
                    }}
                    isWishlisted={isInWishlist(rp._id || rp.id || rp.slug || '')}
                  />
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/shop" className="inline-block text-[10px] uppercase tracking-widest font-bold text-terracotta border-b border-terracotta pb-1">
                Shop All Formulations
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
