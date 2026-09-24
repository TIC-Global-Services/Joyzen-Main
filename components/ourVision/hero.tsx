'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import OnePlace from './onePlace';
import Preloader from '@/reuseable/loader';

const TOTAL_FRAMES = 363; // Total frames: 0 to 362
const LOOP_END_FRAME = 233; // First 234 frames: 0 to 233 (looping when not scrolled)
const SCATTER_START_FRAME = 234; // Remaining 129 frames: 234 to 362 (rendered on scroll)

// Module-level frame cache to preserve decoded frames across client navigations
const frameCache = new Map<number, HTMLImageElement>();

// Hotspots configuration matching the scatter DNA layout
const HOTSPOTS = [
  {
    id: 'speed',
    top: '41%',
    left: '64%',
    text: 'HEALTHCARE IS \nMOVING AT YOUR SPEED',
    alignRight: true,
  },
  {
    id: 'life',
    top: '57%',
    left: '46%',
    text: 'BECAUSE LIFE \nIS ALWAYS MOVING',
    alignRight: false,
  },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sequence download progress & readiness state
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const isLoadedRef = useRef(false);

  // Scroll Progress across the pinned section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Fade & Display transforms
  // Initial content & dots fade out completely as soon as scroll begins (before scattering)
  const initialContentOpacity = useTransform(scrollYProgress, [0.0, 0.08], [1, 0]);
  const initialContentY = useTransform(scrollYProgress, [0.0, 0.08], [0, -20]);
  const initialDisplay = useTransform(scrollYProgress, (v) => (v >= 0.08 ? 'none' : 'block'));
  const initialPointerEvents = useTransform(scrollYProgress, (v) => (v < 0.08 ? 'auto' : 'none'));

  // OnePlace component reveals after image sequence scattering (holds strictly visible at opacity 1 at the end)
  const onePlaceOpacity = useTransform(scrollYProgress, (v) =>
    v < 0.58 ? 0 : v < 0.72 ? (v - 0.58) / 0.14 : 1
  );
  const onePlaceY = useTransform(scrollYProgress, (v) =>
    v < 0.58 ? 30 : v < 0.72 ? 30 * (1 - (v - 0.58) / 0.14) : 0
  );
  const onePlaceDisplay = useTransform(scrollYProgress, (v) => (v < 0.55 ? 'none' : 'flex'));
  const onePlacePointerEvents = useTransform(scrollYProgress, (v) => (v < 0.55 ? 'none' : 'auto'));

  // Reactive state for rendering logic
  const [isOnePlaceVisible, setIsOnePlaceVisible] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  // Canvas Image Sequence Cache & State
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const isMountedRef = useRef(true);
  const animFrameIdRef = useRef<number | null>(null);
  const currentFrameRef = useRef(0);
  const isScrubbingRef = useRef(false);

  // Monitor scroll progress to toggle scrubbing vs looping - only active when fully loaded
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (!isLoadedRef.current) return;

    // Trigger OnePlace count animation when scrolling into the reveal phase (after 0.58)
    setIsOnePlaceVisible(latest > 0.58);

    if (latest < 0.08) {
      isScrubbingRef.current = false;
      if (currentFrameRef.current > LOOP_END_FRAME) {
        currentFrameRef.current = 0;
        drawFrame(0);
      }
    } else {
      isScrubbingRef.current = true;
      // Map scroll progress 0.08 -> 0.58 to scatter frames 234 -> 362
      const progressRatio = Math.min(1, Math.max(0, (latest - 0.08) / 0.50));
      const targetFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(SCATTER_START_FRAME + progressRatio * (TOTAL_FRAMES - 1 - SCATTER_START_FRAME))
      );
      currentFrameRef.current = targetFrame;
      drawFrame(targetFrame);
    }
  });

  // Render frame to canvas
  const drawFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 1920;
      canvas.height = 1080;
    }

    let safetyTimer: NodeJS.Timeout | null = null;

    // If entire 363-image sequence is already cached, reuse immediately
    if (frameCache.size >= TOTAL_FRAMES) {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        imagesRef.current[i] = frameCache.get(i) || null;
      }
      setLoadProgress(100);
      setIsLoaded(true);
      isLoadedRef.current = true;
      drawFrame(0);
    } else {
      let loadedCount = 0;

      // Restore any already cached frames
      frameCache.forEach((img, idx) => {
        imagesRef.current[idx] = img;
        loadedCount++;
      });

      const initialPct = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));
      setLoadProgress(initialPct);

      const checkComplete = () => {
        if (loadedCount >= TOTAL_FRAMES) {
          setIsLoaded(true);
          isLoadedRef.current = true;
          setLoadProgress(100);
          drawFrame(0);
        }
      };

      // Helper to load single image frame and track progress across all 363 images
      const loadFrame = (index: number) => {
        if (frameCache.has(index)) return;

        const img = new Image();
        const paddedIndex = String(index).padStart(8, '0');
        img.src = `/new-dns-scatter/LOOP dna_${paddedIndex}.png`;

        img.onload = () => {
          if (!isMountedRef.current) return;
          imagesRef.current[index] = img;
          frameCache.set(index, img);
          loadedCount++;

          const pct = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));
          setLoadProgress(pct);

          // Render frame 0 as soon as it's ready
          if (index === 0 && !isScrubbingRef.current) {
            drawFrame(0);
          }

          checkComplete();
        };

        img.onerror = () => {
          if (!isMountedRef.current) return;
          loadedCount++;
          const pct = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));
          setLoadProgress(pct);
          checkComplete();
        };
      };

      // Dispatch load for all 363 frames (loop 0-233 and scatter 234-362)
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        loadFrame(i);
      }

      // Safety timeout to prevent infinite blocking on unstable connections
      safetyTimer = setTimeout(() => {
        if (!isMountedRef.current) return;
        if (!isLoadedRef.current) {
          setIsLoaded(true);
          isLoadedRef.current = true;
          setLoadProgress(100);
          drawFrame(0);
        }
      }, 25000);
    }

    // 234-frame Loop Animation Tick (24 fps) - runs only when fully loaded & ready
    let lastTime = performance.now();
    const fps = 24;
    const frameInterval = 1000 / fps;

    const loopTick = (now: number) => {
      if (!isMountedRef.current) return;

      if (isLoadedRef.current && !isScrubbingRef.current) {
        const delta = now - lastTime;
        if (delta >= frameInterval) {
          lastTime = now - (delta % frameInterval);
          currentFrameRef.current = (currentFrameRef.current + 1) % (LOOP_END_FRAME + 1);
          drawFrame(currentFrameRef.current);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loopTick);
    };

    animFrameIdRef.current = requestAnimationFrame(loopTick);

    return () => {
      isMountedRef.current = false;
      if (safetyTimer) clearTimeout(safetyTimer);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[280vh] select-none">
      {/* Global Preloader - stays active until all 363 image frames are loaded and ready for scroll */}
      <Preloader manual progress={loadProgress} isComplete={isLoaded} />

      {/* Sticky Hero Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-[5%]">
        {/* DNA Sequence Canvas Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover object-center mix-blend-multiply opacity-95"
            style={{
              transform: 'translate3d(0, 0, 0)',
              WebkitTransform: 'translate3d(0, 0, 0)',
            }}
          />
        </div>

        {/* Hotspots Layer (Fades out & set to display:none as soon as scrolling/scattering starts) */}
        <motion.div
          style={{
            opacity: initialContentOpacity,
            display: initialDisplay,
            pointerEvents: initialPointerEvents as unknown as 'auto' | 'none',
          }}
          className="absolute inset-0 z-20"
        >
          {HOTSPOTS.map((hotspot) => (
            <div
              key={hotspot.id}
              style={{ top: hotspot.top, left: hotspot.left }}
              className="absolute -translate-x-1/2 top-[80%] group cursor-pointer"
              onMouseEnter={() => setHoveredHotspot(hotspot.id)}
              onMouseLeave={() => setHoveredHotspot(null)}
            >
              {/* Hotspot Target Marker Ring */}
              <div className="relative flex items-center justify-center w-8 h-8">
                {/* Outer Pulsing Aura */}
                <span className="absolute w-8 h-8 rounded-full border border-zinc-800/40 animate-ping opacity-30" />

                {/* Concentric Target Ring */}
                <div className="w-6 h-6 rounded-full border-2 border-zinc-900/80 backdrop-blur-xs flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110">
                  <div className="w-2 h-2 rounded-full bg-[#036132]" />
                </div>
              </div>

              {/* Tooltip Content (Visible on Hover) */}
              <motion.div
                initial={false}
                animate={{
                  opacity: hoveredHotspot === hotspot.id ? 1 : 0,
                  scale: hoveredHotspot === hotspot.id ? 1 : 0.9,
                  x: hotspot.alignRight ? 12 : -12,
                }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none ${hotspot.alignRight ? 'left-full ml-2' : 'right-full mr-2 text-right'
                  }`}
              >
                <div className=" py-1.5 rounded-lg backdrop-blur-md">
                  <span className="text-sm md:text-xl font-bold tracking-tight text-[#EB7847] whitespace-pre">
                    {hotspot.text}
                  </span>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* Initial Hero Content (Headline & Eyebrow - Fades out & set to display:none as scroll starts) */}
        <motion.div
          style={{
            opacity: initialContentOpacity,
            y: initialContentY,
            display: initialDisplay,
            pointerEvents: initialPointerEvents as unknown as 'auto' | 'none',
          }}
          className="relative z-10 w-full max-w-5xl mt-auto"
        >
          {/* Eyebrow / Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl font-semibold text-zinc-900 tracking-tight mb-2 leading-none"
          >
            We believe the future of healthcare <br /> shouldn&apos;t feel foreign
          </motion.p>

          {/* Primary Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-[2.5rem] md:text-5xl lg:text-[50px] font-bold tracking-tight text-black leading-none sm:leading-[1.12]"
          >
            It Should Feel Like Healthcare Finally <br className="hidden lg:inline" />
            Understands The Way You Live
          </motion.h1>
        </motion.div>

        {/* OnePlace Component Overlay (Revealed ONLY at the end of the image sequence scattering) */}
        <motion.div
          style={{
            opacity: onePlaceOpacity,
            y: onePlaceY,
            display: onePlaceDisplay,
            pointerEvents: onePlacePointerEvents as unknown as 'auto' | 'none',
          }}
          className="absolute inset-0 z-30 flex items-center justify-center"
        >
          <OnePlace isVisible={isOnePlaceVisible} />
        </motion.div>
      </div>
    </section>
  );
}