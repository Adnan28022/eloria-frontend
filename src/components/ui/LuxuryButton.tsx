"use client";

import React from "react";
import { motion } from "framer-motion";

interface LuxuryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  variant = "primary",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-charcoal text-ivory hover:bg-taupe",
    secondary: "bg-peach text-charcoal hover:bg-terracotta hover:text-ivory",
    outline: "border border-charcoal/30 text-charcoal hover:border-charcoal bg-transparent",
    ghost: "text-charcoal hover:bg-charcoal/5 bg-transparent",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};