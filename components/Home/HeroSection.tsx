'use client';

import React from 'react';
import Link from 'next/link';
import Reveal from '@/reuseable/Reveal';

import DnaSequence from './DnaSequence';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-end pt-16 sm:pt-24 pb-10 sm:pb-28 px-6 sm:px-12 lg:px-16 overflow-hidden">
      {/* 3D DNA Helix positioned on the right side */}
      <div className="absolute -top-20 lg:-top-[10%] -right-[60%] md:-right-[50%] lg:-left-[3%] w-[230%] md:w-[200%] lg:w-[100%] h-full pointer-events-none select-none z-0 flex items-center justify-end ">
        <div className="relative w-full">
          <DnaSequence />
        </div>
      </div>

      {/* Left Content Container */}
      <div className="relative z-10 w-full ">
        <div className="flex flex-col items-start justify-end">
          {/* Main Headline */}
          <Reveal delay={0.1}>
            <h1 className="text-[40px] sm:text-5xl md:text-[50px] font-bold tracking-tight text-black leading-none md:leading-[1.1]">
              Care The Way <br />
              Life Actually<br className='md:hidden'/> Happens
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay={0.25} className="mt-4 sm:mt-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 tracking-tight leading-none">
              Continuously. Personally. Refreshingly human.
            </h2>
          </Reveal>

          {/* Paragraph (Green Medical Copy) */}
          <Reveal delay={0.4} className="mt-4 sm:mt-4">
            <p className="text-base md:text-lg text-[#036132] tracking-tight font-normal leading-none md:leading-[1.2] md:max-w-3xl">
              <strong className="font-bold text-[#036132] uppercase">Joyzen</strong> brings together compassionate care, clinical expertise, and modern healthcare technology, creating a simpler, more connected experience for every stage of your health journey.
            </p>
          </Reveal>

          {/* Pill CTA Button */}
          <Reveal delay={0.55} className="mt-8 sm:mt-10">
            <Link
              href="#begin"
              className="inline-flex items-center justify-center px-5 sm:px-8 py-2.5 md:py-3 rounded-full text-xs sm:text-sm font-bold tracking-tight text-black uppercase bg-[#AEDEE44D] font-medium hover:bg-[#c6e8ee] backdrop-blur-md border border-[#FFFFFF03] transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
            >
              BEGIN YOUR JOURNEY
            </Link>
          </Reveal>
        </div>
      </div>
              <div className='h-20 w-full hidden lg:block -right-10 bg-[#f2f2f2] absolute bottom-0 z-100 blur-md'></div>
    </section>
  );
}
