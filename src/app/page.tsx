"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Footer } from "@/components/layout/Footer";

// Lazy load below-the-fold components
const BrandTransitionBanner = dynamic(() => import("@/components/home/BrandTransitionBanner").then(m => m.BrandTransitionBanner));
const FeaturedRituals = dynamic(() => import("@/components/home/FeaturedRituals").then(m => m.FeaturedRituals));
const EssentialSteps = dynamic(() => import("@/components/home/EssentialSteps").then(m => m.EssentialSteps));
const JournalPreview = dynamic(() => import("@/components/home/JournalPreview").then(m => m.JournalPreview));

// A simple skeleton to show while lazy-loading components
const SectionSkeleton = () => (
  <div className="w-full h-[50vh] flex items-center justify-center bg-[#FBF3EC] animate-pulse">
    <div className="w-32 h-32 rounded-full border-4 border-[#C28E79] border-t-transparent animate-spin"></div>
  </div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal pb-20 xl:pb-0">
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Eager loaded above-the-fold content */}
        <Hero />
        
        {/* Lazy loaded below-the-fold content */}
        <Suspense fallback={<SectionSkeleton />}>
          <BrandTransitionBanner />
          <FeaturedRituals />
          <EssentialSteps />
          <JournalPreview />
        </Suspense>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}