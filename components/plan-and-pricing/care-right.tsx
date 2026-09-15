'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function CareRight() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 90%', 'center center'],
  });

  // Smooth out the scroll animation for fluid motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  // Left side content: slides out from behind the phone to the left
  const leftX = useTransform(smoothProgress, [0, 1], ['195px', '0px']);
  const leftOpacity = useTransform(smoothProgress, [0, 0.4, 1], [0.1, 0.8, 1]);

  // Right side content: slides out from behind the phone to the right
  const rightX = useTransform(smoothProgress, [0, 1], ['-195px', '0px']);
  const rightOpacity = useTransform(smoothProgress, [0, 0.4, 1], [0.1, 0.8, 1]);

  // Central Phone scale and opacity
  const phoneScale = useTransform(smoothProgress, [0, 1], [1, 1]);
  const phoneOpacity = useTransform(smoothProgress, [0, 0.3, 1], [0.3, 0.9, 1]);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-16 sm:py-24 md:py-32 px-[5%] select-none overflow-hidden"
    >
      <div className="min-h-[550px] sm:min-h-[650px] flex flex-col lg:flex-row items-center justify-center relative">
        
        {/* DESKTOP LAYOUT (Screen lg+) */}
        <div className="hidden lg:grid grid-cols-12 items-stretch justify-center items-center min-h-[620px] w-full relative z-10">
          
          {/* Left Side: Positioned ON TOP (justify-start) */}
          <motion.div
            style={{ x: leftX, opacity: leftOpacity }}
            className="col-span-4 flex flex-col items-end justify-start text-right pt-10 z-10"
          >
            <h2 className="text-6xl md:text-7xl lg:text-[4rem] font-bold tracking-tight text-black leading-none whitespace-nowrap">
              Care, Right
            </h2>

            <div className="mt-8">
              <Link
                href="#begin"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full text-xs sm:text-sm font-bold tracking-tight text-zinc-900 bg-[#AEDEE466] hover:bg-[#95C1E266] border border-white/80 backdrop-blur-md uppercase transition-all duration-300 shadow-xs hover:scale-105 active:scale-95"
              >
                START YOUR CARE JOURNEY
              </Link>
            </div>
          </motion.div>

          {/* Center Column: Central Smartphone Image */}
          <motion.div
            style={{ scale: phoneScale, opacity: phoneOpacity }}
            className="col-span-4 flex justify-center items-center z-20 relative px-2"
          >
            <div className="relative w-[280px] sm:w-[320px] lg:w-[340px] aspect-[1/2] max-h-[650px]">
              <Image
                src="/care-right.png"
                alt="Joyzen Medical Chat Consultation on Smartphone"
                fill
                priority
                className="object-cover drop-shadow-2xl pointer-events-none"
              />
            </div>
          </motion.div>

          {/* Right Side: Positioned AT BOTTOM (justify-end) */}
          <motion.div
            style={{ x: rightX, opacity: rightOpacity }}
            className="col-span-4 flex flex-col items-start justify-end text-left pb-10 z-10"
          >
            <h2 className="text-6xl md:text-7xl lg:text-[4rem] font-bold tracking-tight text-black leading-none whitespace-nowrap">
              at Your Fingertips
            </h2>

            <div className="mt-4 max-w-sm">
              <p className="text-sm md:text-base lg:text-lg font-medium text-[#EF8F60] leading-[1.2] tracking-tight flex items-start gap-1">
                <span>
                  Stay connected with your care team through{' '}
                  <span className="inline-block">
                    
                  </span>
                  From booking consultations to receiving updates, reminders, and support, everything you need is just a message away.
                </span>
              </p>
            </div>
          </motion.div>

        </div>

        {/* MOBILE / TABLET RESPONSIVE LAYOUT (< lg) */}
        <div className="flex lg:hidden flex-col items-center text-center space-y-8 w-full">
          {/* Mobile Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black leading-none"
          >
            Care, Right at Your Fingertips
          </motion.h2>

          {/* Mobile Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-[260px] sm:w-[300px] aspect-[1/2] my-4"
          >
            <Image
              src="/care-right.png"
              alt="Joyzen Medical Chat Consultation on Smartphone"
              fill
              priority
              className="object-contain drop-shadow-xl"
            />
          </motion.div>

          {/* Mobile CTA & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center space-y-6 max-w-md "
          >
            <Link
              href="#begin"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full text-xs font-bold tracking-tight text-black bg-[#AEDEE466] hover:bg-[#95C1E266] border border-white/80 backdrop-blur-md uppercase transition-all shadow-xs"
            >
              START YOUR CARE JOURNEY
            </Link>

            <p className="text-base font-medium text-[#EF8F60] leading-[1.2]">
              Stay connected with your care team through direct chat.From booking consultations to receiving updates, reminders, and support, everything you need is just a message away.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}