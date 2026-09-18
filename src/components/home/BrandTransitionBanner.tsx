"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Leaf, ArrowUpRight } from "lucide-react";

export const BrandTransitionBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll progress for scroll-driven text & underline reveal
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const textOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.7], [0.3, 1, 0.9]);
  
  // Parallax scroll progress for left-to-right underline growth
  const underlineScaleX = useTransform(scrollYProgress, [0.15, 0.5], [0, 1]);

  const bgGlowY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const secondaryGlowY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // Expanded array of vibrant and clearly visible background bubbles
  const smallBubbles = [
    { size: "w-7 h-7", top: "12%", left: "8%", duration: 6, delay: 0 },
    { size: "w-5 h-5", top: "82%", left: "12%", duration: 8.5, delay: 1.5 },
    { size: "w-9 h-9", top: "20%", left: "88%", duration: 10, delay: 0.8 },
    { size: "w-6 h-6", top: "75%", left: "85%", duration: 7.5, delay: 2.2 },
    { size: "w-10 h-10", top: "40%", left: "94%", duration: 11, delay: 0.4 },
    { size: "w-5 h-5", top: "8%", left: "45%", duration: 9, delay: 1.2 },
    { size: "w-8 h-8", top: "88%", left: "50%", duration: 8, delay: 2 },
    { size: "w-4 h-4", top: "48%", left: "2%", duration: 6.5, delay: 1 },
    { size: "w-6 h-6", top: "30%", left: "25%", duration: 9.5, delay: 1.8 },
    { size: "w-5 h-5", top: "65%", left: "75%", duration: 7, delay: 0.6 },
  ];

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#FAF9F5] py-16 md:py-24 overflow-hidden text-charcoal border-b border-borderSubtle/40 selection:bg-peach/30"
    >
      {/* High-Level Layered Background Animations & Responsive Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary Fluid Glow (Scroll Driven) */}
        <motion.div 
          style={{ y: bgGlowY }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.35, 0.55, 0.35],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[400px] sm:w-[550px] h-[400px] sm:h-[550px] rounded-full bg-gradient-to-tr from-peach/60 via-terracotta/25 to-transparent blur-[110px]"
        />

        {/* Secondary Floating Orb (Scroll Driven) */}
        <motion.div 
          style={{ y: secondaryGlowY }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.25, 0.45, 0.25],
            x: [0, 35, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-28 right-[-10%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-gradient-to-bl from-terracotta/30 via-peach/35 to-transparent blur-[130px]"
        />

        {/* --- Enhanced Visible Animated Background Bubbles --- */}
        {smallBubbles.map((bubble, index) => (
          <motion.div
            key={index}
            style={{ top: bubble.top, left: bubble.left }}
            animate={{
              y: [0, -35, 0],
              x: [0, index % 2 === 0 ? 12 : -12, 0],
              scale: [1, 1.18, 1],
              opacity: [0.5, 0.9, 0.5],
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

        {/* Large Atmospheric Floating Orbs */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[15%] right-[10%] w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-peach/50 to-terracotta/20 blur-[25px] sm:blur-[30px]"
        />

        <motion.div
          animate={{
            y: [0, 35, 0],
            x: [0, -20, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-[45%] left-[5%] w-36 h-36 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-terracotta/20 to-peach/45 blur-[30px] sm:blur-[40px]"
        />

        {/* Subtle Luxury Grid Lines Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Split Layout: Image on Left / Text on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Side: Animated Botanical Image with Luxury Frame & Breathing Effect */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center group"
          >
            {/* Backing Animated Gradient Glow Frame */}
            <motion.div 
              animate={{ rotate: [-2, 2, -2], scale: [0.98, 1.02, 0.98] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-2 bg-gradient-to-br from-peach/70 to-terracotta/30 rounded-[2.5rem] blur-lg opacity-75" 
            />
            
            {/* Unique Organic Image Frame with Smooth Floating & Hover Animation */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-md h-[360px] sm:h-[420px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/90 bg-white"
            >
              <img
                src="/home2.jfif" 
                alt="Botanical Essence"
                className="w-full h-full object-cover object-center scale-105 group-hover:scale-115 group-hover:rotate-1 transition-all duration-1000 ease-out"
              />
              
              {/* Luxury Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent opacity-80" />
              
              {/* Floating Interactive Badge with Shimmer */}
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-5 left-5 right-5 p-3.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta shadow-inner">
                    <Leaf className="w-4 h-4 animate-pulse" />
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
            </motion.div>
          </motion.div>

          {/* Right Side: High-End Classic Typography & Scroll-Driven Underline Reveal */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="space-y-3">
              {/* Animated Purity Tag */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 border border-terracotta/20 text-[10px] uppercase tracking-[0.35em] text-terracotta font-bold backdrop-blur-sm"
              >
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                The Purity Manifesto
              </motion.div>

              {/* Scroll-Driven Luxury Statement with Smaller Text Size & Underline Reveal */}
              <motion.h2 
                style={{ opacity: textOpacity }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="font-serif text-xl sm:text-2xl md:text-[1.85rem] text-charcoal font-light leading-[1.45] tracking-wide"
              >
                &quot;We believe true radiance is never synthesized in a laboratory, but carefully cultivated through the{" "}
                
                {/* Highlight Word 1 with Scroll-Driven Left-to-Right Underline */}
                <span className="relative inline-block pb-0.5 mx-1 font-normal cursor-pointer">
                  <span className="relative z-10 italic">intelligent harmony</span>
                  {/* Underline animating from left to right */}
                  <motion.span 
                    style={{ scaleX: underlineScaleX, transformOrigin: "left" }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-terracotta to-peach rounded-full"
                  />
                </span>{" "}
                
                of{" "}
                
                {/* Highlight Word 2 with Scroll-Driven Left-to-Right Underline */}
                <span className="relative inline-block pb-0.5 mx-1 font-normal cursor-pointer">
                  <span className="relative z-10 italic">raw botanical science</span>
                  {/* Underline animating from left to right */}
                  <motion.span 
                    style={{ scaleX: underlineScaleX, transformOrigin: "left" }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-terracotta to-peach rounded-full"
                  />
                </span>{" "}
                
                and skin physiology.&quot;
              </motion.h2>
            </div>

            {/* Growth Line Divider with Shimmer */}
            <div className="relative w-28 h-[2px] bg-borderSubtle/60 overflow-hidden rounded-full">
              <motion.div 
                initial={{ x: "-100%" }}
                whileInView={{ x: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta to-transparent"
              />
            </div>

            {/* Refined Subtext Features with Interactive Hover Micro-Interactions */}
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