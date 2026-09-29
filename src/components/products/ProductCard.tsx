"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { Product } from "@/types";
import { formatPKR } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const productHref = `/product/${product.slug || product.id}`;

  return (
    <div className="group flex flex-col relative">
      {/* Image container */}
      <div
        className="relative w-full aspect-[3/4] bg-[#f4efe6] overflow-hidden mb-3 sm:mb-4 rounded-2xl cursor-pointer shadow-xs"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={productHref} className="absolute inset-0 block">
          <img
            src={isHovered ? (product.secondaryImage || product.image || "/prod-1.png") : (product.image || "/prod-1.png")}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/prod-1.png";
            }}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none z-10">
          {product.isBestSeller && (
            <span className="bg-charcoal text-ivory text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 font-medium rounded-full shadow-xs">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="bg-terracotta text-ivory text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 font-medium rounded-full shadow-xs">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button (Always accessible on touch, hover on desktop) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-3 right-3 p-2 bg-ivory/90 backdrop-blur-sm text-charcoal hover:text-terracotta transition-colors rounded-full shadow-sm z-10"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-terracotta text-terracotta" : ""}`} />
        </button>

        {/* Quick Add Button */}
        <div className="hidden sm:block absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full bg-ivory/95 backdrop-blur-md text-charcoal py-2.5 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-charcoal hover:text-ivory transition-colors flex items-center justify-center gap-1.5 shadow-md rounded-xl"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Add • {formatPKR(product.price)}</span>
          </button>
        </div>
      </div>

      {/* Info */}
      <Link href={productHref} className="space-y-1">
        <div className="flex items-center justify-between text-xs text-charcoal/60">
          <span>★ {product.rating || "5.0"} ({product.reviewCount || 12})</span>
          <span className="font-serif text-charcoal font-medium">{formatPKR(product.price)}</span>
        </div>
        <h3 className="font-serif text-base sm:text-lg text-charcoal group-hover:text-terracotta transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-charcoal/50 line-clamp-1">{product.tagline || product.category}</p>
      </Link>

      {/* Mobile Quick Add Button */}
      <div className="sm:hidden mt-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full py-1.5 bg-[#FAF7F2] hover:bg-terracotta hover:text-white border border-[#E8E0D5] text-charcoal rounded-lg text-[9px] uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1"
        >
          + Add to Bag
        </button>
      </div>
    </div>
  );
};