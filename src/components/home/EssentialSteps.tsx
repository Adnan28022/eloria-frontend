"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";

const STEPS = [
  {
    n: "1",
    title: "Cleanse",
    sub: "Hydra-Foam Cleanser",
    body: "A recovery-first cleansing step that purifies while preserving the skin barrier from the very first contact. Leaves skin feeling clean and hydrated.",
    img: "/bubble-1.png",
    customClass: "max-w-[120px] lg:max-w-[150px]",
  },
  {
    n: "2",
    title: "Activate",
    sub: "Reset Serum",
    body: "A targeted activation serum that stimulates the skin cells in regaining strength, density and balance — preparing it for sustained resilience.",
    img: "/prod-2.png",
    customClass: "max-w-[120px] lg:max-w-[150px]",
  },
  {
    n: "3",
    title: "Protect",
    sub: "Barrier Fluid",
    body: "A weightless finishing layer that locks in moisture and shields against daily stress, so progress made overnight is never undone.",
    img: "/bubble-3.png",
    customClass: "max-w-[180px] lg:max-w-[240px]",
  },
];

export function EssentialSteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress within the 300vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} className="bg-[#fcfbfa] relative h-[300svh]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
        
        {/* Progress Indicator */}
        <div className="absolute top-24 right-6 md:right-12 z-20 flex flex-col items-center gap-2">
          {STEPS.map((_, i) => {
            const isActive = useTransform(
              scrollYProgress,
              [Math.max(0, (i - 0.1) * 0.33), i * 0.33, (i + 1) * 0.33],
              [0, 1, 0]
            );
            return (
              <motion.div 
                key={i}
                className="w-2 h-2 rounded-full bg-charcoal"
                style={{ 
                  opacity: useTransform(scrollYProgress, 
                    [Math.max(0, (i - 0.5) * 0.33), (i + 0.5) * 0.33], 
                    [0.2, 1]
                  ) 
                }}
              />
            );
          })}
        </div>

        {/* Global Background Bubble */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <img src="/bubble.png" alt="Decoration" className="w-[80vw] md:w-[40vw] max-w-[600px] object-contain" />
        </div>

        {STEPS.map((s, i) => {
          // Calculate when this step is active
          // Step 0: 0.0 to 0.33
          // Step 1: 0.33 to 0.66
          // Step 2: 0.66 to 1.0
          
          const start = i * 0.33;
          const end = (i + 1) * 0.33;
          const peak = start + 0.165;
          
          // Entrance (fade in and move up)
          const opacityIn = useTransform(scrollYProgress, [start, start + 0.08], [0, 1]);
          // Exit (fade out and move up)
          const opacityOut = useTransform(scrollYProgress, [end - 0.08, end], [1, 0]);
          
          // Combine opacities: active between start and end
          const opacity = useTransform(scrollYProgress, 
            [start - 0.01, start + 0.08, end - 0.08, end + 0.01], 
            [0, 1, 1, 0]
          );
          
          const yOffset = useTransform(scrollYProgress,
            [start, peak, end],
            [100, 0, -100]
          );

          const scale = useTransform(scrollYProgress,
            [start, peak, end],
            [0.9, 1, 0.9]
          );

          // Alternating layout on desktop
          const onRight = i % 2 !== 0;

          return (
            <motion.div
              key={s.title}
              className="absolute inset-0 flex flex-col-reverse md:flex-row items-center justify-center w-full max-w-[1200px] mx-auto px-6 md:px-12 py-20 gap-8 md:gap-16 pointer-events-none"
              style={{
                opacity,
                y: yOffset,
                scale,
                willChange: "transform, opacity",
                zIndex: useTransform(scrollYProgress, (v) => (v >= start && v < end ? 10 : 0))
              }}
            >
              {/* Text Side */}
              <div className={`w-full md:w-1/2 flex flex-col items-center text-center md:items-start md:text-left ${onRight ? 'md:order-2' : ''} pointer-events-auto`}>
                <span className="text-6xl md:text-[110px] lg:text-[150px] leading-none text-[#d49b91] font-light tracking-tighter select-none mb-2 md:mb-6">
                  {s.n}
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-[38px] tracking-[0.05em] text-[#2b2b2b] font-normal mb-1 md:mb-2 uppercase">
                  {s.title}
                </h3>
                <p className="text-[10px] md:text-[11px] lg:text-xs tracking-[0.2em] text-[#888] font-semibold mb-3 md:mb-6 uppercase">
                  {s.sub}
                </p>
                <p className="text-[#666] text-xs sm:text-sm lg:text-base max-w-md font-light leading-relaxed">
                  {s.body}
                </p>
                <Link
                  href="/shop"
                  className="mt-6 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white px-8 py-3 text-xs tracking-[0.2em] uppercase transition-colors rounded-full"
                >
                  Shop Now
                </Link>
              </div>

              {/* Image Side */}
              <div className={`w-full md:w-1/2 flex items-center justify-center relative h-[40vh] md:h-[60vh] pointer-events-auto`}>
                <img
                  src={s.img}
                  alt={s.title}
                  className={`object-contain h-full max-h-[400px] md:max-h-[600px] drop-shadow-2xl ${s.customClass || ''}`}
                  loading="lazy"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}