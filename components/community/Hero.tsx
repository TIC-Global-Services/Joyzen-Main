'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-between items-center pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24 px-[5%] overflow-hidden select-none">
      {/* Top Split Content */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center justify-center">
        {/* Left: Main Headline */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="lg:col-span-5 flex flex-col justify-center text-left"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-right font-bold text-zinc-900 tracking-tight leading-[1.08]">
            Life Is Better <br />
            When You&apos;re Actually <br />
            Part Of It.
          </h1>
        </motion.div>

        {/* Right: 3D Robot & Appointment Dashboard Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="lg:col-span-7 flex justify-center lg:justify-end items-center"
        >
          <div className="relative w-full aspect-[16/9] transition-transform duration-500 hover:scale-[1.02]">
            <Image
              src="/community_hero_banner.png"
              alt="Joyzen Robot with Appointments Calendar"
              fill
              priority
              className="object-contain drop-shadow-sm"
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom Center Content: Narrative Copy & Pill CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        className="w-full max-w-4xl mx-auto flex flex-col items-center text-center mt-14 sm:mt-10 md:mt-1 space-y-7 sm:space-y-9"
      >
        {/* Warm Orange / Terracotta Narrative Copy */}
        <p className="text-sm sm:text-base md:text-lg lg:text-lg text-[#EB7847] font-medium leading-[1.3] max-w-3xl">
          Meet people who are curious about life, open to new experiences and genuinely
          excited about what&apos;s ahead. Swap stories, have real conversations, borrow a new
          perspective, and find a place where you can just be yourself.
        </p>

        {/* Pill CTA Button */}
        <div>
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