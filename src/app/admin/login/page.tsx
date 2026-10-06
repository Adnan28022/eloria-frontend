"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
    if (!email || !password) {
      toast.error("Please enter both email and password");
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
      return;
    }
    
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
      <div className="min-h-screen w-full relative flex items-center justify-center md:justify-between p-6 md:px-12 lg:px-24 overflow-hidden bg-[#12100E] text-[#EDE5DA]">
        {/* Full Background Ambient Gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#9E472A]/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#D97757]/5 rounded-full blur-[150px]" />
        </div>

        {/* Top Left Branding */}
        <div className="absolute top-8 left-8 md:top-12 md:left-12 z-20 flex items-center gap-3">
          <div className="p-2 bg-white/[0.03] border border-white/[0.08] rounded-xl shadow-inner">
            <img src="/logo-bg.png" alt="Eloria" className="h-8 md:h-10 w-auto object-contain drop-shadow-sm filter brightness-0 invert" />
          </div>
        </div>

        {/* Left side: Text */}
        <div className="hidden md:flex flex-col z-20 max-w-lg lg:max-w-xl pl-8 lg:pl-12">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} 
            className="font-serif text-5xl lg:text-7xl text-[#EDE5DA] leading-[1.1] mb-6 drop-shadow-sm"
          >
            System <br />
            <span className="font-sans font-medium italic text-[#D97757] tracking-wider text-4xl lg:text-6xl">Intelligence</span> <br />
            Portal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }} 
            className="text-[#EDE5DA]/60 font-medium text-lg lg:text-xl drop-shadow-sm tracking-wide max-w-md leading-relaxed"
          >
            Secure access to the Eloria management core. Authorized personnel only.
          </motion.p>
        </div>

        {/* Right side: Login Form */}
        <div className="w-full max-w-lg md:max-w-xl relative z-20">
          <motion.div 
            initial={{ opacity: 0, x: 40, filter: "blur(10px)" }} 
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} 
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} 
            className="bg-[#1A1816]/80 backdrop-blur-3xl p-8 md:p-12 lg:p-14 rounded-[2.5rem] shadow-2xl border border-white/[0.06] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#9E472A] via-[#D97757] to-[#9E472A]" />

            <motion.h2 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3, duration: 0.6 }} 
              className="font-serif text-3xl md:text-4xl lg:text-5xl mb-2 text-white drop-shadow-sm leading-tight"
            >
              Authentication
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4, duration: 0.6 }} 
              className="text-white/40 text-sm md:text-base mb-8 font-medium"
            >
              Enter your administrative credentials.
            </motion.p>

            <motion.form 
              onSubmit={handleLogin} 
              animate={errorShake ? { x: [-10, 10, -10, 10, 0] } : {}} 
              transition={{ duration: 0.4 }} 
              className="space-y-5 md:space-y-6"
            >
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none text-white/30 group-focus-within:text-[#D97757] transition-colors">
                  <User className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Email Address" 
                  className="w-full bg-black/40 border border-white/[0.08] focus:border-[#D97757]/60 rounded-2xl md:rounded-3xl py-4 md:py-5 pl-14 md:pl-16 pr-6 outline-none focus:bg-black/60 transition-all text-white placeholder:text-white/30 text-sm md:text-base" 
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none text-white/30 group-focus-within:text-[#D97757] transition-colors">
                  <Lock className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Password" 
                  className="w-full bg-black/40 border border-white/[0.08] focus:border-[#D97757]/60 rounded-2xl md:rounded-3xl py-4 md:py-5 pl-14 md:pl-16 pr-14 outline-none focus:bg-black/60 transition-all text-white placeholder:text-white/30 text-sm md:text-base" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 flex items-center pr-6 text-white/30 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 md:w-6 md:h-6" /> : <Eye className="w-5 h-5 md:w-6 md:h-6" />}
                </button>
              </motion.div>

              <motion.button 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.8, duration: 0.6 }} 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                disabled={isSubmitting} 
                type="submit" 
                className="w-full bg-[#D97757] text-white py-4 md:py-5 rounded-2xl md:rounded-3xl uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold hover:bg-[#B85738] transition-all shadow-[0_4px_20px_rgba(217,119,87,0.2)] flex items-center justify-center gap-3 h-14 md:h-16 disabled:opacity-70 disabled:hover:scale-100 mt-4 md:mt-6"
              >
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 md:w-6 md:h-6 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <>Secure Access <ArrowRight className="w-4 h-4 md:w-5 md:h-5" /></>
                )}
              </motion.button>
            </motion.form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1, duration: 1 }} 
            className="text-white/30 text-[10px] md:text-xs uppercase tracking-widest text-center mt-6 md:mt-8 font-semibold"
          >
            &copy; {new Date().getFullYear()} Eloria Skincare Administration
          </motion.div>
        </div>
      </div>
    </>
  );
}
