'use client';

import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================================
// Geographic Data & Types
// ============================================================================

export interface CountryNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  focusLng: number;
  focusLat: number;
  isOrigin?: boolean;
}

const ORIGIN_INDIA: CountryNode = {
  id: 'india',
  name: 'India',
  lat: 28.6139,
  lng: 77.209,
  focusLng: 77.2,
  focusLat: 22,
  isOrigin: true,
};

// Sequence order: Australia -> New Zealand -> Canada -> UAE -> Europe
const DESTINATION_LIST: CountryNode[] = [
  {
    id: 'australia',
    name: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    focusLng: 135,
    focusLat: -22,
  },
  {
    id: 'newzealand',
    name: 'New Zealand',
    lat: -36.8485,
    lng: 174.7633,
    focusLng: 155,
    focusLat: -28,
  },
  {
    id: 'canada',
    name: 'Canada',
    lat: 45.4215,
    lng: -75.6972,
    focusLng: -85,
    focusLat: 38,
  },
  {
    id: 'uae',
    name: 'UAE',
    lat: 25.2048,
    lng: 55.2708,
    focusLng: 62,
    focusLat: 25,
  },
  {
    id: 'europe',
    name: 'Europe',
    lat: 51.5074,
    lng: -0.1278,
    focusLng: 15,
    focusLat: 46,
  },
];

// ============================================================================
// Math & Vector Utilities
// ============================================================================

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function createJumpingArcCurve(
  startVec: THREE.Vector3,
  endVec: THREE.Vector3,
  radius: number
): THREE.CubicBezierCurve3 {
  const theta = startVec.angleTo(endVec);
  const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  const mNorm = mid.clone().normalize();

  // Apex height: leaps high into space above the sphere surface without clipping
  const h = radius * (1 + Math.sin(theta / 2) * 0.52 + 0.18);
  const apex = mNorm.clone().multiplyScalar(h);

  const p1 = startVec.clone().lerp(apex, 0.55).normalize().multiplyScalar(radius + (h - radius) * 0.85);
  const p2 = endVec.clone().lerp(apex, 0.55).normalize().multiplyScalar(radius + (h - radius) * 0.85);

  return new THREE.CubicBezierCurve3(startVec, p1, p2, endVec);
}

function shortestAngleDiff(current: number, target: number): number {
  let diff = (target - current) % (Math.PI * 2);
  if (diff > Math.PI) diff -= Math.PI * 2;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return diff;
}

// ============================================================================
// Visible 3D Connection Arc Component (Thick Tube + Traveling Pulse)
// ============================================================================

function ConnectionArc({
  curve,
  isActive,
  index,
}: {
  curve: THREE.CubicBezierCurve3;
  isActive: boolean;
  index: number;
}) {
  const headRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Volumetric 3D tube geometry ensures the arc is bold, clear, and visible from any angle
  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, isActive ? 0.01 : 0.0055, 8, false);
  }, [curve, isActive]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Continuous smooth looping pulse along the curve
    const speed = isActive ? 0.55 : 0.35;
    const progress = (t * speed + index * 0.22) % 1.0;
    const headPos = curve.getPointAt(progress);

    if (headRef.current && glowRef.current) {
      headRef.current.position.copy(headPos);
      glowRef.current.position.copy(headPos);
    }
  });

  return (
    <group>
      {/* 3D Volumetric Arc Line Tube */}
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial
          color={isActive ? '#38bdf8' : '#0284c7'}
          transparent
          opacity={isActive ? 0.95 : 0.45}
        />
      </mesh>

      {/* Traveling Core Particle */}
      <mesh ref={headRef}>
        <sphereGeometry args={[isActive ? 0.034 : 0.02, 16, 16]} />
        <meshBasicMaterial color={isActive ? '#ffffff' : '#7dd3fc'} />
      </mesh>

      {/* Traveling Soft Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[isActive ? 0.068 : 0.04, 16, 16]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={isActive ? 0.75 : 0.35}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// Clean Marker Component (Accurate World Position Camera Check)
// ============================================================================

function NodeMarker({
  node,
  radius,
  isOrigin = false,
  isActive = false,
  onClick,
}: {
  node: CountryNode;
  radius: number;
  isOrigin?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const isFacingRef = useRef<boolean>(true);
  const [isFacingCamera, setIsFacingCamera] = useState<boolean>(true);

  const surfacePos = useMemo(() => {
    return latLngToVector3(node.lat, node.lng, radius * 1.002);
  }, [node.lat, node.lng, radius]);

  const quaternion = useMemo(() => {
    const normal = surfacePos.clone().normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  }, [surfacePos]);

  // Accurate visibility test based on true WORLD coordinates after globe rotation
  useFrame(({ camera }) => {
    if (!groupRef.current) return;
    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);

    // Direction from globe center (0,0,0) to marker in world space
    const normal = worldPos.clone().normalize();
    // Direction from marker to camera
    const toCamera = camera.position.clone().sub(worldPos).normalize();
    const dot = normal.dot(toCamera);

    // Marker is facing the camera when on the front hemisphere
    const facing = dot > 0.05;
    if (facing !== isFacingRef.current) {
      isFacingRef.current = facing;
      setIsFacingCamera(facing);
    }
  });

  const pinColor = isOrigin ? '#10b981' : isActive ? '#38bdf8' : '#0284c7';

  return (
    <group ref={groupRef} position={surfacePos} quaternion={quaternion}>
      {/* Clean Surface Pin */}
      <mesh
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        <circleGeometry args={[isOrigin ? 0.044 : isActive ? 0.04 : 0.03, 32]} />
        <meshBasicMaterial color={pinColor} />
      </mesh>

      {/* Surface Inner Dot */}
      <mesh position={[0, 0, 0.002]}>
        <circleGeometry args={[isOrigin ? 0.022 : isActive ? 0.018 : 0.014, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Prominent Country/Region Name Badge */}
      <group position={[0, 0, 0.08]}>
        <Html
          center
          distanceFactor={11}
          style={{
            pointerEvents: 'auto',
            display: isFacingCamera ? 'block' : 'none',
            opacity: isFacingCamera ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className={`flex items-center gap-[2px] px-1 py-[1px] rounded-full backdrop-blur-md shadow-2xl select-none whitespace-nowrap text-[10px] font-semibold cursor-pointer transition-all duration-200 hover:scale-105 ${isOrigin
                ? 'bg-emerald-950/95 border border-emerald-400 text-emerald-100 shadow-emerald-500/30 ring-1 ring-emerald-400/40'
                : isActive
                  ? 'bg-neutral-950/95 border-2 border-sky-400 text-white shadow-sky-500/50 ring-2 ring-sky-400/30 scale-105'
                  : 'bg-neutral-950/85 border border-white/30 text-neutral-200 shadow-black/50 hover:border-sky-400/60'
              }`}
          >
            <span
              className={`w-[2px] h-[2px] rounded-full ${isOrigin
                ? 'bg-emerald-400 animate-pulse'
                : isActive
                  ? 'bg-sky-400 animate-ping'
                  : 'bg-sky-400'
                }`}
            />
            <span className="font-bold tracking-tight text-white text-[5px]">
              {node.name}
            </span>
            {isOrigin ? (
              <span className="text-[3px] font-bold text-emerald-300 tracking-wider ml-0.5 px-1.5  rounded bg-emerald-500/25 border border-emerald-400/30">
                CARE HUB
              </span>
            ) : isActive ? (
              <span className="text-[3px] font-bold text-sky-300 tracking-wider ml-0.5 px-1  rounded bg-sky-500/25 border border-sky-400/30">
                ACTIVE
              </span>
            ) : null}
          </button>
        </Html>
      </group>
    </group>
  );
}

// ============================================================================
// India Plain Text Marker (Always at Origin Hub, hides when not visible)
// ============================================================================

function IndiaPlainMarker({ radius }: { radius: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const isFacingRef = useRef<boolean>(true);
  const [isFacingCamera, setIsFacingCamera] = useState<boolean>(true);

  const surfacePos = useMemo(() => {
    return latLngToVector3(ORIGIN_INDIA.lat, ORIGIN_INDIA.lng, radius * 1.002);
  }, [radius]);

  const quaternion = useMemo(() => {
    const normal = surfacePos.clone().normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  }, [surfacePos]);

  // Accurate visibility test: hide when India is rotated to the back side
  useFrame(({ camera }) => {
    if (!groupRef.current) return;
    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);

    // Outward surface normal in world coordinates
    const normal = worldPos.clone().normalize();
    // Direction from India to camera
    const toCamera = camera.position.clone().sub(worldPos).normalize();
    const dot = normal.dot(toCamera);

    // Front hemisphere check: visible when facing camera, hidden when rotated away
    const facing = dot > 0.05;
    if (facing !== isFacingRef.current) {
      isFacingRef.current = facing;
      setIsFacingCamera(facing);
    }
  });

  return (
    <group ref={groupRef} position={surfacePos} quaternion={quaternion}>
      {/* India Surface Dot */}
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[0.042, 32]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
      <mesh position={[0, 0, 0.002]}>
        <circleGeometry args={[0.02, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Plain Text on Top of India */}
      <group position={[0, 0, 0.07]}>
        <Html
          center
          distanceFactor={11}
          style={{
            pointerEvents: 'none',
            display: isFacingCamera ? 'block' : 'none',
            opacity: isFacingCamera ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <div className="flex flex-col items-center select-none pointer-events-none -translate-y-1">
            <span
              className="text-[8px] font-bold text-white tracking-wide whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]"
              style={{
                textShadow: '0 1px 3px #000, 0 2px 6px rgba(0,0,0,0.9)',
              }}
            >
              India
            </span>
          </div>
        </Html>
      </group>
    </group>
  );
}

// ============================================================================
// Rotating Globe Scene
// ============================================================================

function RotatingGlobe({
  radius,
  stepIndex,
  onSelectCountry,
}: {
  radius: number;
  stepIndex: number;
  onSelectCountry: (idx: number) => void;
}) {
  const globeGroupRef = useRef<THREE.Group>(null);
  const currentRotY = useRef(0);
  const currentRotX = useRef(0);

  // Local textures from public/
  const [earthTexture, bumpTexture] = useTexture(['/earth-texture.jpg', '/earth-bump.png']);

  useMemo(() => {
    if (earthTexture) {
      earthTexture.colorSpace = THREE.SRGBColorSpace;
      earthTexture.anisotropy = 16;
    }
    if (bumpTexture) {
      bumpTexture.anisotropy = 8;
    }
  }, [earthTexture, bumpTexture]);

  const globeGeometry = useMemo(() => new THREE.SphereGeometry(radius, 64, 64), [radius]);

  // Origin point (India)
  const originPos = useMemo(
    () => latLngToVector3(ORIGIN_INDIA.lat, ORIGIN_INDIA.lng, radius),
    [radius]
  );

  // Precompute jumping curves from India to each destination
  const curvesList = useMemo(() => {
    return DESTINATION_LIST.map((dest) => {
      const destPos = latLngToVector3(dest.lat, dest.lng, radius);
      return {
        id: dest.id,
        curve: createJumpingArcCurve(originPos, destPos, radius),
      };
    });
  }, [originPos, radius]);

  // Determine current active destination
  const activeCountry = stepIndex >= 0 ? DESTINATION_LIST[stepIndex] : null;

  // Calculate target rotation based on active destination or India
  const { targetRotY, targetRotX } = useMemo(() => {
    const targetNode = activeCountry || ORIGIN_INDIA;
    const targetY = -Math.PI / 2 - (targetNode.focusLng * Math.PI) / 180;
    const targetX = (targetNode.focusLat * Math.PI) / 180 * 0.45;
    return { targetRotY: targetY, targetRotX: targetX };
  }, [activeCountry]);

  // Smoothly rotate the Earth to face the active country
  useFrame((_, delta) => {
    if (!globeGroupRef.current) return;

    // Smooth shortest-path rotation interpolation
    const diffY = shortestAngleDiff(currentRotY.current, targetRotY);
    currentRotY.current += diffY * Math.min(1, delta * 2.2);

    const diffX = targetRotX - currentRotX.current;
    currentRotX.current += diffX * Math.min(1, delta * 2.2);

    globeGroupRef.current.rotation.y = currentRotY.current;
    globeGroupRef.current.rotation.x = currentRotX.current;
  });

  return (
    <group ref={globeGroupRef}>
      {/* Clean Earth Surface Mesh (without any outer wireframe shell or outer circle) */}
      <mesh geometry={globeGeometry}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={0.12}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* India Plain Text Marker (Always on Care Hub, hides when rotated to back) */}
      <IndiaPlainMarker radius={radius} />

      {/* Active Destination Node Marker (Only ONE destination marker at a time) */}
      {stepIndex >= 0 && activeCountry && (
        <NodeMarker
          key={`active-node-${activeCountry.id}`}
          node={activeCountry}
          radius={radius}
          isActive
          onClick={() => onSelectCountry(stepIndex)}
        />
      )}

      {/* 3D Connection Arc for the active destination */}
      {stepIndex >= 0 && curvesList[stepIndex] && (
        <ConnectionArc
          key={`arc-${curvesList[stepIndex].id}`}
          curve={curvesList[stepIndex].curve}
          isActive={true}
          index={stepIndex}
        />
      )}
    </group>
  );
}

// ============================================================================
// Scene Component
// ============================================================================

function Scene({
  radius,
  stepIndex,
  onSelectCountry,
}: {
  radius: number;
  stepIndex: number;
  onSelectCountry: (idx: number) => void;
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, radius * 3.6);
    camera.lookAt(0, 0, 0);
  }, [camera, radius]);

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[radius * 5, radius * 2.5, radius * 5]} intensity={1.9} color="#ffffff" />
      <directionalLight position={[-radius * 4, -radius, -radius * 3]} intensity={0.4} color="#60a5fa" />

      {/* Clean Rotating Globe with Visible 3D Arcs */}
      <RotatingGlobe
        radius={radius}
        stepIndex={stepIndex}
        onSelectCountry={onSelectCountry}
      />

      {/* Orbit Controls (Manual dragging to inspect, returns to focus smoothly) */}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        minDistance={radius * 2}
        maxDistance={radius * 6}
        rotateSpeed={0.5}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  );
}

// ============================================================================
// Fallback Loader
// ============================================================================

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-sky-400/30 border-t-sky-400 animate-spin" />
        <span className="text-xs text-neutral-400 font-medium tracking-wide">Loading Globe...</span>
      </div>
    </Html>
  );
}

// ============================================================================
// Default Export Component with Automatic Sequence Controller
// ============================================================================

export default function Globe3DDemo({
  className = 'h-full w-full',
  radius = 2.0,
}: {
  className?: string;
  radius?: number;
}) {
  // -1 = India Care Hub; 0 = Australia; 1 = New Zealand; 2 = Canada; 3 = UAE; 4 = Europe
  const [stepIndex, setStepIndex] = useState<number>(-1);

  // Automatic sequential tour: India -> Australia -> New Zealand -> Canada -> UAE -> Europe -> loop
  useEffect(() => {
    // Start at India for 2.6 seconds, then tour destinations
    const initialTimer = setTimeout(() => {
      setStepIndex(0);
    }, 2600);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (stepIndex === -1) return;

    // Each country stays active for ~4.5 seconds while globe rotates to focus
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % DESTINATION_LIST.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [stepIndex]);

  const handleSelectCountry = (idx: number) => {
    setStepIndex(idx);
  };

  return (
    <div className={`relative ${className}`}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 0, radius * 3.6],
        }}
        style={{
          background: 'transparent',
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene
            radius={radius}
            stepIndex={stepIndex}
            onSelectCountry={handleSelectCountry}
          />
        </Suspense>
      </Canvas>

      {/* Prominent Active Country/Region Header HUD */}
      {/* <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-neutral-950/85 backdrop-blur-xl border border-white/15 shadow-2xl pointer-events-none">
        <span
          className={`w-2 h-2 rounded-full ${stepIndex === -1 ? 'bg-emerald-400 animate-pulse' : 'bg-sky-400 animate-ping'
            }`}
        />
        <span className="text-[11px] sm:text-xs font-medium text-neutral-400">Active Region:</span>
        <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
          {stepIndex === -1 ? 'India (Care Hub)' : DESTINATION_LIST[stepIndex]?.name}
        </span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
          {stepIndex === -1 ? 'Care Hub Origin' : 'Virtual Care Active'}
        </span>
      </div> */}

      {/* Clean, Neat UI Navigation Stepper Pill Bar */}
      {/* <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 max-w-[94%] overflow-x-auto no-scrollbar flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-neutral-950/85 backdrop-blur-xl border border-white/10 shadow-2xl z-20">
        <button
          onClick={() => handleSelectCountry(-1)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${stepIndex === -1
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105'
              : 'text-neutral-400 hover:text-neutral-200'
            }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>India (Care Hub)</span>
        </button>

        <div className="w-[1px] h-4 bg-white/15 mx-0.5" />

        {DESTINATION_LIST.map((country, idx) => (
          <button
            key={country.id}
            onClick={() => handleSelectCountry(idx)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap ${stepIndex === idx
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
              }`}
          >
            {country.name}
          </button>
        ))}
      </div> */}
    </div>
  );
}
