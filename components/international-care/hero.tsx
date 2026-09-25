'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Ipad } from '@/reuseable/ipad';

export default function Hero() {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center lg:justify-start pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8  overflow-hidden select-none">
      {/* Honeycomb Background Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50 mix-blend-multiply"
        style={{
        //   backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='97' viewBox='0 0 56 97' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 0L56 16.1658V48.4974L28 64.6632L0 48.4974V16.1658L28 0Z M28 97L0 80.8342V48.4974L28 64.6632L56 48.4974V80.8342L28 97Z' stroke='%23DCD6C5' stroke-width='0.75' fill='none'/%3E%3C/svg%3E")`,
        //   backgroundSize: '56px 97px',
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-bold text-[#111111] tracking-tight "
        >
          Supporting Patients Across The Globe
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="mt-2 text-base sm:text-lg md:text-2xl text-black font-bold leading-none max-w-2xl"
        >
          Joyzen provides virtual consultations and ongoing care
          <br className="hidden sm:inline" />
          {' '}for patients living around the world.
        </motion.p>

        {/* Tablet Image Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="w-full  flex justify-center items-start mt-10"
        >
          <div className="relative w-full max-w-4xl transition-transform duration-500 hover:scale-[1.01]">
            <Ipad width="100%" height="auto" className="drop-shadow-2xl text-zinc-900">
              <video
                ref={videoRef}
                src="/world-map-up-2.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-contain pointer-events-none"
              />
            </Ipad>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
