'use client';

import React from 'react';
import CalaThreeGlobe, { CalaThreeGlobeProps } from '@/components/shared/CalaThreeGlobe';
import { CALA_GLOBE_CONFIG } from './3dconfig';

/**
 * ============================================================================
 * CALA 3D GLOBE & LIGHTING
 * ============================================================================
 * Adjust Cala's lighting, colors, position, roughness, camera, etc.:
 * in `./3dconfig.ts`!
 * ============================================================================
 */
export default function CalaThreeCircle(props: CalaThreeGlobeProps) {
  return (
    <CalaThreeGlobe
      {...CALA_GLOBE_CONFIG}
      {...props}
    />
  );
}
