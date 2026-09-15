"use client";

import React from "react";

export type MarqueeDirection = "left" | "right";

export interface MarqueeProps {
  /** Content to scroll */
  children: React.ReactNode;
  /** Scroll direction — "left" (default) or "right" */
  direction?: MarqueeDirection;
  /** Duration (seconds) for one full cycle — lower = faster */
  speed?: number;
  /** Pause animation on hover */
  pauseOnHover?: boolean;
  /** Gap between repeated sets (px) */
  gap?: number;
  /** How many times the children set is duplicated (min 2 for seamless loop) */
  repeat?: number;
  /** Additional CSS classes on the wrapper */
  className?: string;
}

/**
 * Reusable infinite-scroll marquee.
 *
 * Whatever children you pass in will be duplicated and scrolled
 * continuously in the chosen direction. The `marquee-scroll`
 * keyframe lives in `globals.css`.
 */
const Marquee: React.FC<MarqueeProps> = ({
  children,
  direction = "left",
  speed = 30,
  pauseOnHover = true,
  gap = 24,
  repeat = 2,
  className = "",
}) => {
  const effectiveRepeat = Math.max(repeat, 2);

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 20%, black 98%, transparent 100%)",
      }}
    >
      <div
        className="flex w-max"
        style={{
          gap: `${gap}px`,
          animation: `marquee-scroll ${speed}s linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal",
          ...(pauseOnHover ? {} : {}),
        }}
        onMouseEnter={(e) => {
          if (pauseOnHover) e.currentTarget.style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) e.currentTarget.style.animationPlayState = "running";
        }}
      >
        {Array.from({ length: effectiveRepeat }).map((_, i) => (
          <div
            key={i}
            className="flex shrink-0"
            style={{ gap: `${gap}px` }}
            aria-hidden={i > 0 ? true : undefined}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
