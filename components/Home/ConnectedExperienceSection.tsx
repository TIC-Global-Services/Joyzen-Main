'use client';

import React from 'react';
import Image from 'next/image';
import Reveal from '@/reuseable/Reveal';

export default function ConnectedExperienceSection() {
  return (
    <section className="relative w-full py-16 sm:py-24 px-[5%] text-center overflow-hidden">
      <div className="flex flex-col items-center">
        <Reveal delay={0.1}>
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight">
            {/* One Connected */}
            <span className="text-[#036132]">One Connected</span>

            {/* Pill Capsule with /one-connected.gif */}
            <span className="inline-flex items-center justify-center relative w-24 sm:w-36 md:w-44 h-9 sm:h-13 md:h-16 rounded-full overflow-hidden align-middle my-auto">
              <Image
                src="/one-connected.gif"
                alt="Joyzen One Connected"
                fill
                className="object-cover"
                unoptimized
              />
            </span>

            {/* Experience */}
            <span className="text-[#EF8F60]">Experience</span>
          </div>
        </Reveal>

        <Reveal delay={0.25} className="mt-4 sm:mt-5">
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold tracking-tight text-[#AEDEE4]">
            for Your Complete Health
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
