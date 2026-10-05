'use client';

import React from 'react';
import CalaThreeGlobe, { CalaThreeGlobeProps } from '@/components/shared/CalaThreeGlobe';
import { EVE_GENESIS_GLOBE_CONFIG } from './3dconfig';

/**
 * ============================================================================
 * EVE & GENESIS 3D GLOBE & LIGHTING
 * ============================================================================
 * Adjust Eve & Genesis's lighting, colors, position, roughness, camera, etc.:
 * in `./3dconfig.ts`!
 * ============================================================================
 */
export default function CalaThreeCircle(props: CalaThreeGlobeProps) {
  return (
    <CalaThreeGlobe
      {...EVE_GENESIS_GLOBE_CONFIG}
      {...props}
    />
  );
}
