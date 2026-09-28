'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SliceData {
  id: string;
  label: string;
  shortLabel: string;
  value: number;
  percentage: string;
  className: string;
}

const slicesData: SliceData[] = [
  {
    id: 'diagnosis',
    label: 'Diagnosis & Assessment',
    shortLabel: 'Diagnosis & Assessment',
    value: 12.5,
    percentage: '12.5%',
    className: 'diagnosis',
  },
  {
    id: 'treatment',
    label: 'Treatment',
    shortLabel: 'Treatment',
    value: 12.5,
    percentage: '12.5%',
    className: 'treatment',
  },
  {
    id: 'medicine',
    label: 'Medicine',
    shortLabel: 'Medicine',
    value: 12.5,
    percentage: '12.5%',
    className: 'medicine',
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle',
    shortLabel: 'Lifestyle',
    value: 12.5,
    percentage: '12.5%',
    className: 'lifeStyle',
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    shortLabel: 'Monitoring',
    value: 12.5,
    percentage: '12.5%',
    className: 'monitoring',
  },
  {
    id: 'prevention',
    label: 'Prevention',
    shortLabel: 'Prevention',
    value: 12.5,
    percentage: '12.5%',
    className: 'prevention',
  },
  {
    id: 'longevity',
    label: 'Longevity',
    shortLabel: 'Longevity',
    value: 12.5,
    percentage: '12.5%',
    className: 'longevity',
  },
  {
    id: 'consultation',
    label: 'Consultation',
    shortLabel: 'Consultation',
    value: 12.5,
    percentage: '12.5%',
    className: 'consultation',
  },
];

// Gradient stops and accent colors corresponding to globals.css classes (original exact colors with gradient depth)
const sliceGradients: Record<string, { start: string; color: string; end: string; accent: string }> = {
  diagnosis: {
    start: 'hsla(202, 85%, 88%, 1)',
    color: 'hsla(202, 81%, 84%, 1)',
    end: 'hsla(202, 81%, 74%, 1)',
    accent: '#7bbde8',
  },
  treatment: {
    start: 'hsla(296, 35%, 88%, 1)',
    color: 'hsla(296, 30%, 82%, 1)',
    end: 'hsla(296, 30%, 75%, 1)',
    accent: '#C084FC',
  },
  medicine: {
    start: 'hsla(20, 85%, 72%, 1)',
    color: 'hsla(20, 82%, 66%, 1)',
    end: 'hsla(20, 82%, 58%, 1)',
    accent: '#EF8F60',
  },
  lifestyle: {
    start: 'hsla(52, 92%, 80%, 1)',
    color: 'hsla(52, 90%, 74%, 1)',
    end: 'hsla(48, 88%, 66%, 1)',
    accent: '#F59E0B',
  },
  monitoring: {
    start: 'hsla(150, 75%, 32%, 1)',
    color: 'hsla(150, 94%, 20%, 1)',
    end: 'hsla(150, 94%, 16%, 1)',
    accent: '#036132',
  },
  prevention: {
    start: 'hsla(0, 0%, 28%, 1)',
    color: 'hsla(0, 0%, 18%, 1)',
    end: 'hsla(0, 0%, 12%, 1)',
    accent: '#212121',
  },
  longevity: {
    start: '#f0e2f1',
    color: '#ddc4df',
    end: '#caa7cc',
    accent: '#A855F7',
  },
  consultation: {
    start: '#047d42',
    color: '#036132',
    end: '#024a26',
    accent: '#036132',
  },
};

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

// Helper to convert degrees to radians
const toRad = (deg: number) => (deg * Math.PI) / 180;

// Helper to calculate SVG arc path for a donut slice with 3px rounded corners and offset
function getArcPath(
  cx: number,
  cy: number,
  rIn: number,
  rOut: number,
  startAngleDeg: number,
  endAngleDeg: number,
  offset: number,
  midAngleDeg: number,
  rc = 3
) {
  const ox = Math.cos(toRad(midAngleDeg)) * offset;
  const oy = Math.sin(toRad(midAngleDeg)) * offset;

  const cX = cx + ox;
  const cY = cy + oy;

  const a1 = toRad(startAngleDeg);
  const a2 = toRad(endAngleDeg);

  // Angular offset for the 3px corner radius along outer and inner arcs
  const span = a2 - a1;
  const safeDOut = Math.min(rc / rOut, span / 2);
  const safeDIn = Math.min(rc / rIn, span / 2);

  // Outer Arc points (clockwise from safeDOut after a1 to safeDOut before a2)
  const a1Out = a1 + safeDOut;
  const a2Out = a2 - safeDOut;
  const xOut1 = cX + rOut * Math.cos(a1Out);
  const yOut1 = cY + rOut * Math.sin(a1Out);
  const xOut2 = cX + rOut * Math.cos(a2Out);
  const yOut2 = cY + rOut * Math.sin(a2Out);

  // Radial 2 edge points (at a2, between rOut - rc and rIn + rc)
  const xRad2Out = cX + (rOut - rc) * Math.cos(a2);
  const yRad2Out = cY + (rOut - rc) * Math.sin(a2);
  const xRad2In = cX + (rIn + rc) * Math.cos(a2);
  const yRad2In = cY + (rIn + rc) * Math.sin(a2);

  // Inner Arc points (counter-clockwise from safeDIn before a2 to safeDIn after a1)
  const a2In = a2 - safeDIn;
  const a1In = a1 + safeDIn;
  const xIn2 = cX + rIn * Math.cos(a2In);
  const yIn2 = cY + rIn * Math.sin(a2In);
  const xIn1 = cX + rIn * Math.cos(a1In);
  const yIn1 = cY + rIn * Math.sin(a1In);

  // Radial 1 edge points (at a1, between rIn + rc and rOut - rc)
  const xRad1In = cX + (rIn + rc) * Math.cos(a1);
  const yRad1In = cY + (rIn + rc) * Math.sin(a1);
  const xRad1Out = cX + (rOut - rc) * Math.cos(a1);
  const yRad1Out = cY + (rOut - rc) * Math.sin(a1);

  const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;

  return [
    `M ${xOut1} ${yOut1}`,
    `A ${rOut} ${rOut} 0 ${largeArc} 1 ${xOut2} ${yOut2}`,
    `A ${rc} ${rc} 0 0 1 ${xRad2Out} ${yRad2Out}`,
    `L ${xRad2In} ${yRad2In}`,
    `A ${rc} ${rc} 0 0 1 ${xIn2} ${yIn2}`,
    `A ${rIn} ${rIn} 0 ${largeArc} 0 ${xIn1} ${yIn1}`,
    `A ${rc} ${rc} 0 0 1 ${xRad1In} ${yRad1In}`,
    `L ${xRad1Out} ${yRad1Out}`,
    `A ${rc} ${rc} 0 0 1 ${xOut1} ${yOut1}`,
    'Z',
  ].join(' ');
}

export default function Represents() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const viewBoxWidth = 640;
  const viewBoxHeight = 520;
  const cx = 320;
  const cy = 260;
  const rIn = 100;
  const rOut = 170;

  // Compute angles for each slice with spacing gaps
  const gapDeg = 3.5;
  const totalValue = slicesData.reduce((acc, s) => acc + s.value, 0);
  const availableAngle = 360 - slicesData.length * gapDeg;

  let currentAngle = -90;

  const slicesGeometry = slicesData.map((slice) => {
    const angleSpan = (slice.value / totalValue) * availableAngle;
    const startAngle = currentAngle + gapDeg / 2;
    const endAngle = startAngle + angleSpan;
    const midAngle = (startAngle + endAngle) / 2;
    currentAngle += angleSpan + gapDeg;

    return {
      ...slice,
      startAngle,
      endAngle,
      midAngle,
    };
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-[5%] overflow-hidden select-none bg-transparent"
    >
      {/* Background Subtle Hexagon Grid Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" width="100%" height="100%">
          <defs>
            <pattern id="hex-grid" width="40" height="69.282" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 20 11.547 L 0 0 L 0 23.094 L 20 34.641 L 40 23.094 Z M 0 34.641 L 20 46.188 L 0 57.735 L 0 80.829 L 20 92.376 L 40 80.829 L 40 57.735 L 20 46.188 Z"
                fill="none"
                stroke="#000000"
                strokeWidth="0.5"
                strokeOpacity="0.04"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Column: Heading + 2x2 Stat Cards */}
        <div className="w-full lg:w-1/2 flex flex-col space-y-8">
          {/* Main Section Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-black leading-none">
              Every number represents a life supported,{' '}<br className='sm:hidden'/>
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
                className="bg-white/95 rounded-[20px] p-4 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[140px] sm:min-h-[200px] hover:shadow-[0_14px_40px_rgba(3,97,50,0.08)] transition-all duration-300 group w-full"
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

        {/* Right Column: Custom Interactive Gradient Donut Chart with Callout Lines */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[800px] aspect-[660/520] flex items-center justify-center">
            <svg
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              className="w-full h-full drop-shadow-sm overflow-visible"
            >
              <defs>
                {/* Unified Master Glass Gradient for each slice: 20% white frost on inner curve, 80% original color */}
                {slicesGeometry.map((slice) => {
                  const grad = sliceGradients[slice.id];
                  if (!grad) return null;
                  const rad = toRad(slice.midAngle);
                  const x1 = Math.round(50 - 45 * Math.cos(rad));
                  const y1 = Math.round(50 - 45 * Math.sin(rad));
                  const x2 = Math.round(50 + 45 * Math.cos(rad));
                  const y2 = Math.round(50 + 45 * Math.sin(rad));

                  return (
                    <linearGradient
                      key={slice.id}
                      id={`glass-slice-${slice.id}`}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                    >
                      {/* 20% Milky White Frosted Sheen on Inner Curve */}
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                      <stop offset="8%" stopColor="#ffffff" stopOpacity="0.70" />
                      <stop offset="18%" stopColor={grad.start} stopOpacity="0.92" />
                      {/* 80% Rich Original Color extending to outer rim */}
                      <stop offset="55%" stopColor={grad.color} stopOpacity="1" />
                      <stop offset="100%" stopColor={grad.end} stopOpacity="1" />
                    </linearGradient>
                  );
                })}

                {/* Unified Glass Filter: 3D Elevation Drop Shadow + Border Glow + Inset White Shadow */}
                <filter id="glass-effect" x="-30%" y="-30%" width="160%" height="160%">
                  {/* 3D Elevation Drop Shadows */}
                  <feDropShadow in="SourceAlpha" dx="0" dy="7" stdDeviation="10" floodColor="#000000" floodOpacity="0.12" result="dropShadow" />
                  <feDropShadow in="SourceAlpha" dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.05" result="contactShadow" />

                  {/* Ambient White Border Glow */}
                  <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="strokeGlow" />
                  <feFlood floodColor="#ffffff" floodOpacity="0.45" result="glowColor" />
                  <feComposite in="glowColor" in2="strokeGlow" operator="in" result="whiteBorderGlow" />

                  {/* Figma Inset White Shadow (Inner Shadow: X:0, Y:2, Blur:4, Color:#FFFFFF) */}
                  <feOffset in="SourceAlpha" dx="0" dy="2.5" result="offsetAlpha" />
                  <feGaussianBlur in="offsetAlpha" stdDeviation="2.5" result="blurredAlpha" />
                  <feComposite in="SourceAlpha" in2="blurredAlpha" operator="out" result="innerHighlight" />
                  <feFlood floodColor="#ffffff" floodOpacity="0.85" result="innerWhite" />
                  <feComposite in="innerWhite" in2="innerHighlight" operator="in" result="innerWhiteShadow" />

                  {/* Composite all into ONE single element */}
                  <feMerge>
                    <feMergeNode in="dropShadow" />
                    <feMergeNode in="contactShadow" />
                    <feMergeNode in="whiteBorderGlow" />
                    <feMergeNode in="SourceGraphic" />
                    <feMergeNode in="innerWhiteShadow" />
                  </feMerge>
                </filter>

                <filter id="glass-effect-hover" x="-40%" y="-40%" width="180%" height="180%">
                  {/* Elevated Hover Drop Shadows */}
                  <feDropShadow in="SourceAlpha" dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.20" result="dropShadow" />
                  <feDropShadow in="SourceAlpha" dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.08" result="contactShadow" />

                  {/* Brighter White Border Glow on Hover */}
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="strokeGlow" />
                  <feFlood floodColor="#ffffff" floodOpacity="0.65" result="glowColor" />
                  <feComposite in="glowColor" in2="strokeGlow" operator="in" result="whiteBorderGlow" />

                  {/* Figma Inset White Shadow for Hover */}
                  <feOffset in="SourceAlpha" dx="0" dy="3" result="offsetAlpha" />
                  <feGaussianBlur in="offsetAlpha" stdDeviation="3" result="blurredAlpha" />
                  <feComposite in="SourceAlpha" in2="blurredAlpha" operator="out" result="innerHighlight" />
                  <feFlood floodColor="#ffffff" floodOpacity="0.95" result="innerWhite" />
                  <feComposite in="innerWhite" in2="innerHighlight" operator="in" result="innerWhiteShadow" />

                  {/* Composite all into ONE single element */}
                  <feMerge>
                    <feMergeNode in="dropShadow" />
                    <feMergeNode in="contactShadow" />
                    <feMergeNode in="whiteBorderGlow" />
                    <feMergeNode in="SourceGraphic" />
                    <feMergeNode in="innerWhiteShadow" />
                  </feMerge>
                </filter>
              </defs>

              {/* Donut Slices */}
              {slicesGeometry.map((slice, idx) => {
                const isHovered = hoveredIndex === idx;
                const isAnyHovered = hoveredIndex !== null;
                const offset = isHovered ? 24 : 10;
                const pathD = getArcPath(
                  cx,
                  cy,
                  rIn,
                  rOut,
                  slice.startAngle,
                  slice.endAngle,
                  offset,
                  slice.midAngle
                );

                return (
                  <motion.g
                    key={slice.id}
                    initial={{ opacity: 0, scale: 0.55 }}
                    animate={
                      isInView
                        ? {
                            opacity: isAnyHovered && !isHovered ? 0.65 : 1,
                            scale: 1,
                          }
                        : { opacity: 0, scale: 0.55 }
                    }
                    transition={{
                      duration: 0.55,
                      delay: idx * 0.14,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="cursor-pointer origin-center transition-opacity duration-300"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* ONE SINGLE MERGED GLASS SLICE: Fill + Border + Inner Shadow + Drop Shadow */}
                    <path
                      d={pathD}
                      fill={`url(#glass-slice-${slice.id})`}
                      stroke="rgba(255, 255, 255, 0.88)"
                      strokeWidth={isHovered ? 2 : 1.4}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      filter={isHovered ? 'url(#glass-effect-hover)' : 'url(#glass-effect)'}
                      className="transition-all duration-300"
                    />
                  </motion.g>
                );
              })}

              {/* Center Stat / Hover Content */}
              {/* <g className="pointer-events-none">
                <circle
                  cx={cx}
                  cy={cy}
                  r={rIn - 6}
                  fill="#ffffff"
                  className="shadow-inner"
                />
                <text
                  x={cx}
                  y={cy - 12}
                  textAnchor="middle"
                  className="fill-zinc-400 font-extrabold text-[11px] tracking-widest uppercase"
                >
                  {hoveredIndex !== null ? slicesGeometry[hoveredIndex].percentage : '100%'}
                </text>
                <text
                  x={cx}
                  y={cy + 14}
                  textAnchor="middle"
                  className="fill-zinc-900 font-black text-sm sm:text-base"
                >
                  {hoveredIndex !== null ? slicesGeometry[hoveredIndex].shortLabel : 'Care Pillars'}
                </text>
              </g> */}

              {/* Callout Lines & Text Labels (Displayed by default like reference image) */}
              {slicesGeometry.map((slice, idx) => {
                const isHovered = hoveredIndex === idx;
                const isAnyHovered = hoveredIndex !== null;
                const sliceOffset = isHovered ? 24 : 10;
                const accentColor = sliceGradients[slice.id]?.accent || '#9CA3AF';

                const rad = toRad(slice.midAngle);
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);

                // Start point on slice outer arc
                const rStart = rOut + sliceOffset;
                const xStart = cx + rStart * cos;
                const yStart = cy + rStart * sin;

                // Elbow break point
                const rElbow = rStart + (isHovered ? 34 : 26);
                const xElbow = cx + rElbow * cos;
                const yElbow = cy + rElbow * sin;

                // Horizontal line direction
                const isRight = cos >= 0;
                const lineLength = 32;
                const xEnd = isRight ? xElbow + lineLength : xElbow - lineLength;
                const yEnd = yElbow;

                // Text position
                const xText = isRight ? xEnd + 8 : xEnd - 8;
                const yText = yEnd;

                const lineD = `M ${xStart} ${yStart} L ${xElbow} ${yElbow} L ${xEnd} ${yEnd}`;

                return (
                  <motion.g
                    key={`line-${slice.id}`}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={
                      isInView
                        ? {
                            opacity: isAnyHovered && !isHovered ? 0.45 : 1,
                            scale: 1,
                          }
                        : { opacity: 0, scale: 0.85 }
                    }
                    transition={{
                      duration: 0.5,
                      delay: 0.12 + idx * 0.14,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="cursor-pointer origin-center"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Callout Line */}
                    <path
                      d={lineD}
                      fill="none"
                      stroke={isHovered ? accentColor : '#9CA3AF'}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      className="transition-all duration-300"
                    />

                    {/* Small Connector Dot at Slice Edge */}
                    <circle
                      cx={xStart}
                      cy={yStart}
                      r={isHovered ? 4.5 : 3}
                      fill={accentColor}
                      className="transition-all duration-300"
                    />

                    {/* Small Dot at End of Horizontal Line */}
                    <circle
                      cx={xEnd}
                      cy={yEnd}
                      r={isHovered ? 3.5 : 2}
                      fill={accentColor}
                      className="transition-all duration-300"
                    />

                    {/* Text Label */}
                    <text
                      x={xText}
                      y={yText}
                      textAnchor={isRight ? 'start' : 'end'}
                      dominantBaseline="central"
                      className={`transition-all duration-300 select-none ${
                        isHovered
                          ? 'font-bold fill-zinc-900 text-sm'
                          : 'font-semibold fill-zinc-700 text-sm sm:text-[14px]'
                      }`}
                    >
                      {slice.shortLabel}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}