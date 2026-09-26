'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutHeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-end px-[5%] sm:pt-40 pb-2 sm:pb-32 select-none overflow-hidden">
      {/* Top-Right: Mechanical Robot Hand with Sweet Pea Flowers */}
      <motion.div
        initial={{ opacity: 0, x: 60, y: -40 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -top-10 sm:-top-12 md:-top-[10%] lg:top-10 -right-[70%] sm:right-2 md:-right-[30%] lg:-right-60 -rotate-50  pointer-events-none select-none z-10"
      >
        <div className="relative w-[450px] sm:w-[480px] md:w-[480px] lg:w-[560px] xl:w-[800px] h-[700px] md:aspect-[436/1024]">
          <Image
            src="/ROBOT VINES TEST-new.original.gif"
            alt="Joyzen Robot Hand with Wild Flowers"
            fill
            priority
            
            className="object-contain object-right-top drop-shadow-sm"
          />
        </div>
      </motion.div>

      {/* Bottom-Left: Wild Sweet Pea Flower Bouquet */}
      <motion.div
        initial={{ opacity: 0, x: -50, y: 50 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="absolute -bottom-10 sm:-bottom-10 md:-bottom-14 left-0 sm:left-2 md:left-0 lg:left-0 pointer-events-none select-none z-10"
      >
        <div className="relative w-[280px] sm:w-[260px] md:w-[340px] lg:w-[400px] xl:w-[460px] aspect-[499/566]">
          <Image
            src="/flowers.svg"
            alt="Joyzen Wild Flowers"
            fill
            priority
            className="object-contain object-left-bottom drop-shadow-xs"
          />
        </div>
      </motion.div>

      {/* Main Left Content */}
      <div className="relative z-20 w-full">
        <div className="flex flex-col items-start mb-20 sm:mb-0 justify-end text-left lg:translate-x-20">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-[2.5rem] sm:text-5xl lg:text-[3.125rem] font-bold text-black tracking-tight leading-[1.1] md:leading-[1]"
          >
            You Stay On That Couch,<br />
            Our Care For Your Health Will Come<br className='block md:hidden lg:block'/>
            To You
          </motion.h1>

          {/* Subtitle / Paragraph (Green Medical Copy) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="mt-6 sm:mt-8 space-y-1 text-base md:text-base lg:text-[18px] text-[#036132] font-medium leading-[1.2]"
          >
            <p>It shouldn’t wait for you to become a patient.</p>
            <p>It shouldn’t wait for something to go wrong.</p>
            <p>
              It should see what’s coming, know exactly where you are, and stay right beside you
              through it.
            </p>
          </motion.div>

          {/* Pill CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="mt-6 sm:mt-6"
          >
            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold tracking-tight text-zinc-800 uppercase bg-[#AEDEE44D] hover:bg-[#bde6ed] backdrop-blur-xs border border-white/60 shadow-xs hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
            >
              CARE FOR A CALL? STAY ANONYMOUS.
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute -bottom-10  md:-bottom-10 -left-5 md:-left-10 right-0 w-40 h-20 sm:h-44 md:w-65 md:h-20
                  bg-[#f0f0f0] to-transparent
                  pointer-events-none blur-lg z-[10000000] md:rounded-3xl" />
    </section>
  );
}
