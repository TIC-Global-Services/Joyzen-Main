'use client';

import React, { useEffect, useRef } from 'react';

const TOTAL_FRAMES = 360;
const START_INDEX = 10001;
const DESKTOP_DIR = '/dna-sequence';
// Change to '/dna-sequence/sm' once you export smaller (~480px wide) frames
const MOBILE_DIR = '/dna-sequence';

export default function DnaSequence({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile =
      window.innerWidth < 768 ||
      /iPad|iPhone|iPod|Android/i.test(navigator.userAgent);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fixed backing buffer, smaller on mobile
    canvas.width = isMobile ? 960 : 1920;
    canvas.height = isMobile ? 540 : 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    const step = isMobile ? 2 : 1;
    const fps = isMobile ? 24 : 30; // use 15 on mobile to match desktop speed
    const frameDuration = 1000 / fps;
    const dir = isMobile ? MOBILE_DIR : DESKTOP_DIR;
    const frameCount = Math.ceil(TOTAL_FRAMES / step);
    const MIN_BUFFER = Math.min(frameCount, isMobile ? 24 : 45); // frames needed before playback starts
    const CONCURRENCY = isMobile ? 3 : 6;

    const src = (i: number) => `${dir}/${START_INDEX + i * step}.webp`;

    const frames: (HTMLImageElement | null)[] = new Array(frameCount).fill(null);
    const failed = new Set<number>();
    let cancelled = false;
    let raf = 0;
    let nextToLoad = 0;
    let readyCount = 0; // contiguous frames available from index 0
    let current = 0;
    let rendered = -1;
    let acc = 0;
    let last = 0;

    const render = (img: HTMLImageElement) => {
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0, W, H);
    };

    const loadOne = async (i: number) => {
      const img = new Image();
      img.src = src(i);
      try {
        await img.decode(); // decoded before we ever draw it
        frames[i] = img;
      } catch {
        failed.add(i);
      }
    };

    const worker = async () => {
      while (!cancelled && nextToLoad < frameCount) {
        await loadOne(nextToLoad++);
      }
    };

    const startLoading = async () => {
      await loadOne(0);
      if (cancelled) return;
      nextToLoad = 1;
      if (frames[0]) {
        render(frames[0]);
        rendered = 0;
      }
      if (reduced) return; // static first frame only
      await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      acc += now - last;
      last = now;
      if (acc < frameDuration) return;
      acc %= frameDuration; // no catch-up burst after pauses

      while (
        readyCount < frameCount &&
        (frames[readyCount] || failed.has(readyCount))
      ) {
        readyCount++;
      }

      const allLoaded = readyCount >= frameCount;
      if (!allLoaded && readyCount < MIN_BUFFER) return; // still buffering

      let next = current + 1;
      if (next >= readyCount) {
        if (!allLoaded) return; // caught up with loader: hold current frame
        next = 0;               // fully loaded: loop
      }
      current = next;

      const img = frames[current];
      if (img && current !== rendered) {
        render(img);
        rendered = current;
      }
    };

    const play = () => {
      if (raf || reduced) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : pause()),
      { threshold: 0.05 },
    );
    io.observe(canvas);

    startLoading();

    return () => {
      cancelled = true;
      pause();
      io.disconnect();
      frames.fill(null); // let the GC reclaim decoded frames
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={
        className ||
        'w-full h-auto aspect-[1920/1080] max-h-[900px] object-contain object-right opacity-95 scale-100 sm:scale-105 md:scale-110 origin-right'
      }
      style={{ display: 'block' }}
    />
  );
}