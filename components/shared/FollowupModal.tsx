'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SpecularButton from '@/reuseable/specularButton';
import { createFollowup, formatApiError } from '@/lib/joyzenApi';

// ----------------------------------------------------------------------
// Types & Context
// ----------------------------------------------------------------------
export interface OpenFollowupOptions {
  programName?: string;
  defaultConcern?: string;
}

interface FollowupModalContextType {
  isOpen: boolean;
  openModal: (options?: OpenFollowupOptions) => void;
  closeModal: () => void;
  programName?: string;
}

const FollowupModalContext = createContext<FollowupModalContextType | null>(null);

export function useFollowupModal() {
  return useContext(FollowupModalContext);
}

// ----------------------------------------------------------------------
// Default Concerns per Program
// ----------------------------------------------------------------------
const PROGRAM_CONCERN_MAP: Record<string, string> = {
  CALA: 'Want to know about PCOS plans',
  LUNA: 'Want to know about Teen Health plans',
  LYRA: 'Want to know about Women’s Health & Cycle Balance plans',
  EVE: 'Want to know about Pregnancy Preparation plans',
  CORE: 'Want to know about Pelvic Health & Energy plans',
  ATLAS: 'Want to know about Male Fertility & Hormone Restoration plans',
  GENESIS: 'Want to know about Fatherhood Preparation plans',
  VITA: 'Want to know about Natural Conception plans',
  'EVE-GENESIS': 'Want to know about Couple Conception plans',
};

// ----------------------------------------------------------------------
// Quick Time Slots (IST standard clinic hours)
// ----------------------------------------------------------------------
const QUICK_TIME_SLOTS = [
  { label: '10:00 AM', time: '10:00' },
  { label: '10:30 AM', time: '10:30' },
  { label: '12:00 PM', time: '12:00' },
  { label: '02:30 PM', time: '14:30' },
  { label: '04:30 PM', time: '16:30' },
  { label: '06:00 PM', time: '18:00' },
];

export interface FollowupModalProps {
  isOpen: boolean;
  onClose: () => void;
  programName?: string;
  defaultConcern?: string;
}

export function FollowupModal({
  isOpen,
  onClose,
  programName = 'CALA',
  defaultConcern,
}: FollowupModalProps) {
  const router = useRouter();

  // Storage State
  const [leadId, setLeadId] = useState<string | null>(null);
  const [concern, setConcern] = useState<string>('');

  // Scheduling State
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('10:30');

  // Request State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ id: string; followupAt: string } | null>(null);

  // Initialize initial date to tomorrow or next valid day
  const minDateStr = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const defaultTomorrowStr = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }, []);

  // When modal opens, populate leadId and concern from sessionStorage
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessData(null);

      // 1. Lead ID
      const storedLeadId =
        typeof window !== 'undefined' ? sessionStorage.getItem('joyzen_lead_id') : null;
      setLeadId(storedLeadId);

      // 2. Concern / clear_health_description
      const storedConcern =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('joyzen_clear_health_description') ||
            sessionStorage.getItem('joyzen_lead_concern')
          : null;

      const programKeyUpper = (programName || 'CALA').toUpperCase();
      const fallbackConcern =
        defaultConcern ||
        PROGRAM_CONCERN_MAP[programKeyUpper] ||
        `Want to know about ${programName} plans`;

      setConcern(storedConcern || fallbackConcern);

      // 3. Default Date
      if (!selectedDate) {
        setSelectedDate(defaultTomorrowStr);
      }
    }
  }, [isOpen, programName, defaultConcern, defaultTomorrowStr, selectedDate]);

  // Compute UTC ISO string and formatted local preview
  const { utcString, localPreviewStr, isValidDateTime } = useMemo(() => {
    if (!selectedDate || !selectedTime) {
      return { utcString: '', localPreviewStr: '', isValidDateTime: false };
    }

    try {
      const combined = new Date(`${selectedDate}T${selectedTime}:00`);
      if (isNaN(combined.getTime())) {
        return { utcString: '', localPreviewStr: '', isValidDateTime: false };
      }

      const utc = combined.toISOString();
      const localFormatted = combined.toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      return {
        utcString: utc,
        localPreviewStr: localFormatted,
        isValidDateTime: true,
      };
    } catch {
      return { utcString: '', localPreviewStr: '', isValidDateTime: false };
    }
  }, [selectedDate, selectedTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!leadId) {
      setErrorMessage('Lead ID not found. Please complete your health assessment first.');
      return;
    }

    if (!isValidDateTime || !utcString) {
      setErrorMessage('Please select a valid date and time for your call.');
      return;
    }

    if (!concern.trim()) {
      setErrorMessage('Please describe your concern or topic of discussion.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createFollowup({
        leadId,
        followupAt: utcString,
        concern: concern.trim(),
      });

      setSuccessData({
        id: response.id,
        followupAt: response.followupAt || utcString,
      });
    } catch (err) {
      setErrorMessage(formatApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-lg rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_24px_70px_rgba(0,0,0,0.18),inset_0_1px_2px_rgba(255,255,255,0.9)] p-6 sm:p-8 z-10 text-zinc-900"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* If leadId is missing, prompt to fill form */}
            {!leadId ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#EF8F60]/15 text-[#EF8F60] mx-auto flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-zinc-900">Health Assessment Required</h3>
                <p className="text-sm text-zinc-600 max-w-sm mx-auto">
                  To connect with the {programName} care team, please complete your quick health assessment first so our doctors have your context.
                </p>
                <div className="pt-2">
                  <SpecularButton
                    type="button"
                    size="sm"
                    tint="#AEDEE44D"
                    tintOpacity={0.35}
                    textColor="#036132"
                    lineColor="#ffffff"
                    baseColor="#AEDEE44D"
                    radius={20}
                    onClick={() => {
                      onClose();
                      router.push('/q-form');
                    }}
                    className="font-bold text-xs uppercase tracking-tight px-6 py-3 cursor-pointer"
                  >
                    START HEALTH ASSESSMENT
                  </SpecularButton>
                </div>
              </div>
            ) : successData ? (
              /* Success State */
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#AEDEE4]/40 text-[#036132] mx-auto flex items-center justify-center font-bold text-2xl shadow-inner">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-zinc-900">Call Scheduled!</h3>
                <p className="text-sm text-zinc-600 max-w-sm mx-auto">
                  Your care consultation for <strong className="text-zinc-900">{programName}</strong> has been confirmed. Our medical concierge will reach out to you on:
                </p>
                <div className="p-3.5 rounded-2xl bg-[#AEDEE4]/15 border border-[#AEDEE4]/60 text-zinc-800 text-sm font-semibold">
                  {localPreviewStr}
                </div>
                <div className="pt-2">
                  <SpecularButton
                    type="button"
                    size="sm"
                    tint="#AEDEE44D"
                    tintOpacity={0.35}
                    textColor="#000000"
                    lineColor="#ffffff"
                    baseColor="#AEDEE44D"
                    radius={20}
                    onClick={onClose}
                    className="font-bold text-xs uppercase tracking-tight px-8 py-3 cursor-pointer"
                  >
                    DONE
                  </SpecularButton>
                </div>
              </div>
            ) : (
              /* Consultation Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Header */}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AEDEE4]/30 border border-[#AEDEE4]/70 text-[11px] font-semibold text-[#036132] mb-2 uppercase tracking-wider">
                    <span>{programName} Care Concierge</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                    Schedule a Consultation
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Select your preferred date &amp; time. Our clinical team will connect with you to guide your care roadmap.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Concern / Question */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1">
                    Your Concern / Goal *
                  </label>
                  <textarea
                    rows={2}
                    value={concern}
                    onChange={(e) => setConcern(e.target.value)}
                    required
                    placeholder="e.g. Want to know about PCOS plans"
                    className="w-full px-4 py-3 text-sm font-medium text-zinc-800 placeholder:text-zinc-400 bg-zinc-50/80 rounded-2xl border border-zinc-200 focus:outline-none focus:border-[#95C1E2] transition-colors resize-none"
                  />
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Pre-filled from your assessment details. You may edit or add more context.
                  </p>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    min={minDateStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm font-medium text-zinc-800 bg-zinc-50/80 rounded-2xl border border-zinc-200 focus:outline-none focus:border-[#95C1E2] transition-colors cursor-pointer"
                  />
                </div>

                {/* Time Selection & Quick Slots */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Preferred Time *
                    </label>
                    <span className="text-[11px] text-zinc-400">Local Time (IST)</span>
                  </div>

                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm font-medium text-zinc-800 bg-zinc-50/80 rounded-2xl border border-zinc-200 focus:outline-none focus:border-[#95C1E2] transition-colors cursor-pointer mb-2"
                  />

                  {/* Quick Slots */}
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                          selectedTime === slot.time
                            ? 'bg-[#95C1E2] text-zinc-900 font-semibold shadow-xs'
                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Time Preview & UTC Confirmation */}
                {isValidDateTime && (
                  <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-zinc-700">
                      <span className="font-medium">Scheduled Call:</span>
                      <strong className="text-zinc-900">{localPreviewStr}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                      <span>UTC Timestamp:</span>
                      <span className="truncate max-w-[210px]">{utcString}</span>
                    </div>
                  </div>
                )}

                {/* Submit CTA */}
                <div className="flex justify-end pt-2">
                  <SpecularButton
                    type="submit"
                    disabled={isSubmitting || !isValidDateTime}
                    size="md"
                    tint="#AEDEE44D"
                    tintOpacity={0.35}
                    textColor="#000000"
                    lineColor="#ffffff"
                    baseColor="#AEDEE44D"
                    radius={22}
                    className="w-full font-bold text-xs sm:text-sm uppercase tracking-tight py-3.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'SCHEDULING CALL...' : 'CONFIRM CALL SCHEDULE'}
                  </SpecularButton>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ----------------------------------------------------------------------
// Provider Component
// ----------------------------------------------------------------------
export function FollowupModalProvider({
  children,
  programName = 'CALA',
  defaultConcern,
}: {
  children: React.ReactNode;
  programName?: string;
  defaultConcern?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeProgram, setActiveProgram] = useState<string>(programName);
  const [activeConcern, setActiveConcern] = useState<string | undefined>(defaultConcern);

  const openModal = (options?: OpenFollowupOptions) => {
    if (options?.programName) setActiveProgram(options.programName);
    if (options?.defaultConcern) setActiveConcern(options.defaultConcern);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <FollowupModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        programName: activeProgram,
      }}
    >
      {children}
      <FollowupModal
        isOpen={isOpen}
        onClose={closeModal}
        programName={activeProgram}
        defaultConcern={activeConcern}
      />
    </FollowupModalContext.Provider>
  );
}

