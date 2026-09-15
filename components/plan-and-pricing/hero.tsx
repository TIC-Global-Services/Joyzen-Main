'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative w-full pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-[3%] flex flex-col items-center select-none overflow-hidden">
      {/* Top Main Hero Image Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full rounded-2xl sm:rounded-3xl md:rounded-[32px] overflow-hidden  border border-zinc-200/50 bg-zinc-100 max-w-7xl"
      >
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[5/2]">
          <Image
            src="/pricing-hero.jpg"
            alt="Doctor consulting with patient"
            fill
            priority
            style={{objectPosition:"50% 30%"}}
            className="object-cover"
          />
        </div>
      </motion.div>

      {/* Bottom Content Split Row */}
      <div className="w-full mt-8 sm:mt-12 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end justify-between">
        {/* Left Side: Category Eyebrow & Bold Statement */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col justify-end"
        >
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#D4B8DE] leading-none">
            Everyday Care
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold tracking-tight text-black mt-2 sm:mt-3 leading-tight">
            Your Doctor, Minus The Waiting Room.
          </h1>
        </motion.div>

        {/* Right Side: Narrative Copy (Right Aligned) */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col items-start lg:items-end justify-end"
        >
          <p className="text-sm md:text-base lg:text-lg text-black leading-[1.2] font-normal text-left lg:text-right max-w-2xl">
            Booking a doctor should take less effort than booking a table. No waiting
            room, no old magazines, no wondering whether the person beside you is
            contagious. You open the app, you talk to your doctor, and follow-ups
            actually follow up.
          </p>
        </motion.div>
      </div>
    </section>
  );
}