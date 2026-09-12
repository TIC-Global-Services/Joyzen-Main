import React from 'react';
import Hero from '@/components/ourVision/hero';
import OnePlace from '@/components/ourVision/onePlace';
import HereItFrom from '@/components/ourVision/hereItFrom';
import Epharmacy from '@/components/ourVision/e-pharmacy';

const page = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <OnePlace />
      <HereItFrom />
      <Epharmacy />
    </main>
  );
};

export default page;