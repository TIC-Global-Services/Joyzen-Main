'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[88vh] sm:min-h-screen flex flex-col justify-end pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-20 md:pb-24 px-6 sm:px-12 lg:px-20 overflow-hidden select-none">
      {/* 3D Glass DNA Graphic with Floating Animation & Interactive Hotspots */}
      <div className="absolute bottom-30 sm:top-50 lg:-top-28 -right-46 sm:-right-[35%] lg:-right-[25%] w-[150%] sm:w-[95%] md:w-[150%] lg:w-[98%]  pointer-events-none z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[16/10]"
        >
          {/* Subtle floating effect */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-full h-full"
          >
            <Image
              src="/dna-white.png"
              alt="Joyzen Living DNA Helix"
              fill
              priority
              className="object-cover w-full h-full object-top-right drop-shadow-sm"
            />

            {/* Callout Pin 1: BECAUSE LIFE IS ALWAYS MOVING */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute left-[13%] sm:left-[28%] top-[48%] sm:top-[58%] pointer-events-auto flex items-center gap-2.5 sm:gap-3 group cursor-pointer"
            >
              <div className="text-right">
                <p className="text-sm sm:text-xs md:text-sm font-bold font-epilogue uppercase tracking-wider text-[#EA580C] leading-tight drop-shadow-xs transition-transform duration-300 group-hover:scale-105">
                  Because Life<br />
                  Is Always Moving
                </p>
              </div>

              {/* Target Crosshair Node */}
              <div className="relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7">
                <span className="absolute w-full h-full rounded-full bg-[#10B981]/20 animate-ping" />
                <div className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full border-[1.5px] border-zinc-700 bg-white/90 shadow-sm flex items-center justify-center group-hover:border-[#EA580C] transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  {/* Crosshair lines */}
                  <span className="absolute w-full h-[1px] bg-zinc-600/40" />
                  <span className="absolute h-full w-[1px] bg-zinc-600/40" />
                </div>
              </div>
            </motion.div>

            {/* Callout Pin 2: HEALTHCARE IS MOVING AT YOUR SPEED */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute right-[30%] md:right-[30%] lg:right-[40%] top-[34%] sm:top-[38%] pointer-events-auto flex items-center gap-2.5 sm:gap-3 group cursor-pointer"
            >
              {/* Target Crosshair Node */}
              <div className="relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 order-1 sm:order-none">
                <span className="absolute w-full h-full rounded-full bg-[#10B981]/20 animate-ping" />
                <div className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full border-[1.5px] border-zinc-700 bg-white/90 shadow-sm flex items-center justify-center group-hover:border-[#EA580C] transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  {/* Crosshair lines */}
                  <span className="absolute w-full h-[1px] bg-zinc-600/40" />
                  <span className="absolute h-full w-[1px] bg-zinc-600/40" />
                </div>
              </div>

              <div className="text-left order-2 sm:order-none">
                <p className="text-xs sm:text-xs md:text-sm font-bold font-epilogue uppercase tracking-wider text-[#EA580C] leading-tight drop-shadow-xs transition-transform duration-300 group-hover:scale-105">
                  Healthcare Is<br />
                  Moving At Your Speed
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Content Area */}
      <div className="relative z-10 w-full max-w-5xl mt-auto">
        {/* Eyebrow / Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-2xl font-semibold text-zinc-900 tracking-tight mb-2"
        >
          We believe the future of healthcare shouldn&apos;t feel foreign
        </motion.p>

        {/* Primary Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-bold tracking-tight text-zinc-950 leading-[1.08] sm:leading-[1.12]"
        >
          It Should Feel Like Healthcare Finally <br className="hidden sm:inline" />
          Understands The Way You Live
        </motion.h1>
      </div>
    </section>
  );
}