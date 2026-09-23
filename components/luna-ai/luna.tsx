'use client';

import React from 'react';
import Image from 'next/image';
import WhoLuna from './whoLuna';
import WhatInclude from './whatInclude';
import InsideLuna from './insideLuna';
import WhylunaDifferent from './whylunaDifferent';

export default function LunaAI() {
  return (
    <div className="w-full relative z-10 flex flex-col items-center justify-center space-y-16 md:space-y-24 py-20 overflow-hidden">
      
      {/* ------------------------------------------------------------- */}
      {/* Hero Section (Image 1) */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full  px-[5%] flex flex-col items-center space-y-12 select-none">
        
        {/* Header: Orb Logo & Title */}
        <div className="flex flex-col items-center justify-center text-center space-y-4 pt-10">
          <div className="relative w-32 h-32 sm:w-60 sm:h-60 drop-shadow-[0_12px_24px_rgba(150,100,220,0.25)] hover:scale-105 transition-transform duration-300">
            <Image
              src="/luna_ai.png"
              alt="LUNA AI Orb Logo"
              fill
              className="object-cover"
              priority
            />
          </div>

          <h1 className="text-4xl sm:text-[40px] font-bold tracking-tight text-zinc-900">
            Luna
          </h1>
        </div>

        {/* Hero Cards: Side-by-Side on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full">
          
          {/* Card 1 */}
          <div className="w-full h-full bg-white/40 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.04)] rounded-[2.5rem] border-[3px] border-white/60 p-8 sm:p-12 flex items-center justify-center text-center py-10">
            <h2 className="text-base lg:text-2xl font-bold text-black leading-[1.2] tracking-tight ">
              A safe, modern health program for teen girls to<br className="hidden sm:block" /> understand their body, manage early cycle<br className="hidden sm:block" /> concerns, and build healthy habits with real medical<br className="hidden sm:block" /> guidance. For teen girls who need clarity,
              <br className="hidden sm:block" />
              <br className="hidden sm:block" />
              <span className="block font-bold">confidence, and support, before problems grow.</span>
            </h2>
          </div>

          {/* Card 2 */}
          <div className="w-full h-full bg-white/40 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.04)] rounded-[2.5rem] border-[3px] border-white/60 p-8 sm:p-20 flex flex-col items-center justify-center text-center space-y-4">
            <p className="text-base lg:text-2xl font-bold text-[#036132] leading-[1.2]">
              For many girls, periods, body changes, mood shifts, skin issues, and early cycle discomfort begin long before they<br className="hidden sm:block" /> know who to ask.
            </p>
            <p className="text-base lg:text-2xl font-bold text-[#036132] leading-[1.2]">
              LUNA is built to give teen girls a trusted space to learn, ask questions, and receive guided support from a real<br className="hidden sm:block" /> care team. This is not a rushed visit.
            </p>
            <p className="text-base lg:text-2xl font-bold text-[#036132] leading-[1.2]">
              This is ongoing guidance designed for early health.
            </p>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Child Sections */}
      {/* ------------------------------------------------------------- */}
      <WhoLuna />
      <WhatInclude />
      <InsideLuna />
      <WhylunaDifferent />

    </div>
  );
}