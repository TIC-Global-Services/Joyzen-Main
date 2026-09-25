'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const MARQUEE_ITEMS = [
  { img: '/lunaAi/doctor-guid.png', text: 'Doctor-guided cycle & puberty support', imgPos: '50% 100%', imgScale: 'scale-[1.6]' },
  { img: '/lunaAi/daily-chat-access.png', text: 'Daily chat\naccess for questions', imgPos: '50% 100%', imgScale: 'scale-[1.5]' },
  { img: '/lunaAi/monthly-counceltation.png', text: '3 monthly consultations (chat /\ncall / VC)', imgPos: '50% 100%', imgScale: 'scale-[1.5]' },
  { img: '/lunaAi/cycle-tracking-and-tips.png', text: 'Cycle tracking & weekly health\ntips', imgPos: '50% 100%', imgScale: 'scale-[1.5]' },
  { img: '/lunaAi/cycle-tracking-and-tips.png', text: 'Gentle, step-by-step guidance in\na safe space', imgPos: '50% 100%', imgScale: 'scale-[1.5]' }
];

export default function InsideLuna() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;

    if (container.scrollLeft <= 20) {
      setActiveIndex(0);
      return;
    }
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 20) {
      setActiveIndex(MARQUEE_ITEMS.length - 1);
      return;
    }

    const scrollCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const htmlChild = child as HTMLElement;
      const childCenter = htmlChild.offsetLeft + htmlChild.offsetWidth / 2;
      const distance = Math.abs(childCenter - scrollCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  const scrollToCard = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;

    if (index === 0) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (index === MARQUEE_ITEMS.length - 1) {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
    } else {
      const targetChild = container.children[index] as HTMLElement;
      if (targetChild) {
        const left = targetChild.offsetLeft - (container.clientWidth - targetChild.offsetWidth) / 2;
        container.scrollTo({ left, behavior: 'smooth' });
      }
    }
    setActiveIndex(index);
  };

  return (
    <div className="w-full py-20 flex flex-col items-center overflow-hidden">
      
      {/* Title */}
      <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-bold text-black tracking-tight text-center leading-none mb-12 px-4">
        What&apos;s Inside <span className="text-[#EB7847]">LUNA</span><br />
        &amp; How It Supports Every Stage of Growing Up
      </h2>

      {/* Mobile Slider (< md) */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-full flex md:hidden overflow-x-auto snap-x snap-mandatory gap-5 px-6 pb-4 scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {MARQUEE_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="w-[80vw] max-w-[320px] shrink-0 snap-center bg-white/40 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.04)] rounded-[2rem] border-[3px] border-white/60 p-4 pb-6 flex flex-col items-center space-y-4"
          >
            <div className="relative w-full aspect-[16/12] rounded-[1.5rem] overflow-hidden shadow-inner bg-zinc-100">
              <Image src={item.img} alt={item.text} fill style={{objectPosition: item.imgPos, transformOrigin: item.imgPos}} className={`object-cover ${item.imgScale}`} />
            </div>
            <p className="text-base sm:text-lg font-medium text-zinc-600 leading-[1.2] text-center whitespace-pre-wrap">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile Scroll Indicator Dots */}
      <div className="flex md:hidden items-center justify-center gap-2 mt-2">
        {MARQUEE_ITEMS.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'w-7 bg-[#EB7847]'
                : 'w-2 bg-[#EB7847]/30 hover:bg-[#EB7847]/50'
            }`}
          />
        ))}
      </div>

      {/* Desktop Infinite Marquee (>= md) */}
      <div className="relative w-full hidden md:flex overflow-hidden group">
        <style>{`
          @keyframes marquee-half {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-half {
            animation: marquee-half 35s linear infinite;
          }
        `}</style>
        
        <div className="flex whitespace-nowrap gap-6 pl-6 animate-marquee-half group-hover:[animation-play-state:paused]">
          {/* Render the items twice to create the infinite loop effect */}
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <div
              key={idx}
              className="w-[280px] sm:w-[320px] shrink-0 bg-white/40 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.04)] rounded-[2rem] border-[3px] border-white/60 p-4 pb-6 flex flex-col items-center space-y-4 transition-all duration-300 group-hover:opacity-75 hover:!opacity-100"
            >
              <div className="relative w-full aspect-[16/12] rounded-[1.5rem] overflow-hidden shadow-inner bg-zinc-100">
                <Image src={item.img} alt={item.text} fill style={{objectPosition: item.imgPos, transformOrigin: item.imgPos}} className={`object-cover ${item.imgScale}`} />
              </div>
              <p className="text-lg font-medium text-zinc-600 leading-[1.2] text-center whitespace-pre-wrap ">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}