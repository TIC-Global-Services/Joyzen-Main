'use client';

import React, { useEffect, useRef } from 'react';
import sequenceData from './robot-sequence.json';

const FRAME_COUNT = sequenceData.assets.length;
const FPS = sequenceData.fr || 24;

export default function RobotSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    // Preload all images into memory
    if (imagesRef.current.length === 0) {
      for (let i = 0; i < FRAME_COUNT; i++) {
        const asset = sequenceData.assets[i];
        const img = new Image();
        img.src = `${asset.u}${asset.p}`;
        imagesRef.current.push(img);
      }
    }
  }, []);

  useEffect(() => {
    let lastTime = Date.now();
    let frameId: number;

    const loop = () => {
      const now = Date.now();
      if (now - lastTime >= 1000 / FPS) {
        if (imagesRef.current.length === FRAME_COUNT) {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            const img = imagesRef.current[frameRef.current];
            
            if (img && img.complete && img.width > 0) {
              // Ensure canvas dimensions match the image
              if (canvas.width !== img.width) {
                canvas.width = img.width;
                canvas.height = img.height;
              }
              if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              }
            }
            
            frameRef.current = (frameRef.current + 1) % FRAME_COUNT;
          }
        }
        lastTime = now;
      }
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none drop-shadow-sm">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
