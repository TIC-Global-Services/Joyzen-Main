import React from 'react';
import Hero from '@/components/international-care/hero';
import Appointment from '@/components/international-care/appointment';
import Consultation from '@/components/international-care/conseltation';
import FAQ from '@/components/international-care/faq';
import StartYourHealth from '@/components/international-care/startYourHealth';

export default function InternationalCarePage() {
  return (
    <main className="relative w-full min-h-screen flex flex-col">
      <Hero />
      <Appointment />
      <Consultation />
      <FAQ />
      <StartYourHealth/>
      <div className="h-16 w-full bg-[#fcf9f2] absolute bottom-0 translate-y-1/2 left-0 z-40 blur-sm pointer-events-none"></div>
    </main>
  );
}



