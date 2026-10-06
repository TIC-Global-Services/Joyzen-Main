'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CalaThreeCircle from './CalaThreeCircle';
import { LiquidGlass } from '@liquidglass/react';
import TalkCareButton from '@/components/shared/TalkCareButton';
import { useScrollSequenceControls } from '@/components/shared/useScrollSequenceControls';
import { ATLAS_SEQUENCE_CONFIG } from './3dconfig';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------
interface PillData {
  id: string; label: string; baseX: number; baseY: number; mobileX?: number; mobileY?: number; angle: number; driftX: number[]; driftY: number[]; rotateRange: number[]; duration: number;
}
const PILLS: PillData[] = [
  { id: 'sperm-health', label: 'Sperm health', baseX: 0, baseY: -250, mobileX: 200, mobileY: -160, angle: -90, driftX: [0, 4, -4, 2, 0], driftY: [0, 8, -6, 2, 0], rotateRange: [0, 1.5, -1, 0.5, 0], duration: 5.0 },
  { id: 'low-testosterone', label: 'Low testosterone', baseX: -265, baseY: -185, mobileX: -200, mobileY: -160, angle: -140, driftX: [0, 4, -4, 2, 0], driftY: [0, 8, -6, 2, 0], rotateRange: [0, 1.5, -1, 0.5, 0], duration: 5.0 },
  { id: 'stamina', label: 'Stamina', baseX: -490, baseY: 15, mobileX: -260, mobileY: 0, angle: 180, driftX: [0, 4, -4, 2, 0], driftY: [0, 8, -6, 2, 0], rotateRange: [0, 1.5, -1, 0.5, 0], duration: 5.0 },
  { id: 'hormones', label: 'Hormones', baseX: -250, baseY: 190, mobileX: -200, mobileY: 160, angle: 140, driftX: [0, 4, -4, 2, 0], driftY: [0, 8, -6, 2, 0], rotateRange: [0, 1.5, -1, 0.5, 0], duration: 5.0 },
  { id: 'fertility', label: 'Fertility', baseX: 0, baseY: 255, mobileX: 0, mobileY: -280, angle: 90, driftX: [0, 4, -4, 2, 0], driftY: [0, 8, -6, 2, 0], rotateRange: [0, 1.5, -1, 0.5, 0], duration: 5.0 },
  { id: 'sexual-health', label: 'Sexual health', baseX: 225, baseY: 190, mobileX: 200, mobileY: 160, angle: 40, driftX: [0, 4, -4, 2, 0], driftY: [0, 8, -6, 2, 0], rotateRange: [0, 1.5, -1, 0.5, 0], duration: 5.0 },
  { id: 'lifestyle', label: 'Lifestyle', baseX: 490, baseY: 65, mobileX: 260, mobileY: 0, angle: 0, driftX: [0, 4, -4, 2, 0], driftY: [0, 8, -6, 2, 0], rotateRange: [0, 1.5, -1, 0.5, 0], duration: 5.0 },
  { id: 'semen-analysis', label: 'Semen analysis', baseX: 265, baseY: -185, mobileX: 0, mobileY: 280, angle: -40, driftX: [0, 4, -4, 2, 0], driftY: [0, 8, -6, 2, 0], rotateRange: [0, 1.5, -1, 0.5, 0], duration: 5.0 },
];

interface ChatItem {
  id: string; sender: string; isCala: boolean; avatarType: 'orange-dot' | 'cala-orb'; message: string; time: string; side: 'left' | 'right'; offsetX: number; offsetY: number; driftX: number[]; driftY: number[]; duration: number;
}
const CHAT_SEQUENCE: ChatItem[] = [
  { id: 'msg-1', sender: 'Rahul', isCala: false, avatarType: 'orange-dot', message: "I'm worried about my fertility report.", time: '10:24 AM', side: 'left', offsetX: -360, offsetY: -155, driftX: [0, 5, -4, 2, 0], driftY: [0, 6, -5, 2, 0], duration: 5.2 },
  { id: 'msg-2', sender: 'ATLAS Care Team', isCala: true, avatarType: 'cala-orb', message: "We can help explain your semen analysis and review your fertility progress.", time: '10:25 AM', side: 'left', offsetX: -250, offsetY: 15, driftX: [0, -6, 5, -2, 0], driftY: [0, -7, 6, -2, 0], duration: 5.6 },
  { id: 'msg-3', sender: 'Rahul', isCala: false, avatarType: 'orange-dot', message: "Thank You, ATLAS", time: '10:26 AM', side: 'left', offsetX: -370, offsetY: 180, driftX: [0, 4, -5, 3, 0], driftY: [0, 5, -6, 2, 0], duration: 4.8 },
  { id: 'msg-4', sender: 'Aman', isCala: false, avatarType: 'orange-dot', message: "Can I track my hormones too?", time: '10:28 AM', side: 'right', offsetX: 720, offsetY: -145, driftX: [0, -8, 4, -2, 0], driftY: [0, 6, -6, 2, 0], duration: 5.0 },
  { id: 'msg-5', sender: 'ATLAS Care Team', isCala: true, avatarType: 'cala-orb', message: "Yes. Your plan includes hormone tracking and fertility readiness support.", time: '10:29 AM', side: 'right', offsetX: 580, offsetY: 20, driftX: [0, 7, -6, 2, 0], driftY: [0, -5, 7, -3, 0], duration: 5.4 },
  { id: 'msg-6', sender: 'Aman', isCala: false, avatarType: 'orange-dot', message: "Thank You, ATLAS", time: '10:30 AM', side: 'right', offsetX: 580, offsetY: 185, driftX: [0, -4, 5, -2, 0], driftY: [0, -6, 5, -2, 0], duration: 5.1 },
];

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}
const FAQ_SEQUENCE: FaqItem[] = [
  {
    id: 1,
    question: '1. What do my sperm results mean?',
    answer: 'Your symptoms, questions, and progress can be reviewed with guided support from your care team.',
  },
  {
    id: 2,
    question: '2. How can I track fertility progress?',
    answer: 'Your symptoms, questions, and progress can be reviewed with guided support from your care team.',
  },
  {
    id: 3,
    question: '3. Can I understand my hormone results?',
    answer: 'Your symptoms, questions, and progress can be reviewed with guided support from your care team.',
  },
  {
    id: 4,
    question: '4. Can lifestyle affect sperm health?',
    answer: 'Your symptoms, questions, and progress can be reviewed with guided support from your care team.',
  },
  {
    id: 5,
    question: '5. When should I seek further care?',
    answer: 'Your symptoms, questions, and progress can be reviewed with guided support from your care team.',
  },
];

// ----------------------------------------------------------------------
// ADAPTIVE GLASS: Pure CSS Glassmorphism on Mobile, LiquidGlass on Desktop
// ----------------------------------------------------------------------
interface AdaptiveGlassProps {
  isMobile?: boolean;
  borderRadius?: number;
  blur?: number;
  contrast?: number;
  brightness?: number;
  saturation?: number;
  shadowIntensity?: number;
  displacementScale?: number;
  elasticity?: number;
  zIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

function AdaptiveGlass({
  isMobile = false,
  borderRadius = 20,
  blur = 2,
  contrast = 1.12,
  brightness = 1.04,
  saturation = 1.15,
  shadowIntensity = 0.08,
  displacementScale = 0.8,
  elasticity = 0.4,
  zIndex = 10,
  className = '',
  style,
  children,
}: AdaptiveGlassProps) {
  return (
    <LiquidGlass
      borderRadius={borderRadius}
      blur={blur}
      contrast={contrast}
      brightness={brightness}
      saturation={saturation}
      shadowIntensity={shadowIntensity}
      displacementScale={displacementScale}
      elasticity={elasticity}
      zIndex={zIndex}
      className={className}
    >
      {children}
    </LiquidGlass>
  );
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------
function CollidingPill({
  pill,
  targetX,
  targetY,
  scaleFactor,
  isMounted,
  isShocked,
  shockJoltX,
  shockJoltY,
  clickedPill,
  setClickedPill,
  mouseX,
  mouseY,
  isMobile,
}: any) {
  const scaledX = targetX * scaleFactor;
  const scaledY = targetY * scaleFactor;

  const repelX = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const repelY = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  useEffect(() => {
    if (isMobile) return;
    return mouseX.on('change', (mX: number) => {
      const mY = mouseY.get();
      const dx = scaledX - mX;
      const dy = scaledY - mY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const threshold = 175 * scaleFactor;
      if (dist < threshold && dist > 0) {
        repelX.set((dx / dist) * ((1 - dist / threshold) * 26 * scaleFactor));
        repelY.set((dy / dist) * ((1 - dist / threshold) * 26 * scaleFactor));
      } else {
        repelX.set(0);
        repelY.set(0);
      }
    });
  }, [mouseX, mouseY, scaledX, scaledY, scaleFactor, repelX, repelY, isMobile]);

  return (
    <motion.div
      className="absolute pointer-events-auto will-change-transform"
      style={{ x: scaledX, y: scaledY }}
      initial={isMounted ? { x: scaledX * 1.8, y: scaledY * 1.8, opacity: 0, scale: 0.6 } : false}
      animate={{
        x: scaledX + (isShocked ? shockJoltX : 0),
        y: scaledY + (isShocked ? shockJoltY : 0),
        opacity: 1,
        scale: isShocked ? 1.06 : 1,
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 18 }}
    >
      <motion.div style={{ x: repelX, y: repelY }}>
        <motion.div
          animate={
            isMobile
              ? undefined
              : {
                x: pill.driftX.map((v: number) => v * scaleFactor),
                y: pill.driftY.map((v: number) => v * scaleFactor),
                rotate: pill.rotateRange,
              }
          }
          transition={{ duration: pill.duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          drag
          dragConstraints={{ left: -70 * scaleFactor, right: 70 * scaleFactor, top: -70 * scaleFactor, bottom: 70 * scaleFactor }}
          dragElastic={0.4}
          whileDrag={{ scale: 1.12, zIndex: 60, cursor: 'grabbing', boxShadow: '0 20px 40px rgba(0,0,0,0.14)' }}
          whileHover={{ scale: 1.08, cursor: 'grab', transition: { type: 'spring', stiffness: 400, damping: 15 } }}
          onClick={() => { setClickedPill(pill.id); setTimeout(() => setClickedPill(null), 600); }}
          className="relative group cursor-grab active:cursor-grabbing touch-none"
        >
          <AdaptiveGlass
            // isMobile={isMobile}
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
            <div className="relative flex items-center justify-center rounded-full" style={{ padding: `${Math.max(8, 15 * scaleFactor)}px ${Math.max(16, 28 * scaleFactor)}px` }}>
              {clickedPill === pill.id && <motion.div initial={{ scale: 0.8, opacity: 0.9 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="absolute inset-0 rounded-full border-2 border-cyan-400 pointer-events-none" />}
              <span className="font-semibold text-zinc-900 tracking-tight whitespace-nowrap leading-none transition-colors duration-200" style={{ fontSize: `clamp(11px, ${25 * scaleFactor}px, 16px)`, color: '#1E2822' }}>
                {pill.label}
              </span>
            </div>
          </AdaptiveGlass>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function OuterChatPill({ item, scaleFactor, clickedId, setClickedId, className, isMobile }: any) {
  const targetX = item.offsetX * scaleFactor;
  const targetY = item.offsetY * scaleFactor;

  return (
    <div
      className={`absolute pointer-events-auto select-none will-change-transform ${className}`}
      data-x={targetX}
      data-y={targetY}
      data-side={item.side}
      style={{ opacity: 0 }} // Let GSAP control position and opacity
    >
      <motion.div
        animate={{ x: item.driftX.map((v: number) => v * scaleFactor), y: item.driftY.map((v: number) => v * scaleFactor) }}
        transition={{ duration: item.duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        drag dragConstraints={{ left: -35 * scaleFactor, right: 35 * scaleFactor, top: -25 * scaleFactor, bottom: 25 * scaleFactor }}
        dragElastic={0.35}
        whileDrag={{ scale: 1.05, zIndex: 60, cursor: 'grabbing', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
        whileHover={{ scale: 1.03, cursor: 'grab', transition: { type: 'spring', stiffness: 400, damping: 15 } }}
        onClick={() => { setClickedId(item.id); setTimeout(() => setClickedId(null), 700); }}
        className="relative group cursor-grab active:cursor-grabbing"
      >
        <AdaptiveGlass
          isMobile={isMobile}
          borderRadius={26}
          blur={1.8}
          contrast={1.12}
          brightness={1.04}
          saturation={1.15}
          shadowIntensity={0.06}
          displacementScale={0.8}
          elasticity={0.4}
          zIndex={20}
          className="transition-all duration-300 border border-white/70 hover:border-white/95 bg-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.06),_0_2px_8px_rgba(0,0,0,0.03)]"
        >
          <div className="relative flex items-start gap-3 rounded-3xl" style={{ padding: `${Math.max(10, 14 * scaleFactor)}px ${Math.max(14, 20 * scaleFactor)}px`, maxWidth: `clamp(210px, ${310 * scaleFactor}px, 345px)` }}>
            {clickedId === item.id && <motion.div initial={{ scale: 0.8, opacity: 0.9 }} animate={{ scale: 1.4, opacity: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }} className="absolute inset-0 rounded-3xl border-2 border-cyan-400 pointer-events-none" />}
            {item.avatarType === 'cala-orb' ? (
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden shrink-0 mt-0.5 border border-teal-300/80 shadow-[0_2px_8px_rgba(36,168,184,0.35)]">
                <img src="/programs/Male-Fertility.png" alt="ATLAS" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#E5855E] shrink-0 mt-1 shadow-sm border border-white/60" />
            )}
            <div className="flex flex-col text-left">
              <span className={`font-semibold text-[10px] tracking-tight ${item.isCala ? 'text-[#3E9B92]' : 'text-[#1E2822]'}`}>{item.sender}</span>
              <p className="text-[10px] sm:text-lg text-black leading-snug mt-1 font-normal" style={{ fontSize: `clamp(11px, ${14 * scaleFactor}px, 16.5px)` }}>{item.message}</p>
            </div>
          </div>
        </AdaptiveGlass>
      </motion.div>
    </div>
  );
}


export default function CalaScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollControls = useScrollSequenceControls('ATLAS', ATLAS_SEQUENCE_CONFIG);

  const [isMobile, setIsMobile] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [shockwaves, setShockwaves] = useState<number[]>([]);
  const [activeShockId, setActiveShockId] = useState<number | null>(null);
  const [clickedPill, setClickedPill] = useState<string | null>(null);
  const [clickedChatId, setClickedChatId] = useState<string | null>(null);
  const [activeFaqId, setActiveFaqId] = useState<number>(1);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setIsMounted(true);
    const updateScale = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      if (w < 480) setScaleFactor(0.52);
      else if (w < 640) setScaleFactor(0.64);
      else if (w < 768) setScaleFactor(0.74);
      else if (w < 1024) setScaleFactor(0.85);
      else if (w < 1280) setScaleFactor(0.94);
      else setScaleFactor(1);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Pause shockwave timer when scrolled past hero
      if (typeof window !== 'undefined' && window.scrollY > window.innerHeight * 1.5) {
        return;
      }
      const newId = Date.now();
      setShockwaves((prev) => [...prev.slice(-2), newId]);
      setActiveShockId(newId);
      setTimeout(() => setActiveShockId(null), 900);
    }, 4800);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // GSAP SCROLL TIMELINE
  useGSAP(() => {
    const isMobileDev = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

    // Initial setups for elements that need centering via GSAP transforms
    gsap.set('.mobile-watermark', { xPercent: -50, yPercent: -50 });
    gsap.set('.mobile-3d-orb', { xPercent: -50, yPercent: -50 });
    gsap.set('.outer-pill', { xPercent: -50, yPercent: -50 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: isMobileDev ? 0.35 : 1, // Snappy on mobile, cinematic lerp on desktop
        invalidateOnRefresh: true, // Recalculate values on resize
      }
    });

    // Phase 1: 0 to 1.0s - Hero stays visible
    tl.to({}, { duration: 1.0 });

    // Phase 2: 1.0 to 2.5s - Hero fades out sequentially
    tl.to('.hero-pills', { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, "hero-exit")
      .to(['.hero-cala-text', '.hero-orb-container'], { y: -60, duration: 1.5, ease: 'power1.inOut' }, "hero-exit")
      .to('.hero-cala-text', { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, "hero-exit+=0.5")
      .to('.hero-orb-container', { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, "hero-exit+=1.0");

    // Phase 3: 2.5 to 3.5s - TalkWithCala fades in from bottom
    tl.fromTo('.talk-with-cala', { autoAlpha: 0, y: 80, scale: 1 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' }, "phase3");

    // Phase 4: 3.0 to 5.0s - ATLAS CARE TEAM text moving from right and stops in the middle
    tl.fromTo('.care-team-text',
      { x: '100vw', autoAlpha: 0 },
      { x: '0', autoAlpha: 1, duration: 2.0, ease: 'power1.out' },
      "phase3+=0.5" // starts at 3.0s
    );

    // Phase 4 Highlight: at 4.0s (when text touches the button halfway through its movement)
    tl.to('.talk-button-ring', { autoAlpha: 1, duration: 0.25 }, "phase3+=1.5")
      .to('.talk-button-ring', { autoAlpha: 0, duration: 0.35 }, "phase3+=2.0");

    // Phase 5: 5.0 to 5.5s - TalkWithCala fades out (leaving the stopped scrolling text behind)
    tl.to('.talk-with-cala', { autoAlpha: 0, scale: 0.9, duration: 0.5, ease: 'power2.in' }, "phase5");

    // Phase 6: 5.5 to 6.0s - Mobile Phone container fades in
    tl.fromTo('.mobile-phone-container', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, "phase6");

    // Phase 6.5: 6.0 to 6.5s - Typing indicator sequence
    tl.fromTo('.typing-indicator', { autoAlpha: 0, y: 10, scale: 0.8 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.2 }, "phase6+=0.5")
      .to('.typing-indicator', { autoAlpha: 0, y: 10, scale: 0.8, duration: 0.2 }, "phase6+=0.8");

    // Phase 7: 6.5 to 8.0s - Chats appear sequentially
    tl.fromTo('.chat-message',
      { autoAlpha: 0, y: 32, scale: 0.92 },
      { autoAlpha: 1, y: 0, scale: 1, stagger: 0.25, duration: 0.5, ease: 'back.out(1.4)' },
      "phase7"
    );

    // Phase 7: 6.5 to 8.0s - Outer Chats appear sequentially (Desktop only)
    if (!isMobileDev) {
      tl.fromTo('.outer-pill',
        {
          autoAlpha: 0,
          scale: 0.86,
          x: (i, el) => parseFloat(el.dataset.x || '0') + (el.dataset.side === 'left' ? -40 : 40),
          y: (i, el) => parseFloat(el.dataset.y || '0')
        },
        {
          autoAlpha: 1,
          scale: 1,
          x: (i, el) => parseFloat(el.dataset.x || '0'),
          y: (i, el) => parseFloat(el.dataset.y || '0'),
          stagger: 0.25,
          duration: 0.5,
          ease: 'back.out(1.4)'
        },
        "phase7"
      );
    }

    // Phase 8: 8.0 to 9.5s - Mobile UI elements fade out, 3D orb zooms, text fades out
    const zoomScale = isMobileDev ? scrollControls.mobileZoomScale : scrollControls.zoomPhaseScale;
    const orbPhase11Scale = isMobileDev ? Math.min(scrollControls.phase11Scale, 7.0) : scrollControls.phase11Scale;
    const orbPhase12Scale = isMobileDev ? Math.min(scrollControls.phase12Scale, 5.5) : scrollControls.phase12Scale;
    const orbPhase13Scale = isMobileDev ? Math.min(scrollControls.phase13Scale, 1.9) : scrollControls.phase13Scale;
    const orbFinalScale = isMobileDev ? Math.min(scrollControls.finalOrbScale, 1.9) : scrollControls.finalOrbScale;
    const phase11Top = `${scrollControls.phase11Top}%`;
    const phase12Top = `${scrollControls.phase12Top}%`;
    const finalOrbTop = `${scrollControls.finalOrbTop}%`;

    tl.to('.mobile-ui, .outer-pills-container, .care-team-text, .hero-cala-text, .chat-message, .typing-indicator', { autoAlpha: 0, duration: 0.2 }, "phase8");
    tl.to('.mobile-3d-orb', { scale: zoomScale, top: '50%', duration: 1.5, ease: 'power2.inOut' }, "phase8");

    // Phase 9: 9.5 to 10.5s - Final full-screen content fades in
    tl.fromTo('.final-content', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }, "phase9");

    // Phase 10: 10.5 to 11.5s - Full-screen content fades out
    tl.to('.final-content', { autoAlpha: 0, y: -30, duration: 1, ease: 'power2.in' }, "phase10");

    // Phase 11: 11.5 to 12.5s - Orb acts as massive ceiling. Text 1 fades in.
    tl.to('.mobile-3d-orb', { scale: orbPhase11Scale, top: phase11Top, duration: 1.5, ease: 'power2.inOut' }, "phase11");
    tl.fromTo('.benefits-text-1', { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 0.8 }, "phase11+=0.8");

    // Phase 12: 13.0 to 14.0s - Text 1 out, Text 2 in, Orb shrinks.
    tl.to('.benefits-text-1', { autoAlpha: 0, scale: 1.05, duration: 0.5 }, "phase12");
    tl.to('.mobile-3d-orb', { scale: orbPhase12Scale, top: phase12Top, duration: 1.5, ease: 'power2.inOut' }, "phase12");
    tl.fromTo('.benefits-text-2', { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 0.8 }, "phase12+=0.8");

    // Phase 13: 14.5 to 15.5s - Text 2 out, Text 3 in, Orb shrinks to center. All pills in.
    tl.to('.benefits-text-2', { autoAlpha: 0, scale: 1.05, duration: 0.5 }, "phase13");
    tl.to('.mobile-3d-orb', { scale: orbPhase13Scale, top: finalOrbTop, duration: 1.5, ease: 'power2.inOut' }, "phase13");
    tl.fromTo('.benefits-text-3', { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 0.8 }, "phase13+=0.8");
    tl.fromTo('.final-benefit-pill', { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, stagger: 0.1, duration: 0.8, ease: 'back.out(1.5)' }, "phase13+=0.8");

    // Phase 14: 16.0 to 17.0s - Settle orb and finalize
    tl.to('.mobile-3d-orb', { scale: orbPhase13Scale, duration: 1 }, "phase14");

    // Phase 15: Fade out benefits-text-3 and final pills completely
    tl.to('.benefits-text-3', { autoAlpha: 0, scale: 1.05, duration: 0.8, ease: 'power2.in' }, "phase15");
    tl.to('.final-benefit-pill', { autoAlpha: 0, scale: 0.85, duration: 0.8, stagger: 0.08, ease: 'power2.in' }, "phase15");
    tl.set('.benefits-sequence', { pointerEvents: 'none' }, "phase15+=0.8");

    // Phase 16: Build in FAQ section sequentially (after every previous content is gone)
    const faqStart = "phase15+=1.4";
    tl.to('.faq-container', { autoAlpha: 1, duration: 0.2 }, faqStart);
    tl.to('.mobile-3d-orb', { scale: orbFinalScale, duration: 1 }, faqStart);

    // Header slides down from top & fades in
    tl.fromTo('.faq-header',
      { autoAlpha: 0, y: -35 },
      { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power2.out' },
      `${faqStart}+=0.4`
    );

    // 5 Question pills stagger in from the left
    tl.fromTo('.faq-pill',
      { autoAlpha: 0, x: -60, scale: 0.95 },
      { autoAlpha: 1, x: 0, scale: 1, stagger: 0.25, duration: 0.9, ease: 'back.out(1.2)' },
      `${faqStart}+=1.0`
    );

    // Right answer box slides in from the right
    tl.fromTo('.faq-right-box',
      { autoAlpha: 0, x: 60, scale: 0.95 },
      { autoAlpha: 1, x: 0, scale: 1, duration: 1.0, ease: 'power2.out' },
      `${faqStart}+=2.3`
    );

    // Phase 17: Settle and hold at the end of the scroll sequence
    tl.to({}, { duration: 4.0 }, `${faqStart}+=3.5`);

    // --- SECOND TIMELINE: Handoff Orb to Membership Section ---
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const handoffTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: isMobileDev ? 0.35 : 1,
          invalidateOnRefresh: true,
        }
      });

      const getDx = () => {
        const slot = document.querySelector('[data-orb-slot]');
        if (!slot || !containerRef.current) return 0;
        const sticky = containerRef.current.querySelector('.sticky');
        if (!sticky) return 0;
        const slotRect = slot.getBoundingClientRect();
        const stickyW = sticky.clientWidth;
        const slotCenterPageX = slotRect.left + slotRect.width / 2 + window.scrollX;
        return slotCenterPageX - stickyW / 2;
      };

      const getDy = () => {
        const slot = document.querySelector('[data-orb-slot]');
        if (!slot || !containerRef.current) return 0;
        const sticky = containerRef.current.querySelector('.sticky');
        if (!sticky) return 0;
        const slotRect = slot.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const stickyH = (sticky as HTMLElement).offsetHeight;

        const containerBottomPageY = containerRect.bottom + window.scrollY;
        const slotCenterPageY = slotRect.top + slotRect.height / 2 + window.scrollY;

        return slotCenterPageY - (containerBottomPageY - stickyH / 2);
      };

      handoffTl.fromTo('.mobile-3d-orb',
        { x: 0, y: 0, scale: orbFinalScale },
        {
          x: getDx,
          y: getDy,
          scale: () => {
            const slot = document.querySelector('[data-orb-slot]');
            const orb = document.querySelector('.mobile-3d-orb') as HTMLElement;
            if (!slot || !orb) return orbFinalScale;
            return slot.clientWidth / orb.offsetWidth;
          },
          ease: 'power2.inOut',
          duration: 0.75,
          immediateRender: false,
        }
      );

      handoffTl.to('.faq-container',
        { autoAlpha: 0, duration: 0.3, ease: 'power1.out' },
        0
      );

      handoffTl.fromTo('[data-orb-ring]',
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power1.inOut', immediateRender: false },
        "-=0.25"
      );

      handoffTl.to({}, { duration: 0.25 });
    });

  }, {
    scope: containerRef,
    dependencies: [
      scrollControls.zoomPhaseScale,
      scrollControls.mobileZoomScale,
      scrollControls.phase11Scale,
      scrollControls.phase11Top,
      scrollControls.phase12Scale,
      scrollControls.phase12Top,
      scrollControls.phase13Scale,
      scrollControls.finalOrbScale,
      scrollControls.finalOrbTop,
    ],
  });

  useEffect(() => {
    // Refresh ScrollTrigger once everything is mounted and fonts might be loaded
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[1150vh] md:h-[1800vh]">
      <div className="sticky top-0 h-[100dvh] min-h-[100dvh] h-screen w-full overflow-x-clip flex flex-col items-center justify-center transform-gpu will-change-transform">

        {/* SHARED BACKGROUNDS */}
        {/* <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="seq-honeycomb-pattern" width="62.35" height="108" patternUnits="userSpaceOnUse">
                <path d="M 31.18 0 L 62.35 18 L 62.35 54 L 31.18 72 L 0 54 L 0 18 Z M 0 54 L 0 90 L 31.18 108 L 62.35 90 L 62.35 54 M 31.18 72 L 31.18 108" fill="none" stroke="#EAE6DE" strokeWidth="1.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#seq-honeycomb-pattern)" />
          </svg>
        </div> */}
        <div className="absolute w-[600px] h-[400px] rounded-full bg-gradient-to-b from-teal-100/25 via-cyan-50/20 to-transparent blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />

        {/* --- PHASE 1: HERO SECTION --- */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <h1
            className="
    hero-cala-text
    absolute
    z-0
    flex
    items-center
    justify-center
    text-center
    font-black
    uppercase
    leading-none
    tracking-[-0.035em]
    text-[#8F9B6F]
    whitespace-nowrap
    text-[clamp(130px,28vw,420px)]
    [text-shadow:0_4px_30px_rgba(114,178,170,0.08)]
  "
          >
            ATLAS
          </h1>

          <div
            className="hero-orb-container relative z-10 flex items-center justify-center"
            style={{
              transform: `translate(${scrollControls.heroOrbOffsetX}px, ${scrollControls.heroOrbOffsetY}px) scale(${scrollControls.heroOrbScale})`,
            }}
          >
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
            <div
              className="
    absolute
    flex
    items-center
    justify-center
    pointer-events-none
    w-[clamp(130px,40vw,360px)]
    h-[clamp(130px,40vw,360px)]
  "
            >
              <AdaptiveGlass
                isMobile={isMobile}
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
      sm:p-3.5
      pointer-events-auto
      border
      border-white/60
      
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
              </AdaptiveGlass>
            </div>
          </div>

          <div className="hero-pills absolute inset-0 flex items-center justify-center z-20">
            {PILLS.map((pill) => {
              const targetX = isMobile && pill.mobileX !== undefined ? pill.mobileX : pill.baseX;
              const targetY = isMobile && pill.mobileY !== undefined ? pill.mobileY : pill.baseY;
              const rad = Math.atan2(targetY, targetX);
              return (
                <CollidingPill
                  key={pill.id}
                  pill={pill}
                  targetX={targetX}
                  targetY={targetY}
                  scaleFactor={scaleFactor}
                  isMounted={isMounted}
                  isShocked={activeShockId !== null}
                  shockJoltX={Math.cos(rad) * 14 * scaleFactor}
                  shockJoltY={Math.sin(rad) * 14 * scaleFactor}
                  clickedPill={clickedPill}
                  setClickedPill={setClickedPill}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  isMobile={isMobile}
                />
              );
            })}
          </div>
        </div>

        {/* --- PHASE 3/4: ATLAS CARE TEAM TEXT (Moves continuously behind TalkWithCala and Phone) --- */}
        <div className="care-team-text absolute inset-x-0 bottom-4 sm:bottom-8 lg:bottom-12 flex items-center justify-center pointer-events-none select-none z-10 opacity-0">
          <h1 className="text-[#008080] font-black uppercase text-center flex items-center justify-center leading-none tracking-[-0.015em] whitespace-nowrap" style={{ fontSize: 'clamp(70px, 12.5vw, 195px)' }}>
            ATLAS CARE TEAM
          </h1>
        </div>

        {/* --- PHASE 2: TALK TO CARE TEAM SECTION --- */}
        <div className="talk-with-cala absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none opacity-0">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-[#1E2822] tracking-[-0.03em] leading-[1.1]">
              <span className="text-[#8F9B6F]">ATLAS</span> is Male Fertility & Hormone Restoration Program.
            </h2>
            <p className="mt-4 sm:mt-5 text-[#27272C] text-sm sm:text-base md:text-[18px] leading-[1.2] max-w-xl font-medium">
              For men who want to improve sperm health, testosterone, stamina, and reproductive health with structured medical and lifestyle guidance.
            </p>
            <div className="mt-8 sm:mt-10">
              <TalkCareButton
                programName="ATLAS"
                imageSrc="/programs/Male-Fertility.png"
              />
            </div>
          </div>
        </div>

        {/* --- PHASE 5: CALACHAT MOBILE & ZOOMS --- */}
        <div className="mobile-phone-container absolute inset-0 z-30 flex items-center justify-center pointer-events-none opacity-0">
          <div className="relative w-full max-w-[1240px] h-[580px] sm:h-[660px] md:h-[720px] flex items-center justify-center mx-auto px-4">

            <div className="relative z-10 flex flex-col items-center justify-center pointer-events-auto">
              <div className="relative aspect-[872/1804] flex items-center justify-center select-none" style={{ width: `clamp(270px, ${325 * scaleFactor}px, 355px)` }}>

                <img src="/mobile-mockup-v2.png" alt="CALA Mobile" className="mobile-ui w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_25px_60px_rgba(0,0,0,0.14)] relative z-10" />

                <div className="mobile-watermark mobile-ui absolute z-10 pointer-events-none select-none flex items-center justify-center" style={{ top: '40%', left: '50%' }}>
                  <span className="text-[42px] sm:text-[72px] font-black tracking-widest text-[#8F9B6F] uppercase">ATLAS</span>
                </div>

                {/* ZOOMABLE 3D ORB */}
                <div
                  className="mobile-3d-orb absolute z-20 pointer-events-none rounded-full flex items-center justify-center will-change-transform"
                  style={{
                    top: '50%', left: '50%',
                    width: `clamp(150px, ${168 * scaleFactor}px, 190px)`,
                    height: `clamp(150px, ${168 * scaleFactor}px, 190px)`
                  }}
                >
                  <AdaptiveGlass
                    isMobile={isMobile}
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
      sm:p-3
      pointer-events-auto
      border
      border-white/60
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
                      <CalaThreeCircle interactive={false} className="w-full h-full" />
                    </div>
                  </AdaptiveGlass>
                </div>

                {/* MOBILE UI OVERLAY (Chats) - MOBILE ONLY */}
                <div className="mobile-ui absolute z-30 overflow-hidden flex flex-col justify-end pointer-events-auto md:hidden" style={{ top: '14%', bottom: '10%', left: '7%', right: '7%', maskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 100%)' }}>
                  <div className="w-full flex flex-col justify-end gap-2.5 pb-1">
                    <div className="mt-auto flex-shrink-0" />
                    {CHAT_SEQUENCE.map((item) => (
                      <div key={`mob-${item.id}`} className={`chat-message w-full flex ${item.isCala ? 'justify-start' : 'justify-end'} opacity-0`}>
                        {item.isCala ? (
                          <div className={`max-w-[88%] p-2 sm:p-2.5 rounded-2xl rounded-tl-sm bg-white/95 backdrop-blur-md border border-teal-100 shadow-[0_3px_12px_rgba(0,0,0,0.06)] flex items-start gap-1.5 transition-all duration-300 ${clickedChatId === item.id ? 'ring-2 ring-teal-400' : ''}`}>
                            <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 mt-0.5 border border-teal-300 shadow-sm"><img src="/programs/Male-Fertility.png" alt="ATLAS" className="w-full h-full object-cover" /></div>
                            <div className="text-left flex-1"><div className="text-[9px] font-bold text-[#3E9B92] leading-tight">{item.sender}</div><div className="text-[10px] text-[#2C3831] leading-snug mt-0.5 font-normal">{item.message}</div><div className="text-[8px] text-gray-400 text-right mt-0.5">{item.time}</div></div>
                          </div>
                        ) : (
                          <div className={`max-w-[85%] px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl rounded-tr-sm bg-[#E6F4F1] border border-teal-200/70 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-right transition-all duration-300 ${clickedChatId === item.id ? 'ring-2 ring-[#E5855E]' : ''}`}>
                            <div className="text-[8.5px] font-semibold text-[#E5855E] text-right mb-0.5">{item.sender}</div><div className="text-[10px] text-[#1E2822] leading-snug font-medium text-left">{item.message}</div><div className="text-[8px] text-teal-700/60 mt-0.5 flex items-center justify-end gap-1"><span>{item.time}</span><span className="text-[9px] text-teal-600 font-bold">✓✓</span></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* BOTTOM MOBILE UI TYPING INDICATOR - MOBILE ONLY */}
                <div className="mobile-ui absolute z-35 inset-x-[7%] flex items-center justify-between pointer-events-none md:hidden" style={{ bottom: '4.8%' }}>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm border border-teal-100 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
                    <div className="w-2.5 h-2.5 rounded-full overflow-hidden shrink-0 border border-teal-300"><img src="/programs/Male-Fertility.png" alt="ATLAS" className="w-full h-full object-cover" /></div>
                    <span className="text-[8.5px] font-medium text-teal-800 tracking-tight">ATLAS Care</span>
                  </div>
                  <div className="typing-indicator flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm border border-orange-100 shadow-[0_2px_6px_rgba(0,0,0,0.04)] opacity-0">
                    <div className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#E5855E] animate-pulse" /><span className="w-1.5 h-1.5 rounded-full bg-[#E5855E] animate-pulse delay-75" /><span className="w-1.5 h-1.5 rounded-full bg-[#E5855E] animate-pulse delay-150" /></div>
                    <span className="text-[8.5px] font-medium text-[#E5855E]">Typing...</span>
                  </div>
                </div>

              </div>
            </div>

            {/* OUTER CHAT PILLS - ONLY MOUNT ON DESKTOP */}
            {!isMobile && (
              <div className="outer-pills-container absolute inset-0 hidden md:flex items-center justify-center pointer-events-none z-20">
                {CHAT_SEQUENCE.map((item) => (
                  <OuterChatPill key={item.id} className="outer-pill" item={item} scaleFactor={scaleFactor} clickedId={clickedChatId} setClickedId={setClickedChatId} isMobile={isMobile} />
                ))}
              </div>
            )}

          </div>
        </div>

        {/* --- PHASE 8: FINAL CONTENT OVER FULLSCREEN ORB --- */}
        <div className="final-content absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none text-center opacity-0 px-4 sm:px-6">
          <div className="max-w-[1100px] mx-auto flex flex-col items-center pointer-events-auto w-full">

            {/* Header Section */}
            <div className="mb-5 sm:mb-14">
              <h3 className="text-[#E5855E] text-[10px] sm:text-sm md:text-lg font-bold tracking-tight uppercase md:mb-3">
                What's Inside The Membership
              </h3>
              <h2 className="text-3xl sm:text-4xl md:text-3xl lg:text-[32px] font-bold text-white tracking-tight drop-shadow-md leading-[1.1]">
                Targeted andrology, hormone restoration, and sperm health guidance.
              </h2>
            </div>

            {/* Grid of Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="col-span-1">
                <AdaptiveGlass borderRadius={24} blur={1.8} contrast={1.12} brightness={1.05} saturation={1.15} shadowIntensity={0.1} displacementScale={0.8} elasticity={0.4} zIndex={10} className="rounded-2xl md:rounded-3xl border border-white/20 transition-all duration-300 hover:border-white/40 shadow-2xl h-full w-full group">
                  <div className="p-5 md:p-7 text-left flex flex-col h-full relative z-10">
                    <h4 className="text-white text-sm md:text-2xl font-bold mb-3 md:mb-4 drop-shadow-sm">Medical & Fertility Care</h4>
                    <ul className="md:space-y-2">
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>Dedicated Andrologist / Men’s Health Doctor</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>3 consultations/month</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>Semen analysis & lab interpretation</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>Monthly fertility & hormone review</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>Male fertility tracking</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>Hormone tracking dashboard</span>
                      </li>
                    </ul>
                  </div>
                </AdaptiveGlass>
              </div>
              <div className="col-span-1">
                <AdaptiveGlass borderRadius={24} blur={1.8} contrast={1.12} brightness={1.05} saturation={1.15} shadowIntensity={0.1} displacementScale={0.8} elasticity={0.4} zIndex={10} className="rounded-2xl md:rounded-3xl border border-white/20 transition-all duration-300 hover:border-white/40 shadow-2xl h-full w-full group">
                  <div className="p-5 md:p-7 text-left flex flex-col h-full relative z-10">
                    <h4 className="text-white text-sm md:text-2xl font-bold mb-3 md:mb-4 drop-shadow-sm">Reproductive & Sexual Health</h4>
                    <ul className="md:space-y-2">
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>Libido & erection monitoring</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>Ejaculation comfort guidance</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>Testicular health monitoring</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>Fertility readiness index</span>
                      </li>
                    </ul>
                  </div>
                </AdaptiveGlass>
              </div>
              <div className="col-span-1">
                <AdaptiveGlass borderRadius={24} blur={1.8} contrast={1.12} brightness={1.05} saturation={1.15} shadowIntensity={0.1} displacementScale={0.8} elasticity={0.4} zIndex={10} className="rounded-2xl md:rounded-3xl border border-white/20 transition-all duration-300 hover:border-white/40 shadow-2xl h-full w-full group">
                  <div className="p-3 md:p-7 text-left flex flex-col h-full relative z-10">
                    <h4 className="text-white text-sm md:text-2xl font-bold mb-3 md:mb-4 drop-shadow-sm">Lifestyle & Recovery</h4>
                    <ul className="md:space-y-2">
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>Supplement protocol</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>Sleep, stress & lifestyle correction</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>Daily fertility support chat</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>Priority Q&A</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>Red-flag guidance</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-3 text-white/95 text-[11px] md:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                        <span>Joyzen formulations included</span>
                      </li>
                    </ul>
                  </div>
                </AdaptiveGlass>
              </div>
            </div>

            {/* Footer Text */}
            <p className="mt-10 sm:mt-12 text-white font-medium text-sm sm:text-base md:text-[17px] drop-shadow max-w-4xl leading-[1.2]">
              Structured care for fertility, hormones, and reproductive health.
            </p>
          </div>
        </div>

        {/* --- PHASE 11-14: BENEFITS SEQUENCE --- */}
        <div className="benefits-sequence absolute inset-0 z-40 pointer-events-none">
          {/* Texts */}
          <div className="benefits-text-1 absolute inset-0 flex flex-col items-center justify-center opacity-0">
            <span className="text-[#E5855E] text-[10px] sm:text-sm md:text-base font-bold tracking-widest uppercase mb-3 sm:mb-4">BENEFITS</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white tracking-tight drop-shadow-md">Understand fertility.</h2>
          </div>
          <div className="benefits-text-2 absolute inset-0 flex flex-col items-center justify-center opacity-0">
            <span className="text-[#E5855E] text-[10px] sm:text-sm md:text-base font-bold tracking-widest uppercase mb-3 sm:mb-4">BENEFITS</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white tracking-tight drop-shadow-md">Track what matters.</h2>
          </div>
          <div className="benefits-text-3 absolute inset-0 flex flex-col items-center justify-center opacity-0">
            <span className="text-[#E5855E] text-[10px] sm:text-sm md:text-base font-bold tracking-widest uppercase mb-3 sm:mb-2">BENEFITS</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white tracking-tight drop-shadow-md">Improve with guidance.</h2>
          </div>

          {/* Pills (All appear together at the end) */}
          <div className="final-benefit-pill absolute opacity-0 pointer-events-auto top-[45%] md:top-[40%] right-[calc(60%+10px)] sm:right-[calc(50%+90px)] md:right-[calc(50%+150px)]">
            <div className="-translate-y-1/2 flex items-center justify-center">
              <AdaptiveGlass isMobile={isMobile} borderRadius={999} blur={2} contrast={1.1} className="px-3 py-1.5 md:px-6 md:py-2 border border-white/10 transition-transform hover:scale-105 cursor-default backdrop-blur-xl">
                <span className="text-[#1E2822] text-[10px] md:text-[11px] lg:text-lg font-bold whitespace-nowrap tracking-tight">Semen analysis</span>
              </AdaptiveGlass>
            </div>
          </div>
          <div className="final-benefit-pill absolute opacity-0 pointer-events-auto top-[60%] md:top-[65%] right-[calc(70%+20px)] sm:right-[calc(50%+60px)] md:right-[calc(50%+110px)]">
            <div className="-translate-y-1/2 flex items-center justify-center">
              <AdaptiveGlass isMobile={isMobile} borderRadius={999} blur={2} contrast={1.1} className="px-3 py-1.5 md:px-6 md:py-2 border border-white/10 transition-transform hover:scale-105 cursor-default backdrop-blur-xl">
                <span className="text-[#1E2822] text-[10px] md:text-[11px] lg:text-lg font-bold whitespace-nowrap tracking-tight">Fertility review</span>
              </AdaptiveGlass>
            </div>
          </div>
          <div className="final-benefit-pill absolute opacity-0 pointer-events-auto top-[40%] md:top-[42%] left-[calc(50%+30px)] sm:left-[calc(50%+90px)] md:left-[calc(50%+150px)]">
            <div className="-translate-y-1/2 flex items-center justify-center">
              <AdaptiveGlass isMobile={isMobile} borderRadius={999} blur={2} contrast={1.1} className="px-3 py-1.5 md:px-6 md:py-2 border border-white/10 transition-transform hover:scale-105 cursor-default backdrop-blur-xl">
                <span className="text-[#1E2822] text-[10px] md:text-[11px] lg:text-lg font-bold whitespace-nowrap tracking-tight">Hormone dashboard</span>
              </AdaptiveGlass>
            </div>
          </div>
          <div className="final-benefit-pill absolute opacity-0 pointer-events-auto top-[60%] left-[calc(60%+20px)] sm:left-[calc(50%+60px)] md:left-[calc(50%+110px)]">
            <div className="-translate-y-1/2 flex items-center justify-center">
              <AdaptiveGlass isMobile={isMobile} borderRadius={999} blur={2} contrast={1.1} className="px-3 py-1.5 md:px-6 md:py-2 border border-white/10 transition-transform hover:scale-105 cursor-default backdrop-blur-xl">
                <span className="text-[#1E2822] text-[10px] md:text-[11px] lg:text-lg font-bold whitespace-nowrap tracking-tight">Fertility readiness</span>
              </AdaptiveGlass>
            </div>
          </div>
          <div className="final-benefit-pill absolute opacity-0 pointer-events-auto top-[calc(50%+130px)] md:top-[calc(50%+230px)] left-1/2">
            <div className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <AdaptiveGlass isMobile={isMobile} borderRadius={999} blur={2} contrast={1.1} className="px-3 py-1.5 md:px-6 md:py-2 border border-white/10 transition-transform hover:scale-105 cursor-default backdrop-blur-xl">
                <span className="text-[#1E2822] text-[10px] md:text-[11px] lg:text-lg font-bold whitespace-nowrap tracking-tight">Daily fertility support</span>
              </AdaptiveGlass>
            </div>
          </div>
        </div>

        {/* --- PHASE 16: FAQ Let's Figure Out Together --- */}
        <div className="faq-container absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none opacity-0 select-none">

          {/* Top Header */}
          <div className="faq-header text-center absolute top-6 sm:top-8 md:top-10 lg:top-12 pointer-events-auto z-30 flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl md:text-[32px] lg:text-[32px] font-bold text-black tracking-tight leading-none">
              {"Questions you shouldn't have to figure out alone."}
            </h2>
            <span className="text-[#8F9B6F] font-bold uppercase tracking-tight text-xl sm:text-2xl md:text-[28px] mt-0.5">
              ATLAS
            </span>
          </div>

          {/* Desktop & Tablet Layout (Overlapping central orb) - ONLY MOUNT ON DESKTOP */}
          {!isMobile && (
            <div className="hidden md:flex absolute inset-0 items-center justify-center w-full px-4 sm:px-6 pointer-events-none">
              {/* Left side pills */}
              <div
                className="faq-left-pills absolute flex flex-col gap-2.5 sm:gap-3 md:gap-3.5 pointer-events-auto z-40 transition-all"
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: `calc(52% + ${Math.max(90, 150 * scaleFactor)}px)`,
                }}
              >
                {FAQ_SEQUENCE.map((faq) => {
                  const isActive = activeFaqId === faq.id;
                  return (
                    <div
                      key={`desktop-faq-pill-${faq.id}`}
                      onClick={() => setActiveFaqId(faq.id)}
                      className={`faq-pill group relative cursor-pointer select-none rounded-full transition-all duration-300 ${isActive ? 'scale-[1.03] z-20' : 'hover:scale-[1.02] z-10'}`}
                    >
                      <AdaptiveGlass
                        isMobile={isMobile}
                        borderRadius={9999}
                        blur={2}
                        contrast={1.12}
                        brightness={1.04}
                        saturation={1.15}
                        shadowIntensity={isActive ? 0.12 : 0.05}
                        displacementScale={0.8}
                        elasticity={0.4}
                        zIndex={10}
                        className={`w-full rounded-full transition-all duration-300 border ${isActive ? 'border-white/95' : 'border-white/60 hover:border-white/90'}`}
                      >
                        <div className="relative flex items-center justify-between rounded-full px-4 py-2.5 sm:py-3.5">
                          <span
                            className={`text-[10px] sm:text-[13px] md:text-[13.5px] lg:text-lg tracking-tight leading-[1.2] transition-colors duration-200 text-left ${isActive ? 'font-bold text-[#E5855E]' : 'font-semibold text-[#1E2822]/85 group-hover:text-[#1E2822]'}`}
                          >
                            {faq.question}
                          </span>
                        </div>
                      </AdaptiveGlass>
                    </div>
                  );
                })}
              </div>

              {/* Right side answer box */}
              <div
                className="faq-right-box absolute pointer-events-auto z-40 transition-all"
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: `calc(53% + ${Math.max(90, 150 * scaleFactor)}px)`,
                  width: `clamp(280px, ${380 * scaleFactor}px, 420px)`,
                }}
              >
                <AdaptiveGlass
                  isMobile={isMobile}
                  borderRadius={28}
                  blur={2.5}
                  contrast={1.12}
                  brightness={1.04}
                  saturation={1.15}
                  shadowIntensity={0.08}
                  displacementScale={0.8}
                  elasticity={0.4}
                  zIndex={20}
                  className="w-full rounded-[28px] border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.06),_0_4px_16px_rgba(0,0,0,0.03)] backdrop-blur-2xl transition-all"
                >
                  <div className="p-5 sm:p-7 md:p-8 flex flex-col text-left">
                    <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-teal-300 shadow-[0_2px_8px_rgba(36,168,184,0.35)] shrink-0">
                        <img src="/programs/Male-Fertility.png" alt="ATLAS" className="w-full h-full object-cover scale-[1.1]" />
                      </div>
                      <span className="text-[10px] sm:text-[13px] font-bold text-[#2A857D] tracking-wide">
                        ATLAS Care Team
                      </span>
                    </div>

                    <div className="min-h-[90px] sm:min-h-[110px] flex items-start">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={activeFaqId}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className="text-[13px] sm:text-[14px] md:text-2xl text-[#1E2822] leading-[1.1] font-medium"
                        >
                          {FAQ_SEQUENCE.find((f) => f.id === activeFaqId)?.answer}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                </AdaptiveGlass>
              </div>
            </div>
          )}

          {/* Mobile Layout (< md) - ONLY MOUNT ON MOBILE */}
          {isMobile && (
            <div className="flex md:hidden absolute inset-x-0 bottom-4 top-[100px] flex-col justify-start items-center px-4 pointer-events-auto z-40 overflow-y-auto pt-2 pb-6">

              {/* Answer Box (TOP) */}
              <div className="faq-right-box w-full max-w-[340px] mb-auto relative z-10 shrink-0">
                <div className="p-5 rounded-3xl border border-white/80 bg-white/95 shadow-xl backdrop-blur-xl text-left relative overflow-hidden">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-teal-300 shadow-[0_2px_8px_rgba(36,168,184,0.35)] shrink-0">
                      <img src="/programs/Male-Fertility.png" alt="ATLAS" className="w-full h-full object-cover scale-[1.1]" />
                    </div>
                    <span className="text-[12px] font-bold text-[#2A857D] tracking-wide">ATLAS Care Team</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeFaqId}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="text-[14px] text-[#1E2822] leading-[1.2] font-medium"
                    >
                      {FAQ_SEQUENCE.find((f) => f.id === activeFaqId)?.answer}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Spacer for 3D Orb to sit in the middle */}
              <div className="w-full min-h-[230px] shrink-0"></div>

              {/* Pills list (BOTTOM) */}
              <div className="flex flex-col gap-2.5 w-full max-w-[340px] relative z-10 shrink-0">
                {FAQ_SEQUENCE.map((faq) => {
                  const isActive = activeFaqId === faq.id;
                  return (
                    <button
                      key={`mobile-faq-pill-${faq.id}`}
                      onClick={() => setActiveFaqId(faq.id)}
                      className={`faq-pill text-left px-5 py-3.5 rounded-[24px] border transition-all duration-300 ${isActive
                        ? 'border-[#E5855E]/20 bg-gradient-to-r from-white/95 to-white/80 text-[#E5855E] font-bold shadow-[0_4px_15px_rgba(0,0,0,0.05)]'
                        : 'border-white/60 bg-white/60 text-[#1E2822]/85 font-medium hover:bg-white/80'
                        }`}
                    >
                      <span className="text-[12px] leading-snug line-clamp-2">{faq.question}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>

  );
}
