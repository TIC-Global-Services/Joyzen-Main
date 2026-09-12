'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
}

const GALLERY_COLUMNS: GalleryItem[][] = [
  // Column 1 (High)
  [
    {
      id: 1,
      src: '/gallery-1.png',
      alt: "Women's Health, Our Priority Workshop Presentation",
    },
    {
      id: 2,
      src: '/gallery-2.png',
      alt: 'Medical professionals collaborating in corridor',
    },
  ],
  // Column 2 (Low / Offset Down)
  [
    {
      id: 3,
      src: '/gallery-3.png',
      alt: 'Doctor and senior patient discussing consultation on laptop',
    },
    {
      id: 4,
      src: '/gallery-4.png',
      alt: 'Joyzen community wellness circle discussion',
    },
  ],
  // Column 3 (High)
  [
    {
      id: 5,
      src: '/gallery-5.png',
      alt: 'Doctor in lab coat having a warm conversation with patient in clinic lounge',
    },
    {
      id: 6,
      src: '/gallery-6.png',
      alt: 'Patient in waiting area during checkup',
    },
  ],
  // Column 4 (Low / Offset Down)
  [
    {
      id: 7,
      src: '/gallery-7.png',
      alt: 'Senior physician reviewing charts and prescribing care plan',
    },
    {
      id: 8,
      src: '/gallery-8.png',
      alt: 'Joyzen community meetup gathering',
    },
  ],
];

export default function Gallery() {
  return (
    <section className="relative w-full py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-8 lg:px-12 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 sm:mb-14 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold text-zinc-900 tracking-tight leading-tight">
            Community Gallery
          </h2>
        </motion.div>

        {/* 4-Column Grid with Uniform Sized Images and Alternating High/Low Placement */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 items-start">
          {GALLERY_COLUMNS.map((column, colIdx) => {
            // Alternating low/high column placement: Column 1 & 3 are High (mt-0), Column 2 & 4 are Low (offset down)
            const isLow = colIdx % 2 === 1;

            return (
              <div
                key={`gallery-col-${colIdx}`}
                className={`flex flex-col gap-4 sm:gap-5 md:gap-6 ${
                  isLow ? 'mt-6 sm:mt-10 md:mt-14 lg:mt-18' : 'mt-0'
                }`}
              >
                {column.map((item, itemIdx) => (
                  <motion.div
                    key={`gallery-item-${item.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{
                      duration: 0.7,
                      delay: colIdx * 0.1 + itemIdx * 0.15,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group relative w-full aspect-[6/9] rounded-[20px]  overflow-hidden bg-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.04] transition-all duration-500 hover:shadow-[0_14px_36px_rgba(0,0,0,0.08)]"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                    //   sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 320px"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Subtle hover shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}