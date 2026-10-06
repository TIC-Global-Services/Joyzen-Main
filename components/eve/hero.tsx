'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence, type MotionValue } from 'framer-motion';
import CalaThreeCircle from './CalaThreeCircle';

import {LiquidGlass}from '@liquidglass/react';
import TalkWithCala from './talkwithcala';

interface PillData {
  id: string;
  label: string;
  baseX: number; // base desktop offset X from center
  baseY: number; // base desktop offset Y from center
  angle: number; // angle in degrees from center
  driftX: number[];
  driftY: number[];
  rotateRange: number[];
  duration: number;
}

const PILLS: PillData[] = [
  {
    id: 'planning-pregnancy',
    label: 'Planning pregnancy',
    baseX: 0,
    baseY: -250,
    angle: -90,
    driftX: [0, 4, -4, 2, 0],
    driftY: [0, 8, -6, 2, 0],
    rotateRange: [0, 1.5, -1, 0.5, 0],
    duration: 5.0,
  },
  {
    id: 'irregular-ovulation',
    label: 'Irregular ovulation',
    baseX: -265,
    baseY: -185,
    angle: -140,
    driftX: [0, 4, -4, 2, 0],
    driftY: [0, 8, -6, 2, 0],
    rotateRange: [0, 1.5, -1, 0.5, 0],
    duration: 5.0,
  },
  {
    id: 'fertility-health',
    label: 'Fertility health',
    baseX: -490,
    baseY: 15,
    angle: 180,
    driftX: [0, 4, -4, 2, 0],
    driftY: [0, 8, -6, 2, 0],
    rotateRange: [0, 1.5, -1, 0.5, 0],
    duration: 5.0,
  },
  {
    id: 'natural-conception',
    label: 'Natural conception',
    baseX: -250,
    baseY: 190,
    angle: 140,
    driftX: [0, 4, -4, 2, 0],
    driftY: [0, 8, -6, 2, 0],
    rotateRange: [0, 1.5, -1, 0.5, 0],
    duration: 5.0,
  },
  {
    id: 'body-prep',
    label: 'Body preparation',
    baseX: 0,
    baseY: 255,
    angle: 90,
    driftX: [0, 4, -4, 2, 0],
    driftY: [0, 8, -6, 2, 0],
    rotateRange: [0, 1.5, -1, 0.5, 0],
    duration: 5.0,
  },
  {
    id: 'step-by-step',
    label: 'Step-by-step care',
    baseX: 225,
    baseY: 190,
    angle: 40,
    driftX: [0, 4, -4, 2, 0],
    driftY: [0, 8, -6, 2, 0],
    rotateRange: [0, 1.5, -1, 0.5, 0],
    duration: 5.0,
  },
  {
    id: 'hormone-opt',
    label: 'Hormone optimization',
    baseX: 490,
    baseY: 65,
    angle: 0,
    driftX: [0, 4, -4, 2, 0],
    driftY: [0, 8, -6, 2, 0],
    rotateRange: [0, 1.5, -1, 0.5, 0],
    duration: 5.0,
  },
  {
    id: 'conception-roadmap',
    label: 'Conception roadmap',
    baseX: 265,
    baseY: -185,
    angle: -40,
    driftX: [0, 4, -4, 2, 0],
    driftY: [0, 8, -6, 2, 0],
    rotateRange: [0, 1.5, -1, 0.5, 0],
    duration: 5.0,
  },
];

// Individual Pill Component with Collision Deflection & Physics
function CollidingPill({
  pill,
  scaleFactor,
  isMounted,
  isShocked,
  shockJoltX,
  shockJoltY,
  clickedPill,
  setClickedPill,
  mouseX,
  mouseY,
}: {
  pill: PillData;
  scaleFactor: number;
  isMounted: boolean;
  isShocked: boolean;
  shockJoltX: number;
  shockJoltY: number;
  clickedPill: string | null;
  setClickedPill: (id: string | null) => void;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const scaledX = pill.baseX * scaleFactor;
  const scaledY = pill.baseY * scaleFactor;

  // Real-time cursor collision deflection (repels nearby pills like physical air pucks)
  const repelX = useTransform([mouseX, mouseY], (values: unknown) => {
    const [mX, mY] = values as [number, number];
    const dx = scaledX - mX;
    const dy = scaledY - mY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const threshold = 175 * scaleFactor;
    if (dist < threshold && dist > 0) {
      const force = (1 - dist / threshold) * 26 * scaleFactor;
      return (dx / dist) * force;
    }
    return 0;
  });

  const repelY = useTransform([mouseX, mouseY], (values: unknown) => {
    const [mX, mY] = values as [number, number];
    const dx = scaledX - mX;
    const dy = scaledY - mY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const threshold = 175 * scaleFactor;
    if (dist < threshold && dist > 0) {
      const force = (1 - dist / threshold) * 26 * scaleFactor;
      return (dy / dist) * force;
    }
    return 0;
  });

  const springRepelX = useSpring(repelX, { stiffness: 220, damping: 18 });
  const springRepelY = useSpring(repelY, { stiffness: 220, damping: 18 });

  return (
    <motion.div
      className="absolute pointer-events-auto"
      style={{
        x: scaledX,
        y: scaledY,
      }}
      initial={
        isMounted
          ? {
              x: scaledX * 1.8,
              y: scaledY * 1.8,
              opacity: 0,
              scale: 0.6,
            }
          : false
      }
      animate={{
        x: scaledX + (isShocked ? shockJoltX : 0),
        y: scaledY + (isShocked ? shockJoltY : 0),
        opacity: 1,
        scale: isShocked ? 1.06 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 18,
      }}
    >
      {/* Physics-deflection layer (reacts to mouse collision repulsion) */}
      <motion.div
        style={{
          x: springRepelX,
          y: springRepelY,
        }}
      >
        {/* Continuous drift & soft collision bobbing */}
        <motion.div
          animate={{
            x: pill.driftX.map((v) => v * scaleFactor),
            y: pill.driftY.map((v) => v * scaleFactor),
            rotate: pill.rotateRange,
          }}
          transition={{
            duration: pill.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          // Interactive dragging enables user toss & spring recoil
          drag
          dragConstraints={{
            left: -70 * scaleFactor,
            right: 70 * scaleFactor,
            top: -70 * scaleFactor,
            bottom: 70 * scaleFactor,
          }}
          dragElastic={0.4}
          whileDrag={{
            scale: 1.12,
            zIndex: 60,
            cursor: 'grabbing',
            boxShadow: '0 20px 40px rgba(0,0,0,0.14)',
          }}
          whileHover={{
            scale: 1.08,
            cursor: 'grab',
            transition: { type: 'spring', stiffness: 400, damping: 15 },
          }}
          onClick={() => {
            setClickedPill(pill.id);
            setTimeout(() => setClickedPill(null), 600);
          }}
          className="relative group cursor-grab active:cursor-grabbing"
        >
          {/* LiquidGlass Pill Capsule */}
          <LiquidGlass
            borderRadius={9999}
            blur={1.5}
            contrast={1.12}
            brightness={1.04}
            saturation={1.15}
            shadowIntensity={0.05}
            displacementScale={0.8}
            elasticity={0.4}
            zIndex={20}
            className="transition-all duration-300 select-none border border-white/60 hover:border-white/90"
          >
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                padding: `${Math.max(8, 15 * scaleFactor)}px ${Math.max(16, 28 * scaleFactor)}px`,
              }}
            >
              {/* Subtle Top Glass Specular Shine */}
              {/* <div className="absolute inset-x-3 top-1 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" /> */}

              {/* Tactile Impact Ripple on Click */}
              {clickedPill === pill.id && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.9 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border-2 border-cyan-400 pointer-events-none"
                />
              )}

              {/* Pill Text Label */}
              <span
                className="font-semibold text-zinc-900 tracking-tight whitespace-nowrap leading-none transition-colors duration-200"
                style={{
                  fontSize: `clamp(11px, ${25 * scaleFactor}px, 16px)`,
                  color: '#1E2822',
                }}
              >
                {pill.label}
              </span>
            </div>
          </LiquidGlass>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function CalaHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [shockwaves, setShockwaves] = useState<number[]>([]);
  const [activeShockId, setActiveShockId] = useState<number | null>(null);
  const [clickedPill, setClickedPill] = useState<string | null>(null);

  // Mouse deflection coordinates relative to center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Handle responsive scaling
  useEffect(() => {
    setIsMounted(true);

    const updateScale = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setScaleFactor(0.52);
      } else if (w < 640) {
        setScaleFactor(0.64);
      } else if (w < 768) {
        setScaleFactor(0.74);
      } else if (w < 1024) {
        setScaleFactor(0.85);
      } else if (w < 1280) {
        setScaleFactor(0.94);
      } else {
        setScaleFactor(1);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Periodic orb collision shockwave pulse (every 4.8 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const newId = Date.now();
      setShockwaves((prev) => [...prev.slice(-2), newId]);
      setActiveShockId(newId);

      // Reset shock impulse after wave completes
      setTimeout(() => {
        setActiveShockId(null);
      }, 900);
    }, 4800);

    return () => clearInterval(interval);
  }, []);

  // Mouse move handler for repulsive collision physics
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-fullflex items-center justify-center overflow-hidden select-none bg-[#FAF8F5]"
    >
   

      {/* 2. Soft Ambient Radial Glow Behind Center */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-200/20 via-cyan-100/30 to-transparent blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />

      {/* 3. Main Stage Container */}
      <div className="relative z-10 w-full h-[640px] sm:h-[720px] lg:h-[720px] flex items-center justify-center mx-auto px-4">
        
        {/* Giant "CALA" Typography (Positioned across the center) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <h1
            className="text-[#DD9057] font-black tracking-[-0.035em] uppercase text-center flex items-center justify-center leading-none"
            style={{
              fontSize: 'clamp(100px, 80vw, 490px)',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 30px rgba(114, 178, 170, 0.08)',
            }}
          >
            EVE
          </h1>
        </div>

        {/* 4. Central Cyan Energy Orb & Collision Shockwaves */}
        <div className="relative z-10 flex items-center justify-center pointer-events-none">
          {/* Cyan Glow Halo Backdrops */}
          {/* <div className="absolute w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full bg-cyan-400/25 blur-3xl scale-125" />
          <div className="absolute w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] rounded-full bg-teal-400/20 blur-xl" /> */}

          {/* Shockwave Rings that fire periodically */}
          <AnimatePresence>
            {shockwaves.map((id) => (
              <motion.div
                key={`shock-${id}`}
                initial={{ scale: 0.8, opacity: 0.85, borderWidth: '3px' }}
                animate={{ scale: 2.8, opacity: 0, borderWidth: '1px' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-full border border-cyan-400 pointer-events-none"
              />
            ))}
          </AnimatePresence>

          {/* Central Sphere Wrapper - Fixed in Absolute Position */}
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              width: `clamp(200px, ${340 * scaleFactor}px, 360px)`,
              height: `clamp(200px, ${340 * scaleFactor}px, 360px)`,
            }}
          >
            {/* LiquidGlass Refractive Rim & Border around the 3D Sphere */}
            <LiquidGlass
              borderRadius={9999}
              blur={2}
              contrast={1.15}
              brightness={1.05}
              saturation={1.2}
              shadowIntensity={0.12}
              displacementScale={1.2}
              elasticity={0.5}
              zIndex={10}
              className="
      w-full
      h-full
      rounded-full
      p-2.5
      sm:p-5
      pointer-events-auto
      border
      border-white/60
      bg-white/5
      shadow-[0_20px_70px_rgba(36,168,184,0.35),inset_0_2px_4px_rgba(255,255,255,0.7)]
    "
            >
              <div
                className="
        relative
        w-full
        h-full
        rounded-full
        overflow-hidden
        flex
        items-center
        justify-center
      "
              >
                <CalaThreeCircle
                  mouseX={mouseX}
                  mouseY={mouseY}
                  isShocked={activeShockId !== null}
                  className="w-full h-full"
                />
              </div>
            </LiquidGlass>
          </div>
        </div>

        {/* 5. The 8 Colliding Floating Glassmorphic Pills */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          {PILLS.map((pill) => {
            const rad = (pill.angle * Math.PI) / 180;
            const shockJoltX = Math.cos(rad) * 14 * scaleFactor;
            const shockJoltY = Math.sin(rad) * 14 * scaleFactor;
            const isShocked = activeShockId !== null;

            return (
              <CollidingPill
                key={pill.id}
                pill={pill}
                scaleFactor={scaleFactor}
                isMounted={isMounted}
                isShocked={isShocked}
                shockJoltX={shockJoltX}
                shockJoltY={shockJoltY}
                clickedPill={clickedPill}
                setClickedPill={setClickedPill}
                mouseX={mouseX}
                mouseY={mouseY}
              />
            );
          })}
        </div>
      </div>
        <TalkWithCala />
    </section>
  );
}