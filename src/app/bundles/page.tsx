"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Package, ShieldCheck, Truck } from "lucide-react";
import { publicApi, formatPKR } from "@/lib/api";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function BundlesPublicPage() {
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    publicApi.getBundles()
      .then(res => setBundles(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (bundle: any) => {
    addToCart({
      _id: bundle._id,
      name: bundle.name,
      price: bundle.price,
      image: bundle.image,
      slug: bundle.slug
    });
    toast.success("Bundle added to cart!");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ivory pb-24">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src="/KitsHero.jfif" alt="Kits and Bundles" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10 text-center mt-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold text-xs uppercase tracking-widest mb-6">
              <Sparkles className="w-4 h-4 text-terracotta" /> Exclusive Value Sets
            </motion.div>
            
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight max-w-4xl mx-auto">
              Curated Bundles for <br/><span className="italic text-white/90">Perfect Skin</span>
            </motion.h1>
            
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Save more when you shop our expertly curated skincare routines. Hand-picked products designed to work flawlessly together.
            </motion.p>
          </div>
        </section>

      {/* Bundles Display */}
      <section className="container mx-auto px-6 -mt-10 relative z-20">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-charcoal/10 border-t-terracotta rounded-full" />
          </div>
        ) : bundles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-xl border border-charcoal/5">
            <h2 className="font-serif text-3xl text-charcoal mb-4">New Bundles Coming Soon</h2>
            <p className="text-charcoal/60">We are currently crafting the perfect skincare kits for you.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {bundles.map((bundle, index) => (
              <motion.div 
                key={bundle._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center bg-white p-6 md:p-10 rounded-[3rem] shadow-xl border border-charcoal/5 hover:border-terracotta/20 transition-colors group`}
              >
                
                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative">
                  <div className="absolute inset-0 bg-terracotta/10 rounded-[2.5rem] translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500" />
                  <div className="relative aspect-square rounded-[2.5rem] overflow-hidden">
                    <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    
                    {/* Savings Tag */}
                    {bundle.compareAtPrice && bundle.compareAtPrice > bundle.price && (
                      <div className="absolute top-6 left-6 bg-terracotta text-white px-4 py-2 rounded-xl font-bold tracking-widest uppercase text-xs shadow-lg flex items-center gap-2">
                        Save {formatPKR(bundle.compareAtPrice - bundle.price)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-8 lg:px-8">
                  <div>
                    <h2 className="text-3xl md:text-5xl font-serif text-charcoal mb-4">{bundle.name}</h2>
                    <p className="text-charcoal/70 text-lg leading-relaxed">{bundle.description}</p>
                  </div>

                  {/* Included Products List */}
                  <div className="bg-[#fcfbf9] rounded-3xl p-6 border border-charcoal/5">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-charcoal/50 mb-4 flex items-center gap-2">
                      <Package className="w-4 h-4" /> What's Included
                    </h3>
                    <div className="space-y-4">
                      {bundle.products?.map((prod: any) => (
                        <div key={prod._id} className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-charcoal/5">
                          <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="flex-1">
                            <h4 className="font-serif text-charcoal font-medium">{prod.name}</h4>
                            <p className="text-[10px] text-charcoal/50 uppercase tracking-widest">Full Size</p>
                          </div>
                          <div className="text-sm font-bold text-charcoal/40 line-through">
                            {formatPKR(prod.price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 border-t border-charcoal/10">
                    <div className="flex-1 w-full text-center sm:text-left">
                      <div className="text-charcoal/50 text-sm font-medium mb-1">Bundle Price</div>
                      <div className="flex items-end justify-center sm:justify-start gap-3">
                        <span className="text-4xl font-serif text-terracotta">{formatPKR(bundle.price)}</span>
                        {bundle.compareAtPrice && (
                          <span className="text-lg text-charcoal/30 line-through mb-1">{formatPKR(bundle.compareAtPrice)}</span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(bundle)}
                      className="w-full sm:w-auto px-10 py-5 bg-charcoal text-ivory rounded-full font-bold uppercase tracking-widest text-sm hover:bg-terracotta transition-all shadow-xl hover:shadow-terracotta/30 flex items-center justify-center gap-3 shrink-0"
                    >
                      Add to Cart <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-6 mt-24 border-t border-charcoal/10 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center text-sage mb-4"><ShieldCheck className="w-8 h-8" /></div>
            <h4 className="font-serif text-xl text-charcoal mb-2">100% Authentic</h4>
            <p className="text-charcoal/60 text-sm">Genuine products directly from the manufacturer.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center text-terracotta mb-4"><Package className="w-8 h-8" /></div>
            <h4 className="font-serif text-xl text-charcoal mb-2">Curated Sets</h4>
            <p className="text-charcoal/60 text-sm">Products designed to work in harmony.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center text-charcoal mb-4"><Truck className="w-8 h-8" /></div>
            <h4 className="font-serif text-xl text-charcoal mb-2">Free Delivery</h4>
            <p className="text-charcoal/60 text-sm">Free nationwide delivery on all bundle orders.</p>
          </div>
        </div>
      </section>

    </main>
    <Footer />
    </>
  );
}
