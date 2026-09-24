'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Reveal from '@/reuseable/Reveal';

const mobileCardContents = [
  (
    <>
      We track every delivery. <br />
      Why shouldn&apos;t we track our{' '}
      <span className="text-[#EF8F60] font-semibold">health</span>?
    </>
  ),
  (
    <>
      Care that stays <span className="text-[#AEDEE4]">connected</span>
    </>
  ),
  (
    <>
      Support that stays, <span className="text-[#AEDEE4]">start to finish</span>
    </>
  ),
  (
    <>
      Treatment shaped around you. <br />
      <span className="text-white/80">Big problem or small.</span>
    </>
  ),
  (
    <>
      It&apos;s 2026. Are you still carrying your medical history around in a{' '}
      <span className="text-[#EF8F60] font-semibold">plastic folder</span>?
    </>
  ),
];

export default function DoctorPatientSection() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Auto-cycle contents on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mobileCardContents.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-16 sm:py-28 px-4 sm:px-8 overflow-hidden">
      <div className="flex flex-col items-center">
        {/* Section Heading */}
        <Reveal delay={0.1} className="lg:max-w-4xl text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight text-black leading-[1.2]">
            Give us a chance to make your doctor truly know you, and to help you finally understand what your body has been trying to say.
          </h2>
        </Reveal>

        {/* Central Graphic Container with Badges */}
        <div ref={containerRef} className="relative w-full max-w-3xl flex justify-center items-center py-6 sm:py-10">
          
          {/* Badge 1: Top Left (Desktop only) */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={canAnimateBadges ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block absolute sm:top-30 -left-6 lg:-left-10 z-20"
          >
            <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/20 backdrop-blur-xs border border-[#AEDEE44D] shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-xs sm:text-base font-medium text-zinc-800">
              Care that stays connected
            </div>
          </motion.div>

          {/* Badge 2: Top Right (Desktop only) */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={canAnimateBadges ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block absolute md:top-16 lg:top-46 -right-6 lg:-right-30 z-20"
          >
            <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 backdrop-blur-xs border border-[#AEDEE44D] shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-xs sm:text-base font-medium text-black">
              Support that stays, start to finish
            </div>
          </motion.div>

          {/* Badge 3: Bottom Left (Desktop only) */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={canAnimateBadges ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block absolute sm:bottom-58 -left-8 lg:-left-20 z-20 text-right"
          >
            <div className="px-4 sm:px-5 py-3 rounded-full bg-white/30 backdrop-blur-xs border border-[#AEDEE44D] shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-xs sm:text-base font-medium text-black leading-snug">
              Treatment shaped around you.<br />
              <span className="font-normal">Big problem or small.</span>
            </div>
          </motion.div>

          {/* Badge 4: Bottom Right (Desktop only) */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={canAnimateBadges ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block absolute lg:bottom-45 -right-8 lg:-right-40 z-20 max-w-xs"
          >
            <div className="p-4 sm:p-5 rounded-full bg-[#AEDEE44D]/70 backdrop-blur-xs border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.07)] text-xs sm:text-base font-medium text-black leading-snug">
              It&apos;s 2026. Are you still carrying your medical history around in a plastic folder?
            </div>
          </motion.div>

          {/* Central Image Card */}
          <div className="relative w-full max-w-[547px] aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl">
            <Image
              src="/give-us-chance-new.png"
              alt="Doctor Patient Connected Care"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              priority
              onLoad={() => setImageLoaded(true)}
              className="object-cover object-center"
            />

            {/* Overlaid Banner at Bottom of Photo */}
            <div className="absolute inset-x-4 sm:inset-x-6 bottom-6 sm:bottom-10 z-10">
              <div className="px-3 sm:px-4 py-3.5 sm:py-4.5 rounded-2xl bg-black/40 sm:bg-black/20 backdrop-blur-xs border border-white/20 text-center shadow-lg min-h-[96px] sm:min-h-0 flex flex-col items-center justify-center">
                
                {/* Mobile: Auto-changing cards content */}
                <div className="block sm:hidden w-full min-h-[70px] flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="text-base sm:text-base font-medium text-white tracking-wide leading-normal text-center px-1"
                    >
                      {mobileCardContents[currentIndex]}
                    </motion.p>
                  </AnimatePresence>

                  {/* Pagination dots for mobile */}
                  {/* <div className="flex items-center justify-center gap-1.5 mt-2">
                    {mobileCardContents.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentIndex ? 'w-4 bg-[#EF8F60]' : 'w-1.5 bg-white/40'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div> */}
                </div>

                {/* Desktop: Static main card banner */}
                <div className="hidden sm:block">
                  <p className="text-sm md:text-2xl font-medium text-white tracking-wide leading-normal text-center">
                    We track every delivery. <br />
                    Why shouldn&apos;t we track our{' '}
                    <span className="text-[#EF8F60] font-semibold">health</span>?
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

