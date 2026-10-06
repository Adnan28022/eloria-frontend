"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success("Coming soon!");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-ivory font-sans">
      {/* Left side: Image */}
      <div className="hidden md:flex w-1/2 relative bg-charcoal">
        <img 
          src="/login-bg.jfif" 
          alt="Eloria Skincare" 
          className="w-full h-full object-cover opacity-80"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/hero-bg.jfif";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent flex flex-col justify-end p-16">
          <h2 className="font-serif text-5xl text-ivory mb-4">Embrace your natural glow.</h2>
          <p className="text-ivory/80 max-w-md font-light leading-relaxed">
            Join the Eloria community and discover a world of botanical skincare crafted for your unique beauty.
          </p>
        </div>
        <Link href="/" className="absolute top-10 left-10 text-ivory flex items-center gap-2 hover:text-terracotta transition-colors text-sm uppercase tracking-widest font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      {/* Right side: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        <Link href="/" className="md:hidden absolute top-8 left-8 text-charcoal flex items-center gap-2 hover:text-terracotta transition-colors text-sm uppercase tracking-widest font-medium">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>

        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-12">
            <Link href="/" className="font-serif text-4xl text-charcoal tracking-tight">Eloria.</Link>
          </div>

          {/* Toggle */}
          <div className="flex p-1 bg-white rounded-full mb-10 shadow-sm border border-charcoal/5">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-sm font-medium rounded-full transition-all duration-300 ${isLogin ? 'bg-charcoal text-ivory shadow-md' : 'text-charcoal/60 hover:text-charcoal'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-sm font-medium rounded-full transition-all duration-300 ${!isLogin ? 'bg-charcoal text-ivory shadow-md' : 'text-charcoal/60 hover:text-charcoal'}`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                    <input 
                      type="text" 
                      required={!isLogin}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-charcoal/10 rounded-2xl outline-none focus:border-terracotta transition-colors placeholder:text-charcoal/20"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-charcoal/10 rounded-2xl outline-none focus:border-terracotta transition-colors placeholder:text-charcoal/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">Password</label>
                {isLogin && <button type="button" className="text-xs text-terracotta hover:underline">Forgot?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-white border border-charcoal/10 rounded-2xl outline-none focus:border-terracotta transition-colors placeholder:text-charcoal/20"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      required={!isLogin}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-charcoal/10 rounded-2xl outline-none focus:border-terracotta transition-colors placeholder:text-charcoal/20"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-charcoal text-ivory py-4 rounded-2xl uppercase tracking-[0.2em] text-xs font-medium hover:bg-terracotta transition-colors mt-4 disabled:opacity-70 flex justify-center items-center h-14"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-ivory/30 border-t-ivory rounded-full" />
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-10">
            <div className="relative flex items-center mb-8">
              <div className="flex-grow border-t border-charcoal/10"></div>
              <span className="flex-shrink-0 mx-4 text-charcoal/40 text-xs uppercase tracking-widest font-medium">Or continue with</span>
              <div className="flex-grow border-t border-charcoal/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => toast.success("Coming soon!")}
                className="flex items-center justify-center gap-3 bg-white border border-charcoal/10 py-3 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                <span className="text-sm font-medium text-charcoal">Google</span>
              </button>
              <button 
                type="button"
                onClick={() => toast.success("Coming soon!")}
                className="flex items-center justify-center gap-3 bg-white border border-charcoal/10 py-3 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-5 h-5" alt="Apple" />
                <span className="text-sm font-medium text-charcoal">Apple</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
