'use client';

import React from 'react';
import CalaThreeGlobe, { CalaThreeGlobeProps } from '@/components/shared/CalaThreeGlobe';
import { ATLAS_GLOBE_CONFIG } from './3dconfig';

/**
 * ============================================================================
 * ATLAS 3D GLOBE & LIGHTING
 * ============================================================================
 * Adjust Atlas's lighting, colors, position, roughness, camera, etc.:
 * in `./3dconfig.ts`!
 * ============================================================================
 */
export default function CalaThreeCircle(props: CalaThreeGlobeProps) {
  return (
    <CalaThreeGlobe
      {...ATLAS_GLOBE_CONFIG}
      {...props}
    />
  );
}
