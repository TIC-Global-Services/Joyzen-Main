'use client';

import React from 'react';
import Image from 'next/image';

export default function WhylunaDifferent() {
  return (
    <div className="w-full px-[5%] py-20 flex flex-col items-center">
      
      {/* Title */}
      <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-bold text-black tracking-tight text-center leading-[1.2] mb-12">
        Why <span className="text-[#EB7847]">LUNA</span> Is Different<br />
        &amp; What Makes Its Approach Truly Stand Out
      </h2>

      {/* Cards Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 justify-end items-end gap-8">
        
        {/* Card 1 */}
        <div className="w-full bg-white/40 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.04)] rounded-[2.5rem] border-[3px] border-white/60 py-4 px-4 flex flex-col sm:flex-row gap-8 items-center sm:items-start transition-transform duration-300 hover:scale-[1.02]">
          
          {/* Left Image */}
          <div className="relative w-full h-full aspect-[4/3]  md:aspect-[2/4] md:max-w-[320px] max-h-[420px] shrink-0 rounded-3xl overflow-hidden shadow-inner">
            <Image src="/doctor-guided.png" alt="Doctor guided support" fill className="object-cover" />
          </div>

          {/* Right Content */}
          <div className="w-full  flex flex-col justify-center space-y-4 md:pt-20">
            <h3 className="text-base sm:text-3xl font-medium text-[#EB7847] leading-[1.1] tracking-tight">
              Less explanation,<br />more positioning
            </h3>
            
            <p className="text-base md:text-lg text-zinc-500 font-medium leading-[1.4]">
              Most girls meet a doctor<br />after something feels wrong.
            </p>
            
            <ul className="text-base md:text-lg text-zinc-500 font-medium leading-[1.2] space-y-1 list-disc pl-5 marker:text-zinc-400">
              <li>Early guidance</li>
              <li>Safe conversations</li>
              <li>A healthier relationship with their body from the start</li>
            </ul>
          </div>
        </div>

        {/* Card 2 */}
        <div className="w-full bg-white/40 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.04)] rounded-[2.5rem] border-[3px] border-white/60 py-4 px-4  flex flex-col sm:flex-row gap-8 items-center sm:items-start transition-transform duration-300 hover:scale-[1.02]">
          
          {/* Left Image */}
          <div className="relative w-full h-full aspect-[4/3]  md:aspect-[2/4] md:max-w-[320px] max-h-[420px] shrink-0 rounded-3xl overflow-hidden shadow-inner">
            <Image src="/daily-chat.png" alt="For Parents" fill className="object-cover" />
          </div>

          {/* Right Content */}
          <div className="w-full flex flex-col  space-y-4 pt-4 sm:pt-20 pr-2">
            <h3 className="text-base   sm:text-3xl font-medium text-[#EB7847] leading-[1.1] tracking-tight">
              For Parents
            </h3>
            
            <p className= "text-base md:text-lg text-zinc-500 font-medium leading-[1.4]">
              Make this feel like<br />reassurance, not marketing
            </p>
            
            <ul className="text-base md:text-lg text-zinc-500 font-medium leading-[1.2] px-4 sm:px-0 list-disc marker:text-zinc-400">
              <li>A safer, more structured way to support your daughter. No guesswork. No random advice. Just consistent guidance from real professionals, when it matters most</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}