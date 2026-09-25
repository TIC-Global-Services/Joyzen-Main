'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';
import OnePlace from './onePlace';
import Preloader from '@/reuseable/loader';

const TOTAL_FRAMES = 363; // Total frames: 0 to 362
const LOOP_END_FRAME = 233; // First 234 frames: 0 to 233 (looping when not scrolled)
const SCATTER_START_FRAME = 234; // Remaining 129 frames: 234 to 362 (rendered on scroll)
const FRAME_PATH_PREFIX = '/new-dns-scatter-q95/LOOP dna_';
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const LOOP_FPS = 24;
const LOOP_FRAME_INTERVAL_MS = 1000 / LOOP_FPS;
const SAFETY_TIMEOUT_MS = 25000;

// Scroll-progress timeline constants (fractions of the pinned section's scroll range)
const HOTSPOT_FADE_END = 0.08; // initial content/hotspots fully faded out by this point
const SCRUB_START = 0.08; // scatter scrubbing begins
const SCRUB_END = 0.58; // scatter scrubbing ends / reveal phase begins
const ONE_PLACE_REVEAL_START = 0.58;
const ONE_PLACE_REVEAL_END = 0.72;
const ONE_PLACE_VISIBLE_THRESHOLD = 0.58;
const ONE_PLACE_DISPLAY_THRESHOLD = 0.55;
const ONE_PLACE_Y_OFFSET = 30;
const HOTSPOT_Y_OFFSET = -20;

declare global {
  interface Window {
    __joyzen_vision_frame_cache?: Map<number, HTMLImageElement>;
    __joyzen_vision_in_flight?: Set<number>;
    __joyzen_vision_loaded?: boolean;
  }
}

const getFrameCache = (): Map<number, HTMLImageElement> => {
  if (typeof window === 'undefined') return new Map();
  if (!window.__joyzen_vision_frame_cache) {
    window.__joyzen_vision_frame_cache = new Map();
  }
  return window.__joyzen_vision_frame_cache;
};

const getInFlightSet = (): Set<number> => {
  if (typeof window === 'undefined') return new Set();
  if (!window.__joyzen_vision_in_flight) {
    window.__joyzen_vision_in_flight = new Set();
  }
  return window.__joyzen_vision_in_flight;
};

const SESSION_CACHE_KEY = 'joyzen_vision_loaded';

/**
 * Whether the full 363-frame sequence is genuinely available right now.
 *
 * This is the single source of truth for "fully loaded." It intentionally
 * does NOT trust sessionStorage on its own: sessionStorage survives a hard
 * page reload, but the in-memory Map of decoded HTMLImageElements
 * (window.__joyzen_vision_frame_cache) does not. Trusting the flag alone
 * previously let the component believe it was fully loaded (hiding the
 * preloader / unlocking scrubbing) immediately after a hard reload, while
 * the real image cache was actually empty.
 */
const isFullyCached = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.__joyzen_vision_loaded === true || getFrameCache().size >= TOTAL_FRAMES;
};

const markSessionLoaded = (): void => {
  if (typeof window === 'undefined') return;
  window.__joyzen_vision_loaded = true;
  try {
    // Best-effort hint only (see isFullyCached) - not treated as authoritative on read.
    sessionStorage.setItem(SESSION_CACHE_KEY, 'true');
  } catch {
    // Graceful fallback for restricted storage environments
  }
};

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

// Small typed helper so we don't repeat the `as unknown as 'auto' | 'none'` cast
// every time we derive a pointer-events value from a MotionValue<number>.
const usePointerEventsFromProgress = (
  scrollYProgress: MotionValue<number>,
  threshold: number,
  belowThreshold: 'auto' | 'none',
  atOrAboveThreshold: 'auto' | 'none'
) =>
  useTransform(scrollYProgress, (v) =>
    v < threshold ? belowThreshold : atOrAboveThreshold
  ) as unknown as MotionValue<'auto' | 'none'>;

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sequence download progress & readiness state - initialized directly from
  // the real frame cache (see isFullyCached for why sessionStorage alone isn't trusted).
  const [loadProgress, setLoadProgress] = useState(() => {
    if (typeof window === 'undefined') return 0;
    if (isFullyCached()) return 100;
    return Math.min(100, Math.round((getFrameCache().size / TOTAL_FRAMES) * 100));
  });

  const [isLoaded, setIsLoaded] = useState(() => isFullyCached());
  const isLoadedRef = useRef(isFullyCached());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll Progress across the pinned section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Fade & Display transforms
  // Initial content & dots fade out completely as soon as scroll begins (before scattering)
  const initialContentOpacity = useTransform(scrollYProgress, [0.0, HOTSPOT_FADE_END], [1, 0]);
  const initialContentY = useTransform(scrollYProgress, [0.0, HOTSPOT_FADE_END], [0, HOTSPOT_Y_OFFSET]);
  const initialDisplay = useTransform(scrollYProgress, (v) => (v >= HOTSPOT_FADE_END ? 'none' : 'block'));
  const initialPointerEvents = usePointerEventsFromProgress(scrollYProgress, HOTSPOT_FADE_END, 'auto', 'none');

  // OnePlace component reveals after image sequence scattering (holds strictly visible at opacity 1 at the end)
  const onePlaceOpacity = useTransform(scrollYProgress, (v) =>
    v < ONE_PLACE_REVEAL_START
      ? 0
      : v < ONE_PLACE_REVEAL_END
        ? (v - ONE_PLACE_REVEAL_START) / (ONE_PLACE_REVEAL_END - ONE_PLACE_REVEAL_START)
        : 1
  );
  const onePlaceY = useTransform(scrollYProgress, (v) =>
    v < ONE_PLACE_REVEAL_START
      ? ONE_PLACE_Y_OFFSET
      : v < ONE_PLACE_REVEAL_END
        ? ONE_PLACE_Y_OFFSET * (1 - (v - ONE_PLACE_REVEAL_START) / (ONE_PLACE_REVEAL_END - ONE_PLACE_REVEAL_START))
        : 0
  );
  const onePlaceDisplay = useTransform(scrollYProgress, (v) => (v < ONE_PLACE_DISPLAY_THRESHOLD ? 'none' : 'flex'));
  const onePlacePointerEvents = usePointerEventsFromProgress(scrollYProgress, ONE_PLACE_DISPLAY_THRESHOLD, 'none', 'auto');

  // Reactive state for rendering logic
  const [isOnePlaceVisible, setIsOnePlaceVisible] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  // Canvas Image Sequence Cache & State
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const isMountedRef = useRef(true);
  const animFrameIdRef = useRef<number | null>(null);
  const currentFrameRef = useRef(0);
  const isScrubbingRef = useRef(false);

  // Render frame to canvas. Declared before first use (previously referenced
  // inside useMotionValueEvent above its own declaration later in the file -
  // functionally fine due to closure timing, but confusing to read top-to-bottom).
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

  // Monitor scroll progress to toggle scrubbing vs looping - only active when fully loaded
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (!isLoadedRef.current) return;

    // Trigger OnePlace count animation when scrolling into the reveal phase
    setIsOnePlaceVisible(latest > ONE_PLACE_VISIBLE_THRESHOLD);

    if (latest < SCRUB_START) {
      isScrubbingRef.current = false;
      if (currentFrameRef.current > LOOP_END_FRAME) {
        currentFrameRef.current = 0;
        drawFrame(0);
      }
    } else {
      isScrubbingRef.current = true;
      // Map scroll progress SCRUB_START -> SCRUB_END to scatter frames SCATTER_START_FRAME -> TOTAL_FRAMES-1
      const progressRatio = Math.min(1, Math.max(0, (latest - SCRUB_START) / (SCRUB_END - SCRUB_START)));
      const targetFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(SCATTER_START_FRAME + progressRatio * (TOTAL_FRAMES - 1 - SCATTER_START_FRAME))
      );
      currentFrameRef.current = targetFrame;
      drawFrame(targetFrame);
    }
  });

  useEffect(() => {
    isMountedRef.current = true;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }

    const frameCache = getFrameCache();
    const inFlight = getInFlightSet();
    let safetyTimer: NodeJS.Timeout | null = null;

    // Tracks every frame that has SETTLED - loaded OR errored - so completion
    // is based on "nothing left in flight," not on a counter that conflated
    // successes and failures (the previous `loadedCount` bug: an errored frame
    // incremented loadedCount without ever being added to frameCache, so
    // completion could be declared while frames were genuinely missing).
    const settledIndices = new Set<number>();

    // If entire 363-image sequence is already genuinely cached, reuse immediately
    if (isFullyCached()) {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        imagesRef.current[i] = frameCache.get(i) || null;
      }
      markSessionLoaded();
      setLoadProgress(100);
      setIsLoaded(true);
      isLoadedRef.current = true;
      drawFrame(0);
    } else {
      // Restore any already cached frames into current ref
      frameCache.forEach((img, idx) => {
        imagesRef.current[idx] = img;
        settledIndices.add(idx);
      });

      const initialPct = Math.min(100, Math.round((frameCache.size / TOTAL_FRAMES) * 100));
      setLoadProgress(initialPct);

      // Render frame 0 as soon as available
      if (frameCache.has(0) && !isScrubbingRef.current) {
        drawFrame(0);
      }

      const checkComplete = () => {
        if (settledIndices.size < TOTAL_FRAMES) return;
        markSessionLoaded();
        if (isMountedRef.current) {
          setIsLoaded(true);
          isLoadedRef.current = true;
          setLoadProgress(100);
          drawFrame(0);
        }
      };

      // Helper to load a single image frame and track progress across all 363 images
      const loadFrame = (index: number) => {
        if (frameCache.has(index)) return;
        if (inFlight.has(index)) return;
        inFlight.add(index);

        const img = new Image();
        const paddedIndex = String(index).padStart(8, '0');
        img.src = `${FRAME_PATH_PREFIX}${paddedIndex}.webp`;

        img.onload = () => {
          inFlight.delete(index);
          // CRITICAL: Always persist to global cache regardless of whether component is mounted
          frameCache.set(index, img);
          settledIndices.add(index);

          if (!isMountedRef.current) return;
          imagesRef.current[index] = img;

          const pct = Math.min(100, Math.round((frameCache.size / TOTAL_FRAMES) * 100));
          setLoadProgress(pct);

          // Render frame 0 as soon as it's ready
          if (index === 0 && !isScrubbingRef.current) {
            drawFrame(0);
          }

          checkComplete();
        };

        img.onerror = () => {
          inFlight.delete(index);
          settledIndices.add(index); // settled (failed), but never added to frameCache
          if (!isMountedRef.current) return;

          const pct = Math.min(100, Math.round((frameCache.size / TOTAL_FRAMES) * 100));
          setLoadProgress(pct);
          checkComplete();
        };
      };

      // Dispatch load for all 363 frames (skips already cached and in-flight)
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        loadFrame(i);
      }

      // Safety timeout to prevent infinite blocking on unstable connections
      safetyTimer = setTimeout(() => {
        if (!isMountedRef.current) return;
        if (!isLoadedRef.current) {
          markSessionLoaded();
          setIsLoaded(true);
          isLoadedRef.current = true;
          setLoadProgress(100);
          drawFrame(0);
        }
      }, SAFETY_TIMEOUT_MS);
    }

    // 234-frame Loop Animation Tick (24 fps) - runs only when fully loaded & ready
    let lastTime = performance.now();

    const loopTick = (now: number) => {
      if (!isMountedRef.current) return;

      if (isLoadedRef.current && !isScrubbingRef.current) {
        const delta = now - lastTime;
        if (delta >= LOOP_FRAME_INTERVAL_MS) {
          lastTime = now - (delta % LOOP_FRAME_INTERVAL_MS);
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
      <div className="sticky -top-[10%] md:top-0 w-full h-screen overflow-hidden flex flex-col justify-between pt-0 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-[5%]">
        {/* DNA Sequence Canvas Layer */}
        <div className="absolute inset-0 sm:w-full h-full pointer-events-none z-0 flex items-center justify-center">
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
            pointerEvents: initialPointerEvents,
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
              onClick={() => setHoveredHotspot((prev) => (prev === hotspot.id ? null : hotspot.id))}
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

              {/* Tooltip Content (Visible on Hover / Tap) */}
              <motion.div
                initial={false}
                animate={{
                  opacity: hoveredHotspot === hotspot.id ? 1 : 0,
                  scale: hoveredHotspot === hotspot.id ? 1 : 0.9,
                  x: isMobile ? -8 : (hotspot.alignRight ? 12 : -12),
                }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none right-full mr-2 text-right ${hotspot.alignRight
                  ? 'md:left-full md:right-auto md:ml-2 md:mr-0 md:text-left'
                  : 'md:right-full md:mr-2 md:text-right'
                  }`}
              >
                <div className="py-0 sm:py-1.5"> 
                  <span className="block text-sm md:text-xl font-bold tracking-tight text-[#EB7847] leading-[0.95] md:leading-[1.2] whitespace-pre">
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
            pointerEvents: initialPointerEvents,
          }}
          className="relative z-10 w-full max-w-5xl mt-auto mb-10 sm:mb-0"
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
            className="text-[2rem] md:text-5xl lg:text-[50px] font-bold tracking-tight text-black leading-none sm:leading-[1.12]"
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
            pointerEvents: onePlacePointerEvents,
          }}
          className="absolute inset-0 z-30 flex items-center justify-center"
        >
          <OnePlace isVisible={isOnePlaceVisible} />
        </motion.div>
      </div>
    </section>
  );
}