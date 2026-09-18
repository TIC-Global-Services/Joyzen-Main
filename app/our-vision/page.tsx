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
      <div className='h-16 w-full bg-[#fcf9f2] absolute bottom-[13.2%] left-0 z-100 blur-sm'></div>
    </main>
  );
};

export default page;
