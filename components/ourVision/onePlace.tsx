'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function OnePlace() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

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
  }, [isInView]);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-16 sm:py-24 md:py-32 px-6 sm:px-12 flex flex-col items-center justify-center select-none overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center text-center md:max-w-5xl mx-auto  sm:space-y-3"
      >
        {/* Top Row: One Place + [10000 Badge] + Plus Connected */}
        <div className="flex flex-wrap items-center justify-center  sm:gap-x-5  sm:gap-y-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
          {/* Deep Forest Green */}
          <span className="text-[#036132]">One Place</span>

          {/* Frosted Pill Badge with Soft Lilac Counter */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center justify-center px-4 sm:px-6 md:px-7 py-1 sm:py-1.5 md:py-2 rounded-full bg-white/10 backdrop-blur-xs border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.8)]"
          >
            <span className="text-[#C5A3CF] font-semibold tracking-normal text-2xl sm:text-3xl md:text-4xl lg:text-[44px] tabular-nums">
              {count}
            </span>
          </motion.div>

          {/* Warm Terracotta / Coral Orange */}
          <span className="text-[#EB7847]">Plus Connected</span>
        </div>

        {/* Bottom Row: Health Journey (Refreshing Soft Cyan/Blue) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#88CCE1] leading-tight"
        >
          Health Journey
        </motion.div>
      </motion.div>
    </section>
  );
}