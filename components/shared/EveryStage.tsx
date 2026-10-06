'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  PregnancyPrep,
  WomenHealth,
  TeenHealth,
  Cala,
  MenHealth,
  MaleFertility,
  FatherhoodPrep,
  NaturalConception,
  CoupleProgram,
} from '@/components/programs';

export interface EveryStageProps {
  /** Optional override for the currently active program ID */
  activeId?: string;
  className?: string;
}

interface ProgramConfig {
  id: string;
  name: string;
  title: string;
  href: string;
  image: string;
  glowColor: string;
  Component: React.ComponentType<{
    className?: string;
    interactive?: boolean;
    textureUrl?: string;
  }>;
}

const ALL_PROGRAMS: ProgramConfig[] = [
  {
    id: 'eve',
    name: 'EVE',
    title: 'Pregnancy Prep',
    href: '/eve',
    image: '/programs/Pregnancy-Prep.webp',
    glowColor: '#fb923c',
    Component: PregnancyPrep,
  },
  {
    id: 'lyra',
    name: 'LYRA',
    title: "Women's Health",
    href: '/lyra',
    image: '/programs/Women-Health.webp',
    glowColor: '#38bdf8',
    Component: WomenHealth,
  },
  {
    id: 'luna',
    name: 'LUNA',
    title: 'Teen Health',
    href: '/luna',
    image: '/programs/Teen-Health.webp',
    glowColor: '#e879f9',
    Component: TeenHealth,
  },
  {
    id: 'cala',
    name: 'CALA',
    title: 'PCOS & Hormones',
    href: '/cala',
    image: '/cala-orb.png',
    glowColor: '#38bdf8',
    Component: Cala,
  },
  {
    id: 'core',
    name: 'CORE',
    title: "Men's Health",
    href: '/core',
    image: '/programs/Men-Health.webp',
    glowColor: '#2dd4bf',
    Component: MenHealth,
  },
  {
    id: 'atlas',
    name: 'ATLAS',
    title: 'Male Fertility',
    href: '/atlas',
    image: '/programs/Male-Fertility.webp',
    glowColor: '#60a5fa',
    Component: MaleFertility,
  },
  {
    id: 'genesis',
    name: 'GENESIS',
    title: 'Fatherhood Prep',
    href: '/genesis',
    image: '/programs/Fatherhood-Prep.png',
    glowColor: '#818cf8',
    Component: FatherhoodPrep,
  },
  {
    id: 'vita',
    name: 'VITA',
    title: 'Natural Conception',
    href: '/vita',
    image: '/programs/Natural-Conception.webp',
    glowColor: '#fbbf24',
    Component: NaturalConception,
  },
  {
    id: 'eve-genesis',
    name: 'EVE + GENESIS',
    title: 'Couple Program',
    href: '/eve-genesis',
    image: '/programs/Couple-Program.png',
    glowColor: '#FFFFFF',
    Component: CoupleProgram,
  },
];

export default function EveryStage({ activeId, className = '' }: EveryStageProps) {
  const pathname = usePathname();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Helper to determine if a program is active based on current page
  const isProgramActive = (prog: ProgramConfig) => {
    if (activeId) {
      return prog.id === activeId || prog.href === activeId;
    }
    if (!pathname) return false;
    return pathname === prog.href || pathname.startsWith(prog.href + '/');
  };

  // Find active program index
  const activeIndex = ALL_PROGRAMS.findIndex((prog) => isProgramActive(prog));
  const initialIndex = activeIndex >= 0 ? activeIndex : 0;
  const [mobileIndex, setMobileIndex] = useState<number>(initialIndex);

  useEffect(() => {
    const idx = ALL_PROGRAMS.findIndex((prog) => isProgramActive(prog));
    if (idx >= 0) {
      setMobileIndex(idx);
    }
  }, [pathname, activeId]);

  // Touch swipe support for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      // Swiped left -> next
      setMobileIndex((prev) => (prev + 1) % ALL_PROGRAMS.length);
    } else if (diff < -45) {
      // Swiped right -> prev
      setMobileIndex((prev) => (prev - 1 + ALL_PROGRAMS.length) % ALL_PROGRAMS.length);
    }
    setTouchStartX(null);
  };

  const handlePrev = () => {
    setMobileIndex((prev) => (prev - 1 + ALL_PROGRAMS.length) % ALL_PROGRAMS.length);
  };

  const handleNext = () => {
    setMobileIndex((prev) => (prev + 1) % ALL_PROGRAMS.length);
  };

  // 3 programs for mobile view
  const prevProg = ALL_PROGRAMS[(mobileIndex - 1 + ALL_PROGRAMS.length) % ALL_PROGRAMS.length];
  const currProg = ALL_PROGRAMS[mobileIndex];
  const nextProg = ALL_PROGRAMS[(mobileIndex + 1) % ALL_PROGRAMS.length];

  return (
    <footer
      className={`w-full  pt-20 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 select-none overflow-hidden ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Header Section */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-[38px] lg:text-[42px] font-bold text-[#1E2822] tracking-tight leading-[1.2] max-w-3xl"
        >
          Every Stage Of <span className="text-[#E5855E]">Care</span> Has Its Own Journey.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-3.5 text-sm sm:text-base md:text-[17px] text-zinc-600 font-normal max-w-xl"
        >
          From prevention to parenthood — care that evolves with you.
        </motion.p>

        {/* MOBILE: Focused 3-Item View with Active 3D Model in Center */}
        <div
          className="block lg:hidden mt-12 w-full max-w-sm mx-auto px-1 select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative flex items-center justify-between gap-1 sm:gap-2">
            {/* Prev Chevron Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Program"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 border border-zinc-200/80 shadow-sm flex items-center justify-center text-zinc-600 hover:text-zinc-900 active:scale-90 transition-all shrink-0 z-20 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* 3-Item Flex Row */}
            <div className="flex-1 flex items-center justify-center gap-3 sm:gap-5 py-3">
              {/* Previous Item (Left) */}
              <Link
                href={prevProg.href}
                scroll={true}
                onClick={() => window.scrollTo(0, 0)}
                className="flex flex-col items-center opacity-85 active:scale-95 transition-all text-center max-w-[76px]"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 relative rounded-full overflow-hidden shadow-sm border border-white/80 shrink-0">
                  <Image
                    src={prevProg.image}
                    alt={prevProg.title}
                    width={96}
                    height={96}
                    priority={false}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                </div>
                <span className="mt-2 text-[10px] sm:text-[11px] font-medium text-zinc-600 line-clamp-1 leading-tight">
                  {prevProg.title}
                </span>
              </Link>

              {/* Active Item (Center - 3D Model) */}
              <Link
                href={currProg.href}
                scroll={true}
                onClick={() => window.scrollTo(0, 0)}
                className="flex flex-col items-center transition-all text-center z-10 max-w-[110px]"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0">
                  {/* Active Outer Luminous Glow & Ring */}
                  <div
                    className="absolute -inset-2.5 rounded-full pointer-events-none blur-md opacity-70 animate-pulse"
                    // style={{
                    //   background: `radial-gradient(circle, ${currProg.glowColor}50 0%, ${currProg.glowColor}15 70%, transparent 100%)`,
                    // }}
                  />
                  <div className="absolute -inset-1 rounded-full pointer-events-none border-2 border-white/90 shadow-[0_0_20px_rgba(255,255,255,0.7)]" />

                  {/* Active Image */}
                  <div className="w-full h-full relative z-10 flex items-center justify-center rounded-full overflow-hidden">
                    <Image
                      src={currProg.image}
                      alt={currProg.title}
                      width={144}
                      height={144}
                      priority={true}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  </div>

                  {/* Active Brand Name Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none">
                    <span className="font-extrabold text-white text-xs sm:text-sm tracking-wider drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)] uppercase">
                      {currProg.name}
                    </span>
                  </div>
                </div>

                <span className="mt-2.5 text-xs sm:text-[13px] font-bold text-[#1E2822] line-clamp-1 leading-tight">
                  {currProg.title}
                </span>
              </Link>

              {/* Next Item (Right) */}
              <Link
                href={nextProg.href}
                scroll={true}
                onClick={() => window.scrollTo(0, 0)}
                className="flex flex-col items-center opacity-85 active:scale-95 transition-all text-center max-w-[76px]"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 relative rounded-full overflow-hidden shadow-sm border border-white/80 shrink-0">
                  <Image
                    src={nextProg.image}
                    alt={nextProg.title}
                    width={96}
                    height={96}
                    priority={false}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                </div>
                <span className="mt-2 text-[10px] sm:text-[11px] font-medium text-zinc-600 line-clamp-1 leading-tight">
                  {nextProg.title}
                </span>
              </Link>
            </div>

            {/* Next Chevron Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Program"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 border border-zinc-200/80 shadow-sm flex items-center justify-center text-zinc-600 hover:text-zinc-900 active:scale-90 transition-all shrink-0 z-20 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 9 Stage Dots Pagination */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {ALL_PROGRAMS.map((prog, i) => {
              const isCurrent = i === mobileIndex;
              return (
                <button
                  key={`dot-${prog.id}`}
                  type="button"
                  onClick={() => setMobileIndex(i)}
                  aria-label={`Go to stage ${prog.name}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isCurrent
                      ? 'w-5 h-1.5 bg-[#E5855E]'
                      : 'w-1.5 h-1.5 bg-zinc-300 hover:bg-zinc-400'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* DESKTOP: 9 3D Planets Navigation Row */}
        <div className="hidden lg:block mt-14 sm:mt-20 w-full overflow-x-auto no-scrollbar scroll-smooth py-6">
          <div className="flex items-center justify-between min-w-0 mx-auto px-4 gap-3">
            {ALL_PROGRAMS.map((prog) => {
              const active = isProgramActive(prog);
              const isHovered = hoveredId === prog.id;
              const { Component } = prog;

              return (
                <Link
                  key={prog.id}
                  href={prog.href}
                  scroll={true}
                  onClick={() => window.scrollTo(0, 0)}
                  onMouseEnter={() => setHoveredId(prog.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative flex flex-col items-center focus:outline-none transition-transform duration-300"
                >
                  {/* Planet Sphere Wrapper */}
                  <div
                    className={`relative flex items-center justify-center transition-all duration-500 ease-out ${
                      active
                        ? 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32'
                        : 'w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] group-hover:scale-115'
                    }`}
                  >
                    {/* Active Outer White Luminous Ring & Ambient Halo */}
                    {active && (
                      <>
                        <div
                          className="absolute -inset-2.5 sm:-inset-3.5 rounded-full pointer-events-none blur-md opacity-70 animate-pulse"
                          // style={{
                          //   background: `radial-gradient(circle, ${prog.glowColor}50 0%, ${prog.glowColor}15 70%, transparent 100%)`,
                          // }}
                        />
                        <div
                          className="absolute -inset-1.5 sm:-inset-2 rounded-full pointer-events-none border border-white/90 shadow-[0_0_20px_rgba(255,255,255,0.7)]"
                        />
                      </>
                    )}

                    {/* Non-active subtle hover aura */}
                    {!active && (
                      <div
                        className="absolute -inset-2 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                        style={{
                          background: `radial-gradient(circle, ${prog.glowColor}40 0%, transparent 70%)`,
                        }}
                      />
                    )}

                    {/* Planet Graphic: Active renders 3D WebGL model, non-active renders 3D image */}
                    {active ? (
                      <div className="w-full h-full relative z-10 flex items-center justify-center rounded-full overflow-hidden">
                        <Component interactive={false} className="w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-full h-full relative z-10 flex items-center justify-center overflow-hidden rounded-full">
                        <Image
                          src={prog.image}
                          alt={prog.title}
                          width={144}
                          height={144}
                          priority={false}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none pointer-events-none"
                        />
                      </div>
                    )}

                    {/* Active State: Center Brand Name Overlay */}
                    {active && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none">
                        <span className="font-extrabold text-white text-xs sm:text-sm md:text-base tracking-wider drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)] uppercase">
                          {prog.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Subtitle / Program Label */}
                  <span
                    className={`mt-3 sm:mt-4 text-[11px] sm:text-xs md:text-[13px] text-center font-medium transition-colors duration-200 line-clamp-1 max-w-[95px] sm:max-w-[110px] ${
                      active
                        ? 'text-[#1E2822] font-semibold'
                        : 'text-zinc-600 group-hover:text-[#1E2822]'
                    }`}
                  >
                    {prog.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Tagline & Powered by Joyzen */}
        <div className="mt-16 sm:mt-24 pt-8 w-full flex items-end justify-center text-center">
          <p className="text-base sm:text-lg md:text-2xl font-medium text-black tracking-tight flex items-center gap-1.5 sm:gap-2">
            <span>Powered by</span>
            <Image src="/joyzen-logo.png" alt="Joyzen" width={140} height={44} className="h-[34px] md:h-[44px] w-auto object-contain ml-1" />
          </p>
        </div>
      </div>
    </footer>
  );
}
