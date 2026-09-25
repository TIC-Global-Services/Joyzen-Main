'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SpecularButton from '@/reuseable/specularButton';

interface PlanCardData {
  id: number;
  label: string;
  prefixTitle?: string;
  prefixSubtitle?: string;
  highlightPrice: string;
  suffixTitle?: string;
  subPrice: string;
  cancelTag: string;
  buttonText: string;
}

const plans: PlanCardData[] = [
  {
    id: 0,
    label: 'Most Chosen',
    prefixTitle: 'Start Today',
    prefixSubtitle: '@ ',
    highlightPrice: '1 Rs',
    subPrice: 'Then Rs 1,499/month',
    cancelTag: 'Cancel Anytime',
    buttonText: 'SAVE INFO',
  },
  {
    id: 1,
    label: 'Best Value',
    highlightPrice: 'Rs 46 ',
    suffixTitle: 'Per Day',
    subPrice: '3 month care plan',
    cancelTag: 'Cancel Anytime',
    buttonText: 'SAVE INFO',
  },
  {
    id: 2,
    label: 'Complete Care',
    highlightPrice: 'Rs 44 ',
    suffixTitle: 'Per Day',
    subPrice: '6 month care plan',
    cancelTag: 'Cancel Anytime',
    buttonText: 'SAVE INFO',
  },
];

export default function LunaMembership() {
  // First card (index 0) is active by default
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <div className="w-full  px-4 sm:px-6 lg:px-[5%] py-12 flex flex-col items-center select-none">
      {/* LUNA Orb Logo Header */}
      <div className="relative w-[24dvh] h-[24dvh] sm:w-[32dvh] sm:h-[32dvh] mb-4 drop-shadow-[0_12px_24px_rgba(150,100,220,0.25)] hover:scale-105 transition-transform duration-300">
        <Image
          src="/luna_ai.png"
          alt="LUNA AI Orb Logo"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main Title & Subtitle */}
      <h2 className="text-3xl sm:text-4xl lg:text-[50px] font-bold tracking-tight text-zinc-900 text-center mb-3">
        Choose Your <span className='text-[#EF8F60]'>LUNA</span> Membership
      </h2>

      <p className="text-base sm:text-lg font-semibold text-[#036132] text-center max-w-md sm:max-w-3xl mb-10 leading-[1.2]">
        Most LUNA members continue for 3-6 months to see meaningful improvement and confidence in their health.
      </p>

      {/* Interactive Expandable Cards Container */}
      <div
        onMouseLeave={() => setActiveIndex(0)}
        className="w-full flex flex-col lg:flex-row items-stretch justify-center gap-4 sm:gap-6 min-h-[380px]"
      >
        {plans.map((plan, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={plan.id}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              style={
                isActive
                  ? {
                      background:
                        'radial-gradient(circle at 100% 100%, rgba(143, 221, 243, 0.75) 0%, transparent 55%), radial-gradient(circle at 0% 100%, rgba(230, 205, 245, 0.75) 0%, transparent 55%), radial-gradient(circle at 90% 10%, rgba(254, 228, 212, 0.65) 0%, transparent 45%), linear-gradient(135deg, #ffffff 50%, #fffdfb 100%)',
                    }
                  : undefined
              }
              className={`relative rounded-[2rem]  p-6 sm:p-8 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-500 ${
                isActive
                  ? 'flex-[2.2] shadow-[0_16px_48px_rgba(246,215,198,0.45),inset_0_1px_2px_rgba(255,255,255,0.9)] border-white'
                  : 'flex-1 bg-white/10 backdrop-blur-xs shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.02)] border-white/60 hover:bg-white/20'
              }`}
            >
              {/* Background Joyzen Logo Watermark */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-38 sm:w-56 h-48 sm:h-56 pointer-events-none transition-opacity duration-300 ${
                  isActive ? 'opacity-35 z-0' : 'opacity-15 z-0'
                }`}
              >
                <Image
                  src="/joyzen-logo.png"
                  alt="Joyzen Watermark"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Card Content Container */}
              <div className={`relative z-10 flex flex-col h-full w-full ${isActive ? 'justify-between' : 'justify-end'}`}>
                
                {/* Top Section (Label for Active Card only) */}
                {isActive && (
                  <div>
                    <h3 className="text-[17px] sm:text-[28px] font-bold tracking-tight text-zinc-900">
                      {plan.label}
                    </h3>
                  </div>
                )}

                {/* Bottom Section */}
                <div className={`${isActive ? 'flex flex-col sm:flex-row sm:items-end justify-between mt-auto pt-26 sm:pt-0' : 'space-y-1 mt-auto'}`}>
                  
                  <div className="md:space-y-1">
                    {/* Label for Inactive Card (pushed to bottom) */}
                    {!isActive && (
                      <h3 className="text-[17px] sm:text-[28px] font-bold tracking-tight text-zinc-900 pb-1">
                        {plan.label}
                      </h3>
                    )}
                    
                    {/* Pricing Details */}
                    <div className="text-[32px] sm:text-[40px] font-bold text-zinc-900 tracking-tight leading-[1.1]">
                      {plan.prefixTitle && <span className="block sm:inline">{plan.prefixTitle} </span>}
                      {plan.prefixSubtitle && <span>{plan.prefixSubtitle}</span>}
                      <span className="text-[#EF8F60] font-extrabold">{plan.highlightPrice}</span>
                      {plan.suffixTitle && <span className="font-bold text-zinc-900">{plan.suffixTitle}</span>}
                    </div>

                    <p className="text-[19px] sm:text-xl font-bold text-black leading-[1.2]">
                      {plan.subPrice}
                    </p>

                    <p className="text-base font-bold tracking-tight text-[#036132] pt-1">
                      {plan.cancelTag}
                    </p>
                  </div>

                  {/* Action Button (Active Card only) */}
                  {isActive && (
                    <div className="flex justify-start sm:justify-end mt-6 sm:mt-0">
                      <SpecularButton
                        type="button"
                        size="md"
                        tint="#AEDEE44D"
                        tintOpacity={0.35}
                        textColor="#000000"
                        lineColor="#ffffff"
                        baseColor="#AEDEE44D"
                        radius={20}
                        className="font-bold text-[13px] sm:text-sm uppercase tracking-tight px-6 py-2 shadow-sm"
                      >
                        {plan.buttonText}
                      </SpecularButton>
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Text and Logo */}
      <div className="w-full  flex flex-col md:flex-row items-center justify-between mt-10 gap-6">
        <p className="text-sm sm:text-lg font-bold text-black text-center md:text-left md:max-w-xl leading-[1.3]">
          After enrollment, our care team will contact you within 24 hours to begin your LUNA program.
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm sm:text-base font-bold text-black tracking-tight">Powered by</span>
          <div className="relative w-[100px] h-[32px]">
            <Image src="/joyzen-logo.png" alt="Joyzen Logo" fill className="object-contain object-left md:object-right" />
          </div>
        </div>
      </div>
    </div>
  );
}