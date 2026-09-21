import React from 'react';
import type { Metadata } from 'next';
import AboutHeroSection from '@/components/about/AboutHeroSection';
import AboutMobileSection from '@/components/about/AboutMobileSection';
import SuperPowerSection from '@/components/about/superPower';
import DesignedForToday from '@/components/about/designedForToday';
import LetsJoin from '@/components/about/letsJoin';

export const metadata: Metadata = {
  title: 'About Us | Care The Way Life Actually Happens',
  description:
    'Discover Joyzen’s mission to connect care, health guidance, doctor support, and modern longevity medicine into one seamless experience.',
  keywords: [
    'About Joyzen',
    'Joyzen Healthcare Mission',
    'Personalized Medicine',
    'Doctor Guided Care',
    'Longevity Platform India',
    'Healthcare Innovation',
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Joyzen | Care The Way Life Actually Happens',
    description:
      'Discover Joyzen’s mission to connect care, health guidance, doctor support, and modern longevity medicine into one seamless experience.',
    url: 'https://joyzen.in/about',
    siteName: 'Joyzen',
    images: [
      {
        url: '/joyzen_logo.png',
        width: 1200,
        height: 630,
        alt: 'About Joyzen Healthcare',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Joyzen | Care The Way Life Actually Happens',
    description:
      'Discover Joyzen’s mission to connect care, health guidance, doctor support, and modern longevity medicine into one seamless experience.',
    images: ['/joyzen_logo.png'],
  },
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen flex flex-col w-full selection:bg-[#EF8F60]/20 selection:text-[#EF8F60]">

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
        <LetsJoin />
      </main>
      <div className="h-20 w-full bg-[#f2f1f0] absolute bottom-0 translate-y-1/2 left-0 z-40 blur-sm pointer-events-none"></div>
    </div>
  );
}