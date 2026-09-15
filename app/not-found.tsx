'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    /* Fullscreen solid white overlay covering Navbar, Footer & honeycomb grid */
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 select-none">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center my-auto">
        
        {/* Status Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-[#036132] bg-[#AEDEE433] border border-[#036132]/15 shadow-xs uppercase mb-6 tracking-tight"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF8F60] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF8F60]"></span>
          </span>
          Error 404 • Page Not Found
        </motion.div>

        {/* 404 Big Gradient Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative my-2"
        >
          <h1 className="text-8xl sm:text-9xl md:text-[160px] font-extrabold tracking-tighter text-transparent bg-clip-text bg-[#EF8F60] leading-none select-none">
            404
          </h1>
          {/* Floating heartbeat icon */}
          {/* <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-2 -right-4 sm:top-2 sm:-right-8 p-3 rounded-2xl bg-white border border-zinc-200 shadow-sm text-[#036132]"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.div> */}
        </motion.div>

        {/* Main Headline & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto space-y-3"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
            Looks like this page took a wellness break.
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-zinc-600 font-medium leading-relaxed">
            The link you followed may be broken, removed, or hasn&apos;t been prescribed yet. Let&apos;s guide you back to your health journey.
          </p>
        </motion.div>

        {/* Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 shadow-xs hover:shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-4 h-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>

          <Link
            href="/plan-and-pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore Plans & Pricing</span>
            <svg className="w-4 h-4 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>

        {/* Quick Links Bento Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-12 sm:mt-14 text-left"
        >
          {/* <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-center mb-6">
            Or explore popular destinations
          </p> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Our Vision */}
            {/* <Link
              href="/our-vision"
              className="group p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 hover:border-[#95C1E2] hover:bg-white shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#AEDEE4]/40 text-[#036132] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#036132] transition-colors">
                  Our Vision
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  How we are reimagining patient-first care.
                </p>
              </div>
              <span className="inline-flex items-center text-xs font-semibold text-zinc-400 group-hover:text-zinc-900 mt-4 transition-colors">
                Learn more &rarr;
              </span>
            </Link> */}

            {/* Card 2: Plans & Pricing */}
            {/* <Link
              href="/plans-and-pricing"
              className="group p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 hover:border-[#EF8F60] hover:bg-white shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#F6D7C6]/60 text-[#EF8F60] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#EF8F60] transition-colors">
                  Plans & Pricing
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Transparent options for every health journey.
                </p>
              </div>
              <span className="inline-flex items-center text-xs font-semibold text-zinc-400 group-hover:text-zinc-900 mt-4 transition-colors">
                View plans &rarr;
              </span>
            </Link> */}

            {/* Card 3: About */}
            {/* <Link
              href="/about"
              className="group p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 hover:border-[#D4B8DE] hover:bg-white shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#EEDEEF] text-[#8B5CF6] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#8B5CF6] transition-colors">
                  About Joyzen
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Our doctors, clinical team, and philosophy.
                </p>
              </div>
              <span className="inline-flex items-center text-xs font-semibold text-zinc-400 group-hover:text-zinc-900 mt-4 transition-colors">
                Meet the team &rarr;
              </span>
            </Link> */}

            {/* Card 4: Community */}
            {/* <Link
              href="/community"
              className="group p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 hover:border-[#95C1E2] hover:bg-white shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#B6E1FA]/50 text-[#0284C7] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#0284C7] transition-colors">
                  Community
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Support networks and health resources.
                </p>
              </div>
              <span className="inline-flex items-center text-xs font-semibold text-zinc-400 group-hover:text-zinc-900 mt-4 transition-colors">
                Explore &rarr;
              </span>
            </Link> */}
          </div>
        </motion.div>

      </div>
    </div>
  );
}