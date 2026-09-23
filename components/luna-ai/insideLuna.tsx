'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const MARQUEE_ITEMS = [
  { img: '/lunaAi/doctor-guid.png', text: 'Doctor-guided cycle & puberty support' },
  { img: '/lunaAi/daily-chat-access.png', text: 'Daily chat\naccess for questions' },
  { img: '/lunaAi/monthly-consultation.png', text: '3 monthly consultations (chat /\ncall / VC)' },
  { img: '/lunaAi/cycle-tracking-and-tips.png', text: 'Cycle tracking & weekly health\ntips' },
  { img: '/lunaAi/cycle-tracking-and-tips.png', text: 'Gentle, step-by-step guidance in\na safe space' }
];

export default function InsideLuna() {
  return (
    <div className="w-full py-20 flex flex-col items-center overflow-hidden">
      
      {/* Title */}
      <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-bold text-black tracking-tight text-center leading-none mb-12 px-4">
        What&apos;s Inside <span className="text-[#EB7847]">LUNA</span><br />
        &amp; How It Supports Every Stage of Growing Up
      </h2>

      {/* Infinite Marquee Container */}
      <div className="relative w-full flex overflow-hidden group">
        <motion.div
          className="flex whitespace-nowrap gap-6 pl-6"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 35,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {/* Render the items twice to create the infinite loop effect */}
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <div
              key={idx}
              className="w-[280px] sm:w-[320px] shrink-0 bg-white/40 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.04)] rounded-[2rem] border-[3px] border-white/60 p-4 pb-6 flex flex-col items-center space-y-4 transition-all duration-300 group-hover:opacity-75 hover:!opacity-100"
            >
              <div className="relative w-full aspect-[16/12] rounded-[1.5rem] overflow-hidden shadow-inner bg-zinc-100">
                <Image src={item.img} alt={item.text} fill className="object-cover" />
              </div>
              <p className="text-lg font-medium text-zinc-600 leading-[1.2] text-center whitespace-pre-wrap ">
                {item.text}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}