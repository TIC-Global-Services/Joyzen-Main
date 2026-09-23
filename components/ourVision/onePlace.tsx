'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface OnePlaceProps {
  isVisible?: boolean;
}

export default function OnePlace({ isVisible }: OnePlaceProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-60px' });
  const active = isVisible !== undefined ? isVisible : inView;
  const [count, setCount] = useState(0);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!active || hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    let start = 0;
    const end = 10000;
    const duration = 1500;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(start + (end - start) * ease);

      setCount(current);

      if (frame === totalFrames) {
        clearInterval(timer);
        setCount(end);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [active]);

  return (
    <div
      ref={containerRef}
      className="relative w-full py-6 sm:py-10 px-6 sm:px-12 flex flex-col items-center justify-center select-none overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center text-center lg:max-w-5xl mx-auto sm:space-y-3"
      >
        {/* Top Row / Stacked Mobile: Plus Connected -> 10000 -> One Place */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-x-5 sm:gap-y-3 text-[32px] sm:text-4xl md:text-3xl lg:text-6xl font-bold tracking-tight leading-tight">
          {/* Plus Connected - 1st on mobile, 3rd on desktop */}
          <span className="order-1 sm:order-3 text-[#EB7847]">Plus Connected</span>

          {/* Frosted Pill Badge with Soft Lilac Counter - 2nd on mobile & desktop */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={active ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 sm:order-2 inline-flex items-center justify-center shadow-md px-6 md:px-7 py-1 sm:py-1.5 md:py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)]"
          >
            <span className="text-[#C5A3CF] font-semibold tracking-normal text-3xl sm:text-3xl md:text-3xl lg:text-[44px] tabular-nums">
              {count}
            </span>
          </motion.div>

          {/* Deep Forest Green - 3rd on mobile, 1st on desktop */}
          <span className="order-3 sm:order-1 text-[#036132]">One Place</span>
        </div>

        {/* Bottom Row: Health Journey (Refreshing Soft Cyan/Blue) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 sm:mt-0 text-[32px] sm:text-4xl md:text-3xl lg:text-6xl font-bold tracking-tight text-[#88CCE1] leading-none"
        >
          Health Journey
        </motion.div>
      </motion.div>
    </div>
  );
}