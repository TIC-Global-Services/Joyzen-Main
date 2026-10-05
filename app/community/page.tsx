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
      <BigDeal />
      <div className='h-20 w-full bg-[#fffcf7] absolute -bottom-[1%] md:bottom-[-0.8%] -left-[2%] z-10 blur-sm'></div>
      <div className='h-20 w-full bg-white absolute -bottom-[0.2%] hidden md:block  left-0 z-100 blur-lg'></div>
    </div>
  )
}

export default page