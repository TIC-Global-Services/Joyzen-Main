import React from 'react';
import type { Metadata } from 'next';
import CalaScrollSequence from '@/components/genesis/CalaScrollSequence';
import CalaMembership from '@/components/genesis/membership';
import EveryStage from '@/components/genesis/everyStage';

export const metadata: Metadata = {
  title: 'GENESIS | Men’s Fatherhood Preparation Program. | Joyzen',
  description: 'For men preparing for fatherhood with structured fertility, hormone, sexual health, lifestyle, and emotional support.',
};

export default function GenesisPage() {
  return (
    <main className="w-full flex-1 flex flex-col bg-[#FAF8F5]">
      <CalaScrollSequence />
      <CalaMembership />
      <EveryStage />
    </main>
  );
}
