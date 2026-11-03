'use client';

import React from 'react';

const GRADIENT =
  'linear-gradient(90deg, #EF8F60 0%, #F6D7C6 14%, #AEDEE4 32%, #F9E0AE 50%, #B5ECF2 68%, #EF8F60 84%, #F6D7C6 100%)';
const SPEEDS = [3.2, 4.4, 3.6, 4.8, 3.4, 4.0, 4.6, 3.8, 4.2];

interface Props {
  children: React.ReactNode;
  className?: string;
  isSelected?: boolean;
  index?: number;
}

/**
 * The gradient only moves for the selected or hovered pill (see globals.css).
 * Idle pills keep the layers but the animation is paused and has no will-change,
 * so there is no permanent GPU cost for 9 pills.
 */
function GradientOptionWrapper({ children, className = '', isSelected = false, index = 0 }: Props) {
  const duration = SPEEDS[index % SPEEDS.length];
  const delay = `-${((index * 0.7) % duration).toFixed(2)}s`;
  const flowClass = `gradient-flow ${index % 2 === 1 ? 'gradient-flow-reverse' : ''}`;
  const layerStyle = {
    backgroundImage: GRADIENT,
    '--dur': `${duration}s`,
    '--delay': delay,
  } as React.CSSProperties;

  return (
    <div className={`relative group w-full ${className}`}>
      <div
        className={`relative p-[2px] rounded-[28px] overflow-hidden transition-shadow duration-300 ${
          isSelected
            ? 'shadow-[0_4px_22px_rgba(239,143,96,0.35),0_0_12px_rgba(174,222,243,0.25)]'
            : 'shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.02)] group-hover:shadow-[0_4px_20px_rgba(239,143,96,0.22)]'
        }`}
      >
        {/* Moving border gradient */}
        <div
          aria-hidden="true"
          data-active={isSelected}
          className={`absolute -inset-x-full inset-y-0 w-[300%] h-full pointer-events-none ${flowClass}`}
          style={layerStyle}
        />

        {/* Static white border, fades out on hover/selected so the gradient shows */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 rounded-[28px] bg-white/80 border border-white/90 transition-opacity duration-300 pointer-events-none ${
            isSelected ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
          }`}
        />

        <div
          className={`relative z-10 w-full h-full rounded-[26px] overflow-hidden transition-colors duration-300 ${
            isSelected
              ? 'bg-[#FCFAF7]/95 text-zinc-900 font-bold'
              : 'bg-white/90 group-hover:bg-[#FCFAF7]/95 text-zinc-700'
          }`}
        >
          {/* Inner glow: only mounted for the selected pill */}
          {isSelected && (
            <div
              aria-hidden="true"
              data-active="true"
              className={`absolute -inset-x-full inset-y-0 w-[300%] h-full opacity-25 pointer-events-none ${flowClass}`}
              style={layerStyle}
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent pointer-events-none rounded-t-[26px]"
          />
          <div className="relative z-10 w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(GradientOptionWrapper);
