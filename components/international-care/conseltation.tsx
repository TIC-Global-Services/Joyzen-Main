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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
};

export default function Consultation() {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, clientWidth } = scrollRef.current;
        if (clientWidth > 0) {
            const index = Math.round(scrollLeft / (clientWidth * 0.82));
            setActiveIndex(Math.min(Math.max(index, 0), consultationCards.length - 1));
        }
    };

    return (
        <section className="relative w-full py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden select-none">
            {/* Cards Container Grid / Mobile Slider */}
            <div className="w-full">
                <motion.div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={containerVariants}
                    className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-6 items-start overflow-x-auto sm:overflow-visible snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2 -mx-4 px-4 sm:mx-0 sm:px-0"
                >
                    {consultationCards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            variants={cardVariants}
                            className={`group relative shrink-0 w-[84vw] sm:w-full h-[460px] sm:h-[480px] lg:h-[510px] rounded-[28px] sm:rounded-[24px] overflow-hidden shadow-xl bg-zinc-900 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 snap-center ${card.isOffset ? 'lg:mt-14' : 'lg:mt-0'
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
                                <p className="mt-2.5 text-base text-zinc-300/90 font-normal leading-[1.2] max-w-[92%] drop-shadow-xs">
                                    {card.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Mobile Pagination Dots */}
                <div className="flex sm:hidden items-center justify-center gap-2 mt-6">
                    {consultationCards.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (scrollRef.current) {
                                    const cardWidth = scrollRef.current.clientWidth * 0.84;
                                    scrollRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
                                }
                            }}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-1 rounded-full transition-all duration-300 ${
                                index === activeIndex ? 'w-10 bg-[#EF8F60]' : 'w-10 bg-[#EF8F60]/10'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
