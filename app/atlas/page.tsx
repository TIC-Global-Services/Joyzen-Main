import React from 'react';
import type { Metadata } from 'next';
import CalaScrollSequence from '@/components/atlas/CalaScrollSequence';
import CalaMembership from '@/components/atlas/membership';
import EveryStage from '@/components/atlas/everyStage';

export const metadata: Metadata = {
  title: 'ATLAS | Male Fertility & Hormone Restoration Program. | Joyzen',
  description: 'For men who want to improve sperm health, testosterone, stamina, and reproductive health with structured medical and lifestyle guidance.',
};

export default function AtlasPage() {
  return (
    <main className="w-full flex-1 flex flex-col">
      <CalaScrollSequence />
      <CalaMembership />
      <EveryStage />
    </main>
  );
}
