'use client';

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import tabSequenceData from '@/data/tabSequence.json';
import mobSequenceData from '@/data/mobSequence.json';

gsap.registerPlugin(ScrollTrigger);

/* ─── constants ─── */
const DESKTOP_TOTAL_FRAMES = tabSequenceData.assets.length; // 387 frames from ImageKit
const DESKTOP_FRAME_STEP = 2;     // use every 2nd frame for faster loading

const MOBILE_TOTAL_FRAMES = mobSequenceData.assets.length;  // 121 frames from ImageKit
const MOBILE_FRAME_STEP = 1;      // step 1 for mobile animation

/* ─── dynamic text content for before & after frame 270 (~70% progress) ─── */
const INITIAL_CONTENT = {
  headline: "Let's join the dots your healthcare keeps missing. And let's make you smile a little more today.",
  paragraph: "Talk to our team. They'll show you exactly how it feels when your doctor, your health and your day are finally on the same page.",
};

const POST_270_CONTENT = {
  headline: "Care, connected and built for your life. Ready when you are.",
  paragraph: "Begin your personalized healthcare journey today. Speak with our experts and experience seamless, doctor-guided care.",
};


/* ─── main component ─── */
export default function LetsJoin() {
  /* refs */
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(-1);

  /* state */
  const [isMobile, setIsMobile] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isAfter270, setIsAfter270] = useState(false);

  /* ─── detect mobile viewport ─── */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* ─── memoised frame paths (desktop vs mobile) ─── */
  const framePaths = useMemo(() => {
    const paths: string[] = [];
    if (isMobile) {
      const mobAssets = mobSequenceData.assets;
      for (let i = 0; i < MOBILE_TOTAL_FRAMES; i += MOBILE_FRAME_STEP) {
        if (mobAssets[i]) {
          paths.push(mobAssets[i].u + mobAssets[i].p);
        }
      }
    } else {
      const tabAssets = tabSequenceData.assets;
      for (let i = 0; i < DESKTOP_TOTAL_FRAMES; i += DESKTOP_FRAME_STEP) {
        if (tabAssets[i]) {
          paths.push(tabAssets[i].u + tabAssets[i].p);
        }
      }
    }
    return paths;
  }, [isMobile]);

  const frameCount = framePaths.length;

  /* ─── preload images ─── */
  useEffect(() => {
    let cancelled = false;
    setImagesLoaded(false);
    frameIndexRef.current = -1;
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
          const isPast = self.progress >= 270 / 387;
          setIsAfter270((prev) => (prev !== isPast ? isPast : prev));
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
        className="relative w-full h-screen flex flex-col items-center justify-between overflow-hidden select-none px-0 sm:px-6 lg:px-12 pt-16 sm:pt-20 lg:pt-24 pb-0"
      > 
      <div className="h-16 w-40 bg-[#f0f0f0] absolute -top-10  -right-5 z-40 blur-sm pointer-events-none"></div>

        {/* ─── Top-Right Flower ─── */}
        <motion.div
          initial={{ opacity: 0, x: 50, y: -30 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -top-6 sm:-top-10 -right-1 sm:-right-10 md:-right-6 pointer-events-none select-none z-[1] rotate-[180deg]"
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
          className="absolute -bottom-6 sm:-bottom-10 -left-5 sm:left-0 pointer-events-none select-none z-[100]"
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

        {/* ─── Top Content & CTA Area ─── */}
        <div className="relative z-10 w-full flex flex-col px-4">
          {/* ─── Text Content (Dynamic before / after frame 270) ─── */}
          <div className="w-full min-h-[90px] sm:min-h-[110px] mb-3 sm:mb-4">
            <AnimatePresence mode="wait">
              {!isAfter270 ? (
                <motion.div
                  key="initial-state"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-6 lg:gap-12 w-full"
                >
                  {/* Left headline */}
                  <h2 className="text-[1.75rem] sm:text-3xl md:text-[2.2rem] lg:text-[2.125rem] font-bold text-black tracking-tight leading-[1.1] max-w-xl">
                    {INITIAL_CONTENT.headline}
                  </h2>

                  {/* Right paragraph */}
                  <p className="text-sm sm:text-[22px] lg:text-[22px] text-black font-medium leading-[1.2] text-left lg:text-right max-w-md  tracking-tight lg:mt-2">
                    {INITIAL_CONTENT.paragraph}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="post-270-state"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-6 lg:gap-12 w-full"
                >
                  {/* Left headline */}
                  <h2 className="text-[1.75rem] sm:text-3xl md:text-[2.125rem] lg:text-[2.125rem] font-bold text-black tracking-tight leading-[1.15] max-w-xl">
                    {POST_270_CONTENT.headline}
                  </h2>

                  {/* Right paragraph */}
                  <p className="text-sm sm:text-[22px] lg:text-[22px] text-black font-medium leading-[1.2] text-left lg:text-right max-w-xl tracking-tight lg:mt-2">
                    {POST_270_CONTENT.paragraph}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── Center CTA (Appears after Frame 270) ─── */}
          <div className="relative z-20 flex justify-start lg:justify-center items-center w-full h-9">
            <motion.div
              animate={{
                opacity: isAfter270 ? 1 : 0,
                y: isAfter270 ? 0 : 10,
                scale: isAfter270 ? 1 : 0.95,
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={isAfter270 ? 'pointer-events-auto' : 'pointer-events-none'}
            >
              <Link
                href="/q-form"
                className="inline-flex items-center md:justify-start lg:justify-center px-6 sm:px-7 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wider text-zinc-900 bg-[#AEDEE4]/60 hover:bg-[#95C1E2]/80 border border-white/80 backdrop-blur-md uppercase transition-all duration-300 shadow-xs hover:scale-105 active:scale-95"
              >
                START YOUR CARE JOURNEY
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ─── Canvas Image Sequence (Anchored to Bottom) ─── */}
        <div className="relative mt-auto translate-y-6 z-10 w-full flex-1 flex justify-center items-end overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full min-h-[5vh] sm:max-h-[95vh] lg:max-h-[95vh] object-cover md:object-contain object-bottom  origin-bottom"
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