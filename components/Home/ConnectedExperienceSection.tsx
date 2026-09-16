'use client';

import React from 'react';
import Image from 'next/image';
import Reveal from '@/reuseable/Reveal';

export default function ConnectedExperienceSection() {
  return (
    <section className="relative w-full py-12 sm:py-20 md:py-24 px-4 sm:px-6 text-center overflow-hidden">
      <div className="flex flex-col items-center">
        <Reveal delay={0.1}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-3 text-[32px] sm:text-4xl md:text-4xl lg:text-6xl font-bold tracking-tight">
            {/* Experience - 1st on mobile, 3rd on desktop */}
            <span className="order-1 md:order-3 text-[#EF8F60]">Experience</span>

            {/* Pill Capsule - 2nd on mobile & desktop */}
            <span className="order-2 md:order-2 inline-flex items-center justify-center relative w-60 sm:w-36 md:w-44 h-12 sm:h-13 md:h-16 rounded-full overflow-hidden align-middle my-1 md:my-auto">
              <Image
                src="/one-connected.gif"
                alt="Joyzen One Connected"
                fill
                className="object-cover"
                unoptimized
              />
            </span>

            {/* One Connected - 3rd on mobile, 1st on desktop */}
            <span className="order-3 md:order-1 text-[#036132]">One Connected</span>
          </div>
        </Reveal>

        <Reveal delay={0.25} className="mt-3 lg:mt-5">
          <h2 className="text-[32px] sm:text-4xl md:text-4xl lg:text-6xl font-bold tracking-tight text-[#AEDEE4] leading-tight max-w-[280px] sm:max-w-none">
            for Your Complete Health
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
