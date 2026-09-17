'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'Can I consult from any country?',
    answer: 'Yes, Joyzen provides virtual consultations for patients living anywhere around the world with flexible scheduling across global time zones.',
  },
  {
    id: 2,
    question: 'Do I need medical records?',
    answer: 'Having prior medical records or reports helps our specialists provide more tailored guidance, though you can also start with an initial consultation.',
  },
  {
    id: 3,
    question: 'How are follow-ups managed?',
    answer: 'Follow-ups are conducted through scheduled online consultations and digital communication.',
  },
  {
    id: 4,
    question: 'Which languages are supported?',
    answer: 'Consultations are conducted in English, Hindi, and multiple regional languages to ensure clear and comfortable healthcare discussions.',
  },
];

export default function FAQ() {
  // Default open question 3 to match the screenshot or keep track of active id
  const [openId, setOpenId] = useState<number | null>(3);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="relative w-full py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden select-none">
      {/* Honeycomb Background Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='97' viewBox='0 0 56 97' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 0L56 16.1658V48.4974L28 64.6632L0 48.4974V16.1658L28 0Z M28 97L0 80.8342V48.4974L28 64.6632L56 48.4974V80.8342L28 97Z' stroke='%23DCD6C5' stroke-width='0.75' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 97px',
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2rem] sm:text-4xl md:text-[40px] font-bold text-[#111111] tracking-tight text-center leading-tight"
        >
          Frequently Asked Questions
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3.5 sm:mt-4 text-base sm:text-lg text-black font-normal text-center leading-[1.2] max-w-3xl"
        >
          Discover personalized care programs designed around your journey, with structured<br className=' hidden sm:block'/>
          guidance, continuous support, and plans that adapt as you progress.
        </motion.p>

        {/* Glassmorphic FAQ Accordion List */}
        <div className="w-full max-w-3xl mt-10 sm:mt-14 space-y-4 sm:space-y-5">
          {faqData.map((item, index) => {
            const isOpen = openId === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full rounded-[28px] sm:rounded-[36px] bg-white/5 backdrop-blur-xs border border-white/80 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] "
              >
                {/* Header Button */}
                <button
                  onClick={() => toggleFAQ(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-center md:justify-between px-2 sm:px-9 py-5 sm:py-6 text-left transition-colors duration-200"
                >
                  <span className="text-base text-center sm:text-xl font-bold text-[#111111] tracking-tight pr-4 md:text-left">
                    {item.question}
                  </span>
                  
                  {/* Desktop Icon Indicator (Simple Plus +) */}
                  <div className="hidden sm:flex sm:shrink-0 w-6 h-6 items-center justify-center text-zinc-700">
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="text-xl sm:text-2xl font-light leading-none select-none"
                    >
                      +
                    </motion.span>
                  </div>

                  {/* Mobile Icon Indicator (Circled Plus (+) like image) */}
                  <div className="flex sm:hidden shrink-0 w-4 h-4 items-center translate-x-5 justify-end text-black">
                    <motion.svg
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="9.5" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </motion.svg>
                  </div>
                </button>

                {/* Animated Expandable Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-9 pb-6 sm:pb-7 pt-0 text-xs sm:text-sm text-left md:text-base text-black font-medium leading-[1.2]">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
