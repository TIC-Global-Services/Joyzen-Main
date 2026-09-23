import React from 'react';
import type { Metadata } from 'next';
import Hero from '@/components/community/Hero';
import YourPeople from '@/components/community/yourPeople';
import TrustedBy from '@/components/community/trustedBy';
import Reviews from '@/components/community/reviews';
import Gallery from '@/components/community/gallery';
import BigDeal from '@/components/community/bigDeal';

export const metadata: Metadata = {
  title: 'Community | Real Stories & Health Mentorship',
  description:
    'Join the Joyzen patient and wellness community. Read authentic patient reviews, inspiring recovery journeys, and explore health mentorship resources.',
  keywords: [
    'Joyzen Community',
    'Patient Reviews Joyzen',
    'Health Community India',
    'Wellness Stories',
    'Doctor Mentorship',
  ],
  alternates: {
    canonical: '/community',
  },
  openGraph: {
    title: 'Community | Joyzen Patient Stories & Wellness',
    description:
      'Join the Joyzen patient and wellness community. Read authentic patient reviews, inspiring recovery journeys, and explore health mentorship resources.',
    url: 'https://joyzen.in/community',
    siteName: 'Joyzen',
    images: [
      {
        url: '/joyzen_logo.png',
        width: 1200,
        height: 630,
        alt: 'Joyzen Community and Reviews',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community | Joyzen Patient Stories & Wellness',
    description:
      'Join the Joyzen patient and wellness community. Read authentic patient reviews, inspiring recovery journeys, and explore health mentorship resources.',
    images: ['/joyzen_logo.png'],
  },
};

const page = () => {
  return (
    <div className="relative w-full flex flex-col">
      <Hero />
      <YourPeople />
      <TrustedBy />
      <Reviews />
      <Gallery />
      <BigDeal/>
      <div className="h-20 w-full bg-[#f2f1f0] absolute bottom-0 translate-y-1/2 left-0 z-40 blur-sm pointer-events-none"></div>
    </div>
  )
}

export default page