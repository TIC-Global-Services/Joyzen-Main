'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import SpecularButton from '@/reuseable/specularButton';

interface SlideData {
  id: number;
  image: string;
  prefixText: string;
  highlightText: string;
  highlightColor: string;
  alt: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image: '/book-an-appointment.png',
    prefixText: 'Book an',
    highlightText: 'Appointment',
    highlightColor: 'text-[#DDC5DF]',
    alt: 'Book an Appointment',
  },
  {
    id: 2,
    image: '/medical-history.png',
    prefixText: 'Share Your',
    highlightText: 'Medical History',
    highlightColor: 'text-[#DDC5DF]',
    alt: 'Share Your Medical History',
  },
  {
    id: 3,
    image: '/specialist-online.png',
    prefixText: 'Meet your',
    highlightText: 'Specialist Online',
    highlightColor: 'text-[#DDC5DF]',
    alt: 'Meet your Specialist Online',
  },
  {
    id: 4,
    image: '/care-plan.png',
    prefixText: 'Receive your personalised',
    highlightText: 'Care plan',
    highlightColor: 'text-[#DDC5DF]',
    alt: 'Receive your personalised Care plan',
  },
];

export default function Appointment() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 px-[3%] bg-transparent overflow-hidden select-none">
      {/* Preload slide images so transitions are instant without blank network lag */}
      <div className="hidden">
        {slides.map((slide) => (
          <Image
            key={slide.id}
            src={slide.image}
            alt="preload"
            width={10}
            height={10}
            priority
          />
        ))}
      </div>

      <div 
        className="w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Main Slider Card Container */}
        <div className="relative w-full aspect-[9/16] md:aspect-[16/12] lg:aspect-[16/9] rounded-[24px] sm:rounded-[30px] overflow-hidden shadow-2xl bg-zinc-900">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Card Image */}
              <Image
                src={currentSlide.image}
                alt={currentSlide.alt}
                fill
                priority
                className="object-cover"
              />

              {/* Dark Overlay gradient for contrast */}
              <div className="absolute inset-0 bg-black/5 bg-gradient-to-t from-black/65 via-black/30 to-black/25" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-between py-6 sm:py-10 md:py-12 px-6 text-center z-10">
                <div />
                {/* Title with distinct font sizing */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-wrap justify-center items-start items-baseline gap-x-3 sm:gap-x-4 lg:gap-y-1 max-w-5xl my-auto"
                >
                  <span className="text-2xl sm:text-4xl md:text-4xl lg:text-[40px] font-bold text-white tracking-tight drop-shadow-md">
                    {currentSlide.prefixText}
                  </span>
                  <span className={`text-[40px] sm:text-6xl md:text-6xl lg:text-[5rem] font-bold ${currentSlide.highlightColor} tracking-tight drop-shadow-lg`}>
                    {currentSlide.highlightText}
                  </span>
                </motion.div>

                {/* Glassmorphic Joyzen Logo Button at Center Bottom */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-2 sm:mb-4"
                >
                  <SpecularButton
                    imageSrc="/joyzen_logo.png"
                    imageAlt="Joyzen Logo"
                    imageWidth={150}
                    imageHeight={36}
                    imageClassName="h-6 sm:h-8 md:h-9 w-auto object-contain drop-shadow-sm"
                    radius={50}
                    tint="#95C1E233"
                    tintOpacity={0.1}
                    blur={1}
                    lineColor="#ffffff"
                    baseColor="transparent"
                    intensity={1.2}
                    className="px-8 sm:px-10 py-3.5 sm:py-4"
                  />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls Overlay - Left Arrow */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group"
          >
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Navigation Controls Overlay - Right Arrow */}
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 hover:bg-black/60 text-white backdrop-blur-xs border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group"
          >
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Carousel Dots & Indicators */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-[#EF8F60]'
                  : 'w-2.5 bg-black/20 hover:bg-black/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

