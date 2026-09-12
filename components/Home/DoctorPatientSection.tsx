'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import Reveal from '@/reuseable/Reveal';

export default function DoctorPatientSection() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  // Can start revealing badges when image is loaded AND section is in view
  const canAnimateBadges = imageLoaded && isInView;

  // Fallback if image was cached and onLoad already fired
  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full py-16 sm:py-28 px-4 sm:px-8 overflow-hidden">
      <div className="flex flex-col items-center">
        {/* Section Heading */}
        <Reveal delay={0.1} className="max-w-4xl text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight text-black leading-[1.2]">
            Give us a chance to make your doctor truly know you, and to help you finally understand what your body has been trying to say.
          </h2>
        </Reveal>

        {/* Central Graphic Container with Badges */}
        <div ref={containerRef} className="relative w-full max-w-3xl flex justify-center items-center py-6 sm:py-10">
          
          {/* Badge 1: Top Left */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={canAnimateBadges ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -top-3 sm:top-30 left-2 sm:-left-6 lg:-left-10 z-20"
          >
            <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/20 backdrop-blur-xs border border-[#AEDEE44D] shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-xs sm:text-base font-medium text-zinc-800">
              Care that stays connected
            </div>
          </motion.div>

          {/* Badge 2: Top Right */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={canAnimateBadges ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-6 sm:top-46 right-2 sm:-right-6 lg:-right-30 z-20"
          >
            <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/20 backdrop-blur-xs border border-[#AEDEE44D] shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-xs sm:text-base font-medium text-zinc-800">
              Support that stays, start to finish
            </div>
          </motion.div>

          {/* Badge 3: Bottom Left */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={canAnimateBadges ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-20 sm:bottom-58 left-0 sm:-left-8 lg:-left-20 z-20 text-right"
          >
            <div className="px-4 sm:px-5 py-3 rounded-2xl bg-white/30 backdrop-blur-xs border border-[#AEDEE44D] shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-xs sm:text-base font-medium text-black leading-snug">
              Treatment shaped around you.<br />
              <span className="font-normal">Big problem or small.</span>
            </div>
          </motion.div>

          {/* Badge 4: Bottom Right (Cyan tinted card) */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={canAnimateBadges ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-12 sm:bottom-45 right-0 sm:-right-8 lg:-right-40 z-20 max-w-xs"
          >
            <div className="p-4 sm:p-5 rounded-full bg-[#AEDEE44D]/70 backdrop-blur-xs border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.07)] text-xs sm:text-base font-medium text-black leading-snug">
              It&apos;s 2026. Are you still carrying your medical history around in a plastic folder?
            </div>
          </motion.div>

          {/* Central Image Card */}
          <div className="relative w-full max-w-[547px] aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl">
            <Image
              src="/give-us-chance.jpg"
              alt="Doctor Patient Connected Care"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              priority
              onLoad={() => setImageLoaded(true)}
              className="object-cover object-center"
            />

            {/* Overlaid Banner at Bottom of Photo */}
            <div className="absolute inset-x-4 sm:inset-x-6 bottom-10 z-10">
              <div className="px-2 py-4.5 rounded-2xl bg-black/20 backdrop-blur-xs border border-white/20 text-center shadow-lg">
                <p className="text-xs sm:text-sm md:text-2xl font-medium text-white tracking-wide leading-[1.2]">
                  We track every delivery. <br />
                  Why shouldn&apos;t we track our{' '}
                  <span className="text-[#EF8F60] font-semibold">health</span>?
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
