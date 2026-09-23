"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { publicApi, formatPKR } from "@/lib/api";

const DEFAULT_RITUALS = [
  {
    _id: "default-1",
    slug: "botanical-cleansing-oil",
    name: "Botanical Cleansing Oil",
    tagline: "Nourishing Cleanser · 150ml",
    description: "A transformative oil-to-milk cleanser infused with cold-pressed rosehip and calming chamomile to melt away impurities without stripping.",
    price: 3400,
    originalPrice: 4200,
    image: "/prod-1.png",
    isBestSeller: true
  },
  {
    _id: "default-2",
    slug: "hydrating-essence",
    name: "Cellular Hydrating Essence",
    tagline: "Deep Moisture Infusion · 100ml",
    description: "Concentrated hyaluronic acid complex blended with alpine botanicals for multi-depth cellular hydration and a luminous, plump finish.",
    price: 4800,
    originalPrice: 5500,
    image: "/prod-2.png",
    isBestSeller: false
  },
  {
    _id: "default-3",
    slug: "radiance-elixir-serum",
    name: "Golden Radiance Elixir",
    tagline: "Vitamin C & Niacinamide · 30ml",
    description: "An intensive brightening serum formulated with potent botanical actives to even skin tone, restore firmness, and defend against oxidative stress.",
    price: 5600,
    originalPrice: 6800,
    image: "/prod-3.png",
    isBestSeller: true
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.1,
      ease: [0.16, 1, 0.3, 1] as any
    }
  })
};

export const FeaturedRituals: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [rituals, setRituals] = useState<any[]>(DEFAULT_RITUALS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    publicApi.getProducts({ featured: 'true' })
      .then(res => {
        const prods = res.data?.data;
        if (prods && prods.length > 0) {
          setRituals(prods.slice(0, 3));
        } else {
          // Fallback to latest products if no featured items marked
          publicApi.getProducts()
            .then(fallbackRes => {
              const all = fallbackRes.data?.data;
              if (all && all.length > 0) {
                setRituals(all.slice(0, 3));
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        publicApi.getProducts()
          .then(res => {
            const all = res.data?.data;
            if (all && all.length > 0) setRituals(all.slice(0, 3));
          })
          .catch(() => {});
      });
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section ref={containerRef} className="relative w-full bg-[#f4efe6] text-charcoal overflow-hidden">
      {/* Background Decor - Gentle Parallax */}
      {mounted && (
        <motion.div 
          style={{ y: bgY }}
          className="absolute top-0 right-0 w-[80vw] h-[80vw] lg:w-[45vw] lg:h-[45vw] rounded-full bg-ivory/50 blur-[90px] pointer-events-none transform-gpu"
        />
      )}

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-28 lg:py-36 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Column: Sticky Header */}
          <div className="lg:w-1/3 flex flex-col">
            <div className="lg:sticky lg:top-36 space-y-6">
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal text-ivory rounded-full text-[10px] uppercase tracking-[0.3em] font-medium shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Curated Collection
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] text-charcoal font-normal tracking-tight leading-[1.08]"
                >
                  Essential <br />
                  <span className="italic font-light text-terracotta">Rituals</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-charcoal/70 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-sm"
                >
                  Discover our most coveted botanical formulations, crafted to integrate seamlessly into your daily skin fitness routine for visible, lasting transformation.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="pt-2"
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

          {/* Right Column: Animated Product List */}
          <div className="lg:w-2/3 flex flex-col gap-14 md:gap-20 lg:gap-28 lg:pt-16">
            {rituals.map((item, index) => (
              <motion.div
                key={item._id || item.slug || index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="group flex flex-col sm:flex-row gap-8 sm:gap-12 items-center"
              >
                {/* Image Area */}
                <div className="w-full sm:w-1/2 relative">
                  <Link 
                    href={`/product/${item.slug || item._id}`} 
                    className="block relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ivory shadow-[0_8px_30px_rgba(40,30,20,0.06)] group-hover:shadow-[0_16px_40px_rgba(194,142,121,0.18)] transition-all duration-500"
                  >
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center text-charcoal shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <ArrowUpRight className="w-6 h-6 text-terracotta" />
                      </div>
                    </div>
                    
                    <img
                      src={item.image || item.images?.[0] || "/prod-1.png"}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-[0.16,1,0.3,1]"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = "/prod-1.png";
                      }}
                    />
                    
                    {item.isBestSeller && (
                      <span className="absolute top-5 left-5 z-20 px-3.5 py-1.5 bg-white/95 backdrop-blur-md text-charcoal text-[9px] uppercase tracking-[0.25em] font-bold rounded-full shadow-md flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        Bestseller
                      </span>
                    )}
                  </Link>
                </div>

                {/* Details Area */}
                <div className="w-full sm:w-1/2 flex flex-col justify-center">
                  <div className="space-y-4">
                    <p className="text-[11px] text-terracotta uppercase tracking-[0.25em] font-bold">
                      {item.tagline || "Botanical Formulation"}
                    </p>
                    <h3 className="font-serif text-3xl md:text-4xl text-charcoal font-medium leading-tight group-hover:text-terracotta transition-colors duration-300">
                      <Link href={`/product/${item.slug || item._id}`}>{item.name}</Link>
                    </h3>
                    <p className="text-charcoal/70 text-sm md:text-base font-light leading-relaxed">
                      {item.description}
                    </p>
                    <div className="pt-6 flex items-center justify-between border-t border-charcoal/10">
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-2xl text-charcoal font-medium">{formatPKR(item.price)}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="font-serif text-sm text-charcoal/40 line-through">{formatPKR(item.originalPrice)}</span>
                        )}
                      </div>
                      <Link 
                        href={`/product/${item.slug || item._id}`} 
                        className="text-xs uppercase tracking-[0.2em] font-bold text-charcoal hover:text-terracotta transition-colors py-2 flex items-center gap-1 group/btn"
                      >
                        <span>View Ritual</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
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