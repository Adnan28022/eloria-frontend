"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Plus, Minus, Trash2, User, Phone, MapPin, Receipt, Tag, ArrowRight, Printer, CheckCircle2 } from "lucide-react";
import { publicApi, adminApi, formatPKR } from "@/lib/api";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export default function POSPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Cart & POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", address: "", city: "" });
  const [shippingRate, setShippingRate] = useState(0); // Default to Walk-in (0)
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountType, setDiscountType] = useState<"fixed"|"percent">("fixed");
  const [amountTendered, setAmountTendered] = useState<string>("");
  const [orderNotes, setOrderNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          adminApi.getProducts(),
          adminApi.getCategories()
        ]);
        setProducts(prodRes.data.data);
        setCategories(catRes.data.data);
      } catch (err) {
        toast.error("Failed to load POS data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  const addToCart = (product: any) => {
    if (product.stock <= 0) return toast.error("Out of stock");
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error("Max stock reached");
          return prev;
        }
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { _id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1, stock: product.stock }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item._id === id) {
        const newQ = item.quantity + delta;
        if (newQ > item.stock) { toast.error("Max stock reached"); return item; }
        if (newQ < 1) return item;
        return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCustomer({ name: "", email: "", phone: "", address: "", city: "" });
    setDiscountValue(0);
    setAmountTendered("");
    setOrderNotes("");
    setShippingRate(0);
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = discountType === "fixed" ? discountValue : (subtotal * (discountValue / 100));
  const total = Math.max(0, subtotal - discountAmount) + shippingRate;
  const changeDue = amountTendered ? Math.max(0, Number(amountTendered) - total) : 0;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Cart is empty");
    
    setSubmitting(true);
    try {
      const orderData = {
        customer: {
          name: customer.name || "Walk-in Customer",
          email: customer.email || "pos@eloria.com",
          phone: customer.phone || "00000000000",
        },
        shippingAddress: {
          address: customer.address || "In-Store Purchase",
          city: customer.city || "Store Location",
          postalCode: "00000",
          country: "Pakistan"
        },
        items: cart.map(item => ({
          product: item._id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal,
        discount: discountAmount,
        shipping: shippingRate,
        total,
        paymentMethod: "cash_on_delivery",
        notes: orderNotes
      };

      const res = await publicApi.createOrder(orderData);
      setOrderSuccess({ ...res.data.data, changeDue, amountTendered });
      toast.success("Order completed successfully!");
      clearCart();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-charcoal/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 border-[8px] border-white shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-3xl text-charcoal mb-2">Order Successful!</h2>
          <p className="text-charcoal/50 mb-8">Order ID: <span className="font-mono text-charcoal font-bold">{orderSuccess.orderId}</span></p>
          
          <div className="bg-[#fcfbf9] rounded-2xl p-6 mb-8 text-left border border-charcoal/5 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-charcoal/60">Total Amount:</span>
              <span className="font-serif text-lg text-charcoal">{formatPKR(orderSuccess.total)}</span>
            </div>
            {orderSuccess.amountTendered && (
              <>
                <div className="flex justify-between items-center text-sm border-t border-charcoal/5 pt-3">
                  <span className="text-charcoal/60">Cash Tendered:</span>
                  <span className="font-medium text-charcoal">{formatPKR(Number(orderSuccess.amountTendered))}</span>
                </div>
                <div className="flex justify-between items-center text-sm bg-green-50/50 p-2 rounded-lg mt-1">
                  <span className="font-bold text-green-700">Change Due:</span>
                  <span className="font-serif text-lg font-bold text-green-700">{formatPKR(orderSuccess.changeDue)}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-4">
            <button onClick={() => window.print()} className="flex-1 py-3.5 bg-white border border-charcoal/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-charcoal/5 transition-colors flex items-center justify-center gap-2 text-charcoal">
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
            <button onClick={() => setOrderSuccess(null)} className="flex-1 py-3.5 bg-charcoal text-ivory rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-terracotta transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> New Order
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto pb-6">
      
      {/* Left Area: Products & Categories */}
      <motion.div variants={itemVariants} className="flex-1 bg-white rounded-3xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border border-charcoal/5 flex flex-col overflow-hidden relative">
        <div className="p-4 sm:p-6 border-b border-charcoal/5 bg-[#fcfbf9] shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-5">
            <div>
              <h1 className="font-serif text-3xl text-charcoal flex items-center gap-3"><ShoppingBag className="w-7 h-7 text-terracotta" /> POS Register</h1>
              <p className="text-charcoal/50 text-xs mt-1">Select products to begin checkout.</p>
            </div>
            <div className="relative w-full sm:max-w-xs group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 group-focus-within:text-terracotta transition-colors" />
              <input 
                type="text" 
                placeholder="Scan barcode or search..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="w-full bg-white border border-charcoal/10 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all shadow-sm" 
              />
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
            <button 
              onClick={() => setActiveCategory("All")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${activeCategory === "All" ? "bg-charcoal text-ivory shadow-md" : "bg-white text-charcoal/60 border border-charcoal/10 hover:border-charcoal/20"}`}
            >
              All Items
            </button>
            {categories.map(c => (
              <button 
                key={c._id}
                onClick={() => setActiveCategory(c.slug)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${activeCategory === c.slug ? "bg-charcoal text-ivory shadow-md" : "bg-white text-charcoal/60 border border-charcoal/10 hover:border-charcoal/20"}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-charcoal/[0.01]">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-charcoal/5 rounded-2xl animate-pulse" />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-charcoal/40">
              <ShoppingBag className="w-12 h-12 mb-4 opacity-50" />
              <p>No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
              <AnimatePresence>
                {filteredProducts.map((p) => (
                  <motion.div 
                    layout 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} 
                    key={p._id} 
                    onClick={() => addToCart(p)}
                    className={`bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden group flex flex-col h-full ${p.stock <= 0 ? 'opacity-50 grayscale border-charcoal/10' : 'border-charcoal/10 hover:border-terracotta/50 hover:shadow-xl hover:shadow-terracotta/10'}`}
                  >
                    <div className="relative aspect-square bg-[#fcfbf9] overflow-hidden">
                      <img src={p.image || '/prod-1.png'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                      {p.stock <= 0 && <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]"><span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Out of Stock</span></div>}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-sm text-terracotta flex items-center justify-center">
                          <Plus className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white z-10 relative border-t border-charcoal/5">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-charcoal/40 mb-0.5">{p.category}</p>
                        <h3 className="text-xs sm:text-sm font-medium text-charcoal leading-tight line-clamp-2">{p.name}</h3>
                      </div>
                      <div className="mt-2 flex items-end justify-between">
                        <span className="font-serif text-sm sm:text-base text-charcoal font-medium">{formatPKR(p.price)}</span>
                        {p.stock > 0 && <span className="text-[9px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-bold">{p.stock} in stock</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Right Area: Detailed Cart & Checkout */}
      <motion.div variants={itemVariants} className="w-full lg:w-[450px] xl:w-[480px] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-charcoal/10 flex flex-col h-full shrink-0 relative z-10 overflow-hidden">
        
        {/* Cart Header */}
        <div className="p-5 border-b border-charcoal/5 bg-[#fcfbf9] shrink-0 flex justify-between items-center">
          <h2 className="font-serif text-xl text-charcoal flex items-center gap-2">Current Order <span className="bg-terracotta text-white text-xs px-2 py-0.5 rounded-full font-sans font-bold">{cart.length}</span></h2>
          <button onClick={clearCart} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Clear</button>
        </div>
        
        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          <AnimatePresence>
            {cart.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-charcoal/30 pt-10">
                <Receipt className="w-16 h-16 mb-4 stroke-1 opacity-50" />
                <p className="text-sm">Register is empty.</p>
                <p className="text-xs mt-1 opacity-70">Scan or select a product to begin.</p>
              </motion.div>
            ) : (
              cart.map((item) => (
                <motion.div layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} key={item._id} className="flex gap-3 p-3 bg-white border border-charcoal/10 rounded-2xl group hover:border-terracotta/30 transition-colors shadow-sm">
                  <img src={item.image || '/prod-1.png'} className="w-16 h-16 rounded-xl object-cover bg-charcoal/5 border border-charcoal/5" alt={item.name} />
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-medium text-charcoal leading-tight line-clamp-2">{item.name}</h4>
                      <button onClick={() => removeFromCart(item._id)} className="text-charcoal/30 hover:text-red-500 transition-colors p-1 -mt-1 -mr-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-serif text-sm font-medium text-terracotta">{formatPKR(item.price * item.quantity)}</span>
                      <div className="flex items-center bg-[#fcfbf9] rounded-lg border border-charcoal/10 overflow-hidden shadow-sm">
                        <button onClick={() => updateQuantity(item._id, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-charcoal/5 transition-colors text-charcoal"><Minus className="w-3 h-3" /></button>
                        <span className="w-8 text-center text-xs font-bold text-charcoal">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} className="w-7 h-7 flex items-center justify-center hover:bg-charcoal/5 transition-colors text-charcoal"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Customer & Totals Area */}
        <div className="border-t border-charcoal/10 bg-[#fcfbf9] shrink-0">
          <div className="p-4 sm:p-5 space-y-4 max-h-[35vh] overflow-y-auto hide-scrollbar">
            {/* Customer Details */}
            <div className="bg-white p-4 rounded-2xl border border-charcoal/5 shadow-sm space-y-3">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-charcoal/50 mb-1 flex items-center gap-1.5"><User className="w-3 h-3" /> Customer Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Name (Optional)" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-lg py-2 px-3 text-xs outline-none focus:border-terracotta" />
                <input type="text" placeholder="Phone (Optional)" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-lg py-2 px-3 text-xs outline-none focus:border-terracotta" />
              </div>
            </div>

            {/* Order Configuration */}
            <div className="bg-white p-4 rounded-2xl border border-charcoal/5 shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/50 mb-1.5 block">Shipping Type</label>
                  <select value={shippingRate} onChange={e => setShippingRate(Number(e.target.value))} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-lg py-2 px-3 text-xs outline-none focus:border-terracotta cursor-pointer font-medium text-charcoal">
                    <option value={0}>Walk-in (In Store)</option>
                    <option value={250}>Standard Delivery (Rs 250)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/50 mb-1.5 block">Discount</label>
                  <div className="flex border border-charcoal/10 rounded-lg overflow-hidden bg-[#fcfbf9] focus-within:border-terracotta transition-colors">
                    <input type="number" min="0" placeholder="0" value={discountValue || ''} onChange={e => setDiscountValue(Number(e.target.value))} className="w-full bg-transparent py-2 px-3 text-xs outline-none" />
                    <select value={discountType} onChange={e => setDiscountType(e.target.value as any)} className="bg-charcoal/5 border-l border-charcoal/10 text-xs px-2 outline-none cursor-pointer font-bold text-charcoal/70">
                      <option value="fixed">Rs</option>
                      <option value="percent">%</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/50 mb-1.5 block">Notes</label>
                <input type="text" placeholder="Any special instructions..." value={orderNotes} onChange={e => setOrderNotes(e.target.value)} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-lg py-2 px-3 text-xs outline-none focus:border-terracotta" />
              </div>
            </div>

            {/* Cash Calculator */}
            <div className="bg-white p-4 rounded-2xl border border-charcoal/5 shadow-sm">
               <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/50 mb-2 flex items-center justify-between">
                 <span>Cash Calculator</span>
                 {changeDue > 0 && <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">Change: {formatPKR(changeDue)}</span>}
               </label>
               <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40 font-serif text-sm">Rs</span>
                  <input type="number" min="0" placeholder="Amount Tendered by Customer" value={amountTendered} onChange={e => setAmountTendered(e.target.value)} className="w-full bg-[#fcfbf9] border border-charcoal/10 rounded-lg py-2.5 pl-9 pr-4 text-sm font-medium outline-none focus:border-terracotta" />
               </div>
            </div>

          </div>

          <div className="p-5 border-t border-charcoal/10 bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs font-medium text-charcoal/70"><span>Subtotal</span><span>{formatPKR(subtotal)}</span></div>
              {discountAmount > 0 && <div className="flex justify-between text-xs font-medium text-terracotta"><span>Discount</span><span>-{formatPKR(discountAmount)}</span></div>}
              {shippingRate > 0 && <div className="flex justify-between text-xs font-medium text-charcoal/70"><span>Shipping</span><span>{formatPKR(shippingRate)}</span></div>}
              <div className="flex justify-between font-serif text-2xl text-charcoal border-t border-charcoal/10 pt-3 mt-1"><span>Total</span><span>{formatPKR(total)}</span></div>
            </div>
            
            <button onClick={handleCheckout} disabled={cart.length === 0 || submitting} className="w-full py-4 bg-charcoal text-ivory rounded-xl text-sm uppercase tracking-widest font-bold hover:bg-terracotta disabled:opacity-50 disabled:hover:bg-charcoal transition-all shadow-xl hover:shadow-terracotta/30 flex justify-center items-center gap-2 group relative overflow-hidden">
              {submitting ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-ivory/30 border-t-ivory rounded-full" /> : (
                <>
                  <span className="relative z-10 group-hover:-translate-x-2 transition-transform">Complete Order</span>
                  <ArrowRight className="w-4 h-4 absolute right-[35%] opacity-0 group-hover:opacity-100 group-hover:right-[30%] transition-all" />
                </>
              )}
            </button>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}
