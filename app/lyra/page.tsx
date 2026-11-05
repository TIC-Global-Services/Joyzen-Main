import React from 'react';
import type { Metadata } from 'next';
import CalaScrollSequence from '@/components/lyra/CalaScrollSequence';
import CalaMembership from '@/components/lyra/membership';
import EveryStage from '@/components/lyra/everyStage';
import ProgramRouteGuard from '@/components/shared/ProgramRouteGuard';

export const metadata: Metadata = {
  title: 'LYRA | Women’s Health, Balanced With Guidance. | Joyzen',
  description: 'For women who want to improve their health, hormones, cycle, and overall wellbeing with continuous medical and lifestyle guidance.',
};

export default function LyraPage() {
  return (
    <ProgramRouteGuard programName="LYRA" defaultConcern="Want to know about Women’s Health & Cycle Balance plans">
      <main className="w-full flex-1 flex flex-col">
        <CalaScrollSequence />
        <CalaMembership />
        <EveryStage />
      </main>
    </ProgramRouteGuard>
  );
}
