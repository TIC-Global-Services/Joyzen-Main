'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-end pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-20 md:pb-24 px-[5%] overflow-hidden select-none">
      {/* 3D Glass DNA Graphic with Floating Animation & Interactive Hotspots */}
      <div className="absolute -top-20 sm:top-10 md:-top-10 lg:-top-38 -right-[45%] sm:-right-[35%] lg:-right-[15%] w-[150%] sm:w-[95%] md:w-[150%] lg:w-[98%]  pointer-events-none z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-square md:aspect-[17/10]"
        >
          {/* Subtle floating effect */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-full h-full drop-shadow-sm"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                backgroundColor: 'transparent',
                WebkitTransform: 'translate3d(0,0,0)',
                transform: 'translateZ(0)',
              }}
              className="object-cover w-full h-full object-top-right bg-transparent border-0 outline-none  mix-blend-multiply"
            >
              <source src="/DNA_Joyzen-nobg.mov" type='video/quicktime; codecs="hvc1"' />
              <source src="/DNA_Joyzen-nobg.mov" type='video/mp4; codecs="hvc1"' />
              <source src="/DNA_Joyzen-nobg.webm" type="video/webm" />
            </video>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Content Area */}
      <div className="relative z-10 w-full max-w-5xl mt-auto">
        {/* Eyebrow / Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl font-semibold text-zinc-900 tracking-tight mb-2 leading-none"
        >
          We believe the future of healthcare <br/> shouldn&apos;t feel foreign
        </motion.p>

        {/* Primary Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.5rem] md:text-5xl lg:text-[50px] font-bold tracking-tight text-black leading-none sm:leading-[1.12]"
        >
          It Should Feel Like Healthcare Finally <br className="hidden lg:inline" />
          Understands The Way You Live
        </motion.h1>
      </div>
    </section>
  );
}