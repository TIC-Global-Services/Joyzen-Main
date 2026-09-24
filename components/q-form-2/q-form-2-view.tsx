'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Form from '@/components/q-form-2/form';
import Consultant from '@/components/q-form-2/conseltent';

export default function QForm2View() {
  return (
    <main className="relative w-full min-h-screen select-none overflow-hidden">
      {/* Dynamic Animated Background: Vibrant Pastel, Full Edge-to-Edge Color Sweep */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#FCFAF7]/20">
        {/* Full-width sweeping pastel base gradient */}
        <motion.div
          className="absolute top-0 -left-[60vw] w-[220vw] h-full opacity-60 blur-[35px]"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(250,237,150,0.65) 0%, rgba(255,218,195,0.6) 25%, rgba(235,208,245,0.55) 50%, rgba(185,228,252,0.65) 75%, rgba(250,237,150,0.65) 100%)',
            backgroundSize: '100% 100%',
          }}
          animate={{
            x: ['0vw', '60vw', '0vw'],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* LEFT COLOR WAVE (Vibrant Sunny Yellow / Peach) -> Moves COMPLETELY to the RIGHT */}
        <motion.div
          className="absolute top-1/6 -left-36 w-[880px] h-[880px] rounded-full blur-[130px]"
          style={{
            background:
              'radial-gradient(circle, rgba(250,237,150,0.7) 0%, rgba(255,218,195,0.55) 50%, transparent 75%)',
          }}
          animate={{
            x: ['0vw', '75vw', '0vw'],
            y: ['0vh', '14vh', '0vh'],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* RIGHT COLOR WAVE (Vibrant Sky Blue / Lavender) -> Moves COMPLETELY to the LEFT */}
        <motion.div
          className="absolute top-1/4 -right-36 w-[920px] h-[920px] rounded-full blur-[130px]"
          style={{
            background:
              'radial-gradient(circle, rgba(185,228,252,0.7) 0%, rgba(235,208,245,0.55) 50%, transparent 75%)',
          }}
          animate={{
            x: ['0vw', '-75vw', '0vw'],
            y: ['0vh', '-12vh', '0vh'],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* LOWER LEFT WAVE (Warm Coral Peach) -> Drifts across to the right */}
        <motion.div
          className="absolute top-2/3 -left-32 w-[780px] h-[780px] rounded-full blur-[130px]"
          style={{
            background:
              'radial-gradient(circle, rgba(255,208,185,0.6) 0%, rgba(250,237,150,0.45) 50%, transparent 75%)',
          }}
          animate={{
            x: ['0vw', '70vw', '0vw'],
            y: ['0vh', '-8vh', '0vh'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.8,
          }}
        />

        {/* UPPER RIGHT WAVE (Fresh Aqua Mint / Lilac) -> Drifts across to the left */}
        <motion.div
          className="absolute -top-32 -right-32 w-[820px] h-[820px] rounded-full blur-[130px]"
          style={{
            background:
              'radial-gradient(circle, rgba(195,242,246,0.65) 0%, rgba(235,208,245,0.45) 50%, transparent 75%)',
          }}
          animate={{
            x: ['0vw', '-70vw', '0vw'],
            y: ['0vh', '10vh', '0vh'],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.2,
          }}
        />
      </div>

      {/* Page Content */}
      <div className="relative z-10 space-y-12">
        <Form />
        <Consultant />
      </div>
    </main>
  );
}
