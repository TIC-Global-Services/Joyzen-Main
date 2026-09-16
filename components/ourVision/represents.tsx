'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SliceData {
  id: string;
  label: string;
  shortLabel: string;
  value: number;
  percentage: string;
  startColor: string;
  endColor: string;
}

const slicesData: SliceData[] = [
  {
    id: 'salaries',
    label: 'Salaries & Care Team',
    shortLabel: 'Salaries',
    value: 48,
    percentage: '48%',
    startColor: '#EF4444',
    endColor: '#991B1B',
  },
  {
    id: 'marketing',
    label: 'Marketing & Outreach',
    shortLabel: 'Marketing',
    value: 18,
    percentage: '18%',
    startColor: '#0D9488',
    endColor: '#115E59',
  },
  {
    id: 'operations',
    label: 'Operations & Facilities',
    shortLabel: 'Operations',
    value: 14,
    percentage: '14%',
    startColor: '#EAB308',
    endColor: '#A16207',
  },
  {
    id: 'technology',
    label: 'Technology & AI',
    shortLabel: 'Technology',
    value: 10,
    percentage: '10%',
    startColor: '#EA580C',
    endColor: '#9A3412',
  },
  {
    id: 'travel',
    label: 'Travel & Field Care',
    shortLabel: 'Travel',
    value: 6,
    percentage: '6%',
    startColor: '#84CC16',
    endColor: '#4D7C0F',
  },
  {
    id: 'other',
    label: 'Other Support',
    shortLabel: 'Other',
    value: 4,
    percentage: '4%',
    startColor: '#F43F5E',
    endColor: '#9F1239',
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

// Helper to convert degrees to radians
const toRad = (deg: number) => (deg * Math.PI) / 180;

// Helper to calculate SVG arc path for a donut slice with offset
function getArcPath(
  cx: number,
  cy: number,
  rIn: number,
  rOut: number,
  startAngleDeg: number,
  endAngleDeg: number,
  offset: number,
  midAngleDeg: number
) {
  const ox = Math.cos(toRad(midAngleDeg)) * offset;
  const oy = Math.sin(toRad(midAngleDeg)) * offset;

  const cX = cx + ox;
  const cY = cy + oy;

  const a1 = toRad(startAngleDeg);
  const a2 = toRad(endAngleDeg);

  const x1 = cX + rOut * Math.cos(a1);
  const y1 = cY + rOut * Math.sin(a1);

  const x2 = cX + rOut * Math.cos(a2);
  const y2 = cY + rOut * Math.sin(a2);

  const x3 = cX + rIn * Math.cos(a2);
  const y3 = cY + rIn * Math.sin(a2);

  const x4 = cX + rIn * Math.cos(a1);
  const y4 = cY + rIn * Math.sin(a1);

  const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;

  return `M ${x1} ${y1} A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 ${largeArc} 0 ${x4} ${y4} Z`;
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
                {/* Custom Gradient Filters & Linear Gradients for Slices */}
                {slicesGeometry.map((slice) => {
                  const rad = toRad(slice.midAngle);
                  const x1 = Math.round(50 - 45 * Math.cos(rad));
                  const y1 = Math.round(50 - 45 * Math.sin(rad));
                  const x2 = Math.round(50 + 45 * Math.cos(rad));
                  const y2 = Math.round(50 + 45 * Math.sin(rad));

                  return (
                    <linearGradient
                      key={slice.id}
                      id={`donut-grad-${slice.id}`}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                    >
                      <stop offset="0%" stopColor={slice.startColor} />
                      <stop offset="100%" stopColor={slice.endColor} />
                    </linearGradient>
                  );
                })}

                <filter id="slice-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.25" />
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
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={
                      isInView
                        ? {
                            opacity: isAnyHovered && !isHovered ? 0.65 : 1,
                            scale: 1,
                          }
                        : { opacity: 0, scale: 0.7 }
                    }
                    transition={{
                      duration: 0.6,
                      delay: idx * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="cursor-pointer origin-center transition-opacity duration-300"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <path
                      d={pathD}
                      fill={`url(#donut-grad-${slice.id})`}
                      filter={isHovered ? 'url(#slice-glow)' : undefined}
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={
                      isInView
                        ? {
                            opacity: isAnyHovered && !isHovered ? 0.45 : 1,
                            y: 0,
                          }
                        : { opacity: 0, y: 10 }
                    }
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + idx * 0.08,
                    }}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Callout Line */}
                    <path
                      d={lineD}
                      fill="none"
                      stroke={isHovered ? slice.startColor : '#9CA3AF'}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      className="transition-all duration-300"
                    />

                    {/* Small Connector Dot at Slice Edge */}
                    <circle
                      cx={xStart}
                      cy={yStart}
                      r={isHovered ? 4.5 : 3}
                      fill={slice.startColor}
                      className="transition-all duration-300"
                    />

                    {/* Small Dot at End of Horizontal Line */}
                    <circle
                      cx={xEnd}
                      cy={yEnd}
                      r={isHovered ? 3.5 : 2}
                      fill={slice.startColor}
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