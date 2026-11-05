import React from 'react';
import type { Metadata } from 'next';
import CalaScrollSequence from '@/components/core/CalaScrollSequence';
import CalaMembership from '@/components/core/membership';
import EveryStage from '@/components/core/everyStage';
import ProgramRouteGuard from '@/components/shared/ProgramRouteGuard';

export const metadata: Metadata = {
  title: 'CORE | Men’s Health & Energy Program. | Joyzen',
  description: 'For men who want to improve energy, lifestyle, sexual health, and prevent future fertility problems with guided medical support.',
};

export default function CorePage() {
  return (
    <ProgramRouteGuard programName="CORE" defaultConcern="Want to know about Pelvic Health & Energy plans">
      <main className="w-full flex-1 flex flex-col">
        <CalaScrollSequence />
        <CalaMembership />
        <EveryStage />
      </main>
    </ProgramRouteGuard>
  );
}
