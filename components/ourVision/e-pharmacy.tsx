'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Epharmacy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        {
          scale: 0.65,
          opacity: 1,
          y: 60,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'center center',
            scrub: 1.2,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const marqueeText = 'Expert Care. Personalised Medicines. Better Results. · ';

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 md:py-36 overflow-hidden flex items-center justify-center select-none"
    >
      {/* Background Infinite Marquee */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 opacity-90">
        <div className="flex whitespace-nowrap will-change-transform animate-e-pharmacy-marquee">
          <span className="text-4xl sm:text-6xl md:text-7xl lg:text-[96px] xl:text-[110px] font-bold tracking-tight text-black leading-none px-4">
            {marqueeText.repeat(4)}
          </span>
          <span className="text-4xl sm:text-6xl md:text-7xl lg:text-[96px] xl:text-[110px] font-bold tracking-tight text-black leading-none px-4">
            {marqueeText.repeat(4)}
          </span>
        </div>
      </div>

      {/* Main Scalable Card Container */}
      <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl px-4 sm:px-8">
        <div
          ref={cardRef}
          className="relative w-full aspect-[3/4] sm:aspect-[16/9] rounded-[30px] overflow-hidden shadow-2xl border border-white/20 bg-zinc-900 will-change-transform"
        >
          {/* Main Pharmacy Lab Image */}
          <Image
            src="/e-pharmacy.png"
            alt="E-Pharmacy at your door-step"
            fill
            priority
            className="object-cover object-center"
          />

          {/* Subtle Ambient Vignette Overlay for Crisp Legibility */}
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />

          {/* Centered Headline */}
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center pointer-events-none">
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              E-Pharmacy at your door-step
            </h3>
          </div>

          {/* Bottom Right Magic Action Icon Button */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20">
            <button
              type="button"
              aria-label="E-Pharmacy details"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/5 hover:bg-white/90 backdrop-blur-[2px] border border-white/40 shadow-lg flex items-center justify-center text-white transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-none stroke-current"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Magic wand / sparkle cursor icon */}
                <path d="M15 4V2" />
                <path d="M15 16v-2" />
                <path d="M8 9h2" />
                <path d="M20 9h2" />
                <path d="m17.8 11.8 1.4 1.4" />
                <path d="m15 9 6-6" />
                <path d="m20.8 4.8 1.4-1.4" />
                <path d="m3 21 9-9" />
                <path d="M12.2 6.2 11 5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Marquee Animation Styles */}
      <style jsx global>{`
        @keyframes ePharmacyMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-e-pharmacy-marquee {
          animation: ePharmacyMarquee 28s linear infinite;
        }
        .animate-e-pharmacy-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}