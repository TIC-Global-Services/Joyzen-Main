'use client';

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';

interface RobotModelProps {
  headSensitivityX?: number;
  headSensitivityY?: number;
  headDamping?: number;
  posX?: number;
  posY?: number;
  posZ?: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  scale?: number;
}

function RobotModel({
  headSensitivityX = 0.25,
  headSensitivityY = 0.25,
  headDamping = 12,
  posX = 0,
  posY = -1.9,
  posZ = 0,
  rotX = 0,
  rotY = 0,
  rotZ = 0,
  scale = 2.1,
}: RobotModelProps) {
  const group = useRef<THREE.Group>(null);
  const gltf = useGLTF('/joy-rob-1.glb');
  const { actions, names } = useAnimations(gltf.animations, group);

  const headBoneRef = useRef<THREE.Object3D | null>(null);
  const neckBoneRef = useRef<THREE.Object3D | null>(null);

  const initialHeadRot = useRef(new THREE.Euler());
  const initialNeckRot = useRef(new THREE.Euler());

  const mouseRef = useRef({ x: 0, y: 0 });

  // Global mouse tracking across the viewport
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
    }

    if (neck) {
      neckBoneRef.current = neck;
      initialNeckRot.current.copy(neck.rotation);
    }
  }, [gltf.scene]);

  // Set initial pose / animation frame
  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      const action = actions[names[0]];
      if (action) {
        action.reset().play();
        action.paused = true;
        action.time = 0.5;
      }
    }
  }, [actions, names]);

  // Frame update for smooth head motion tracking
  useFrame((_, delta) => {
    const { x, y } = mouseRef.current;

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    const targetHeadY = clamp(
      initialHeadRot.current.y + x * headSensitivityX,
      initialHeadRot.current.y - 0.6,
      initialHeadRot.current.y + 0.6
    );
    const targetHeadX = clamp(
      initialHeadRot.current.x - y * headSensitivityY,
      initialHeadRot.current.x - 0.4,
      initialHeadRot.current.x + 0.4
    );

    const targetNeckY = initialNeckRot.current.y + x * (headSensitivityX * 0.3);
    const targetNeckX = initialNeckRot.current.x - y * (headSensitivityY * 0.3);

    if (headBoneRef.current) {
      headBoneRef.current.rotation.y = THREE.MathUtils.damp(
        headBoneRef.current.rotation.y, targetHeadY, headDamping, delta
      );
      headBoneRef.current.rotation.x = THREE.MathUtils.damp(
        headBoneRef.current.rotation.x, targetHeadX, headDamping, delta
      );
      headBoneRef.current.rotation.z = THREE.MathUtils.damp(
        headBoneRef.current.rotation.z, 0, headDamping, delta
      );
    }

    if (neckBoneRef.current) {
      neckBoneRef.current.rotation.y = THREE.MathUtils.damp(
        neckBoneRef.current.rotation.y, targetNeckY, headDamping, delta
      );
      neckBoneRef.current.rotation.x = THREE.MathUtils.damp(
        neckBoneRef.current.rotation.x, targetNeckX, headDamping, delta
      );
      neckBoneRef.current.rotation.z = THREE.MathUtils.damp(
        neckBoneRef.current.rotation.z, 0, headDamping, delta
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
      <primitive object={gltf.scene} />
    </group>
  );
}

useGLTF.preload('/joy-rob-1.glb');

const LoaderFallback = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
      <div className="w-6 h-6 border-3 border-[#036132] border-t-transparent rounded-full animate-spin" />
    </div>
  </Html>
);

export default function HeroRobotCanvas({ className = "w-full h-full" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 8, 5]} intensity={2.2} />
        <directionalLight position={[-5, 3, -2]} intensity={0.6} />

        <Suspense fallback={<LoaderFallback />}>
          <RobotModel
            posX={0}
            posY={-1.9}
            posZ={0}
            rotY={0}
            scale={2.05}
          />
          <ContactShadows
            position={[0, -1.9, 0]}
            opacity={0.3}
            scale={6}
            blur={2}
            far={4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
