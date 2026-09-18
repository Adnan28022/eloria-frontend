"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Footer } from "@/components/layout/Footer";
import { Product, CartItem } from "@/types";
import { FeaturedRituals } from "@/components/home/FeaturedRituals";
import { BrandTransitionBanner } from "@/components/home/BrandTransitionBanner";
import { EssentialSteps } from "@/components/home/EssentialSteps";
import { JournalPreview } from "@/components/home/JournalPreview";
import { useCart } from "@/context/CartContext";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal pb-16 md:pb-0">
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <Hero />
        <BrandTransitionBanner/>
        <FeaturedRituals/>
        <EssentialSteps/>
        <JournalPreview/>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}