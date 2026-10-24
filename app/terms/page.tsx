import React from 'react';
import type { Metadata } from 'next';
import TermsPageClient from '@/components/terms/TermsPageClient';

export const metadata: Metadata = {
  title: 'Terms & Conditions (Users, Clinics & Staff) | Joyzen',
  description:
    'Terms and Conditions for Patients, Partner Clinics, Doctors, and Healthcare Staff of Joyzen Integrated Health Systems PVT LTD. Includes statutory Grievance Redressal mechanism.',
  keywords: [
    'Joyzen Terms and Conditions',
    'Clinic Terms Joyzen',
    'Healthcare Staff Agreement',
    'Patient Terms of Service',
    'Grievance Redressal Mechanism',
    'DPDP Act Compliance India',
  ],
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms & Conditions (Users, Clinics & Staff) | Joyzen',
    description:
      'Terms and Conditions for Patients, Partner Clinics, Doctors, and Healthcare Staff of Joyzen Integrated Health Systems PVT LTD.',
    url: 'https://joyzen.in/terms',
    siteName: 'Joyzen',
    images: [
      {
        url: '/joyzen_logo.png',
        width: 1200,
        height: 630,
        alt: 'Joyzen Terms & Conditions',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms & Conditions | Joyzen',
    description:
      'Terms and Conditions for Patients, Partner Clinics, Doctors, and Healthcare Staff of Joyzen Integrated Health Systems PVT LTD.',
    images: ['/joyzen_logo.png'],
  },
};

export default function TermsPage() {
  return (
    <main className="relative flex-1 flex flex-col w-full selection:bg-[#EF8F60]/20 selection:text-[#EF8F60]">
      <TermsPageClient />
      <div className="h-20 w-full bg-[#fffcf7] absolute -bottom-[1%] md:bottom-[-0.8%] -left-[2%] z-10 blur-sm pointer-events-none" />
      <div className="h-20 w-full bg-white absolute -bottom-[0.2%] hidden md:block left-0 z-100 blur-lg pointer-events-none" />
    </main>
  );
}
