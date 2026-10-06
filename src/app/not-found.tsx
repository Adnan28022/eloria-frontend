"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      <main className="flex-grow flex items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('/bubble.png')] bg-cover bg-center pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 max-w-lg mx-auto bg-white/50 p-12 rounded-[3rem] backdrop-blur-md shadow-xl border border-charcoal/5"
        >
          <div className="font-serif text-[120px] leading-none mb-4 text-terracotta/20">404</div>
          <h1 className="font-serif text-3xl md:text-5xl mb-6 text-charcoal">Lost in the glow</h1>
          <p className="text-charcoal/60 font-light mb-10 text-sm md:text-base leading-relaxed">
            The page you are looking for has vanished into thin air. Perhaps it's taking a spa day. Let's get you back to finding your perfect routine.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border border-charcoal text-charcoal px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-medium hover:bg-charcoal hover:text-ivory transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Go Home
            </button>
            <Link 
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-charcoal text-ivory px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-medium hover:bg-terracotta transition-colors shadow-xl"
            >
              <ShoppingBag className="w-4 h-4" /> Shop Now
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
