'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const CARDS_DATA = [
  {
    id: 'left',
    src: '/lunaAi/understanding.png',
    alt: 'Understanding Body',
    text: 'Understanding the Body & the\nChanges That Come With\nGrowing Up',
    desktopInitial: { x: 0, y: 0, rotate: 0, opacity: 0.8 },
    desktopWhileInView: { x: '-68%', y: 15, rotate: -10, opacity: 1 },
    zIndex: 10,
    bgClass: 'bg-white/20'
  },
  {
    id: 'right',
    src: '/lunaAi/confidence.png',
    alt: 'Building Confidence',
    text: 'Building Confidence & Feeling\nComfortable\nWith Every Change',
    desktopInitial: { x: 0, y: 0, rotate: 0, opacity: 0.8 },
    desktopWhileInView: { x: '68%', y: 15, rotate: 10, opacity: 1 },
    zIndex: 10,
    bgClass: 'bg-white/20'
  },
  {
    id: 'center',
    src: '/lunaAi/concern.png',
    alt: 'Everyday Concerns',
    text: 'Understanding Everyday\nConcerns & Navigating\nChanges With Confidence',
    desktopInitial: { y: 20, scale: 0.95 },
    desktopWhileInView: { y: 0, scale: 1 },
    zIndex: 20,
    bgClass: 'bg-white/5',
    isCenter: true
  }
];

export default function WhatInclude() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl lg:text-[30px] font-bold text-black tracking-tight text-center mb-5">
        What&apos;s Included Inside the <span className="text-[#EB7847]">LUNA</span> Membership
      </h2>

      {/* Desktop Fanning Cards (Visible only on sm and up) */}
      <div className="relative w-full hidden sm:flex items-center justify-center h-[450px]">
        {CARDS_DATA.map((card) => (
          <motion.div
            key={card.id}
            initial={card.desktopInitial}
            whileInView={card.desktopWhileInView}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: card.isCenter ? 0.6 : 0.8, ease: [0.16, 1, 0.3, 1], delay: card.isCenter ? 0 : 0.1 }}
            className={`${card.bgClass} backdrop-blur-xs shadow-xl rounded-[42px] absolute p-5 flex flex-col items-center w-[380px] h-[380px] ${card.isCenter ? 'shadow-2xl' : ''}`}
            style={{ zIndex: card.zIndex }}
          >
            <div className="relative w-full flex-1 rounded-2xl overflow-hidden shadow-inner mb-6">
              <Image src={card.src} alt={card.alt} fill className="object-cover" />
            </div>
            <p className={`text-center text-lg leading-[1.3] px-2 pb-1 ${card.isCenter ? 'font-bold' : 'font-medium'} text-[#686873] whitespace-pre-line`}>
              {card.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Mobile Stacked Cards (Visible only below sm) */}
      <div className="w-full flex sm:hidden flex-col items-center justify-center gap-8 mt-8">
        {/* Reordering so center card (the most important) is in the middle of the stack, or whatever order makes sense. Let's render in array order. */}
        {CARDS_DATA.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className={`${card.bgClass} backdrop-blur-xs shadow-xl rounded-[2rem] p-4 flex flex-col items-center w-full max-w-[320px] aspect-square`}
          >
            <div className="relative w-full flex-1 rounded-2xl overflow-hidden shadow-inner mb-4">
              <Image src={card.src} alt={card.alt} fill className="object-cover" />
            </div>
            <p className={`text-center text-sm leading-[1.3] px-1 ${card.isCenter ? 'font-bold' : 'font-medium'} text-[#686873] whitespace-pre-line`}>
              {card.text}
            </p>
          </motion.div>
        ))}
      </div>

    </div>
  );
}