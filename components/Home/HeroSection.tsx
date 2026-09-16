'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/reuseable/Reveal';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-screen flex items-end pt-16 sm:pt-24 pb-20 sm:pb-28 px-6 sm:px-12 lg:px-16 overflow-hidden">
      {/* Massive 3D DNA Helix spanning across top-center to bottom-right */}
      <div className="absolute -top-16 md:top-50 lg:-top-58 -right-16 md:right-0 lg:-right-8 lg:-right-30 w-full pointer-events-none select-none z-0">
        <Image
          src="/dna.png"
          alt="Joyzen DNA Helix"
          width={1300}
          height={860}
          priority
          className="w-full h-auto object-contain opacity-95"
        />
      </div>

      {/* Left Content Container */}
      <div className="relative z-10 w-full ">
        <div className="flex flex-col items-start justify-end">
          {/* Main Headline */}
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-[50px] font-bold tracking-tight text-zinc-900 leading-[1.1]">
              Care The Way <br />
              Life Actually Happens
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay={0.25} className="mt-4 sm:mt-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">
              Continuously. Personally. Refreshingly human.
            </h2>
          </Reveal>

          {/* Paragraph (Green Medical Copy) */}
          <Reveal delay={0.4} className="mt-4 sm:mt-4">
            <p className="text-sm sm:text-base md:text-lg text-[#036132] font-medium leading-[1.2] max-w-3xl">
              <strong className="font-bold text-[#036132]">Joyzen</strong> brings together compassionate care, clinical expertise, and modern healthcare technology, creating a simpler, more connected experience for every stage of your health journey.
            </p>
          </Reveal>

          {/* Pill CTA Button */}
          <Reveal delay={0.55} className="mt-8 sm:mt-10">
            <Link
              href="#begin"
              className="inline-flex items-center justify-center px-7 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold tracking-tight text-zinc-800 uppercase bg-[#AEDEE44D] font-medium hover:bg-[#c6e8ee] backdrop-blur-md border border-[#FFFFFF03] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              BEGIN YOUR JOURNEY
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
