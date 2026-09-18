"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { Product } from "@/types";

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

  return (
    <div className="group flex flex-col relative">
      {/* Image container */}
      <div
        className="relative w-full aspect-[3/4] bg-borderSubtle overflow-hidden mb-4 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/shop/${product.id}`} className="absolute inset-0 block">
          <img
            src={isHovered ? product.secondaryImage : product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          {product.isBestSeller && (
            <span className="bg-charcoal text-ivory text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 font-medium">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="bg-terracotta text-ivory text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 font-medium">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleWishlist(product);
          }}
          className="absolute top-3 right-3 p-2.5 bg-ivory/80 backdrop-blur-sm text-charcoal hover:text-terracotta transition-colors rounded-full shadow-sm"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-terracotta text-terracotta" : ""}`} />
        </button>

        {/* Quick Add Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-ivory/95 backdrop-blur-md text-charcoal py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-charcoal hover:text-ivory transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Add • ${product.price}</span>
          </button>
        </div>
      </div>

      {/* Info */}
      <Link href={`/shop/${product.id}`} className="space-y-1">
        <div className="flex items-center justify-between text-xs text-taupe">
          <span>★ {product.rating} ({product.reviewCount})</span>
          <span className="font-serif text-charcoal font-medium">${product.price}</span>
        </div>
        <h3 className="font-serif text-lg text-charcoal group-hover:text-terracotta transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-taupe line-clamp-1">{product.tagline}</p>
      </Link>
    </div>
  );
};