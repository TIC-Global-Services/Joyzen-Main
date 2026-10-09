"use client";

import React, { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

export interface PulseMarker {
  id: string;
  name: string;
  location: [number, number];
  delay: number;
  isOrigin?: boolean;
}

export interface GlobeArc {
  from: [number, number];
  to: [number, number];
  id?: string;
  color?: [number, number, number];
}

// Exactly matching location coordinates from globe.tsx
export const DEFAULT_MARKERS: PulseMarker[] = [
  {
    id: "india",
    name: "India",
    location: [18.6139, 77.209],
    delay: 0,
    isOrigin: true,
  },
  {
    id: "australia",
    name: "Australia",
    location: [-20.8688, 131.2093],
    delay: 0.35,
  },
  {
    id: "newzealand",
    name: "New Zealand",
    location: [-41.8485, 174.7633],
    delay: 0.7,
  },
  {
    id: "canada",
    name: "Canada",
    location: [50.4215, -105.6972],
    delay: 1.05,
  },
  {
    id: "uae",
    name: "UAE",
    location: [25.2048, 46.2708],
    delay: 1.4,
  },
  {
    id: "europe",
    name: "Europe",
    location: [61.5074, 10.1278],
    delay: 1.75,
  },
];

// Connection arcs originating from India (#EF8F60 brand color)
export const DEFAULT_ARCS: GlobeArc[] = [
  {
    from: [18.6139, 77.209],
    to: [-20.8688, 131.2093],
    id: "india-australia",
  },
  {
    from: [18.6139, 77.209],
    to: [-41.8485, 174.7633],
    id: "india-newzealand",
  },
  {
    from: [18.6139, 77.209],
    to: [50.4215, -105.6972],
    id: "india-canada",
  },
  {
    from: [18.6139, 77.209],
    to: [25.2048, 46.2708],
    id: "india-uae",
  },
  {
    from: [18.6139, 77.209],
    to: [61.5074, 10.1278],
    id: "india-europe",
  },
];

// Brand warm orange (#EF8F60) converted to normalized RGB 0..1
const COLOR_BRAND_ORANGE: [number, number, number] = [
  239 / 255,
  143 / 255,
  96 / 255,
];

// Origin green (#10B981)
const COLOR_ORIGIN_GREEN: [number, number, number] = [
  16 / 255,
  185 / 255,
  129 / 255,
];

export interface GlobePulseProps {
  markers?: PulseMarker[];
  arcs?: GlobeArc[];
  className?: string;
  speed?: number;
}

export function GlobePulse({
  markers = DEFAULT_MARKERS,
  arcs = DEFAULT_ARCS,
  className = "",
  speed = 0.003,
}: GlobePulseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId: number;
    // Initial phi set around 1.35 rad so India starts front-facing
    let phi = 1.35;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi,
        theta: 0.22,
        dark: 1,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 8.5,
        baseColor: [0.45, 0.45, 0.45],
        markerColor: COLOR_BRAND_ORANGE,
        glowColor: [0.06, 0.06, 0.06],
        markerElevation: 0.02,
        markers: markers.map((m) => ({
          location: m.location,
          size: m.isOrigin ? 0.038 : 0.028,
          id: m.id,
          color: m.isOrigin ? COLOR_ORIGIN_GREEN : COLOR_BRAND_ORANGE,
        })),
        arcs: arcs.map((a) => ({
          from: a.from,
          to: a.to,
          id: a.id,
          color: a.color || COLOR_BRAND_ORANGE,
        })),
        arcColor: COLOR_BRAND_ORANGE,
        arcWidth: 0.8,
        arcHeight: 0.28,
        opacity: 0.9,
      });

      function animate() {
        if (!isPausedRef.current) {
          phi += speed;
        }

        const currentPhi = phi + phiOffsetRef.current + dragOffset.current.phi;
        const currentTheta =
          0.22 + thetaOffsetRef.current + dragOffset.current.theta;

        globe!.update({
          phi: currentPhi,
          theta: currentTheta,
        });

        // Cross-browser fallback sync for browsers lacking CSS Anchor Positioning
        const supportsAnchor =
          typeof CSS !== "undefined" &&
          CSS.supports &&
          CSS.supports("position-anchor", "--test");

        if (!supportsAnchor && containerRef.current) {
          const cobeWrapper = canvas.parentElement;
          if (cobeWrapper) {
            markers.forEach((m) => {
              const anchorEl = cobeWrapper.querySelector<HTMLElement>(
                `[style*="--cobe-${m.id}"]`
              );
              const markerEl = markerRefs.current[m.id];
              if (anchorEl && markerEl) {
                markerEl.style.left = anchorEl.style.left;
                markerEl.style.top = anchorEl.style.top;
              }
            });
          }
        }

        animationId = requestAnimationFrame(animate);
      }

      animate();
      setTimeout(() => {
        if (canvas) canvas.style.opacity = "1";
      }, 50);
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    const handleResize = () => {
      if (!canvasRef.current || !globe) return;
      const w = canvasRef.current.offsetWidth;
      if (w > 0) {
        globe.update({ width: w, height: w });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, [markers, arcs, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative aspect-square select-none ${className}`}
    >
      <style>{`
        @keyframes pulse-expand {
          0% { transform: scale(0.35); opacity: 0.9; }
          100% { transform: scale(1.65); opacity: 0; }
        }
      `}</style>

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />

      {markers.map((m) => {
        const pinColor = m.isOrigin ? "#10b981" : "#EF8F60";
        return (
          <div
            key={m.id}
            ref={(el) => {
              markerRefs.current[m.id] = el;
            }}
            data-marker-id={m.id}
            style={{
              position: "absolute",
              positionAnchor: `--cobe-${m.id}`,
              bottom: "anchor(center)",
              left: "anchor(center)",
              translate: "-50% 50%",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none" as const,
              opacity: `var(--cobe-visible-${m.id}, 0)`,
              filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 6px))`,
              transition: "opacity 0.35s ease, filter 0.35s ease",
            }}
          >
            {/* Outer Pulsing Waves */}
            <span
              style={{
                position: "absolute",
                inset: 0,
                border: `2px solid ${pinColor}`,
                borderRadius: "50%",
                opacity: 0,
                animation: `pulse-expand 2.2s ease-out infinite ${m.delay}s`,
              }}
            />
            <span
              style={{
                position: "absolute",
                inset: 0,
                border: `2px solid ${pinColor}`,
                borderRadius: "50%",
                opacity: 0,
                animation: `pulse-expand 2.2s ease-out infinite ${m.delay + 0.6}s`,
              }}
            />

            {/* Center Core Pin Dot */}
            <span
              style={{
                width: 8,
                height: 8,
                background: pinColor,
                borderRadius: "50%",
                boxShadow: `0 0 0 2px #0a0a0a, 0 0 8px ${pinColor}`,
              }}
            />

            {/* Country Name Tag Badge */}
            <div
              style={{
                position: "absolute",
                bottom: "calc(100% + 5px)",
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 7px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(10, 10, 10, 0.88)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  border: `1px solid ${
                    m.isOrigin
                      ? "rgba(16, 185, 129, 0.5)"
                      : "rgba(239, 143, 96, 0.45)"
                  }`,
                  color: "#ffffff",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.6)",
                }}
              >
                {m.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GlobePulse;
