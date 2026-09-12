'use client';

import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden text-black select-none font-epilogue">
      {/* Dynamic gradient background with top ambient glow and smooth fade transition */}
      <div
        className="absolute -top-10 inset-0 pointer-events-none z-0"
        style={{
          background: `
            /* Top glowing gradients: warm peach center echoing the 3D honeycomb, soft sky blue and lavender accents */
            radial-gradient(ellipse 65% 55% at 50% 0%, rgba(246, 215, 198, 0.7) 0%, rgba(238, 222, 248, 0.45) 40%, transparent 75%),
            radial-gradient(ellipse 55% 50% at 0% 0%, rgba(182, 225, 250, 0.85) 0%, rgba(198, 233, 253, 0.35) 45%, transparent 75%),
            radial-gradient(ellipse 55% 50% at 100% 0%, rgba(182, 225, 250, 0.85) 0%, rgba(198, 233, 253, 0.35) 45%, transparent 75%),
            /* Bottom glowing gradients */
            radial-gradient(ellipse 60% 70% at 0% 100%, rgba(182, 225, 250, 0.95) 0%, rgba(198, 233, 253, 0.5) 45%, transparent 75%),
            radial-gradient(ellipse 60% 70% at 100% 100%, rgba(182, 225, 250, 0.95) 0%, rgba(198, 233, 253, 0.5) 45%, transparent 75%),
            radial-gradient(ellipse 70% 60% at 50% 100%, rgba(238, 222, 248, 0.85) 0%, rgba(244, 232, 251, 0.4) 50%, transparent 80%),
            /* Base vertical clean gradient */
            linear-gradient(to bottom, #ffffff 0%, #ffffff 35%, #ffffff 75%, #F6F1F9 100%)
          `,
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.25) 12px, rgba(0, 0, 0, 0.8) 65px, black 115px)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.25) 12px, rgba(0, 0, 0, 0.8) 65px, black 115px)',
        }}
      />

      <div className="relative z-20 px-6 sm:px-12 md:px-16 pt-16 sm:pt-20 pb-8 sm:pb-12  flex flex-col items-center">
        {/* Top Header Contact & Social Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14 text-xs sm:text-[14px] md:text-sm font-medium text-black tracking-tight">
          <a
            href="mailto:info@joyzenlife.com"
            className="hover:opacity-70 transition-opacity"
          >
            Email: info@joyzenlife.com
          </a>
          <a
            href="https://instagram.com/joyzen.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            Instagram: @joyzen.in
          </a>
        </div>

        {/* Centerpiece: 3D Glassy Joyzen Logo */}
        <div className="w-full flex justify-center items-center my-8 sm:my-14">
          <div className="relative w-full h-[250px] w-[500px] px-4 flex justify-center">
            <Image
              src="/footer_jozen.png"
              alt="Joyzen"
              fill
              className="w-full h-full object-contain select-none pointer-events-none drop-shadow-sm"
            />
          </div>
        </div>

        {/* Bottom Tagline & Credits Bar */}
        <div className="w-full flex flex-col  sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-[14px] md:text-base font-medium text-black tracking-tight">
          <p className="text-center sm:text-left">
            2026 Joyzen. Built for healthcare. Designed for trust.
          </p>
          <p className="text-center sm:text-right">
            Designed and Developed by TIC Global Services
          </p>
        </div>
      </div>
    </footer>
  );
}


