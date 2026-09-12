'use client';

import React from 'react';
import Reveal from '@/reuseable/Reveal';

export default function ConnectedExperienceSection() {
  return (
    <section className="relative w-full py-16 sm:py-24 px-4 sm:px-8 text-center overflow-hidden">
      <div className="flex flex-col items-center">
        <Reveal delay={0.1}>
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {/* One Connected */}
            <span className="text-[#036132]">One Connected</span>

            {/* Pill Capsule with Joyzen badge */}
            <span className="inline-flex items-center justify-center px-4 sm:px-6 py-1 sm:py-1.5 rounded-full bg-[#598C87] text-white text-base sm:text-2xl font-semibold shadow-inner">
              joyzen
            </span>

            {/* Experience */}
            <span className="text-[#EF8F60]">Experience</span>
          </div>
        </Reveal>

        <Reveal delay={0.25} className="mt-4 sm:mt-5">
          <h2 className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-[#AEDEE4]">
            for Your Complete Health
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
