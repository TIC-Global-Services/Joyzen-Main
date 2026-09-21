import React from 'react';
import type { Metadata } from 'next';
import HeroSection from '@/components/Home/HeroSection';
import ConnectedExperienceSection from '@/components/Home/ConnectedExperienceSection';
import DashboardShowcaseSection from '@/components/Home/DashboardShowcaseSection';
import DoctorPatientSection from '@/components/Home/DoctorPatientSection';
import CareReimaginedSection from '@/components/Home/CareReimaginedSection';

export const metadata: Metadata = {
  title: 'Joyzen | Care The Way Life Actually Happens',
  description:
    'Joyzen brings your care, medical history, clinical guidance, and doctor support into one connected healthcare platform built for life and longevity.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Joyzen | Care The Way Life Actually Happens',
    description:
      'Joyzen connects your care, your health information, guidance, and doctor support into one unified experience.',
    url: 'https://joyzen.in',
    siteName: 'Joyzen',
    images: [
      {
        url: '/joyzen_logo.png',
        width: 1200,
        height: 630,
        alt: 'Joyzen Home - Healthcare Reimagined',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joyzen | Care The Way Life Actually Happens',
    description:
      'Joyzen connects your care, your health information, guidance, and doctor support into one unified experience.',
    images: ['/joyzen_logo.png'],
  },
};

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col w-full selection:bg-[#036132]/20 selection:text-[#036132]">
      
      {/* 5 Home Sections */}
      <main className="flex-1 flex flex-col w-full">
        {/* Component 1: Hero */}
        <HeroSection />

        {/* Component 2: Connected Experience Banner */}
        <ConnectedExperienceSection />

        {/* Component 3: Bento Dashboard Showcase */}
        <DashboardShowcaseSection />

        {/* Component 4: Doctor-Patient Connection with Sequential Badges */}
        <DoctorPatientSection />

        {/* Component 5: Care Reimagined Climax */}
        <CareReimaginedSection />
      </main>
     <div className='h-16 w-full bg-[#f0f0f0] absolute -bottom-[0.5%] left-0 z-100 blur-lg'></div>
     
    </div>
  );
}
