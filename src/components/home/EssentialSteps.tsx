'use client';

import React from 'react';
import { useScrollProgress, mapRange, clamp01 } from '@/hooks/use-scroll-progress';
import { ShoppingBag, Eye } from 'lucide-react';

const STEPS = [
  {
    n: "1",
    title: "Cleanse",
    sub: "Hydra-Foam Cleanser",
    body: "A recovery-first cleansing step that purifies while preserving the skin barrier from the very first contact. Leaves skin feeling clean and hydrated.",
    img: "/bubble-1.png",
    customClass: "max-w-[120px] lg:max-w-[150px]",
  },
  {
    n: "2",
    title: "Activate",
    sub: "Reset Serum",
    body: "A targeted activation serum that stimulates the skin cells in regaining strength, density and balance — preparing it for sustained resilience.",
    img: "/prod-2.png",
    customClass: "max-w-[120px] lg:max-w-[150px]",
  },
  {
    n: "3",
    title: "Protect",
    sub: "Barrier Fluid",
    body: "A weightless finishing layer that locks in moisture and shields against daily stress, so progress made overnight is never undone.",
    img: "/bubble-3.png",
    customClass: "max-w-[180px] lg:max-w-[240px]",
  },
];

function interpolateStops(value: number, stops: number[]) {
  if (stops.length < 2) return stops[0] ?? 0;
  const scaled = clamp01(value) * (stops.length - 1);
  const index = Math.min(Math.floor(scaled), stops.length - 2);
  const local = scaled - index;
  const from = stops[index] ?? 0;
  const to = stops[index + 1] ?? from;
  return from + (to - from) * local;
}

function stageOpacity(progress: number, center: number, width = 0.17) {
  const distance = Math.abs(progress - center);
  return clamp01(1 - distance / width);
}

export function EssentialSteps() {
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  const centers = [0.12, 0.38, 0.64];
  const bubbleX = interpolateStops(p, [-18, -18, 18, 18, -18, -18, 0]);
  const bubbleY = interpolateStops(p, [8, 0, -7, 5, -5, 4, 0]);
  const bubbleScale = interpolateStops(p, [0.78, 0.88, 0.9, 0.94, 0.9, 0.96, 1.28]);
  const finalOpacity = mapRange(p, 0.82, 0.93, 0, 1);
  const itemOpacity = 1 - mapRange(p, 0.79, 0.88, 0, 1);


  return (
    <section ref={ref} className="bg-[#fcfbfa] relative h-[540vh]">
      {/* Introduction Title (Fixed at start or part of flow) - I will just integrate it smoothly */}
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        
        {/* Texts */}
        <div className="pointer-events-none absolute inset-0 max-w-[1300px] mx-auto w-full">
          {STEPS.map((s, i) => {
            const opacity = stageOpacity(p, centers[i] ?? 0, 0.14);
            const onRight = i % 2 === 0;
            return (
              <article
                key={s.title}
                className={`absolute top-1/2 w-[44%] max-w-md -translate-y-1/2 px-6 lg:px-16 ${
                  onRight ? "right-0" : "left-0"
                }`}
                style={{
                  opacity,
                  transform: `translate3d(0, calc(-50% + ${mapRange(opacity, 0, 1, 38, 0)}px), 0)`,
                }}
              >
                <div className="flex items-start gap-6">
                  <span className="text-[110px] lg:text-[150px] leading-[0.75] text-[#d49b91] font-light tracking-tighter select-none">
                    {s.n}
                  </span>
                  <div className="pt-2">
                    <h3 className="text-3xl lg:text-[38px] tracking-[0.05em] text-[#2b2b2b] font-normal mb-2 uppercase">
                      {s.title}
                    </h3>
                    <p className="text-[11px] lg:text-xs tracking-[0.2em] text-[#888] font-semibold mb-3 uppercase">
                      {s.sub}
                    </p>
                    <p className="text-[#666] text-sm lg:text-base max-w-xl font-light leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bubbles and Products */}
        <div
          className="relative flex aspect-square w-[76vw] max-w-[560px] items-center justify-center will-change-transform md:w-[46vw]"
          style={{
            transform: `translate3d(${bubbleX}vw, ${bubbleY}vh, 0) scale(${bubbleScale})`,
          }}
        >
          <img
            src="/bubble.png"
            alt="Bubble Animation"
            aria-hidden
            width={1024}
            height={1024}
            loading="lazy"
            className="absolute inset-0 h-full w-full opacity-80"
          />

          {STEPS.map((s, i) => {
            const stepOpacity = stageOpacity(p, centers[i] ?? 0, 0.17) * itemOpacity;
            const offsetDist = mapRange(stepOpacity, 0, 1, 80, 0);

            return (
              <div
                key={s.title}
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: stepOpacity, pointerEvents: stepOpacity > 0.8 ? 'auto' : 'none' }}
              >
                <img
                  src={s.img}
                  alt={s.sub}
                  width={600}
                  height={800}
                  loading="lazy"
                  className={`object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)] ${s.customClass || "max-w-[120px] lg:max-w-[150px]"}`}
                />

                {/* Left Bubble: Add to Cart */}
                <button
                  className="absolute flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white hover:bg-white transition-all text-[#2b2b2b] hover:scale-110 z-10"
                  style={{
                    transform: `translate(${-90 + offsetDist}px, ${70 - offsetDist}px)`,
                  }}
                  title="Add to Cart"
                >
                  <ShoppingBag size={18} />
                </button>

                {/* Right Bubble: View */}
                <button
                  className="absolute flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white hover:bg-white transition-all text-[#2b2b2b] hover:scale-110 z-10"
                  style={{
                    transform: `translate(${90 - offsetDist}px, ${70 - offsetDist}px)`,
                  }}
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
              </div>
            );
          })}

          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ opacity: finalOpacity }}>
            <div className="relative w-[64%] flex flex-col items-center">
              <img src="/all.png" alt="Eloria Skincare Set" width={1200} height={1008} loading="lazy" className="w-full h-auto drop-shadow-2xl" />
              <button
                className="absolute -bottom-6 border border-charcoal/40 text-charcoal bg-transparent hover:bg-charcoal hover:text-white px-8 py-3 text-xs tracking-[0.25em] uppercase transition-colors rounded-full"
              >
                Shop The Set
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}