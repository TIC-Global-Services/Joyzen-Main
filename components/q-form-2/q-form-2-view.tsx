'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Form from '@/components/q-form-2/form';
import Consultant from '@/components/q-form-2/conseltent';

export default function QForm2View() {
  return (
    <main className="relative w-full min-h-screen select-none overflow-hidden">
      {/* 2. Soft Pastel Dynamic Moving Mesh Gradient Overlay */}
      <div className="absolute inset-0 moving-bg-mesh pointer-events-none z-0" />

      {/* 3. Glowing Ambient Mesh Blobs crossing left-to-right & right-to-left */}
      {/* Left Peach blob moves all the way to the Right */}
      <motion.div
        className="absolute top-0 -left-20 w-[750px] h-[750px] bg-[#FFAAA6]/75 rounded-full blur-[120px] pointer-events-none z-0"
        animate={{
          x: ['-5vw', '70vw', '-5vw'],
          y: ['0vh', '30vh', '0vh'],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Right Cyan blob moves all the way to the Left */}
      <motion.div
        className="absolute top-1/4 -right-20 w-[750px] h-[750px] bg-[#80DEEA]/70 rounded-full blur-[120px] pointer-events-none z-0"
        animate={{
          x: ['5vw', '-70vw', '5vw'],
          y: ['0vh', '-25vh', '0vh'],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Top Warm Champagne blob crosses left to right */}
      <motion.div
        className="absolute top-1/3 left-10 w-[650px] h-[650px] bg-[#FFDFD3]/65 rounded-full blur-[130px] pointer-events-none z-0"
        animate={{
          x: ['0vw', '55vw', '0vw'],
          y: ['0vh', '40vh', '0vh'],
          scale: [0.9, 1.15, 0.9],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Bottom Aqua blob crosses right to left */}
      <motion.div
        className="absolute bottom-1/4 right-10 w-[700px] h-[700px] bg-[#B2EBF2]/75 rounded-full blur-[130px] pointer-events-none z-0"
        animate={{
          x: ['0vw', '-55vw', '0vw'],
          y: ['0vh', '-35vh', '0vh'],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Central Soft Lavender blending cloud */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[#E6D3F5]/55 rounded-full blur-[140px] pointer-events-none z-0"
        animate={{
          scale: [0.85, 1.25, 0.85],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Page Content */}
      <div className="relative z-10 space-y-12">
        <Form />
        <Consultant />
      </div>
    </main>
  );
}
