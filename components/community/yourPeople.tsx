'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface CardItem {
  id: number;
  image: string;
  tag: string;
  subtitle: string;
  desc: string;
}

const CARDS: CardItem[] = [
  {
    id: 1,
    image: '/your-people-1.png',
    tag: 'Events',
    subtitle: 'Learn. Connect. Grow.',
    desc: 'Meaningful wellness experiences that educate, connect, and empower healthier living.',
  },
  {
    id: 2,
    image: '/your-people-2.png',
    tag: 'Community',
    subtitle: 'Share. Listen. Belong.',
    desc: 'Safe spaces and open circles to talk freely without judgment or expectations.',
  },
  {
    id: 3,
    image: '/your-people-3.png',
    tag: 'Stories',
    subtitle: 'Real. Honest. Human.',
    desc: 'Personal journeys, raw moments, and deep connections from people just like you.',
  },
  {
    id: 4,
    image: '/your-people-1.png',
    tag: 'Workshops',
    subtitle: 'Engage. Heal. Transform.',
    desc: 'Interactive guided sessions designed to spark discovery and everyday mindfulness.',
  },
  {
    id: 5,
    image: '/your-people-2.png',
    tag: 'Meetups',
    subtitle: 'Laugh. Unwind. Relate.',
    desc: 'Casual get-togethers where conversations flow naturally and friendships form.',
  },
];

type DeviceType = 'mobile' | 'tab' | 'desktop';

const CARD_TRANSFORMS: Record<
  DeviceType,
  Record<number, { xOffset: string; scale: number; zIndex: number; opacity: number }>
> = {
  mobile: {
    0: { xOffset: '0%', scale: 1, zIndex: 30, opacity: 1 },
    '-1': { xOffset: '-25%', scale: 0.82, zIndex: 20, opacity: 0.85 },
    1: { xOffset: '25%', scale: 0.82, zIndex: 20, opacity: 0.85 },
    '-2': { xOffset: '-48%', scale: 0.65, zIndex: 10, opacity: 0.35 },
    2: { xOffset: '48%', scale: 0.65, zIndex: 10, opacity: 0.35 },
  },
  tab: {
    0: { xOffset: '0%', scale: 1, zIndex: 30, opacity: 1 },
    '-1': { xOffset: '-20%', scale: 0.85, zIndex: 20, opacity: 0.95 },
    1: { xOffset: '20%', scale: 0.85, zIndex: 20, opacity: 0.95 },
    '-2': { xOffset: '-38%', scale: 0.7, zIndex: 10, opacity: 0.75 },
    2: { xOffset: '38%', scale: 0.7, zIndex: 10, opacity: 0.75 },
  },
  desktop: {
    0: { xOffset: '0%', scale: 1, zIndex: 30, opacity: 1 },
    '-1': { xOffset: '-28%', scale: 0.86, zIndex: 20, opacity: 1 },
    1: { xOffset: '28%', scale: 0.86, zIndex: 20, opacity: 1 },
    '-2': { xOffset: '-46%', scale: 0.72, zIndex: 10, opacity: 1 },
    2: { xOffset: '46%', scale: 0.72, zIndex: 10, opacity: 1 },
  },
};

export default function YourPeople() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tab');
      } else {
        setDeviceType('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % CARDS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + CARDS.length) % CARDS.length);
  }, []);

  // Auto-slide every 3.8 seconds smoothly, pauses on hover
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 3800);
    return () => clearInterval(timer);
  }, [nextSlide, isHovered]);

  /**
   * Helper to compute relative offset (-2, -1, 0, 1, 2)
   * so all 5 cards are always positioned accurately in 3D cascade.
   */
  const getCardOffset = (index: number) => {
    const total = CARDS.length;
    let diff = (index - currentIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section className="relative w-full py-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-8 overflow-hidden flex flex-col items-center justify-center select-none">
      {/* Header Heading */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12 sm:mb-16 md:mb-0"
      >
        <h2 className="text-[40px] sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111827] leading-[1.1]">
          Your People
        </h2>
        <h2 className="text-[40px] sm:text-5xl md:text-6xl font-bold tracking-tight text-[#135836] leading-[1.1]">
          Are Already Here.
        </h2>
      </motion.div>

      {/* 5-Card Smooth Auto-Changing Stacked Carousel */}
      <div
        className="relative w-full h-[320px] sm:h-[380px] md:h-[440px] lg:h-[480px] flex items-center justify-center mt-6 lg:mt-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {CARDS.map((card, index) => {
            const offset = getCardOffset(index);
            const isCenter = offset === 0;

            // Compute dynamic transformation styles based on offset & device type (mobile, tab, desktop)
            const transformConfig = CARD_TRANSFORMS[deviceType]?.[offset] ?? {
              xOffset: '0%',
              scale: 0.5,
              zIndex: 0,
              opacity: 0,
            };

            const { xOffset, scale, zIndex, opacity } = transformConfig;

            return (
              <motion.div
                key={card.id}
                initial={false}
                animate={{
                  x: xOffset,
                  scale: scale,
                  zIndex: zIndex,
                  opacity: opacity,
                }}
                transition={{
                  duration: 0.85,
                  ease: [0.25, 1, 0.35, 1],
                }}
                onClick={() => {
                  if (offset !== 0) {
                    setCurrentIndex(index);
                  }
                }}
                className={`absolute w-[78%] sm:w-[60%] md:w-[50%] lg:w-[46%] aspect-[3/4] sm:aspect-[4/5] lg:aspect-[16/8] rounded-2xl sm:rounded-3xl md:rounded-[28px] overflow-hidden cursor-pointer shadow-xl transition-shadow duration-300 ${
                  isCenter
                    ? 'shadow-2xl ring-1 ring-black/5 hover:scale-[1.01]'
                    : 'hover:opacity-100 hover:brightness-105'
                }`}
                style={{
                  transformOrigin: 'center center',
                }}
              >
                {/* Background Image */}
                <Image
                  src={card.image}
                  alt={`${card.tag} - Joyzen Community`}
                  fill
                  priority={isCenter || Math.abs(offset) === 1}
                  className="object-cover w-full h-full"
                />

                {/* Subtle dark vignette overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-transparent pointer-events-none" />

                {/* Overlay Text only on center card */}
                {isCenter && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute inset-0 p-4 sm:p-7 md:p-8 flex flex-col justify-start pointer-events-none"
                  >
                    <div className="max-w-[90%] sm:max-w-[85%] lg:max-w-[75%] space-y-1 sm:space-y-1.5 drop-shadow-md">
                      <div className="flex flex-col lg:flex-row items-baseline lg:gap-2">
                        <span className="text-xl sm:text-2xl font-semibold text-[#DDC5DF]">
                          {card.tag}
                        </span>
                        <span className="text-base sm:text-lg font-normal text-white/90">
                          {card.subtitle}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm md:text-base font-light text-white leading-[1.3] drop-shadow">
                        {card.desc}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Navigation Indicators */}
        <div className="absolute -bottom-18 md:-bottom-10 lg:bottom-8 flex items-center justify-center gap-2 z-40">
          {CARDS.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-2 rounded-full transition-all duration-400 ${
                dotIdx === currentIndex
                  ? 'w-7 bg-[#135836]'
                  : 'w-2 bg-[#135836]/30 hover:bg-[#135836]/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Narrative Description */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-2xl sm:max-w-5xl mx-auto mt-25 md:mt-20 lg:mt-2"
      >
        <p className="text-xl lg:text-[28px] text-[#EB7847] font-medium leading-[1.2]">
          People who make you laugh. People who challenge the way you think. People
          who understand exactly what you&apos;re going through. And people you haven&apos;t even met yet.
        </p>
        <p className="text-xl md:text-[28px] font-bold text-[#135836]">
          Maybe it&apos;s time you find them.
        </p>
      </motion.div>
    </section>
  );
}