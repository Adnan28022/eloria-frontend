"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, ArrowUpRight } from "lucide-react";
import { publicApi, formatPKR } from "@/lib/api";

export const FeaturedRituals: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [rituals, setRituals] = useState<any[]>([]);

  useEffect(() => {
    publicApi.getProducts({ featured: 'true' })
      .then(res => setRituals(res.data.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section ref={containerRef} className="relative w-full bg-[#f4efe6] text-charcoal">
      {/* Background Decor */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute top-0 right-0 w-[80vw] h-[80vw] lg:w-[40vw] lg:h-[40vw] rounded-full bg-ivory/40 blur-[100px] pointer-events-none"
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32 lg:py-40 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Sticky Header */}
          <div className="lg:w-1/3 flex flex-col">
            <div className="lg:sticky lg:top-40 space-y-8">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal text-ivory rounded-full text-[10px] uppercase tracking-[0.3em] font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Curated Collection
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] text-charcoal font-normal tracking-tight leading-[1.05]"
                >
                  Essential <br />
                  <span className="italic font-light text-terracotta">Rituals</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-charcoal/70 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-sm"
                >
                  Discover our most coveted formulations, designed to integrate seamlessly into your daily skin fitness routine for visible, lasting transformation.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="pt-4"
              >
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] font-medium text-charcoal hover:text-terracotta transition-colors pb-1.5 border-b-2 border-charcoal/20 hover:border-terracotta"
                >
                  <span>Explore All Formulations</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Scrollable Product List */}
          <div className="lg:w-2/3 flex flex-col gap-16 md:gap-24 lg:gap-32 lg:pt-20">
            {rituals.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="group flex flex-col sm:flex-row gap-8 sm:gap-12 items-center"
              >
                {/* Image Area */}
                <div className="w-full sm:w-1/2 relative">
                  <Link href={`/product/${item.slug}`} className="block relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ivory shadow-sm">
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center text-charcoal translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                    </div>
                    
                    <img
                      src={item.image || item.images?.[0] || "/prod-1.png"}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-[0.16,1,0.3,1]"
                    />
                    
                    {item.isBestSeller && (
                      <span className="absolute top-5 left-5 z-20 px-4 py-1.5 bg-white/90 backdrop-blur-md text-charcoal text-[9px] uppercase tracking-[0.25em] font-bold rounded-full shadow-lg">
                        Bestseller
                      </span>
                    )}
                  </Link>
                </div>

                {/* Details Area */}
                <div className="w-full sm:w-1/2 flex flex-col justify-center">
                  <div className="space-y-4">
                    <p className="text-[11px] text-terracotta uppercase tracking-[0.25em] font-semibold">
                      {item.tagline}
                    </p>
                    <h3 className="font-serif text-3xl md:text-4xl text-charcoal font-medium leading-tight group-hover:text-terracotta transition-colors duration-300">
                      <Link href={`/product/${item.slug}`}>{item.name}</Link>
                    </h3>
                    <p className="text-charcoal/60 text-sm md:text-base font-light leading-relaxed">
                      {item.description}
                    </p>
                    <div className="pt-6 flex items-center justify-between border-t border-charcoal/10">
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-xl text-charcoal">{formatPKR(item.price)}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="font-serif text-sm text-charcoal/40 line-through">{formatPKR(item.originalPrice)}</span>
                        )}
                      </div>
                      <Link href={`/product/${item.slug}`} className="text-xs uppercase tracking-[0.2em] font-medium text-charcoal hover:text-terracotta transition-colors py-2">
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};