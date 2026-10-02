import React from 'react';
import type { Metadata } from 'next';
import CalaScrollSequence from '@/components/luna/CalaScrollSequence';
import CalaMembership from '@/components/luna/membership';
import EveryStage from '@/components/luna/everyStage';

export const metadata: Metadata = {
  title: 'LUNA | Teen Health, Guided Early. | Joyzen',
  description: 'A safe, modern health program for teen girls to understand their body, manage early cycle concerns, and build healthy habits with real medical guidance.',
};

export default function LunaPage() {
  return (
    <main className="w-full flex-1 flex flex-col">
      <CalaScrollSequence />
      <CalaMembership />
      <EveryStage />
    </main>
  );
}
