'use client';

import React from 'react';
import CalaThreeGlobe, { CalaThreeGlobeProps } from '@/components/shared/CalaThreeGlobe';
import { VITA_GLOBE_CONFIG } from './3dconfig';

/**
 * ============================================================================
 * VITA 3D GLOBE & LIGHTING
 * ============================================================================
 * Adjust Vita's lighting, colors, position, roughness, camera, etc.:
 * in `./3dconfig.ts`!
 * ============================================================================
 */
export default function CalaThreeCircle(props: CalaThreeGlobeProps) {
  return (
    <CalaThreeGlobe
      {...VITA_GLOBE_CONFIG}
      {...props}
    />
  );
}
