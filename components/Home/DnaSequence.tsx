'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import dnaGradientData from '@/data/dnaGradientSequence.json';

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const TOTAL_FRAMES = dnaGradientData.assets.length;

// Decided once per tab load, not per render — avoids the double-load bug where
// isMobile starts false, then flips true after mount and restarts everything.
const getIsMobile = () =>
  typeof window !== 'undefined' &&
  (window.innerWidth < 768 || /iPad|iPhone|iPod|Android/i.test(navigator.userAgent || ''));

// Module-level cache — survives Hero/DnaSequence unmounting on client-side nav.
// Keyed by URL since mobile/desktop use different frame sets.
const frameCache = new Map<string, HTMLImageElement>();
let cachedTierReady: 'mobile' | 'desktop' | null = null;

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
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const framePaths = useMemo(() => {
    const paths: string[] = [];
    const step = isMobile ? 2 : 1;
    const assets = dnaGradientData.assets;
    for (let i = 0; i < TOTAL_FRAMES; i += step) {
      if (assets[i]) paths.push(assets[i].u + assets[i].p);
    }
    return paths;
  }, [isMobile]); // isMobile is now fixed for the component's lifetime — this never re-fires

  useEffect(() => {
    let cancelled = false;
    isMountedRef.current = true;

    const tier = isMobile ? 'mobile' : 'desktop';
    const images: HTMLImageElement[] = new Array(framePaths.length).fill(null as unknown as HTMLImageElement);

    // Already loaded this tier earlier in the session — reuse instantly, skip the fetch dance.
    if (cachedTierReady === tier) {
      let allPresent = true;
      framePaths.forEach((src, i) => {
        const cached = frameCache.get(src);
        if (cached) images[i] = cached;
        else allPresent = false;
      });
      if (allPresent) {
        imagesRef.current = images;
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
    let loaded = 0;

    const notifyProgress = (currentLoaded: number) => {
      const pct = Math.min(100, Math.round((currentLoaded / framePaths.length) * 100));
      onProgress?.(pct);
      window.dispatchEvent(
        new CustomEvent('dna-progress', {
          detail: { progress: pct, isComplete: currentLoaded >= framePaths.length },
        })
      );
    };

    const finishIfDone = () => {
      if (loaded >= framePaths.length && !cancelled && isMountedRef.current) {
        imagesRef.current = images;
        cachedTierReady = tier;
        setImagesLoaded(true);
        onLoaded?.();
      }
    };

    framePaths.forEach((src, i) => {
      const existing = frameCache.get(src);
      if (existing) {
        images[i] = existing;
        loaded++;
        notifyProgress(loaded);
        if (i === 0 && canvasRef.current) {
          canvasRef.current.width = CANVAS_WIDTH;
          canvasRef.current.height = CANVAS_HEIGHT;
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.drawImage(existing, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          }
        }
        finishIfDone();
        return;
      }

      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        if (cancelled || !isMountedRef.current) return;
        images[i] = img;
        frameCache.set(src, img);
        loaded++;
        notifyProgress(loaded);

        if (i === 0 && canvasRef.current) {
          canvasRef.current.width = CANVAS_WIDTH;
          canvasRef.current.height = CANVAS_HEIGHT;
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          }
        }
        finishIfDone();
      };
      img.onerror = () => {
        loaded++;
        notifyProgress(loaded);
        finishIfDone();
      };
    });

    const safetyTimer = setTimeout(() => {
      if (!cancelled && isMountedRef.current) {
        cachedTierReady = tier;
        setImagesLoaded(true);
        onProgress?.(100);
        onLoaded?.();
      }
    }, 25000);

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      clearTimeout(safetyTimer);
      images.forEach((img) => {
        if (img) {
          img.onload = null;
          img.onerror = null;
        }
      });
    };
  }, [framePaths, isMobile, onProgress, onLoaded]);

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