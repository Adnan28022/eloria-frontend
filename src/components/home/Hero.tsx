"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { FaLinkedinIn, FaTwitter, FaInstagram, FaFacebookF } from "react-icons/fa";
import { ArrowDown } from "lucide-react";

export const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Enhanced smoother and wider motion values for a pronounced hover parallax effect
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mvY, { stiffness: 40, damping: 25 });
  
  // Increased range for a more dynamic and smooth background drift
  const imgX = useTransform(springX, [-1, 1], [-25, 25]);
  const imgY = useTransform(springY, [-1, 1], [-18, 18]);

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
      className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center justify-between selection:bg-peach/30"
    >
      {/* Background Image with Enhanced Smooth Mouse Parallax */}
      <motion.div
        style={{
          x: imgX,
          y: imgY,
          backgroundImage: "url('/hero-bg.jfif')",
        }}
        className="absolute inset-[-8%] scale-110 bg-cover bg-center transition-transform duration-300 ease-out"
        aria-hidden="true"
      />

      {/* Cinematic Overlay & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/30" />

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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-24 md:py-32">
        
        {/* Bottom Area: Large Heading + Contact Pill Button */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between w-full gap-8">
          
          {/* Main Headline matching reference image */}
          <div className="max-w-3xl space-y-2">
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
          </div>

        </div>

      </div>

      {/* Mobile Social Icons Bar (Horizontal at bottom above dock) */}
      <div className="md:hidden absolute bottom-16 inset-x-0 z-30 flex items-center justify-center gap-4">
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