'use client';

import React from 'react';

export interface TalkCareButtonProps {
  programName: string;
  imageSrc: string;
  text?: string;
  className?: string;
  onClick?: () => void;
}

const GRADIENT_STRING =
  'linear-gradient(90deg, #EF8F60 0%, #F6D7C6 14%, #AEDEE4 32%, #F9E0AE 50%, #B5ECF2 68%, #EF8F60 84%, #F6D7C6 100%)';

export default function TalkCareButton({
  programName,
  imageSrc,
  text = 'TALK TO CARE TEAM',
  className = '',
  onClick,
}: TalkCareButtonProps) {
  return (
    <div className={`pointer-events-auto relative inline-flex items-center justify-center ${className}`}>
      {/* Outer Ambient Glowing Highlight Ring for Timeline & Hover */}
      <div
        className="talk-button-ring absolute -inset-1 sm:-inset-1.5 rounded-full pointer-events-none opacity-0 blur-md transition-opacity duration-300"
        style={{
          backgroundImage: GRADIENT_STRING,
          backgroundSize: '200% 100%',
          animation: 'exploreGradientFlow 3.5s ease-in-out infinite',
        }}
      />

      {/* Gradient Stroke Outer Frame (2px padding = 2px flowing gradient stroke from exploreform) */}
      <div
        className="talk-button-wrapper group/btn relative p-[2px] rounded-full transition-all duration-300 shadow-[0_12px_32px_rgba(0,0,0,0.06),_0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_24px_rgba(239,143,96,0.35),0_0_16px_rgba(174,222,228,0.28)]"
        style={{
          backgroundImage: GRADIENT_STRING,
          backgroundSize: '200% 100%',
          animation: 'exploreGradientFlow 3.5s ease-in-out infinite',
          WebkitMaskImage: '-webkit-radial-gradient(white, black)',
          isolation: 'isolate',
        }}
      >
        <button
          type="button"
          onClick={onClick}
          className="talk-button relative z-10 inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/95 backdrop-blur-md cursor-pointer select-none transition-all active:scale-[0.98] overflow-hidden"
        >
          {/* Subtle moving pastel gradient tint inside pill on hover */}
          <div
            className="absolute inset-0 transition-opacity duration-300 pointer-events-none opacity-0 group-hover/btn:opacity-15 rounded-full"
            style={{
              backgroundImage: GRADIENT_STRING,
              backgroundSize: '200% 100%',
              animation: 'exploreGradientFlow 3.5s ease-in-out infinite',
            }}
          />

          {/* Top highlight reflection */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent pointer-events-none rounded-t-full" />

          {/* Program Orb / Icon */}
          <div className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(36,168,184,0.35)] border border-white/70">
            <img src={imageSrc} alt={programName} className="w-full h-full object-cover" />
          </div>

          {/* Action Text */}
          <span className="relative z-10 font-semibold text-base tracking-tight text-[#1E2822] uppercase whitespace-nowrap">
            {text}
          </span>
        </button>
      </div>
    </div>
  );
}
