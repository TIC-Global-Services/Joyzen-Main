"use client";

import React from "react";
import { GlobePulse } from "./globeV2";

export { GlobePulse } from "./globeV2";

export default function GlobePulseDemo({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center w-full h-full overflow-hidden select-none ${className}`}
    >
      <div className="relative w-full max-w-[580px] sm:max-w-[620px] md:max-w-[680px] lg:max-w-[720px] aspect-square flex items-center justify-center">
        <GlobePulse className="w-full h-full" />
      </div>
    </div>
  );
}
