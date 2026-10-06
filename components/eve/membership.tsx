'use client';

import React from 'react';
import ProgramMembership, { type ProgramMembershipProps } from '@/reuseable/ProgramMembership';
import { PROGRAM_MEMBERSHIP_DATA } from '@/reuseable/programMembershipData';

export default function CalaMembership(props: Partial<ProgramMembershipProps>) {
  return (
    <ProgramMembership
      data={PROGRAM_MEMBERSHIP_DATA.eve}
      {...props}
    />
  );
}