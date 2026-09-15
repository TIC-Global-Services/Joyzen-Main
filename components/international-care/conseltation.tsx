'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SpecularButton from '@/reuseable/specularButton';

interface CardItem {
    id: number;
    title: string;
    description: string;
    image: string;
    isOffset: boolean;
    objectPosition:string;
}

const consultationCards: CardItem[] = [
    {
        id: 1,
        title: 'Indian Specialists',
        description: 'Access Experienced Healthcare Professionals Across Multiple Specialties.',
        image: '/indian-specialist.png',
        isOffset: false,
        objectPosition:"object-right"
    },
    {
        id: 2,
        title: 'Personalised Care',
        description: 'Treatment Plans Tailored To Your Individual Health Needs.',
        image: '/personalised-care.png',
        isOffset: true,
        objectPosition:""
    },
    {
        id: 3,
        title: 'Secure Online Consultations',
        description: 'Consult From Anywhere Through Safe And Convenient Virtual Appointments.',
        image: '/secure-online.png',
        isOffset: false,
        objectPosition:"object-right"
    },
    {
        id: 4,
        title: 'Continuous Support',
        description: 'Receive Follow-Ups And Ongoing Care Beyond Your Consultation.',
        image: '/continues-support.png',
        isOffset: true,
        objectPosition:""
    },
];

export default function Consultation() {
    return (
        <section className="relative w-full py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden select-none">
            {/* Cards Container Grid */}
            <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 items-start">
                    {consultationCards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 35 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className={`group relative w-full h-[460px] sm:h-[480px] lg:h-[510px] rounded-[28px] sm:rounded-[24px] overflow-hidden shadow-xl bg-zinc-900 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${card.isOffset ? 'lg:mt-14' : 'lg:mt-0'
                                }`}
                        >
                            {/* Card Image */}
                            <Image
                                src={card.image}
                                alt={card.title}
                                fill
                                priority={index < 2}
                                className={`object-cover ${card.objectPosition} transition-transform duration-700 ease-out group-hover:scale-105`}
                            />

                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-95" />

                            {/* Card Text Content (Bottom Left) */}
                            <div className="absolute bottom-6 inset-x-0 p-6 sm:p-7 flex flex-col justify-end z-10 text-left">
                                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none drop-shadow-sm">
                                    {card.title}
                                </h3>
                                <p className="mt-2.5 text-xs sm:text-base text-zinc-300/90 font-normal leading-[1.2] max-w-[92%] drop-shadow-xs">
                                    {card.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>


            </div>
        </section>
    );
}
