'use client';

import React from 'react';
import CalaThreeGlobe, { CalaThreeGlobeProps } from '@/components/shared/CalaThreeGlobe';
import { GENESIS_GLOBE_CONFIG } from './3dconfig';

/**
 * ============================================================================
 * GENESIS 3D GLOBE & LIGHTING
 * ============================================================================
 * Adjust Genesis's lighting, colors, position, roughness, camera, etc.:
 * in `./3dconfig.ts`!
 * ============================================================================
 */
export default function CalaThreeCircle(props: CalaThreeGlobeProps) {
  return (
    <CalaThreeGlobe
      {...GENESIS_GLOBE_CONFIG}
      {...props}
    />
  );
}
