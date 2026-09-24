'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import OnePlace from './onePlace';

const TOTAL_FRAMES = 389; // rename dna_00000.png to rename dna_00192.png
const LOOP_END_FRAME = 259; // First 60 frames: 0 to 59

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

  // Monitor scroll progress to toggle scrubbing vs looping
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // Trigger OnePlace count animation when scrolling into the reveal phase (after 0.58)
    setIsOnePlaceVisible(latest > 0.58);

    if (latest < 0.08) {
      isScrubbingRef.current = false;
    } else {
      isScrubbingRef.current = true;
      // Map scroll progress 0.08 -> 0.58 to frames 60 -> 192 (scrubbing image sequence)
      const progressRatio = Math.min(1, Math.max(0, (latest - 0.08) / 0.50));
      const targetFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(260 + progressRatio * (TOTAL_FRAMES - 1 - 260))
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

    let loadedCount = 0;

    // Helper to load single image frame
    const loadFrame = (index: number) => {
      if (imagesRef.current[index]) return;
      const img = new Image();
      const paddedIndex = String(index).padStart(8, '0');
      img.src = `/new-dns-scatter/rename dna_${paddedIndex}.png`;
      img.onload = () => {
        if (!isMountedRef.current) return;
        imagesRef.current[index] = img;
        loadedCount++;

        // Dispatch load progress for the initial loop sequence (0-59)
        if (index <= LOOP_END_FRAME && typeof window !== 'undefined') {
          const pct = Math.min(100, Math.round((loadedCount / (LOOP_END_FRAME + 1)) * 100));
          window.dispatchEvent(
            new CustomEvent('dna-progress', {
              detail: {
                progress: pct,
                isComplete: loadedCount >= (LOOP_END_FRAME + 1),
              },
            })
          );
        }

        // Render frame 0 as soon as it's ready
        if (index === 0 && !isScrubbingRef.current) {
          drawFrame(0);
        }
      };
    };

    // Preload loop frames (0-59) first
    for (let i = 0; i <= LOOP_END_FRAME; i++) {
      loadFrame(i);
    }

    // Preload remaining frames (60-192) in background
    setTimeout(() => {
      if (!isMountedRef.current) return;
      for (let i = LOOP_END_FRAME + 1; i < TOTAL_FRAMES; i++) {
        loadFrame(i);
      }
    }, 150);

    // 60-frame Loop Animation Tick (24 fps)
    let lastTime = performance.now();
    const fps = 24;
    const frameInterval = 1000 / fps;

    const loopTick = (now: number) => {
      if (!isMountedRef.current) return;

      if (!isScrubbingRef.current) {
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
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[280vh] select-none">
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