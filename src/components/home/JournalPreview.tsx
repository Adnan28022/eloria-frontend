"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const articles = [
  {
    id: "1",
    title: "The Science of Skin Barrier Repair",
    excerpt: "Understanding the stratum corneum and how ceramides, fatty acids, and cholesterol work synergistically to protect against trans-epidermal water loss.",
    category: "Ingredient Science",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1000&auto=format&fit=crop",
    date: "Sep 12, 2026"
  },
  {
    id: "2",
    title: "Antioxidants: Beyond Vitamin C",
    excerpt: "Exploring the lesser-known botanical antioxidants that neutralize free radicals and prevent premature oxidative stress on a cellular level.",
    category: "Skin Physiology",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop",
    date: "Aug 28, 2026"
  },
  {
    id: "3",
    title: "Rituals vs. Routines",
    excerpt: "Why the psychological aspect of your skincare regimen is just as important as the active ingredients you apply.",
    category: "Wellness",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1000&auto=format&fit=crop",
    date: "Aug 15, 2026"
  }
];

export const JournalPreview: React.FC = () => {
  return (
    <section className="bg-ivory py-24 md:py-32 border-t border-charcoal/10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal tracking-tight">
              The Botanical <span className="italic text-terracotta">Journal</span>
            </h2>
            <p className="text-charcoal/70 text-sm md:text-base font-light max-w-md">
              Insights on skin physiology, ingredient science, and the rituals that support long-term radiance.
            </p>
          </div>
          <Link
            href="/journal"
            className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] font-medium text-charcoal hover:text-terracotta transition-colors pb-1 border-b border-charcoal/30 hover:border-terracotta"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {articles.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-6">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-medium text-terracotta">
                  <span>{article.category}</span>
                  <span className="w-1 h-1 rounded-full bg-charcoal/20" />
                  <span className="text-charcoal/60">{article.readTime}</span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-charcoal font-medium leading-tight group-hover:text-terracotta transition-colors">
                  {article.title}
                </h3>
                <p className="text-charcoal/70 text-sm font-light leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
