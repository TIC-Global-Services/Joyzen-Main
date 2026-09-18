import React from 'react';
import Hero from '@/components/plan-and-pricing/hero';
import CareRight from '@/components/plan-and-pricing/care-right';
import PricingForms from '@/components/plan-and-pricing/form';

const page = () => {
  return (
    <main className="min-h-screen relative flex flex-col w-full">
      <Hero />
      <CareRight />
      <PricingForms />
      <div className="h-16 w-full bg-[#fcf9f2] absolute bottom-0 translate-y-1/2 left-0 z-40 blur-sm pointer-events-none"></div>
    </main>
  );
};

export default page;

