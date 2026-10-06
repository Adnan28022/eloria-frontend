"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Leaf, ArrowUpRight } from "lucide-react";

export const BrandTransitionBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const textOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.7], [0.3, 1, 0.9]);
  const underlineScaleX = useTransform(scrollYProgress, [0.15, 0.5], [0, 1]);

  // Reduced background animation complexity for performance
  const bgGlowY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  // Only use a few bubbles instead of 10
  const smallBubbles = [
    { size: "w-7 h-7", top: "12%", left: "8%", duration: 6, delay: 0 },
    { size: "w-9 h-9", top: "20%", left: "88%", duration: 10, delay: 0.8 },
    { size: "w-6 h-6", top: "75%", left: "85%", duration: 7.5, delay: 2.2 },
    { size: "w-8 h-8", top: "88%", left: "50%", duration: 8, delay: 2 },
  ];

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#FAF9F5] py-16 md:py-24 overflow-hidden text-charcoal border-b border-borderSubtle/40 selection:bg-peach/30"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          style={{ y: bgGlowY }}
          className="absolute -top-24 -left-24 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-gradient-to-tr from-peach/40 via-terracotta/15 to-transparent blur-[100px]"
        />

        {smallBubbles.map((bubble, index) => (
          <motion.div
            key={index}
            style={{ top: bubble.top, left: bubble.left }}
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: bubble.delay,
            }}
            className={`absolute ${bubble.size} rounded-full bg-gradient-to-tr from-peach/80 to-terracotta/40 backdrop-blur-xs border border-white/70 shadow-sm`}
          />
        ))}
        
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center group"
          >
            <div className="absolute -inset-2 bg-gradient-to-br from-peach/70 to-terracotta/30 rounded-[2.5rem] blur-lg opacity-60" />
            
            <div className="relative w-full max-w-md h-[360px] sm:h-[420px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/90 bg-white">
              <img
                src="/home2.jfif" 
                alt="Botanical Essence"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent opacity-80" />
              
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-5 left-5 right-5 p-3.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta shadow-inner">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60 font-semibold">Certified Pure</p>
                    <p className="font-serif text-xs text-charcoal font-medium">Small Batch Botanical</p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal/70 group-hover:bg-terracotta group-hover:text-white transition-colors duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-3">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 border border-terracotta/20 text-[10px] uppercase tracking-[0.35em] text-terracotta font-bold backdrop-blur-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                The Purity Manifesto
              </motion.div>

              <motion.h2 
                style={{ opacity: textOpacity }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="font-serif text-xl sm:text-2xl md:text-[1.85rem] text-charcoal font-light leading-[1.45] tracking-wide"
              >
                &quot;We believe true radiance is never synthesized in a laboratory, but carefully cultivated through the{" "}
                
                <span className="relative inline-block pb-0.5 mx-1 font-normal">
                  <span className="relative z-10 italic">intelligent harmony</span>
                  <motion.span 
                    style={{ scaleX: underlineScaleX, transformOrigin: "left" }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-terracotta to-peach rounded-full"
                  />
                </span>{" "}
                
                of{" "}
                
                <span className="relative inline-block pb-0.5 mx-1 font-normal">
                  <span className="relative z-10 italic">raw botanical science</span>
                  <motion.span 
                    style={{ scaleX: underlineScaleX, transformOrigin: "left" }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-terracotta to-peach rounded-full"
                  />
                </span>{" "}
                
                and skin physiology.&quot;
              </motion.h2>
            </div>

            <div className="relative w-28 h-[2px] bg-borderSubtle/60 overflow-hidden rounded-full">
              <motion.div 
                initial={{ x: "-100%" }}
                whileInView={{ x: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta to-transparent"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-charcoal/70 uppercase tracking-[0.25em] font-medium pt-1">
              <span className="px-3 py-1.5 rounded-lg bg-white/60 border border-borderSubtle/60 shadow-2xs hover:border-terracotta hover:text-terracotta transition-all duration-300 cursor-default">
                Cold-Pressed Oils
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta/50" />
              <span className="px-3 py-1.5 rounded-lg bg-white/60 border border-borderSubtle/60 shadow-2xs hover:border-terracotta hover:text-terracotta transition-all duration-300 cursor-default">
                Bio-Active Extractions
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta/50" />
              <span className="px-3 py-1.5 rounded-lg bg-white/60 border border-borderSubtle/60 shadow-2xs hover:border-terracotta hover:text-terracotta transition-all duration-300 cursor-default">
                Clean Standards
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};