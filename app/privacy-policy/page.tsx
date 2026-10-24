import React from 'react';
import type { Metadata } from 'next';
import PrivacyPolicyClient from '@/components/privacy-policy/PrivacyPolicyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | Joyzen',
  description:
    'Privacy Policy of Joyzen Integrated Health Systems PVT LTD. Learn how we safeguard your personal health information, our DPDP Act 2023 compliance, and Grievance Officer contact details.',
  keywords: [
    'Privacy Policy Joyzen',
    'DPDP Act 2023 Compliance',
    'Health Data Privacy India',
    'Grievance Officer Privacy Contact',
    'Joyzen Data Protection',
    'Patient Confidentiality',
  ],
  alternates: {
    canonical: '/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Joyzen',
    description:
      'Privacy Policy of Joyzen Integrated Health Systems PVT LTD. Learn how we safeguard your personal health information and DPDP Act 2023 compliance.',
    url: 'https://joyzen.in/privacy-policy',
    siteName: 'Joyzen',
    images: [
      {
        url: '/joyzen_logo.png',
        width: 1200,
        height: 630,
        alt: 'Joyzen Privacy Policy',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Joyzen',
    description:
      'Privacy Policy of Joyzen Integrated Health Systems PVT LTD. DPDP Act 2023 compliance and Grievance Officer contact.',
    images: ['/joyzen_logo.png'],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="relative flex-1 flex flex-col w-full selection:bg-[#EF8F60]/20 selection:text-[#EF8F60]">
      <PrivacyPolicyClient />
      <div className="h-20 w-full bg-[#fffcf7] absolute -bottom-[1%] md:bottom-[-0.8%] -left-[2%] z-10 blur-sm pointer-events-none" />
      <div className="h-20 w-full bg-white absolute -bottom-[0.2%] hidden md:block left-0 z-100 blur-lg pointer-events-none" />
    </main>
  );
}
