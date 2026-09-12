'use client';

import React from 'react';
import Image from 'next/image';
import Reveal from '@/reuseable/Reveal';

export default function BigDeal() {
  return (
    <section className="relative w-full py-16 sm:py-24 px-4 sm:px-8 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Centered Top Glyph Icon */}
        <Reveal delay={0.1}>
          <div className="relative w-10 h-14 sm:w-26 sm:h-38 mb-6 flex items-center justify-center">
            <Image
              src="/joyzen-lite-blue.png"
              alt="Joyzen Symbol"
              width={48}
              height={64}
              className="w-auto h-full object-contain"
            />
          </div>
        </Reveal>

        {/* Heading */}
        <Reveal delay={0.25}>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-[#036132]">
            Be a big deal to the people <br/> Who Matters You.
          </h2>
        </Reveal>

        {/* Subtitle / Description */}
        <Reveal delay={0.4} className="mt-4 sm:mt-4">
          <p className="text-sm sm:text-base lg:text-[22px] text-black leading-[1.2]">
            Let us bring you the care you deserve, because we’re obsessed with our humans<br/> and only mildly impressed by AI.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
