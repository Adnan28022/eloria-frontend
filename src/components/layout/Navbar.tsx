"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, ShoppingBag, X, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { publicApi } from "@/lib/api";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/bundles", label: "Bundles & Kits" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const Navbar: React.FC = () => {
  const { cartCount, openCart } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    publicApi.getProducts().then(res => setAllProducts(res.data.data)).catch(() => {});
  }, []);

  const searchResults = allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4);
  const textColor = isScrolled ? "text-charcoal" : "text-ivory";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
          isScrolled
            ? "bg-ivory/95 backdrop-blur-md shadow-sm border-b border-charcoal/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-6 md:px-12 relative flex items-center justify-between transition-[height] duration-500 ${
            isScrolled ? "h-16 md:h-20" : "h-20 md:h-28"
          }`}
        >
          {/* Desktop Nav Links */}
          <nav
            className={`hidden md:flex items-center space-x-8 text-[11px] uppercase tracking-[0.25em] font-medium transition-colors duration-500 ${textColor}`}
          >
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative group hover:text-terracotta transition-colors"
              >
                <span>{item.label}</span>
                <span className="absolute left-0 -bottom-1.5 w-0 h-px bg-terracotta transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center group"
          >
            <img
              src={isScrolled ? "/logo-bg.png" : "/logo-white.png"}
              alt="Eloria Skincare"
              className={`w-auto object-contain transition-all duration-500 group-hover:scale-105 ${
                isScrolled ? "h-9 md:h-11" : "h-11 md:h-16"
              }`}
            />
          </Link>

          {/* Right Actions */}
          <div
            className={`hidden md:flex items-center space-x-5 transition-colors duration-500 ${textColor}`}
          >
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:text-terracotta transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={openWishlist}
              className="relative p-2 hover:text-terracotta transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-terracotta text-ivory rounded-full text-[9px] flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={openCart}
              className="relative p-2 hover:text-terracotta transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-charcoal text-ivory rounded-full text-[9px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right Icons */}
          <div className={`flex md:hidden items-center gap-3 ${textColor}`}>
            <button onClick={() => setIsSearchOpen(true)} aria-label="Search" className="p-1">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={openCart} aria-label="Bag" className="relative p-1">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-terracotta text-ivory rounded-full text-[8px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Search Fullscreen Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-ivory/95 backdrop-blur-md flex flex-col"
          >
            <div className="flex justify-end p-6 md:p-10">
              <button onClick={() => setIsSearchOpen(false)} className="text-charcoal/50 hover:text-charcoal">
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="flex-1 max-w-4xl w-full mx-auto px-6 pt-10">
              <div className="relative border-b-2 border-charcoal/20 pb-4 mb-10 group focus-within:border-terracotta transition-colors">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-charcoal/40 group-focus-within:text-terracotta transition-colors" />
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?" 
                  className="w-full bg-transparent outline-none pl-14 text-2xl md:text-4xl font-serif text-charcoal placeholder:text-charcoal/20"
                />
              </div>

              {searchQuery && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {searchResults.map(product => (
                    <Link href={`/product/${product.slug}`} key={product._id || product.id} onClick={() => setIsSearchOpen(false)}>
                      <div className="group cursor-pointer">
                        <div className="aspect-square bg-[#f4efe6] rounded-xl overflow-hidden mb-4">
                          <img src={product.image || product.images?.[0] || "/prod-1.png"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h3 className="font-serif text-charcoal group-hover:text-terracotta transition-colors">{product.name}</h3>
                        <p className="text-[10px] text-charcoal/50 uppercase tracking-widest mt-1">{(product.price).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }).replace('PKR', 'Rs')}</p>
                      </div>
                    </Link>
                  ))}
                  {searchResults.length === 0 && (
                    <div className="col-span-full text-center text-charcoal/40 mt-10 font-serif text-xl">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};