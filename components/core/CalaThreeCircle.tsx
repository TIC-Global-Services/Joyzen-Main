'use client';

import React from 'react';
import CalaThreeGlobe, { CalaThreeGlobeProps } from '@/components/shared/CalaThreeGlobe';
import { CORE_GLOBE_CONFIG } from './3dconfig';

/**
 * ============================================================================
 * CORE 3D GLOBE & LIGHTING
 * ============================================================================
 * Adjust Core's lighting, colors, position, roughness, camera, etc.:
 * in `./3dconfig.ts`!
 * ============================================================================
 */
export default function CalaThreeCircle(props: CalaThreeGlobeProps) {
  return (
    <CalaThreeGlobe
      {...CORE_GLOBE_CONFIG}
      {...props}
    />
  );
}
