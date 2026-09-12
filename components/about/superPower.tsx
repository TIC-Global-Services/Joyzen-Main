'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface SuperpowerItem {
  id: string;
  title: string;
  icon: string;
}

const row1Items: SuperpowerItem[] = [
  {
    id: 'personal-doctor',
    title: 'Personal Doctor',
    icon: '/superpowers/personal-doctor.svg',
  },
  {
    id: 'diet-cycle-tracking',
    title: 'Diet & Cycle tracking',
    icon: '/superpowers/diet-cycle-tracking.svg',
  },
  {
    id: 'followup-reminder',
    title: 'Follow-ups & Reminders',
    icon: '/superpowers/followup-reminder.svg',
  },
  {
    id: 'clarity-call',
    title: 'Clarity Call',
    icon: '/superpowers/clarity-call.svg',
  },
  {
    id: 'mental-health',
    title: 'Mental health support',
    icon: '/superpowers/mental-health.svg',
  },
  {
    id: 'life-care',
    title: 'Life care',
    icon: '/superpowers/life-care.svg',
  },
];

const row2Items: SuperpowerItem[] = [
  {
    id: 'community-joyzen-club',
    title: 'Community & Joyzen club',
    icon: '/superpowers/community-joyzen-club.svg',
  },
  {
    id: 'internation-acess',
    title: 'International Access',
    icon: '/superpowers/internation-acess.svg',
  },
  {
    id: 'reprodective-care',
    title: 'reproductive care program',
    icon: '/superpowers/reprodective-care.svg',
  },
  {
    id: 'fertility-care',
    title: 'Fertility care',
    icon: '/superpowers/fertility-care.svg',
  },
  {
    id: 'pregnancy-care',
    title: 'Pregnancy care',
    icon: '/superpowers/pregnancy-care.svg',
  },
];

const allItems = [...row1Items, ...row2Items];

export default function SuperPowerSection() {
  return (
    <section className="relative w-full px-5 sm:px-8 md:px-12 lg:px-[5%] py-16 sm:py-24 md:py-32 overflow-hidden select-none">
      <div className="w-full flex flex-col items-center">
        
        {/* Main Section Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold text-zinc-900 tracking-tight leading-[1.18] sm:leading-[1.15]">
            Superpowers For Your Everyday,<br />
            <span className="text-[#036132]">No Cape Required.</span>
          </h2>
        </motion.div>

        {/* Desktop / Tablet Two-Row Staggered Layout */}
        <div className="hidden md:flex flex-col items-center w-full gap-8 lg:gap-12">
          {/* Row 1: 6 Cards */}
          <div className="flex flex-wrap justify-center items-start gap-5 lg:gap-8 xl:gap-10 w-full">
            {row1Items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: index * 0.06,
                }}
                className="group flex flex-col items-center w-[120px] lg:w-[142px] xl:w-[155px] cursor-pointer"
              >
                {/* 3D Icon Card Squircle */}
                <div className="relative w-full aspect-square bg-white/4 backdrop-blur-sm rounded-[24px] lg:rounded-[24px] p-3.5 lg:p-4.5 border border-white/4 shadow-[0_10px_28px_-6px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.02)] ring-1 ring-zinc-200/50 group-hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.12)] group-hover:-translate-y-2 group-hover:border-[#EF8F60]/30 transition-all duration-300 ease-out flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
                    />
                  </div>
                </div>

                {/* Card Title Label */}
                <span className="mt-3.5 text-center text-[13px] lg:text-xl font-semibold text-zinc-900 leading-[1.2] tracking-tight group-hover:text-[#036132] transition-colors duration-200">
                  {item.title}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Row 2: 5 Cards (Centered) */}
          <div className="flex flex-wrap justify-center items-start gap-5 lg:gap-8 xl:gap-10 w-full">
            {row2Items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.25 + index * 0.06,
                }}
                className="group flex flex-col items-center w-[120px] lg:w-[142px] xl:w-[155px] cursor-pointer"
              >
                {/* 3D Icon Card Squircle */}
                <div className="relative w-full aspect-square bg-white/4 backdrop-blur-sm rounded-[24px] lg:rounded-[24px] p-3.5 lg:p-4.5 border border-white/10 shadow-[0_10px_28px_-6px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.02)] ring-1 ring-zinc-200/50 group-hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.12)] group-hover:-translate-y-2 group-hover:border-[#EF8F60]/30 transition-all duration-300 ease-out flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
                    />
                  </div>
                </div>

                {/* Card Title Label */}
                <span className="mt-3.5 text-center text-[13px] lg:text-xl font-semibold text-zinc-900 leading-[1.2] tracking-tight group-hover:text-[#036132] transition-colors duration-200">
                  {item.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Responsive Infinite Marquee (2 rows with smooth edge fade) */}
        <div className="flex md:hidden flex-col gap-6 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-2">
          {/* Marquee Row 1 (Moves Left) */}
          <div className="w-full overflow-hidden flex">
            <motion.div
              animate={{ x: ['0%', '-33.333%'] }}
              transition={{
                repeat: Infinity,
                ease: 'linear',
                duration: 20,
              }}
              className="flex gap-4 w-max shrink-0"
            >
              {[...row1Items, ...row1Items, ...row1Items].map((item, index) => (
                <div
                  key={`${item.id}-m1-${index}`}
                  className="flex flex-col items-center w-[110px] sm:w-[125px] shrink-0"
                >
                  {/* Card Squircle */}
                  <div className="relative w-full aspect-square bg-white/90 backdrop-blur-sm rounded-[22px] p-3 border border-white/80 shadow-[0_6px_18px_rgba(0,0,0,0.05)] ring-1 ring-zinc-200/50 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  {/* Title */}
                  <span className="mt-2 text-center text-[11px] sm:text-[12px] font-semibold text-zinc-900 leading-tight tracking-tight">
                    {item.title}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Marquee Row 2 (Moves Right) */}
          <div className="w-full overflow-hidden flex">
            <motion.div
              animate={{ x: ['-33.333%', '0%'] }}
              transition={{
                repeat: Infinity,
                ease: 'linear',
                duration: 22,
              }}
              className="flex gap-4 w-max shrink-0"
            >
              {[...row2Items, ...row2Items, ...row2Items].map((item, index) => (
                <div
                  key={`${item.id}-m2-${index}`}
                  className="flex flex-col items-center w-[110px] sm:w-[125px] shrink-0"
                >
                  {/* Card Squircle */}
                  <div className="relative w-full aspect-square bg-white/90 backdrop-blur-sm rounded-[22px] p-3 border border-white/80 shadow-[0_6px_18px_rgba(0,0,0,0.05)] ring-1 ring-zinc-200/50 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  {/* Title */}
                  <span className="mt-2 text-center text-[11px] sm:text-[12px] font-semibold text-zinc-900 leading-tight tracking-tight">
                    {item.title}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}