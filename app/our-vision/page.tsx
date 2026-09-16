import React from 'react';
import Hero from '@/components/ourVision/hero';
import OnePlace from '@/components/ourVision/onePlace';
import HereItFrom from '@/components/ourVision/hereItFrom';
import Epharmacy from '@/components/ourVision/e-pharmacy';
import Represents from '@/components/ourVision/represents';

const page = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <OnePlace />
      <HereItFrom />
      <Represents/>
      <Epharmacy />
    </main>
  );
};

export default page;
