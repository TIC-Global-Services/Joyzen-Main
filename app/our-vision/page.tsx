import React from 'react';
import type { Metadata } from 'next';
import Hero from '@/components/ourVision/hero';
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
      <HereItFrom />
      <Represents />
      <Epharmacy />
      <div className='h-20 w-full bg-[#fffcf7] absolute -bottom-[1%] md:bottom-[-0.8%] -left-[2%] z-10 blur-sm'></div>
      <div className='h-20 w-full bg-white absolute -bottom-[0.2%] hidden md:block  left-0 z-100 blur-lg'></div>
    </main>
  );
};

export default page;
