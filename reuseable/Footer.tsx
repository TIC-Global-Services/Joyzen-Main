'use client';

import React, { useState, useEffect } from 'react';

export default function Footer() {
  // Pick the correct video for the device — client-side check avoids SSR mismatch.
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (window.innerWidth < 640) {
      setVideoSrc('/joyzenfooterMobile.mp4');
    } else {
      setVideoSrc('/joyzen_glass_footer.mp4');
    }
  }, []);

  return (
    <footer className="relative w-full h-[50svh] sm:h-[60svh] md:h-[40dvh] lg:h-[90svh] bg-gradient-to-r from-transparent via-[#D1E0EC] to-[#A9BFCF] flex flex-col justify-between p-8 sm:p-10 lg:p-[4rem] overflow-hidden text-black select-none font-epilogue">
      {/* Background Video — single stream, source chosen by device at mount */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 8%, black 22%, black 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 8%, black 22%, black 100%)',
        }}
      >
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

      {/* Top Header Contact & Social Links */}
      <div className="flex flex-wrap justify-center pl-6 sm:pl-0  gap-6 sm:gap-12 text-xs sm:text-sm lg:text-base font-medium relative z-50 tracking-tight md:mb-10">
        <a href="mailto:info@joyzen.in" className="hover:opacity-60 transition-opacity">Email: info@joyzen.in</a>
        <a href="tel:+911244962743" className="hover:opacity-60 transition-opacity">Phone: <span className="whitespace-nowrap">+91 124-4962743</span></a>
        <a href="https://www.instagram.com/joyzen.in" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">Instagram: @joyzen.in</a>
      </div>

      {/* Top fade overlap for smooth background transition */}
      <div
        className="absolute z-20 left-0 w-full h-[35%] pointer-events-none"
        style={{
          top: '-2px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.35) 45%, rgba(255, 255, 255, 0) 100%)'
        }}
      />

      {/* Bottom fade for mobile video */}
      <div
        className="absolute bottom-0 z-20 left-0 w-full h-[25%] pointer-events-none sm:hidden"
        style={{
          background: 'linear-gradient(to top, rgba(169, 191, 207, 1) 0%, rgba(169, 191, 207, 0.3) 50%, rgba(169, 191, 207, 0) 100%)'
        }}
      />

      {/* Bottom Tagline & Credits Bar */}
      <div className="flex px-[10%] md:px-[5%] text-xs lg:text-sm text-black flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 relative z-50 w-full">
        <span className="text-center sm:text-left">2026 Joyzen. Built for life. Designed for longevity.</span>
        <span className="text-center sm:text-right">Designed and Developed by TIC Global Services</span>
      </div>
    </footer>
  );
}


