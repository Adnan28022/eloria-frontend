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
  const productHref = `/product/${product.slug || product._id || product.id}`;
  
  const originalPrice = product.originalPrice;
  const currentPrice = product.price;

  return (
    <div className="group flex flex-col relative h-full">
      {/* Image container */}
      <div
        className="relative w-full aspect-[3/4] bg-[#f4efe6] overflow-hidden mb-3 sm:mb-4 rounded-2xl cursor-pointer shadow-xs shrink-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={productHref} className="absolute inset-0 block">
          <img
            src={product.image || product.images?.[0] || "/prod-1.png"}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/prod-1.png";
            }}
            className={`w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out absolute inset-0 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
          />
          <img
            src={product.images?.[1] || product.secondaryImage || product.image || "/prod-1.png"}
            alt={`${product.name} alternate`}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/prod-1.png";
            }}
            className={`w-full h-full object-cover object-center transition-all duration-700 ease-in-out absolute inset-0 group-hover:scale-105 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none z-10">
          {(product.isBestSeller || product.isNew) && (
            <span className="px-2.5 py-1 bg-ivory/90 backdrop-blur-md text-charcoal text-[9px] uppercase tracking-[0.2em] font-bold rounded-full shadow-xs">
              {product.isBestSeller ? "Bestseller" : "New"}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-20 sm:opacity-0 sm:-translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="w-8 h-8 rounded-full bg-ivory/95 backdrop-blur-md text-charcoal flex items-center justify-center shadow-md hover:bg-terracotta hover:text-ivory transition-colors"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-terracotta text-terracotta" : ""}`} />
          </button>
        </div>

        {/* Quick Add Button Desktop */}
        <div className="hidden sm:block absolute bottom-3 left-3 right-3 z-20 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full bg-ivory/95 backdrop-blur-md text-charcoal py-3 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-charcoal hover:text-ivory transition-colors flex items-center justify-center gap-1.5 shadow-lg rounded-xl"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Add • {formatPKR(product.price)}</span>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow">
        <Link href={productHref} className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1 sm:gap-2">
          <h3 className="font-serif text-sm sm:text-lg text-charcoal leading-snug group-hover:text-terracotta transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-serif text-sm sm:text-base text-charcoal font-medium">{formatPKR(product.price)}</span>
            {originalPrice && originalPrice > currentPrice && (
              <span className="font-serif text-xs text-charcoal/40 line-through">
                {formatPKR(originalPrice)}
              </span>
            )}
          </div>
        </Link>
        <Link href={productHref}>
          <p className="text-[10px] text-charcoal/60 uppercase tracking-widest font-medium line-clamp-1">
            {product.tagline || product.category}
          </p>
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
            <Plus className="w-3 h-3" />
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};