'use client';

import React from 'react';
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
  return (
    <div className="w-full px-4 sm:px-6 lg:px-[5%] py-16">
      
      <div className="w-full flex flex-col lg:grid lg:grid-cols-4 items-stretch gap-6 lg:gap-8">
        
        {/* Title Section */}
        <div className="w-full flex flex-col justify-center text-center lg:text-right shrink-0">
          <h2 className="text-3xl sm:text-4xl lg:text-3xl font-bold text-black tracking-tight leading-[1.2]">
            Who <span className="text-[#EB7847]">LUNA</span> Is<br className="hidden lg:block" />
            Designed to Support
          </h2>
        </div>

        {/* Cards Section (Slider on Mobile, Grid on Desktop) */}
        <div className="w-full lg:col-span-3 flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory pb-6 lg:pb-0 px-4 sm:px-0 scrollbar-hide">
          {SUPPORT_CARDS.map((card, index) => (
            <div 
              key={index}
              className="w-[85vw] sm:w-[400px] lg:w-full shrink-0 snap-center bg-white/10 backdrop-blur-sm shadow-lg rounded-[2rem] p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 transition-transform duration-300 hover:-translate-y-1 border border-white"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center shrink-0">
                <Image 
                  src={card.icon} 
                  alt={card.alt} 
                  fill 
                  className="object-contain" 
                />
              </div>
              <p className="text-sm sm:text-lg font-medium text-[#686873] leading-[1.4]">
                {card.text}
              </p>
            </div>
          ))}
        </div>

      </div>
      
    </div>
  );
}