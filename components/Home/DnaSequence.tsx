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

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

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
    let loadedCount = 0;

    const getSrc = (index: number) => `/dna-sequence/${frameIndices[index]}.webp`;

    const renderFrame = (img: HTMLImageElement) => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };

    // Animation Loop
    let lastTime = performance.now();
    let accumulatedTime = 0;
    let loopStarted = false;

    const startAnimationLoop = () => {
      if (loopStarted) return;
      loopStarted = true;
      lastTime = performance.now();

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
    };

    // Preload frames progressively
    let nextToLoad = 0;
    const CONCURRENCY = isMobile ? 4 : 8;

    const loadNext = () => {
      if (!isMountedRef.current || nextToLoad >= frameCount) return;
      const idx = nextToLoad++;
      const img = new window.Image();
      img.src = getSrc(idx);

      const handleDone = () => {
        if (!isMountedRef.current) return;
        imageCache[idx] = img;
        loadedCount++;

        const currentPct = Math.min(100, Math.round((loadedCount / frameCount) * 100));
        setProgress(currentPct);

        // When first frame is loaded, render it immediately
        if (idx === 0) {
          renderFrame(img);
          lastRenderedIndex = 0;
        }

        // When all images are loaded, show video and start loop
        if (loadedCount >= frameCount) {
          setImagesLoaded(true);
          startAnimationLoop();
        } else {
          loadNext();
        }
      };

      img.onload = handleDone;
      img.onerror = handleDone;
    };

    // Launch worker queue
    for (let c = 0; c < CONCURRENCY; c++) {
      loadNext();
    }

    // Safety fallback: if connection is slow, start loop with buffered frames after 4s
    const fallbackTimeout = setTimeout(() => {
      if (isMountedRef.current && loadedCount >= 20 && !loopStarted) {
        setImagesLoaded(true);
        startAnimationLoop();
      }
    }, 4000);

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
      clearTimeout(fallbackTimeout);
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
    <div className="relative w-full h-full flex items-center justify-center">
      {/* ─── Loader ─── */}
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-opacity duration-500">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-[3px] border-[#036132] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {progress > 0 ? `Loading ${progress}%` : 'Loading…'}
            </span>
          </div>
        </div>
      )}

      {/* ─── Canvas ─── */}
      <canvas
        ref={canvasRef}
        className={`${
          className ||
          'w-full h-auto aspect-[1920/1080] max-h-[900px] object-contain object-right origin-right-center'
        } transition-opacity duration-700 ease-out ${
          imagesLoaded ? 'opacity-95' : 'opacity-0'
        }`}
        style={{
          display: 'block',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
}
