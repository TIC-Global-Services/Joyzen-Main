'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* --- Appointment Data by Date --- */
export interface AppointmentInfo {
  dayName: string;
  title: string;
  time: string;
  doctor: string;
  note?: string;
}

export const APPOINTMENTS: Record<number, AppointmentInfo> = {
  15: {
    dayName: 'TUE',
    title: 'Nutrition Review',
    time: '02:00 PM – 02:45 PM',
    doctor: 'Nutritionist Priya',
  },
  18: {
    dayName: 'FRI',
    title: 'General Check-up',
    time: '11:00 AM – 11:30 AM',
    doctor: 'Dr. Ananya Sharma',
    note: 'Routine health check to keep you progressing',
  },
  22: {
    dayName: 'TUE',
    title: 'Follow-up Consultation',
    time: '04:15 PM – 04:45 PM',
    doctor: 'Dr. Meera Iyer',
    note: 'Review recent vitals and lab panels',
  },
};

/* --- Coded Interactive Appointments Widget with Simulated Touching Cursor --- */
export default function AppointmentsWidget() {
  const [selectedDate, setSelectedDate] = useState<number>(18);
  const [monthIndex] = useState<number>(0);
  const [showResultsToast] = useState<boolean>(false);
  const [scheduledDates] = useState<number[]>([15, 18, 22]);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number; clicking: boolean }>({
    x: 78,
    y: 44,
    clicking: false,
  });

  const months = ['July 2025', 'August 2025'];
  const currentMonth = months[monthIndex];

  const daysRow1 = [13, 14, 15, 16, 17, 18, 19];
  const daysRow2 = [20, 21, 22, 23, 24, 25, 26];

  const currentAppointment = APPOINTMENTS[selectedDate];

  // Coordinates percentage for simulated cursor on the calendar grid
  const DATE_COORDS: Record<number, { x: number; y: number }> = {
    15: { x: 35, y: 44 },
    18: { x: 78, y: 44 },
    22: { x: 35, y: 72 },
  };

  // Autonomous cursor animation sequence
  useEffect(() => {
    const demoCycle = [18, 15, 22];
    let step = 0;

    const interval = setInterval(() => {
      step = (step + 1) % demoCycle.length;
      const targetDate = demoCycle[step];
      const coords = DATE_COORDS[targetDate] || { x: 50, y: 50 };

      // 1. Move cursor to target date
      setCursorPosition({ x: coords.x, y: coords.y, clicking: false });

      // 2. Click / tap animation
      const clickTimer = setTimeout(() => {
        setCursorPosition((prev) => ({ ...prev, clicking: true }));
        setSelectedDate(targetDate);

        // 3. Release click
        const releaseTimer = setTimeout(() => {
          setCursorPosition((prev) => ({ ...prev, clicking: false }));
        }, 300);

        return () => clearTimeout(releaseTimer);
      }, 500);

      return () => clearTimeout(clickTimer);
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full bg-[#FAFCFB] rounded-2xl border border-zinc-100/90 p-3.5 sm:p-5 shadow-[0_2px_16px_rgba(0,0,0,0.03)] select-none pointer-events-none"
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#ECF8F3] text-[#036132] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs sm:text-[15px] font-bold text-zinc-900 leading-tight">Your Appointments</h4>
            <p className="text-[10px] sm:text-xs text-zinc-500">Stay on track, stay healthy</p>
          </div>
        </div>
        <div
          className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-[#036132] bg-[#ECF8F3] border border-[#c4ebd8]"
        >
          <span>Next Visit</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>

      {/* Widget Body Grid: 2 Columns on SM+, 1 Column on XS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 items-stretch">
        {/* Left: Dynamic Appointment Info Box */}
        <div className="bg-white rounded-xl border border-zinc-100 p-3 sm:p-3.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold text-[#036132] bg-[#F2F9F5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#036132] animate-pulse" />
                {currentAppointment ? 'Next Appointment' : 'Available Day'}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {currentAppointment ? (
                <motion.div
                  key={selectedDate}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="mt-2.5 sm:mt-3 flex items-start gap-2.5 sm:gap-3"
                >
                  {/* Date Block */}
                  <div className="w-11 h-13 sm:w-12 sm:h-14 rounded-lg bg-zinc-50 border border-zinc-200/80 flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <span className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider text-zinc-500">JUL</span>
                    <span className="text-lg sm:text-xl font-black text-zinc-900 leading-none my-0.5">{selectedDate}</span>
                    <span className="text-[8.5px] sm:text-[9px] font-semibold uppercase text-zinc-500">{currentAppointment.dayName}</span>
                  </div>

                  {/* Appointment Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs sm:text-[12px] font-bold text-zinc-900 truncate">
                      {currentAppointment.title}
                    </h5>
                    <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                      <svg className="w-2 h-2 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {currentAppointment.time}
                    </p>
                    <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5 truncate">
                      <svg className="w-2 h-2 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {currentAppointment.doctor}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-2.5 sm:mt-3 flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-dashed border-zinc-200"
                >
                  <div>
                    <span className="text-xs font-semibold text-zinc-700 block">Jul {selectedDate}: No visits</span>
                    <span className="text-[10px] text-zinc-400">Available consultation slot</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-white bg-[#036132] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md">
                    + Book
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center gap-1.5 text-[10px] text-[#036132] font-medium bg-[#F5FAF7] -mx-1 -mb-1.5 p-1.5 sm:p-2 rounded-full">
            <svg className="w-3.5 h-3.5 text-[#036132] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate">{currentAppointment?.note || 'Tap any day to preview appointments'}</span>
          </div>
        </div>

        {/* Right: Calendar Mini Widget with Floating Touch Cursor */}
        <div className="bg-white rounded-xl border border-zinc-100 p-3 sm:p-3.5 flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-zinc-900">{currentMonth}</span>
              <div className="flex items-center gap-1 text-zinc-400">
                <div className="p-0.5 sm:p-1 rounded">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <div className="p-0.5 sm:p-1 rounded">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 text-center text-[9.5px] sm:text-[10px] font-semibold text-zinc-400 mb-1">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>

            {/* Calendar Grid Container with simulated cursor overlay */}
            <div className="relative py-0.5">
              {/* Week 1 */}
              <div className="grid grid-cols-7 text-center text-[10.5px] sm:text-[11px] items-center mb-1 gap-y-0.5">
                {daysRow1.map((d) => {
                  const isSelected = d === selectedDate;
                  const hasAppt = scheduledDates.includes(d);
                  return (
                    <div
                      key={d}
                      className="relative flex flex-col items-center justify-center py-0.5 group"
                    >
                      <span
                        className={`w-4.5 h-4.5 sm:w-5 sm:h-5 flex items-center justify-center rounded-full text-[10px] sm:text-[10.5px] transition-all duration-300 ${isSelected
                            ? 'bg-[#036132] text-white font-bold shadow-sm scale-110'
                            : 'text-zinc-700'
                          }`}
                      >
                        {d}
                      </span>
                      {hasAppt && !isSelected && (
                        <span className="w-1 h-1 rounded-full bg-[#036132] mt-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Week 2 */}
              <div className="grid grid-cols-7 text-center text-[10.5px] sm:text-[11px] items-center gap-y-0.5">
                {daysRow2.map((d) => {
                  const isSelected = d === selectedDate;
                  const hasAppt = scheduledDates.includes(d);
                  return (
                    <div
                      key={d}
                      className="relative flex flex-col items-center justify-center py-0.5 group"
                    >
                      <span
                        className={`w-4.5 h-4.5 sm:w-5 sm:h-5 flex items-center justify-center rounded-full text-[10px] sm:text-[10.5px] transition-all duration-300 ${isSelected
                            ? 'bg-[#036132] text-white font-bold shadow-sm scale-110'
                            : 'text-zinc-700'
                          }`}
                      >
                        {d}
                      </span>
                      {hasAppt && !isSelected && (
                        <span className="w-1 h-1 rounded-full bg-[#036132] mt-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Simulated Floating Pointer / Touch Cursor */}
              <motion.div
                className="pointer-events-none absolute z-20 flex items-center gap-1"
                animate={{
                  left: `${cursorPosition.x}%`,
                  top: `${cursorPosition.y}%`,
                  scale: cursorPosition.clicking ? 0.82 : 1,
                }}
                transition={{
                  left: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
                  top: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
                  scale: { duration: 0.18 },
                }}
                style={{
                  transform: 'translate(-30%, -30%)',
                }}
              >
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="#000" d="M4.5.79v22.42l6.56-6.57h9.29L4.5.79z"></path></svg>
                  {cursorPosition.clicking && (
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0.9 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute -top-3 -left-2 w-5 h-5 rounded-full border-2 border-[#036132] bg-[#036132]/20 pointer-events-none"
                    />
                  )}
                </div>
                <span className="text-[8.5px] font-bold text-white bg-zinc-900/90 backdrop-blur-xs px-1.5 py-0.5 rounded-md shadow-xs whitespace-nowrap">
                  Tap to view
                </span>
              </motion.div>
            </div>
          </div>

          {/* Last Visit Footer */}
          <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] relative">
            <div className="flex items-center gap-1.5 text-zinc-500 truncate">
              <svg className="w-3 h-3 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">Last Visit: <strong className="font-semibold text-zinc-700">22 Jul</strong> • Blood Test</span>
            </div>
            <div
              className="text-[9.5px] sm:text-[10px] font-semibold text-zinc-700 px-1 py-0.5 rounded border border-zinc-200 shrink-0"
            >
              View Results
            </div>

            {/* Results Popover */}
            <AnimatePresence>
              {showResultsToast && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 5 }}
                  className="absolute bottom-8 right-0 bg-white border border-emerald-200 shadow-lg rounded-xl p-2.5 z-30 w-48 sm:w-52 text-left"
                >
                  <div className="flex items-center gap-1.5 text-[#036132] font-bold text-[10.5px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Lab Report Ready
                  </div>
                  <p className="text-[9.5px] sm:text-[10px] text-zinc-600 mt-1">
                    Fasting Glucose: <strong>92 mg/dL</strong> (Normal)
                  </p>
                  <p className="text-[9.5px] sm:text-[10px] text-zinc-600">
                    Hemoglobin: <strong>14.2 g/dL</strong> (Optimal)
                  </p>
                  <span className="text-[9px] text-[#036132] font-semibold mt-1 block">
                    ✓ Verified by Dr. Meera
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
