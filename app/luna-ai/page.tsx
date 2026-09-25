import React from 'react';
import type { Metadata } from 'next';
import LunaAI from '@/components/luna-ai/luna';
import Membership from '@/components/luna-ai/membership';
import LunaBackground from '@/components/luna-ai/luna-background';

export const metadata: Metadata = {
  title: 'Luna AI | Your Intelligent Health & Longevity Companion',
  description:
    'Discover Luna AI by Joyzen: an intelligent companion providing personalized health insights, proactive wellness recommendations, and synchronized care coordination.',
  keywords: [
    'Luna AI Health',
    'AI Healthcare Companion',
    'Joyzen AI',
    'Personalized Health Insights',
    'AI Symptom & Wellness Guide',
  ],
  alternates: {
    canonical: '/luna-ai',
  },
  openGraph: {
    title: 'Luna AI | Joyzen Intelligent Health Companion',
    description:
      'Discover Luna AI by Joyzen: an intelligent companion providing personalized health insights and proactive wellness support.',
    url: 'https://joyzen.in/luna-ai',
    siteName: 'Joyzen',
    images: [
      {
        url: '/luna_ai.png',
        width: 1200,
        height: 630,
        alt: 'Luna AI Health Companion',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luna AI | Joyzen Intelligent Health Companion',
    description:
      'Discover Luna AI by Joyzen: an intelligent companion providing personalized health insights and proactive wellness support.',
    images: ['/luna_ai.png'],
  },
};

export default function LunaAIPage() {
  return (
    <main className="relative w-full min-h-screen select-none overflow-hidden">
      {/* Dynamic Animated Background: Vibrant Pastel, Full Edge-to-Edge Color Sweep from exploreform.tsx */}
      <LunaBackground />

      {/* Page Content */}
      <div className="relative z-10 space-y-12 pb-16">
        <LunaAI />
        <Membership />
      </div>
      <div className='h-16 w-full bg-[#fcf9f2] absolute -bottom-[0.5%] left-0 z-100 blur-md'></div>
    </main>
  );
}