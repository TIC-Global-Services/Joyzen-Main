import React from 'react';
import Hero from '@/components/plan-and-pricing/hero';
import CareRight from '@/components/plan-and-pricing/care-right';
import PricingForms from '@/components/plan-and-pricing/form';

const page = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <CareRight />
      <PricingForms />
      <div className='h-16 w-full bg-[#fcf9f2] absolute bottom-[18.2%] left-0 z-100 blur-sm'></div>
    </main>
  );
};

export default page;

