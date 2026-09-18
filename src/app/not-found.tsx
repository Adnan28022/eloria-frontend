"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.back();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('/bubble.png')] bg-cover bg-center pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 max-w-lg mx-auto"
        >
          <div className="font-serif text-[120px] leading-none mb-4 text-terracotta/20">404</div>
          <h1 className="font-serif text-3xl md:text-5xl mb-6">Page Not Found</h1>
          <p className="text-charcoal/60 font-light mb-10 text-sm md:text-base leading-relaxed">
            The page you are looking for has vanished into thin air. Don't worry, we are redirecting you back in <span className="font-bold text-terracotta">{countdown}</span> seconds.
          </p>

          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-charcoal text-ivory px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-medium hover:bg-terracotta transition-colors shadow-xl"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back Now
          </button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
