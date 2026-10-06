'use client';

import React from 'react';
import CalaThreeGlobe, { CalaThreeGlobeProps } from '@/components/shared/CalaThreeGlobe';
import { CALA_GLOBE_CONFIG } from './3dconfig';


export default function CalaThreeCircle(props: CalaThreeGlobeProps) {
  return (
    <CalaThreeGlobe
      {...CALA_GLOBE_CONFIG}
      {...props}
    />
  );
}
