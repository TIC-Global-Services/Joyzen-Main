import React from 'react';

// Shared field styling. No backdrop-blur here on purpose: it is very
// expensive to paint, and on a bg-white/40 field it adds almost nothing.
export const FIELD_SHELL =
  'relative rounded-[28px] bg-white/40 border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] transition-colors';

export const FIELD_FOCUS = 'focus-within:border-[#95C1E2]';

export const INPUT_CLASS =
  'w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]';

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs font-medium text-red-600 mt-1 pl-4">
      {message}
    </p>
  );
}

export function ChevronIcon({ open = false }: { open?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export function CloseIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
