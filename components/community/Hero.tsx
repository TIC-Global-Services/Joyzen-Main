'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import CommunityHeroShowcase from './CommunityHeroShowcase';
import RobotSequence from './RobotSequence';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-between items-center pt-24 sm:pt-36 md:pt-40 pb-16 sm:pb-24 px-[5%] sm:px-[1%] overflow-hidden select-none">
      {/* Top Split Content for Desktop / Reordered for Mobile */}
      <div className="relative w-full grid grid-cols-1 lg:grid-cols-12 items-center justify-center gap-6 lg:gap-10">
        
        {/* Absolute positioned Robot Sequence between text and calendar */}
        <div className="absolute top-[20%] md:top-[30%] md:left-[15%] lg:top-[40%] left-[18%] lg:left-[47%] transform -translate-x-1/2 -translate-y-[40%] lg:-translate-y-[45%] w-[220px] sm:w-[280px] md:w-[350px] xl:w-[450px] aspect-square z-10 pointer-events-none">
          <RobotSequence />
        </div>

        {/* Right: 3D Robot & Appointment Dashboard Banner (1st on mobile, 2nd on desktop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="order-1 lg:order-2 lg:col-span-7 flex justify-center lg:justify-center items-center"
        >
          <div className="relative w-full">

            {/* Right: 3D Robot & Appointment Dashboard Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="lg:col-span-7 flex justify-center lg:justify-center items-center"
            >
              <div className="relative w-full aspect-[16/7] transition-transform duration-500 hover:scale-[1.02] translate-x-12 md:translate-x-0">
                <Image
                  src="/calender.png"
                  alt="Joyzen Robot with Appointments Calendar"
                  fill
                  priority
                  className="object-contain drop-shadow-sm"
                />
              </div>
            </motion.div>

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