'use client';

import React from 'react';

/**
 * Ultra-Optimized Pastel Gradient Background
 * Ported faithfully from q-form-2-view.tsx (L12-L114).
 *
 * Performance & Stability:
 * 1. Fixed to viewport (`fixed inset-0`) so content height changes between Step 1 and Step 2
 *    never trigger resizes, scale shifts, or background jumps.
 * 2. 100% pure CSS GPU compositor animations via translate3d keyframes (0% JS thread load).
 * 3. Screen-adapted blur (70-90px) to eliminate GPU fill-rate spikes and tab crashes.
 * 4. Hardware containment: contain: strict, isolation: isolate, backface-visibility: hidden.
 */
export default function OptimizedPastelGradient({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none select-none overflow-hidden z-0 bg-[#FCFAF7]/30 ${className}`}
      style={{
        contain: 'strict',
        isolation: 'isolate',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
      }}
    >
      <style>{`
        @keyframes pastelBaseSweep {
          0% { transform: translate3d(0vw, 0, 0); }
          50% { transform: translate3d(60vw, 0, 0); }
          100% { transform: translate3d(0vw, 0, 0); }
        }
        @keyframes pastelWaveLeft {
          0% { transform: translate3d(0vw, 0vh, 0) scale(1); }
          33% { transform: translate3d(25vw, 6vh, 0) scale(1.08); }
          66% { transform: translate3d(55vw, 12vh, 0) scale(0.96); }
          100% { transform: translate3d(70vw, 0vh, 0) scale(1); }
        }
        @keyframes pastelWaveRight {
          0% { transform: translate3d(0vw, 0vh, 0) scale(1); }
          33% { transform: translate3d(-25vw, -5vh, 0) scale(0.96); }
          66% { transform: translate3d(-55vw, -10vh, 0) scale(1.08); }
          100% { transform: translate3d(-70vw, 0vh, 0) scale(1); }
        }
        @keyframes pastelWaveLowerLeft {
          0% { transform: translate3d(0vw, 0vh, 0); }
          50% { transform: translate3d(65vw, -7vh, 0); }
          100% { transform: translate3d(0vw, 0vh, 0); }
        }
        @keyframes pastelWaveUpperRight {
          0% { transform: translate3d(0vw, 0vh, 0); }
          50% { transform: translate3d(-65vw, 9vh, 0); }
          100% { transform: translate3d(0vw, 0vh, 0); }
        }
      `}</style>

      {/* 1. Full-width sweeping pastel base gradient */}
      <div
        className="absolute top-0 -left-[60vw] w-[220vw] h-full opacity-60 blur-[30px] will-change-transform"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(250,237,150,0.65) 0%, rgba(255,218,195,0.6) 25%, rgba(235,208,245,0.55) 50%, rgba(185,228,252,0.65) 75%, rgba(250,237,150,0.65) 100%)',
          backgroundSize: '100% 100%',
          animation: 'pastelBaseSweep 13s ease-in-out infinite alternate',
        }}
      />

      {/* 2. LEFT COLOR WAVE (Sunny Yellow / Peach) -> Moves to the RIGHT */}
      <div
        className="absolute top-1/6 -left-20 sm:-left-36 w-[340px] h-[340px] sm:w-[680px] sm:h-[680px] lg:w-[880px] lg:h-[880px] rounded-full blur-[45px] sm:blur-[70px] lg:blur-[90px] will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(250,237,150,0.7) 0%, rgba(255,218,195,0.55) 45%, rgba(255,218,195,0) 75%)',
          animation: 'pastelWaveLeft 13s ease-in-out infinite alternate',
        }}
      />

      {/* 3. RIGHT COLOR WAVE (Sky Blue / Lavender) -> Moves to the LEFT */}
      <div
        className="absolute top-1/4 -right-20 sm:-right-36 w-[360px] h-[360px] sm:w-[700px] sm:h-[700px] lg:w-[920px] lg:h-[920px] rounded-full blur-[45px] sm:blur-[70px] lg:blur-[90px] will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(185,228,252,0.7) 0%, rgba(235,208,245,0.55) 45%, rgba(235,208,245,0) 75%)',
          animation: 'pastelWaveRight 13s ease-in-out infinite alternate',
        }}
      />

      {/* 4. LOWER LEFT WAVE (Warm Coral Peach) -> Drifts to the right */}
      <div
        className="absolute top-2/3 -left-16 sm:-left-32 w-[320px] h-[320px] sm:w-[620px] sm:h-[620px] lg:w-[780px] lg:h-[780px] rounded-full blur-[45px] sm:blur-[70px] lg:blur-[90px] will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(255,208,185,0.6) 0%, rgba(250,237,150,0.45) 45%, rgba(250,237,150,0) 75%)',
          animation: 'pastelWaveLowerLeft 15s ease-in-out -0.8s infinite alternate',
        }}
      />

      {/* 5. UPPER RIGHT WAVE (Fresh Aqua Mint / Lilac) -> Drifts to the left */}
      <div
        className="absolute -top-20 sm:-top-32 -right-16 sm:-right-32 w-[340px] h-[340px] sm:w-[640px] sm:h-[640px] lg:w-[820px] lg:h-[820px] rounded-full blur-[45px] sm:blur-[70px] lg:blur-[90px] will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(195,242,246,0.65) 0%, rgba(235,208,245,0.45) 45%, rgba(235,208,245,0) 75%)',
          animation: 'pastelWaveUpperRight 14s ease-in-out -1.2s infinite alternate',
        }}
      />
    </div>
  );
}

