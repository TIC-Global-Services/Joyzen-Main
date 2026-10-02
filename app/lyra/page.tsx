import React from 'react';
import type { Metadata } from 'next';
import CalaScrollSequence from '@/components/lyra/CalaScrollSequence';
import CalaMembership from '@/components/lyra/membership';
import EveryStage from '@/components/lyra/everyStage';

export const metadata: Metadata = {
  title: 'LYRA | Women’s Health, Balanced With Guidance. | Joyzen',
  description: 'For women who want to improve their health, hormones, cycle, and overall wellbeing with continuous medical and lifestyle guidance.',
};

export default function LyraPage() {
  return (
    <main className="w-full flex-1 flex flex-col">
      <CalaScrollSequence />
      <CalaMembership />
      <EveryStage />
    </main>
  );
}
