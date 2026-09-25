"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  Search, 
  ShoppingBag, 
  X, 
  ChevronRight, 
  Heart, 
  Sparkles, 
  Phone, 
  Mail, 
  ArrowRight,
  Home,
  Gift,
  Info
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { publicApi } from "@/lib/api";

const NAV_LINKS = [
  { href: "/", label: "Home", fullLabel: "Home", icon: Home },
  { href: "/shop", label: "Shop", fullLabel: "Shop", icon: Sparkles },
  { href: "/bundles", label: "Bundles", fullLabel: "Bundles & Kits", badge: "Save", icon: Gift },
  { href: "/about", label: "About", fullLabel: "About", icon: Info },
  { href: "/contact", label: "Contact", fullLabel: "Contact", icon: Phone },
];

export const Navbar: React.FC = () => {
  const { cartCount, openCart } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  const pathname = usePathname();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu on page navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

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
          className={`max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative flex items-center justify-between transition-[height] duration-500 ${
            isScrolled ? "h-16 md:h-20" : "h-20 md:h-24"
          }`}
        >
          {/* Mobile & Tablet Header (< xl screens): Clean Logo in Center, Search Left, Wishlist & Cart Right */}
          <div className="flex xl:hidden items-center justify-between w-full">
            {/* Left: Menu & Search */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
                className={`p-2 rounded-xl transition-colors duration-200 ${textColor} hover:text-terracotta active:scale-95`}
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className={`p-2 rounded-xl transition-colors ${textColor} hover:text-terracotta`}
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Center: Brand Logo (Guaranteed clear, no navitems on top of it) */}
            <Link href="/" className="flex items-center group py-1">
              <img
                src={isScrolled ? "/logo-bg.png" : "/logo-white.png"}
                alt="Eloria Skincare"
                className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
                  isScrolled ? "h-8 sm:h-9 md:h-11" : "h-10 sm:h-11 md:h-13"
                }`}
              />
            </Link>

            {/* Right: Wishlist & Bag */}
            <div className={`flex items-center gap-1 sm:gap-2 ${textColor}`}>
              <button
                onClick={openWishlist}
                aria-label="Wishlist"
                className="relative p-2 hover:text-terracotta transition-colors"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-terracotta text-white rounded-full text-[8px] flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={openCart}
                aria-label="Cart"
                className="relative p-2 hover:text-terracotta transition-colors"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-terracotta text-white rounded-full text-[9px] flex items-center justify-center font-bold shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Large Desktop Header (>= xl screens): Nav Links Left, Logo Center, Actions Right */}
          <div className="hidden xl:flex items-center justify-between w-full">
            {/* Desktop Nav Links */}
            <nav className={`flex items-center space-x-7 text-[11px] uppercase tracking-[0.22em] font-medium transition-colors duration-500 ${textColor}`}>
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group hover:text-terracotta transition-colors py-1"
                >
                  <span>{item.fullLabel || item.label}</span>
                  {item.badge && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-terracotta text-white text-[8px] rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute left-0 -bottom-1 w-0 h-px bg-terracotta transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Desktop Logo (Centered) */}
            <Link href="/" className="flex items-center px-6 group shrink-0">
              <img
                src={isScrolled ? "/logo-bg.png" : "/logo-white.png"}
                alt="Eloria Skincare"
                className={`w-auto object-contain transition-all duration-500 group-hover:scale-105 ${
                  isScrolled ? "h-10 md:h-12" : "h-13 md:h-16"
                }`}
              />
            </Link>

            {/* Desktop Right Actions */}
            <div className={`flex items-center space-x-5 transition-colors duration-500 ${textColor}`}>
              <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:text-terracotta transition-colors" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
              <button onClick={openWishlist} className="relative p-2 hover:text-terracotta transition-colors" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-terracotta text-ivory rounded-full text-[9px] flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button onClick={openCart} className="relative p-2 hover:text-terracotta transition-colors" aria-label="Cart">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-charcoal text-ivory rounded-full text-[9px] flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile & Tablet Bottom Navigation Bar (Visible on < xl screens, strictly NO logo) */}
      <nav 
        aria-label="Mobile and Tablet Bottom Navigation"
        className="fixed bottom-0 inset-x-0 z-40 xl:hidden bg-[#FAF7F2]/95 backdrop-blur-xl border-t border-[#E8E0D5] shadow-[0_-4px_25px_rgba(0,0,0,0.06)] py-2 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-5 items-center justify-items-center max-w-lg mx-auto">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl relative transition-all group w-full"
              >
                {/* Active Pill Glow */}
                {isActive && (
                  <motion.div
                    layoutId="activeBottomNav"
                    className="absolute inset-0 bg-terracotta/10 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}

                {/* Badge for Bundles */}
                {item.badge && (
                  <span className="absolute top-0.5 right-2 sm:right-3 bg-terracotta text-white text-[7px] sm:text-[8px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                    {item.badge}
                  </span>
                )}

                <IconComponent
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-terracotta stroke-[2.3]" : "text-charcoal/50 group-hover:text-charcoal"
                  }`}
                />
                
                <span
                  className={`text-[9px] sm:text-[10px] tracking-wider uppercase mt-1 transition-colors ${
                    isActive ? "text-terracotta font-bold" : "text-charcoal/60 font-medium"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active glowing dot */}
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-terracotta mt-0.5 shadow-[0_0_4px_rgba(217,119,87,0.8)]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Luxury Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-charcoal/60 backdrop-blur-md z-[100] md:hidden"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-[340px] bg-[#FAF7F2] text-charcoal shadow-2xl z-[101] flex flex-col justify-between overflow-hidden md:hidden border-r border-[#E8E0D5]"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#E8E0D5] flex items-center justify-between bg-white/50">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <img src="/logo-bg.png" alt="Eloria" className="h-9 w-auto object-contain" />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 py-8 px-6 overflow-y-auto space-y-1">
                <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/40 font-bold mb-4 px-2">
                  Navigation
                </p>

                {NAV_LINKS.map((item, idx) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx + 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-3.5 px-4 rounded-2xl transition-all ${
                          isActive
                            ? "bg-terracotta text-white font-semibold shadow-[0_4px_16px_rgba(194,142,121,0.35)]"
                            : "text-charcoal/80 hover:bg-white hover:text-terracotta"
                        }`}
                      >
                        <span className="font-serif text-xl tracking-wide">{item.label}</span>
                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isActive ? "bg-white text-terracotta" : "bg-terracotta/15 text-terracotta"
                            }`}>
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className={`w-4 h-4 ${isActive ? "text-white" : "text-charcoal/30"}`} />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}

                <div className="pt-6 mt-6 border-t border-[#E8E0D5]/70 space-y-2">
                  {/* Quick Cart & Wishlist Links */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openCart();
                    }}
                    className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-charcoal/70 hover:bg-white transition-colors text-sm font-medium"
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingBag className="w-4 h-4 text-terracotta" /> Shopping Bag
                    </span>
                    <span className="bg-charcoal text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {cartCount} items
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openWishlist();
                    }}
                    className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-charcoal/70 hover:bg-white transition-colors text-sm font-medium"
                  >
                    <span className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-terracotta" /> Saved Wishlist
                    </span>
                    <span className="bg-terracotta/15 text-terracotta text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  </button>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 bg-white/70 border-t border-[#E8E0D5] space-y-3">
                <div className="flex items-center gap-2 text-xs text-charcoal/60">
                  <Sparkles className="w-3.5 h-3.5 text-terracotta shrink-0" />
                  <span>Free Express Delivery Across Pakistan</span>
                </div>
                <div className="text-[11px] text-charcoal/50">
                  Natural & Cruelty-Free Luxury Skincare
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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