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
  focusLng?: number;
  focusLat?: number;
  isOrigin?: boolean;
}

const ORIGIN_INDIA: CountryNode = {
  id: 'india',
  name: 'India',
  lat: 18.6139,
  lng: 77.209,
  focusLng: 77.2,
  focusLat: 22,
  isOrigin: true,
};

// All destination countries displayed simultaneously
const DESTINATION_LIST: CountryNode[] = [
  {
    id: 'australia',
    name: 'Australia',
    lat: -29.8688,
    lng: 131.2093,
    focusLng: 135,
    focusLat: -22,
  },
  {
    id: 'newzealand',
    name: 'New Zealand',
    lat: -41.8485,
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
    lng: 46.2708,
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

// ============================================================================
// Continuous 3D Connection Arc (Flowing Pulses from India to Destination)
// ============================================================================

function ConnectionArc({
  curve,
  index,
}: {
  curve: THREE.CubicBezierCurve3;
  index: number;
}) {
  // Tube geometry for the visible arc line connecting India to destination
  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.007, 8, false);
  }, [curve]);

  // Dual traveling pulses along each curve for continuous streaming movement
  const pulse1HeadRef = useRef<THREE.Mesh>(null);
  const pulse1GlowRef = useRef<THREE.Mesh>(null);
  const pulse1TrailRef = useRef<THREE.Mesh>(null);

  const pulse2HeadRef = useRef<THREE.Mesh>(null);
  const pulse2GlowRef = useRef<THREE.Mesh>(null);
  const pulse2TrailRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speed = 0.38; // Continuous smooth traveling speed

    // Pulse 1: Travels from India (progress 0) towards destination country (progress 1)
    const p1 = (t * speed + index * 0.2) % 1.0;
    const pos1 = curve.getPointAt(p1);
    const alpha1 = Math.sin(p1 * Math.PI);
    const scale1 = THREE.MathUtils.lerp(0.3, 1.0, alpha1);

    if (pulse1HeadRef.current) {
      pulse1HeadRef.current.position.copy(pos1);
      pulse1HeadRef.current.scale.setScalar(scale1);
    }
    if (pulse1GlowRef.current) {
      pulse1GlowRef.current.position.copy(pos1);
      pulse1GlowRef.current.scale.setScalar(scale1);
    }
    if (pulse1TrailRef.current) {
      const trail1 = curve.getPointAt(Math.max(0, p1 - 0.04));
      pulse1TrailRef.current.position.copy(trail1);
      pulse1TrailRef.current.scale.setScalar(scale1 * 0.75);
    }

    // Pulse 2: Staggered by 0.5 cycle so light pulses are continuously flowing
    const p2 = (t * speed + index * 0.2 + 0.5) % 1.0;
    const pos2 = curve.getPointAt(p2);
    const alpha2 = Math.sin(p2 * Math.PI);
    const scale2 = THREE.MathUtils.lerp(0.3, 1.0, alpha2);

    if (pulse2HeadRef.current) {
      pulse2HeadRef.current.position.copy(pos2);
      pulse2HeadRef.current.scale.setScalar(scale2);
    }
    if (pulse2GlowRef.current) {
      pulse2GlowRef.current.position.copy(pos2);
      pulse2GlowRef.current.scale.setScalar(scale2);
    }
    if (pulse2TrailRef.current) {
      const trail2 = curve.getPointAt(Math.max(0, p2 - 0.04));
      pulse2TrailRef.current.position.copy(trail2);
      pulse2TrailRef.current.scale.setScalar(scale2 * 0.75);
    }
  });

  return (
    <group>
      {/* 3D Volumetric Arc Line Tube */}
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Pulse 1 Elements (Streaming towards destination) */}
      <mesh ref={pulse1TrailRef}>
        <sphereGeometry args={[0.016, 12, 12]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
      </mesh>
      <mesh ref={pulse1HeadRef}>
        <sphereGeometry args={[0.024, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={pulse1GlowRef}>
        <sphereGeometry args={[0.052, 16, 16]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
      </mesh>

      {/* Pulse 2 Elements (Streaming towards destination) */}
      <mesh ref={pulse2TrailRef}>
        <sphereGeometry args={[0.016, 12, 12]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
      </mesh>
      <mesh ref={pulse2HeadRef}>
        <sphereGeometry args={[0.024, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={pulse2GlowRef}>
        <sphereGeometry args={[0.052, 16, 16]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

// ============================================================================
// Clean Marker Component (Displays Country Name cleanly without active tags)
// ============================================================================

function NodeMarker({
  node,
  radius,
  isOrigin = false,
}: {
  node: CountryNode;
  radius: number;
  isOrigin?: boolean;
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

    // Only visible when facing towards the camera (front hemisphere)
    const facing = dot > 0.08;
    if (facing !== isFacingRef.current) {
      isFacingRef.current = facing;
      setIsFacingCamera(facing);
    }
  });

  const pinColor = isOrigin ? '#10b981' : '#38bdf8';

  return (
    <group ref={groupRef} position={surfacePos} quaternion={quaternion}>
      {/* Outer soft glowing pin ring */}
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[isOrigin ? 0.048 : 0.04, 32]} />
        <meshBasicMaterial color={pinColor} transparent opacity={0.35} />
      </mesh>

      {/* Surface Base Pin */}
      <mesh position={[0, 0, 0.001]}>
        <circleGeometry args={[isOrigin ? 0.034 : 0.026, 32]} />
        <meshBasicMaterial color={pinColor} />
      </mesh>

      {/* Surface Inner Dot */}
      <mesh position={[0, 0, 0.002]}>
        <circleGeometry args={[isOrigin ? 0.016 : 0.012, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Country Name Badge (No active state, just clean country name) */}
      <group position={[0, 0, 0.06]}>
        <Html
          center
          distanceFactor={11}
          style={{
            pointerEvents: 'none',
            display: isFacingCamera ? 'block' : 'none',
            opacity: isFacingCamera ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}
        >
          <div
            className={`flex items-center gap-1.5 px-1 py-[1px] rounded-full backdrop-blur-md shadow-xl select-none whitespace-nowrap pointer-events-none transition-transform duration-200 border ${
              isOrigin
                ? 'bg-emerald-950/90 border-emerald-400/50 text-emerald-100 shadow-emerald-500/20'
                : 'bg-neutral-950/90 border-sky-400/40 text-white shadow-black/60'
            }`}
          >

            <span className="font-bold tracking-tight text-white text-[5px] drop-shadow-sm">
              {node.name}
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

function RotatingGlobe({ radius }: { radius: number }) {
  const globeGroupRef = useRef<THREE.Group>(null);

  // Local textures from public/
  const [earthTexture, bumpTexture] = useTexture(['/earth-texture-v2.png', '/earth-bump.png']);

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

  // Precompute jumping curves from India to all destination countries
  const curvesList = useMemo(() => {
    return DESTINATION_LIST.map((dest) => {
      const destPos = latLngToVector3(dest.lat, dest.lng, radius);
      return {
        id: dest.id,
        curve: createJumpingArcCurve(originPos, destPos, radius),
      };
    });
  }, [originPos, radius]);

  // Initial tilt and orientation with India nicely framed in front
  useEffect(() => {
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.x = 0.18;
      globeGroupRef.current.rotation.y = -Math.PI / 2 - ((ORIGIN_INDIA.focusLng ?? 77.2) * Math.PI) / 180;
    }
  }, []);

  // Smooth continuous rotation so all destination countries glide gracefully into view
  useFrame((_, delta) => {
    if (!globeGroupRef.current) return;
    globeGroupRef.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={globeGroupRef}>
      {/* Clean Earth Surface Mesh */}
      <mesh geometry={globeGeometry}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={0.12}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Origin Country Marker (India) */}
      <NodeMarker
        node={ORIGIN_INDIA}
        radius={radius}
        isOrigin={true}
      />

      {/* All Destination Country Markers shown simultaneously */}
      {DESTINATION_LIST.map((country) => (
        <NodeMarker
          key={`node-${country.id}`}
          node={country}
          radius={radius}
        />
      ))}

      {/* All Connection Lines from India moving continuously towards all countries */}
      {curvesList.map((item, idx) => (
        <ConnectionArc
          key={`arc-${item.id}`}
          curve={item.curve}
          index={idx}
        />
      ))}
    </group>
  );
}

// ============================================================================
// Scene Component
// ============================================================================

function Scene({ radius }: { radius: number }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, radius * 3.6);
    camera.lookAt(0, 0, 0);
  }, [camera, radius]);

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[radius * 10, radius * 2.5, radius * 5]} intensity={1.9} color="#ffffff" />
      <directionalLight position={[-radius * 4, -radius, -radius * 3]} intensity={0.4} color="#60a5fa" />

      {/* Rotating Globe with All Destination Arcs */}
      <RotatingGlobe radius={radius} />

      {/* Orbit Controls (Manual dragging to inspect from any angle) */}
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
// Default Export Component
// ============================================================================

export default function Globe3DDemo({
  className = 'h-full w-full',
  radius = 2.0,
}: {
  className?: string;
  radius?: number;
}) {
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
          <Scene radius={radius} />
        </Suspense>
      </Canvas>
    </div>
  );
}
