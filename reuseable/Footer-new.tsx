'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Footer = () => {
  // Pick the correct video for the device — do it client-side to avoid SSR mismatch.
  // Default to null so no video is fetched until the client-side device check runs.
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (window.innerWidth < 640) {
      setVideoSrc('/joyzenfooterMobile.mp4');
    } else {
      setVideoSrc('/joyzen_glass_footer.mp4');
    }
  }, []);

  return (
    <footer className="relative w-full h-[50svh] sm:h-[60svh] lg:h-[90svh] bg-gradient-to-r from-[#EBF3F8] via-[#D1E0EC] to-[#A9BFCF] flex flex-col justify-between p-8 sm:p-10 lg:p-[4rem] overflow-hidden">
      {/* Background Video — single stream, source chosen by device at mount */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="relative w-full h-full">
          {videoSrc && (
            <video
              key={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>

      {/* Top row (Shifted slightly to the right on mobile using pl-6) */}
      <div className="flex justify-center pl-6 sm:pl-0 sm:justify-end gap-6 sm:gap-12 text-xs sm:text-sm lg:text-base font-sans font-medium  relative z-10 tracking-tight md:mb-10  ">
        <a href="mailto:info@joyzen.in" className="hover:opacity-60 transition-opacity">Email: info@joyzen.in</a>
        <a href="tel:+911244962743" className="hover:opacity-60 transition-opacity">Phone: <span className="whitespace-nowrap">+91 124-4962743</span></a>
        <a href="https://www.instagram.com/joyzen.in" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">Instagram: @joyzen.in</a>
      </div>

      {/* Top fade (Fixed: top-[-2px] overlap and native CSS rgba() gradient to ensure full compatibility) */}
      <div
        className="absolute z-40 left-0 w-full h-[35%] pointer-events-none"
        style={{
          top: '-2px',
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.35) 50%, rgba(255, 255, 255, 0) 100%)'
        }}
      />

      {/* Bottom fade for mobile video (Fixed: native CSS rgba() gradient to ensure full compatibility) */}
      <div
        className="absolute bottom-0 z-40 left-0 w-full h-[25%] pointer-events-none sm:hidden"
        style={{
          background: 'linear-gradient(to top, rgba(169, 191, 207, 1) 0%, rgba(169, 191, 207, 0.3) 50%, rgba(169, 191, 207, 0) 100%)'
        }}
      />



      <div className='flex px-[10%] md:px-[5%] text-xs md:text-sm text-black flex-col absolute bottom-[8%] md:bottom-[5%] z-40 left-0 w-full sm:flex-row justify-center items-center md:justify-between'>
        <span className="text-center sm:text-left">2026 Joyzen. Built for life. Designed for longevity.</span>
      </div>
    </footer>
  );
}

export default Footer;