'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
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
  // Animation phases:
  // 'initial'   -> .joy on left, żen on right, logo at center divider (Image 1)
  // 'converged' -> .joy & żen meet in center (joyzen), logo lifts top, specular buttons appear (Image 2)
  const [phase, setPhase] = useState<'initial' | 'converged'>('initial');
  const [hoverSide, setHoverSide] = useState<'doctor' | 'patient' | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking with smooth spring physics for the cursor-following badge
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const springX = useSpring(mouseX, { stiffness: 450, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 30 });

  // Lock scroll while choice hero is active
  useEffect(() => {
    if (isExiting) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
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

    setIsExiting(true);
    setTimeout(() => {
      onSelectPatient?.();
    }, 550);
  }, [isStandalonePage, onSelectPatient]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="fixed inset-0 z-[99999] w-full h-full bg-black select-none overflow-hidden flex flex-row"
        >
          {/* ======================================================== */}
          {/* LEFT HALF: DOCTOR SECTION                                */}
          {/* ======================================================== */}
          <div
            onClick={handleDoctorClick}
            onPointerEnter={() => setHoverSide('doctor')}
            className="relative w-1/2 h-full overflow-hidden cursor-pointer group"
          >
            {/* Background Image */}
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
              <Image
                src="/doctor_thumbnail.png"
                alt="Joyzen for Doctors"
                fill
                priority
                sizes="50vw"
                className="object-cover object-center"
              />
            </div>

            {/* Gradient Overlays for High Contrast & Legibility */}
            {/* <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" /> */}

            {/* Left Glassmorphism Action Button: "For Doctors" (Image 2) */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={
                phase === 'converged'
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 30, scale: 0.95 }
              }
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 -translate-x-1/2 bottom-8 sm:bottom-12 md:bottom-24 z-30"
              onClick={(e) => {
                e.stopPropagation();
                handleDoctorClick();
              }}
            >
              <SpecularButton
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
                className="backdrop-blur-xl border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.5)] font-medium text-base tracking-wide px-6 sm:px-8 py-3 sm:py-3.5 hover:scale-105 transition-transform duration-200 whitespace-nowrap"
              >
                For Doctors
              </SpecularButton>
            </motion.div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT HALF: PATIENT SECTION                               */}
          {/* ======================================================== */}
          <div
            onClick={handlePatientClick}
            onPointerEnter={() => setHoverSide('patient')}
            className="relative w-1/2 h-full overflow-hidden cursor-pointer group"
          >
            {/* Background Image */}
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
              <Image
                src="/patient_thumbnail.png"
                alt="Joyzen for Patients"
                fill
                priority
                sizes="50vw"
                className="object-cover object-center"
              />
            </div>

            {/* Gradient Overlays */}
            {/* <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" /> */}

            {/* Right Glassmorphism Action Button: "For Patients" (Image 2) */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={
                phase === 'converged'
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 30, scale: 0.95 }
              }
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 -translate-x-1/2 bottom-8 sm:bottom-12 md:bottom-24 z-30"
              onClick={(e) => {
                e.stopPropagation();
                handlePatientClick();
              }}
            >
              <SpecularButton
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
                className="backdrop-blur-xl border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.5)] font-medium text-base tracking-wide px-6 sm:px-8 py-3 sm:py-3.5 hover:scale-105 transition-transform duration-200 whitespace-nowrap"
              >
                For Patients
              </SpecularButton>
            </motion.div>
          </div>

          {/* ======================================================== */}
          {/* CENTER DIVIDER LINE                                      */}
          {/* ======================================================== */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 bg-white/20 pointer-events-none z-20" />

          {/* ======================================================== */}
          {/* ANIMATING LOGO & TYPOGRAPHY OVERLAY                      */}
          {/* Starts separated (Image 1), then converges to joyzen     */}
          {/* ======================================================== */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
            <motion.div
              animate={
                phase === 'converged'
                  ? { y: -48 }
                  : { y: 0 }
              }
              transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col items-center justify-center"
            >

              {/* 1. Center Joyzen Icon Mark */}
              {/* In Initial state: translated down to sit on divider between .joy and żen */}
              {/* In Converged state: lifts upward to y: 0, directly on top of joined joyzen */}
              <motion.div
                initial={{ y: 56, scale: 1 }}
                animate={
                  phase === 'converged'
                    ? { y: 0, scale: 1.05 }
                    : { y: 56, scale: 1 }
                }
                transition={{
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mb-3 sm:mb-4 md:mb-5 z-20"
              >
                <svg
                  viewBox="0 0 35 54"
                  className="w-7 h-11 sm:w-8 sm:h-12 md:w-9 md:h-14 overflow-visible drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
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

                {/* Left Typography: .joy */}
                {/* Initial: positioned full left (-36vw) */}
                {/* Converged: glides seamlessly into x: 0 to join zen */}
                <motion.div
                  initial={{ x: '-36vw' }}
                  animate={
                    phase === 'converged'
                      ? { x: 0 }
                      : { x: '-36vw' }
                  }
                  transition={{
                    duration: 1.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-center justify-end"
                >
                  <svg
                    viewBox="0 0 144 80"
                    className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto overflow-visible translate-y-[26%]"
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

                {/* Right Typography: żen */}
                {/* Initial: positioned full right (+36vw) */}
                {/* Converged: glides seamlessly into x: 0 flush next to .joy */}
                <motion.div
                  initial={{ x: '36vw' }}
                  animate={
                    phase === 'converged'
                      ? { x: 0 }
                      : { x: '36vw' }
                  }
                  transition={{
                    duration: 1.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-center justify-start -ml-[1px]"
                >
                  <svg
                    viewBox="0 0 157 80"
                    className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto overflow-visible"
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
          {/* FLOATING CURSOR FOLLOWER BADGE                           */}
          {/* Follows mouse with spring physics, displays side intent  */}
          {/* ======================================================== */}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
