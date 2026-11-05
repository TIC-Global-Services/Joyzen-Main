import React from 'react';
import type { Metadata } from 'next';
import CalaScrollSequence from '@/components/cala/CalaScrollSequence';
import CalaMembership from '@/components/cala/membership';
import EveryStage from '@/components/cala/everyStage';
import ProgramRouteGuard from '@/components/shared/ProgramRouteGuard';

export const metadata: Metadata = {
  title: 'CALA | Women\'s Health & Longevity | Joyzen',
  description:
    'CALA by Joyzen: Holistic hormonal health, fertility readiness, PCOS care, cycle health, and connected doctor support.',
};

export default function CalaPage() {
  return (
    <ProgramRouteGuard programName="CALA" defaultConcern="Want to know about PCOS plans">
      <main className="w-full flex-1 flex flex-col">
        <CalaScrollSequence />
        <CalaMembership />
        <EveryStage />
      </main>
    </ProgramRouteGuard>
  );
}
