'use client';

import React, { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 360;
const START_INDEX = 10001;
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

interface DnaSequenceProps {
  className?: string;
}

export default function DnaSequence({ className }: DnaSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMountedRef = useRef(true);
  const isVisibleRef = useRef(true);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set fixed canvas backing buffer size once to prevent WebKit GPU reallocations
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
    });
    if (!ctx) return;

    // Determine device tier: use step 2 (180 frames) on mobile/Safari for memory efficiency
    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 ||
        /iPad|iPhone|iPod|Android/i.test(navigator.userAgent || ''));

    const step = isMobile ? 2 : 1;
    const fps = isMobile ? 24 : 30;
    const frameDuration = 1000 / fps;

    // Build frame indices
    const frameIndices: number[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i += step) {
      frameIndices.push(START_INDEX + i);
    }
    const frameCount = frameIndices.length;

    // Image cache storage
    const imageCache: (HTMLImageElement | null)[] = new Array(frameCount).fill(null);
    let lastRenderedIndex = -1;
    let currentFrameIdx = 0;

    const getSrc = (index: number) => `/dna-sequence/${frameIndices[index]}.webp`;

    const renderFrame = (img: HTMLImageElement) => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };

    // Fast-path: Preload & render frame 0 immediately
    const firstImg = new window.Image();
    firstImg.src = getSrc(0);
    const loadFirstFrame = async () => {
      try {
        if ('decode' in firstImg) {
          await firstImg.decode();
        }
      } catch {
        // Fallback for decode rejection
      }
      if (!isMountedRef.current) return;
      imageCache[0] = firstImg;
      renderFrame(firstImg);
      lastRenderedIndex = 0;
    };
    firstImg.onload = loadFirstFrame;

    // Progressive queue with mobile-optimized concurrency (4 on mobile, 8 on desktop)
    let nextToLoad = 1;
    const CONCURRENCY = isMobile ? 4 : 8;

    const loadNext = async () => {
      if (!isMountedRef.current || nextToLoad >= frameCount) return;
      const idx = nextToLoad++;
      const img = new window.Image();
      img.src = getSrc(idx);

      const onDone = async () => {
        if (!isMountedRef.current) return;
        try {
          if ('decode' in img) {
            await img.decode();
          }
        } catch {
          // ignore
        }
        imageCache[idx] = img;
        loadNext();
      };

      img.onload = onDone;
      img.onerror = () => {
        if (isMountedRef.current) loadNext();
      };
    };

    for (let c = 0; c < CONCURRENCY; c++) {
      loadNext();
    }

    // RAF Animation Loop with Delta Time and Visibility Check
    let lastTime = performance.now();
    let accumulatedTime = 0;

    const tick = (now: number) => {
      if (!isMountedRef.current) return;

      const delta = now - lastTime;
      lastTime = now;

      if (isVisibleRef.current) {
        accumulatedTime += delta;

        while (accumulatedTime >= frameDuration) {
          accumulatedTime -= frameDuration;
          currentFrameIdx = (currentFrameIdx + 1) % frameCount;
        }

        const candidateImg = imageCache[currentFrameIdx];
        if (candidateImg && candidateImg.complete && candidateImg.naturalWidth > 0) {
          if (lastRenderedIndex !== currentFrameIdx) {
            renderFrame(candidateImg);
            lastRenderedIndex = currentFrameIdx;
          }
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(tick);
    };

    animationFrameIdRef.current = requestAnimationFrame(tick);

    // IntersectionObserver to pause loop when offscreen
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined' && canvas) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting && !document.hidden;
        },
        { threshold: 0.05 },
      );
      observer.observe(canvas);
    }

    // Page Visibility listener for iOS tab-swapping
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
      } else if (canvas) {
        isVisibleRef.current = true;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (observer) {
        observer.disconnect();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={
        className ||
        'w-full h-auto aspect-[1920/1080] max-h-[900px] object-contain object-right opacity-95 scale-100 sm:scale-105 md:scale-110 origin-right-center'
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
