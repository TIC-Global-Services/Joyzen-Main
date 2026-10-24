import React from 'react';
import type { Metadata } from 'next';
import GrievancePageClient from '@/components/grievance/GrievancePageClient';

export const metadata: Metadata = {
  title: 'Grievance Redressal & Privacy Contact | Joyzen',
  description:
    'Official Grievance Officer and Privacy Contact for Joyzen Integrated Health Systems PVT LTD under the DPDP Act 2023 and IT Rules 2021. Resolution within 15 days.',
  keywords: [
    'Grievance Redressal Joyzen',
    'Grievance Officer Joyzen',
    'Kushal Bhardwaj',
    'Privacy Contact Joyzen',
    'DPDP Act Compliance India',
    'Data Protection Board of India',
    'Healthcare Grievance Ludhiana',
    'Patient Data Rights Joyzen',
  ],
  alternates: {
    canonical: '/grievance-redressal',
  },
  openGraph: {
    title: 'Grievance Redressal & Privacy Contact | Joyzen',
    description:
      'Official Grievance Officer and Privacy Contact details for Joyzen Integrated Health Systems PVT LTD. 24-hour acknowledgment and 15-day resolution.',
    url: 'https://joyzen.in/grievance-redressal',
    siteName: 'Joyzen',
    images: [
      {
        url: '/joyzen_logo.png',
        width: 1200,
        height: 630,
        alt: 'Joyzen Grievance Redressal & Privacy Contact',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grievance Redressal & Privacy Contact | Joyzen',
    description:
      'Official Grievance Officer and Privacy Contact for Joyzen Integrated Health Systems PVT LTD under DPDP Act 2023.',
    images: ['/joyzen_logo.png'],
  },
};

export default function GrievanceRedressalPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Joyzen Grievance Redressal & Privacy Contact',
    description:
      'Official Grievance Redressal Mechanism and Privacy Officer under DPDP Act 2023 and IT Rules 2021.',
    mainEntity: {
      '@type': 'Person',
      name: 'Kushal Bhardwaj',
      jobTitle: 'Director & Grievance Officer',
      worksFor: {
        '@type': 'MedicalOrganization',
        name: 'Joyzen Integrated Health Systems PVT LTD',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '58A, Phase 1. Golden avenue, Baran hara, Hambra road',
          addressLocality: 'Ludhiana',
          addressRegion: 'Punjab',
          postalCode: '141001',
          addressCountry: 'IN',
        },
        email: 'Kushal@joyzen.in',
        telephone: '+91-8360978099',
      },
    },
  };

  return (
    <main className="relative flex-1 flex flex-col w-full selection:bg-[#EF8F60]/20 selection:text-[#EF8F60]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GrievancePageClient />
    </main>
  );
}
