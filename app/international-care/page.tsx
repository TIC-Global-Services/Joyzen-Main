import React from 'react';
import Hero from '@/components/international-care/hero';
import Appointment from '@/components/international-care/appointment';
import Consultation from '@/components/international-care/conseltation';
import FAQ from '@/components/international-care/faq';
import StartYourHealth from '@/components/international-care/startYourHealth';

export default function InternationalCarePage() {
  return (
    <main className="w-full min-h-screen">
      <Hero />
      <Appointment />
      <Consultation />
      <FAQ />
      <StartYourHealth/>
    </main>
  );
}



