'use client';

import React from 'react';
import Image from 'next/image';

export default function LunaAI() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10 select-none">
      {/* ------------------------------------------------------------- */}
      {/* Header: Orb Logo, Title & Tag */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 pt-10">
        {/* LUNA Sphere / Orb Logo */}
        <div className="relative w-28 h-28 sm:w-[50dvh] sm:h-[36dvh] drop-shadow-[0_12px_24px_rgba(150,100,220,0.25)] hover:scale-105 transition-transform duration-300">
          <Image
            src="/luna_ai.png"
            alt="LUNA AI Orb Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-[40px] font-bold tracking-tight text-zinc-900">
          Luna
        </h1>

        {/* Pill Tag */}
        <span className="px-10 py-2 rounded-full bg-white/5 backdrop-blur-xs border border-white/80 shadow-xs text-sm font-medium tracking-tight text-zinc-500 uppercase">
          START
        </span>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Card 1: Hero Overview */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full bg-white/5 backdrop-blur-xs shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] rounded-[2.5rem] border-[5px] border-[#FFFFFF03] p-8 sm:p-14 text-center space-y-8">
        <h2 className="text-xl sm:text-2xl lg:text-[24px] font-bold text-black leading-[1.3] max-w-4xl mx-auto tracking-tight">
          A safe, modern health program for teen girls to understand their body, manage early cycle concerns, and build healthy habits with real medical guidance. For teen girls who need clarity,
          <br className="hidden sm:block" />
          <span className="block mt-2 font-bold">confidence, and support, before problems grow.</span>
        </h2>

        <div className="max-w-3xl mx-auto space-y-3 text-sm sm:text-lg font-normal text-[#036132] leading-[1.2]">
          <p>
            For many girls, periods, body changes, mood shifts, skin issues, and early cycle discomfort begin long before they know who to ask.
          </p>
          <p>
            LUNA is built to give teen girls a trusted space to learn, ask questions, and receive guided support from a real care team.
          </p>
          <p className="font-normal pt-1">
            This is not a rushed visit.
            <br />
            This is ongoing guidance designed for early health.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Card 2: Who LUNA is for */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full bg-white/5 backdrop-blur-xs shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] rounded-[2.5rem] border-[5px] border-[#FFFFFF03] p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-2xl font-bold text-zinc-900 mb-8 sm:mb-10">
          Who LUNA is for
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Vertical Divider (Desktop) */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-black" />

          {/* Item 1 */}
          <div className="flex flex-col items-center justify-center p-4 space-y-3 pb-8 md:pb-6 border-b md:border-b-0 border-zinc-200/60">
            <div className="w-10 h-10 relative flex items-center justify-center">
              <Image src="/teen-girl.png" alt="Teen girls starting their cycle" fill className="object-contain" />
            </div>
            <p className="text-sm sm:text-sm font-medium text-zinc-600">
              Teen girls starting their cycle
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center justify-center p-4 space-y-3 pb-8 md:pb-6 border-b md:border-b-0 border-zinc-200/60">
            <div className="w-10 h-10 relative flex items-center justify-center">
              <Image src="/first-period.png" alt="First period & early puberty stages" fill className="object-contain" />
            </div>
            <p className="text-sm sm:text-sm font-medium text-zinc-600">
              First period &amp; early puberty stages
            </p>
          </div>

          {/* Horizontal Divider Line across both columns (Desktop) */}
          <div className="hidden md:block col-span-2 w-full h-[1px] bg-black -my-2" />

          {/* Item 3 */}
          <div className="flex flex-col items-center justify-center p-4 space-y-3 pt-4 md:pt-6 border-b md:border-b-0 border-zinc-200/60">
            <div className="w-10 h-10 relative flex items-center justify-center">
              <Image src="/indicator.png" alt="Girls with questions" fill className="object-contain" />
            </div>
            <p className="text-sm sm:text-sm font-medium text-zinc-600">
              Girls with questions but no safe space
            </p>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col items-center justify-center p-4 space-y-3 pt-4 md:pt-6">
            <div className="w-10 h-10 relative flex items-center justify-center">
              <Image src="/indicator.png" alt="Parents seeking guided support" fill className="object-contain" />
            </div>
            <p className="text-sm sm:text-base font-medium text-zinc-600">
              Parents seeking guided, trusted support
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Card 3: Inside LUNA Membership */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full bg-white/5 backdrop-blur-xs shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] rounded-[2.5rem] border-[5px] border-[#FFFFFF03] p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-2xl font-bold text-black tracking-tight mb-8 sm:mb-10">
          Inside LUNA Membership
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Column 1 */}
          <div className="flex flex-col items-center justify-start space-y-4 p-4 border-b md:border-b-0 md:border-r border-zinc-200/60">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-sm">
              <Image src="/understandin-body.png" alt="Understanding the body" fill className="object-cover" />
            </div>
            <p className="text-sm sm:text-base font-medium text-zinc-600">
              Understanding the body
            </p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center justify-start space-y-4 p-4 border-b md:border-b-0 md:border-r border-zinc-200/60">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-sm">
              <Image src="/everyday-concern.png" alt="Everyday Concerns" fill className="object-cover" />
            </div>
            <p className="text-sm sm:text-base font-medium text-zinc-600">
              Everyday Concerns
            </p>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-center justify-start space-y-4 p-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-sm">
              <Image src="/bulding-confidence.png" alt="Building Confidence" fill className="object-cover" />
            </div>
            <p className="text-sm sm:text-base font-medium text-zinc-600">
              Building Confidence
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Card 4: What's Inside LUNA */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full bg-white/5 backdrop-blur-xs shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] rounded-[2.5rem] border-[5px] border-[#FFFFFF03] p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-2xl font-bold text-black mb-8 sm:mb-10">
          What’s Inside LUNA
        </h2>

        <div className="space-y-8">
          {/* Top 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {/* Vertical Divider (Desktop) */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#6F7275]" />

            {/* Item 1 */}
            <div className="flex flex-col items-center space-y-3 p-4 border-b md:border-b-0 border-zinc-200/60">
              <div className="relative w-full max-w-[280px] aspect-[16/10] rounded-2xl overflow-hidden shadow-sm">
                <Image src="/doctor-guided.png" alt="Doctor-guided cycle & puberty support" fill className="object-cover" />
              </div>
              <p className="text-sm sm:text-base font-medium text-[#686873] pt-1">
                Doctor-guided cycle &amp; puberty support
              </p>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col items-center space-y-3 p-4 border-b md:border-b-0 border-zinc-200/60">
              <div className="relative w-full max-w-[280px] aspect-[16/10] rounded-2xl overflow-hidden shadow-sm">
                <Image src="/daily-chat.png" alt="Daily chat access for questions" fill className="object-cover" />
              </div>
              <p className="text-sm sm:text-base font-medium text-[#686873] pt-1">
                Daily chat access for questions
              </p>
            </div>

            {/* Horizontal Line Divider (Desktop) */}
            <div className="hidden md:block col-span-2 w-full h-[1px] bg-[#6F7275] " />

            {/* Item 3 */}
            <div className="flex flex-col items-center space-y-3 p-4 border-b md:border-b-0 border-zinc-200/60">
              <div className="relative w-full max-w-[280px] aspect-[16/10] rounded-2xl overflow-hidden shadow-sm">
                <Image src="/monthly-conceltancy.png" alt="3 monthly consultations" fill className="object-cover" />
              </div>
              <p className="text-sm sm:text-base font-medium text-[#686873] pt-1">
                3 monthly consultations (chat / call / VC)
              </p>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col items-center space-y-3 p-4">
              <div className="relative w-full max-w-[280px] aspect-[16/10] rounded-2xl overflow-hidden shadow-sm">
                <Image src="/cycle-tracking.png" alt="Cycle tracking & weekly health tips" fill className="object-cover" />
              </div>
              <p className="text-sm sm:text-base font-medium text-[#686873] pt-1">
                Cycle tracking &amp; weekly health tips
              </p>
            </div>
          </div>

          {/* Horizontal Line Above 5th Centered Item */}
          <div className="w-full h-[1px] bg-[#6F7275]" />

          {/* Item 5 (Centered at Bottom) */}
          <div className="flex flex-col items-center space-y-3 p-4 pt-2">
            <div className="relative w-full max-w-[280px] aspect-[16/10] rounded-2xl overflow-hidden shadow-sm">
              <Image src="/step-by-step.png" alt="Gentle step-by-step guidance" fill className="object-cover" />
            </div>
            <p className="text-sm sm:text-base font-medium text-zinc-600 pt-1">
              Gentle, step-by-step guidance in a safe space
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Card 5: Why LUNA is Different */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full bg-white/5 backdrop-blur-xs shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] rounded-[2.5rem] border-[5px] border-[#FFFFFF03] p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-2xl font-bold text-black mb-8 sm:mb-10">
          Why LUNA is Different
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Column 1 */}
          <div className="flex flex-col items-center space-y-4 p-4 text-center">
            <div className="relative w-full max-w-[280px] aspect-[16/10] rounded-2xl overflow-hidden shadow-sm">
              <Image src="/doctor-guided.png" alt="Less explanation, more positioning" fill className="object-cover" />
            </div>
            <h3 className="text-base font-bold text-[#EF8F60]">
              Less explanation, more positioning
            </h3>
            <p className="text-sm text-[#686873] leading-[1.2] max-w-sm">
              Most girls focus on symptoms, after non-working body energy.
              <br /><br />
              Early guidance.
              <br />
              Safe conversations.
              <br />
              It builds a relationship with their health from the start.
            </p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center space-y-4 p-4 text-center">
            <div className="relative w-full max-w-[280px] aspect-[16/10] rounded-2xl overflow-hidden shadow-sm">
              <Image src="/daily-chat.png" alt="For Parents" fill className="object-cover" />
            </div>
            <h3 className="text-base font-bold text-[#036132]">
              For Parents
            </h3>
            <p className="text-sm text-[#686873] leading-[1.2] max-w-sm">
              Make health feel like wellness, not medicalizing.
              <br /><br />
              It safer, more educational way to support your daughter. For teenagers, it is a modern, hidden, clear, consistent guidance does not problematic, when embarrassed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}