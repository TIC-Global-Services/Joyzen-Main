'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Reveal from '@/reuseable/Reveal';

/* --- Smooth Number Counter Component --- */
function AnimatedCounter({
  target,
  duration = 1.4,
  suffix = '',
}: {
  target: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const end = target;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    let animationFrameId: number;

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Smooth easeOutExpo curve
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.round(start + (end - start) * ease);

      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);

    return () => cancelAnimationFrame(animationFrameId);
  }, [target, inView, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* --- Appointment Data by Date --- */
interface AppointmentInfo {
  dayName: string;
  title: string;
  time: string;
  doctor: string;
  note?: string;
}

const APPOINTMENTS: Record<number, AppointmentInfo> = {
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
function AppointmentsWidget() {
  const [selectedDate, setSelectedDate] = useState<number>(18);
  const [monthIndex, setMonthIndex] = useState<number>(0);
  const [showResultsToast, setShowResultsToast] = useState<boolean>(false);
  const [scheduledDates, setScheduledDates] = useState<number[]>([15, 18, 22]);
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number; clicking: boolean }>({
    x: 78,
    y: 44,
    clicking: false,
  });

  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
    if (isUserInteracting) return;

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
  }, [isUserInteracting]);

  // Pause autonomous animation on user interaction
  const handleUserClick = (date: number) => {
    setIsUserInteracting(true);
    setSelectedDate(date);

    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 9000);
  };

  const handleBookSlot = (date: number) => {
    if (!scheduledDates.includes(date)) {
      setScheduledDates((prev) => [...prev, date]);
      APPOINTMENTS[date] = {
        dayName: 'DAY',
        title: 'New Health Check',
        time: '10:00 AM – 10:30 AM',
        doctor: 'Joyzen Care Team',
        note: 'Reserved consultation slot',
      };
      setSelectedDate(date);
    }
  };

  return (
    <div
      className="w-full bg-[#FAFCFB] rounded-2xl border border-zinc-100/90 p-4 sm:px-[5%] shadow-[0_2px_12px_rgba(0,0,0,0.02)] select-none"
      onMouseEnter={() => setIsUserInteracting(true)}
      onMouseLeave={() => {
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = setTimeout(() => setIsUserInteracting(false), 3000);
      }}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#ECF8F3] text-[#036132] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm sm:text-[15px] font-bold text-zinc-900 leading-tight">Your Appointments</h4>
            <p className="text-[11px] sm:text-xs text-zinc-500">Stay on track, stay healthy</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const next = scheduledDates[(scheduledDates.indexOf(selectedDate) + 1) % scheduledDates.length];
            handleUserClick(next);
          }}
          className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold text-[#036132] bg-[#ECF8F3] hover:bg-[#dff4ea] border border-[#c4ebd8] transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>Next Visit</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {/* Widget Body Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-3.5 items-stretch">
        {/* Left: Dynamic Appointment Info Box */}
        <div className="bg-white rounded-xl border border-zinc-100 p-3 sm:p-3.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold text-[#036132] bg-[#F2F9F5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#036132] animate-pulse" />
                {currentAppointment ? 'Next Appointment' : 'Available Day'}
              </span>
              {/* <span className="text-[10px] text-zinc-400 font-medium">Interactive preview</span> */}
            </div>

            <AnimatePresence mode="wait">
              {currentAppointment ? (
                <motion.div
                  key={selectedDate}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="mt-3 flex items-start gap-3"
                >
                  {/* Date Block */}
                  <div className="w-12 h-14 rounded-lg bg-zinc-50 border border-zinc-200/80 flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">JUL</span>
                    <span className="text-xl font-black text-zinc-900 leading-none my-0.5">{selectedDate}</span>
                    <span className="text-[9px] font-semibold uppercase text-zinc-500">{currentAppointment.dayName}</span>
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
                  className="mt-3 flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-dashed border-zinc-200"
                >
                  <div>
                    <span className="text-xs font-semibold text-zinc-700 block">Jul {selectedDate}: No visits</span>
                    <span className="text-[10px] text-zinc-400">Available consultation slot</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBookSlot(selectedDate)}
                    className="text-[11px] font-bold text-white bg-[#036132] px-2.5 py-1 rounded-md hover:bg-[#024a26] transition-colors cursor-pointer"
                  >
                    + Book
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center gap-1.5 text-[10px] text-[#036132] font-medium bg-[#F5FAF7] -mx-1 -mb-2 p-2 rounded-full">
            <svg className="w-3.5 h-3.5 text-[#036132] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate">{currentAppointment?.note || 'Tap any day to preview appointments'}</span>
          </div>
        </div>

        {/* Right: Calendar Mini Widget with Floating Touch Cursor */}
        <div className="bg-white rounded-xl border border-zinc-100 p-3 sm:p-3.5 flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-900">{currentMonth}</span>
              <div className="flex items-center gap-1 text-zinc-400">
                <button
                  type="button"
                  onClick={() => setMonthIndex((prev) => (prev === 0 ? 1 : 0))}
                  className="p-1 hover:text-zinc-700 hover:bg-zinc-100 rounded transition-colors cursor-pointer"
                  title="Previous month"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setMonthIndex((prev) => (prev === 0 ? 1 : 0))}
                  className="p-1 hover:text-zinc-700 hover:bg-zinc-100 rounded transition-colors cursor-pointer"
                  title="Next month"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-zinc-400 mb-1">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>

            {/* Calendar Grid Container with simulated cursor overlay */}
            <div className="relative py-1">
              {/* Week 1 */}
              <div className="grid grid-cols-7 text-center text-[11px] items-center mb-1 gap-y-1">
                {daysRow1.map((d) => {
                  const isSelected = d === selectedDate;
                  const hasAppt = scheduledDates.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleUserClick(d)}
                      className="relative flex flex-col items-center justify-center py-0.5 group cursor-pointer"
                    >
                      <span
                        className={`w-5 h-5 flex items-center justify-center rounded-full text-[10.5px] transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#036132] text-white font-bold shadow-sm scale-110'
                            : 'text-zinc-700 group-hover:bg-zinc-100'
                        }`}
                      >
                        {d}
                      </span>
                      {hasAppt && !isSelected && (
                        <span className="w-1 h-1 rounded-full bg-[#036132] mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Week 2 */}
              <div className="grid grid-cols-7 text-center text-[11px] items-center gap-y-1">
                {daysRow2.map((d) => {
                  const isSelected = d === selectedDate;
                  const hasAppt = scheduledDates.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleUserClick(d)}
                      className="relative flex flex-col items-center justify-center py-0.5 group cursor-pointer"
                    >
                      <span
                        className={`w-5 h-5 flex items-center justify-center rounded-full text-[10.5px] transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#036132] text-white font-bold shadow-sm scale-110'
                            : 'text-zinc-700 group-hover:bg-zinc-100'
                        }`}
                      >
                        {d}
                      </span>
                      {hasAppt && !isSelected && (
                        <span className="w-1 h-1 rounded-full bg-[#036132] mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Simulated Floating Pointer / Touch Cursor */}
              {!isUserInteracting && (
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
                  {/* Sleek SVG Hand Cursor */}
                  <div className="relative">
                    <svg
                      className="w-5 h-5 text-zinc-900 drop-shadow-md"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M10 2a2 2 0 0 0-2 2v7.17l-1.59-1.58a2 2 0 0 0-2.82 2.82l4.82 4.83A7 7 0 0 0 13.36 22H16a6 6 0 0 0 6-6V9a2 2 0 0 0-2-2h-1V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v3h-1V4a2 2 0 0 0-2-2h-2z" />
                    </svg>

                    {/* Tap Ripple Effect on Click */}
                    {cursorPosition.clicking && (
                      <motion.span
                        initial={{ scale: 0.4, opacity: 0.9 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute -top-1 -left-1 w-6 h-6 rounded-full border-2 border-[#036132] bg-[#036132]/20 pointer-events-none"
                      />
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-white bg-zinc-900/90 backdrop-blur-xs px-1.5 py-0.5 rounded-md shadow-xs whitespace-nowrap">
                    Tap to view
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Last Visit Footer with interactive Results trigger */}
          <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[10px] relative">
            <div className="flex items-center gap-1.5 text-zinc-500 truncate">
              <svg className="w-3 h-3 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last Visit <br/><strong className="font-semibold text-zinc-700">22 Jul</strong> • Blood Test</span>
            </div>
            <button
              type="button"
              onClick={() => setShowResultsToast((prev) => !prev)}
              className="text-[10px] font-semibold text-zinc-700 hover:text-[#036132] px-1 py-0.5 rounded border border-zinc-200 hover:border-[#036132]/30 hover:bg-[#F2F9F5] transition-all active:scale-95 cursor-pointer shrink-0"
            >
              {showResultsToast ? 'Close' : 'View Results'}
            </button>

            {/* Results Popover */}
            <AnimatePresence>
              {showResultsToast && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 5 }}
                  className="absolute bottom-9 right-0 bg-white border border-emerald-200 shadow-lg rounded-xl p-2.5 z-20 w-52 text-left"
                >
                  <div className="flex items-center gap-1.5 text-[#036132] font-bold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Lab Report Ready
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1">
                    Fasting Glucose: <strong>92 mg/dL</strong> (Normal)
                  </p>
                  <p className="text-[10px] text-zinc-600">
                    Hemoglobin: <strong>14.2 g/dL</strong> (Optimal)
                  </p>
                  <span className="text-[9px] text-[#036132] font-semibold mt-1.5 block">
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

/* --- Coded Interactive Health Dashboard Widget with Counter Animations --- */
function HealthDashboardWidget() {
  const [activeMetricId, setActiveMetricId] = useState<string>('diet');
  const [medsTakenCount, setMedsTakenCount] = useState<number>(1);
  const [dietLogged, setDietLogged] = useState<number>(87);
  const [fitnessSteps, setFitnessSteps] = useState<number>(72);
  const [treatmentCompleted, setTreatmentCompleted] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-40px' });

  const toggleMedication = () => {
    setMedsTakenCount((prev) => (prev >= 2 ? 1 : prev + 1));
  };

  const metrics = [
    {
      id: 'diet',
      // title: 'Diet Tracker',
      numericValue: dietLogged,
      suffix: '%',
      label: 'Daily Goal',
      barColor: 'bg-[#10B981]',
      textColor: 'text-[#059669]',
      // subtext: dietLogged >= 100 ? 'Goal exceeded!' : 'Great choices today!',
      progress: Math.min(dietLogged, 100),
      interactiveAction: () => setDietLogged((prev) => (prev >= 100 ? 87 : prev + 5)),
      // actionLabel: '+ Log Meal',
        // icon: (
        //   <svg className="w-4 h-4 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        //   </svg>
        // ),
    },
    {
      id: 'fitness',
      title: 'Fitness Tracker',
      numericValue: fitnessSteps,
      suffix: '%',
      label: 'Activity Goal',
      barColor: 'bg-[#8B5CF6]',
      textColor: 'text-[#7C3AED]',
      subtext: fitnessSteps >= 100 ? 'Daily goal crushed!' : 'Keep moving!',
      progress: Math.min(fitnessSteps, 100),
      interactiveAction: () => setFitnessSteps((prev) => (prev >= 100 ? 72 : prev + 10)),
      actionLabel: '+ 1K Steps',
      icon: (
        <svg className="w-4 h-4 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'treatment',
      title: 'Treatment Tracker',
      numericValue: treatmentCompleted ? 100 : 93,
      suffix: '%',
      label: 'On Schedule',
      barColor: 'bg-[#0284C7]',
      textColor: 'text-[#0284C7]',
      subtext: treatmentCompleted ? 'Fully completed!' : 'All set for today',
      progress: treatmentCompleted ? 100 : 93,
      interactiveAction: () => setTreatmentCompleted((prev) => !prev),
      actionLabel: treatmentCompleted ? 'Reset' : 'Complete',
      icon: (
        <svg className="w-4 h-4 text-[#0284C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'medication',
      title: 'Medication Tracker',
      numericValue: medsTakenCount === 2 ? 0 : 2,
      suffix: '',
      label: medsTakenCount === 2 ? 'All Done' : 'Due Today',
      barColor: 'bg-[#F97316]',
      textColor: 'text-[#EA580C]',
      isMedication: true,
      subtext: `${medsTakenCount} taken`,
      interactiveAction: toggleMedication,
      actionLabel: medsTakenCount >= 2 ? 'Reset Dose' : 'Take Dose',
      icon: (
        <svg className="w-4 h-4 text-[#EA580C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
  ];

  const activeMetric = metrics.find((m) => m.id === activeMetricId) || metrics[0];

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#FAFCFB] rounded-2xl border border-zinc-100/90 p-4 sm:p-2 shadow-[0_2px_12px_rgba(0,0,0,0.02)] select-none"
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#ECF8F3] text-[#036132] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm sm:text-[15px] font-bold text-zinc-900 leading-tight">Health Dashboard</h4>
            <p className="text-[11px] sm:text-xs text-zinc-500">Your health, all in one place</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const nextIdx = (metrics.findIndex((m) => m.id === activeMetricId) + 1) % metrics.length;
            setActiveMetricId(metrics[nextIdx].id);
          }}
          className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold text-[#036132] bg-[#ECF8F3] hover:bg-[#dff4ea] border border-[#c4ebd8] transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>Cycle Views</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 4 Metric Cards Grid with Animated Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3.5">
        {metrics.map((m) => {
          const isActive = m.id === activeMetricId;
          return (
            <div
              key={m.id}
              onClick={() => setActiveMetricId(m.id)}
              className={`bg-white rounded-xl border p-2.5 sm:p-3 flex flex-col justify-between shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                isActive
                  ? 'border-[#036132] ring-2 ring-[#036132]/10 shadow-sm'
                  : 'border-zinc-100 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-500 truncate">{m.title}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#036132]" />}
              </div>

              <div className="my-2">
                <div className="flex items-center gap-1.5">
                  {m.icon}
                  <span className={`text-base sm:text-lg font-black ${m.textColor} leading-tight`}>
                    {isInView ? (
                      <AnimatedCounter target={m.numericValue} suffix={m.suffix} duration={1.2} />
                    ) : (
                      `0${m.suffix}`
                    )}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 block mt-0.5">{m.label}</span>
              </div>

              {m.isMedication ? (
                <div className="mt-1 pt-2 border-t border-zinc-100/80 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMedication();
                    }}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                      medsTakenCount >= 2
                        ? 'text-emerald-800 bg-emerald-100 border border-emerald-300'
                        : 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
                    }`}
                  >
                    <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {medsTakenCount >= 2 ? 'All Taken' : m.subtext}
                  </button>
                </div>
              ) : (
                <div className="mt-1 pt-2 border-t border-zinc-100/80">
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-1">
                    <motion.div
                      className={`h-full ${m.barColor} rounded-full`}
                      initial={{ width: '0%' }}
                      animate={{ width: isInView ? `${m.progress}%` : '0%' }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <span className="text-[9.5px] sm:text-[10px] text-zinc-400 truncate block">{m.subtext}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Micro-Action Bar */}
      <div className="mt-3 pt-2.5 border-t border-zinc-100/80 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-zinc-600">
          <span className="font-semibold text-zinc-900">{activeMetric.title}:</span>
          <span className="text-zinc-500">{activeMetric.subtext}</span>
        </div>
        <button
          type="button"
          onClick={activeMetric.interactiveAction}
          className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#036132] bg-[#F0F9F4] hover:bg-[#e4f5ec] px-2.5 py-0.5 rounded-md border border-[#cbebdc] transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          {activeMetric.actionLabel}
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

export default function DashboardShowcaseSection() {
  return (
    <section className="relative w-full py-16 sm:py-20 px-[3%] overflow-hidden">
      <div className="">
        {/* Bento Grid: Left large card, Right 2 stacked cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Left Large Card: Heading + /in-one-place.png */}
          <div className="lg:col-span-7 flex">
            <Reveal delay={0.1} className="w-full h-full flex flex-col">
              <div className="group w-full h-full bg-white rounded-[20px] border border-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] transition-all duration-500 p-6 sm:p-10 gap-16 flex flex-col overflow-hidden">
                {/* Heading */}
                <div className="">
                  <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-zinc-950 tracking-tight leading-[1.18]">
                    Everything your health <br />
                    has been asking for Finally in one place
                  </h2>
                </div>

                {/* Dashboard Screenshot with crisp natural fit and smooth hover scale */}
                <div className="relative w-full rounded-2xl overflow-hidden flex items-center">
                  <Image
                    src="/in-one-place.png"
                    alt="Everything your health has been asking for Finally in one place"
                    width={1537}
                    height={1023}
                    priority
                    className="w-full h-auto object-contain rounded-xl transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: 2 Stacked Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
            {/* Top Right Card: Coded Interactive Appointment Widget + Animated Touching Cursor + Text */}
            <Reveal delay={0.2} className="w-full h-full flex flex-col">
              <div className="w-full h-full bg-white rounded-[20px] border border-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] transition-all duration-500 p-6 sm:p-7 flex flex-col justify-between overflow-hidden">
                {/* Live Interactive Coded Widget */}
                <AppointmentsWidget />

                {/* Text Bottom */}
                <div className="mt-2 text-center">
                  <p className="text-lg sm:text-xl md:text-[20px] font-bold text-black tracking-tight leading-[1.2]">
                    Stay informed . stay organised <br />
                    stay on track
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Bottom Right Card: Text + Coded Interactive Health Dashboard Widget with Counter Animations */}
            <Reveal delay={0.3} className="w-full h-full flex flex-col">
              <div className="w-full h-full bg-white rounded-[20px] border border-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] transition-all duration-500 p-6 sm:p-7 flex flex-col justify-between overflow-hidden">
                {/* Text Top */}
                <div className="mb-5 text-center">
                  <h3 className="text-lg sm:text-xl md:text-[20px] font-bold text-black tracking-tight leading-[1.2]">
                    Insights that help <br />
                    you take better care of you
                  </h3>
                </div>

                {/* Live Interactive Coded Widget */}
                <HealthDashboardWidget />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
