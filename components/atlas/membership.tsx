'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
        highlightPrice: '₹183',
        subPrice: 'Then ₹5,500/month',
        cancelTag: 'Cancel Anytime',
        buttonText: 'START MONTHLY',
    },
    {
        id: 1,
        label: 'Best Value',
        highlightPrice: '₹166 ',
        suffixTitle: 'Per Day',
        subPrice: '3 month care plan',
        cancelTag: 'Cancel Anytime',
        buttonText: 'CHOOSE 3 MONTHS',
    },
    {
        id: 2,
        label: 'Complete Care',
        highlightPrice: '₹166 ',
        suffixTitle: 'Per Day',
        subPrice: '6 month care plan',
        cancelTag: 'Cancel Anytime',
        buttonText: 'CHOOSE 6 MONTHS',
    },
];

export default function CalaMembership() {
    // First card (index 0) is active by default
    const [activeIndex, setActiveIndex] = useState<number>(0);

    return (
        <div className="w-full  px-4 sm:px-6 lg:px-[5%] pt-20 sm:pt-32 pb-40 flex flex-col items-center select-none">
            {/* Orb Logo Slot */}
            <div
                data-orb-slot
                className="relative mx-auto mb-6 flex items-center justify-center rounded-full"
                style={{ width: 'clamp(110px, 14vw, 240px)', height: 'clamp(110px, 14vw, 240px)' }}
            >
                <div
                    data-orb-ring
                    className="absolute inset-0 rounded-full border-[5px] border-white/80 opacity-0"
                    style={{
                        boxShadow: '0 0 50px rgba(255, 255, 255, 0.85), 0 20px 60px rgba(36, 168, 184, 0.3), inset 0 0 25px rgba(255, 255, 255, 0.4)'
                    }}
                />
            </div>

            {/* Main Title & Subtitle */}
            <h2 className="text-3xl sm:text-4xl lg:text-[50px] font-bold tracking-tight text-zinc-900 text-center mb-3">
                Choose Your <span className='text-[#7EBDB9]'>ATLAS</span> Membership
            </h2>

            <p className="text-base sm:text-lg font-semibold text-zinc-800 text-center max-w-md sm:max-w-3xl mb-10 leading-[1.2]">
                Structured care for fertility, hormones, and reproductive health.
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
                            style={{
                                flexBasis: 0,
                                flexShrink: 1,
                            }}
                            className={`relative rounded-[2rem] p-5 sm:p-7 lg:p-8 flex flex-col justify-between overflow-hidden cursor-pointer border transition-[flex-grow,box-shadow,border-color] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[flex-grow] lg:flex-1 ${isActive
                                ? 'lg:grow-[2.2] border-white shadow-[0_20px_50px_rgba(246,215,198,0.45),inset_0_1px_2px_rgba(255,255,255,0.95)]'
                                : 'lg:grow-1 border-white/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.02)]'
                                }`}
                        >
                            {/* Active Card Gradient Background Layer with smooth opacity cross-fade */}
                            <div
                                className={`absolute inset-0 rounded-[2rem] transition-opacity duration-300 ease-out pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'
                                    }`}
                                style={{
                                    background:
                                        'radial-gradient(ellipse 45% 48% at 100% 100%, rgba(143, 221, 243, 0.85) 0%, rgba(175, 226, 245, 0.35) 40%, transparent 70%), radial-gradient(ellipse 75% 48% at 20% 100%, rgba(246, 210, 238, 0.85) 0%, rgba(238, 205, 242, 0.5) 50%, transparent 75%), radial-gradient(circle at 95% 5%, rgba(254, 228, 212, 0.45) 0%, transparent 40%), linear-gradient(to bottom, #ffffff 58%, #fffdfc 100%)',
                                }}
                            />

                            {/* Inactive Card Frosted Layer with smooth opacity cross-fade (showing background honeycomb mesh) */}
                            <div
                                className={`absolute inset-0 rounded-[2rem] bg-white/10 backdrop-blur-xs transition-opacity duration-300 ease-out pointer-events-none ${isActive ? 'opacity-0' : 'opacity-100'
                                    }`}
                            />

                            {/* Card Content Container */}
                            <div className={`relative z-10 flex flex-col h-full w-full ${isActive ? 'lg:justify-between' : 'lg:justify-end'}`}>

                                {/* Mobile Top Labels */}
                                <div className="block lg:hidden mb-1.5">
                                    {isActive ? (
                                        <span className="text-[12px] font-medium text-[#EF8F60]">{plan.label}</span>
                                    ) : (
                                        <h3 className="text-[16px] font-bold text-zinc-900 leading-none">{plan.label}</h3>
                                    )}
                                </div>

                                {/* Desktop Top Label (Active Card only) */}
                                <div className={`hidden lg:block ${isActive ? '' : 'hidden'}`}>
                                    <h3 className="text-[28px] font-bold tracking-tight text-zinc-900">
                                        {plan.label}
                                    </h3>
                                </div>

                                {/* Bottom Section */}
                                <div
                                    className={`flex flex-col flex-1 ${isActive
                                        ? 'lg:flex-row lg:items-end justify-between mt-auto lg:pt-6'
                                        : 'space-y-0.5 lg:space-y-1 mt-auto'
                                        }`}
                                >
                                    <div className="space-y-0.5 lg:space-y-1 flex flex-col justify-center">
                                        {/* Desktop Label for Inactive Card (pushed to bottom) */}
                                        <h3 className={`hidden lg:block ${!isActive ? '' : 'hidden'} text-[28px] font-bold tracking-tight text-zinc-900 pb-1.5`}>
                                            {plan.label}
                                        </h3>

                                        {/* Pricing Details */}
                                        <div className={`font-bold text-zinc-900 tracking-tight flex items-center flex-wrap gap-x-1 lg:block leading-[1.2] lg:leading-[1.1] ${isActive ? 'text-[22px] lg:text-[40px]' : 'text-[20px] lg:text-[40px]'}`}>
                                            {plan.prefixTitle && (
                                                <span className={`inline lg:${isActive ? 'block xl:inline' : 'block'}`}>
                                                    {plan.prefixTitle}
                                                </span>
                                            )}
                                            {plan.prefixSubtitle && <span className="inline lg:inline">{plan.prefixSubtitle}</span>}
                                            <span className="text-[#036132] lg:text-[#EF8F60] font-extrabold inline lg:inline">{plan.highlightPrice}</span>
                                            {plan.suffixTitle && (
                                                <span className="font-bold text-zinc-900 inline lg:inline">
                                                    {plan.suffixTitle}
                                                </span>
                                            )}
                                        </div>

                                        <p className={`font-bold text-black leading-[1.2] ${isActive ? 'text-[13px] lg:text-xl' : 'text-[12px] lg:text-xl'}`}>
                                            {plan.subPrice}
                                        </p>

                                        <p className="text-[10px] lg:text-base font-medium tracking-tight text-zinc-500 lg:text-[#036132] pt-1.5 lg:pt-1">
                                            {plan.cancelTag}
                                        </p>
                                    </div>

                                    {/* Action Button (Active Card only) */}
                                    {isActive && (
                                        <div className="flex justify-start lg:justify-end mt-4 lg:mt-0 min-h-[34px] items-center">
                                            <SpecularButton
                                                type="button"
                                                size="md"
                                                tint="#AEDEE44D"
                                                tintOpacity={0.35}
                                                textColor="#000000"
                                                lineColor="#ffffff"
                                                baseColor="#AEDEE44D"
                                                radius={20}
                                                className="font-bold text-[10px] lg:text-sm uppercase tracking-tight px-5 py-2 shadow-sm"
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
            <div className="w-full flex flex-col items-center justify-center mt-10 gap-6">
                <p className="text-sm sm:text-[15px] font-medium text-zinc-900 text-center max-w-[600px] leading-[1.4]">
                    The supplied source lists ₹166/day for both ATLAS 3- and 6-month options; confirm this pricing before launch.
                </p>
            </div>
        </div>
    );
}