'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FollowupModalProvider } from './FollowupModal';

export interface ProgramRouteGuardProps {
  children: React.ReactNode;
  programName?: string;
  defaultConcern?: string;
}

export default function ProgramRouteGuard({
  children,
  programName = 'CALA',
  defaultConcern,
}: ProgramRouteGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const storedLeadId = sessionStorage.getItem('joyzen_lead_id');
      if (!storedLeadId || !storedLeadId.trim()) {
        setIsAuthorized(false);
        router.replace('/q-form');
      } else {
        setIsAuthorized(true);
      }
    } catch {
      // Storage unavailable or blocked (private browsing error)
      setIsAuthorized(false);
      router.replace('/q-form');
    }
  }, [router]);

  // While checking authorization, display an elegant minimal loading state
  if (isAuthorized === null || !isAuthorized) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white/60 backdrop-blur-md">
        <div className="flex flex-col items-center gap-3 p-8 rounded-3xl bg-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white">
          <div className="w-9 h-9 border-3 border-[#95C1E2] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs sm:text-sm font-medium text-zinc-600">
            Verifying your assessment details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <FollowupModalProvider programName={programName} defaultConcern={defaultConcern}>
      {children}
    </FollowupModalProvider>
  );
}

