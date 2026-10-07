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
import { CALA_SEQUENCE_CONFIG } from './3dconfig';

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
  { id: 'pcos', label: 'PCOS Care', baseX: 0, baseY: -250, mobileX: 105, mobileY: -76, angle: -90, driftX: [0, 4, -4, 2, 0], driftY: [0, 8, -6, 2, 0], rotateRange: [0, 1.5, -1, 0.5, 0], duration: 4.8 },
  { id: 'fertility', label: 'Fertility Readiness', baseX: -265, baseY: -185, mobileX: -105, mobileY: -76, angle: -140, driftX: [0, 8, -6, 3, 0], driftY: [0, 6, -8, 2, 0], rotateRange: [0, -2, 1.5, -1, 0], duration: 5.2 },
  { id: 'ongoing', label: 'Ongoing Care', baseX: -490, baseY: 15, mobileX: -165, mobileY: 0, angle: 180, driftX: [0, 9, -7, 3, 0], driftY: [0, -6, 7, -3, 0], rotateRange: [0, 2, -1.5, 1, 0], duration: 5.6 },
  { id: 'pms', label: 'PMS Support', baseX: -250, baseY: 190, mobileX: -105, mobileY: 78, angle: 140, driftX: [0, 6, -8, 2, 0], driftY: [0, -8, 6, -2, 0], rotateRange: [0, -1.8, 2, -1, 0], duration: 4.9 },
  { id: 'ovulation', label: 'Ovulation Tracking', baseX: 0, baseY: 255, mobileX: 0, mobileY: -128, angle: 90, driftX: [0, -5, 6, -2, 0], driftY: [0, -9, 7, -3, 0], rotateRange: [0, 1.2, -1.5, 0.8, 0], duration: 5.4 },
  { id: 'care-team', label: 'Real Care Team', baseX: 225, baseY: 190, mobileX: 105, mobileY: 78, angle: 40, driftX: [0, -7, 8, -3, 0], driftY: [0, -7, 8, -2, 0], rotateRange: [0, 2, -2, 1, 0], duration: 5.0 },
  { id: 'cycle', label: 'Cycle Health', baseX: 490, baseY: 15, mobileX: 165, mobileY: 0, angle: 0, driftX: [0, -9, 7, -3, 0], driftY: [0, 6, -7, 2, 0], rotateRange: [0, -2, 1.5, -0.8, 0], duration: 5.5 },
  { id: 'hormone', label: 'Hormone Health', baseX: 265, baseY: -185, mobileX: 0, mobileY: 130, angle: -40, driftX: [0, -7, 5, -2, 0], driftY: [0, 7, -6, 2, 0], rotateRange: [0, 1.8, -1.2, 0.6, 0], duration: 5.1 },
];

interface ChatItem {
  id: string; sender: string; isCala: boolean; avatarType: 'orange-dot' | 'cala-orb'; message: string; time: string; side: 'left' | 'right'; offsetX: number; offsetY: number; driftX: number[]; driftY: number[]; duration: number;
}
const CHAT_SEQUENCE: ChatItem[] = [
  { id: 'megha-1', sender: 'Megha', isCala: false, avatarType: 'orange-dot', message: 'I have PCOS. How do I know if things are improving?', time: '10:24 AM', side: 'left', offsetX: -360, offsetY: -155, driftX: [0, 5, -4, 2, 0], driftY: [0, 6, -5, 2, 0], duration: 5.2 },
  { id: 'cala-1', sender: 'CALA Care Team', isCala: true, avatarType: 'cala-orb', message: "We'll track your symptoms, cycle patterns and progress over time so your care plan can be adjusted when needed.", time: '10:25 AM', side: 'left', offsetX: -250, offsetY: 15, driftX: [0, -6, 5, -2, 0], driftY: [0, -7, 6, -2, 0], duration: 5.6 },
  { id: 'megha-2', sender: 'Megha', isCala: false, avatarType: 'orange-dot', message: 'Thank You, CALA', time: '10:26 AM', side: 'left', offsetX: -370, offsetY: 180, driftX: [0, 4, -5, 3, 0], driftY: [0, 5, -6, 2, 0], duration: 4.8 },
  { id: 'ananya-1', sender: 'Ananya', isCala: false, avatarType: 'orange-dot', message: 'My periods have become really irregular. Is something wrong?', time: '10:28 AM', side: 'right', offsetX: 720, offsetY: -145, driftX: [0, -8, 4, -2, 0], driftY: [0, 6, -6, 2, 0], duration: 5.0 },
  { id: 'cala-2', sender: 'CALA Care Team', isCala: true, avatarType: 'cala-orb', message: "Let's look at your cycle pattern together. Your care team can help you track changes and understand what may need attention.", time: '10:29 AM', side: 'right', offsetX: 580, offsetY: 20, driftX: [0, 7, -6, 2, 0], driftY: [0, -5, 7, -3, 0], duration: 5.4 },
  { id: 'ananya-2', sender: 'Ananya', isCala: false, avatarType: 'orange-dot', message: 'Thank You, CALA', time: '10:30 AM', side: 'right', offsetX: 580, offsetY: 185, driftX: [0, -4, 5, -2, 0], driftY: [0, -6, 5, -2, 0], duration: 5.1 },
];

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}
const FAQ_SEQUENCE: FaqItem[] = [
  {
    id: 1,
    question: '1. Why are my periods so irregular?',
    answer: 'Your cycle, symptoms and progress can be followed over time, with ongoing guidance from your doctor and care team.',
  },
  {
    id: 2,
    question: '2. How do I know if my PCOS is improving?',
    answer: 'We track your hormonal markers, symptom patterns and ovulation cues over time so your personalized care plan continuously adapts to your progress.',
  },
  {
    id: 3,
    question: '3. Why do my symptoms keep changing?',
    answer: 'Hormonal fluctuations across follicular and luteal phases naturally shift symptoms. CALA maps your unique patterns to provide clear, targeted insights.',
  },
  {
    id: 4,
    question: '4. Can I get help between consultations?',
    answer: 'Yes! Your dedicated care team is available daily via private chat for guidance, symptom logging, questions, and ongoing emotional support.',
  },
  {
    id: 5,
    question: '5. What can I do to support my hormones every day?',
    answer: 'CALA provides daily personalized nutrition protocols, cycle-synced workouts, restorative sleep guidelines, and lifestyle coaching built around your biology.',
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
  const mobileScale = isMobile ? Math.min(1.15, Math.max(0.85, (typeof window !== 'undefined' ? window.innerWidth : 390) / 390)) : 1;
  const scaledX = isMobile ? targetX * mobileScale : targetX * scaleFactor;
  const scaledY = isMobile ? targetY * mobileScale : targetY * scaleFactor;

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
          whileDrag={{ scale: 1.12, zIndex: 60, cursor: 'grabbing' }}
          whileHover={{ scale: 1.08, cursor: 'grab', transition: { type: 'spring', stiffness: 400, damping: 15 } }}
          onClick={() => { setClickedPill(pill.id); setTimeout(() => setClickedPill(null), 600); }}
          className="relative group cursor-grab active:cursor-grabbing touch-none"
        >
          <AdaptiveGlass
            // isMobile={isMobile}
            borderRadius={9999}
            blur={1.2}
            contrast={1.08}
            brightness={1.08}
            saturation={1.4}
            shadowIntensity={0.03}
            displacementScale={0.8}
            elasticity={0.4}
            zIndex={20}
            className="transition-all duration-300 select-none border shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)] border-white/70 hover:border-white/95 bg-[#FFFFFF0A]"
          >
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                padding: isMobile
                  ? '6px 13px'
                  : `${Math.max(8, 15 * scaleFactor)}px ${Math.max(16, 28 * scaleFactor)}px`,
              }}
            >
              {clickedPill === pill.id && <motion.div initial={{ scale: 0.8, opacity: 0.9 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="absolute inset-0 rounded-full border-2 border-cyan-400 pointer-events-none" />}
              <span
                className="font-semibold text-zinc-900 tracking-tight whitespace-nowrap leading-none transition-colors duration-200"
                style={{
                  fontSize: isMobile ? '10px' : `clamp(11px, ${25 * scaleFactor}px, 16px)`,
                  color: '#1E2822',
                }}
              >
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
      style={{ opacity: 0 }}
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
          <div className="relative flex items-start gap-3 rounded-full" style={{ padding: `${Math.max(10, 16 * scaleFactor)}px ${Math.max(14, 20 * scaleFactor)}px`, maxWidth: `clamp(210px, ${310 * scaleFactor}px, 345px)` }}>
            {clickedId === item.id && <motion.div initial={{ scale: 0.8, opacity: 0.9 }} animate={{ scale: 1.4, opacity: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }} className="absolute inset-0 rounded-full border-2 border-cyan-400 pointer-events-none" />}
            {item.avatarType === 'cala-orb' ? (
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden shrink-0 mt-0.5 border border-teal-300/80 shadow-[0_2px_8px_rgba(36,168,184,0.35)]">
                <img src="/cala-orb.png" alt="CALA" className="w-full h-full object-cover" />
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
  const scrollControls = useScrollSequenceControls('CALA', CALA_SEQUENCE_CONFIG);

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

    gsap.set('.mobile-watermark', { xPercent: -50, yPercent: -50 });
    gsap.set('.mobile-3d-orb', { xPercent: -50, yPercent: -50 });
    gsap.set('.outer-pill', { xPercent: -50, yPercent: -50 });

    if (!isMobileDev) {
      gsap.set('.benefit-pill-pcos', { y: -125 });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: isMobileDev ? 0.35 : 1,
        invalidateOnRefresh: true,
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

    // Phase 4: 3.0 to 5.0s - CALA CARE TEAM text moving from right
    tl.fromTo('.care-team-text',
      { x: '100vw', autoAlpha: 0 },
      { x: '0', autoAlpha: 1, duration: 2.0, ease: 'power1.out' },
      "phase3+=0.5"
    );

    // Phase 4 Highlight
    tl.to('.talk-button-ring', { autoAlpha: 1, duration: 0.25 }, "phase3+=1.5")
      .to('.talk-button-ring', { autoAlpha: 0, duration: 0.35 }, "phase3+=2.0");

    // Phase 5: 5.0 to 5.5s - TalkWithCala fades out
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

    // Phase 7: Outer Chats appear sequentially (Desktop only)
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
    const orbPhase11Scale = isMobileDev ? 6.0 : scrollControls.phase11Scale;
    const orbPhase12Scale = isMobileDev ? 4.4 : scrollControls.phase12Scale;
    const orbPhase13Scale = isMobileDev ? 2.35 : scrollControls.phase13Scale;
    const isSmallHeight = !isMobileDev && typeof window !== 'undefined' && window.innerHeight < 850;
    const orbFinalScale = isMobileDev
      ? 2.35
      : isSmallHeight
        ? Math.min(scrollControls.finalOrbScale, Math.max(2.2, (window.innerHeight / 850) * scrollControls.finalOrbScale))
        : scrollControls.finalOrbScale;
    const phase11Top = isMobileDev ? '15%' : `${scrollControls.phase11Top}%`;
    const phase12Top = isMobileDev ? '42%' : `${scrollControls.phase12Top}%`;
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
    if (isMobileDev) {
      // Mobile: reveal all pills right in Phase 11 with the first benefits text
      tl.fromTo('.final-benefit-pill', { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, stagger: 0.1, duration: 0.8, ease: 'back.out(1.5)' }, "phase11+=0.8");
    }

    // Phase 12: 13.0 to 14.0s - Text 1 out, Text 2 in, Orb shrinks. Group 1 pills in (desktop).
    tl.to('.benefits-text-1', { autoAlpha: 0, scale: 1.05, duration: 0.5 }, "phase12");
    tl.to('.mobile-3d-orb', { scale: orbPhase12Scale, top: phase12Top, duration: 1.5, ease: 'power2.inOut' }, "phase12");
    tl.fromTo('.benefits-text-2', { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 0.8 }, "phase12+=0.8");
    if (!isMobileDev) {
      tl.fromTo('.benefit-pill-group-1', { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, stagger: 0.1, duration: 0.8, ease: 'back.out(1.5)' }, "phase12+=0.8");
    }

    // Phase 13: 14.5 to 15.5s - Text 2 out, Text 3 in, Orb shrinks to center. Group 2 pills revealed (desktop).
    tl.to('.benefits-text-2', { autoAlpha: 0, scale: 1.05, duration: 0.5 }, "phase13");
    tl.to('.mobile-3d-orb', { scale: orbPhase13Scale, top: finalOrbTop, duration: 1.5, ease: 'power2.inOut' }, "phase13");
    tl.fromTo('.benefits-text-3', { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 0.8 }, "phase13+=0.8");
    if (!isMobileDev) {
      tl.fromTo('.benefit-pill-group-2', { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, stagger: 0.1, duration: 0.8, ease: 'back.out(1.5)' }, "phase13+=0.8");

      tl.to('.benefit-pill-fertility', {
        x: -80,
        y: -10,
        duration: 1.5,
        ease: 'power2.inOut'
      }, "phase13");

      tl.to('.benefit-pill-pcos', {
        y: 0,
        duration: 1.5,
        ease: 'power2.inOut'
      }, "phase13");
    } else {
      tl.to('.benefit-pill-track', { top: '47%', duration: 1.5, ease: 'power2.inOut' }, "phase13");
      tl.to('.benefit-pill-ovulation', { top: '47%', duration: 1.5, ease: 'power2.inOut' }, "phase13");
      tl.to('.benefit-pill-fertility', { top: '62.5%', duration: 1.5, ease: 'power2.inOut' }, "phase13");
      tl.to('.benefit-pill-pcos', { top: '62.5%', duration: 1.5, ease: 'power2.inOut' }, "phase13");
      tl.to('.benefit-pill-habits', { top: '77%', duration: 1.5, ease: 'power2.inOut' }, "phase13");
    }

    // Phase 14: 16.0 to 17.0s - Settle orb and finalize
    tl.to('.mobile-3d-orb', { scale: orbPhase13Scale, duration: 1 }, "phase14");

    // Phase 15: Fade out benefits-text-3 and final pills completely
    tl.to('.benefits-text-3', { autoAlpha: 0, scale: 1.05, duration: 0.8, ease: 'power2.in' }, "phase15");
    tl.to('.final-benefit-pill', { autoAlpha: 0, scale: 0.85, duration: 0.8, stagger: 0.08, ease: 'power2.in' }, "phase15");
    tl.set('.benefits-sequence', { pointerEvents: 'none' }, "phase15+=0.8");

    // Phase 16: Build in FAQ section sequentially
    const faqStart = "phase15+=1.4";
    tl.to('.faq-container', { autoAlpha: 1, duration: 0.2 }, faqStart);
    tl.to('.mobile-3d-orb', { scale: orbFinalScale, duration: 1 }, faqStart);

    tl.fromTo('.faq-header',
      { autoAlpha: 0, y: -35 },
      { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power2.out' },
      `${faqStart}+=0.4`
    );

    tl.fromTo('.faq-pill',
      { autoAlpha: 0, x: -60, scale: 0.95 },
      { autoAlpha: 1, x: 0, scale: 1, stagger: 0.25, duration: 0.9, ease: 'back.out(1.2)' },
      `${faqStart}+=1.0`
    );

    tl.fromTo('.faq-right-box',
      { autoAlpha: 0, x: 60, scale: 0.95 },
      { autoAlpha: 1, x: 0, scale: 1, duration: 1.0, ease: 'power2.out' },
      `${faqStart}+=2.3`
    );

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
    text-[#008080]
    whitespace-nowrap
    text-[35vw]
    md:text-[clamp(130px,28vw,420px)]
    [text-shadow:0_4px_30px_rgba(114,178,170,0.08)]
  "
          >
            CALA
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
    w-[clamp(120px,32vw,145px)]
    h-[clamp(120px,32vw,145px)]
    md:w-[clamp(130px,35vw,360px)]
    md:h-[clamp(130px,35vw,360px)]
  "
            >
              <AdaptiveGlass
                isMobile={isMobile}
                borderRadius={9999}
                blur={scrollControls.glassBlur}
                contrast={scrollControls.glassContrast}
                brightness={scrollControls.glassBrightness}
                saturation={scrollControls.glassSaturation}
                shadowIntensity={scrollControls.glassShadowIntensity}
                displacementScale={scrollControls.glassDisplacement}
                elasticity={scrollControls.glassElasticity}
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

        {/* --- PHASE 3/4: CALA CARE TEAM TEXT --- */}
        <div className="care-team-text absolute inset-x-0 bottom-4 sm:bottom-8 lg:bottom-12 flex items-center justify-center pointer-events-none select-none z-10 opacity-0">
          <h1 className="text-[#008080] font-black uppercase text-center flex items-center justify-center leading-none tracking-[-0.015em] whitespace-nowrap" style={{ fontSize: 'clamp(70px, 12.5vw, 195px)' }}>
            CALA CARE TEAM
          </h1>
        </div>

        {/* --- PHASE 2: TALK TO CARE TEAM SECTION --- */}
        <div className="talk-with-cala absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none opacity-0">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-[#1E2822] tracking-[-0.03em] leading-[1.1]">
              <span className="text-[#008080]">CALA</span> is a Hormone & PCOS <br className='hidden md:block' />Care, Guided Over Time
            </h2>
            <p className="mt-4 sm:mt-5 text-[#27272C] text-sm sm:text-base md:text-[18px] leading-[1.2] max-w-xl font-medium">
              A structured care program for women who want to understand their hormones, rebuild healthier cycles and receive ongoing support.
            </p>
            <div className="mt-8 sm:mt-10">
              <TalkCareButton
                programName="CALA"
                imageSrc="/cala-orb.png"
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
                  <span className="text-[42px] sm:text-[72px] font-black tracking-widest text-[#008080] uppercase">CALA</span>
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
                    blur={scrollControls.glassBlur}
                    contrast={scrollControls.glassContrast}
                    brightness={scrollControls.glassBrightness}
                    saturation={scrollControls.glassSaturation}
                    shadowIntensity={scrollControls.glassShadowIntensity}
                    displacementScale={scrollControls.glassDisplacement}
                    elasticity={scrollControls.glassElasticity}
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
                      <CalaThreeCircle interactive={false} showControls={false} className="w-full h-full" />
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
                            <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 mt-0.5 border border-teal-300 shadow-sm"><img src="/cala-orb.png" alt="CALA" className="w-full h-full object-cover" /></div>
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
                    <div className="w-2.5 h-2.5 rounded-full overflow-hidden shrink-0 border border-teal-300"><img src="/cala-orb.png" alt="CALA" className="w-full h-full object-cover" /></div>
                    <span className="text-[8.5px] font-medium text-teal-800 tracking-tight">CALA Care</span>
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
        <div className="final-content absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none text-center opacity-0 px-2 sm:px-6">

          {/* MOBILE VIEW (< md) - 100% MATCH TO REFERENCE SCREENSHOT & FITS ALL SCREENS */}
          <div className="flex md:hidden flex-col items-center justify-center w-full max-w-[380px] mx-auto px-2 py-2 pointer-events-auto">
            {/* Header */}
            <div className="mb-2.5 sm:mb-3 text-center">
              <h3 className="text-[#E5855E] text-xs sm:text-lg font-bold tracking-wider uppercase mb-1">
                What's Inside The Membership
              </h3>
              <h2 className="text-2xl font-bold text-white tracking-tight leading-[1.1]">
                Care that looks at the whole<br />picture.
              </h2>
            </div>

            {/* 2-Column Grid of 5 Cards */}
            <div className="w-full grid grid-cols-2  gap-2 sm:gap-2.5">
              {/* Card 1 - Medical Care */}
              <div className="col-span-1 rounded-[18px] border border-white/20 bg-white/[0.08] backdrop-blur-md p-2.5 sm:p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_20px_rgba(0,0,0,0.12)] text-left flex flex-col">
                <h4 className="text-white text-[12px] sm:text-[13px] font-bold mb-1.5 leading-snug">Medical Care</h4>
                <ul className="space-y-1">
                  {['Same gynecologist', 'Monthly detailed consultations', 'Weekly care-team check-ins', 'Daily private chat support'].map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-white/95 text-[10px] sm:text-xs leading-tight font-normal">
                      <span className="w-1 h-1 rounded-full bg-white mt-1 shrink-0 opacity-80" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 2 - Hormone & Cycle Restoration */}
              <div className="col-span-1 rounded-[18px] border border-white/20 bg-white/[0.08] backdrop-blur-md p-3 sm:p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_20px_rgba(0,0,0,0.12)] text-left flex flex-col">
                <h4 className="text-white text-[12px] sm:text-lg font-bold mb-1.5 leading-tight">
                  Hormone & Cycle<br />Restoration
                </h4>
                <ul className="space-y-1">
                  {['Hormone tracking', 'Cycle rebuilding', 'Ovulation tracking', 'PCOS progress tracking', 'Fertility readiness tracking'].map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-white/95 text-[10px] sm:text-xs leading-tight font-normal">
                      <span className="w-1 h-1 rounded-full bg-white mt-1 shrink-0 opacity-80" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 3 - Intimate Health Care */}
              <div className="col-span-1 rounded-[18px] border border-white/20 bg-white/[0.08] backdrop-blur-md p-2.5 sm:p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_20px_rgba(0,0,0,0.12)] text-left flex flex-col">
                <h4 className="text-white text-[12px] sm:text-lg font-bold mb-1.5 leading-snug">Intimate Health Care</h4>
                <ul className="space-y-1">
                  {['Vaginal & uterine health guidance', 'Period pain & PMS support', 'Infection prevention guidance', 'Pelvic health awareness'].map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-white/95 text-[10px] sm:text-[10px] leading-tight font-normal">
                      <span className="w-1 h-1 rounded-full bg-white mt-1 shrink-0 opacity-80" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 4 - Emotional Support */}
              <div className="col-span-1 rounded-[18px] border border-white/20 bg-white/[0.08] backdrop-blur-md p-2.5 sm:p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_20px_rgba(0,0,0,0.12)] text-left flex flex-col">
                <h4 className="text-white text-[12px] sm:text-[13px] font-bold mb-1.5 leading-snug">Emotional Support</h4>
                <ul className="space-y-1">
                  {['Dedicated care companion', 'Stress & wellbeing tracking', 'Monthly emotional health review'].map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-white/95 text-[10px] sm:text-[10px] leading-tight font-normal">
                      <span className="w-1 h-1 rounded-full bg-white mt-1 shrink-0 opacity-80" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 5 - Lifestyle Support (Full Width Across Both Columns) */}
              <div className="col-span-2 rounded-[18px] border border-white/20 bg-white/[0.08] backdrop-blur-md p-2.5 sm:p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_20px_rgba(0,0,0,0.12)] text-left flex flex-col">
                <h4 className="text-white text-[12px] sm:text-[13px] font-bold mb-1.5 leading-snug">Lifestyle Support</h4>
                <ul className="space-y-1">
                  {['Personalized diet', 'Home / gym workout plan', 'Monthly plan adjustments', 'Lifestyle habit coaching'].map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-white/95 text-[10px] sm:text-xs leading-tight font-normal">
                      <span className="w-1 h-1 rounded-full bg-white mt-1 shrink-0 opacity-80" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Text */}
            <p className="mt-2.5 sm:mt-3 text-white/95 font-medium text-[10px] sm:text-xs leading-snug max-w-[320px] mx-auto text-center drop-shadow-sm">
              CALA brings medical, hormonal, intimate, emotional and lifestyle support together in one ongoing care program.
            </p>
          </div>

          {/* DESKTOP VIEW (>= md) */}
          <div className="hidden md:flex max-w-5xl mx-auto flex-col items-center pointer-events-auto w-full my-auto max-h-[96vh] justify-center transform-gpu origin-center [@media(max-height:750px)]:scale-[0.92] [@media(max-height:670px)]:scale-[0.84] [@media(max-height:590px)]:scale-[0.76] transition-transform">

            {/* Header Section */}
            <div className="mb-3 lg:mb-6 xl:mb-8 [@media(max-height:850px)]:mb-2 [@media(max-height:750px)]:mb-1">
              <h3 className="text-[#E5855E] text-[10px] sm:text-xs md:text-xs lg:text-lg font-bold tracking-tight uppercase md:mb-1">
                What's Inside The Membership
              </h3>
              <h2 className="text-3xl sm:text-4xl md:text-3xl lg:text-[32px] font-bold text-white tracking-tight drop-shadow-md leading-none">
                Care that looks at the whole <br /> picture.
              </h2>
            </div>

            {/* Grid of Cards – 3+2 centered desktop */}
            <div className="w-full grid grid-cols-6 gap-2.5 mt-5 md:gap-3 lg:gap-4 [@media(max-height:800px)]:gap-2.5">

              {/* Card 1 - Medical Care */}
              <div className="col-span-2">
                <AdaptiveGlass borderRadius={24} blur={1.8} contrast={1.12} brightness={1.05} saturation={1.15} shadowIntensity={0.1} displacementScale={0.8} elasticity={0.4} zIndex={10} className="rounded-2xl lg:rounded-3xl border border-white/20 transition-all duration-300 hover:border-white/40 shadow-2xl h-full w-full group">
                  <div className="p-3.5 md:p-3.5 lg:p-4 xl:p-5 [@media(max-height:800px)]:p-3 text-left flex flex-col h-full relative z-10">
                    <h4 className="text-white text-xs md:text-sm lg:text-base xl:text-lg font-bold mb-1.5 md:mb-2 lg:mb-2.5 drop-shadow-sm leading-tight">Medical Care</h4>
                    <ul className="space-y-1 md:space-y-1 lg:space-y-1.5 xl:space-y-2 [@media(max-height:800px)]:space-y-0.5">
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-[13px] xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Same gynecologist</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-[13px] xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Monthly detailed consultations</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-[13px] xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Weekly care-team check-ins</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-[13px] xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Daily private chat support</span>
                      </li>
                    </ul>
                  </div>
                </AdaptiveGlass>
              </div>

              {/* Card 2 - Hormone & Cycle Restoration */}
              <div className="col-span-2">
                <AdaptiveGlass borderRadius={24} blur={1.8} contrast={1.12} brightness={1.05} saturation={1.15} shadowIntensity={0.1} displacementScale={0.8} elasticity={0.4} zIndex={10} className="rounded-2xl lg:rounded-3xl border border-white/20 transition-all duration-300 hover:border-white/40 shadow-2xl h-full w-full group">
                  <div className="p-3.5 md:p-3.5 lg:p-4 xl:p-5 [@media(max-height:800px)]:p-3 text-left flex flex-col h-full relative z-10">
                    <h4 className="text-white text-xs md:text-sm lg:text-base xl:text-lg font-bold mb-1.5 md:mb-2 lg:mb-2.5 drop-shadow-sm leading-tight">Hormone & Cycle Restoration</h4>
                    <ul className="space-y-1 md:space-y-1 lg:space-y-1.5 xl:space-y-2 [@media(max-height:800px)]:space-y-0.5">
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Hormone tracking</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Cycle rebuilding</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Ovulation tracking</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>PCOS progress tracking</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Fertility readiness tracking</span>
                      </li>
                    </ul>
                  </div>
                </AdaptiveGlass>
              </div>

              {/* Card 3 - Intimate Health Care */}
              <div className="col-span-2">
                <AdaptiveGlass borderRadius={24} blur={1.8} contrast={1.12} brightness={1.05} saturation={1.15} shadowIntensity={0.1} displacementScale={0.8} elasticity={0.4} zIndex={10} className="rounded-2xl lg:rounded-3xl border border-white/20 transition-all duration-300 hover:border-white/40 shadow-2xl h-full w-full group">
                  <div className="p-3.5 md:p-3.5 lg:p-4 xl:p-5 [@media(max-height:800px)]:p-3 text-left flex flex-col h-full relative z-10">
                    <h4 className="text-white text-xs md:text-sm lg:text-base xl:text-lg font-bold mb-1.5 md:mb-2 lg:mb-2.5 drop-shadow-sm leading-tight">Intimate Health Care</h4>
                    <ul className="space-y-1 md:space-y-1 lg:space-y-1.5 xl:space-y-2 [@media(max-height:800px)]:space-y-0.5">
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Vaginal & uterine health guidance</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Period pain & PMS support</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Infection prevention guidance</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Pelvic health awareness</span>
                      </li>
                    </ul>
                  </div>
                </AdaptiveGlass>
              </div>

              {/* Card 4 - Emotional Support (centered on desktop row 2) */}
              <div className="col-span-2 col-start-2">
                <AdaptiveGlass borderRadius={24} blur={1.8} contrast={1.12} brightness={1.05} saturation={1.15} shadowIntensity={0.1} displacementScale={0.8} elasticity={0.4} zIndex={10} className="rounded-2xl lg:rounded-3xl border border-white/20 transition-all duration-300 hover:border-white/40 shadow-2xl h-full w-full group">
                  <div className="p-3.5 md:p-3.5 lg:p-4 xl:p-5 [@media(max-height:800px)]:p-3 text-left flex flex-col h-full relative z-10">
                    <h4 className="text-white text-xs md:text-sm lg:text-base xl:text-lg font-bold mb-1.5 md:mb-2 lg:mb-2.5 drop-shadow-sm leading-tight">Emotional Support</h4>
                    <ul className="space-y-1 md:space-y-1 lg:space-y-1.5 xl:space-y-2 [@media(max-height:800px)]:space-y-0.5">
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Dedicated care companion</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Stress & wellbeing tracking</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Monthly emotional health review</span>
                      </li>
                    </ul>
                  </div>
                </AdaptiveGlass>
              </div>

              {/* Card 5 - Lifestyle Support (auto-placed on desktop) */}
              <div className="col-span-2">
                <AdaptiveGlass borderRadius={24} blur={1.8} contrast={1.12} brightness={1.05} saturation={1.15} shadowIntensity={0.1} displacementScale={0.8} elasticity={0.4} zIndex={10} className="rounded-2xl lg:rounded-3xl border border-white/20 transition-all duration-300 hover:border-white/40 shadow-2xl h-full w-full group">
                  <div className="p-3.5 md:p-3.5 lg:p-4 xl:p-5 [@media(max-height:800px)]:p-3 text-left flex flex-col h-full relative z-10">
                    <h4 className="text-white text-xs md:text-sm lg:text-base xl:text-lg font-bold mb-1.5 md:mb-2 lg:mb-2.5 drop-shadow-sm leading-tight">Lifestyle Support</h4>
                    <ul className="space-y-1 md:space-y-1 lg:space-y-1.5 xl:space-y-2 [@media(max-height:800px)]:space-y-0.5">
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Personalized diet</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Home / gym workout plan</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Monthly plan adjustments</span>
                      </li>
                      <li className="flex items-start gap-1.5 md:gap-2 text-white/95 text-[10px] md:text-xs lg:text-base xl:text-lg leading-snug font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0 shadow-sm" />
                        <span>Lifestyle habit coaching</span>
                      </li>
                    </ul>
                  </div>
                </AdaptiveGlass>
              </div>

            </div>

            {/* Footer Text */}
            <p className="mt-3 md:mt-3 lg:mt-4 xl:mt-6 [@media(max-height:800px)]:mt-2 text-white font-medium text-xs md:text-sm lg:text-lg drop-shadow max-w-2xl leading-normal">
              CALA brings medical, hormonal, intimate, emotional and lifestyle support together in one ongoing care program.
            </p>
          </div>
        </div>

        {/* --- PHASE 11-14: BENEFITS SEQUENCE --- */}
        <div className="benefits-sequence absolute inset-0 z-40 pointer-events-none">
          {/* Texts */}
          <div className="benefits-text-1 absolute inset-x-0 top-[22%] sm:top-1/2 sm:-translate-y-1/2 flex flex-col items-center justify-center text-center px-4 opacity-0 pointer-events-none">
            <span className="text-[#E5855E] text-[10px] sm:text-sm md:text-base font-bold tracking-widest uppercase mb-1.5 sm:mb-4">BENEFITS</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white tracking-tight drop-shadow-md max-w-[280px] sm:max-w-none">Understand your cycles.</h2>
          </div>
          <div className="benefits-text-2 absolute inset-x-0 top-[33%] sm:top-1/2 sm:-translate-y-1/2 flex flex-col items-center justify-center text-center px-4 opacity-0 pointer-events-none">
            <span className="text-[#E5855E] text-[10px] sm:text-sm md:text-base font-bold tracking-widest uppercase mb-1.5 sm:mb-4">BENEFITS</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white tracking-tight drop-shadow-md max-w-[280px] sm:max-w-none">Track your progress.</h2>
          </div>
          <div className="benefits-text-3 absolute inset-x-0 top-[45%] sm:top-1/2 sm:-translate-y-1/2 flex flex-col items-center justify-center text-center px-4 opacity-0 pointer-events-none">
            <span className="text-[#E5855E] text-[10px] sm:text-sm md:text-base font-bold tracking-widest uppercase mb-1.5 sm:mb-2">BENEFITS</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white tracking-tight drop-shadow-md max-w-[280px] sm:max-w-none">Stay supported.</h2>
          </div>

          {/* Pills (Group 1 shown in Phase 12, Group 2 revealed in Phase 13) */}
          <div className="final-benefit-pill benefit-pill-group-2 benefit-pill-track absolute opacity-0 pointer-events-auto top-[65%] md:top-[40%] right-0 sm:right-6 md:right-[calc(58%+150px)]">
            <div className="-translate-y-1/2 flex items-center justify-center">
              <AdaptiveGlass borderRadius={999} blur={2} contrast={1.1} className="px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-6 md:py-2 border border-white/10 transition-transform hover:scale-105 cursor-default backdrop-blur-xl">
                <span className="text-[#1E2822] text-[9.5px] sm:text-[11px] lg:text-lg font-bold whitespace-nowrap tracking-tight">Track hormone patterns</span>
              </AdaptiveGlass>
            </div>
          </div>
          <div className="final-benefit-pill benefit-pill-group-2 benefit-pill-ovulation absolute opacity-0 pointer-events-auto top-[65%] md:top-[65%] left-0 sm:left-6 md:left-auto md:right-[calc(58%+110px)]">
            <div className="-translate-y-1/2 flex items-center justify-center">
              <AdaptiveGlass borderRadius={999} blur={2} contrast={1.1} className="px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-10 md:py-2 border border-white/10 transition-transform hover:scale-105 cursor-default backdrop-blur-xl">
                <span className="text-[#1E2822] text-[9.5px] sm:text-[11px] lg:text-lg font-bold whitespace-nowrap tracking-tight">Follow ovulation</span>
              </AdaptiveGlass>
            </div>
          </div>
          <div className="final-benefit-pill benefit-pill-group-1 benefit-pill-fertility absolute opacity-0 pointer-events-auto top-[80%] md:top-[42%] right-3 sm:right-10 md:right-auto md:left-[calc(62%+195px)]">
            <div className="-translate-y-1/2 flex items-center justify-center">
              <AdaptiveGlass borderRadius={999} blur={2} contrast={1.1} className="px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-6 md:py-2 border border-white/10 transition-transform hover:scale-105 cursor-default backdrop-blur-xl">
                <span className="text-[#1E2822] text-[9.5px] sm:text-[11px] lg:text-lg font-bold whitespace-nowrap tracking-tight">Prepare for future fertility</span>
              </AdaptiveGlass>
            </div>
          </div>
          <div className="final-benefit-pill benefit-pill-group-1 benefit-pill-habits absolute opacity-0 pointer-events-auto top-[90%] md:top-[60%] left-1/2 -translate-x-1/2 md:translate-x-0 md:left-[calc(58%+110px)]">
            <div className="-translate-y-1/2 flex items-center justify-center">
              <AdaptiveGlass borderRadius={999} blur={2} contrast={1.1} className="px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-6 md:py-2 border border-white/10 transition-transform hover:scale-105 cursor-default backdrop-blur-xl">
                <span className="text-[#1E2822] text-[9.5px] sm:text-[11px] lg:text-lg font-bold whitespace-nowrap tracking-tight">Build sustainable habits</span>
              </AdaptiveGlass>
            </div>
          </div>
          <div className="final-benefit-pill benefit-pill-group-1 benefit-pill-pcos absolute opacity-0 pointer-events-auto top-[80%] md:top-[calc(62%+230px)] left-3 sm:left-10 md:left-1/2 md:-translate-x-1/2">
            <div className="-translate-y-1/2 flex items-center justify-center">
              <AdaptiveGlass borderRadius={999} blur={2} contrast={1.1} className="px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-6 md:py-2 border border-white/10 transition-transform hover:scale-105 cursor-default backdrop-blur-xl">
                <span className="text-[#1E2822] text-[9.5px] sm:text-[11px] lg:text-lg font-bold whitespace-nowrap tracking-tight">Monitor PCOS progress</span>
              </AdaptiveGlass>
            </div>
          </div>
        </div>

        {/* --- PHASE 16: FAQ Let's Figure Out Together --- */}
        <div className="faq-container absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none opacity-0 select-none">

          {/* Top Header */}
          <div className="faq-header text-center absolute top-3 sm:top-4 md:top-5 lg:top-12 [@media(min-height:920px)]:lg:top-15 [@media(max-height:820px)]:top-2.5 [@media(max-height:720px)]:top-1.5 pointer-events-auto z-30 flex flex-col items-center transform-gpu origin-top [@media(max-height:820px)]:scale-[0.88] [@media(max-height:720px)]:scale-[0.78]">
            <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-[28px] [@media(min-height:920px)]:lg:text-[32px] font-bold text-black tracking-tight leading-tight">
              {"Let’s Figure Out Together with"}
            </h2>
            <span className="text-[#008080] font-bold uppercase tracking-tight text-lg sm:text-xl md:text-xl lg:text-2xl [@media(min-height:920px)]:text-[28px] mt-0.5">
              CALA
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
                  <div className="p-5 sm:p-6 lg:p-8 flex flex-col text-left">
                    <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-teal-300 shadow-[0_2px_8px_rgba(36,168,184,0.35)] shrink-0">
                        <img src="/cala-orb.png" alt="CALA" className="w-full h-full object-cover scale-[1.1]" />
                      </div>
                      <span className="text-[10px] sm:text-sm font-bold text-[#2A857D] tracking-wide">
                        CALA Care Team
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
                          className="text-[13px] md:text-base lg:text-2xl text-[#1E2822] leading-[1.1] font-medium"
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
            <div className="flex md:hidden absolute inset-x-0 bottom-4 top-[100px] flex-col justify-start items-center px-4 pointer-events-auto z-40 overflow-y-auto pt-2 pb-2">

              {/* Answer Box (TOP) */}
              <div className="faq-right-box w-full max-w-[340px] mb-auto relative z-10 shrink-0">
                <AdaptiveGlass
                  borderRadius={24}
                  blur={2.5}
                  contrast={1.12}
                  brightness={1.04}
                  saturation={1.15}
                  shadowIntensity={0.08}
                  displacementScale={0.8}
                  elasticity={0.4}
                  zIndex={20}
                  className="w-full rounded-3xl border border-white/80 backdrop-blur-2xl transition-all"
                >
                  <div className="p-5 flex flex-col text-left">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-teal-300 shadow-[0_2px_8px_rgba(36,168,184,0.35)] shrink-0">
                        <img src="/cala-orb.png" alt="CALA" className="w-full h-full object-cover scale-[1.1]" />
                      </div>
                      <span className="text-[12px] font-bold text-[#2A857D] tracking-wide">CALA Care Team</span>
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
                </AdaptiveGlass>
              </div>

              {/* Spacer for 3D Orb to sit in the middle */}
              <div className="w-full min-h-[230px] shrink-0"></div>

              {/* Pills list (BOTTOM) */}
              <div className="flex flex-col gap-2.5 w-full max-w-[340px] relative z-10 shrink-0">
                {FAQ_SEQUENCE.map((faq) => {
                  const isActive = activeFaqId === faq.id;
                  return (
                    <div
                      key={`mobile-faq-pill-${faq.id}`}
                      onClick={() => setActiveFaqId(faq.id)}
                      className={`faq-pill group relative cursor-pointer select-none rounded-[24px] transition-all duration-300 ${isActive ? 'scale-[1.02] z-20' : 'hover:scale-[1.01] z-10'
                        }`}
                    >
                      <AdaptiveGlass
                        borderRadius={24}
                        blur={2}
                        contrast={1.12}
                        brightness={1.04}
                        saturation={1.15}
                        shadowIntensity={0.06}
                        displacementScale={0.7}
                        elasticity={0.35}
                        zIndex={20}
                        className={`w-full rounded-[24px] border transition-all duration-300 ${isActive
                          ? 'border-[#E5855E]/40 shadow-[0_8px_25px_rgba(229,133,94,0.15)] bg-white/20'
                          : 'border-white/70 hover:border-white/95 shadow-[0_4px_16px_rgba(0,0,0,0.03)]'
                          }`}
                      >
                        <div className="px-5 py-3 text-left">
                          <span
                            className={`text-[12px] leading-snug line-clamp-2 transition-colors duration-200 ${isActive
                              ? 'font-bold text-[#E5855E]'
                              : 'font-semibold text-[#1E2822]/85 group-hover:text-[#1E2822]'
                              }`}
                          >
                            {faq.question}
                          </span>
                        </div>
                      </AdaptiveGlass>
                    </div>
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
