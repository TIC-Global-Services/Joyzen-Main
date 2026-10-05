'use client';

import { useControls, folder, button } from 'leva';
import { ENABLE_DEV_CONTROLS } from './programConfigs';

export interface ScrollSequenceControls {
  // Hero 3D Orb Staging
  heroOrbScale: number;
  heroOrbOffsetX: number;
  heroOrbOffsetY: number;

  // Scroll Phase 3D Zooms (GSAP)
  zoomPhaseScale: number;
  mobileZoomScale: number;
  phase11Scale: number;
  phase11Top: number;
  phase12Scale: number;
  phase12Top: number;
  finalOrbScale: number;
  finalOrbTop: number;

  // Glass Optics & Refraction
  glassBlur: number;
  glassContrast: number;
  glassBrightness: number;
  glassSaturation: number;
  glassDisplacement: number;
  glassElasticity: number;
  glassShadowIntensity: number;
}

export function useScrollSequenceControls(
  sequenceName = 'CALA',
  customDefaults?: Partial<ScrollSequenceControls>
): ScrollSequenceControls {
  const d: ScrollSequenceControls = {
    heroOrbScale: 1.0,
    heroOrbOffsetX: 0,
    heroOrbOffsetY: 0,
    zoomPhaseScale: 15.0,
    mobileZoomScale: 6.5,
    phase11Scale: 9.5,
    phase11Top: -15,
    phase12Scale: 6.0,
    phase12Top: 10,
    finalOrbScale: 3.2,
    finalOrbTop: 50,
    glassBlur: 2.0,
    glassContrast: 1.15,
    glassBrightness: 1.05,
    glassSaturation: 1.2,
    glassDisplacement: 1.2,
    glassElasticity: 0.5,
    glassShadowIntensity: 0.12,
    ...customDefaults,
  };

  const controls = useControls(
    `${sequenceName} Scroll 3D Sequence`,
    ENABLE_DEV_CONTROLS
      ? {
          'Hero 3D Orb Staging': folder(
            {
              heroOrbScale: { value: d.heroOrbScale, min: 0.5, max: 2.5, step: 0.05, label: 'Hero Scale' },
              heroOrbOffsetX: { value: d.heroOrbOffsetX, min: -300, max: 300, step: 5, label: 'Hero Offset X (px)' },
              heroOrbOffsetY: { value: d.heroOrbOffsetY, min: -300, max: 300, step: 5, label: 'Hero Offset Y (px)' },
            },
            { collapsed: false }
          ),

          'Scroll Phase 3D Zooms (GSAP)': folder(
            {
              zoomPhaseScale: { value: d.zoomPhaseScale, min: 4.0, max: 35.0, step: 0.5, label: 'Desktop Zoom (P8)' },
              mobileZoomScale: { value: d.mobileZoomScale, min: 2.0, max: 15.0, step: 0.5, label: 'Mobile Zoom (P8)' },
              phase11Scale: { value: d.phase11Scale, min: 3.0, max: 20.0, step: 0.5, label: 'Ceiling Scale (P11)' },
              phase11Top: { value: d.phase11Top, min: -60, max: 25, step: 1, label: 'Ceiling Top % (P11)' },
              phase12Scale: { value: d.phase12Scale, min: 2.0, max: 15.0, step: 0.5, label: 'Mid Scale (P12)' },
              phase12Top: { value: d.phase12Top, min: -25, max: 40, step: 1, label: 'Mid Top % (P12)' },
              finalOrbScale: { value: d.finalOrbScale, min: 1.0, max: 8.0, step: 0.1, label: 'Final Scale (P13+)' },
              finalOrbTop: { value: d.finalOrbTop, min: 15, max: 80, step: 1, label: 'Final Top % (P13+)' },
            },
            { collapsed: false }
          ),

          'Glass Optics & Refraction': folder(
            {
              glassBlur: { value: d.glassBlur, min: 0, max: 12, step: 0.5, label: 'Glass Blur (px)' },
              glassContrast: { value: d.glassContrast, min: 0.8, max: 2.0, step: 0.05, label: 'Contrast' },
              glassBrightness: { value: d.glassBrightness, min: 0.8, max: 2.0, step: 0.05, label: 'Brightness' },
              glassSaturation: { value: d.glassSaturation, min: 0.5, max: 2.5, step: 0.05, label: 'Saturation' },
              glassDisplacement: { value: d.glassDisplacement, min: 0, max: 3.0, step: 0.1, label: 'Displacement' },
              glassElasticity: { value: d.glassElasticity, min: 0, max: 2.0, step: 0.05, label: 'Elasticity' },
              glassShadowIntensity: { value: d.glassShadowIntensity, min: 0, max: 0.5, step: 0.02, label: 'Shadow' },
            },
            { collapsed: true }
          ),

          'Actions': folder(
            {
              'Copy Sequence Settings': button(() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(JSON.stringify(controls, null, 2));
                  alert(`${sequenceName} Scroll 3D Sequence Settings copied to clipboard!`);
                }
              }),
            },
            { collapsed: true }
          ),
        }
      : {}
  );

  return ENABLE_DEV_CONTROLS ? (controls as unknown as ScrollSequenceControls) : d;
}
