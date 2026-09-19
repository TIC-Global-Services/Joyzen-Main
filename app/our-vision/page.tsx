import React from 'react';
import Hero from '@/components/ourVision/hero';
import OnePlace from '@/components/ourVision/onePlace';
import HereItFrom from '@/components/ourVision/hereItFrom';
import Epharmacy from '@/components/ourVision/e-pharmacy';
import Represents from '@/components/ourVision/represents';

const page = () => {
  return (
    <main className="relative flex-1 flex flex-col w-full">
      <Hero />
      <OnePlace />
      <HereItFrom />
      <Represents/>
      <Epharmacy />
      <div className="h-16 w-full bg-[#f2f1f0] absolute bottom-0 translate-y-1/2 left-0 z-40 blur-sm pointer-events-none"></div>
    </main>
  );
};

export default page;
