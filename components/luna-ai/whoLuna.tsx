'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

const SUPPORT_CARDS = [
  {
    icon: '/lunaAi/calender-icon.png',
    alt: 'Teen girl cycle',
    text: 'Teen girls experiencing the beginning of their menstrual cycle',
  },
  {
    icon: '/lunaAi/navigate-icon.png',
    alt: 'First period',
    text: 'Navigating the First Period & Early Stages of Puberty',
  },
  {
    icon: '/lunaAi/girls-icon.png',
    alt: 'Safe space',
    text: 'Girls, Looking for a Safe Space to Understand Their Changing Bodies',
  },
];

export default function WhoLuna() {
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
      setActiveIndex(SUPPORT_CARDS.length - 1);
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
    } else if (index === SUPPORT_CARDS.length - 1) {
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
    <div className="w-full py-16">
      
      {/* ------------------------------------------------------------------ */}
      {/* Desktop & Tablet Layout (>= md) - Unchanged */}
      {/* ------------------------------------------------------------------ */}
      <div className="w-full hidden md:flex flex-col lg:grid lg:grid-cols-4 items-stretch gap-6 lg:gap-8 px-6 lg:px-[5%]">
        
        {/* Title Section */}
        <div className="w-full flex flex-col justify-center text-center lg:text-right shrink-0">
          <h2 className="text-3xl sm:text-4xl lg:text-3xl font-bold text-black tracking-tight leading-[1.2]">
            Who <span className="text-[#EB7847]">LUNA</span> Is<br className="hidden lg:block" />
            Designed to Support
          </h2>
        </div>

        {/* Cards Section (Grid on Desktop, Slider on Tablet) */}
        <div className="w-full lg:col-span-3 flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory pb-6 lg:pb-0 px-0 scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {SUPPORT_CARDS.map((card, index) => (
            <div 
              key={index}
              className="w-[400px] lg:w-full shrink-0 snap-center bg-white/10 backdrop-blur-sm shadow-lg rounded-[2rem] p-8 flex flex-col items-center justify-center text-center space-y-6 transition-transform duration-300 hover:-translate-y-1 border border-white"
            >
              <div className="w-20 h-20 relative flex items-center justify-center shrink-0">
                <Image 
                  src={card.icon} 
                  alt={card.alt} 
                  fill 
                  className="object-contain" 
                />
              </div>
              <p className="text-lg font-medium text-[#686873] leading-[1.4]">
                {card.text}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile Layout (< md) - Slider matching insideLuna with peek & scroll indicator */}
      {/* ------------------------------------------------------------------ */}
      <div className="w-full flex md:hidden flex-col items-center">
        
        {/* Mobile Title */}
        <div className="w-full flex flex-col justify-center text-center px-6 mb-8">
          <h2 className="text-3xl font-bold text-black tracking-tight leading-[1.2]">
            Who <span className="text-[#EB7847]">LUNA</span> Is<br />
            Designed to Support
          </h2>
        </div>

        {/* Mobile Slider (< md) */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full flex overflow-x-auto snap-x snap-mandatory gap-5 px-6 pb-4 scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {SUPPORT_CARDS.map((card, index) => (
            <div 
              key={index}
              className="w-[78vw] max-w-[300px] shrink-0 snap-center bg-white/10 backdrop-blur-sm shadow-lg rounded-[2rem] p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[220px] transition-transform duration-300 border border-white"
            >
              <div className="w-16 h-16 relative flex items-center justify-center shrink-0">
                <Image 
                  src={card.icon} 
                  alt={card.alt} 
                  fill 
                  className="object-contain" 
                />
              </div>
              <p className="text-sm font-medium text-[#686873] leading-[1.4]">
                {card.text}
              </p>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {SUPPORT_CARDS.map((_, index) => (
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

      </div>
      
    </div>
  );
}