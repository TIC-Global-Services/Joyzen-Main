'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Ipad } from '@/reuseable/ipad';

const HEADLINE_WORDS = ['Supporting', 'Patients', 'Across', 'The', 'Globe'];
const SUBTITLE_WORDS = [
  'Joyzen', 'provides', 'virtual', 'consultations', 'and', 'ongoing', 'care',
  'for', 'patients', 'living', 'around', 'the', 'world.'
];

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isShrunk, setIsShrunk] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  const triggerShrink = () => {
    setIsShrunk((prev) => {
      if (!prev) {
        // Wait 2000ms until the shrink transition and word-by-word text reveal finish
        setTimeout(() => {
          setIsRevealed(true);
        }, 2000);
        return true;
      }
      return prev;
    });
  };

  // Play mobile video on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const video = mobileVideoRef.current;
      if (video) {
        video.defaultMuted = true;
        video.muted = true;
        video.play().catch(() => {});
      }
    }
  }, []);

  // Desktop video play
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    const video = videoRef.current;
    if (!video || isShrunk) return;

    video.defaultMuted = true;
    video.muted = true;

    // Start video playback immediately on mount
    video.play().catch(() => {});
  }, [isShrunk]);

  // Disable all scrolling on desktop until the video completes, shrinks, and the reveal animation finishes
  useEffect(() => {
    // Never lock scroll on mobile devices
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return;
    }

    if (isRevealed) {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.start();
        lenis.resize();
      }
      return;
    }

    // Pin viewport to the very top until reveal has completely finished
    window.scrollTo(0, 0);

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverscroll = document.body.style.overscrollBehavior;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    const originalBodyTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.touchAction = 'none';

    // Repeatedly ensure Lenis smooth scroller is stopped (handles late init from SmoothScroller RAF)
    const stopLenis = () => {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.stop();
        lenis.scrollTo(0, { immediate: true });
      }
    };
    stopLenis();
    const lenisInterval = setInterval(stopLenis, 50);

    const preventScroll = (e: Event) => {
      if (e.cancelable) {
        e.preventDefault();
      }
      e.stopPropagation();
      e.stopImmediatePropagation?.();
    };

    const preventKeyScroll = (e: KeyboardEvent) => {
      const scrollKeys = [
        'Space',
        ' ',
        'ArrowUp',
        'ArrowDown',
        'PageUp',
        'PageDown',
        'Home',
        'End',
        'Tab',
      ];
      if (scrollKeys.includes(e.code) || scrollKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
      }
    };

    const preventAuxClick = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const lockScrollPosition = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', preventScroll, { passive: false, capture: true });
    window.addEventListener('touchmove', preventScroll, { passive: false, capture: true });
    window.addEventListener('keydown', preventKeyScroll, { capture: true });
    window.addEventListener('auxclick', preventAuxClick, { capture: true });
    window.addEventListener('scroll', lockScrollPosition, { passive: false, capture: true });

    document.addEventListener('wheel', preventScroll, { passive: false, capture: true });
    document.addEventListener('touchmove', preventScroll, { passive: false, capture: true });
    document.addEventListener('keydown', preventKeyScroll, { capture: true });

    return () => {
      clearInterval(lenisInterval);

      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overscrollBehavior = originalBodyOverscroll;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
      document.body.style.touchAction = originalBodyTouchAction;

      window.removeEventListener('wheel', preventScroll, true);
      window.removeEventListener('touchmove', preventScroll, true);
      window.removeEventListener('keydown', preventKeyScroll, true);
      window.removeEventListener('auxclick', preventAuxClick, true);
      window.removeEventListener('scroll', lockScrollPosition, true);

      document.removeEventListener('wheel', preventScroll, true);
      document.removeEventListener('touchmove', preventScroll, true);
      document.removeEventListener('keydown', preventKeyScroll, true);

      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.start();
        lenis.resize();
      }
    };
  }, [isRevealed]);

  // Clean up any locks if resized to mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.style.overscrollBehavior = '';
        document.documentElement.style.overscrollBehavior = '';
        document.body.style.touchAction = '';
        const lenis = (window as any).__lenis;
        if (lenis) {
          lenis.start();
          lenis.resize();
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || isShrunk) return;

    // Start shrink transition ~0.25s before completion so motion flows organically into pause
    if (video.currentTime >= video.duration - 0.25) {
      triggerShrink();
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
    triggerShrink();
  };

  // Optional: Clicking while in full screen skips straight to final frame and shrinks
  const handleVideoClick = () => {
    if (!isShrunk) {
      const video = videoRef.current;
      if (video && video.duration) {
        video.currentTime = Math.max(0, video.duration - 0.05);
        video.pause();
      }
      triggerShrink();
    }
  };

  return (
    <>
      {/* Mobile Version: Like before, normal video playing below text content */}
      <section className="relative w-full min-h-screen flex md:hidden flex-col items-center justify-start pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden select-none bg-white">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight"
          >
            Supporting Patients
            <br className="hidden sm:inline" />
            {' '}Across The Globe
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-4 sm:mt-6 text-base sm:text-lg text-black font-bold leading-relaxed max-w-3xl"
          >
            Joyzen provides virtual consultations and ongoing care
            <br className="hidden sm:inline" />
            {' '}for patients living around the world.
          </motion.p>
        </div>

        {/* iPad Container with Video inside */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative z-10 w-full px-4 sm:px-6 flex justify-center items-start mt-6 sm:mt-10"
        >
          <Ipad className="w-full max-w-[480px] sm:max-w-[520px] drop-shadow-2xl">
            <video
              ref={mobileVideoRef}
              src="/JOYZEN-MAP-FINAL-V4.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              style={{
                backgroundColor: '#ffffff',
              }}
              className="block w-full h-full object-cover pointer-events-none border-0 outline-none select-none scale-[1.01]"
            />
          </Ipad>
        </motion.div>
      </section>

      {/* Desktop Version: Fullscreen video shrinking into resting position with word-by-word reveal */}
      <section
        className={`relative w-full hidden md:flex flex-col items-center select-none bg-white overflow-hidden transition-[padding,min-height] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isShrunk
            ? 'min-h-screen pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24 justify-start'
            : 'h-screen min-h-screen pt-0 pb-0 justify-center'
        }`}
      >
        {/* Headline & Subtitle Content with Masked Word-by-Word Blur & Slide-up Effect */}
        <motion.div
          initial={false}
          animate={
            isShrunk
              ? { opacity: 1, y: 0, height: 'auto', marginBottom: 0 }
              : { opacity: 0, y: -30, height: 0, marginBottom: 0 }
          }
          transition={{
            duration: 1.1,
            ease: [0.16, 1, 0.3, 1],
            delay: isShrunk ? 0.2 : 0,
          }}
          className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden"
        >
          {/* Animated Headline with Staggered Word Reveal */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-bold text-[#111111] tracking-tight flex flex-wrap justify-center items-center">
            {HEADLINE_WORDS.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-[0.26em] last:mr-0 py-1">
                <motion.span
                  initial={{ y: '125%', opacity: 0, filter: 'blur(8px)' }}
                  animate={
                    isShrunk
                      ? { y: '0%', opacity: 1, filter: 'blur(0px)' }
                      : { y: '125%', opacity: 0, filter: 'blur(8px)' }
                  }
                  transition={{
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                    delay: isShrunk ? 0.3 + i * 0.06 : 0,
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Animated Subtitle with Staggered Word Reveal */}
          <p className="mt-3 text-base sm:text-lg md:text-2xl text-black font-bold leading-tight max-w-2xl flex flex-wrap justify-center items-center">
            {SUBTITLE_WORDS.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-[0.24em] last:mr-0 py-0.5">
                <motion.span
                  initial={{ y: '110%', opacity: 0, filter: 'blur(6px)' }}
                  animate={
                    isShrunk
                      ? { y: '0%', opacity: 1, filter: 'blur(0px)' }
                      : { y: '110%', opacity: 0, filter: 'blur(6px)' }
                  }
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    delay: isShrunk ? 0.6 + i * 0.03 : 0,
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </p>
        </motion.div>

        {/* Video Container (Smooth organic contraction with gentle easing into resting position) */}
        <motion.div
          layout
          transition={{
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          onClick={handleVideoClick}
          className={`relative z-10 w-full flex justify-center items-start transition-[margin] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isShrunk ? 'mt-6 sm:mt-10 cursor-default' : 'mt-0 cursor-pointer h-full'
          }`}
        >
          <motion.div
            layout
            transition={{
              duration: 1.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`relative w-full bg-white overflow-hidden transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isShrunk
                ? 'aspect-video max-h-[82vh]'
                : 'h-full'
            }`}
          >
            <video
              ref={videoRef}
              src="/JOYZEN-MAP-FINAL-V4.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onError={triggerShrink}
              style={{
                backgroundColor: '#ffffff',
              }}
              className={`block w-full h-full bg-white pointer-events-none border-0 outline-none select-none scale-[1.02] ${
                isShrunk ? 'object-contain' : 'object-cover'
              }`}
            />
            {/* Seamless white border overlay to eliminate subpixel/GPU black lines on all sides */}
            <div className="absolute inset-0 border-[3px] border-white pointer-events-none z-20" />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
