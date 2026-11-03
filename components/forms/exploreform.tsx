'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { createLead, formatApiError, type CreateLeadPayload } from '@/lib/joyzenApi';
import StepBasic from './StepBasic';
import StepGoals from './StepGoals';
import { buildFullPhone, mapGender } from './helpers';
import {
  exploreFormSchema,
  HEALTH_OPTION_PLAN_MAP,
  STEP1_FIELDS,
  type ExploreFormData,
} from './constants';

// Heavy visual pieces are loaded on the client only, outside the first bundle.
const WaveGridBackground = dynamic(() => import('@/reuseable/wave-grid-background'), { ssr: false });
const LiquidGlass = dynamic(() => import('@liquidglass/react').then((m) => m.LiquidGlass), { ssr: false });

// Re-exports so existing imports from this file keep working.
export {
  exploreFormSchema,
  femaleOptions,
  maleOptions,
  coupleOptions,
  leadSourceOptions,
  countryCodeOptions,
  HEALTH_OPTION_PLAN_MAP,
} from './constants';
export type { ExploreFormData, PlanMeta } from './constants';

const stepVariants = {
  hidden: (dir: number) => ({ opacity: 0, x: dir > 0 ? 30 : -30 }),
  visible: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -30 : 30 }),
};

const scrollToTop = (top = 120) => {
  if (typeof window !== 'undefined') window.scrollTo({ top, behavior: 'smooth' });
};

// ----------------------------------------------------------------------
function Heading({ step }: { step: 1 | 2 }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-8">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="h1" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="space-y-3">
            <h1 className="text-[38px] sm:text-4xl lg:text-[44px] font-bold tracking-tight text-black leading-[1.18]">
              Explore <br className="sm:hidden" />
              <span className="text-[#EF8F60]">Joyzen</span> care
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 font-normal leading-[1.4] max-w-lg mx-auto">
              Personalized reproductive and holistic health programs guided by your own dedicated doctor.
            </p>
          </motion.div>
        ) : (
          <motion.div key="h2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-black leading-[1.18]">
              What best describes your goal?
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 font-medium">
              Select your focus to view your tailored care program and connect with our care team.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Progress({ step }: { step: 1 | 2 }) {
  const badge = (n: 1 | 2) =>
    step === n
      ? 'bg-[#EF8F60] text-white shadow-sm'
      : n === 1
        ? 'bg-[#AEDEE4] text-[#036132]'
        : 'bg-zinc-200 text-zinc-600';

  return (
    <div className="w-full mb-6 p-4 rounded-3xl bg-white/60 border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.02)] space-y-3">
      <ol className="flex items-center justify-between px-4">
        <li className="flex items-center space-x-2" aria-current={step === 1 ? 'step' : undefined}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${badge(1)}`}>1</span>
          <span className={`text-xs sm:text-sm font-semibold ${step === 1 ? 'text-zinc-900' : 'text-zinc-600'}`}>Basic &amp; Contact Info</span>
        </li>
        <li aria-hidden="true" className="flex-1 h-px bg-zinc-300 mx-4" />
        <li className="flex items-center space-x-2" aria-current={step === 2 ? 'step' : undefined}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${badge(2)}`}>2</span>
          <span className={`text-xs sm:text-sm font-semibold ${step === 2 ? 'text-zinc-900' : 'text-zinc-600'}`}>Tailored Needs</span>
        </li>
      </ol>

      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={2}
        aria-valuenow={step}
        aria-label="Form progress"
        className="w-full h-1.5 bg-zinc-200/80 rounded-full overflow-hidden relative"
      >
        <motion.div
          className="h-full rounded-full overflow-hidden relative"
          initial={{ width: '50%' }}
          animate={{ width: step === 1 ? '50%' : '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <div
            aria-hidden="true"
            data-active="true"
            className="gradient-flow absolute -inset-x-full inset-y-0 w-[300%] h-full"
            style={
              {
                backgroundImage: 'linear-gradient(90deg, #EF8F60 0%, #F6D7C6 25%, #AEDEE4 50%, #EF8F60 75%, #F6D7C6 100%)',
                '--dur': '3.5s',
              } as React.CSSProperties
            }
          />
        </motion.div>
      </div>
    </div>
  );
}

function SuccessCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
      className="relative z-10 w-full flex flex-col items-center justify-center py-4"
    >
      <div className="w-full max-w-xl mx-auto">
        <LiquidGlass
          borderRadius={38}
          blur={3}
          contrast={1.14}
          brightness={1.05}
          saturation={1.18}
          shadowIntensity={0.06}
          displacementScale={0.8}
          elasticity={0.4}
          zIndex={10}
          className="w-full rounded-[36px] bg-white/40 border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_12px_36px_rgba(0,0,0,0.04)] overflow-hidden"
        >
          <div className="p-10 sm:p-14 text-center relative z-10" role="status">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#EF8F60] tracking-tight mb-4">Thank You!</h2>
            <p className="text-base text-zinc-800 font-medium leading-relaxed max-w-sm mx-auto mb-8">
              Your details have been registered successfully. Our care team will review your information and guide you on the best program.
            </p>
            <Link
              href="/"
              className="inline-block px-7 py-3 rounded-full text-xs font-bold tracking-wider uppercase text-zinc-900 bg-[#E8F4F5]/80 hover:bg-[#DCEEEF] border border-white shadow-xs transition-all"
            >
              BACK TO HOME
            </Link>
          </div>
        </LiquidGlass>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
export default function ExploreForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const methods = useForm<ExploreFormData>({
    resolver: zodResolver(exploreFormSchema),
    defaultValues: {
      fullName: '',
      countryCode: '+91',
      phone: '',
      gender: '',
      email: '',
      dob: '',
      raw_country: 'India',
      raw_state: '',
      raw_city: '',
      temp_lead_source: '',
      careChoice: '',
      selectedOption: '',
      unclear_health_description: '',
      extra_notes: '',
    },
  });

  const goNext = async () => {
    setApiError(null);
    if (await methods.trigger([...STEP1_FIELDS])) {
      setDirection(1);
      setStep(2);
      scrollToTop();
    }
  };

  const goBack = () => {
    setApiError(null);
    setDirection(-1);
    setStep(1);
    scrollToTop();
  };

  const onSubmit = async (data: ExploreFormData) => {
    if (isSubmitting) return; // guard against double submit (duplicate leads)
    setIsSubmitting(true);
    setApiError(null);

    try {
      const planMeta = data.selectedOption ? HEALTH_OPTION_PLAN_MAP[data.selectedOption] : null;

      const payload: CreateLeadPayload = {
        name: data.fullName.trim(),
        phone: buildFullPhone(data.countryCode, data.phone),
        gender: mapGender(data.gender),
        email: data.email?.trim() || undefined,
        dob: data.dob?.trim() || undefined,
        plan_code: planMeta?.planCode || undefined,
        temp_lead_source: data.temp_lead_source || undefined,
        raw_country: data.raw_country?.trim() || undefined,
        raw_state: data.raw_state?.trim() || undefined,
        raw_city: data.raw_city?.trim() || undefined,
        clear_health_description: data.selectedOption || undefined,
        unclear_health_description: data.unclear_health_description?.trim() || undefined,
        extra_notes: data.extra_notes?.trim() || undefined,
      };

      const lead = await createLead(payload);

      // Only the lead id goes to browser storage (no PII).
      if (lead?.id) {
        try {
          sessionStorage.setItem('joyzen_lead_id', lead.id);
        } catch {
          /* storage can be blocked (private mode); not fatal */
        }
      }

      if (planMeta?.route) {
        router.push(planMeta.route);
      } else {
        setSubmitted(true);
        scrollToTop(0);
      }
    } catch (err) {
      setApiError(formatApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative w-full min-h-screen pt-26 pb-36 sm:pb-48 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center select-none overflow-x-clip overflow-y-visible bg-transparent">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          <WaveGridBackground colorBase="#ffffff" colorHigh="#F4A27E" autoAnimate={false} waveAmplitude={0.2} waveMaxHeight={0.2} />
        </div>

        <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center mt-6">
          {!submitted && (
            <>
              <Heading step={step} />
              <Progress step={step} />
            </>
          )}

          {apiError && (
            <div role="alert" className="w-full mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <svg aria-hidden="true" className="w-5 h-5 shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold">Submission Notice</p>
                <p className="text-xs sm:text-sm mt-0.5">{apiError}</p>
              </div>
            </div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} noValidate className="relative w-full">
              {submitted ? (
                <SuccessCard />
              ) : (
                <AnimatePresence mode="wait" custom={direction}>
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      custom={direction}
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.35 }}
                      className="relative z-10"
                    >
                      <StepBasic />
                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={goNext}
                          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[24px] text-sm font-bold uppercase tracking-tight text-black bg-[#AEDEE44D] border border-[#AEDEE4] shadow-md hover:bg-[#AEDEE4]/60 transition-all cursor-pointer"
                        >
                          <span>Continue to Health Goals</span>
                          <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      custom={direction}
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.35 }}
                      className="relative z-10"
                    >
                      <StepGoals isSubmitting={isSubmitting} onBack={goBack} />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </form>
          </FormProvider>
        </div>

        {/* Watermark. Size lives on the outer box, so `contain` can't collapse it to 0x0. */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-4 sm:bottom-8 left-1/2 z-0 opacity-30 w-64 h-64 sm:w-80 sm:h-80 -translate-x-1/2"
          style={{ contain: 'layout paint' }}
        >
          <Image
            src="/joyzen-orange.png"
            alt=""
            fill
            sizes="(max-width: 640px) 256px, 320px"
            className="object-contain"
            loading="lazy"
          />
        </div>
      </section>  
    </MotionConfig>
  );
}