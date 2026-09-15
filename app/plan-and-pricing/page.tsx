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
    </main>
  );
};

export default page;
