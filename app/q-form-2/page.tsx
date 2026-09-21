import React from 'react';
import type { Metadata } from 'next';
import QForm2View from '@/components/q-form-2/q-form-2-view';

export const metadata: Metadata = {
  title: 'Consultation Form | Connect with Doctor Specialists',
  description:
    'Schedule your personalized consultation with Joyzen doctors and longevity specialists. Fast, secure, and confidential medical guidance.',
  keywords: [
    'Joyzen Doctor Consultation',
    'Medical Consultation Booking',
    'Specialist Doctor Form',
    'Longevity Doctor Consultation India',
  ],
  alternates: {
    canonical: '/q-form-2',
  },
  openGraph: {
    title: 'Consultation Form | Joyzen Healthcare',
    description:
      'Schedule your personalized consultation with Joyzen doctors and longevity specialists.',
    url: 'https://joyzen.in/q-form-2',
    siteName: 'Joyzen',
    images: [
      {
        url: '/joyzen_logo.png',
        width: 1200,
        height: 630,
        alt: 'Joyzen Consultation Booking',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Consultation Form | Joyzen Healthcare',
    description:
      'Schedule your personalized consultation with Joyzen doctors and longevity specialists.',
    images: ['/joyzen_logo.png'],
  },
};

export default function QForm2Page() {
  return <QForm2View />;
}