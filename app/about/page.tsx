import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/reuseable/Navbar';
import Footer from '@/reuseable/Footer';
import AboutHeroSection from '@/components/about/AboutHeroSection';
import AboutMobileSection from '@/components/about/AboutMobileSection';
import SuperPowerSection from '@/components/about/superPower';
import DesignedForToday from '@/components/about/designedForToday';
import LetsJoin from '@/components/about/letsJoin';

export const metadata: Metadata = {
  title: 'About | Joyzen - Care The Way Life Actually Happens',
  description:
    'Joyzen brings your care, your health information, your guidance and your support into one connected experience.',
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen flex flex-col w-full selection:bg-[#EF8F60]/20 selection:text-[#EF8F60] overflow-x-hidden">

      {/* 5 About Components */}
      <main className="flex-1 flex flex-col w-full">
        {/* Component 1: Hero ("You Stay On That Couch...") */}
        <AboutHeroSection />

        {/* Component 2: Mobile App Showcase + Narrative Copy */}
        <AboutMobileSection />

        {/* Component 3: Superpowers 11-Card Grid */}
        <SuperPowerSection />

        {/* Component 4: Tomorrow's Healthcare & 3D Robot */}
        <DesignedForToday />

        {/* Component 5: Let's Join – Scroll Image Sequence */}
        {/* <LetsJoin /> */}
      </main>
      <div className="h-16 w-full bg-[#fcf9f2] absolute bottom-0 translate-y-1/2 left-0 z-40 blur-sm pointer-events-none"></div>
    </div>
  );
}