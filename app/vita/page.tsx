import React from 'react';
import type { Metadata } from 'next';
import CalaScrollSequence from '@/components/vita/CalaScrollSequence';
import CalaMembership from '@/components/vita/membership';
import EveryStage from '@/components/vita/everyStage';
import ProgramRouteGuard from '@/components/shared/ProgramRouteGuard';

export const metadata: Metadata = {
  title: 'VITA | Natural Conception Program. | Joyzen',
  description: 'A Joyzen Clinic fertility program with guided evaluation, conception planning, medical support, lifestyle guidance, and emotional support for couples trying to conceive.',
};

export default function VitaPage() {
  return (
    <ProgramRouteGuard programName="VITA" defaultConcern="Want to know about Natural Conception plans">
      <main className="w-full flex-1 flex flex-col">
        <CalaScrollSequence />
        <CalaMembership />
        <EveryStage />
      </main>
    </ProgramRouteGuard>
  );
}
