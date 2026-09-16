'use client';

import React from 'react';
import Reveal from '@/reuseable/Reveal';
import AnimatedJoyzenLogo from '@/reuseable/AnimatedJoyzenLogo';

export default function StartYourHealth() {
  return (
    <section className="relative w-full py-16 sm:py-24 px-4 sm:px-8 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Centered Top Glyph Icon */}
        <div className="relative w-10 h-14 sm:w-36 sm:h-58 mb-6 flex items-center justify-center">
          <AnimatedJoyzenLogo width="100%" height="100%" className="w-full h-full object-contain" amount={0.3} once={false} />
        </div>

        {/* Heading */}
        <Reveal delay={0.25}>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-[#036132]">
            Start your healthcare journey with
            <br className='hidden lg:block' /> India's trusted specialists.
          </h2>
        </Reveal>

        {/* Subtitle / Description */}
        <Reveal delay={0.4} className="mt-4 sm:mt-6">
          <p className="text-base lg:text-[22px] text-black leading-[1.2]">
            Book an online consultation and receive expert guidance from wherever you are.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
