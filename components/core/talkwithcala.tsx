'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CalaThreeCircle from './CalaThreeCircle';

export default function TalkWithCala() {
  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden select-none bg-[#FAF8F5]">
      {/* 1. Honeycomb Vector Pattern Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="talk-honeycomb-pattern"
              width="62.35"
              height="108"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 31.18 0 L 62.35 18 L 62.35 54 L 31.18 72 L 0 54 L 0 18 Z M 0 54 L 0 90 L 31.18 108 L 62.35 90 L 62.35 54 M 31.18 72 L 31.18 108"
                fill="none"
                stroke="#EAE6DE"
                strokeWidth="1.1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#talk-honeycomb-pattern)" />
        </svg>
      </div>

      {/* 2. Soft Ambient Radial Glow Behind Center */}
      <div className="absolute w-[600px] h-[400px] rounded-full bg-gradient-to-b from-teal-100/25 via-cyan-50/20 to-transparent blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />

      {/* 3. Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-[#1E2822] tracking-[-0.03em] leading-[1.1]"
        >
          <span className="text-[#6BACE5]">CORE</span> is Men’s Health & Energy Program.
        </motion.h2>

        {/* Subtitle Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="mt-4 sm:mt-5 text-[#27272C] text-sm sm:text-base md:text-[18px] leading-[1.2] max-w-xl font-medium"
        >
          For men who want to improve energy, lifestyle, sexual health, and prevent future fertility problems with guided medical support.
        </motion.p>

        {/* 4. Action Button with Mini 3D Rotating CALA Orb */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="mt-8 sm:mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="group relative inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full
              bg-white/90 backdrop-blur-md border border-white/90
              shadow-[0_12px_32px_rgba(0,0,0,0.06),_0_2px_8px_rgba(0,0,0,0.03)]
              hover:shadow-[0_16px_40px_rgba(72,192,204,0.22),_0_4px_12px_rgba(0,0,0,0.04)]
              hover:border-cyan-200/90 transition-all duration-300 cursor-pointer select-none"
          >
            {/* 3D Mini Rotating CALA Orb inside the button */}
            <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(36,168,184,0.35)] border border-white/70">
              <CalaThreeCircle interactive={false} className="w-full h-full" />
            </div>

            {/* Button Text Label */}
            <span className="font-semibold text-xs sm:text-base tracking-tight text-[#1E2822] uppercase whitespace-nowrap">
              TALK TO CARE TEAM
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}