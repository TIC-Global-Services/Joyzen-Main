import React from 'react';
import type { Metadata } from 'next';
import Hero from '@/components/plan-and-pricing/hero';
import CareRight from '@/components/plan-and-pricing/care-right';
import PricingForms from '@/components/plan-and-pricing/form';

export const metadata: Metadata = {
  title: 'Plans & Pricing | Transparent Healthcare Subscriptions',
  description:
    'Choose transparent, accessible healthcare membership plans. Connect with dedicated doctors, personalized health tracking, and continuous clinical support.',
  keywords: [
    'Joyzen Pricing',
    'Healthcare Plans',
    'Doctor Consultation Subscription',
    'Personalized Healthcare Plans',
    'Health Membership India',
  ],
  alternates: {
    canonical: '/plan-and-pricing',
  },
  openGraph: {
    title: 'Plans & Pricing | Joyzen Healthcare',
    description:
      'Choose transparent, accessible healthcare membership plans. Connect with dedicated doctors, personalized health tracking, and continuous clinical support.',
    url: 'https://joyzen.in/plan-and-pricing',
    siteName: 'Joyzen',
    images: [
      {
        url: '/joyzen_logo.png',
        width: 1200,
        height: 630,
        alt: 'Joyzen Plans and Pricing',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plans & Pricing | Joyzen Healthcare',
    description:
      'Choose transparent, accessible healthcare membership plans. Connect with dedicated doctors, personalized health tracking, and continuous clinical support.',
    images: ['/joyzen_logo.png'],
  },
};

const page = () => {
  return (
    <main className="min-h-screen relative flex flex-col w-full">
      <Hero />
      <CareRight />
      <PricingForms />
            <div className='h-20 w-full bg-[#fffcf7] absolute -bottom-[1%] md:bottom-[-0.8%] -left-[2%] z-10 blur-sm'></div>
     <div className='h-20 w-full bg-white absolute -bottom-[0.2%] hidden md:block  left-0 z-100 blur-lg'></div>
    </main>
  );
};

export default page;

