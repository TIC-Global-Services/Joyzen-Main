import React from 'react';
import Navbar from '@/reuseable/Navbar';
import Footer from '@/reuseable/Footer';
import HeroSection from '@/components/Home/HeroSection';
import ConnectedExperienceSection from '@/components/Home/ConnectedExperienceSection';
import DashboardShowcaseSection from '@/components/Home/DashboardShowcaseSection';
import DoctorPatientSection from '@/components/Home/DoctorPatientSection';
import CareReimaginedSection from '@/components/Home/CareReimaginedSection';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col w-full selection:bg-[#036132]/20 selection:text-[#036132]">
      
      {/* 5 Home Sections */}
      <main className="flex-1 flex flex-col w-full">
        {/* Component 1: Hero */}
        <HeroSection />

        {/* Component 2: Connected Experience Banner */}
        <ConnectedExperienceSection />

        {/* Component 3: Bento Dashboard Showcase */}
        <DashboardShowcaseSection />

        {/* Component 4: Doctor-Patient Connection with Sequential Badges */}
        <DoctorPatientSection />

        {/* Component 5: Care Reimagined Climax */}
        <CareReimaginedSection />
      </main>
     <div className='h-16 w-full bg-[#fcf9f2] absolute -bottom-[0.5%] left-0 z-100 blur-md'></div>
     
    </div>
  );
}
