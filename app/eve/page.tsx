import React from 'react';
import type { Metadata } from 'next';
import CalaScrollSequence from '@/components/eve/CalaScrollSequence';
import CalaMembership from '@/components/eve/membership';
import EveryStage from '@/components/eve/everyStage';

export const metadata: Metadata = {
  title: 'EVE | Pregnancy, Prepared With a Plan. | Joyzen',
  description: 'For women who want to prepare their body and conceive naturally with step-by-step medical guidance.',
};

export default function EvePage() {
  return (
    <main className="w-full flex-1 flex flex-col bg-[#FAF8F5]">
      <CalaScrollSequence />
      <CalaMembership />
      <EveryStage />
    </main>
  );
}
