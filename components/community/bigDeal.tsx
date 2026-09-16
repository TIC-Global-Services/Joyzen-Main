'use client';

import React from 'react';
import Reveal from '@/reuseable/Reveal';
import AnimatedJoyzenLogo from '@/reuseable/AnimatedJoyzenLogo';

export default function BigDeal() {
  return (
    <section className="relative w-full py-16 sm:py-24 px-4 sm:px-8 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Centered Top Glyph Icon */}
        <div className="relative w-20 h-28 sm:w-36 sm:h-58 mb-6 flex items-center justify-center">
          <AnimatedJoyzenLogo width="100%" height="100%" className="w-full h-full object-contain" amount={0.3} once={false} />
        </div>

        {/* Heading */}
        <Reveal delay={0.25}>
          <h2 className="text-[40px] sm:text-4xl lg:text-6xl font-bold tracking-tight leading-none text-[#036132]">
            Be a big deal to <br className='sm:hidden'/> the people <br className='hidden md:block'/> Who Matters You.
          </h2>
        </Reveal>

        {/* Subtitle / Description */}
        <Reveal delay={0.4} className="mt-4 sm:mt-4">
          <p className="text-lg lg:text-[22px] text-black leading-[1.2]">
            Let us bring you the care you deserve, because we’re obsessed with our humans<br className='hidden lg:block'/> and only mildly impressed by AI.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
