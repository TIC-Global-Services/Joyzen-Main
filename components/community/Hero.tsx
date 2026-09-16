'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CommunityHeroShowcase from './CommunityHeroShowcase';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-between items-center pt-24 sm:pt-36 md:pt-40 pb-16 sm:pb-24 px-[5%] overflow-hidden select-none">
      {/* Top Split Content for Desktop / Reordered for Mobile */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center justify-center gap-6 lg:gap-0">
        {/* Right: 3D Robot & Appointment Dashboard Banner (1st on mobile, 2nd on desktop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="order-1 lg:order-2 lg:col-span-7 flex justify-center lg:justify-end items-center"
        >
          <div className="relative w-full">
            <CommunityHeroShowcase />
          </div>
        </motion.div>

        {/* Left: Main Headline (2nd on mobile, 1st on desktop) */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="order-2 lg:order-1 lg:col-span-5 flex flex-col justify-center text-left"
        >
          <h1 className="text-[40px] sm:text-5xl md:text-6xl text-left lg:text-right font-bold text-black tracking-tight leading-none md:leading-[1.08]">
            Life Is Better <br className="" />
            When You&apos;re Actually <br className="hidden sm:inline" />
            Part Of It.
          </h1>
        </motion.div>
      </div>

      {/* Bottom Content: Narrative Copy & Pill CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        className="w-full max-w-4xl mx-auto flex flex-col items-start lg:items-center text-left lg:text-center mt-2 sm:mt-10 md:mt-1 mb-5 sm:space-y-9"
      >
        {/* Warm Orange / Terracotta Narrative Copy */}
        <p className="text-base sm:text-base md:text-lg lg:text-lg text-[#EB7847] font-medium leading-[1.3] max-w-3xl mb-5 text-left lg:text-center">
          Meet people who are curious about life, open to new experiences and genuinely
          excited about what&apos;s ahead. Swap stories, have real conversations, borrow a new
          perspective, and find a place where you can just be yourself.
        </p>

        {/* Pill CTA Button */}
        <div className="w-full flex justify-start lg:justify-center">
          <Link
            href="#contact"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-medium tracking-tight text-black uppercase bg-[#AEDEE44D] hover:bg-[#bde6ed] backdrop-blur-xs border border-white/60 shadow-xs hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
          >
            CARE FOR A CALL? STAY ANONYMOUS.
          </Link>
        </div>
      </motion.div>
    </section>
  );
}