'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import CalaThreeCircle from './CalaThreeCircle';
import { LiquidGlass } from '@liquidglass/react';

interface ChatItem {
  id: string;
  sender: string;
  isCala: boolean;
  avatarType: 'orange-dot' | 'cala-orb';
  message: string;
  time: string;
  side: 'left' | 'right';
  offsetX: number;
  offsetY: number;
  driftX: number[];
  driftY: number[];
  duration: number;
  threshold: number; // scroll progress threshold to reveal (0.0 - 1.0)
}

// 6 chronological conversation steps matching outer cards & mobile chat feed
const CHAT_SEQUENCE: ChatItem[] = [
  {
    id: 'msg-1',
    sender: 'Arjun & Neha',
    isCala: false,
    avatarType: 'orange-dot',
    message: "How can we prepare together?",
    time: '10:24 AM',
    side: 'left',
    offsetX: -220,
    offsetY: -155,
    driftX: [0, 5, -4, 2, 0],
    driftY: [0, 6, -5, 2, 0],
    duration: 5.0,
    threshold: 0.12,
  },
  {
    id: 'msg-2',
    sender: 'Care Team',
    isCala: true,
    avatarType: 'cala-orb',
    message: "We guide both partners with fertility, lifestyle, and conception planning.",
    time: '10:25 AM',
    side: 'left',
    offsetX: -150,
    offsetY: 15,
    driftX: [0, 5, -4, 2, 0],
    driftY: [0, 6, -5, 2, 0],
    duration: 5.0,
    threshold: 0.26,
  },
  {
    id: 'msg-3',
    sender: 'Arjun & Neha',
    isCala: false,
    avatarType: 'orange-dot',
    message: "Thank You, Care Team",
    time: '10:26 AM',
    side: 'left',
    offsetX: -270,
    offsetY: 180,
    driftX: [0, 5, -4, 2, 0],
    driftY: [0, 6, -5, 2, 0],
    duration: 5.0,
    threshold: 0.4,
  },
  {
    id: 'msg-4',
    sender: 'Rohan & Maya',
    isCala: false,
    avatarType: 'orange-dot',
    message: "Can we coordinate our next steps?",
    time: '10:28 AM',
    side: 'right',
    offsetX: 520,
    offsetY: -145,
    driftX: [0, 5, -4, 2, 0],
    driftY: [0, 6, -5, 2, 0],
    duration: 5.0,
    threshold: 0.54,
  },
  {
    id: 'msg-5',
    sender: 'Care Team',
    isCala: true,
    avatarType: 'cala-orb',
    message: "Yes. Your program includes couple consultations and weekly follow-ups.",
    time: '10:29 AM',
    side: 'right',
    offsetX: 420,
    offsetY: 20,
    driftX: [0, 5, -4, 2, 0],
    driftY: [0, 6, -5, 2, 0],
    duration: 5.0,
    threshold: 0.68,
  },
  {
    id: 'msg-6',
    sender: 'Rohan & Maya',
    isCala: false,
    avatarType: 'orange-dot',
    message: "Thank You, Care Team",
    time: '10:30 AM',
    side: 'right',
    offsetX: 370,
    offsetY: 185,
    driftX: [0, 5, -4, 2, 0],
    driftY: [0, 6, -5, 2, 0],
    duration: 5.0,
    threshold: 0.82,
  },
];

// Interactive Outer Floating Pill Component (Reveals one by one)
function OuterChatPill({
  item,
  scaleFactor,
  isRevealed,
  clickedId,
  setClickedId,
}: {
  item: ChatItem;
  scaleFactor: number;
  isRevealed: boolean;
  clickedId: string | null;
  setClickedId: (id: string | null) => void;
}) {
  const targetX = item.offsetX * scaleFactor;
  const targetY = item.offsetY * scaleFactor;
  const slideOffsetX = item.side === 'left' ? -40 : 40;

  return (
    <motion.div
      className="absolute pointer-events-auto select-none"
      initial={{
        x: targetX + slideOffsetX,
        y: targetY,
        opacity: 0,
        scale: 0.86,
      }}
      animate={{
        x: isRevealed ? targetX : targetX + slideOffsetX,
        y: targetY,
        opacity: isRevealed ? 1 : 0,
        scale: isRevealed ? 1 : 0.86,
        pointerEvents: isRevealed ? 'auto' : 'none',
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 24,
        mass: 0.8,
      }}
    >
      <motion.div
        animate={{
          x: item.driftX.map((v) => v * scaleFactor),
          y: item.driftY.map((v) => v * scaleFactor),
        }}
        transition={{
          duration: item.duration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        drag
        dragConstraints={{
          left: -35 * scaleFactor,
          right: 35 * scaleFactor,
          top: -25 * scaleFactor,
          bottom: 25 * scaleFactor,
        }}
        dragElastic={0.35}
        whileDrag={{
          scale: 1.05,
          zIndex: 60,
          cursor: 'grabbing',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        }}
        whileHover={{
          scale: 1.03,
          cursor: 'grab',
          transition: { type: 'spring', stiffness: 400, damping: 15 },
        }}
        onClick={() => {
          setClickedId(item.id);
          setTimeout(() => setClickedId(null), 700);
        }}
        className="relative group cursor-grab active:cursor-grabbing"
      >
        <LiquidGlass
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
          <div
            className="relative flex items-start gap-3 rounded-3xl"
            style={{
              padding: `${Math.max(10, 14 * scaleFactor)}px ${Math.max(14, 20 * scaleFactor)}px`,
              maxWidth: `clamp(210px, ${310 * scaleFactor}px, 345px)`,
            }}
          >
            {clickedId === item.id && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.9 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="absolute inset-0 rounded-3xl border-2 border-cyan-400 pointer-events-none"
              />
            )}

            {item.avatarType === 'cala-orb' ? (
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden shrink-0 mt-0.5 border border-teal-300/80 shadow-[0_2px_8px_rgba(36,168,184,0.35)]">
                <CalaThreeCircle interactive={false} className="w-full h-full" />
              </div>
            ) : (
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#E5855E] shrink-0 mt-1 shadow-sm border border-white/60" />
            )}

            <div className="flex flex-col text-left">
              <span
                className={`font-semibold text-xs tracking-tight ${
                  item.isCala ? 'text-[#3E9B92]' : 'text-[#1E2822]'
                }`}
              >
                {item.sender}
              </span>
              <p
                className="text-xs sm:text-[13px] text-[#4A554F] leading-snug mt-1 font-normal"
                style={{
                  fontSize: `clamp(11px, ${13 * scaleFactor}px, 13.5px)`,
                }}
              >
                {item.message}
              </p>
            </div>
          </div>
        </LiquidGlass>
      </motion.div>
    </motion.div>
  );
}

export default function CalaChat() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [clickedId, setClickedId] = useState<string | null>(null);

  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setScaleFactor(0.55);
      } else if (w < 640) {
        setScaleFactor(0.68);
      } else if (w < 768) {
        setScaleFactor(0.78);
      } else if (w < 1024) {
        setScaleFactor(0.88);
      } else if (w < 1280) {
        setScaleFactor(0.95);
      } else {
        setScaleFactor(1);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  const [currentProgress, setCurrentProgress] = useState(0);
  useEffect(() => {
    return smoothProgress.on('change', (v) => setCurrentProgress(v));
  }, [smoothProgress]);

  // Determine active visible messages inside mobile based on scroll progress
  // Filter ensures only revealed items are mounted in DOM
  const visibleMessages = useMemo(() => {
    return CHAT_SEQUENCE.filter((item) => currentProgress >= item.threshold);
  }, [currentProgress]);

  // Is next message currently typing?
  const isTyping = useMemo(() => {
    // Show typing if we're between messages
    if (visibleMessages.length === 0) return currentProgress > 0.05;
    if (visibleMessages.length === 6) return false;
    const nextItem = CHAT_SEQUENCE[visibleMessages.length];
    return currentProgress >= nextItem.threshold - 0.08 && currentProgress < nextItem.threshold;
  }, [currentProgress, visibleMessages.length]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[280vh] bg-[#FAF8F5] select-none"
    >
      {/* Sticky Fullscreen Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
      
        {/* 2. Soft Ambient Center Radial Glow */}
        <div className="absolute w-[650px] h-[480px] rounded-full bg-gradient-to-b from-teal-100/25 via-cyan-50/20 to-transparent blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />

        {/* 3. Section Title: "Ongoing Care, Real Support" */}
        <div className="absolute top-6 sm:top-10 md:top-14 z-30 text-center px-4 pointer-events-none">
          <h2 className="text-2xl sm:text-3xl md:text-[38px] font-bold text-[#1E2822] tracking-tight leading-tight">
            Ongoing Care, Real Support
          </h2>
        </div>

        {/* 4. Giant Background Typography: "CALA CARE TEAM" Exactly Like Reference Mockup */}
        <div className="absolute inset-x-0 bottom-4 sm:bottom-8 lg:bottom-12 flex items-center justify-center pointer-events-none select-none z-0">
          <h1
            className="text-[#72B2AA]/25 font-black uppercase text-center flex items-center justify-center leading-none tracking-[-0.015em] whitespace-nowrap"
            style={{
              fontSize: 'clamp(70px, 12.5vw, 195px)',
            }}
          >
            CALA CARE TEAM
          </h1>
        </div>

        {/* 5. Main Stage Area with Mobile Phone and Outer Floating Chat Pills */}
        <div className="relative z-10 w-full max-w-[1240px] h-[580px] sm:h-[660px] md:h-[720px] flex items-center justify-center mx-auto px-4">
          
          {/* THE SMARTPHONE MOCKUP: Exclusively uses /mobile-cala.svg */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div
              className="relative aspect-[872/1804] flex items-center justify-center select-none"
              style={{
                width: `clamp(270px, ${325 * scaleFactor}px, 355px)`,
              }}
            >
              {/* Only the SVG /mobile-cala.svg is rendered */}
              <img
                src="/mobile-cala.png"
                alt="EVE + GENESIS Mobile"
                className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_25px_60px_rgba(0,0,0,0.14)]"
              />

              {/* WATERMARK "CALA" BEHIND GLOBE (Inside mobile screen) */}
              <div
                className="absolute z-10 pointer-events-none select-none flex items-center justify-center"
                style={{
                  top: '30%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <span className="text-[52px] sm:text-[62px] font-black tracking-widest text-[#72B2AA]/20 uppercase">
                  CALA
                </span>
              </div>

              {/* 3D ROTATING PLANET GLOBE PLACED IN CENTER OF MOBILE SCREEN */}
              <div
                className="absolute z-15 pointer-events-none rounded-full overflow-hidden flex items-center justify-center border-2 border-white/80 shadow-[0_6px_28px_rgba(36,168,184,0.35)]"
                style={{
                  top: '37%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: `clamp(130px, ${158 * scaleFactor}px, 170px)`,
                  height: `clamp(130px, ${158 * scaleFactor}px, 170px)`,
                }}
              >
                <CalaThreeCircle interactive={false} className="w-full h-full" />
              </div>

              {/* WHATSAPP-STYLE IN-MOBILE CHAT FEED */}
              {/* Messages enter at bottom and previous messages move UP as new ones reveal */}
              <div
                className="absolute z-30 overflow-hidden flex flex-col justify-end"
                style={{
                  top: '14%',
                  bottom: '10%',
                  left: '7%',
                  right: '7%',
                  maskImage:
                    'linear-gradient(to bottom, transparent 0%, black 14%, black 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, transparent 0%, black 14%, black 100%)',
                }}
              >
                {/* Flex column container with mt-auto anchor:
                    Guarantees latest message stays at bottom and older messages smoothly move TOP */}
                <div className="w-full flex flex-col justify-end gap-2.5 pb-1">
                  
                  {/* Empty spacer pushes few messages to bottom */}
                  <div className="mt-auto flex-shrink-0" />

                  <AnimatePresence mode="popLayout" initial={false}>
                    {visibleMessages.map((item) => (
                      <motion.div
                        key={`mob-${item.id}`}
                        layout
                        initial={{ opacity: 0, y: 32, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.92 }}
                        transition={{
                          type: 'spring',
                          stiffness: 340,
                          damping: 26,
                          mass: 0.75,
                        }}
                        className={`w-full flex ${
                          item.isCala ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        {item.isCala ? (
                          // CALA Care Team message bubble (WhatsApp incoming style)
                          <div
                            className={`max-w-[88%] p-2 sm:p-2.5 rounded-2xl rounded-tl-sm bg-white/95 backdrop-blur-md border border-teal-100 shadow-[0_3px_12px_rgba(0,0,0,0.06)] flex items-start gap-1.5 transition-all duration-300 ${
                              clickedId === item.id ? 'ring-2 ring-teal-400' : ''
                            }`}
                          >
                            <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 mt-0.5 border border-teal-300 shadow-sm">
                              <CalaThreeCircle interactive={false} className="w-full h-full" />
                            </div>
                            <div className="text-left flex-1">
                              <div className="text-[9px] font-bold text-[#3E9B92] leading-tight">
                                {item.sender}
                              </div>
                              <div className="text-[10px] text-[#2C3831] leading-snug mt-0.5 font-normal">
                                {item.message}
                              </div>
                              <div className="text-[8px] text-gray-400 text-right mt-0.5">
                                {item.time}
                              </div>
                            </div>
                          </div>
                        ) : (
                          // User message bubble (WhatsApp outgoing style)
                          <div
                            className={`max-w-[85%] px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl rounded-tr-sm bg-[#E6F4F1] border border-teal-200/70 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-right transition-all duration-300 ${
                              clickedId === item.id ? 'ring-2 ring-[#E5855E]' : ''
                            }`}
                          >
                            <div className="text-[8.5px] font-semibold text-[#E5855E] text-right mb-0.5">
                              {item.sender}
                            </div>
                            <div className="text-[10px] text-[#1E2822] leading-snug font-medium text-left">
                              {item.message}
                            </div>
                            <div className="text-[8px] text-teal-700/60 mt-0.5 flex items-center justify-end gap-1">
                              <span>{item.time}</span>
                              <span className="text-[9px] text-teal-600 font-bold">✓✓</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* BOTTOM STATUS ROW (Matching reference mockup: messages indicator & typing pill) */}
              <div
                className="absolute z-35 inset-x-[7%] flex items-center justify-between pointer-events-none"
                style={{ bottom: '4.8%' }}
              >
                {/* Left indicator: message count */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm border border-teal-100 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
                  <div className="w-2.5 h-2.5 rounded-full overflow-hidden shrink-0 border border-teal-300">
                    <CalaThreeCircle interactive={false} className="w-full h-full" />
                  </div>
                  <span className="text-[8.5px] font-medium text-teal-800 tracking-tight">
                    {visibleMessages.length > 0
                      ? `${visibleMessages.length} messages`
                      : 'EVE + GENESIS Care'}
                  </span>
                </div>

                {/* Right indicator: Typing state when user scrolls */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm border border-orange-100 shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
                    >
                      <div className="flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E5855E] animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E5855E] animate-pulse delay-75" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E5855E] animate-pulse delay-150" />
                      </div>
                      <span className="text-[8.5px] font-medium text-[#E5855E]">
                        Typing...
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* 6 OUTER FLOATING CHAT PILLS (Reveal one by one matching each WhatsApp message) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            {CHAT_SEQUENCE.map((item) => (
              <OuterChatPill
                key={item.id}
                item={item}
                scaleFactor={scaleFactor}
                isRevealed={currentProgress >= item.threshold}
                clickedId={clickedId}
                setClickedId={setClickedId}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}