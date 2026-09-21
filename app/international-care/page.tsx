import React from 'react';
import type { Metadata } from 'next';
import Hero from '@/components/international-care/hero';
import Appointment from '@/components/international-care/appointment';
import Consultation from '@/components/international-care/conseltation';
import FAQ from '@/components/international-care/faq';
import StartYourHealth from '@/components/international-care/startYourHealth';

export const metadata: Metadata = {
  title: 'International Care | Global Patient Support & Consultations',
  description:
    'Access world-class Indian medical specialists and seamless cross-border clinical support. Teleconsultations, treatment planning, and medical travel coordination.',
  keywords: [
    'International Patient Care India',
    'Global Telehealth Consultations',
    'Indian Specialist Doctors',
    'Medical Tourism India Joyzen',
    'Cross-Border Healthcare Support',
  ],
  alternates: {
    canonical: '/international-care',
  },
  openGraph: {
    title: 'International Care | Joyzen Global Health Support',
    description:
      'Access world-class Indian medical specialists and seamless cross-border clinical support with Joyzen.',
    url: 'https://joyzen.in/international-care',
    siteName: 'Joyzen',
    images: [
      {
        url: '/internation-care-hero.png',
        width: 1200,
        height: 630,
        alt: 'Joyzen International Healthcare',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'International Care | Joyzen Global Health Support',
    description:
      'Access world-class Indian medical specialists and seamless cross-border clinical support with Joyzen.',
    images: ['/internation-care-hero.png'],
  },
};

export default function InternationalCarePage() {
  return (
    <main className="relative w-full min-h-screen flex flex-col">
      <Hero />
      <Appointment />
      <Consultation />
      <FAQ />
      <StartYourHealth/>
      <div className="h-16 w-full bg-[#f2f1f0] absolute bottom-0 translate-y-1/2 left-0 z-40 blur-sm pointer-events-none"></div>
    </main>
  );
}



