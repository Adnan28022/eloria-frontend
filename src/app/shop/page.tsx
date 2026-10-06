"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, ChevronDown } from "lucide-react";
import { publicApi } from "@/lib/api";
import { Product } from "@/types";

export default function ShopPage() {
  const { addToCart, openCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["all"]);
  
  // Filters and Sort State
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured"); // featured, price-low, price-high, newest
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch Data
  useEffect(() => {
    setLoading(true);
    publicApi.getProducts()
      .then(res => {
        setProducts(res.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
      
    publicApi.getCategories()
      .then(res => {
        const catNames = res.data.data.map((c: any) => c.slug || c.name);
        setCategories(["all", ...catNames]);
      })
      .catch(() => {});
  }, []);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset page on search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Handle Category Change
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  // Filter and Sort Products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (activeCategory !== "all") {
      result = result.filter(p => (p.category || "").toLowerCase() === activeCategory.toLowerCase());
    }

    // Filter by Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(p => 
        (p.name || "").toLowerCase().includes(q) || 
        (p.tagline || "").toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result.sort((a, b) => {
        // Fallback to sorting by isNew if timestamps aren't available
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0; // Or standard Date sort if createdAt exists
      });
    } // featured = no specific sort beyond default API order + isBestSeller
    else if (sortBy === "featured") {
      result.sort((a, b) => {
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return 0;
      });
    }

    return result;
  }, [products, activeCategory, debouncedSearch, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest" }
  ];

  const handleToggleWishlist = (product: Product) => {
    const pId = product._id || product.id || product.slug;
    if (pId && isInWishlist(pId)) {
      removeFromWishlist(pId);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    openCart();
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      <Navbar />

      <main className="flex-grow pb-20 xl:pb-0">
        <PageHero 
          titleStart="All"
          titleHighlight="Formulations"
          description="Explore our complete collection of scientifically formulated skincare designed to nurture, protect, and restore your skin's natural balance."
          backgroundImage="/ProdHero.jfif"
          align="center"
          overlayOpacity={0.4}
          height="sm"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" }
          ]}
        />
        
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
          
          {/* Controls: Search, Filters, Sort */}
          <div className="flex flex-col gap-8 mb-16 border-b border-charcoal/10 pb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
              
              {/* Left: Title & Search */}
              <div className="space-y-4 w-full lg:w-1/3">
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl text-charcoal">The Collection</h2>
                  <p className="text-charcoal/60 text-sm font-light mt-1">Showing {filteredAndSortedProducts.length} formulations</p>
                </div>
                <div className="relative w-full max-w-md">
                  <input 
                    type="text" 
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent border-b border-charcoal/20 pb-2 pl-8 pr-4 text-sm focus:outline-none focus:border-terracotta transition-colors placeholder:text-charcoal/30"
                  />
                  <Search className="absolute left-0 top-0.5 w-4 h-4 text-charcoal/40" />
                </div>
              </div>

              {/* Right: Sort & Categories */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 w-full lg:w-auto">
                {/* Categories */}
                <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest font-medium text-charcoal/60">
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => handleCategoryChange(cat)}
                      className={`hover:text-terracotta transition-colors capitalize ${activeCategory === cat ? 'text-terracotta border-b border-terracotta' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="relative shrink-0 z-30">
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium border border-charcoal/20 rounded-full px-4 py-2 hover:border-terracotta transition-colors"
                  >
                    <span>Sort: {sortOptions.find(o => o.value === sortBy)?.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isSortOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-ivory border border-charcoal/10 rounded-xl shadow-xl overflow-hidden py-2"
                      >
                        {sortOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs uppercase tracking-widest hover:bg-terracotta/10 transition-colors ${sortBy === option.value ? 'text-terracotta font-bold' : 'text-charcoal/70'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {loading ? (
              Array.from({ length: itemsPerPage }).map((_, idx) => (
                <div key={idx} className="flex flex-col space-y-4 animate-pulse">
                  <div className="bg-[#EDE5DA] aspect-[3/4] rounded-2xl w-full" />
                  <div className="h-4 bg-[#EDE5DA] w-3/4 rounded-md" />
                  <div className="h-3 bg-[#EDE5DA] w-1/2 rounded-md" />
                </div>
              ))
            ) : currentProducts.length > 0 ? (
              currentProducts.map((product, i) => (
                <motion.div
                  key={product._id || product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: (i % itemsPerPage) * 0.05, ease: "easeOut" }}
                >
                  <ProductCard 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={isInWishlist(product._id || product.id || product.slug || '')}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center flex flex-col items-center justify-center space-y-4">
                <Search className="w-12 h-12 text-charcoal/20" />
                <h3 className="font-serif text-2xl text-charcoal">No products found</h3>
                <p className="text-charcoal/60 font-light text-sm max-w-md">
                  We couldn't find anything matching your current filters. Try adjusting your search or category selection.
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("all");
                  }}
                  className="mt-4 px-6 py-2 bg-charcoal text-ivory text-[10px] uppercase tracking-widest rounded-full hover:bg-terracotta transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-charcoal/10">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-charcoal/20 text-charcoal hover:border-terracotta hover:text-terracotta disabled:opacity-30 disabled:hover:border-charcoal/20 disabled:hover:text-charcoal transition-colors"
              >
                &larr;
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-charcoal text-ivory' 
                        : 'text-charcoal/60 hover:bg-charcoal/5'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-charcoal/20 text-charcoal hover:border-terracotta hover:text-terracotta disabled:opacity-30 disabled:hover:border-charcoal/20 disabled:hover:text-charcoal transition-colors"
              >
                &rarr;
              </button>
            </div>
          )}

        </section>
      </main>

      <Footer />
    </div>
  );
}
