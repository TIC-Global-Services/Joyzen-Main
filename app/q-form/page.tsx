import React from 'react';
import type { Metadata } from 'next';
import ExploreForm from '@/components/forms/exploreform';

export const metadata: Metadata = {
  title: 'Get Started | Personalized Health Assessment',
  description:
    'Begin your journey with Joyzen. Share your wellness goals and health priorities to connect with tailored doctor consultations and care plans.',
  keywords: [
    'Joyzen Health Assessment',
    'Get Started Healthcare India',
    'Personalized Health Plan Form',
    'Doctor Consultation Booking',
  ],
  alternates: {
    canonical: '/q-form',
  },
  openGraph: {
    title: 'Get Started | Joyzen Health Assessment',
    description:
      'Begin your journey with Joyzen. Share your wellness goals to connect with tailored doctor consultations and care plans.',
    url: 'https://joyzen.in/q-form',
    siteName: 'Joyzen',
    images: [
      {
        url: '/joyzen_logo.png',
        width: 1200,
        height: 630,
        alt: 'Get Started with Joyzen',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Started | Joyzen Health Assessment',
    description:
      'Begin your journey with Joyzen. Share your wellness goals to connect with tailored doctor consultations and care plans.',
    images: ['/joyzen_logo.png'],
  },
};

const QFormPage = () => {
  return (
    <main className="min-h-screen relative">
      <ExploreForm />
    </main>
  );
};

export default QFormPage;