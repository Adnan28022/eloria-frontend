"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await adminApi.login(email, password);
      const { token } = res.data.data;
      localStorage.setItem('eloria_admin_token', token);
      toast.success('Welcome back, Admin!');
      router.push("/admin/dashboard");
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorShake(true);
      toast.error(err.response?.data?.error || 'Invalid credentials');
      setTimeout(() => setErrorShake(false), 500);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="h-screen w-full relative flex items-center justify-center md:justify-between p-6 md:px-12 lg:px-24 overflow-hidden text-charcoal">
        {/* Full Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="/login-bg.jfif" alt="Login Background" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-white/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent" />
        </div>

        {/* Top Left Branding */}
        <div className="absolute top-8 left-8 md:top-12 md:left-12 z-20">
          <img src="/logo-bg.png" alt="Eloria" className="h-10 md:h-12 w-auto object-contain drop-shadow-sm" />
        </div>

        {/* Left side: Text */}
        <div className="hidden md:flex flex-col z-20 max-w-lg lg:max-w-xl pl-8 lg:pl-12">
          <motion.h1 initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} className="font-serif text-6xl lg:text-7xl text-charcoal leading-[1.1] mb-6 drop-shadow-sm">
            Pure <br />
            <span className="font-sans font-medium italic text-terracotta tracking-wider text-5xl lg:text-6xl">Botanical</span> <br />
            Radiance
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4, ease: "easeOut" }} className="text-charcoal/80 font-medium text-lg lg:text-xl drop-shadow-sm tracking-wide max-w-md leading-relaxed">
            Crafted by nature. Powered by science. Enter the portal to manage the essence of Eloria.
          </motion.p>
        </div>

        {/* Right side: Login Form */}
        <div className="w-full max-w-lg md:max-w-xl relative z-20">
          <motion.div initial={{ opacity: 0, x: 40, filter: "blur(10px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="bg-white/70 backdrop-blur-3xl p-8 md:p-12 lg:p-14 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] border border-white/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-terracotta/60 via-terracotta to-terracotta/60 opacity-80" />

            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="font-serif text-3xl md:text-4xl lg:text-5xl mb-2 text-charcoal drop-shadow-sm leading-tight">
              System Access
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="text-charcoal/60 text-sm md:text-base mb-8 font-medium">
              Enter your credentials to manage Eloria.
            </motion.p>

            <motion.form onSubmit={handleLogin} animate={errorShake ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="space-y-5 md:space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none text-charcoal/40 group-focus-within:text-terracotta transition-colors">
                  <User className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-white/60 border border-white/50 focus:border-terracotta/60 rounded-2xl md:rounded-3xl py-4 md:py-5 pl-14 md:pl-16 pr-6 outline-none focus:bg-white transition-all shadow-inner placeholder:text-charcoal/40 text-sm md:text-base" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none text-charcoal/40 group-focus-within:text-terracotta transition-colors">
                  <Lock className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-white/60 border border-white/50 focus:border-terracotta/60 rounded-2xl md:rounded-3xl py-4 md:py-5 pl-14 md:pl-16 pr-14 outline-none focus:bg-white transition-all shadow-inner placeholder:text-charcoal/40 text-sm md:text-base" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-6 text-charcoal/40 hover:text-charcoal transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5 md:w-6 md:h-6" /> : <Eye className="w-5 h-5 md:w-6 md:h-6" />}
                </button>
              </motion.div>

              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting} type="submit" className="w-full bg-charcoal text-ivory py-4 md:py-5 rounded-2xl md:rounded-3xl uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold hover:bg-terracotta transition-all shadow-[0_10px_30px_rgb(0,0,0,0.15)] hover:shadow-[0_15px_35px_rgb(212,130,105,0.4)] flex items-center justify-center gap-3 h-14 md:h-16 disabled:opacity-70 disabled:hover:scale-100 mt-4 md:mt-6">
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 md:w-6 md:h-6 border-2 border-ivory/30 border-t-ivory rounded-full" />
                ) : (
                  <>Secure Login <ArrowRight className="w-4 h-4 md:w-5 md:h-5" /></>
                )}
              </motion.button>
            </motion.form>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="text-charcoal/40 text-[10px] md:text-xs uppercase tracking-widest text-center mt-6 md:mt-8 drop-shadow-sm font-semibold">
            &copy; {new Date().getFullYear()} Eloria Skincare
          </motion.div>
        </div>
      </div>
    </>
  );
}
