'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Marquee from '@/reuseable/Marquee';

const MARQUEE_BADGES = [
    'Health Awareness',
    'Wellness Workshops',
    'Community Circles',
    'Preventive Care',
    'Doctor Consultations',
    'Support Groups',
    'Holistic Wellbeing',
    'Mindful Living',
];

export default function TrustedBy() {
    return (
        <section className="relative w-full py-12 sm:py-16 md:py-20 px-[5%] select-none">
            <div className="flex flex-col gap-5 sm:gap-4">
                {/* Top Row Grid: Left (Card 1 & 2 stacked) + Right (Card 3 Large) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-4">
                    {/* Left Column (4 cols on lg): Card 1 (70 Crore+) & Card 2 (25%) */}
                    <div className="lg:col-span-4 flex flex-col gap-5 sm:gap-4">
                        {/* Card 1: 70 Crore+ */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white rounded-[20px] p-6 sm:p-7 md:p-8 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-black/[0.04] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex-1"
                        >
                            <div>
                                <h3 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#FAD405] leading-none">
                                    70 Crore+
                                </h3>
                                <p className="mt-3 text-base md:text-[22px] font-medium text-zinc-800 leading-[1.1] tracking-tight">
                                    Ayushman Bharat Health IDs created under India&apos;s national digital health mission (ABDM).
                                </p>
                            </div>

                            {/* PIB Badge */}
                            <div className="flex justify-end mt-4 pt-2">
                                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#DDC5DF80] text-black text-base font-medium tracking-tight shadow-2xs">
                                    <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-white/60">
                                        <Image
                                            src="/pib-india.jpg"
                                            alt="PIB India"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span>Pib.gov</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 2: 25% */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="bg-white rounded-[20px] p-6 sm:p-7 md:p-8 flex flex-col justify-center shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-black/[0.04] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex-1"
                        >
                            <h3 className="text-4xl sm:text-[6.250rem] font-bold tracking-tight text-[#E87547] leading-none">
                                25%
                            </h3>
                            <p className="mt-3 text-base sm:text-[22px] font-medium text-zinc-800 leading-[1.2] tracking-tighter">
                                Urban healthcare facilities running proper electronic health records today, which tells you how much work is still left.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Column (8 cols on lg): Card 3 (Trusted by leading healthcare partners) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                        className="lg:col-span-8 bg-white rounded-[20px]  p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-black/[0.04] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300"
                    >
                        <div>
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter text-[#E87547] leading-none">
                                Trusted by leading healthcare partners.
                            </h2>
                            <p className="mt-4 text-base md:text-[22px] font-medium text-black leading-[1.2] ">
                                “Built to work with the Ayushman Bharat Digital Mission, so clinics can plug into India&apos;s digital health backbone without the chaos.”
                            </p>
                        </div>

                        {/* Bottom Partners Logo Boxes & Pill */}
                        <div className="flex flex-col lg:flex-row items-start sm:items-end justify-between gap-2 mt-8 pt-2">
                            <div className="flex items-center gap-2  lg:flex-nowrap">
                                {/* Digital India Box */}
                                <div className="w-[20dvh] md:w-[35dvh] lg:w-[24dvw] h-30 md:h-24 md:h-[22dvh] rounded-2xl bg-[#DDC5DF80] hover:bg-[#DDC5DF80] transition-colors duration-300 p-3 flex items-center justify-center relative overflow-hidden group">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src="/digital_india.png"
                                            alt="Digital India"
                                            fill
                                            className="object-cover p-1 group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Digital Mission Box */}
                                <div className="w-[15dvh] sm:w-[30dvw] lg:w-[18dvw] h-30 sm:h-24 md:h-[22dvh] rounded-2xl bg-[#DDC5DF80] hover:bg-[#DDC5DF80] transition-colors duration-300 p-3 flex items-center justify-center relative overflow-hidden group">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src="/digital_mission.png"
                                            alt="Ayushman Bharat Digital Mission"
                                            fill
                                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Digital India Gov pill badge */}
                            <div className="self-end sm:self-end">
                                <div className="inline-flex  relative items-center w-full px-6 py-1.5 rounded-full bg-[#DDC5DF80] text-zinc-900 text-xs sm:text-base font-semibold tracking-tight shadow-2xs">
                                    Digitalindia.gov
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Row Grid: Left (Card 4: Care beyond treatment) + Right (Card 5: 500+) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-4">
                    {/* Card 4: Care beyond treatment (8 cols on lg) with Marquee Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="lg:col-span-8 bg-white rounded-[20px] p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-black/[0.04] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden"
                    >
                        <div>
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-[#036132] leading-tight">
                                Care beyond treatment
                            </h2>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-2">
                            <p className="text-base sm:text-[22px] font-medium text-zinc-800 leading-[1.1] tracking-tighter md:max-w-xs lg:max-w-sm flex-shrink-0">
                                “From national digital health rails to everyday clinic workflows, we make care feel connected, not scattered.”
                            </p>

                            {/* Marquee Badges Container */}
                            <div className="w-full md:w-auto md:flex-1 py-1">
                                <Marquee speed={25} gap={12} pauseOnHover={true}>
                                    {MARQUEE_BADGES.map((badge, idx) => (
                                        <div
                                            key={idx}
                                            className="px-4 sm:px-5 py-2 sm:py-1.5 rounded-full bg-white text-[#036132] border border-[#AEDEE4] shadow-[0_2px_8px_rgba(3,97,50,0.06)] text-xs sm:text-base font-semibold tracking-tight whitespace-nowrap hover:bg-[#AEDEE4]/20 transition-colors duration-200 cursor-default"
                                        >
                                            {badge}
                                        </div>
                                    ))}
                                </Marquee>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 5: 500+ (4 cols on lg) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                        className="lg:col-span-4 bg-white rounded-[20px] p-6 sm:p-7 md:p-8 flex flex-col justify-center shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-black/[0.04] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300"
                    >
                        <h3 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#AEDEE4] drop-shadow-xs leading-none">
                            500+
                        </h3>
                        <p className="mt-3 text-base sm:text-[22px] font-medium text-black leading-[1.2] tracking-tighter">
                            “Dedicated to supporting patients with personalised care, and to turning ABDM&apos;s big numbers into real, everyday impact inside clinics.”
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
