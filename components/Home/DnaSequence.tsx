'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const TOTAL_FRAMES = 360; // 10001.webp to 10360.webp in /dna-gradient-compressed

const DESKTOP_FRAME_STEP = 1;
const MOBILE_FRAME_STEP = 2;

const DESKTOP_TOTAL_FRAMES = 360;
const MOBILE_TOTAL_FRAMES = 180;

const FRAME_PATH_PREFIX = '/dna-gradient-compressed/';
const SAFETY_TIMEOUT_MS = 20000;
const SESSION_CACHE_KEY = 'joyzen_dna_loaded';

// Decided once per tab load, not per render — avoids the double-load bug where
// isMobile starts false, then flips true after mount and restarts everything.
const getIsMobile = () =>
  typeof window !== 'undefined' &&
  (window.innerWidth < 768 || /iPad|iPhone|iPod|Android/i.test(navigator.userAgent || ''));

declare global {
  interface Window {
    __joyzen_dna_frame_cache?: Map<number, HTMLImageElement>;
    __joyzen_dna_in_flight?: Set<number>;
    __joyzen_dna_loaded_desktop?: boolean;
    __joyzen_dna_loaded_mobile?: boolean;
    __joyzen_dna_tier_ready?: 'mobile' | 'desktop' | null;
  }
}

const getFrameCache = (): Map<number, HTMLImageElement> => {
  if (typeof window === 'undefined') return new Map();
  if (!window.__joyzen_dna_frame_cache) {
    window.__joyzen_dna_frame_cache = new Map();
  }
  return window.__joyzen_dna_frame_cache;
};

const getInFlightSet = (): Set<number> => {
  if (typeof window === 'undefined') return new Set();
  if (!window.__joyzen_dna_in_flight) {
    window.__joyzen_dna_in_flight = new Set();
  }
  return window.__joyzen_dna_in_flight;
};

export const isDnaCached = (isMobile: boolean): boolean => {
  if (typeof window === 'undefined') return false;
  const tier = isMobile ? 'mobile' : 'desktop';
  if (window.__joyzen_dna_tier_ready === tier) return true;
  const isLoaded = isMobile
    ? window.__joyzen_dna_loaded_mobile === true
    : window.__joyzen_dna_loaded_desktop === true;
  if (isLoaded) return true;

  const cache = getFrameCache();
  const targetCount = isMobile ? MOBILE_TOTAL_FRAMES : DESKTOP_TOTAL_FRAMES;
  return cache.size >= targetCount;
};

const markSessionLoaded = (isMobile: boolean): void => {
  if (typeof window === 'undefined') return;
  const tier = isMobile ? 'mobile' : 'desktop';
  if (isMobile) {
    window.__joyzen_dna_loaded_mobile = true;
  } else {
    window.__joyzen_dna_loaded_desktop = true;
  }
  window.__joyzen_dna_tier_ready = tier;
  try {
    sessionStorage.setItem(`${SESSION_CACHE_KEY}_${tier}`, 'true');
  } catch {
    // Graceful fallback for restricted storage environments
  }
};

interface DnaSequenceProps {
  className?: string;
  onProgress?: (progress: number) => void;
  onLoaded?: () => void;
}

export default function DnaSequence({ className, onProgress, onLoaded }: DnaSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const isMountedRef = useRef(true);
  const isVisibleRef = useRef(true);
  const animationFrameIdRef = useRef<number | null>(null);

  // Lazy initializer — computed synchronously before first paint, so this is
  // correct immediately instead of flipping after mount and re-triggering everything.
  const [isMobile] = useState(getIsMobile);
  const [imagesLoaded, setImagesLoaded] = useState(() => isDnaCached(getIsMobile()));

  const frameIndices = useMemo(() => {
    const indices: number[] = [];
    const step = isMobile ? MOBILE_FRAME_STEP : DESKTOP_FRAME_STEP;
    for (let i = 0; i < TOTAL_FRAMES; i += step) {
      indices.push(i);
    }
    return indices;
  }, [isMobile]);

  const framePaths = useMemo(() => {
    return frameIndices.map((idx) => `${FRAME_PATH_PREFIX}${10001 + idx}.webp`);
  }, [frameIndices]);

  useEffect(() => {
    let cancelled = false;
    isMountedRef.current = true;

    const count = frameIndices.length;
    const images: HTMLImageElement[] = new Array(count).fill(null as unknown as HTMLImageElement);
    const frameCache = getFrameCache();
    const inFlight = getInFlightSet();
    const settledIndices = new Set<number>();

    // 1. If already cached in memory, reuse instantly with 0ms overhead
    if (isDnaCached(isMobile)) {
      let allPresent = true;
      frameIndices.forEach((frameIdx, i) => {
        const cached = frameCache.get(frameIdx);
        if (cached && cached.naturalWidth > 0) {
          images[i] = cached;
        } else {
          allPresent = false;
        }
      });

      if (allPresent) {
        imagesRef.current = images;
        markSessionLoaded(isMobile);
        setImagesLoaded(true);

        if (canvasRef.current) {
          canvasRef.current.width = CANVAS_WIDTH;
          canvasRef.current.height = CANVAS_HEIGHT;
          const ctx = canvasRef.current.getContext('2d');
          if (ctx && images[0]) {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.drawImage(images[0], 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          }
        }

        onProgress?.(100);
        onLoaded?.();
        window.dispatchEvent(
          new CustomEvent('dna-progress', { detail: { progress: 100, isComplete: true } })
        );

        return () => {
          cancelled = true;
          isMountedRef.current = false;
        };
      }
    }

    setImagesLoaded(false);

    // 2. Restore any already cached frames
    frameIndices.forEach((frameIdx, i) => {
      const existing = frameCache.get(frameIdx);
      if (existing && existing.naturalWidth > 0) {
        images[i] = existing;
        settledIndices.add(frameIdx);
      }
    });

    // Draw frame 0 immediately if already present
    if (frameCache.has(0) && canvasRef.current) {
      canvasRef.current.width = CANVAS_WIDTH;
      canvasRef.current.height = CANVAS_HEIGHT;
      const ctx = canvasRef.current.getContext('2d');
      const firstImg = frameCache.get(0);
      if (ctx && firstImg) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(firstImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    }

    const notifyProgress = () => {
      const pct = Math.min(100, Math.round((settledIndices.size / count) * 100));
      onProgress?.(pct);
      window.dispatchEvent(
        new CustomEvent('dna-progress', {
          detail: { progress: pct, isComplete: settledIndices.size >= count },
        })
      );
    };

    const checkComplete = () => {
      if (settledIndices.size < count) return;
      markSessionLoaded(isMobile);
      if (!cancelled && isMountedRef.current) {
        imagesRef.current = images;
        setImagesLoaded(true);
        onProgress?.(100);
        onLoaded?.();
      }
    };

    // 3. Load remaining frames with deduplication
    frameIndices.forEach((frameIdx, i) => {
      if (settledIndices.has(frameIdx)) {
        notifyProgress();
        checkComplete();
        return;
      }

      if (inFlight.has(frameIdx)) {
        return;
      }
      inFlight.add(frameIdx);

      const img = new window.Image();
      img.src = framePaths[i];

      img.onload = () => {
        inFlight.delete(frameIdx);
        frameCache.set(frameIdx, img);
        settledIndices.add(frameIdx);

        if (!cancelled && isMountedRef.current) {
          images[i] = img;
          if (i === 0 && canvasRef.current) {
            canvasRef.current.width = CANVAS_WIDTH;
            canvasRef.current.height = CANVAS_HEIGHT;
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
              ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }
          }
        }

        notifyProgress();
        checkComplete();
      };

      img.onerror = () => {
        inFlight.delete(frameIdx);
        settledIndices.add(frameIdx);
        notifyProgress();
        checkComplete();
      };
    });

    const safetyTimer = setTimeout(() => {
      if (!cancelled && isMountedRef.current) {
        markSessionLoaded(isMobile);
        imagesRef.current = images;
        setImagesLoaded(true);
        onProgress?.(100);
        onLoaded?.();
      }
    }, SAFETY_TIMEOUT_MS);

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      clearTimeout(safetyTimer);
    };
  }, [frameIndices, framePaths, isMobile, onProgress, onLoaded]);

  useEffect(() => {
    if (!imagesLoaded) return;

    let lastTime = performance.now();
    let accumulatedTime = 0;
    const fps = isMobile ? 24 : 30;
    const frameDuration = 1000 / fps;
    let currentFrameIdx = 0;

    const tick = (now: number) => {
      if (!isMountedRef.current) return;

      const delta = now - lastTime;
      lastTime = now;

      if (isVisibleRef.current) {
        accumulatedTime += delta;
        while (accumulatedTime >= frameDuration) {
          accumulatedTime -= frameDuration;
          currentFrameIdx = (currentFrameIdx + 1) % framePaths.length;
        }

        const canvas = canvasRef.current;
        const img = imagesRef.current[currentFrameIdx];
        if (canvas && img && img.complete && img.naturalWidth > 0) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          }
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(tick);
    };

    animationFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [imagesLoaded, framePaths.length, isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    let observer: IntersectionObserver | null = null;

    if (typeof IntersectionObserver !== 'undefined' && canvas) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting && !document.hidden;
        },
        { threshold: 0.05 }
      );
      observer.observe(canvas);
    }

    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (observer) observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={
        className ||
        'w-full h-auto aspect-1920/1080 max-h-[900px] object-contain object-right opacity-95 scale-100 sm:scale-105 md:scale-110 origin-right-center'
      }
      style={{
        display: 'block',
        transform: 'translate3d(0, 0, 0)',
        WebkitTransform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    />
  );
}