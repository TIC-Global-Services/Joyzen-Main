'use client';

import React from 'react';
import CalaThreeGlobe, { CalaThreeGlobeProps } from '@/components/shared/CalaThreeGlobe';
import { LUNA_GLOBE_CONFIG } from './3dconfig';

/**
 * ============================================================================
 * LUNA 3D GLOBE & LIGHTING
 * ============================================================================
 * Adjust Luna's lighting, colors, position, roughness, camera, etc.:
 * in `./3dconfig.ts`!
 * ============================================================================
 */
export default function CalaThreeCircle(props: CalaThreeGlobeProps) {
  return (
    <CalaThreeGlobe
      {...LUNA_GLOBE_CONFIG}
      {...props}
    />
  );
}
