'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';

export interface PreloaderProps {
  manual?: boolean;
  progress?: number;
  isComplete?: boolean;
  onFinish?: () => void;
}

export default function Preloader({
  manual = false,
  progress: externalProgress,
  isComplete: externalIsComplete,
  onFinish,
}: PreloaderProps) {
  const pathname = usePathname();
  const preloaderRef = useRef<HTMLDivElement>(null);

  // If manual mode starts with isComplete already true (images already cached in memory),
  // skip immediately so returning users see the content right away with zero flash.
  const [initialComplete] = useState(() => manual && Boolean(externalIsComplete));
  const [hasExited, setHasExited] = useState(initialComplete);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  const [internalProgress, setInternalProgress] = useState(0);
  const progressRef = useRef(0);
  const isFinishedRef = useRef(false);

  // Only allowed to ever display on Home ('/') or Our Vision ('/our-vision')
  const isAllowedPath = pathname === '/' || pathname === '/our-vision';

  // Skip if not on an allowed path OR if already cached and completed on mount
  const shouldSkip = !isAllowedPath || initialComplete;

  // Determine whether loading is truly finished
  const isDone = manual ? Boolean(externalIsComplete) : internalProgress >= 100;

  // In manual mode, only show 100% when everything is genuinely downloaded and completed.
  // Otherwise, cap the display at 99% while downloads are still in-flight.
  const currentProgress = manual
    ? isDone
      ? 100
      : Math.min(99, Math.max(0, Math.floor(externalProgress ?? 0)))
    : internalProgress;

  // If skipped immediately, trigger onFinish if provided
  useEffect(() => {
    if (shouldSkip) {
      onFinish?.();
    }
  }, [shouldSkip, onFinish]);

  // When images finish downloading and caching, immediately animate loader out and reveal content
  useEffect(() => {
    if (!manual || shouldSkip) return;

    if (isDone && !isFinishedRef.current) {
      isFinishedRef.current = true;

      if (preloaderRef.current) {
        gsap.to(preloaderRef.current, {
          opacity: 0,
          scale: 1.02,
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => {
            setHasExited(true);
            onFinish?.();
          },
        });
      } else {
        setHasExited(true);
        onFinish?.();
      }
    }
  }, [manual, shouldSkip, isDone, onFinish]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // React doesn't always set the muted attribute reliably
    video.muted = true;
    video.playsInline = true;

    video.play().catch(() => {
      setBlocked(true); // Low Power Mode / autoplay blocked
    });

    // Retry on the first real touch, which counts as a user gesture
    const retry = () => {
      video.play().then(() => setBlocked(false)).catch(() => { });
    };
    window.addEventListener("touchend", retry, { once: true });
    return () => window.removeEventListener("touchend", retry);
  }, []);

  // Lock scroll while loader is active on the home page ('/'), restore scroll once loader hides
  useEffect(() => {
    if (shouldSkip || hasExited || pathname !== '/') return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleScrollBlock = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };

    window.addEventListener('wheel', handleScrollBlock, { passive: false, capture: true });
    window.addEventListener('touchmove', handleScrollBlock, { passive: false, capture: true });

    return () => {
      // Only restore overflow if ChoiceHero is not queued or portal choice was already made
      const choiceCompleted =
        typeof window !== 'undefined' &&
        sessionStorage.getItem('joyzen_choice_completed') === 'true';

      if (choiceCompleted || pathname !== '/') {
        document.body.style.overflow = '';
      }

      window.removeEventListener('wheel', handleScrollBlock, { capture: true });
      window.removeEventListener('touchmove', handleScrollBlock, { capture: true });
    };
  }, [shouldSkip, hasExited, pathname]);



  // Automatic fallback mode (for pages without manual progress tracking)
  useEffect(() => {
    if (manual || shouldSkip) return;

    isFinishedRef.current = false;
    let hasReceivedDnaEvent = false;

    const finishLoading = () => {
      if (isFinishedRef.current) return;
      isFinishedRef.current = true;
      setInternalProgress(100);

      if (preloaderRef.current) {
        gsap.to(preloaderRef.current, {
          opacity: 0,
          scale: 1.02,
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => {
            setHasExited(true);
            onFinish?.();
          },
        });
      } else {
        setHasExited(true);
        onFinish?.();
      }
    };

    // 1. Listen for DNA sequence image download progress
    const handleDnaProgress = (event: Event) => {
      const customEvent = event as CustomEvent<{ progress: number; isComplete: boolean }>;
      if (!customEvent.detail) return;

      hasReceivedDnaEvent = true;
      const pct = Math.max(progressRef.current, customEvent.detail.progress);
      progressRef.current = pct;
      setInternalProgress(pct);

      if (customEvent.detail.isComplete || pct >= 100) {
        finishLoading();
      }
    };

    window.addEventListener('dna-progress', handleDnaProgress);

    // 2. Track standard page images loading state in DOM
    const trackPageImages = () => {
      if (hasReceivedDnaEvent || isFinishedRef.current) return;

      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
      if (imgs.length === 0) return;

      let loadedCount = 0;
      imgs.forEach((img) => {
        if (img.complete && img.naturalWidth > 0) {
          loadedCount++;
        }
      });

      const imgPct = Math.round((loadedCount / imgs.length) * 100);
      if (imgPct > progressRef.current) {
        progressRef.current = imgPct;
        setInternalProgress(imgPct);
      }

      if (loadedCount === imgs.length && document.readyState === 'complete') {
        finishLoading();
      }
    };

    const imgElements = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
    imgElements.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', trackPageImages);
        img.addEventListener('error', trackPageImages);
      }
    });

    const handleWindowLoad = () => {
      if (!hasReceivedDnaEvent) {
        trackPageImages();
        finishLoading();
      }
    };

    if (document.readyState === 'complete') {
      trackPageImages();
    } else {
      window.addEventListener('load', handleWindowLoad);
    }

    const interval = setInterval(() => {
      if (isFinishedRef.current) {
        clearInterval(interval);
        return;
      }

      trackPageImages();

      if (!hasReceivedDnaEvent) {
        setInternalProgress((prev) => {
          if (prev >= 95 && document.readyState !== 'complete') {
            return prev;
          }
          const next = Math.min(prev + Math.floor(Math.random() * 10 + 5), 95);
          progressRef.current = next;
          return next;
        });
      }
    }, 150);

    const maxTimeout = setTimeout(() => {
      finishLoading();
    }, 6000);

    return () => {
      window.removeEventListener('dna-progress', handleDnaProgress);
      window.removeEventListener('load', handleWindowLoad);
      imgElements.forEach((img) => {
        img.removeEventListener('load', trackPageImages);
        img.removeEventListener('error', trackPageImages);
      });
      clearInterval(interval);
      clearTimeout(maxTimeout);
    };
  }, [manual, shouldSkip, onFinish]);

  if (shouldSkip || hasExited) return null;

  return (
    <div
      ref={preloaderRef}
      data-lenis-prevent
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white select-none transition-all"
    >
      {/* Ambient background glow matching lilac palette */}
      <div className="absolute w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-white rounded-full blur-[120px] pointer-events-none" />

      {/* Main Loader Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        {/* 3D Robot Video from /loader_video.mp4 */}
        <div className="relative w-44 sm:w-56 md:w-64 aspect-square flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src="/loader_video.mp4"
            muted
            controls={false}               
            loop
            playsInline
            autoPlay
            preload="auto"
            className="w-full h-full object-contain pointer-events-none select-none mix-blend-multiply"
          />
        </div>

        {/* Headline */}
        <h2 className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl font-medium tracking-tight text-[#CBA4DF] select-none text-center">
          Connecting your world
        </h2>

        {/* Progress Bar & Percentage */}
        <div className="mt-5 sm:mt-6 flex flex-col items-center w-full max-w-[240px] sm:max-w-[280px]">
          {/* Progress Track */}
          <div className="w-full h-[5px] bg-[#EDEAE5] rounded-full overflow-hidden">
            {/* Progress Fill */}
            <div
              className="h-full bg-[#CCA2E1] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${currentProgress}%` }}
            />
          </div>

          {/* Percentage text */}
          <span className="mt-2.5 text-xs sm:text-sm font-medium tracking-wider text-[#CCA2E1] tabular-nums select-none font-mono">
            {currentProgress}%
          </span>
        </div>
      </div>
    </div>
  );
}