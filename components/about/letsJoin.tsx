'use client';

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── constants ─── */
const TOTAL_FRAMES = 403; // 00000 → 00402
const FRAME_STEP = 2;     // use every 2nd frame for faster loading

/* ─── honeycomb background (matches DesignedForToday) ─── */
const HoneycombBackground = React.memo(() => (
  <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden z-0">
    <svg className="w-full h-full" width="100%" height="100%">
      <pattern
        id="honeycomb-letsjoin"
        width="60"
        height="104"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M30 0 L60 17.32 L60 51.96 L30 69.28 L0 51.96 L0 17.32 Z M30 52 L60 69.32 L60 103.96 L30 121.28 L0 103.96 L0 69.32 Z"
          fill="none"
          stroke="#D1D5DB"
          strokeWidth="1"
        />
      </pattern>
      <rect width="100%" height="100%" fill="url(#honeycomb-letsjoin)" />
    </svg>
  </div>
));
HoneycombBackground.displayName = 'HoneycombBackground';

/* ─── main component ─── */
export default function LetsJoin() {
  /* refs */
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);

  /* state */
  const [imagesLoaded, setImagesLoaded] = useState(false);

  /* ─── memoised frame paths (every FRAME_STEP-th frame) ─── */
  const framePaths = useMemo(() => {
    const paths: string[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i += FRAME_STEP) {
      const idx = String(i).padStart(5, '0');
      paths.push(`/tab-sequence/IPAD PNG_${idx}.png`);
    }
    return paths;
  }, []);

  const frameCount = framePaths.length;

  /* ─── preload images ─── */
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    framePaths.forEach((src, i) => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        if (cancelled) return;
        images[i] = img;
        loaded++;
        /* draw first frame as soon as it loads */
        if (i === 0 && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            canvasRef.current.width = img.naturalWidth;
            canvasRef.current.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
          }
        }
        if (loaded === framePaths.length) {
          imagesRef.current = images;
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loaded++;
        if (loaded === framePaths.length && !cancelled) {
          imagesRef.current = images;
          setImagesLoaded(true);
        }
      };
    });

    return () => {
      cancelled = true;
    };
  }, [framePaths]);

  /* ─── draw a specific frame on the canvas ─── */
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const img = imagesRef.current[index];
      if (!canvas || !img) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    },
    [],
  );

  /* ─── GSAP ScrollTrigger pin + scrub ─── */
  useEffect(() => {
    if (!imagesLoaded) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        pin: pinRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const nextIndex = Math.min(
            frameCount - 1,
            Math.max(0, Math.round(self.progress * (frameCount - 1))),
          );
          if (nextIndex !== frameIndexRef.current) {
            frameIndexRef.current = nextIndex;
            drawFrame(nextIndex);
          }
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [imagesLoaded, frameCount, drawFrame]);

  return (
    <div ref={wrapperRef} className="relative" style={{ height: '300vh' }}>
      <section
        ref={pinRef}
        id="lets-join"
        className="relative w-full h-screen flex flex-col items-center justify-center  overflow-hidden select-none"
      >
        <HoneycombBackground />

        {/* ─── Top-Right Flower ─── */}
        <motion.div
          initial={{ opacity: 0, x: 50, y: -30 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -top-6 sm:-top-10 -right-16 sm:-right-10 md:-right-6 pointer-events-none select-none z-[1] rotate-[160deg]"
        >
          <div className="relative w-[220px] sm:w-[280px] md:w-[340px] lg:w-[400px] aspect-[499/566]">
            <Image
              src="/flowers.svg"
              alt="Decorative flowers top right"
              fill
              className="object-contain drop-shadow-xs"
            />
          </div>
        </motion.div>

        {/* ─── Bottom-Left Flower ─── */}
        <motion.div
          initial={{ opacity: 0, x: -50, y: 40 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="absolute -bottom-6 sm:-bottom-10 -left-10 sm:left-0 pointer-events-none select-none z-[100]"
        >
          <div className="relative w-[200px] sm:w-[260px] md:w-[320px] lg:w-[580px] aspect-[499/566]">
            <Image
              src="/flowers.svg"
              alt="Decorative flowers bottom left"
              fill
              className="object-contain object-left-bottom drop-shadow-xs"
            />
          </div>
        </motion.div>

        {/* ─── Text Content ─── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-start justify-between gap-6 lg:gap-12 mb-8 sm:mb-12">
          {/* Left headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[1.75rem] sm:text-3xl md:text-[2.2rem] lg:text-[2.5rem] font-bold text-black tracking-tight leading-[1.15] max-w-xl"
          >
            Let&apos;s join the dots your healthcare keeps missing. And let&apos;s
            make you smile a little more today.
          </motion.h2>

          {/* Right paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="text-sm sm:text-base lg:text-lg text-zinc-600 font-medium leading-relaxed max-w-md lg:mt-2"
          >
            Talk to our team. They&apos;ll show you exactly how it feels when your
            doctor, your health and your day are finally on the same page.
          </motion.p>
        </div>

        {/* ─── Canvas Image Sequence ─── */}
        <div className="relative z-10 w-full ">
          <canvas
            ref={canvasRef}
            className="w-full h-auto"
            style={{ display: 'block' }}
          />

          {/* Subtle loading indicator */}
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-[3px] border-[#036132] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Loading…
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}