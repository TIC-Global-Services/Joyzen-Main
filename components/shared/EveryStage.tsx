'use client';

import React, { useState } from 'react';
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
    image: '/programs/Pregnancy-Prep.png',
    glowColor: '#fb923c',
    Component: PregnancyPrep,
  },
  {
    id: 'lyra',
    name: 'LYRA',
    title: "Women's Health",
    href: '/lyra',
    image: '/programs/Women-Health.png',
    glowColor: '#38bdf8',
    Component: WomenHealth,
  },
  {
    id: 'luna',
    name: 'LUNA',
    title: 'Teen Health',
    href: '/luna',
    image: '/programs/Teen-Health.png',
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
    image: '/programs/Men-Health.png',
    glowColor: '#2dd4bf',
    Component: MenHealth,
  },
  {
    id: 'atlas',
    name: 'ATLAS',
    title: 'Male Fertility',
    href: '/atlas',
    image: '/programs/Male-Fertility.png',
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
    image: '/programs/Natural-Conception.png',
    glowColor: '#fbbf24',
    Component: NaturalConception,
  },
  {
    id: 'eve-genesis',
    name: 'EVE + GENESIS',
    title: 'Couple Program',
    href: '/eve-genesis',
    image: '/programs/Couple-Program.png',
    glowColor: '#ec4899',
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

  return (
    <footer
      className={`w-full bg-[#FAF8F5] border-t border-[#EAE6DE]/60 pt-20 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 select-none overflow-hidden ${className}`}
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

        {/* 9 3D Planets Navigation Row */}
        <div className="mt-14 sm:mt-20 w-full overflow-x-auto no-scrollbar scroll-smooth py-6">
          <div className="flex items-center justify-start lg:justify-between min-w-max lg:min-w-0 mx-auto px-4 gap-4 sm:gap-6 lg:gap-3">
            {ALL_PROGRAMS.map((prog) => {
              const active = isProgramActive(prog);
              const isHovered = hoveredId === prog.id;
              const { Component } = prog;

              return (
                <Link
                  key={prog.id}
                  href={prog.href}
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
                          style={{
                            background: `radial-gradient(circle, ${prog.glowColor}50 0%, ${prog.glowColor}15 70%, transparent 100%)`,
                          }}
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
        <div className="mt-16 sm:mt-24 pt-8 w-full flex items-center justify-center text-center">
          <p className="text-base sm:text-lg md:text-xl font-medium text-[#1E2822] flex items-center gap-1.5 sm:gap-2">
            <span>Powered by</span>
            <span className="font-bold text-[#E5855E] tracking-tight">Joyzen</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
