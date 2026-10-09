'use client';

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const Globe3DDemo = dynamic(() => import('@/reuseable/globe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[460px] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#111111]/20 border-t-[#111111] animate-spin" />
    </div>
  ),
});

const HEADLINE_WORDS = ['Supporting', 'Patients', 'Across', 'The', 'Globe'];
const SUBTITLE_WORDS = [
  'Joyzen', 'provides', 'virtual', 'consultations', 'and', 'ongoing', 'care',
  'for', 'patients', 'living', 'around', 'the', 'world.'
];

export default function Hero() {
  return (
    <section className="relative w-full flex flex-col items-center justify-start pt-28 sm:pt-36 md:pt-35 pb-12 sm:pb-10 overflow-hidden select-none">
      {/* Headline & Subtitle Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Animated Headline with Staggered Word Reveal */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-bold text-[#111111] tracking-tight flex flex-wrap justify-center items-center">
          {HEADLINE_WORDS.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.26em] last:mr-0 py-1">
              <motion.span
                initial={{ y: '120%', opacity: 0, filter: 'blur(8px)' }}
                animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.1 + i * 0.06,
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Animated Subtitle with Staggered Word Reveal */}
        <p className="mt-4 sm:mt-4 text-base sm:text-lg md:text-2xl text-black font-bold leading-tight max-w-2xl flex flex-wrap justify-center items-center">
          {SUBTITLE_WORDS.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.24em] last:mr-0 py-0.5">
              <motion.span
                initial={{ y: '110%', opacity: 0, filter: 'blur(6px)' }}
                animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.35 + i * 0.03,
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </p>
      </div>

      {/* 3D Interactive Globe Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 1.1,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.5,
        }}
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex justify-center items-center mt-0 sm:mt-0 md:mt-0 h-[460px] sm:h-[560px] md:h-[650px] lg:h-[72dvh]"
      >
        <Globe3DDemo className="w-full h-full" />
      </motion.div>
    </section>
  );
}
