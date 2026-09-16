'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import AppointmentsWidget from '@/components/shared/AppointmentsWidget';

// Dynamically import 3D Canvas with ssr: false for SSR safety
const HeroRobotCanvas = dynamic(() => import('./HeroRobotCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center min-h-[200px]">
      <div className="w-6 h-6 border-2 border-[#036132] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function CommunityHeroShowcase() {
  return (
    <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-1 sm:gap-3 md:gap-0 select-none">
      {/* 3D Interactive Robot Model Container (Left on desktop, Top on mobile) */}
      <div className="w-full md:w-[36%] lg:w-[35%] h-[240px] sm:h-[300px] md:h-[360px] lg:h-[400px] shrink-0 relative flex items-center justify-center z-10 -mb-4 md:mb-0 md:-mr-4 lg:-mr-20">
        <HeroRobotCanvas className="w-full h-full pointer-events-auto" />
      </div>

      {/* Interactive Appointments Calendar Widget (Right on desktop, Bottom on mobile) */}
      <div className="w-full md:w-[64%] lg:w-[65%] min-w-0 z-0">
        <AppointmentsWidget />
      </div>
    </div>
  );
}
