'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import SpecularButton from '@/reuseable/specularButton';

export interface ChoiceHeroProps {
  onSelectPatient?: () => void;
  isStandalonePage?: boolean;
  isReady?: boolean;
}

export default function ChoiceHero({
  onSelectPatient,
  isStandalonePage = false,
  isReady = true,
}: ChoiceHeroProps) {
  const pathname = usePathname();

  // Animation phases:
  // 'initial'   -> separated (.joy and żen), logo at divider
  // 'converged' -> .joy & żen meet in center (joyzen), logo lifts top, specular buttons appear
  const [phase, setPhase] = useState<'initial' | 'converged'>('initial');
  const [hoverSide, setHoverSide] = useState<'doctor' | 'patient' | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile viewport (< 768px) for top-and-bottom responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse tracking with smooth spring physics for the cursor-following badge (desktop only)
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const springX = useSpring(mouseX, { stiffness: 450, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 30 });

  // Scroll lock is strictly isolated to the home page ('/') while ChoiceHero is visible:
  // 1. Pauses Lenis smooth scrolling (lenis.stop()) and resets scroll position to 0
  // 2. Locks HTML and body overflow & height
  // 3. Captures wheel, touchmove, keydown, and scroll events with stopImmediatePropagation()
  // 4. Continuously pins window.scrollY at 0 until portal choice is completed
  useEffect(() => {
    // Only lock scroll on home page ('/') or standalone choice page while ChoiceHero is active
    if (isExiting || (pathname !== '/' && !isStandalonePage)) return;

    // Apply strict overflow locks
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';

    // Enforce top position and stop Lenis scroller
    const enforceScrollLock = () => {
      window.scrollTo(0, 0);
      const lenis = (window as any).__lenis;
      if (lenis) {
        if (!lenis.isStopped) {
          lenis.stop();
        }
        lenis.scrollTo(0, { immediate: true });
      }
    };

    enforceScrollLock();

    // Catch Lenis if it initializes after ChoiceHero mounts (due to requestAnimationFrame in SmoothScroller)
    const lockInterval = setInterval(enforceScrollLock, 50);

    // Prevent mouse wheel and touch gestures from bubbling or capturing to scrollers
    const handleScrollBlock = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };

    // Prevent keyboard scroll keys
    const handleKeyBlock = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };

    // Capture phase listeners (capture: true) guarantee we intercept BEFORE any Lenis or page listeners
    window.addEventListener('wheel', handleScrollBlock, { passive: false, capture: true });
    window.addEventListener('touchmove', handleScrollBlock, { passive: false, capture: true });
    window.addEventListener('keydown', handleKeyBlock, { passive: false, capture: true });
    window.addEventListener('scroll', enforceScrollLock, { passive: false, capture: true });

    return () => {
      clearInterval(lockInterval);

      // Cleanly remove all inline overflow and height overrides so page can scroll normally
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.overflow = '';
      document.body.style.height = '';

      window.removeEventListener('wheel', handleScrollBlock, { capture: true });
      window.removeEventListener('touchmove', handleScrollBlock, { capture: true });
      window.removeEventListener('keydown', handleKeyBlock, { capture: true });
      window.removeEventListener('scroll', enforceScrollLock, { capture: true });

      // Resume Lenis smooth scroller
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.start();
        lenis.resize();
      }
    };
  }, [isExiting]);

  // Trigger convergence animation after isReady is true and initial reveal time
  useEffect(() => {
    if (!isReady) return;

    const timer = setTimeout(() => {
      setPhase('converged');
    }, 1000);

    return () => clearTimeout(timer);
  }, [isReady]);

  // Track pointer movements
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }
  }, [mouseX, mouseY]);

  const handlePointerLeave = useCallback(() => {
    setHoverSide(null);
    mouseX.set(-500);
    mouseY.set(-500);
  }, [mouseX, mouseY]);

  // Navigate to Doctor domain
  const handleDoctorClick = useCallback(() => {
    window.location.href = 'https://doctors.joyzen.in/';
  }, []);

  // Choose Patient site (dismiss ChoiceHero or route home)
  const handlePatientClick = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('joyzen_choice_completed', 'true');
    }

    if (isStandalonePage) {
      window.location.href = '/';
      return;
    }

    // Explicitly pin scroll to top before unmounting ChoiceHero
    window.scrollTo(0, 0);
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }

    setIsExiting(true);
    setTimeout(() => {
      if (lenis) {
        lenis.start();
        lenis.resize();
      }
      onSelectPatient?.();
    }, 550);
  }, [isStandalonePage, onSelectPatient]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          ref={containerRef}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onPointerMove={!isMobile ? handlePointerMove : undefined}
          onPointerLeave={!isMobile ? handlePointerLeave : undefined}
          className="fixed inset-0 z-[99999] w-full h-full bg-black select-none overflow-hidden flex flex-col md:flex-row"
        >
          {/* ======================================================== */}
          {/* DOCTOR SECTION (TOP on mobile, LEFT on desktop)          */}
          {/* ======================================================== */}
          <div
            onClick={isMobile ? undefined : handleDoctorClick}
            onPointerEnter={() => {
              if (!isMobile) setHoverSide('doctor');
            }}
            className={`relative w-full h-1/2 md:w-1/2 md:h-full overflow-hidden ${
              isMobile ? '' : 'cursor-pointer'
            } group`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
              <Image
                src="/doctor_thumbnail.png"
                alt="Joyzen for Doctors"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>

            {/* Subtle Gradient Overlays for High Contrast */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-black/10 pointer-events-none" />

            {/* Action Button: "For Doctors" (Primary navigation trigger on mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={
                phase === 'converged'
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 25, scale: 0.95 }
              }
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute left-1/2 -translate-x-1/2 top-1/2 sm:top-10 md:top-auto md:bottom-24 z-30 touch-manipulation ${
                phase === 'converged' ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleDoctorClick();
              }}
            >
              <SpecularButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDoctorClick();
                }}
                size="md"
                radius={24}
                tint="#ffffff"
                tintOpacity={0.12}
                blur={16}
                textColor="#ffffff"
                lineColor="#EF8F60"
                baseColor="#ffffff"
                intensity={1.2}
                shineSize={18}
                shineFade={40}
                thickness={1.2}
                autoAnimate={true}
                className="backdrop-blur-xl border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.5)] font-medium text-sm sm:text-base tracking-wide px-6 sm:px-8 py-3 sm:py-3.5 hover:scale-105 active:scale-95 transition-transform duration-200 whitespace-nowrap cursor-pointer touch-manipulation"
              >
                For Doctors
              </SpecularButton>
            </motion.div>
          </div>

          {/* ======================================================== */}
          {/* PATIENT SECTION (BOTTOM on mobile, RIGHT on desktop)     */}
          {/* ======================================================== */}
          <div
            onClick={isMobile ? undefined : handlePatientClick}
            onPointerEnter={() => {
              if (!isMobile) setHoverSide('patient');
            }}
            className={`relative w-full h-1/2 md:w-1/2 md:h-full overflow-hidden ${
              isMobile ? '' : 'cursor-pointer'
            } group`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
              <Image
                src="/patient_thumbnail.png"
                alt="Joyzen for Patients"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-black/q0 group-hover:bg-black/25 transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-black/10 pointer-events-none" />

            {/* Action Button: "For Patients" (Primary navigation trigger on mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={
                phase === 'converged'
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 25, scale: 0.95 }
              }
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute left-1/2 -translate-x-1/2 bottom-40 sm:bottom-10 md:bottom-24 z-30 touch-manipulation ${
                phase === 'converged' ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handlePatientClick();
              }}
            >
              <SpecularButton
                onClick={(e) => {
                  e.stopPropagation();
                  handlePatientClick();
                }}
                size="md"
                radius={24}
                tint="#ffffff"
                tintOpacity={0.12}
                blur={16}
                textColor="#ffffff"
                lineColor="#EF8F60"
                baseColor="#ffffff"
                intensity={1.2}
                shineSize={18}
                shineFade={40}
                thickness={1.2}
                autoAnimate={true}
                className="backdrop-blur-xl border md:border-white/20 border-white/30 s hadow-[0_12px_36px_rgba(0,0,0,0.5)] font-medium text-sm sm:text-base tracking-wide px-6 sm:px-8 py-3 sm:py-3.5 hover:scale-105 active:scale-95 transition-transform duration-200 whitespace-nowrap cursor-pointer touch-manipulation"
              >
                For Patients
              </SpecularButton>
            </motion.div>
          </div>

          {/* ======================================================== */}
          {/* SEAM DIVIDER (Horizontal on mobile, Vertical on desktop) */}
          {/* ======================================================== */}
          <div className="absolute left-0 right-0 top-1/2 h-[1px] -translate-y-1/2 bg-white/20 md:hidden pointer-events-none z-20" />
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 bg-white/20 pointer-events-none z-20" />

          {/* ======================================================== */}
          {/* ANIMATING LOGO & TYPOGRAPHY OVERLAY                      */}
          {/* ======================================================== */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
            <motion.div
              animate={
                phase === 'converged'
                  ? { y: isMobile ? -6 : -48 }
                  : { y: 0 }
              }
              transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col items-center justify-center"
            >

              {/* 1. Center Joyzen Icon Mark */}
              {/* On mobile: starts right on horizontal divider, lifts slightly on convergence */}
              {/* On desktop: starts on vertical divider at y: 56, lifts on top of joyzen */}
              <motion.div
                initial={{ y: isMobile ? 0 : 56, scale: 1 }}
                animate={
                  phase === 'converged'
                    ? { y: isMobile ? -10 : 0, scale: 1.05 }
                    : { y: isMobile ? 0 : 56, scale: 1 }
                }
                transition={{
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mb-2 sm:mb-3 md:mb-5 z-20"
              >
                <svg
                  viewBox="0 0 35 54"
                  className="w-6 h-9 sm:w-8 sm:h-12 md:w-9 md:h-14 overflow-visible drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Top Dot */}
                  <path
                    d="M16.9695 11.7599C13.8332 11.7599 11.1844 9.08957 11.1844 5.92996C11.1844 2.77036 13.8354 0 16.9695 0C20.1036 0 22.8516 2.65946 22.8516 5.92996C22.8516 9.20047 20.1575 11.7599 16.9695 11.7599Z"
                    fill="#EF8F60"
                  />
                  {/* Upper Curve */}
                  <path
                    d="M14.2771 24.544C6.55077 24.544 1.5293 21.1496 0 14.95L34.0372 14.9717V24.544H14.2771Z"
                    fill="#EF8F60"
                  />
                  {/* Lower Curve */}
                  <path
                    d="M0 37.3064V27.7341H19.7601C27.4865 27.7341 32.5079 31.1286 34.0372 37.3282L0 37.3064Z"
                    fill="#EF8F60"
                  />
                  {/* Bottom Dot */}
                  <path
                    d="M17.0678 52.278C13.8237 52.278 11.1857 49.6185 11.1857 46.348C11.1857 43.0775 13.8798 40.5181 17.0678 40.5181C20.2559 40.5181 22.8507 43.1884 22.8507 46.348C22.8507 49.5076 20.2019 52.278 17.0678 52.278Z"
                    fill="#EF8F60"
                  />
                </svg>
              </motion.div>

              {/* 2. Unified Typography Row */}
              {/* Converges with gap-0 into the exact seamless word "joyzen" */}
              <div className="flex items-center justify-center gap-0 z-10">

                {/* .joy (starts top on mobile, full-left on desktop) */}
                <motion.div
                  initial={isMobile ? { x: 0, y: '-20vh' } : { x: '-36vw', y: 0 }}
                  animate={
                    phase === 'converged'
                      ? { x: 0, y: 0 }
                      : isMobile
                      ? { x: 0, y: '-20vh' }
                      : { x: '-36vw', y: 0 }
                  }
                  transition={{
                    duration: 1.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-center justify-end"
                >
                  <svg
                    viewBox="0 0 144 80"
                    className="h-9 sm:h-12 md:h-14 lg:h-16 w-auto overflow-visible translate-y-[26%] drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* 'o' */}
                    <path
                      d="M68.0127 0C53.0958 0 40.5942 10.4393 40.5942 29.0256C40.5942 47.612 53.0999 57.3566 68.1312 57.3566C83.1625 57.3566 95.4394 47.2606 95.4394 29.0256C95.4394 10.7906 82.8152 0 68.0168 0H68.0127ZM68.0127 45.5405C60.0965 45.5405 54.1298 39.9225 54.1298 28.9112C54.1298 17.8999 59.978 11.8203 68.0127 11.8203C76.0474 11.8203 81.8997 17.6671 81.8997 28.9112C81.8997 40.1554 76.0474 45.5405 68.0127 45.5405Z"
                      fill="#EF8F60"
                    />
                    {/* 'y' */}
                    <path
                      d="M131.261 1.14844L119.099 40.9524L106.822 1.14844H94.0874L112.674 56.2088L105.563 79.1507H118.412L125.413 56.2088L144 1.14844H131.265H131.261Z"
                      fill="#EF8F60"
                    />
                    {/* 'j' with dot */}
                    <path
                      d="M34.1903 1.14844V61.7165C34.1903 72.7074 28.7017 78.6523 20.5362 80.0006L20.5505 40.5745L20.5648 1.14844H34.1944H34.1903ZM8.14502 80.0006C12.5057 80.0006 16.1756 76.3315 16.1756 71.9719C16.1756 67.6124 12.5057 63.8289 8.14502 63.8289C3.78439 63.8289 0 67.498 0 71.9719C0 76.4459 3.66996 80.0006 8.14502 80.0006Z"
                      fill="#EF8F60"
                    />
                  </svg>
                </motion.div>

                {/* żen (starts bottom on mobile, full-right on desktop) */}
                <motion.div
                  initial={isMobile ? { x: 0, y: '20vh' } : { x: '36vw', y: 0 }}
                  animate={
                    phase === 'converged'
                      ? { x: 0, y: 0 }
                      : isMobile
                      ? { x: 0, y: '20vh' }
                      : { x: '36vw', y: 0 }
                  }
                  transition={{
                    duration: 1.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-center justify-start -ml-[1px]"
                >
                  <svg
                    viewBox="0 0 157 80"
                    className="h-9 sm:h-12 md:h-14 lg:h-16 w-auto overflow-visible drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* 'ż' with dot */}
                    <path
                      d="M44.3818 68.4016V78.8073H0V68.4016L26.1471 31.8092H1.08091L4.60137 21.4077H42.1003V31.8092L16.1881 68.4016H44.3775H44.3818ZM21.9516 16.8629C26.5103 16.8629 30.3469 13.038 30.3469 8.49323C30.3469 3.94846 26.5103 0 21.9516 0C17.393 0 13.4367 3.82494 13.4367 8.48898C13.4367 13.153 17.2734 16.8587 21.9516 16.8587V16.8629Z"
                      fill="#EF8F60"
                    />
                    {/* 'e' */}
                    <path
                      d="M99.7756 49.9845C99.7756 28.8195 88.6203 20.207 74.5898 20.207C59.1108 20.207 47.3574 30.6127 47.3574 49.6267C47.3574 70.076 60.4353 80.0004 75.7861 80.0004C85.5015 80.0004 92.8201 75.937 97.2592 68.3978L89.0989 60.3902C86.8174 65.5313 81.6649 67.6823 76.0253 67.6823C67.9889 67.6823 61.388 63.261 60.3114 53.8137H99.7713V49.9845H99.7756ZM60.5506 44.8476C61.9904 36.4737 67.7496 32.5295 74.7094 32.5295C81.6692 32.5295 87.0609 36.7164 87.6591 44.8476H60.5506Z"
                      fill="#EF8F60"
                    />
                    {/* 'n' */}
                    <path
                      d="M137.8 20.2113C127.725 20.2113 122.804 24.8796 119.326 32.6487H119.091V21.4082H105.052V78.8078H119.091V49.418C119.091 46.8453 119.446 44.2726 120.236 41.8235C122.44 34.9744 126.568 32.2867 132.408 32.2867C138.885 32.2867 142.965 35.396 142.965 43.7657V78.8078H157V40.0601C157 26.068 148.605 20.207 137.808 20.207L137.8 20.2113Z"
                      fill="#EF8F60"
                    />
                  </svg>
                </motion.div>
              </div>

            </motion.div>
          </div>

          {/* ======================================================== */}
          {/* FLOATING CURSOR FOLLOWER BADGE (Desktop only)            */}
          {/* ======================================================== */}
          {!isMobile && (
            <motion.div
              style={{ x: springX, y: springY }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{
                opacity: hoverSide ? 1 : 0,
                scale: hoverSide ? 1 : 0.7,
              }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="pointer-events-none fixed top-0 left-0 z-50 -translate-x-1/2 -translate-y-1/2 hidden md:block"
            >
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/45 backdrop-blur-2xl border border-white/30 text-white shadow-[0_12px_40px_rgba(0,0,0,0.6)] whitespace-nowrap">
                <span className="text-xs lg:text-sm font-medium tracking-wide">
                  {hoverSide === 'doctor' ? 'Go to doctor site' : 'Go to patient site'}
                </span>
                <span className="text-[#EF8F60] text-sm lg:text-base font-bold leading-none">
                  {hoverSide === 'doctor' ? '↗' : '→'}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
