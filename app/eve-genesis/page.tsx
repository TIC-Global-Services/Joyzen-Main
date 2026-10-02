import React from 'react';
import type { Metadata } from 'next';
import CalaScrollSequence from '@/components/eve-genesis/CalaScrollSequence';
import CalaMembership from '@/components/eve-genesis/membership';
import EveryStage from '@/components/eve-genesis/everyStage';

export const metadata: Metadata = {
  title: 'EVE + GENESIS | Couple Conception Program. | Joyzen',
  description: 'For couples who want to prepare and conceive naturally with guided support for both partners.',
};

export default function EveGenesisPage() {
  return (
    <main className="w-full flex-1 flex flex-col">
      <CalaScrollSequence />
      <CalaMembership />
      <EveryStage />
    </main>
  );
}
