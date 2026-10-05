'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { useControls, folder, button, Leva } from 'leva';
import { ENABLE_DEV_CONTROLS, type Globe3DConfig } from './programConfigs';

export { ENABLE_DEV_CONTROLS };

export interface CalaThreeGlobeProps extends Globe3DConfig {
  className?: string;
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  isShocked?: boolean;
  interactive?: boolean;
  showControls?: boolean;
  defaultRadius?: number;
  defaultExposure?: number;
  defaultAtmosphereColor?: string;
  defaultAuraColor?: string;
  glowColor?: string | number;
  auraColor?: string | number;
}

// 1. Shared Global Texture Cache to ensure instant 0ms loads across all instances and page re-visits
const globalTextureCache = new Map<string, THREE.Texture>();
const globalLoadingPromises = new Map<string, Promise<THREE.Texture>>();
let sharedPlaceholderTexture: THREE.CanvasTexture | null = null;

// 2. Instant 0ms procedural gradient texture (never show a black orb while downloading)
function getPlaceholderTexture(): THREE.CanvasTexture {
  if (sharedPlaceholderTexture) return sharedPlaceholderTexture;
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return new THREE.Texture() as THREE.CanvasTexture;
  }
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 32;
  const ctx = c.getContext('2d');
  if (ctx) {
    const g = ctx.createLinearGradient(0, 0, 64, 32);
    g.addColorStop(0, '#0369a1');
    g.addColorStop(0.35, '#06b6d4');
    g.addColorStop(0.65, '#0d9488');
    g.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 32);
  }
  sharedPlaceholderTexture = new THREE.CanvasTexture(c);
  sharedPlaceholderTexture.colorSpace = THREE.SRGBColorSpace;
  sharedPlaceholderTexture.wrapS = THREE.RepeatWrapping;
  sharedPlaceholderTexture.wrapT = THREE.ClampToEdgeWrapping;
  return sharedPlaceholderTexture;
}

// 3. Ultra-fast cached loader with WebP prioritized for ~180KB instant loads and PNG fallback
export function loadTextureCached(url: string): Promise<THREE.Texture> {
  if (!url) return Promise.reject(new Error('Invalid URL'));
  if (globalTextureCache.has(url)) {
    return Promise.resolve(globalTextureCache.get(url)!);
  }
  if (globalLoadingPromises.has(url)) {
    return globalLoadingPromises.get(url)!;
  }

  const promise = new Promise<THREE.Texture>((resolve) => {
    const loader = new THREE.TextureLoader();
    const webpUrl = url.endsWith('.png') ? url.replace(/\.png$/, '.webp') : url;

    const setupTexture = (tex: THREE.Texture) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      globalTextureCache.set(url, tex);
      resolve(tex);
    };

    // Fast-path: WebP companion (~180KB vs 1.7MB)
    loader.load(
      webpUrl,
      setupTexture,
      undefined,
      () => {
        // Fallback to optimized PNG
        loader.load(
          url,
          setupTexture,
          undefined,
          (err) => {
            console.warn('CalaThreeGlobe: Error loading planet texture, fallback to SVG:', err);
            loader.load('/cala-orb-new.svg', setupTexture);
          }
        );
      }
    );
  });

  globalLoadingPromises.set(url, promise);
  return promise;
}

// 4. Background idle preload so primary texture is already in memory when needed
if (typeof window !== 'undefined') {
  const triggerPreload = () => {
    loadTextureCached('/cala-planet-texture.png').catch(() => {});
  };
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(triggerPreload);
  } else {
    setTimeout(triggerPreload, 50);
  }
}

export const PROGRAM_TEXTURE_MAP: Record<string, string> = {
  'Current / Default': '',
  'CALA Planet (Primary)': '/cala-planet-texture.png',
  'Pregnancy Prep (EVE)': '/programs/Pregnancy-Prep-planet.webp',
  'Natural Conception (VITA)': '/programs/Natural-Conception-planet.webp',
  'Teen Health (LUNA)': '/programs/Teen-Health-planet.webp',
  'Women Health (LYRA)': '/programs/Women-Health-planet.webp',
  'Men Health (CORE)': '/programs/Men-Health-planet.webp',
  'Male Fertility (ATLAS)': '/programs/Male-Fertility-planet.webp',
  'Fatherhood Prep (GENESIS)': '/programs/Fatherhood-Prep-planet.png',
  'Eve & Genesis (Special)': '/eve-genesis-wc.png',
  'Couple Program': '/programs/Couple-Program-planet.png',
};

const PLANET_TEXTURE_LOOKUP: Record<string, string> = {
  '/programs/Pregnancy-Prep.svg': '/programs/Pregnancy-Prep-planet.webp',
  '/programs/Pregnancy-Prep.png': '/programs/Pregnancy-Prep-planet.webp',
  '/programs/Pregnancy-Prep.webp': '/programs/Pregnancy-Prep-planet.webp',
  '/programs/Pregnancy-Prep-planet.png': '/programs/Pregnancy-Prep-planet.webp',
  '/programs/Natural-Conception.svg': '/programs/Natural-Conception-planet.webp',
  '/programs/Natural-Conception.png': '/programs/Natural-Conception-planet.webp',
  '/programs/Natural-Conception.webp': '/programs/Natural-Conception-planet.webp',
  '/programs/Natural-Conception-planet.png': '/programs/Natural-Conception-planet.webp',
  '/programs/Teen-Health.svg': '/programs/Teen-Health-planet.webp',
  '/programs/Teen-Health.png': '/programs/Teen-Health-planet.webp',
  '/programs/Teen-Health.webp': '/programs/Teen-Health-planet.webp',
  '/programs/Teen-Health-planet.png': '/programs/Teen-Health-planet.webp',
  '/programs/Women-Health.svg': '/programs/Women-Health-planet.webp',
  '/programs/Women-Health.png': '/programs/Women-Health-planet.webp',
  '/programs/Women-Health.webp': '/programs/Women-Health-planet.webp',
  '/programs/Women-Health-planet.png': '/programs/Women-Health-planet.webp',
  '/programs/Men-Health.svg': '/programs/Men-Health-planet.webp',
  '/programs/Men-Health.png': '/programs/Men-Health-planet.webp',
  '/programs/Men-Health.webp': '/programs/Men-Health-planet.webp',
  '/programs/Men-Health-planet.png': '/programs/Men-Health-planet.webp',
  '/programs/Male-Fertility.svg': '/programs/Male-Fertility-planet.webp',
  '/programs/Male-Fertility.png': '/programs/Male-Fertility-planet.webp',
  '/programs/Male-Fertility.webp': '/programs/Male-Fertility-planet.webp',
  '/programs/Male-Fertility-planet.png': '/programs/Male-Fertility-planet.webp',
  '/programs/Fatherhood-Prep.svg': '/programs/Fatherhood-Prep-planet.png',
  '/programs/Fatherhood-Prep.png': '/programs/Fatherhood-Prep-planet.png',
  '/programs/Couple-Program.svg': '/programs/Couple-Program-planet.png',
  '/programs/Couple-Program.png': '/programs/Couple-Program-planet.png',
  '/cala-orb.png': '/cala-planet-texture.png',
  '/cala-orb.svg': '/cala-planet-texture.png',
  '/cala-orb-new.svg': '/cala-planet-texture.png',
};

export default function CalaThreeGlobe({
  className = 'w-full h-full',
  mouseX,
  mouseY,
  isShocked = false,
  textureUrl = '/cala-planet-texture.png',
  interactive = true,
  showControls = true,
  title = '3D Globe Controls',
  defaultRadius = 1.8,
  defaultExposure = 1.1,
  defaultAtmosphereColor = '#38bdf8',
  defaultAuraColor = '#22d3ee',
  glowColor,
  auraColor,
  ...customProps
}: CalaThreeGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isShockedRef = useRef(isShocked);
  const [mounted, setMounted] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  // Normalize fallback colors
  const initialAtmosphereColor =
    customProps.atmosphereColor ||
    (typeof glowColor === 'string'
      ? glowColor
      : typeof glowColor === 'number'
      ? `#${glowColor.toString(16).padStart(6, '0')}`
      : defaultAtmosphereColor);

  const initialAuraColor =
    customProps.outerAuraColor ||
    (typeof auraColor === 'string'
      ? auraColor
      : typeof auraColor === 'number'
      ? `#${auraColor.toString(16).padStart(6, '0')}`
      : defaultAuraColor);

  const initKeyX = customProps.keyLightX ?? (customProps.keyLightPos ? customProps.keyLightPos[0] : 4.5);
  const initKeyY = customProps.keyLightY ?? (customProps.keyLightPos ? customProps.keyLightPos[1] : 3.5);
  const initKeyZ = customProps.keyLightZ ?? (customProps.keyLightPos ? customProps.keyLightPos[2] : 5.0);

  const initGlobeX = customProps.globePosX ?? (customProps.globePos ? customProps.globePos[0] : 0);
  const initGlobeY = customProps.globePosY ?? (customProps.globePos ? customProps.globePos[1] : 0);
  const initGlobeZ = customProps.globePosZ ?? (customProps.globePos ? customProps.globePos[2] : 0);

  const initCamX = customProps.cameraPosX ?? (customProps.cameraPos ? customProps.cameraPos[0] : 0);
  const initCamY = customProps.cameraPosY ?? (customProps.cameraPos ? customProps.cameraPos[1] : 0);

  const defaultGlobeValues = {
    globeRadius: customProps.globeRadius ?? defaultRadius,
    globePosX: initGlobeX,
    globePosY: initGlobeY,
    globePosZ: initGlobeZ,
    baseRotationSpeed: customProps.baseRotationSpeed ?? 0.35,
    autoRotate: customProps.autoRotate ?? true,
    axialTiltX: customProps.axialTiltX ?? 0.12,
    axialTiltZ: customProps.axialTiltZ ?? 0.38,
    axialTiltY: customProps.axialTiltY ?? 0.0,
    texturePreset: 'Current / Default',
    exposure: customProps.exposure ?? defaultExposure,
    keyLightIntensity: customProps.keyLightIntensity ?? 1.5,
    keyLightColor: customProps.keyLightColor ?? '#ffffff',
    keyLightX: initKeyX,
    keyLightY: initKeyY,
    keyLightZ: initKeyZ,
    ambientLightIntensity: customProps.ambientLightIntensity ?? 0.9,
    ambientLightColor: customProps.ambientLightColor ?? '#ffffff',
    materialRoughness: customProps.materialRoughness ?? 0.45,
    materialMetalness: customProps.materialMetalness ?? 0.05,
    atmosphereScale: customProps.atmosphereScale ?? 1.02,
    atmosphereColor: initialAtmosphereColor,
    atmosphereIntensity: customProps.atmosphereIntensity ?? 1.0,
    atmospherePower: customProps.atmospherePower ?? 2.8,
    atmosphereAlpha: customProps.atmosphereAlpha ?? 0.85,
    outerAuraScale: customProps.outerAuraScale ?? 1.12,
    outerAuraColor: initialAuraColor,
    outerAuraIntensity: customProps.outerAuraIntensity ?? 1.0,
    outerAuraPower: customProps.outerAuraPower ?? 3.2,
    outerAuraAlpha: customProps.outerAuraAlpha ?? 0.55,
    cameraFov: customProps.cameraFov ?? 40,
    cameraDistance: customProps.cameraDistance ?? 5.2,
    cameraPosX: initCamX,
    cameraPosY: initCamY,
    maxTilt: customProps.maxTilt ?? 0.22,
    tiltSmoothness: customProps.tiltSmoothness ?? 0.07,
    dragSensitivity: customProps.dragSensitivity ?? 0.007,
    inertiaDamping: customProps.inertiaDamping ?? 0.94,
    shockScale: 1.08,
    shockGlow: 1.6,
    manualShock: false,
  };

  // Comprehensive Leva Live Controls (only registered when ENABLE_DEV_CONTROLS is true)
  const controls = useControls(
    title,
    ENABLE_DEV_CONTROLS
      ? {
          'Planet Mesh & Position': folder(
            {
              globeRadius: { value: customProps.globeRadius ?? defaultRadius, min: 0.5, max: 4.0, step: 0.05, label: 'Radius' },
              globePosX: { value: initGlobeX, min: -3.0, max: 3.0, step: 0.05, label: 'Position X' },
              globePosY: { value: initGlobeY, min: -3.0, max: 3.0, step: 0.05, label: 'Position Y' },
              globePosZ: { value: initGlobeZ, min: -3.0, max: 3.0, step: 0.05, label: 'Position Z' },
              baseRotationSpeed: { value: customProps.baseRotationSpeed ?? 0.35, min: -2.0, max: 2.0, step: 0.01, label: 'Spin Speed' },
              autoRotate: { value: customProps.autoRotate ?? true, label: 'Auto Rotate' },
              axialTiltX: { value: customProps.axialTiltX ?? 0.12, min: -1.5, max: 1.5, step: 0.01, label: 'Tilt X (Pitch)' },
              axialTiltZ: { value: customProps.axialTiltZ ?? 0.38, min: -1.5, max: 1.5, step: 0.01, label: 'Tilt Z (Roll)' },
              axialTiltY: { value: customProps.axialTiltY ?? 0.0, min: -1.5, max: 1.5, step: 0.01, label: 'Tilt Y (Yaw)' },
              texturePreset: {
                value: 'Current / Default',
                options: Object.keys(PROGRAM_TEXTURE_MAP),
                label: 'Texture Preset',
              },
            },
            { collapsed: false }
          ),

          'Scene Lighting & Exposure': folder(
            {
              exposure: { value: customProps.exposure ?? defaultExposure, min: 0.2, max: 3.0, step: 0.05, label: 'Exposure' },
              keyLightIntensity: { value: customProps.keyLightIntensity ?? 1.5, min: 0, max: 5.0, step: 0.1, label: 'Key Light' },
              keyLightColor: { value: customProps.keyLightColor ?? '#ffffff', label: 'Key Light Color' },
              keyLightX: { value: initKeyX, min: -15, max: 15, step: 0.5, label: 'Light Pos X' },
              keyLightY: { value: initKeyY, min: -15, max: 15, step: 0.5, label: 'Light Pos Y' },
              keyLightZ: { value: initKeyZ, min: -15, max: 15, step: 0.5, label: 'Light Pos Z' },
              ambientLightIntensity: { value: customProps.ambientLightIntensity ?? 0.9, min: 0, max: 3.0, step: 0.05, label: 'Ambient Light' },
              ambientLightColor: { value: customProps.ambientLightColor ?? '#ffffff', label: 'Ambient Color' },
              materialRoughness: { value: customProps.materialRoughness ?? 0.45, min: 0, max: 1.0, step: 0.05, label: 'Globe Roughness' },
              materialMetalness: { value: customProps.materialMetalness ?? 0.05, min: 0, max: 1.0, step: 0.05, label: 'Globe Metalness' },
            },
            { collapsed: false }
          ),

          'Atmospheric Rim Glow (Inner)': folder(
            {
              atmosphereScale: { value: customProps.atmosphereScale ?? 1.02, min: 1.0, max: 1.25, step: 0.005, label: 'Limb Scale' },
              atmosphereColor: { value: initialAtmosphereColor, label: 'Glow Color' },
              atmosphereIntensity: { value: customProps.atmosphereIntensity ?? 1.0, min: 0, max: 5.0, step: 0.05, label: 'Intensity' },
              atmospherePower: { value: customProps.atmospherePower ?? 2.8, min: 0.5, max: 8.0, step: 0.1, label: 'Fresnel Exp' },
              atmosphereAlpha: { value: customProps.atmosphereAlpha ?? 0.85, min: 0, max: 1.0, step: 0.01, label: 'Opacity' },
            },
            { collapsed: false }
          ),

          'Space Aura (Outer Halo)': folder(
            {
              outerAuraScale: { value: customProps.outerAuraScale ?? 1.12, min: 1.0, max: 1.5, step: 0.005, label: 'Aura Scale' },
              outerAuraColor: { value: initialAuraColor, label: 'Aura Color' },
              outerAuraIntensity: { value: customProps.outerAuraIntensity ?? 1.0, min: 0, max: 5.0, step: 0.05, label: 'Intensity' },
              outerAuraPower: { value: customProps.outerAuraPower ?? 3.2, min: 0.5, max: 8.0, step: 0.1, label: 'Fresnel Exp' },
              outerAuraAlpha: { value: customProps.outerAuraAlpha ?? 0.55, min: 0, max: 1.0, step: 0.01, label: 'Opacity' },
            },
            { collapsed: true }
          ),

          'Camera Settings': folder(
            {
              cameraFov: { value: customProps.cameraFov ?? 40, min: 15, max: 90, step: 1, label: 'FOV' },
              cameraDistance: { value: customProps.cameraDistance ?? 5.2, min: 2.0, max: 15.0, step: 0.1, label: 'Distance Z' },
              cameraPosX: { value: initCamX, min: -4.0, max: 4.0, step: 0.1, label: 'Camera X' },
              cameraPosY: { value: initCamY, min: -4.0, max: 4.0, step: 0.1, label: 'Camera Y' },
            },
            { collapsed: true }
          ),

          'Interaction & Physics': folder(
            {
              maxTilt: { value: customProps.maxTilt ?? 0.22, min: 0, max: 0.8, step: 0.01, label: 'Mouse Tilt Max' },
              tiltSmoothness: { value: customProps.tiltSmoothness ?? 0.07, min: 0.01, max: 0.3, step: 0.01, label: 'Tilt Damping' },
              dragSensitivity: { value: customProps.dragSensitivity ?? 0.007, min: 0.001, max: 0.03, step: 0.001, label: 'Drag Sens' },
              inertiaDamping: { value: customProps.inertiaDamping ?? 0.94, min: 0.8, max: 0.99, step: 0.005, label: 'Inertia Friction' },
            },
            { collapsed: true }
          ),

          'Shock Reactions': folder(
            {
              shockScale: { value: 1.08, min: 1.0, max: 1.5, step: 0.01, label: 'Shock Scale' },
              shockGlow: { value: 1.6, min: 1.0, max: 3.5, step: 0.05, label: 'Shock Glow' },
              manualShock: { value: false, label: 'Test Shock' },
            },
            { collapsed: true }
          ),

          'Actions': folder(
            {
              'Copy 3D Config JSON': button(() => {
                const current = controlsRef.current;
                const config = {
                  globeRadius: current.globeRadius,
                  globePosX: current.globePosX,
                  globePosY: current.globePosY,
                  globePosZ: current.globePosZ,
                  baseRotationSpeed: current.baseRotationSpeed,
                  autoRotate: current.autoRotate,
                  axialTiltX: current.axialTiltX,
                  axialTiltZ: current.axialTiltZ,
                  axialTiltY: current.axialTiltY,
                  exposure: current.exposure,
                  keyLightIntensity: current.keyLightIntensity,
                  keyLightColor: current.keyLightColor,
                  keyLightPos: [current.keyLightX, current.keyLightY, current.keyLightZ],
                  ambientLightIntensity: current.ambientLightIntensity,
                  ambientLightColor: current.ambientLightColor,
                  materialRoughness: current.materialRoughness,
                  materialMetalness: current.materialMetalness,
                  atmosphereScale: current.atmosphereScale,
                  atmosphereColor: current.atmosphereColor,
                  atmosphereIntensity: current.atmosphereIntensity,
                  atmospherePower: current.atmospherePower,
                  atmosphereAlpha: current.atmosphereAlpha,
                  outerAuraScale: current.outerAuraScale,
                  outerAuraColor: current.outerAuraColor,
                  outerAuraIntensity: current.outerAuraIntensity,
                  outerAuraPower: current.outerAuraPower,
                  outerAuraAlpha: current.outerAuraAlpha,
                  cameraFov: current.cameraFov,
                  cameraDistance: current.cameraDistance,
                  cameraPosX: current.cameraPosX,
                  cameraPosY: current.cameraPosY,
                  maxTilt: current.maxTilt,
                  tiltSmoothness: current.tiltSmoothness,
                  dragSensitivity: current.dragSensitivity,
                  inertiaDamping: current.inertiaDamping,
                  shockScale: current.shockScale,
                  shockGlow: current.shockGlow,
                };
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                  alert('3D Globe Settings copied to clipboard!');
                }
              }),
              'Hide Controls Panel': button(() => {
                setIsPanelVisible(false);
              }),
            },
            { collapsed: true }
          ),
        }
      : {}
  );

  const activeControls = ENABLE_DEV_CONTROLS ? { ...defaultGlobeValues, ...controls } : defaultGlobeValues;
  const controlsRef = useRef(activeControls);
  useEffect(() => {
    controlsRef.current = activeControls;
  }, [activeControls]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    isShockedRef.current = isShocked;
  }, [isShocked]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resolvedTextureUrl =
      (textureUrl && PLANET_TEXTURE_LOOKUP[textureUrl]) ||
      textureUrl ||
      '/cala-planet-texture.png';

    const isMobileDevice =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || 'ontouchstart' in window);

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const initControls = controlsRef.current;
    const camera = new THREE.PerspectiveCamera(initControls.cameraFov, 1, 0.1, 50);
    camera.position.set(
      initControls.cameraPosX,
      initControls.cameraPosY,
      initControls.cameraDistance
    );

    // 3. Renderer with high-DPI and alpha transparency
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobileDevice,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      console.warn('CalaThreeGlobe: WebGL initialization failed', err);
      return;
    }

    const pixelRatio = isMobileDevice
      ? Math.min(window.devicePixelRatio || 1, 1.3)
      : Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = initControls.exposure;

    // 4. Directional Key Light & Ambient Lighting
    const keyLight = new THREE.DirectionalLight(
      initControls.keyLightColor,
      initControls.keyLightIntensity
    );
    keyLight.position.set(
      initControls.keyLightX,
      initControls.keyLightY,
      initControls.keyLightZ
    );
    scene.add(keyLight);

    const ambientLight = new THREE.AmbientLight(
      initControls.ambientLightColor,
      initControls.ambientLightIntensity
    );
    scene.add(ambientLight);

    // 5. 3D Planet Globe Model
    const BASE_RADIUS = 1.8;
    const sphereSegments = isMobileDevice ? 36 : 64;
    const sphereGeometry = new THREE.SphereGeometry(BASE_RADIUS, sphereSegments, sphereSegments);

    const initialTexture = globalTextureCache.get(resolvedTextureUrl) || getPlaceholderTexture();

    const planetMaterial = new THREE.MeshStandardMaterial({
      map: initialTexture,
      roughness: initControls.materialRoughness,
      metalness: initControls.materialMetalness,
    });

    const planetMesh = new THREE.Mesh(sphereGeometry, planetMaterial);
    const initialScale = initControls.globeRadius / BASE_RADIUS;
    planetMesh.scale.setScalar(initialScale);

    let isMounted = true;
    if (!globalTextureCache.has(resolvedTextureUrl)) {
      loadTextureCached(resolvedTextureUrl).then((loadedTex) => {
        if (!isMounted) return;
        planetMaterial.map = loadedTex;
        planetMaterial.needsUpdate = true;
      });
    }

    // 6. Atmospheric Fresnel Rim Glow (Glowing planetary limb / halo)
    const atmosphereGeometry = new THREE.SphereGeometry(BASE_RADIUS * 1.02, sphereSegments, sphereSegments);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 uGlowColor;
        uniform float uIntensity;
        uniform float uPower;
        uniform float uAlpha;
        void main() {
          float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float glow = pow(rim, uPower) * uIntensity;
          gl_FragColor = vec4(uGlowColor, glow * uAlpha);
        }
      `,
      uniforms: {
        uGlowColor: { value: new THREE.Color(initControls.atmosphereColor) },
        uIntensity: { value: initControls.atmosphereIntensity },
        uPower: { value: initControls.atmospherePower },
        uAlpha: { value: initControls.atmosphereAlpha },
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphereMesh.scale.setScalar(initialScale * (initControls.atmosphereScale / 1.02));

    // 7. Outer Atmospheric Space Aura
    const outerAuraGeometry = new THREE.SphereGeometry(BASE_RADIUS * 1.12, 48, 48);
    const outerAuraMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 uAuraColor;
        uniform float uIntensity;
        uniform float uPower;
        uniform float uAlpha;
        void main() {
          float rim = max(0.0, 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))));
          float glow = pow(rim, uPower) * uAlpha * uIntensity;
          gl_FragColor = vec4(uAuraColor, glow);
        }
      `,
      uniforms: {
        uAuraColor: { value: new THREE.Color(initControls.outerAuraColor) },
        uIntensity: { value: initControls.outerAuraIntensity },
        uPower: { value: initControls.outerAuraPower },
        uAlpha: { value: initControls.outerAuraAlpha },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const outerAuraMesh = new THREE.Mesh(outerAuraGeometry, outerAuraMaterial);
    outerAuraMesh.scale.setScalar(initialScale * (initControls.outerAuraScale / 1.12));

    // 8. Axial Tilt Group Hierarchy
    const axialTiltGroup = new THREE.Group();
    axialTiltGroup.rotation.z = initControls.axialTiltZ;
    axialTiltGroup.rotation.x = initControls.axialTiltX;
    axialTiltGroup.rotation.y = initControls.axialTiltY;
    axialTiltGroup.add(planetMesh);
    axialTiltGroup.add(atmosphereMesh);

    // Master Planet Group
    const orbGroup = new THREE.Group();
    orbGroup.position.set(initControls.globePosX, initControls.globePosY, initControls.globePosZ);
    orbGroup.add(axialTiltGroup);
    orbGroup.add(outerAuraMesh);
    scene.add(orbGroup);

    // 9. Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth || 360;
      const height = container.clientHeight || 360;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 10. Visibility detection & render throttling
    let isVisible = true;
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            isVisible = entry.isIntersecting;
          }
        },
        { rootMargin: '120px' }
      );
      observer.observe(container);
    }

    // 11. Animation, Planetary Physics & User Drag Controls
    let animationFrameId: number;
    const clock = new THREE.Clock();

    let currentSpinVelocity = 0;
    let pitchVelocity = 0;

    let curTiltX = 0;
    let curTiltY = 0;
    let curShockScale = 1.0;
    let curGlowIntensity = 1.0;

    let prevTiltX = initControls.axialTiltX;
    let currentTexturePreset = initControls.texturePreset;
    let activeAppliedUrl = resolvedTextureUrl;

    // Pointer tracking
    let localMouseX = 0;
    let localMouseY = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      try {
        container.setPointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      localMouseX = (e.clientX - cx) / (rect.width / 2);
      localMouseY = (e.clientY - cy) / (rect.height / 2);

      if (isDragging) {
        const dx = e.clientX - lastPointerX;
        const dy = e.clientY - lastPointerY;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;

        const dragSens = controlsRef.current.dragSensitivity;
        planetMesh.rotation.y += dx * dragSens;
        currentSpinVelocity = dx * dragSens;

        axialTiltGroup.rotation.x = Math.max(
          -0.5,
          Math.min(0.5, axialTiltGroup.rotation.x + dy * (dragSens * 0.57))
        );
        pitchVelocity = dy * (dragSens * 0.57);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerLeave = () => {
      if (!isDragging) {
        localMouseX = 0;
        localMouseY = 0;
      }
    };

    if (interactive) {
      container.addEventListener('pointerdown', onPointerDown);
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerup', onPointerUp);
      container.addEventListener('pointercancel', onPointerUp);
      container.addEventListener('pointerleave', onPointerLeave);
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible || container.offsetParent === null) {
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.1);
      const c = controlsRef.current;

      // 1. Live Camera Updates
      if (camera.fov !== c.cameraFov) {
        camera.fov = c.cameraFov;
        camera.updateProjectionMatrix();
      }
      camera.position.set(c.cameraPosX, c.cameraPosY, c.cameraDistance);

      // 2. Live Renderer Exposure & Lighting
      renderer.toneMappingExposure = c.exposure;

      keyLight.intensity = c.keyLightIntensity;
      keyLight.color.set(c.keyLightColor);
      keyLight.position.set(c.keyLightX, c.keyLightY, c.keyLightZ);

      ambientLight.intensity = c.ambientLightIntensity;
      ambientLight.color.set(c.ambientLightColor);

      planetMaterial.roughness = c.materialRoughness;
      planetMaterial.metalness = c.materialMetalness;

      // 3. Live Geometry Scaling & Position
      const radiusScale = c.globeRadius / BASE_RADIUS;
      planetMesh.scale.setScalar(radiusScale);
      atmosphereMesh.scale.setScalar(radiusScale * (c.atmosphereScale / 1.02));
      outerAuraMesh.scale.setScalar(radiusScale * (c.outerAuraScale / 1.12));

      // 4. Live Axial Tilt Roll, Pitch & Yaw
      if (prevTiltX !== c.axialTiltX) {
        axialTiltGroup.rotation.x = c.axialTiltX;
        prevTiltX = c.axialTiltX;
      }
      axialTiltGroup.rotation.z = c.axialTiltZ;
      axialTiltGroup.rotation.y = c.axialTiltY;

      // 5. Live Atmosphere Shader Uniforms
      atmosphereMaterial.uniforms.uGlowColor.value.set(c.atmosphereColor);
      atmosphereMaterial.uniforms.uPower.value = c.atmospherePower;
      atmosphereMaterial.uniforms.uAlpha.value = c.atmosphereAlpha;

      // 6. Live Outer Space Aura Shader Uniforms
      outerAuraMaterial.uniforms.uAuraColor.value.set(c.outerAuraColor);
      outerAuraMaterial.uniforms.uPower.value = c.outerAuraPower;
      outerAuraMaterial.uniforms.uAlpha.value = c.outerAuraAlpha;

      // 7. Live Texture Preset Swapping
      if (currentTexturePreset !== c.texturePreset) {
        currentTexturePreset = c.texturePreset;
        const targetUrl =
          c.texturePreset !== 'Current / Default' && PROGRAM_TEXTURE_MAP[c.texturePreset]
            ? PROGRAM_TEXTURE_MAP[c.texturePreset]
            : resolvedTextureUrl;

        if (targetUrl && targetUrl !== activeAppliedUrl) {
          activeAppliedUrl = targetUrl;
          loadTextureCached(targetUrl).then((tex) => {
            if (!isMounted) return;
            planetMaterial.map = tex;
            planetMaterial.needsUpdate = true;
          });
        }
      }

      // 8. Pointer / Motion Tracking
      let normX = localMouseX;
      let normY = localMouseY;

      if (mouseX && mouseY) {
        const mx = mouseX.get();
        const my = mouseY.get();
        if (mx !== 0 || my !== 0) {
          normX = Math.max(-1, Math.min(1, mx / 380));
          normY = Math.max(-1, Math.min(1, my / 380));
        }
      }

      // 9. Planetary Inertia & Auto Rotation
      if (!isDragging) {
        currentSpinVelocity *= c.inertiaDamping;
        pitchVelocity *= c.inertiaDamping;
        axialTiltGroup.rotation.x += pitchVelocity;

        const spinSpeed = c.autoRotate ? c.baseRotationSpeed : 0;
        planetMesh.rotation.y += (spinSpeed + currentSpinVelocity * 60) * delta;
      }

      // 10. Mouse Tilt Lerping
      const targetTiltY = normX * c.maxTilt;
      const targetTiltX = -normY * c.maxTilt;

      curTiltX += (targetTiltX - curTiltX) * c.tiltSmoothness;
      curTiltY += (targetTiltY - curTiltY) * c.tiltSmoothness;

      // 11. Shock & Pulse Dynamics
      const isShockActive = isShockedRef.current || c.manualShock;
      const targetShock = isShockActive ? c.shockScale : 1.0;
      const targetGlow = isShockActive ? c.shockGlow : 1.0;
      curShockScale += (targetShock - curShockScale) * 0.14;
      curGlowIntensity += (targetGlow - curGlowIntensity) * 0.12;

      atmosphereMaterial.uniforms.uIntensity.value = curGlowIntensity * c.atmosphereIntensity;
      outerAuraMaterial.uniforms.uIntensity.value = curGlowIntensity * c.outerAuraIntensity;

      orbGroup.position.set(c.globePosX, c.globePosY, c.globePosZ);
      orbGroup.rotation.x = curTiltX;
      orbGroup.rotation.y = curTiltY;
      orbGroup.scale.setScalar(curShockScale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (observer) {
        observer.disconnect();
      }
      if (interactive) {
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerup', onPointerUp);
        container.removeEventListener('pointercancel', onPointerUp);
        container.removeEventListener('pointerleave', onPointerLeave);
      }

      sphereGeometry.dispose();
      atmosphereGeometry.dispose();
      outerAuraGeometry.dispose();

      planetMaterial.dispose();
      atmosphereMaterial.dispose();
      outerAuraMaterial.dispose();

      renderer.dispose();
    };
  }, [textureUrl, mouseX, mouseY, interactive]);

  return (
    <>
      {mounted &&
        showControls &&
        typeof document !== 'undefined' &&
        (ENABLE_DEV_CONTROLS ? (
          createPortal(
            <div
              id="leva-portal-container"
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                zIndex: 9999999,
                pointerEvents: 'none',
              }}
            >
              <div style={{ pointerEvents: 'auto' }}>
                <Leva
                  isRoot
                  hidden={!isPanelVisible}
                  collapsed={false}
                  titleBar={{ title, drag: true }}
                />
                {!isPanelVisible && (
                  <button
                    type="button"
                    onClick={() => setIsPanelVisible(true)}
                    className="fixed top-4 right-4 z-[9999999] px-3.5 py-1.5 rounded-full bg-zinc-900/90 text-cyan-300 text-xs font-semibold shadow-xl border border-cyan-500/30 backdrop-blur-md hover:bg-zinc-800 transition-all flex items-center gap-1.5 cursor-pointer pointer-events-auto"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Open 3D Controls
                  </button>
                )}
              </div>
            </div>,
            document.body
          )
        ) : (
          <Leva isRoot hidden={true} />
        ))}

      <div
        ref={containerRef}
        className={`relative w-full h-full flex items-center justify-center select-none ${
          interactive ? 'cursor-grab active:cursor-grabbing touch-none' : 'pointer-events-none'
        } ${className}`}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </>
  );
}
