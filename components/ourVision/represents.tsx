'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface PillarItem {
  id: string;
  num: string;
  title: string[];
  descLine1: string;
  descLine2: string;
  angle: number; // degrees (12 o'clock = -90)
  color: {
    start: string;
    mid: string;
    end: string;
    text: string;
    line: string;
    accent: string;
  };
  startOffset: { r: number; deg: number };
  dotPos: { x: number; y: number };
  textPos: { x: number; y: number; align: 'start' | 'middle' | 'end' };
}

// Exactly matching the 8 petals in the reference image (clockwise from top)
const pillarsData: PillarItem[] = [
  {
    id: 'consultation',
    num: '01',
    title: ['Consultation'],
    descLine1: 'More meaningful conversations',
    descLine2: 'between doctors and patients.',
    angle: -90, // 12 o'clock
    color: {
      start: '#BDD2C7',
      mid: '#9EBAAC',
      end: '#7C9B8C',
      text: '#2A4639',
      line: '#7C9B8C',
      accent: '#3D5E4E',
    },
    startOffset: { r: 228, deg: -76 },
    dotPos: { x: 500, y: 92 },
    textPos: { x: 514, y: 84, align: 'start' },
  },
  {
    id: 'diagnosis',
    num: '02',
    title: ['Diagnosis &', 'Assessment'],
    descLine1: 'Faster, more accurate insights',
    descLine2: 'for personalised care.',
    angle: -45, // ~1:30
    color: {
      start: '#F3C0B1',
      mid: '#E09F8C',
      end: '#C97A66',
      text: '#96402B',
      line: '#C97A66',
      accent: '#B0533C',
    },
    startOffset: { r: 230, deg: -31 },
    dotPos: { x: 795, y: 205 },
    textPos: { x: 810, y: 196, align: 'start' },
  },
  {
    id: 'treatment',
    num: '03',
    title: ['Treatment'],
    descLine1: 'Right care, at',
    descLine2: 'the right time.',
    angle: 0, // 3 o'clock
    color: {
      start: '#F7DC9E',
      mid: '#E9C070',
      end: '#D89E3B',
      text: '#8E5F13',
      line: '#D89E3B',
      accent: '#B87F22',
    },
    startOffset: { r: 232, deg: 14 },
    dotPos: { x: 865, y: 465 },
    textPos: { x: 880, y: 456, align: 'start' },
  },
  {
    id: 'medicine',
    num: '04',
    title: ['Medicine'],
    descLine1: 'Safer, streamlined prescriptions',
    descLine2: 'and adherence.',
    angle: 45, // ~4:30
    color: {
      start: '#C0E2D6',
      mid: '#9EC7B9',
      end: '#7AA99B',
      text: '#2F6153',
      line: '#7AA99B',
      accent: '#477C6D',
    },
    startOffset: { r: 230, deg: 59 },
    dotPos: { x: 825, y: 715 },
    textPos: { x: 840, y: 706, align: 'start' },
  },
  {
    id: 'lifestyle',
    num: '05',
    title: ['Lifestyle'],
    descLine1: 'Guidance for everyday choices',
    descLine2: 'that build healthier lives.',
    angle: 90, // 6 o'clock
    color: {
      start: '#B6D3F1',
      mid: '#92B9DF',
      end: '#6C99C4',
      text: '#225580',
      line: '#6C99C4',
      accent: '#3C72A0',
    },
    startOffset: { r: 228, deg: 104 },
    dotPos: { x: 550, y: 835 },
    textPos: { x: 550, y: 856, align: 'middle' },
  },
  {
    id: 'monitoring',
    num: '06',
    title: ['Monitoring'],
    descLine1: 'Ongoing tracking for',
    descLine2: 'proactive care.',
    angle: 135, // ~7:30
    color: {
      start: '#DACDE6',
      mid: '#BFA8D1',
      end: '#9D7EB3',
      text: '#5B4171',
      line: '#9D7EB3',
      accent: '#7A5B91',
    },
    startOffset: { r: 230, deg: 149 },
    dotPos: { x: 275, y: 715 },
    textPos: { x: 260, y: 706, align: 'end' },
  },
  {
    id: 'prevention',
    num: '07',
    title: ['Prevention'],
    descLine1: 'Early insights to',
    descLine2: 'reduce future risks.',
    angle: 180, // 9 o'clock
    color: {
      start: '#C6CCD0',
      mid: '#A8AFB7',
      end: '#838D97',
      text: '#3D444C',
      line: '#838D97',
      accent: '#5A636D',
    },
    startOffset: { r: 232, deg: 194 },
    dotPos: { x: 235, y: 465 },
    textPos: { x: 220, y: 456, align: 'end' },
  },
  {
    id: 'longevity',
    num: '08',
    title: ['Longevity'],
    descLine1: 'Helping people live',
    descLine2: 'healthier, fuller lives.',
    angle: 225, // ~10:30
    color: {
      start: '#E8C4CE',
      mid: '#D4A1B2',
      end: '#BA7B90',
      text: '#753A4C',
      line: '#BA7B90',
      accent: '#965568',
    },
    startOffset: { r: 230, deg: 239 },
    dotPos: { x: 305, y: 240 },
    textPos: { x: 290, y: 230, align: 'end' },
  },
];

const stats = [
  {
    number: '98%',
    line1: 'Patient',
    line2: 'Satisfaction',
  },
  {
    number: '500+',
    line1: 'Healthcare',
    line2: 'Professionals',
  },
  {
    number: '10K+',
    line1: 'Expert',
    line2: 'Consultations',
  },
  {
    number: '24/7',
    line1: 'Personalised Care',
    line2: '& Support',
  },
];

const toRad = (deg: number) => (deg * Math.PI) / 180;

function polar(r: number, deg: number, cx = 550, cy = 480) {
  const rad = toRad(deg);
  return {
    x: +(cx + r * Math.cos(rad)).toFixed(2),
    y: +(cy + r * Math.sin(rad)).toFixed(2),
  };
}

// Master organic rounded petal path.
function getMasterPetal(cx = 550, cy = 480) {
  const rIn = 136;

  // Base inner arc from -22.5° to +22.5°
  const pA = polar(rIn, -22.5, cx, cy);
  const pB = polar(rIn, 22.5, cx, cy);

  // Leading curve from pB (+22.5°, 136) outward and clockwise to soft rounded tip (+38°, 234):
  const cp1 = polar(162, 26, cx, cy);
  const cp2 = polar(200, 33, cx, cy);
  const pTip = polar(234, 38, cx, cy);

  // Outer rim curve from pTip (+38°, 234) back along outer perimeter to pCrest (+14°, 224) to pTrail (-18°, 212):
  const cp3 = polar(232, 29, cx, cy);
  const cp4 = polar(228, 20, cx, cy);
  const pCrest = polar(224, 14, cx, cy);

  const cp5 = polar(220, 4, cx, cy);
  const cp6 = polar(216, -8, cx, cy);
  const pTrail = polar(212, -18, cx, cy);

  // Trailing sweep back down to pA on inner circle:
  const cp7 = polar(182, -21, cx, cy);
  const cp8 = polar(156, -22, cx, cy);

  return `M ${pA.x} ${pA.y}
    A ${rIn} ${rIn} 0 0 1 ${pB.x} ${pB.y}
    C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${pTip.x} ${pTip.y}
    C ${cp3.x} ${cp3.y}, ${cp4.x} ${cp4.y}, ${pCrest.x} ${pCrest.y}
    C ${cp5.x} ${cp5.y}, ${cp6.x} ${cp6.y}, ${pTrail.x} ${pTrail.y}
    C ${cp7.x} ${cp7.y}, ${cp8.x} ${cp8.y}, ${pA.x} ${pA.y} Z`;
}

const MASTER_PETAL_D = getMasterPetal(550, 480);

// 8 Clean Vector Line Icons (Strictly centered at 0,0, NO nested <svg> tags)
function PillarIcon({ id, color }: { id: string; color: string }) {
  switch (id) {
    case 'consultation':
      // 01: Doctor head with stethoscope around neck
      return (
        <g stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="0" cy="-4.5" r="3.5" />
          <path d="M -6.5 7.5 C -6.5 4 -4 2 0 2 C 4 2 6.5 4 6.5 7.5" />
          <path d="M -3.5 2 C -3.5 5 3.5 5 3.5 2" />
          <path d="M 0 5 L 0 7" />
          <circle cx="0" cy="8" r="1" fill={color} />
        </g>
      );
    case 'diagnosis':
      // 02: Medical clipboard with checklist & plus
      return (
        <g stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <rect x="-6.5" y="-8.5" width="13" height="17" rx="2" />
          <path d="M -3 -8.5 L -3 -10 C -3 -10.5 -2.5 -11 -2 -11 L 2 -11 C 2.5 -11 3 -10.5 3 -10 L 3 -8.5" strokeWidth="1.2" />
          <path d="M 0 -4 L 0 0 M -2 -2 L 2 -2" strokeWidth="1.5" />
          <line x1="-3.5" y1="2.5" x2="3.5" y2="2.5" />
          <line x1="-3.5" y1="5.5" x2="1.5" y2="5.5" />
        </g>
      );
    case 'treatment':
      // 03: Capsule pill split diagonally
      return (
        <g stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <rect x="-8.5" y="-4.5" width="17" height="9" rx="4.5" transform="rotate(-45)" />
          <line x1="0" y1="-4.5" x2="0" y2="4.5" transform="rotate(-45)" />
        </g>
      );
    case 'medicine':
      // 04: Medicine bottle with plus
      return (
        <g stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M -4 -8 L 4 -8 M -3 -8 L -3 -5.5 L 3 -5.5 L 3 -8 M -5.5 -4.5 L 5.5 -4.5 C 6.5 -4.5 6.5 -3 6.5 -1.5 L 6.5 6 C 6.5 7.5 5.5 8.5 4 8.5 L -4 8.5 C -5.5 8.5 -6.5 7.5 -6.5 6 L -6.5 -1.5 C -6.5 -3 -6.5 -4.5 -5.5 -4.5 Z" />
          <path d="M 0 0 L 0 4 M -2 2 L 2 2" strokeWidth="1.5" />
        </g>
      );
    case 'lifestyle':
      // 05: Lotus flower blossom
      return (
        <g stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 0 -7 C 2.5 -2 3 3 0 5 C -3 3 -2.5 -2 0 -7 Z" />
          <path d="M 0 5 C 4 3 6.5 -1 5 -4 C 3 -2 1 1.5 0 5 Z" />
          <path d="M 0 5 C -4 3 -6.5 -1 -5 -4 C -3 -2 -1 1.5 0 5 Z" />
          <path d="M -5 5.5 C -2 7 2 7 5 5.5" />
        </g>
      );
    case 'monitoring':
      // 06: Analytics chart with line and 3 nodes
      return (
        <g stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M -7 -6 L -7 7 L 7 7" />
          <path d="M -6 3 L -2 0 L 2 2.5 L 6 -4" strokeWidth="1.5" />
          <circle cx="-2" cy="0" r="1.2" fill={color} />
          <circle cx="2" cy="2.5" r="1.2" fill={color} />
          <circle cx="6" cy="-4" r="1.2" fill={color} />
        </g>
      );
    case 'prevention':
      // 07: Shield with checkmark
      return (
        <g stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 0 -8 L 6 -5.5 C 6 0.5 5 5 0 7.5 C -5 5 -6 0.5 -6 -5.5 Z" />
          <path d="M -2.5 -0.5 L -0.5 1.5 L 2.5 -1.5" strokeWidth="1.5" />
        </g>
      );
    case 'longevity':
      // 08: Figure with heart outline
      return (
        <g stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="-2" cy="-3.5" r="3" />
          <path d="M -6.5 6.5 C -6.5 3.5 -4 2 -2 2 C 0 2 2.5 3.5 2.5 6.5" />
          <path d="M 3.5 -1 C 3.5 -2.2 4.5 -3 5.5 -2 C 6.5 -3 7.5 -2.2 7.5 -1 C 7.5 0.5 5.5 2.8 5.5 2.8 C 5.5 2.8 3.5 0.5 3.5 -1 Z" strokeWidth="1.2" />
        </g>
      );
    default:
      return null;
  }
}

export default function Represents() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-40px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [autoIndex, setAutoIndex] = useState<number>(0);

  // Automatically cycle through the petals clockwise in order
  useEffect(() => {
    // Only auto-advance if user isn't hovering or pinning
    if (hoveredIndex !== null || pinnedIndex !== null) return;

    const interval = setInterval(() => {
      setAutoIndex((prev) => (prev + 1) % pillarsData.length);
    }, 2600);

    return () => clearInterval(interval);
  }, [hoveredIndex, pinnedIndex]);

  const activeIndex =
    pinnedIndex !== null
      ? pinnedIndex
      : hoveredIndex !== null
      ? hoveredIndex
      : autoIndex;

  // ViewBox: 1100 x 960 with center at (550, 480)
  const cx = 550;
  const cy = 480;

  // Clockwise flow arcs connecting petal i to petal (i+1)%8
  const arrowArcs = [
    { startDeg: -72, endDeg: -48, fromIdx: 0 },
    { startDeg: -27, endDeg: -3, fromIdx: 1 },
    { startDeg: 18, endDeg: 42, fromIdx: 2 },
    { startDeg: 63, endDeg: 87, fromIdx: 3 },
    { startDeg: 108, endDeg: 132, fromIdx: 4 },
    { startDeg: 153, endDeg: 177, fromIdx: 5 },
    { startDeg: 198, endDeg: 222, fromIdx: 6 },
    { startDeg: 243, endDeg: 267, fromIdx: 7 },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-[5%] overflow-hidden select-none bg-transparent"
    >
      <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12 xl:gap-8 max-w-[1520px] mx-auto">
        {/* Left Column: Heading + 2x2 Stat Cards */}
        <div className="w-full xl:w-[40%] flex flex-col space-y-8">
          {/* Main Section Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-black leading-none">
              Every number represents a life supported,{' '}
              <br className="sm:hidden" />
              <span className="text-[#6F7275] font-bold">
                a journey guided, and a commitment to better healthcare.
              </span>
            </h2>
          </div>

          {/* 2x2 Grid of Stat Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/95 rounded-[20px] p-4 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-black/[0.03] flex flex-col justify-between min-h-[140px] sm:min-h-[200px] hover:shadow-[0_14px_40px_rgba(3,97,50,0.08)] transition-all duration-300 group w-full"
              >
                {/* Big Green Stat Number */}
                <div className="text-3xl sm:text-5xl lg:text-[4.750rem] font-bold text-[#036132] tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left leading-none text-left">
                  {stat.number}
                </div>

                {/* Bottom Label */}
                <div className="text-left md:text-right self-start md:self-end mt-3 sm:mt-4 w-full">
                  <p className="text-base sm:text-xl lg:text-[28px] font-bold text-zinc-900 leading-tight sm:leading-none">
                    {stat.line1} <br /> {stat.line2}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Swirling Pinwheel Care Cycle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full xl:w-[60%] flex flex-col items-center justify-center"
        >
          <div className="relative w-full max-w-[880px] aspect-[1100/960] flex items-center justify-center select-none">
            <svg
              viewBox="0 0 1100 960"
              className="w-full h-full overflow-visible drop-shadow-sm select-none"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <defs>
                {/* Soft Petal Drop Shadows */}
                <filter id="petalShadow" x="-20%" y="-20%" width="150%" height="150%">
                  <feDropShadow dx="1.5" dy="3.5" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.12" />
                </filter>

                <filter id="petalShadowHover" x="-30%" y="-30%" width="170%" height="170%">
                  <feDropShadow dx="2" dy="5.5" stdDeviation="6" floodColor="#000000" floodOpacity="0.22" />
                </filter>

                {/* Center Core Floating Shadow */}
                <filter id="centerShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#000000" floodOpacity="0.07" />
                </filter>

                {/* Circular Badge Soft Shadow */}
                <filter id="badgeShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.08" />
                </filter>

                {/* Dynamic Flow Arrow Markers for Each Pillar Color */}
                {pillarsData.map((item, idx) => (
                  <marker
                    key={`flowArrow-${idx}`}
                    id={`flowArrow-${idx}`}
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="4.5"
                    markerHeight="4.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={item.color.accent} />
                  </marker>
                ))}

                {/* Default Inactive Flow Arrow Marker */}
                <marker
                  id="flowArrowDefault"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="3.5"
                  markerHeight="3.5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#B8ADA2" opacity="0.6" />
                </marker>

                {/* Linear Gradients for Each Petal */}
                {pillarsData.map((item, idx) => (
                  <linearGradient
                    key={`grad-${item.id}`}
                    id={`petal-grad-${idx}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={item.color.start} />
                    <stop offset="55%" stopColor={item.color.mid} />
                    <stop offset="100%" stopColor={item.color.end} />
                  </linearGradient>
                ))}
              </defs>

              {/* 8 Inter-Petal Clockwise Flow Arrows with Circular Active Guidance */}
              <g className="pointer-events-none">
                {arrowArcs.map((arc, i) => {
                  const isActive = activeIndex === arc.fromIdx;
                  const pStart = polar(262, arc.startDeg, cx, cy);
                  const pEnd = polar(262, arc.endDeg, cx, cy);
                  const currentItem = pillarsData[arc.fromIdx];

                  return (
                    <g key={`arrow-${i}`}>
                      {/* Active glowing backdrop pulse */}
                      {isActive && (
                        <path
                          d={`M ${pStart.x} ${pStart.y} A 262 262 0 0 1 ${pEnd.x} ${pEnd.y}`}
                          fill="none"
                          stroke={currentItem.color.accent}
                          strokeWidth="6"
                          strokeLinecap="round"
                          opacity="0.22"
                        />
                      )}

                      {/* Main flow arc */}
                      <path
                        d={`M ${pStart.x} ${pStart.y} A 262 262 0 0 1 ${pEnd.x} ${pEnd.y}`}
                        fill="none"
                        stroke={isActive ? currentItem.color.accent : '#B8ADA2'}
                        strokeWidth={isActive ? 2.4 : 1.2}
                        strokeLinecap="round"
                        strokeDasharray={isActive ? '5 3' : 'none'}
                        opacity={isActive ? 1 : 0.4}
                        markerEnd={isActive ? `url(#flowArrow-${arc.fromIdx})` : 'url(#flowArrowDefault)'}
                        style={{
                          transition: 'stroke 0.35s ease, stroke-width 0.35s ease, opacity 0.35s ease',
                        }}
                      />
                    </g>
                  );
                })}
              </g>

              {/* 8 Swirling Sectors: Petal Blade + White Badge Unified in One Group */}
              <g id="swirling-petals">
                {pillarsData.map((item, idx) => {
                  const isHovered = activeIndex === idx;
                  const rotDeg = item.angle;

                  // Smooth radial displacement when active (petal + badge move outward together)
                  const rad = toRad(item.angle);
                  const pushX = Math.cos(rad) * (isHovered ? 8 : 0);
                  const pushY = Math.sin(rad) * (isHovered ? 8 : 0);

                  const badgePos = polar(180, item.angle, cx, cy);

                  return (
                    <motion.g
                      key={`sector-${item.id}`}
                      animate={{
                        x: pushX,
                        y: pushY,
                        opacity: isHovered ? 1 : 0.72,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 26,
                      }}
                      className="cursor-pointer"
                      onMouseEnter={() => {
                        setHoveredIndex(idx);
                        setAutoIndex(idx);
                      }}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => {
                        setPinnedIndex(pinnedIndex === idx ? null : idx);
                        setAutoIndex(idx);
                      }}
                    >
                      {/* Petal Blade */}
                      <path
                        d={MASTER_PETAL_D}
                        fill={`url(#petal-grad-${idx})`}
                        stroke={isHovered ? item.color.accent : '#ffffff'}
                        strokeWidth={isHovered ? 2 : 0.8}
                        strokeLinejoin="round"
                        transform={`rotate(${rotDeg} ${cx} ${cy})`}
                        style={{
                          filter: isHovered
                            ? 'url(#petalShadowHover) brightness(1.05)'
                            : 'url(#petalShadow)',
                          transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
                        }}
                      />

                      {/* White Circular Badge (Unified with Petal - Moves with it!) */}
                      <g
                        transform={`translate(${badgePos.x}, ${badgePos.y})`}
                      >
                        <circle
                          cx="0"
                          cy="0"
                          r={isHovered ? 24 : 22}
                          fill="#FFFFFF"
                          stroke={isHovered ? item.color.accent : '#EDE7DF'}
                          strokeWidth={isHovered ? 2.2 : 1.2}
                          filter="url(#badgeShadow)"
                          style={{
                            transition: 'r 0.25s ease, stroke 0.25s ease, stroke-width 0.25s ease',
                          }}
                        />
                        <g
                          transform={isHovered ? 'scale(1.08)' : 'scale(1)'}
                          style={{ transition: 'transform 0.25s ease' }}
                        >
                          <PillarIcon id={item.id} color={item.color.accent} />
                        </g>
                      </g>
                    </motion.g>
                  );
                })}
              </g>

              {/* Central Card Hub: "Better Lives Together / DATA-DRIVEN • PEOPLE-FIRST" */}
              <g className="pointer-events-none">
                {/* Main White Disc */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={136}
                  fill="#FFFFFF"
                  stroke={pillarsData[activeIndex].color.accent}
                  strokeWidth="2"
                  filter="url(#centerShadow)"
                  style={{ transition: 'stroke 0.4s ease' }}
                />

                {/* Inner Dashed Ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={120}
                  fill="none"
                  stroke="#E0D8CE"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                  opacity="0.8"
                />

                {/* Orbiting Satellite Indicator on Inner Ring pointing to active sector */}
                {(() => {
                  const orbitPos = polar(120, pillarsData[activeIndex].angle, cx, cy);
                  return (
                    <motion.g
                      animate={{ cx: orbitPos.x, cy: orbitPos.y }}
                      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                    >
                      <circle
                        cx={orbitPos.x}
                        cy={orbitPos.y}
                        r={8}
                        fill="none"
                        stroke={pillarsData[activeIndex].color.accent}
                        strokeWidth={1.2}
                        opacity={0.35}
                        style={{ transition: 'stroke 0.4s ease' }}
                      />
                      <circle
                        cx={orbitPos.x}
                        cy={orbitPos.y}
                        r={4}
                        fill={pillarsData[activeIndex].color.accent}
                        style={{ transition: 'fill 0.4s ease' }}
                      />
                    </motion.g>
                  );
                })()}

                {/* Elegant Serif Headline */}
                <text
                  x={cx}
                  y={cy - 44}
                  textAnchor="middle"
                  fontFamily="var(--font-epilogue), serif"
                  fontSize="36"
                  fontWeight="700"
                  fill="#1E2822"
                  letterSpacing="-0.02em"
                >
                  Better
                </text>
                <text
                  x={cx}
                  y={cy - 4}
                  textAnchor="middle"
                  fontFamily="var(--font-epilogue), serif"
                  fontSize="36"
                  fontWeight="700"
                  fill="#1E2822"
                  letterSpacing="-0.02em"
                >
                  Lives
                </text>
                <text
                  x={cx}
                  y={cy + 36}
                  textAnchor="middle"
                  fontFamily="var(--font-epilogue), serif"
                  fontSize="36"
                  fontWeight="700"
                  fill="#1E2822"
                  letterSpacing="-0.02em"
                >
                  Together
                </text>

                {/* Delicate Divider Line */}
                <line
                  x1={cx - 16}
                  y1={cy + 56}
                  x2={cx + 16}
                  y2={cy + 56}
                  stroke="#68786F"
                  strokeWidth="1.2"
                />

                {/* Tracked Subtitle */}
                <text
                  x={cx}
                  y={cy + 74}
                  textAnchor="middle"
                  fontFamily="var(--font-satoshi), sans-serif"
                  fontSize="8"
                  fontWeight="700"
                  fill="#5A6D63"
                  letterSpacing="0.22em"
                >
                  DATA-DRIVEN
                </text>
                <text
                  x={cx}
                  y={cy + 87}
                  textAnchor="middle"
                  fontFamily="var(--font-satoshi), sans-serif"
                  fontSize="8"
                  fontWeight="700"
                  fill="#5A6D63"
                  letterSpacing="0.22em"
                >
                  PEOPLE-FIRST
                </text>
              </g>

              {/* 8 Curved Callout Pointer Lines and Text Blocks */}
              {pillarsData.map((item, idx) => {
                const isHovered = activeIndex === idx;

                // Start point on petal outer contour
                const pStart = polar(item.startOffset.r, item.startOffset.deg, cx, cy);
                const pEnd = item.dotPos;

                // Smooth S-curve control points
                const dx = pEnd.x - pStart.x;
                const dy = pEnd.y - pStart.y;
                const cp1X = pStart.x + dx * 0.25 - dy * 0.12;
                const cp1Y = pStart.y + dy * 0.25 + dx * 0.12;
                const cp2X = pEnd.x - dx * 0.25 + dy * 0.08;
                const cp2Y = pEnd.y - dy * 0.25 - dx * 0.08;

                const lineD = `M ${pStart.x} ${pStart.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${pEnd.x} ${pEnd.y}`;

                return (
                  <motion.g
                    key={`callout-${item.id}`}
                    animate={{
                      opacity: isHovered ? 1 : 0.65,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredIndex(idx);
                      setAutoIndex(idx);
                    }}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => {
                      setPinnedIndex(pinnedIndex === idx ? null : idx);
                      setAutoIndex(idx);
                    }}
                  >
                    {/* Curved Pointer Line */}
                    <path
                      d={lineD}
                      fill="none"
                      stroke={isHovered ? item.color.accent : item.color.line}
                      strokeWidth={isHovered ? 2.4 : 1.2}
                      strokeLinecap="round"
                      style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
                    />

                    {/* Outer halo on dot when active */}
                    {isHovered && (
                      <circle
                        cx={pEnd.x}
                        cy={pEnd.y}
                        r={8.5}
                        fill="none"
                        stroke={item.color.accent}
                        strokeWidth="1.2"
                        opacity="0.4"
                      />
                    )}

                    {/* Connector Terminal Dot */}
                    <circle
                      cx={pEnd.x}
                      cy={pEnd.y}
                      r={isHovered ? 4.8 : 3.2}
                      fill={item.color.accent}
                      style={{ transition: 'r 0.25s ease, fill 0.25s ease' }}
                    />

                    {/* Number */}
                    <text
                      x={item.textPos.x}
                      y={item.textPos.y}
                      textAnchor={item.textPos.align}
                      dominantBaseline="auto"
                      fontFamily="var(--font-epilogue), serif"
                      fontSize="20"
                      fontWeight="700"
                      fill={isHovered ? item.color.accent : item.color.text}
                      letterSpacing="0.04em"
                      className="select-none"
                      style={{ transition: 'fill 0.3s ease',margin:"10px 10px 6px 10px" }}
                    >
                      {item.num}
                    </text>

                    {/* Multi-line Title (STABLE FONT SIZE: 18.5) */}
                    {item.title.map((line, lIdx) => (
                      <text
                        key={`title-${lIdx}`}
                        x={item.textPos.x}
                        y={item.textPos.y + 19 + lIdx * 20}
                        textAnchor={item.textPos.align}
                        fontFamily="var(--font-epilogue), serif"
                        fontSize="24"
                        fontWeight="700"
                        fill={isHovered ? item.color.text : '#524C44'}
                        letterSpacing="-0.015em"
                        className="select-none"
                        style={{ transition: 'fill 0.3s ease',margin:"10px 0 4px 0px"}}
                      >
                        {line}
                      </text>
                    ))}

                    {/* Subtitle / Description (STABLE POSITION) */}
                    <text
                      x={item.textPos.x}
                      y={item.textPos.y + 19 + item.title.length * 20 + 4}
                      textAnchor={item.textPos.align}
                      fontFamily="var(--font-satoshi), sans-serif"
                      fontSize="20"
                      fontWeight="400"
                      fill={isHovered ? '#26221D' : '#7A746C'}
                      className="select-none"
                      style={{ transition: 'fill 0.3s ease' }}
                    >
                      <tspan x={item.textPos.x} dy="2">
                        {item.descLine1}
                      </tspan>
                      <tspan x={item.textPos.x} dy="20">
                        {item.descLine2}
                      </tspan>
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>

          {/* Mobile Focus Card */}
          <div className="xl:hidden w-full max-w-[480px] mt-4 px-2">
            {activeIndex !== null && (
              <motion.div
                key={`mobile-active-${activeIndex}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/95 rounded-2xl p-4 shadow-sm border border-zinc-200/80 text-center"
              >
                <div className="inline-flex items-center gap-2 mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: pillarsData[activeIndex].color.accent }}
                  />
                  <span className="text-xs font-bold text-zinc-400">
                    Pillar {pillarsData[activeIndex].num}
                  </span>
                </div>
                <h4
                  className="text-xl font-bold leading-tight"
                  style={{ color: pillarsData[activeIndex].color.text }}
                >
                  {pillarsData[activeIndex].title.join(' ')}
                </h4>
                <p className="text-sm text-zinc-600 mt-1 font-normal">
                  {pillarsData[activeIndex].descLine1} {pillarsData[activeIndex].descLine2}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}