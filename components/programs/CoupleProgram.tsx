'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

export interface CoupleProgramProps {
  className?: string;
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  isShocked?: boolean;
  textureUrl?: string;
  glowColor?: string | number;
  auraColor?: string | number;
  interactive?: boolean;
}

const PLANET_RADIUS = 1.8;
const BASE_ROTATION_SPEED = 0.35;

// Shaders for Atmospheric Fresnel Rim Glow (Glowing planetary limb / halo)
const ATMOSPHERE_VERTEX_SHADER = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = `
  varying vec3 vNormal;
  uniform vec3 uGlowColor;
  uniform float uIntensity;
  void main() {
    float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    float glow = pow(rim, 2.8) * uIntensity;
    gl_FragColor = vec4(uGlowColor, glow * 0.85);
  }
`;

// Shaders for Outer Atmospheric Space Aura (Subtle soft space haze)
const OUTER_AURA_VERTEX_SHADER = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const OUTER_AURA_FRAGMENT_SHADER = `
  varying vec3 vNormal;
  uniform vec3 uAuraColor;
  uniform float uIntensity;
  void main() {
    float rim = max(0.0, 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))));
    float glow = pow(rim, 3.2) * 0.55 * uIntensity;
    gl_FragColor = vec4(uAuraColor, glow);
  }
`;

// Fallback sphere shown during texture load or error
function PlanetFallback({
  planetMeshRef,
}: {
  planetMeshRef: React.RefObject<THREE.Mesh | null>;
}) {
  return (
    <mesh ref={planetMeshRef}>
      <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
      <meshBasicMaterial color="#fcd34d" />
    </mesh>
  );
}

// Error Boundary for safe texture loading
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class TextureErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('CoupleProgram: Texture loading fallback activated:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// 3D Planet Globe Model (True 3D Sphere with seamless planetary texture)
function PlanetGlobe({
  textureUrl,
  planetMeshRef,
}: {
  textureUrl: string;
  planetMeshRef: React.RefObject<THREE.Mesh | null>;
}) {
  const texture = useTexture(textureUrl);

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <mesh ref={planetMeshRef}>
      <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

// Preload default planetary texture
if (typeof window !== 'undefined') {
  try {
    useTexture.preload('/programs/Couple-Program-planet.png');
  } catch {
    // Silently continue if preload fails
  }
}

interface InteractionState {
  localMouseX: number;
  localMouseY: number;
  isDragging: boolean;
  lastPointerX: number;
  lastPointerY: number;
  currentSpinVelocity: number;
  pitchVelocity: number;
  curTiltX: number;
  curTiltY: number;
  curShockScale: number;
  curGlowIntensity: number;
}

interface PlanetOrbProps {
  textureUrl: string;
  glowColor: string | number;
  auraColor: string | number;
  isShocked: boolean;
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  interactionRef: React.RefObject<InteractionState>;
  planetMeshRef: React.RefObject<THREE.Mesh | null>;
  axialTiltGroupRef: React.RefObject<THREE.Group | null>;
}

function PlanetOrb({
  textureUrl,
  glowColor,
  auraColor,
  isShocked,
  mouseX,
  mouseY,
  interactionRef,
  planetMeshRef,
  axialTiltGroupRef,
}: PlanetOrbProps) {
  const orbGroupRef = useRef<THREE.Group>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh>(null);
  const outerAuraMeshRef = useRef<THREE.Mesh>(null);
  const atmosphereMatRef = useRef<THREE.ShaderMaterial>(null);
  const outerAuraMatRef = useRef<THREE.ShaderMaterial>(null);
  const isShockedRef = useRef(isShocked);

  useEffect(() => {
    isShockedRef.current = isShocked;
  }, [isShocked]);

  const atmosphereUniforms = useMemo(
    () => ({
      uGlowColor: { value: new THREE.Color(glowColor as THREE.ColorRepresentation) },
      uIntensity: { value: 1.0 },
    }),
    []
  );

  const outerAuraUniforms = useMemo(
    () => ({
      uAuraColor: { value: new THREE.Color(auraColor as THREE.ColorRepresentation) },
      uIntensity: { value: 1.0 },
    }),
    []
  );

  useEffect(() => {
    atmosphereUniforms.uGlowColor.value.set(glowColor as THREE.ColorRepresentation);
  }, [glowColor, atmosphereUniforms]);

  useEffect(() => {
    outerAuraUniforms.uAuraColor.value.set(auraColor as THREE.ColorRepresentation);
  }, [auraColor, outerAuraUniforms]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
    const interaction = interactionRef.current;
    if (!interaction) return;

    let normX = interaction.localMouseX;
    let normY = interaction.localMouseY;

    if (mouseX && mouseY) {
      const mx = mouseX.get();
      const my = mouseY.get();
      if (mx !== 0 || my !== 0) {
        normX = Math.max(-1, Math.min(1, mx / 380));
        normY = Math.max(-1, Math.min(1, my / 380));
      }
    }

    if (!interaction.isDragging) {
      interaction.currentSpinVelocity *= 0.94;
      interaction.pitchVelocity *= 0.94;

      if (axialTiltGroupRef.current) {
        axialTiltGroupRef.current.rotation.x = Math.max(
          -0.5,
          Math.min(0.5, axialTiltGroupRef.current.rotation.x + interaction.pitchVelocity)
        );
      }

      if (planetMeshRef.current) {
        planetMeshRef.current.rotation.y +=
          (BASE_ROTATION_SPEED + interaction.currentSpinVelocity * 60) * d;
      }
    }

    const MAX_TILT = 0.22;
    const targetTiltY = normX * MAX_TILT;
    const targetTiltX = -normY * MAX_TILT;

    interaction.curTiltX += (targetTiltX - interaction.curTiltX) * 0.07;
    interaction.curTiltY += (targetTiltY - interaction.curTiltY) * 0.07;

    const targetShock = isShockedRef.current ? 1.08 : 1.0;
    const targetGlow = isShockedRef.current ? 1.6 : 1.0;
    interaction.curShockScale += (targetShock - interaction.curShockScale) * 0.14;
    interaction.curGlowIntensity += (targetGlow - interaction.curGlowIntensity) * 0.12;

    atmosphereUniforms.uIntensity.value = interaction.curGlowIntensity;
    outerAuraUniforms.uIntensity.value = interaction.curGlowIntensity;

    if (orbGroupRef.current) {
      orbGroupRef.current.rotation.x = interaction.curTiltX;
      orbGroupRef.current.rotation.y = interaction.curTiltY;
      orbGroupRef.current.scale.setScalar(interaction.curShockScale);
    }
  });

  return (
    <group ref={orbGroupRef}>
      {/* Axial Tilt Group Hierarchy */}
      <group ref={axialTiltGroupRef} rotation={[0.12, 0, 0.38]}>
        <TextureErrorBoundary fallback={<PlanetFallback planetMeshRef={planetMeshRef} />}>
          <Suspense fallback={<PlanetFallback planetMeshRef={planetMeshRef} />}>
            <PlanetGlobe textureUrl={textureUrl} planetMeshRef={planetMeshRef} />
          </Suspense>
        </TextureErrorBoundary>

        {/* Atmospheric Fresnel Rim Glow */}
        <mesh ref={atmosphereMeshRef}>
          <sphereGeometry args={[PLANET_RADIUS * 1.02, 64, 64]} />
          <shaderMaterial
            ref={atmosphereMatRef}
            vertexShader={ATMOSPHERE_VERTEX_SHADER}
            fragmentShader={ATMOSPHERE_FRAGMENT_SHADER}
            uniforms={atmosphereUniforms}
            blending={THREE.AdditiveBlending}
            transparent
            side={THREE.FrontSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Outer Atmospheric Space Aura */}
      <mesh ref={outerAuraMeshRef}>
        <sphereGeometry args={[PLANET_RADIUS * 1.12, 48, 48]} />
        <shaderMaterial
          ref={outerAuraMatRef}
          vertexShader={OUTER_AURA_VERTEX_SHADER}
          fragmentShader={OUTER_AURA_FRAGMENT_SHADER}
          uniforms={outerAuraUniforms}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function CoupleProgram({
  className = 'w-full h-full',
  mouseX,
  mouseY,
  isShocked = false,
  textureUrl = '/programs/Couple-Program-planet.png',
  glowColor = 0xfcd34d,
  auraColor = 0xf59e0b,
  interactive = true,
}: CoupleProgramProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const axialTiltGroupRef = useRef<THREE.Group>(null);

  const interactionRef = useRef<InteractionState>({
    localMouseX: 0,
    localMouseY: 0,
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    currentSpinVelocity: 0,
    pitchVelocity: 0,
    curTiltX: 0,
    curTiltY: 0,
    curShockScale: 1.0,
    curGlowIntensity: 1.0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolvedTextureUrl =
    !textureUrl ||
    textureUrl === '/programs/Couple-Program.svg' ||
    textureUrl === '/programs/Couple-Program.png'
      ? '/programs/Couple-Program-planet.png'
      : textureUrl;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const interaction = interactionRef.current;
    interaction.isDragging = true;
    interaction.lastPointerX = e.clientX;
    interaction.lastPointerY = e.clientY;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const container = containerRef.current;
    if (!container) return;
    const interaction = interactionRef.current;

    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    interaction.localMouseX = (e.clientX - cx) / (rect.width / 2);
    interaction.localMouseY = (e.clientY - cy) / (rect.height / 2);

    if (interaction.isDragging) {
      const dx = e.clientX - interaction.lastPointerX;
      const dy = e.clientY - interaction.lastPointerY;
      interaction.lastPointerX = e.clientX;
      interaction.lastPointerY = e.clientY;

      if (planetMeshRef.current) {
        planetMeshRef.current.rotation.y += dx * 0.007;
      }
      interaction.currentSpinVelocity = dx * 0.007;

      if (axialTiltGroupRef.current) {
        axialTiltGroupRef.current.rotation.x = Math.max(
          -0.5,
          Math.min(0.5, axialTiltGroupRef.current.rotation.x + dy * 0.004)
        );
      }
      interaction.pitchVelocity = dy * 0.004;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    interactionRef.current.isDragging = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerLeave = () => {
    if (!interactive) return;
    const interaction = interactionRef.current;
    if (!interaction.isDragging) {
      interaction.localMouseX = 0;
      interaction.localMouseY = 0;
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full h-full flex items-center justify-center select-none ${
        interactive ? 'cursor-grab active:cursor-grabbing touch-none' : 'pointer-events-none'
      } ${className}`}
    >
      {mounted && (
        <Canvas
          camera={{
            position: [0, 0, 5.85],
            fov: 40,
            near: 0.1,
            far: 50,
          }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'default',
          }}
          dpr={[1, 2]}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.1;
          }}
          className="w-full h-full block"
        >
          <PlanetOrb
            textureUrl={resolvedTextureUrl}
            glowColor={glowColor}
            auraColor={auraColor}
            isShocked={isShocked}
            mouseX={mouseX}
            mouseY={mouseY}
            interactionRef={interactionRef}
            planetMeshRef={planetMeshRef}
            axialTiltGroupRef={axialTiltGroupRef}
          />
        </Canvas>
      )}
    </div>
  );
}

export { CoupleProgram as CoupleProgramThreeCircle };
