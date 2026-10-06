import React from "react";

export const ProductCardSkeleton = () => (
  <div className="animate-pulse flex flex-col space-y-4 w-full">
    <div className="bg-borderSubtle w-full aspect-[3/4] rounded-2xl" />
    <div className="h-4 bg-borderSubtle w-3/4 rounded" />
    <div className="h-4 bg-borderSubtle w-1/2 rounded" />
  </div>
);

export const PageSkeleton = () => (
  <div className="animate-pulse w-full min-h-screen pt-24 px-6 md:px-12 max-w-7xl mx-auto space-y-8">
    <div className="h-12 bg-borderSubtle w-1/3 rounded" />
    <div className="h-6 bg-borderSubtle w-1/2 rounded" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
      <ProductCardSkeleton />
      <ProductCardSkeleton />
      <ProductCardSkeleton />
      <ProductCardSkeleton />
    </div>
  </div>
);

export const TextSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <div className="animate-pulse space-y-3 w-full">
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i} 
        className={`h-4 bg-borderSubtle rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
      />
    ))}
  </div>
);

export const EmptyState = ({ title, message, action }: { title: string; message: string; action?: React.ReactNode }) => (
  <div className="py-20 text-center flex flex-col items-center justify-center px-4 w-full h-full min-h-[40vh]">
    <h3 className="font-serif text-2xl md:text-3xl text-charcoal mb-3">{title}</h3>
    <p className="text-taupe text-sm md:text-base max-w-md mb-8 font-light">{message}</p>
    {action}
  </div>
);