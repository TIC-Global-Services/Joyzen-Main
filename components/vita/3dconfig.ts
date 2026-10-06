import type { Globe3DConfig, ScrollSequenceConfig } from '@/components/shared/programConfigs';

export const VITA_GLOBE_CONFIG: Globe3DConfig = {
  title: 'VITA 3D Globe',
  textureUrl: '/programs/Natural-Conception-planet.webp',

  // --- 1. Scene Lighting & Exposure ---
  exposure: 1.1,
  keyLightIntensity: 1.5,
  keyLightColor: '#ffffff',
  keyLightPos: [4.5, 3.5, 5.0],
  ambientLightIntensity: 0.9,
  ambientLightColor: '#ffffff',

  // --- 2. Planet Mesh & Material ---
  globeRadius: 1.8,
  globePos: [0, 0, 0],
  baseRotationSpeed: 0.35,
  autoRotate: true,
  axialTiltX: 0.12,
  axialTiltZ: 0.38,
  axialTiltY: 0.0,
  materialRoughness: 0.45,
  materialMetalness: 0.05,

  // --- 3. Atmospheric Rim Glow (Inner Limb) ---
  atmosphereColor: '#34d399',
  atmosphereScale: 1.02,
  atmosphereIntensity: 1.0,
  atmospherePower: 2.8,
  atmosphereAlpha: 0.85,

  // --- 4. Outer Space Aura (Soft Halo) ---
  outerAuraColor: '#6ee7b7',
  outerAuraScale: 1.12,
  outerAuraIntensity: 1.0,
  outerAuraPower: 3.2,
  outerAuraAlpha: 0.55,

  // --- 5. Camera Settings ---
  cameraFov: 40,
  cameraDistance: 5.2,
};

export const VITA_SEQUENCE_CONFIG: ScrollSequenceConfig = {
  // Hero Staging
  heroOrbScale: 1.0,
  heroOrbOffsetX: 0,
  heroOrbOffsetY: 0,

  // Scroll Phase 3D Zooms (GSAP)
  zoomPhaseScale: 15.0,
  mobileZoomScale: 6.5,
  phase11Scale: 9.5,
  phase11Top: -15,
  phase12Scale: 6.0,
  phase12Top: 10,
  finalOrbScale: 4.2,
  finalOrbTop: 50,

  // Glass Optics & Refraction (AdaptiveGlass)
  glassBlur: 2.0,
  glassContrast: 1.15,
  glassBrightness: 1.05,
  glassSaturation: 1.2,
  glassDisplacement: 1.2,
  glassElasticity: 0.5,
  glassShadowIntensity: 0.12,
};

export const GLOBE_CONFIG = VITA_GLOBE_CONFIG;
export const SEQUENCE_CONFIG = VITA_SEQUENCE_CONFIG;
