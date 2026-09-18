"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  titleStart: string;
  titleHighlight?: string;
  titleEnd?: string;
  description?: string;
  backgroundImage?: string;
  align?: "left" | "center" | "right";
  overlayOpacity?: number;
  height?: "sm" | "md" | "lg";
  breadcrumbs?: { label: string; href: string }[];
  imageClassName?: string;
  fixedBackground?: boolean;
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: 0.8, type: "spring" as any as any, duration: 1.5, bounce: 0 },
      opacity: { delay: 0.8, duration: 0.01 },
    },
  },
};

export const PageHero: React.FC<PageHeroProps> = ({
  titleStart,
  titleHighlight,
  titleEnd,
  description,
  backgroundImage = "/hero-bg.jfif",
  align = "center",
  overlayOpacity = 0.5,
  height = "md",
  breadcrumbs,
  imageClassName = "object-cover object-center",
  fixedBackground = false,
}) => {
  const heightClasses = {
    sm: "h-[30vh] min-h-[350px] md:h-[40vh] md:min-h-[400px]",
    md: "h-[40vh] min-h-[400px] md:h-[500px] lg:h-[60vh] lg:min-h-[600px]",
    lg: "h-[50vh] min-h-[500px] md:h-[70vh] lg:h-[80vh] lg:min-h-[700px]",
  };

  return (
    <section className={`relative w-full ${heightClasses[height]} flex items-center justify-center overflow-hidden`}>
      {/* Background Image */}
      {fixedBackground ? (
        <motion.div
          initial={{ scale: 1.1, filter: "blur(10px)" }}
          animate={{ scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full bg-cover bg-no-repeat bg-fixed bg-[center_10%]"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      ) : (
        <motion.div
          initial={{ scale: 1.1, filter: "blur(10px)" }}
          animate={{ scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={backgroundImage}
            alt={titleStart}
            loading="eager"
            fetchPriority="high"
            className={`w-full h-full ${imageClassName}`}
          />
        </motion.div>
      )}

      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: overlayOpacity }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-charcoal"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center h-full pt-16">
        
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={`flex items-center gap-2 mb-6 text-[10px] uppercase tracking-widest font-medium text-ivory/70 ${
              align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"
            }`}
          >
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.href}>
                <Link href={crumb.href} className="hover:text-terracotta transition-colors">
                  {crumb.label}
                </Link>
                {idx < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3" />}
              </React.Fragment>
            ))}
          </motion.nav>
        )}

        <div 
          className={`max-w-3xl ${
            align === "center" 
              ? "mx-auto text-center" 
              : align === "right" 
                ? "ml-auto text-right" 
                : "text-left"
          }`}
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-7xl text-ivory tracking-tight mb-4 lg:mb-6 leading-[1.1] font-light"
          >
            {/* The standard part (sans-serif or just default light) */}
            <span className="font-sans">{titleStart}</span>{" "}
            
            {/* The highlighted part (serif italic) with curved underline */}
            {titleHighlight && (
              <span className="relative inline-block font-serif italic font-medium text-[#d49b91] px-1 transform -rotate-1">
                {titleHighlight}
                <motion.svg
                  className="absolute left-0 -bottom-1 w-full overflow-visible z-[-1]"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                  initial="hidden"
                  animate="visible"
                >
                  <motion.path
                    d="M 0,15 Q 50,5 100,12"
                    fill="transparent"
                    stroke="#b57a6f" /* slightly darker terracotta for contrast */
                    strokeWidth="3"
                    strokeLinecap="round"
                    variants={draw}
                  />
                </motion.svg>
              </span>
            )}{" "}
            
            {titleEnd && <span className="font-sans">{titleEnd}</span>}
          </motion.h1>
          
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`text-ivory/90 text-sm md:text-base lg:text-lg font-light leading-relaxed max-w-2xl ${
                align === "center" ? "mx-auto" : ""
              }`}
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
};
