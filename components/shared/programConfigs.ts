/**
 * ============================================================================
 * JOYZEN 3D & SCROLL SEQUENCE CONFIGURATIONS (Interfaces & Shared Types)
 * ============================================================================
 * The interfaces are defined below.
 * Each program maintains its own independent configuration in its respected folder:
 *  - components/cala/3dconfig.ts
 *  - components/luna/3dconfig.ts
 *  - components/atlas/3dconfig.ts
 *  - components/core/3dconfig.ts
 *  - components/eve/3dconfig.ts
 *  - components/eve-genesis/3dconfig.ts
 *  - components/genesis/3dconfig.ts
 *  - components/lyra/3dconfig.ts
 *  - components/vita/3dconfig.ts
 * ============================================================================
/**
 * ============================================================================
 * GLOBAL DEVELOPER 3D & SCROLL SEQUENCE CONTROLS SWITCH
 * ============================================================================
 * Set to `true` whenever you want to display the live Leva controls panel on
 * any page to tweak lighting, 3D planet positions, camera, and scroll zooms.
 * Set to `false` to completely hide and remove all developer controls across
 * the entire website.
 * ============================================================================
 */
export const ENABLE_DEV_CONTROLS = false;

export interface Globe3DConfig {
  title?: string;
  textureUrl?: string;

  // --- 1. Scene Lighting & Exposure ---
  exposure?: number;               // ACESFilmic exposure (default 1.1)
  keyLightIntensity?: number;      // Directional main light brightness (default 1.5)
  keyLightColor?: string;          // Hex color of directional light ('#ffffff')
  keyLightX?: number;              // Light Position X (default 4.5)
  keyLightY?: number;              // Light Position Y (default 3.5)
  keyLightZ?: number;              // Light Position Z (default 5.0)
  keyLightPos?: [number, number, number]; // Shorthand [x, y, z]
  ambientLightIntensity?: number;  // Soft omnidirectional fill light (default 0.9)
  ambientLightColor?: string;      // Color of ambient light ('#ffffff')

  // --- 2. Planet Mesh & Material ---
  globeRadius?: number;            // Radius of 3D globe (default 1.8)
  globePosX?: number;              // 3D Position X (default 0)
  globePosY?: number;              // 3D Position Y (default 0)
  globePosZ?: number;              // 3D Position Z (default 0)
  globePos?: [number, number, number]; // Shorthand [x, y, z]
  baseRotationSpeed?: number;      // Spin speed (default 0.35)
  autoRotate?: boolean;            // Auto rotation toggle (default true)
  axialTiltX?: number;             // Axial pitch tilt in radians (default 0.12)
  axialTiltZ?: number;             // Axial roll tilt in radians (default 0.38)
  axialTiltY?: number;             // Axial yaw tilt in radians (default 0.0)
  materialRoughness?: number;      // Surface roughness 0.0 (mirror) to 1.0 (matte) (default 0.45)
  materialMetalness?: number;      // Metallic reflection 0.0 to 1.0 (default 0.05)

  // --- 3. Atmospheric Rim Glow (Inner Limb) ---
  atmosphereColor?: string;        // Limb glow color
  atmosphereScale?: number;        // Limb sphere scale (default 1.02)
  atmosphereIntensity?: number;    // Limb brightness multiplier (default 1.0)
  atmospherePower?: number;        // Fresnel sharpness falloff (default 2.8)
  atmosphereAlpha?: number;        // Limb opacity (default 0.85)

  // --- 4. Outer Space Aura (Soft Halo) ---
  outerAuraColor?: string;         // Outer halo color
  outerAuraScale?: number;         // Outer halo scale (default 1.12)
  outerAuraIntensity?: number;     // Outer halo brightness multiplier (default 1.0)
  outerAuraPower?: number;         // Outer halo Fresnel falloff (default 3.2)
  outerAuraAlpha?: number;         // Outer halo opacity (default 0.55)

  // --- 5. Camera Settings ---
  cameraFov?: number;              // Camera field of view (default 40)
  cameraDistance?: number;         // Camera Z distance (default 5.2)
  cameraPosX?: number;             // Camera X offset (default 0)
  cameraPosY?: number;             // Camera Y offset (default 0)
  cameraPos?: [number, number];    // Shorthand [x, y]

  // --- 6. Interaction & Drag Physics ---
  maxTilt?: number;                // Max mouse cursor tilt (default 0.22)
  tiltSmoothness?: number;         // Damping factor (default 0.07)
  dragSensitivity?: number;        // Pointer drag rotation speed (default 0.007)
  inertiaDamping?: number;         // Spin friction after drag release (default 0.94)
  shockScale?: number;             // Pill collision shock scale (default 1.08)
  shockGlow?: number;              // Pill collision shock glow (default 1.6)
}

export interface ScrollSequenceConfig {
  // Hero 3D Orb Staging
  heroOrbScale?: number;           // Initial hero orb scale (default 1.0)
  heroOrbOffsetX?: number;         // Hero offset X in px (default 0)
  heroOrbOffsetY?: number;         // Hero offset Y in px (default 0)

  // Scroll Phase 3D Zooms (GSAP)
  zoomPhaseScale?: number;         // Desktop zoom scale in Phase 8 (default 15.0)
  mobileZoomScale?: number;        // Mobile zoom scale in Phase 8 (default 6.5)
  phase11Scale?: number;           // Phase 11 ceiling orb scale (default 9.5)
  phase11Top?: number;             // Phase 11 ceiling top % (default -15)
  phase12Scale?: number;           // Phase 12 mid scale (default 6.0)
  phase12Top?: number;             // Phase 12 mid top % (default 10)
  phase13Scale?: number;           // Phase 13 pills sequence orb scale (default 3.2)
  finalOrbScale?: number;          // Phase 14+ settle scale (default 3.2)
  finalOrbTop?: number;            // Phase 13+ settle top % (default 50)

  // Glass Optics & Refraction (AdaptiveGlass)
  glassBlur?: number;              // Backdrop blur (default 2.0)
  glassContrast?: number;          // Contrast (default 1.15)
  glassBrightness?: number;        // Brightness (default 1.05)
  glassSaturation?: number;        // Saturation (default 1.2)
  glassDisplacement?: number;      // Liquid glass displacement (default 1.2)
  glassElasticity?: number;        // Liquid glass elasticity (default 0.5)
  glassShadowIntensity?: number;   // Glass shadow intensity (default 0.12)
}

// Re-exports of named configs from each respected program folder
export { CALA_GLOBE_CONFIG, CALA_SEQUENCE_CONFIG } from '@/components/cala/3dconfig';
export { LUNA_GLOBE_CONFIG, LUNA_SEQUENCE_CONFIG } from '@/components/luna/3dconfig';
export { ATLAS_GLOBE_CONFIG, ATLAS_SEQUENCE_CONFIG } from '@/components/atlas/3dconfig';
export { CORE_GLOBE_CONFIG, CORE_SEQUENCE_CONFIG } from '@/components/core/3dconfig';
export { EVE_GLOBE_CONFIG, EVE_SEQUENCE_CONFIG } from '@/components/eve/3dconfig';
export { EVE_GENESIS_GLOBE_CONFIG, EVE_GENESIS_SEQUENCE_CONFIG } from '@/components/eve-genesis/3dconfig';
export { GENESIS_GLOBE_CONFIG, GENESIS_SEQUENCE_CONFIG } from '@/components/genesis/3dconfig';
export { LYRA_GLOBE_CONFIG, LYRA_SEQUENCE_CONFIG } from '@/components/lyra/3dconfig';
export { VITA_GLOBE_CONFIG, VITA_SEQUENCE_CONFIG } from '@/components/vita/3dconfig';
