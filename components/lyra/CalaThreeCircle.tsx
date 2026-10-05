'use client';

import React from 'react';
import CalaThreeGlobe, { CalaThreeGlobeProps } from '@/components/shared/CalaThreeGlobe';
import { LYRA_GLOBE_CONFIG } from './3dconfig';

/**
 * ============================================================================
 * LYRA 3D GLOBE & LIGHTING
 * ============================================================================
 * Adjust Lyra's lighting, colors, position, roughness, camera, etc.:
 * in `./3dconfig.ts`!
 * ============================================================================
 */
export default function CalaThreeCircle(props: CalaThreeGlobeProps) {
  return (
    <CalaThreeGlobe
      {...LYRA_GLOBE_CONFIG}
      {...props}
    />
  );
}
