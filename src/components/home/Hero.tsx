"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { FaLinkedinIn, FaTwitter, FaInstagram, FaFacebookF } from "react-icons/fa";
import { preload } from "react-dom";

export const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Preload LCP hero image
  useEffect(() => {
    preload('/hero-bg.jfif', { as: 'image', fetchPriority: 'high' });
  }, []);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mvY, { stiffness: 40, damping: 25 });
  
  const imgX = useTransform(springX, [-1, 1], ["-2.5%", "2.5%"]);
  const imgY = useTransform(springY, [-1, 1], ["-1.8%", "1.8%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    mvX.set(relX * 2);
    mvY.set(relY * 2);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center justify-between selection:bg-peach/30 bg-charcoal"
    >
      {/* Background Image with Enhanced Smooth Mouse Parallax */}
      <motion.div
        style={{
          x: imgX,
          y: imgY,
        }}
        className="absolute inset-[-10%] w-[120%] h-[120%] z-0"
        aria-hidden="true"
      >
        <img 
          src="/hero-bg.jfif" 
          alt="Eloria natural skincare background"
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover object-center pointer-events-none"
        />
      </motion.div>

      {/* Cinematic Overlay & Vignette */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/65 via-black/25 to-black/40 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/55 via-transparent to-black/30 pointer-events-none" />

      {/* --- FIXED RIGHT-SIDE WHITE SOCIAL MEDIA ICONS --- */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3">
        {[
          { icon: FaLinkedinIn, href: "#" },
          { icon: FaTwitter, href: "#" },
          { icon: FaInstagram, href: "#" },
          { icon: FaFacebookF, href: "#" },
        ].map((social, idx) => {
          const IconComponent = social.icon;
          return (
            <Link
              key={idx}
              href={social.href}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-white/40 flex items-center justify-center text-charcoal hover:bg-terracotta hover:text-ivory transition-all duration-300 shadow-xl hover:scale-110"
            >
              <IconComponent className="w-4 h-4" />
            </Link>
          );
        })}
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-24 md:py-32 pointer-events-auto">
        
        {/* Bottom Area: Large Heading + Contact Pill Button */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between w-full gap-8">
          
          {/* Main Headline */}
          <div className="max-w-3xl space-y-4">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[4.2rem] text-ivory leading-[1.08] font-normal tracking-tight">
              <span className="block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="block drop-shadow-md"
                >
                  Achieving Your Skin&apos;s
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="block drop-shadow-md text-peach italic font-light"
                >
                  Natural Radiance
                </motion.span>
              </span>
            </h1>

            {/* Luxury Call-To-Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
            >
              <Link
                href="/shop"
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-terracotta hover:bg-[#c26243] text-white text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold rounded-full shadow-[0_8px_25px_rgba(217,119,87,0.35)] hover:shadow-terracotta/40 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Explore Rituals
              </Link>
              <Link
                href="/bundles"
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/40 text-white text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
              >
                View Bundles
              </Link>
            </motion.div>
          </div>

        </div>

      </div>

      {/* Mobile Social Icons Bar (Horizontal above dock) */}
      <div className="md:hidden absolute bottom-24 inset-x-0 z-30 flex items-center justify-center gap-3 pointer-events-auto">
        {[
          { icon: FaLinkedinIn, href: "#" },
          { icon: FaTwitter, href: "#" },
          { icon: FaInstagram, href: "#" },
          { icon: FaFacebookF, href: "#" },
        ].map((social, idx) => {
          const IconComponent = social.icon;
          return (
            <Link
              key={idx}
              href={social.href}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-charcoal shadow-md"
            >
              <IconComponent className="w-3.5 h-3.5" />
            </Link>
          );
        })}
      </div>
    </section>
  );
};