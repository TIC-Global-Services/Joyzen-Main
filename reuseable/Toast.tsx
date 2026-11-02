'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToastProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  message: string | null;
  onClose: () => void;
  duration?: number; // ms before auto-dismiss, defaults to 6000
}

export default function Toast({
  type = 'error',
  title,
  message,
  onClose,
  duration = 6000,
}: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  const defaultTitle =
    type === 'error'
      ? 'Submission Error'
      : type === 'success'
      ? 'Success'
      : type === 'warning'
      ? 'Notice'
      : 'Information';

  return (
    <div className="fixed top-6 right-4 sm:right-8 z-[9999] max-w-sm sm:max-w-md w-[calc(100%-2rem)] pointer-events-none">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.12),0_8px_20px_rgba(0,0,0,0.06)] backdrop-blur-2xl transition-all ${
              type === 'error'
                ? 'border-red-200/90 bg-white/95 text-zinc-900'
                : type === 'success'
                ? 'border-emerald-200/90 bg-white/95 text-zinc-900'
                : 'border-zinc-200/90 bg-white/95 text-zinc-900'
            }`}
          >
            {/* Top gradient edge glow */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                type === 'error'
                  ? 'bg-gradient-to-r from-red-500 via-rose-400 to-orange-400'
                  : type === 'success'
                  ? 'bg-gradient-to-r from-emerald-500 via-[#AEDEE4] to-[#036132]'
                  : 'bg-gradient-to-r from-[#AEDEE4] to-[#EF8F60]'
              }`}
            />

            <div className="flex items-start gap-3.5">
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                  type === 'error'
                    ? 'bg-red-50 text-red-600 border border-red-100'
                    : type === 'success'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-zinc-50 text-zinc-600 border border-zinc-100'
                }`}
              >
                {type === 'error' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                ) : type === 'success' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-sm font-bold text-zinc-900 tracking-tight">
                  {title || defaultTitle}
                </h4>
                <p className="text-xs sm:text-[13px] text-zinc-600 font-medium leading-relaxed mt-1 break-words">
                  {message}
                </p>
              </div>

              {/* Dismiss button */}
              <button
                type="button"
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-800 transition-colors p-1 -mr-1 -mt-1 rounded-lg hover:bg-zinc-100 cursor-pointer"
                aria-label="Dismiss notification"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Time remaining progress indicator */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              className={`absolute bottom-0 left-0 h-0.5 opacity-60 ${
                type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-emerald-500' : 'bg-zinc-400'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
