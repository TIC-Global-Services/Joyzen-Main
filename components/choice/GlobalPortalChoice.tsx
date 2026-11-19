'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ChoiceHero from './choiceHero';
import { isDnaCached } from '@/components/Home/DnaSequence';

export default function GlobalPortalChoice() {
  const pathname = usePathname();
  const [hasChosen, setHasChosen] = useState(true); // default true for SSR safety
  const [isReady, setIsReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const choiceCompleted =
      typeof window !== 'undefined' &&
      sessionStorage.getItem('joyzen_choice_completed') === 'true';

    setHasChosen(choiceCompleted);

    if (choiceCompleted) return;

    // On non-home pages (e.g. /about, /pricing), there is no DNA preloader,
    // so ChoiceHero is ready to animate immediately.
    if (pathname !== '/') {
      setIsReady(true);
      return;
    }

    // On home page ('/'):
    // If DNA images are already cached in memory, preloader skips immediately.
    const isMobile = window.innerWidth < 768;
    if (isDnaCached(isMobile)) {
      setIsReady(true);
      return;
    }

    // Otherwise, wait for Preloader to finish downloading and dismiss
    const handlePreloaderFinished = () => {
      setIsReady(true);
    };

    window.addEventListener('joyzen-preloader-finished', handlePreloaderFinished);

    // Fallback safety timer so ChoiceHero never stays stuck waiting
    const fallbackTimer = setTimeout(() => {
      setIsReady(true);
    }, 4500);

    return () => {
      window.removeEventListener('joyzen-preloader-finished', handlePreloaderFinished);
      clearTimeout(fallbackTimer);
    };
  }, [pathname]);

  if (!mounted || hasChosen) return null;

  return (
    <ChoiceHero
      isReady={isReady}
      onSelectPatient={() => setHasChosen(true)}
    />
  );
}
