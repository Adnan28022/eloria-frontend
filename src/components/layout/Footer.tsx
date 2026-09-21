"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { FaInstagram, FaFacebookF, FaTwitter, FaPinterestP } from "react-icons/fa";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ivory text-charcoal relative overflow-hidden border-t border-borderSubtle">
      {/* Enhanced Fluid Animated Background Glow / Mesh Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.35, 0.2],
          x: [0, 80, -40, 0],
          y: [0, -50, 30, 0]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-peach/40 blur-[130px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, -70, 50, 0],
          y: [0, 60, -30, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full bg-terracotta/25 blur-[150px] pointer-events-none"
      />

      {/* Subtle Watermark Logo in Background */}
      <div 
        className="absolute right-[-2%] bottom-[5%] w-[400px] h-[400px] bg-no-repeat bg-contain opacity-[0.025] pointer-events-none select-none z-0"
        style={{ backgroundImage: "url('/logo-white.png')" }}
        aria-hidden="true"
      />

      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-terracotta/40 to-transparent z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-charcoal/10">
          
          {/* Brand Logo & Info (Span 4) - Strictly Centered Logo Alignment */}
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-6">
            <Link href="/" className="inline-block group">
              <motion.img
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                src="/eloria-logo.png"
                alt="Eloria Skincare"
                className="h-24 md:h-28 w-auto object-contain mx-auto"
              />
            </Link>
            <p className="text-charcoal/70 text-sm font-light leading-relaxed max-w-sm mx-auto">
              High-potency bio-actives and cold-pressed botanical oils, thoughtfully formulated to restore your skin&apos;s natural harmony.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center justify-center space-x-3 pt-2">
              {[
                { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
                { icon: <FaFacebookF />, href: "https://facebook.com", label: "Facebook" },
                { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter" },
                { icon: <FaPinterestP />, href: "https://pinterest.com", label: "Pinterest" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal hover:bg-terracotta hover:text-ivory hover:border-terracotta transition-colors duration-300 shadow-sm bg-ivory/60 backdrop-blur-sm"
                  aria-label={social.label}
                >
                  <span className="text-sm">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links 1 (Span 2) */}
          <div className="lg:col-span-2 space-y-4 text-center lg:text-left">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-medium text-charcoal">
              Exploration
            </h4>
            <ul className="space-y-3 text-sm font-light">
              {["Shop All", "Our Philosophy", "Botanical Journal", "About Us"].map((item, idx) => {
                const hrefs = ["/shop", "/about", "/journal", "/about"];
                return (
                  <li key={item}>
                    <Link
                      href={hrefs[idx]}
                      className="text-charcoal/80 hover:text-terracotta transition-colors relative group inline-block py-0.5"
                    >
                      <span>{item}</span>
                      <span className="absolute left-0 bottom-0 w-0 h-px bg-terracotta transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Links 2 (Span 2) */}
          <div className="lg:col-span-2 space-y-4 text-center lg:text-left">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-medium text-charcoal">
              Customer Care
            </h4>
            <ul className="space-y-3 text-sm font-light">
              {["Contact Us", "Shipping & Returns", "FAQ", "Privacy Policy"].map((item, idx) => {
                const hrefs = ["/contact", "/shipping", "/faq", "/privacy"];
                return (
                  <li key={item}>
                    <Link
                      href={hrefs[idx]}
                      className="text-charcoal/80 hover:text-terracotta transition-colors relative group inline-block py-0.5"
                    >
                      <span>{item}</span>
                      <span className="absolute left-0 bottom-0 w-0 h-px bg-terracotta transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Separate Animated Newsletter Box Card (Span 4) */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="lg:col-span-4 relative group text-left"
          >
            {/* Glowing background container effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-terracotta/25 to-peach/35 rounded-2xl blur-md opacity-40 group-hover:opacity-80 transition duration-500" />
            
            {/* Separate Eye-Friendly Background Tint Card */}
            <div className="relative bg-[#f6f1eb] backdrop-blur-md p-6 md:p-8 rounded-2xl border border-charcoal/10 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-terracotta">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <h4 className="text-[11px] uppercase tracking-[0.3em] font-medium text-charcoal">
                  The Inner Circle
                </h4>
              </div>
              <p className="text-charcoal/75 text-sm font-light leading-relaxed">
                Subscribe to receive private botanical insights, seasonal rituals, and early access to limited releases.
              </p>
              
              <form onSubmit={(e) => e.preventDefault()} className="space-y-3 pt-2">
                <div className="relative group/input">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-ivory border border-charcoal/20 py-3.5 pl-4 pr-12 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-terracotta rounded-xl transition-all duration-300 shadow-inner group-hover/input:border-charcoal/40"
                  />
                  <motion.button
                    whileHover={{ scale: 1.08, backgroundColor: "var(--terracotta, #c86d51)" }}
                    whileTap={{ scale: 0.92 }}
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-charcoal text-ivory rounded-lg flex items-center justify-center transition-colors shadow-md"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
                <span className="text-[10px] text-charcoal/50 uppercase tracking-widest block pt-1">
                  We respect your privacy. Unsubscribe at any time.
                </span>
              </form>
            </div>
          </motion.div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal/60 font-light gap-4">
          <p>© {new Date().getFullYear()} Eloria Skincare. Crafted with purity & nature.</p>
          <div className="flex items-center space-x-6">
            <Link href="/terms" className="hover:text-terracotta transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-terracotta transition-colors">
              Cookie Policy 

              
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};