'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HereItFrom() {
  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 px-[5%] flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Main Founder Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-[#C3C3C5] aspect-[9/18] sm:aspect-[4/4] lg:aspect-[16/8]"
      >
        {/* Founder & CEO Image - Half in clear top area, half under blurred glass overlay */}
        <div className="absolute -top-1 sm:-top-30 lg:top-0 lg:-right-[30%]  inset-x-0 h-[350px] sm:h-full z-0 pointer-events-none">
          <Image
            src="/founder-ceo.png"
            alt="Founder & CEO"
            fill
            priority
            style={{ objectPosition: '30% 65%' }}
            className="object-cover md:object-contain object-top sm:object-center"
          /> 
        </div>

        {/* Ribbed / Fluted Glass Frosted Banner Overlay */}
        <div className="relative z-10 mt-[65%] sm:mt-0 sm:absolute sm:bottom-0 sm:inset-x-0 overflow-hidden  sm:rounded-none sm:rounded-b-3xl">
          {/* Reeded / Fluted Cylindrical Glass Texture Effect */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-start overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-xs bg-black/5" />
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-full h-[70px] relative shrink-0 bg-gradient-to-b from-black/5 via-black/10 to-black/25 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.2)] backdrop-blur-md"
              />
            ))}
          </div>

          {/* Glass Content */}
          <div className="relative z-10 px-6 sm:px-10 md:px-12 py-7 sm:py-9 md:py-10 flex flex-col justify-between">
            {/* Cyan Highlighted Statement */}
            <h2 className="text-3xl sm:text-3xl md:text-[28px] lg:text-3xl font-bold tracking-tight text-[#AEDEE4] leading-none md:leading-[1.2] drop-shadow-sm font-sans">
              Healthcare should do more than treat a moment. <br className="hidden lg:inline" />
              It should understand the person behind it.
            </h2>

            {/* White Vision Paragraph */}
            <p className="mt-3 sm:mt-4 text-xl leading-[1.1] md:leading-[1.2] text-white font-normal max-w-4xl drop-shadow-xs">
              To build a future where we understand health long before illness, make real care genuinely accessible,
              and help people live longer without putting life on hold. Joyzen exists to make healthcare move at the
              speed of life, so when your health changes, your life doesn&apos;t have to stop.
            </p>

            {/* Sign-off / Attribution */}
            <div className="flex justify-end">
              <span className="text-white font-bold text-sm sm:text-base md:text-lg tracking-wide drop-shadow-sm mt-3 sm:mt-0 mb-2 sm:mb-5">
                - Founder &amp; CEO
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hear It From The Founder Pill CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 sm:mt-8"
      >
        <Link
          href="#founder-story"
          className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white/20 shadow-xl hover:bg-white backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-xs sm:text-base font-normal uppercase tracking-tight text-[#EB7847] transition-all duration-300 hover:scale-105 active:scale-95 group"
        >
          {/* Target / Radar Indicator Dot */}
          <span className="relative flex items-center justify-center w-4 h-4 rounded-full border border-[#EB7847]/50 group-hover:border-[#EB7847] transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EB7847]" />
          </span>
          <span>Hear It From The Founder</span>
        </Link>
      </motion.div>
    </section>
  );
}