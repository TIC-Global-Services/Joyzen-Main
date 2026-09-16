'use client';

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, ContactShadows, Float, Html } from '@react-three/drei';
import { useControls, Leva } from 'leva';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import Marquee from '@/reuseable/Marquee';

// Transparent Honeycomb Overlay
const HoneycombBackground = () => (
  <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden z-0">
    <svg className="w-full h-full" width="100%" height="100%">
      <pattern
        id="honeycomb-transparent"
        width="60"
        height="104"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M30 0 L60 17.32 L60 51.96 L30 69.28 L0 51.96 L0 17.32 Z M30 52 L60 69.32 L60 103.96 L30 121.28 L0 103.96 L0 69.32 Z"
          fill="none"
          stroke="#D1D5DB"
          strokeWidth="1"
        />
      </pattern>
      <rect width="100%" height="100%" fill="url(#honeycomb-transparent)" />
    </svg>
  </div>
);

interface RobotModelProps {
  headSensitivityX: number;
  headSensitivityY: number;
  headDamping: number;
  invertX: boolean;
  invertY: boolean;
  playAnimation: boolean;
  poseTime: number;
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
  headRollOffset: number;
}

function RobotModel({
  headSensitivityX,
  headSensitivityY,
  headDamping,
  invertX,
  invertY,
  playAnimation,
  poseTime,
  posX,
  posY,
  posZ,
  rotX,
  rotY,
  rotZ,
  scale,
  headRollOffset,
}: RobotModelProps) {
  const group = useRef<THREE.Group>(null);
  const gltf = useGLTF('/joy-rob-1.glb');
  const { actions, names } = useAnimations(gltf.animations, group);

  const headBoneRef = useRef<THREE.Object3D | null>(null);
  const neckBoneRef = useRef<THREE.Object3D | null>(null);

  const initialHeadRot = useRef(new THREE.Euler());
  const initialNeckRot = useRef(new THREE.Euler());

  const mouseRef = useRef({ x: 0, y: 0 });

  // Global mouse tracking across the entire viewport
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Find head & neck bones in model hierarchy
  useEffect(() => {
    if (!gltf.scene) return;

    const findBone = (substring: string): THREE.Object3D | null => {
      let found: THREE.Object3D | null = null;
      gltf.scene.traverse((obj) => {
        if (!found && obj.name.toLowerCase().includes(substring)) {
          found = obj;
        }
      });
      return found;
    };

    const head = findBone('head');
    const neck = findBone('neck');

    if (head) {
      headBoneRef.current = head;
      initialHeadRot.current.copy(head.rotation);
      console.log('[RobotModel] Head bone found:', head.name);
    } else {
      console.warn('[RobotModel] No head bone found. Available bones:');
      gltf.scene.traverse((obj) => {
        if ((obj as any).isBone) console.log(' -', obj.name);
      });
    }

    if (neck) {
      neckBoneRef.current = neck;
      initialNeckRot.current.copy(neck.rotation);
    }
  }, [gltf.scene]);

  // Handle animation play state or freeze frame
  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      const action = actions[names[0]];
      if (action) {
        action.reset().play();
        if (!playAnimation) {
          action.paused = true;
          action.time = poseTime;
        } else {
          action.paused = false;
        }
      }
    }
  }, [actions, names, playAnimation, poseTime]);

  // Frame update for smooth head motion tracking
  useFrame((_, delta) => {
    const { x, y } = mouseRef.current;

    const dirX = invertX ? -1 : 1;
    const dirY = invertY ? -1 : 1;

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    const targetHeadY = clamp(
      initialHeadRot.current.y + x * headSensitivityX * dirX,
      initialHeadRot.current.y - 0.6,
      initialHeadRot.current.y + 0.6
    );
    const targetHeadX = clamp(
      initialHeadRot.current.x - y * headSensitivityY * dirY,
      initialHeadRot.current.x - 0.4,
      initialHeadRot.current.x + 0.4
    );

    const targetNeckY = initialNeckRot.current.y + x * (headSensitivityX * 0.3) * dirX;
    const targetNeckX = initialNeckRot.current.x - y * (headSensitivityY * 0.3) * dirY;

    if (headBoneRef.current) {
      headBoneRef.current.rotation.y = THREE.MathUtils.damp(
        headBoneRef.current.rotation.y, targetHeadY, headDamping, delta
      );
      headBoneRef.current.rotation.x = THREE.MathUtils.damp(
        headBoneRef.current.rotation.x, targetHeadX, headDamping, delta
      );
      headBoneRef.current.rotation.z = THREE.MathUtils.damp(
        headBoneRef.current.rotation.z,
        THREE.MathUtils.degToRad(headRollOffset),
        headDamping,
        delta
      );
    }

    if (neckBoneRef.current) {
      neckBoneRef.current.rotation.y = THREE.MathUtils.damp(
        neckBoneRef.current.rotation.y,
        targetNeckY,
        headDamping,
        delta
      );
      neckBoneRef.current.rotation.x = THREE.MathUtils.damp(
        neckBoneRef.current.rotation.x,
        targetNeckX,
        headDamping,
        delta
      );
      neckBoneRef.current.rotation.z = THREE.MathUtils.damp(
        neckBoneRef.current.rotation.z,
        0,
        headDamping,
        delta
      );
    }
  });

  return (
    <group
      ref={group}
      position={[posX, posY, posZ]}
      rotation={[
        THREE.MathUtils.degToRad(rotX),
        THREE.MathUtils.degToRad(rotY),
        THREE.MathUtils.degToRad(rotZ),
      ]}
      scale={scale}
      dispose={null}
    >
      {/* <primitive object={gltf.scene} /> */}
      <primitive object={gltf.scene} />
    </group>
  );
}

useGLTF.preload('/joy-rob-1.glb');

const LoaderFallback = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
      <div className="w-8 h-8 border-4 border-[#036132] border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
        Loading 3D Robot...
      </span>
    </div>
  </Html>
);

export default function DesignedForToday() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    playAnimation,
    poseTime,
    posX,
    posY,
    posZ,
    rotX,
    rotY,
    rotZ,
    scale,
    headSensitivityX,
    headSensitivityY,
    headDamping,
    invertX,
    invertY,
    ambientIntensity,
    dirIntensity,
    showLeva,
    headRollOffset,
  } = useControls('Robot Showcase Controls', {
    showLeva: { value: false, label: 'Show Leva Panel' },

    playAnimation: { value: false, label: 'Auto Play Animation' },
    poseTime: { value: 0.5, min: 0, max: 3, step: 0.05, label: 'Pose Frame Time' },

    posX: { value: 0, min: -2, max: 2, step: 0.1, label: 'Robot Pos X' },
    posY: { value: -2.0, min: -5, max: 5, step: 0.1, label: 'Robot Pos Y' },
    posZ: { value: 0, min: -5, max: 5, step: 0.1, label: 'Robot Pos Z' },
    rotX: { value: 0, min: -180, max: 180, step: 1, label: 'Robot Rot X' },
    rotY: { value: 0, min: -180, max: 180, step: 1, label: 'Robot Rot Y' },
    rotZ: { value: 0, min: -180, max: 180, step: 1, label: 'Robot Rot Z' },
    scale: { value: 2.1, min: 0.5, max: 5, step: 0.1, label: 'Robot Scale' },
    headRollOffset: { value: 0, min: -180, max: 180, step: 1, label: 'Head Roll Fix (deg)' },
    headSensitivityX: {
      value: 0.2,
      min: 0.1,
      max: 2.5,
      step: 0.05,
      label: 'Head Cursor Sens X',
    },
    headSensitivityY: {
      value: 0.2,
      min: 0.1,
      max: 2.5,
      step: 0.05,
      label: 'Head Cursor Sens Y',
    },
    headDamping: {
      value: 12,
      min: 1,
      max: 30,
      step: 0.5,
      label: 'Head Damping Speed',
    },
    invertX: { value: false, label: 'Invert Head X' },
    invertY: { value: false, label: 'Invert Head Y' },

    ambientIntensity: {
      value: 1.4,
      min: 0,
      max: 4,
      step: 0.1,
      label: 'Ambient Light',
    },
    dirIntensity: {
      value: 2.2,
      min: 0,
      max: 6,
      step: 0.1,
      label: 'Key Light Intensity',
    },
  });

  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-screen flex flex-col items-center justify-between py-12 px-4 bg-transparent overflow-hidden select-none">
      <Leva hidden={!showLeva} />
      <HoneycombBackground />

      {/* Header */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 pt-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl sm:text-3xl lg:text-[2.5rem] font-bold text-zinc-900 tracking-tight leading-tight"
        >
          Designed For Today. Not <br className='md:hidden'/> Inherited From Yesterday.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          className="text-[2.5rem] sm:text-5xl lg:text-6xl font-bold text-[#036132] tracking-tight mt-1 sm:mt-1 leading-tight"
        >
          Built For Tomorrow.
        </motion.p>
      </div>

      {/* 3D R3F Canvas Container */}
      <div className="relative w-full h-[550px] sm:h-[650px] lg:h-[720px] z-10">
        {/* Mobile: Animated Center Marquee Overlay (Positioned BEHIND 3D Canvas) */}
        <div className="md:hidden absolute inset-0 pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center">
          <div className="w-full">
            <Marquee speed={30} direction="left" pauseOnHover={false} repeat={4} gap={40}>
              <div className="flex items-center gap-10">
                <span className="font-bold tracking-tight text-4xl sm:text-4xl text-[#EB7958] drop-shadow-xs whitespace-nowrap">
                  Care That Continues
                </span>
                <span className="text-zinc-300 text-2xl font-light select-none">•</span>
                <span className="font-bold tracking-tight text-4xl sm:text-4xl text-[#9CD8E8] drop-shadow-xs whitespace-nowrap">
                  Built Around You
                </span>
                <span className="text-zinc-300 text-2xl font-light select-none">•</span>
                <span className="font-bold tracking-tight text-4xl sm:text-4xl text-[#036132] drop-shadow-xs whitespace-nowrap">
                  Rethink the Standard
                </span>
                <span className="text-zinc-300 text-2xl font-light select-none">•</span>
              </div>
            </Marquee>
          </div>
        </div>

        {/* Desktop & Tablet: Static Positioned Text Overlay (Positioned BEHIND 3D Canvas) */}
        <div className="hidden md:block absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          {/* Care That Continues - Middle Left */}
          <div className="absolute top-[50%] lg:top-[34%] left-[2%] sm:left-[1%] lg:left-[7%] font-bold tracking-tight text-3xl sm:text-3xl lg:text-5xl lg:text-[3.125rem] text-[#EB7958] drop-shadow-xs leading-none">
            Care That Continues
          </div>

          {/* Built Around You - Top Right */}
          <div className="absolute top-[30%] lg:top-[18%] right-[2%] sm:right-[4%] lg:right-[18%] font-bold tracking-tight text-3xl sm:text-3xl lg:text-5xl lg:text-[3.125rem] text-[#9CD8E8] drop-shadow-xs leading-none">
            Built Around You
          </div>

          {/* Rethink the Standard - Lower Right */}
          <div className="absolute bottom-[24%] right-[2%] sm:right-[2%] lg:right-[10%] font-bold tracking-tight text-3xl sm:text-3xl lg:text-5xl lg:text-[3.125rem] text-[#036132] drop-shadow-xs leading-none">
            Rethink the Standard
          </div>
        </div>

        {mounted && (
          <Canvas
            className="relative z-10 w-full h-full"
            camera={{ position: [0, 0, 7], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <ambientLight intensity={ambientIntensity} />
            <directionalLight position={[5, 8, 5]} intensity={dirIntensity} />
            <directionalLight position={[-5, 3, -2]} intensity={ambientIntensity * 0.4} />

            <Suspense fallback={<LoaderFallback />}>
              <RobotModel
                headSensitivityX={headSensitivityX}
                headSensitivityY={headSensitivityY}
                headDamping={headDamping}
                invertX={invertX}
                invertY={invertY}
                playAnimation={playAnimation}
                poseTime={poseTime}
                posX={posX}
                posY={posY}
                posZ={posZ}
                rotX={rotX}
                headRollOffset={headRollOffset}
                rotY={rotY}
                rotZ={rotZ}
                scale={scale}
              />
              <ContactShadows
                position={[0, posY, 0]}
                opacity={0.3}
                scale={8}
                blur={2.2}
                far={4}
              />
            </Suspense>
          </Canvas>
        )}
      </div>
    </section>
  );
}