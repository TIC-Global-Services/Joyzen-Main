import React from 'react';
import type { Metadata } from 'next';
import Hero from '@/components/ourVision/hero';
import OnePlace from '@/components/ourVision/onePlace';
import HereItFrom from '@/components/ourVision/hereItFrom';
import Epharmacy from '@/components/ourVision/e-pharmacy';
import Represents from '@/components/ourVision/represents';

export const metadata: Metadata = {
  title: 'Our Vision | Reimagining Patient-First Healthcare',
  description:
    'Explore Joyzen’s vision for the future of healthcare—combining personalized medicine, connected health records, smart e-pharmacy, and proactive wellness.',
  keywords: [
    'Joyzen Vision',
    'Future of Healthcare',
    'Patient-First Medicine',
    'Connected Health Records',
    'Preventive Healthcare Model',
    'E-Pharmacy Platform',
  ],
  alternates: {
    canonical: '/our-vision',
  },
  openGraph: {
    title: 'Our Vision | Joyzen - Reimagining Patient-First Healthcare',
    description:
      'Explore Joyzen’s vision for the future of healthcare—combining personalized medicine, connected health records, smart e-pharmacy, and proactive wellness.',
    url: 'https://joyzen.in/our-vision',
    siteName: 'Joyzen',
    images: [
      {
        url: '/joyzen_logo.png',
        width: 1200,
        height: 630,
        alt: 'Joyzen Vision - Healthcare Reimagined',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Vision | Joyzen - Reimagining Patient-First Healthcare',
    description:
      'Explore Joyzen’s vision for the future of healthcare—combining personalized medicine, connected health records, smart e-pharmacy, and proactive wellness.',
    images: ['/joyzen_logo.png'],
  },
};

const page = () => {
  return (
    <main className="relative flex-1 flex flex-col w-full">
      <Hero />
      <OnePlace />
      <HereItFrom />
      <Represents/>
      <Epharmacy />
      <div className="h-16 w-full bg-[#f2f1f0] absolute bottom-0 translate-y-1/2 left-0 z-40 blur-sm pointer-events-none"></div>
    </main>
  );
};

export default page;
