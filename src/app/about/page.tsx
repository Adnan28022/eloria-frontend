"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      <Navbar />

      <main className="flex-grow">
        <PageHero 
          titleStart="Our"
          titleHighlight="Story"
          description="Rooted in nature, perfected by science. Discover the philosophy and the people behind Eloria's transformational skincare formulations."
          backgroundImage="/AboutHero.jfif"
          align="center"
          overlayOpacity={0.4}
          height="sm"
          fixedBackground={true}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" }
          ]}
        />
        <section className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
          {/* Mission & Philosophy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-6 leading-tight">
                Beauty without <br /> compromise.
              </h2>
              <p className="text-charcoal/70 font-light leading-relaxed mb-6">
                Eloria was born from a simple belief: skincare should be an uncompromising ritual. We reject the false dichotomy between natural purity and clinical efficacy. 
              </p>
              <p className="text-charcoal/70 font-light leading-relaxed">
                By harnessing the most potent botanical extracts and elevating them with advanced dermatological science, we create formulas that respect your skin's delicate ecosystem while delivering undeniable, transformative results.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl bg-[#f4efe6]"
            >
              <img src="/home2.jfif" alt="Botanical Ingredients" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Core Values */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <span className="text-[10px] uppercase tracking-[0.3em] text-terracotta font-medium block mb-4">Our Pillars</span>
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal">The Eloria Standard</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                { title: "Clinically Proven", desc: "Every formulation undergoes rigorous dermatological testing to ensure efficacy without irritation." },
                { title: "Pure Botanicals", desc: "We source organic, wild-harvested ingredients at their peak potency from sustainable growers worldwide." },
                { title: "Consciously Crafted", desc: "100% vegan, cruelty-free, and packaged in recycled, endlessly recyclable glass." }
              ].map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="bg-white p-10 rounded-2xl shadow-sm border border-charcoal/5 text-center flex flex-col items-center group hover:border-terracotta/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center mb-6 text-terracotta group-hover:scale-110 transition-transform duration-500">
                    <span className="font-serif text-xl">{i + 1}</span>
                  </div>
                  <h3 className="font-serif text-xl mb-4">{val.title}</h3>
                  <p className="text-sm text-charcoal/60 font-light leading-relaxed">{val.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats/Trust Section */}
          <div className="py-20 border-y border-charcoal/10 my-32">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
              {[
                { number: "10k+", label: "Radiant Faces" },
                { number: "100%", label: "Vegan & Cruelty-Free" },
                { number: "0%", label: "Synthetic Fragrances" },
                { number: "4.9", label: "Average Rating" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col gap-2"
                >
                  <span className="font-serif text-4xl md:text-5xl text-charcoal">{stat.number}</span>
                  <span className="text-[10px] uppercase tracking-widest text-charcoal/60">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center bg-charcoal text-ivory rounded-3xl p-16 md:p-24 overflow-hidden relative"
          >
            <div className="absolute inset-0 opacity-10 bg-[url('/bubble.png')] bg-cover bg-center mix-blend-overlay" />
            <div className="relative z-10">
              <h2 className="font-serif text-3xl md:text-5xl mb-6">Begin Your Ritual</h2>
              <p className="text-ivory/70 font-light max-w-xl mx-auto mb-10">
                Discover the transformative power of nature, elevated by science. Your journey to luminous, resilient skin starts here.
              </p>
              <a href="/shop" className="inline-block bg-ivory text-charcoal px-10 py-4 uppercase tracking-[0.2em] text-[10px] font-medium hover:bg-terracotta hover:text-ivory transition-colors">
                Explore the Collection
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
