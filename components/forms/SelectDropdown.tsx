'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronIcon, CloseIcon, FIELD_SHELL } from './ui';

export interface Option {
  value: string;
  label: string;
}

export const toOptions = (list: readonly string[]): Option[] =>
  list.map((v) => ({ value: v, label: v }));

interface SelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  ariaLabel: string;
  /** Text shown before the selected value, e.g. "Gender: " */
  prefix?: string;
  /** What the trigger shows for the selected value (defaults to the option label). */
  triggerLabel?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Lets the user use their typed text when nothing matches. */
  allowCustom?: boolean;
  /** Shows an X button, and clicking the selected item again clears it. */
  clearable?: boolean;
  /** Max rows rendered at once. Keeps huge lists (cities) fast. */
  maxVisible?: number;
  className?: string;
  triggerClassName?: string;
}

export default function SelectDropdown({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
  prefix = '',
  triggerLabel,
  searchable = false,
  searchPlaceholder = 'Search...',
  allowCustom = false,
  clearable = true,
  maxVisible = 100,
  className = '',
  triggerClassName = 'px-5',
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Listeners exist only while the dropdown is open.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const visible = filtered.slice(0, maxVisible);
  const hiddenCount = filtered.length - visible.length;
  const selected = options.find((o) => o.value === value);
  const display = triggerLabel ?? selected?.label ?? value;

  const choose = (next: string) => {
    onChange(clearable && next === value ? '' : next);
    setOpen(false);
  };

  const toggle = () => {
    setQuery('');
    setOpen((o) => !o);
  };

  return (
    <div ref={rootRef} className={`relative ${open ? 'z-[100]' : ''} ${className}`}>
      <div className={FIELD_SHELL}>
        <div className="flex items-center">
          <button
            type="button"
            aria-label={ariaLabel}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            onClick={toggle}
            className={`flex-1 min-w-0 py-4 text-left text-sm sm:text-base font-medium rounded-[28px] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#95C1E2] ${triggerClassName}`}
          >
            <span className={`block truncate ${value ? 'text-zinc-900 font-semibold' : 'text-zinc-500'}`}>
              {value ? `${prefix}${display}` : placeholder}
            </span>
          </button>

          {clearable && value && (
            <button
              type="button"
              aria-label={`Clear ${ariaLabel.toLowerCase()}`}
              onClick={() => onChange('')}
              className="p-1 rounded-full text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/60 transition-colors cursor-pointer"
            >
              <CloseIcon />
            </button>
          )}

          <span className="pl-1 pr-4 text-zinc-500 pointer-events-none">
            <ChevronIcon open={open} />
          </span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="absolute left-0 right-0 top-full mt-1.5 z-[999] p-2 rounded-2xl border border-zinc-200/80 bg-white shadow-2xl origin-top flex flex-col"
          >
            {searchable && (
              <div className="p-1 pb-2 border-b border-zinc-100">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  autoFocus
                  className="w-full px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg outline-none text-zinc-800 placeholder:text-zinc-500 focus:border-[#95C1E2]"
                />
              </div>
            )}

            <div
              id={listId}
              role="listbox"
              aria-label={ariaLabel}
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              className="max-h-48 overflow-y-auto overscroll-contain space-y-1 pt-1 pr-1"
            >
              {visible.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => choose(opt.value)}
                    className={`w-full text-left text-xs sm:text-sm py-2 px-3 rounded-xl cursor-pointer transition-colors truncate ${
                      isSelected
                        ? 'font-bold text-zinc-900 bg-zinc-100'
                        : 'font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}

              {hiddenCount > 0 && (
                <p className="px-3 py-2 text-[11px] text-zinc-500 text-center">
                  {hiddenCount} more. Type to narrow the list.
                </p>
              )}

              {filtered.length === 0 &&
                (allowCustom && query.trim() ? (
                  <button
                    type="button"
                    onClick={() => choose(query.trim())}
                    className="w-full p-2 text-xs text-zinc-600 hover:bg-zinc-50 cursor-pointer rounded-lg text-center"
                  >
                    Use custom: &quot;{query.trim()}&quot;
                  </button>
                ) : (
                  <p className="p-2 text-xs text-zinc-500 text-center">No results</p>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
