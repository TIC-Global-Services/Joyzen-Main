'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Reveal from '@/reuseable/Reveal';
import AppointmentsWidget from '@/components/shared/AppointmentsWidget';

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

/* --- Coded Interactive Health Dashboard Widget with Counter Animations --- */
function HealthDashboardWidget() {
  const [activeMetricId, setActiveMetricId] = useState<string>('diet');
  const [medsTakenCount] = useState<number>(1);
  const [dietLogged] = useState<number>(87);
  const [fitnessSteps] = useState<number>(72);
  const [treatmentCompleted] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-40px' });

  // Automatic selection cycle through metrics
  useEffect(() => {
    const metricIds = ['diet', 'fitness', 'treatment', 'medication'];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % metricIds.length;
      setActiveMetricId(metricIds[index]);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      id: 'diet',
      title: 'Diet Tracker',
      numericValue: dietLogged,
      suffix: '%',
      label: 'Daily Goal',
      barColor: 'bg-[#10B981]',
      textColor: 'text-[#059669]',
      subtext: dietLogged >= 100 ? 'Goal exceeded!' : 'Great choices today!',
      progress: Math.min(dietLogged, 100),
      actionLabel: '+ Log Meal',
      icon: (
        <svg className="w-4 h-4 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
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
      className="w-full bg-[#FAFCFB] rounded-2xl border border-zinc-100/90 p-4 sm:p-2 shadow-[0_2px_12px_rgba(0,0,0,0.02)] select-none pointer-events-none"
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
        <div className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold text-[#036132] bg-[#ECF8F3] border border-[#c4ebd8]">
          <span>Cycle Views</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* 4 Metric Cards Grid with Animated Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3.5">
        {metrics.map((m) => {
          const isActive = m.id === activeMetricId;
          return (
            <div
              key={m.id}
              className={`bg-white rounded-xl border p-2.5 sm:p-3 flex flex-col justify-between shadow-xs transition-all ${isActive
                  ? 'border-[#036132] ring-2 ring-[#036132]/10 shadow-sm'
                  : 'border-zinc-100'
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
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${medsTakenCount >= 2
                        ? 'text-emerald-800 bg-emerald-100 border border-emerald-300'
                        : 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
                      }`}
                  >
                    <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {medsTakenCount >= 2 ? 'All Taken' : m.subtext}
                  </div>
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
        <div className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#036132] bg-[#F0F9F4] px-2.5 py-0.5 rounded-md border border-[#cbebdc]">
          {activeMetric.actionLabel}
          <span>→</span>
        </div>
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
              <div className="group w-full h-full bg-white rounded-[20px] border border-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] transition-all duration-500 py-6 px-[3%]  sm:p-10 gap-16 flex flex-col overflow-hidden">
                {/* Heading */}
                <div className="">
                  <h2 className="text-xl text-center md:text-left sm:text-3xl lg:text-[40px] font-bold text-black tracking-tight leading-[1.1] md:leading-[1.18]">
                    Everything your health <br />
                    has been asking for Finally in one place
                  </h2>
                </div>

                {/* Dashboard Screenshot with crisp natural fit and smooth hover scale */}
                <div className="relative w-full flex-1 min-h-[300px] sm:min-h-[380px] lg:min-h-[450px] rounded-2xl overflow-hidden flex items-center ">
                  <Image
                    src="/in-one-place.png"
                    alt="Everything your health has been asking for Finally in one place"
                    fill
                    priority
                    className="w-full h-full object-cover object-top lg:object-contain rounded-xl transition-transform duration-700 ease-out scale-[1.015]"
                  />
                  {/* Bottom Gradient Overlay */}
                  <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none z-10" />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: 2 Stacked Cards */}
          <div className="lg:col-span-5 flex flex-col flex-col-reverse sm:flex-col gap-4 justify-between">
            {/* Top Right Card: Coded Interactive Appointment Widget + Animated Touching Cursor + Text */}
            <Reveal delay={0.2} className="w-full h-full flex flex-col">
              <div className="w-full h-full bg-white rounded-[20px] border border-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] transition-all duration-500 p-6 sm:p-7 flex flex-col justify-between overflow-hidden">
                <div className="mt-2 text-center  md:hidden">
                  <p className="text-xl sm:text-xl md:text-[20px] font-bold text-black tracking-tight leading-[1.2]">
                    Stay informed . stay organised <br />
                    stay on track
                  </p>
                </div>
                {/* Live Interactive Coded Widget */}
                <AppointmentsWidget />

                {/* Text Bottom */}
                <div className="mt-2 text-center hidden md:block">
                  <p className="text-xl sm:text-xl md:text-[20px] font-bold text-black tracking-tight leading-[1.2]">
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
