'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import SpecularButton from '@/reuseable/specularButton';
import Consultant from '@/components/q-form-2/conseltent';

export const exploreFormSchema = z
  .object({
    // Step 1
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(50, 'Full name must not exceed 50 characters')
      .regex(/^[a-zA-Z\s.'-]+$/, 'Name cannot contain numbers'),
    age: z
      .string()
      .min(1, 'Age is required')
      .max(3, 'Age cannot exceed 3 digits')
      .refine((val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0 && num < 120;
      }, 'Please enter a valid age (1-119)'),
    gender: z.string().min(1, 'Please select your gender'),

    // Step 2
    selectedOption: z.string().optional(),
    concern: z.string().optional(),

    // Step 3 (from q-form-2)
    phoneNumber: z
      .string()
      .length(10, 'Phone number must be exactly 10 digits')
      .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    city: z
      .string()
      .min(3, 'City must be at least 3 characters')
      .max(50, 'City must not exceed 50 characters'),
    country: z
      .string()
      .min(3, 'Country must be at least 3 characters')
      .max(50, 'Country must not exceed 50 characters'),
    occupation: z
      .string()
      .min(3, 'Occupation must be at least 3 characters')
      .max(50, 'Occupation must not exceed 50 characters'),
    periodCycleRegular: z.string().optional().or(z.literal('')),
    pcos: z.string().optional().or(z.literal('')),
    hormonal: z.string().min(1, 'Please select Yes or No'),
    thyroid: z.string().min(1, 'Please select Yes or No'),
    tryingToConceive: z
      .string()
      .max(500, 'Answer must not exceed 500 characters')
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.gender === 'Female') {
      if (!data.periodCycleRegular || data.periodCycleRegular.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['periodCycleRegular'],
          message: 'Please select Yes or No',
        });
      }
      if (!data.pcos || data.pcos.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pcos'],
          message: 'Please select Yes or No',
        });
      }
    }
  });

export type ExploreFormData = z.infer<typeof exploreFormSchema>;

const femaleOptions = [
  'I am a teenager and want to understand my body and periods',
  'I want to improve my overall health, lifestyle, and cycle',
  'I just want a doctor and guidance for my health',
  'I have PCOS, irregular periods, or hormone issues',
  'I am married and want to prepare my body before pregnancy',
  'I am getting married soon and want to prepare my body for a healthy pregnancy',
  'We are trying to conceive',
  'We have been trying for a while but no success',
  'We are planning pregnancy and want to prepare together',
];

const maleOptions = [
  'I want to improve my overall health, energy, and lifestyle',
  'I feel low energy, stressed, or not physically at my best',
  'I just want a personal doctor for guidance',
  'I have sexual health or testosterone concerns',
  'I have fertility issues or poor sperm reports',
  'I am getting married soon and want to prepare my health for good Performance and future fatherhood',
  'We are trying for a baby',
  'We are trying to conceive',
  'We have been trying for a while but no success',
  'We are planning pregnancy and want to prepare together',
];

// ----------------------------------------------------------------------
// Gradient Border & Ambient Glow Pill Wrapper with Moving Gradient
// ----------------------------------------------------------------------
function GradientOptionWrapper({
  children,
  className = '',
  isSelected = false,
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  isSelected?: boolean;
  index?: number;
}) {
  const speeds = [3.0, 4.2, 3.6, 4.8, 3.3, 4.0, 4.6, 3.8, 4.4];
  const duration = speeds[index % speeds.length];
  const isReverse = index % 2 === 1;
  const animName = isReverse ? 'gradientSweepRTL' : 'gradientSweepLTR';
  const delaySec = ((index * 0.9) % duration).toFixed(2);

  const gradientLayerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '200%',
    height: '100%',
    backgroundImage:
      'linear-gradient(90deg, #EF8F60 0%, #F6D7C6 14%, #AEDEE4 32%, #F9E0AE 50%, #B5ECF2 68%, #EF8F60 84%, #F6D7C6 100%)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    animation: `${animName} ${duration}s ease-in-out -${delaySec}s infinite`,
    willChange: 'transform',
    pointerEvents: 'none',
  };

  return (
    <div className={`relative group w-full ${className}`}>
      <style>{`
        @keyframes gradientSweepLTR {
          0% { transform: translate3d(0%, 0, 0); }
          50% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0%, 0, 0); }
        }
        @keyframes gradientSweepRTL {
          0% { transform: translate3d(-50%, 0, 0); }
          50% { transform: translate3d(0%, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

      {/* 1. Soft Ambient Glow */}
      <div
        className={`absolute -inset-[4px] rounded-[32px] overflow-hidden blur-[10px] pointer-events-none transition-opacity duration-300 ${
          isSelected ? 'opacity-85 scale-[1.01]' : 'opacity-0 group-hover:opacity-75'
        }`}
      >
        <div style={gradientLayerStyle} />
      </div>

      {/* 2. Outer Frame */}
      <div
        className={`relative p-[2px] rounded-[28px] overflow-hidden transition-all duration-300 ${
          isSelected
            ? 'shadow-[0_4px_24px_rgba(239,143,96,0.35)]'
            : 'shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.02)]'
        }`}
      >
        <div
          className={`absolute inset-0 rounded-[28px] bg-white/80 border border-white/90 transition-opacity duration-300 ${
            isSelected ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
          }`}
        />

        <div
          className={`transition-opacity duration-300 ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <div style={gradientLayerStyle} />
        </div>

        {/* 3. Inner Pill */}
        <div
          className={`relative z-10 w-full h-full rounded-[26px] overflow-hidden transition-all duration-300 ${
            isSelected
              ? 'bg-[#FCFAF7]/95 text-zinc-900 font-bold'
              : 'bg-white/85 group-hover:bg-[#FCFAF7]/90 text-zinc-700'
          }`}
        >
          <div
            className={`transition-opacity duration-300 ${
              isSelected ? 'opacity-25' : 'opacity-0 group-hover:opacity-20'
            }`}
          >
            <div style={gradientLayerStyle} />
          </div>

          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

          <div className="relative z-10 w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// GlassDropdown component for Yes/No selections
// ----------------------------------------------------------------------
function GlassDropdown({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="relative rounded-[28px] bg-white/5 backdrop-blur-xs border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] transition-all overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-left text-sm sm:text-base font-medium text-zinc-700 focus:outline-none cursor-pointer"
        >
          <span className={value ? 'font-medium text-zinc-900' : 'text-zinc-500'}>
            {value ? `${label} — ${value}` : label}
          </span>
          <span className="text-zinc-500 hover:text-zinc-800 transition-colors">
            {isOpen ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-6 pb-4 pt-1 space-y-1 border-t border-white/60 bg-white/40 backdrop-blur-md"
            >
              {['Yes', 'No'].map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`text-sm sm:text-base cursor-pointer py-2 px-3 rounded-xl transition-colors ${
                    value === option
                      ? 'font-bold text-zinc-900 bg-white/60'
                      : 'font-medium text-zinc-600 hover:text-zinc-900 hover:bg-white/30'
                  }`}
                >
                  {option}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{error}</p>}
    </div>
  );
}

export default function ExploreForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [genderOpen, setGenderOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm<ExploreFormData>({
    resolver: zodResolver(exploreFormSchema),
    defaultValues: {
      fullName: '',
      age: '',
      gender: '',
      selectedOption: '',
      concern: '',
      phoneNumber: '',
      email: '',
      city: '',
      country: '',
      occupation: '',
      periodCycleRegular: '',
      pcos: '',
      hormonal: '',
      thyroid: '',
      tryingToConceive: '',
    },
  });

  const selectedGender = watch('gender');
  const selectedOption = watch('selectedOption');
  const periodCycleValue = watch('periodCycleRegular');
  const pcosValue = watch('pcos');
  const hormonalValue = watch('hormonal');
  const thyroidValue = watch('thyroid');

  // Options are shown based on gender selection
  const currentOptions =
    selectedGender === 'Male'
      ? maleOptions
      : selectedGender === 'Female'
        ? femaleOptions
        : null;

  const handleNextStep1 = async () => {
    const isStep1Valid = await trigger(['fullName', 'age', 'gender']);
    if (isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const handleNextStep2 = () => {
    setCurrentStep(3);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = (data: ExploreFormData) => {
    console.log('Explore Form Submitted (Step 3 Save):', data);
    setSubmitted(true);
  };

  const resetForm = () => {
    reset();
    setSubmitted(false);
    setCurrentStep(1);
  };

  const stepVariants = {
    hidden: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 30 : -30,
    }),
    visible: {
      opacity: 1,
      x: 0,
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -30 : 30,
    }),
  };

  return (
    <section className="relative w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center select-none overflow-hidden ">
      {/* Dynamic Animated Background: Vibrant Pastel, Full Edge-to-Edge Color Sweep */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#FCFAF7]/20">
        <motion.div
          className="absolute top-0 -left-[60vw] w-[220vw] h-full opacity-60 blur-[35px]"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(250,237,150,0.65) 0%, rgba(255,218,195,0.6) 25%, rgba(235,208,245,0.55) 50%, rgba(185,228,252,0.65) 75%, rgba(250,237,150,0.65) 100%)',
            backgroundSize: '100% 100%',
          }}
          animate={{
            x: ['0vw', '60vw', '0vw'],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute top-1/6 -left-36 w-[880px] h-[880px] rounded-full blur-[130px]"
          style={{
            background:
              'radial-gradient(circle, rgba(250,237,150,0.7) 0%, rgba(255,218,195,0.55) 50%, transparent 75%)',
          }}
          animate={{
            x: ['0vw', '75vw', '0vw'],
            y: ['0vh', '14vh', '0vh'],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute top-1/4 -right-36 w-[920px] h-[920px] rounded-full blur-[130px]"
          style={{
            background:
              'radial-gradient(circle, rgba(185,228,252,0.7) 0%, rgba(235,208,245,0.55) 50%, transparent 75%)',
          }}
          animate={{
            x: ['0vw', '-75vw', '0vw'],
            y: ['0vh', '-12vh', '0vh'],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute top-2/3 -left-32 w-[780px] h-[780px] rounded-full blur-[130px]"
          style={{
            background:
              'radial-gradient(circle, rgba(255,208,185,0.6) 0%, rgba(250,237,150,0.45) 50%, transparent 75%)',
          }}
          animate={{
            x: ['0vw', '70vw', '0vw'],
            y: ['0vh', '-8vh', '0vh'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.8,
          }}
        />

        <motion.div
          className="absolute -top-32 -right-32 w-[820px] h-[820px] rounded-full blur-[130px]"
          style={{
            background:
              'radial-gradient(circle, rgba(195,242,246,0.65) 0%, rgba(235,208,245,0.45) 50%, transparent 75%)',
          }}
          animate={{
            x: ['0vw', '-70vw', '0vw'],
            y: ['0vh', '10vh', '0vh'],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.2,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center mt-10">
        {/* Dynamic Heading & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="heading-step1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-3"
              >
                <h1 className="text-[40px] sm:text-4xl lg:text-[46px] font-bold tracking-tight text-black leading-[1.18]">
                  Explore <br className="sm:hidden" />
                  <span className="text-[#EF8F60]">Joyzen</span> models
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-zinc-600 font-normal leading-[1.4] max-w-xl mx-auto">
                  Discover personalized care programs designed around your journey, with structured guidance, continuous support, and plans that adapt as you progress.
                </p>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="heading-step2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-2"
              >
                <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-black leading-[1.18]">
                  What best describes you right now?
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 font-medium">
                  {selectedGender === 'Prefer not to say'
                    ? 'Help us understand your health concerns so we can guide you effectively.'
                    : 'Select the option that matches your current health goals & needs.'}
                </p>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="heading-step3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-2"
              >
                <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-black leading-[1.18]">
                  To know more about you
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 font-medium">
                  Share your health details so our specialized care team can tailor the best personalized plan for you.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stepper Progress Bar Header */}
        {!submitted && (
          <div className="w-full mb-6 p-4 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between px-2">
              {/* Step 1 */}
              <div className="flex items-center space-x-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === 1
                      ? 'bg-[#EF8F60] text-white shadow-sm'
                      : 'bg-[#AEDEE4] text-[#036132]'
                  }`}
                >
                  1
                </span>
                <span className={`text-xs sm:text-sm font-semibold ${currentStep === 1 ? 'text-zinc-900' : 'text-zinc-500'}`}>
                  Basic Info
                </span>
              </div>

              <div className="w-4 sm:w-8 h-[1px] bg-zinc-300 mx-1 sm:mx-2" />

              {/* Step 2 */}
              <div className="flex items-center space-x-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === 2
                      ? 'bg-[#EF8F60] text-white shadow-sm'
                      : currentStep > 2
                        ? 'bg-[#AEDEE4] text-[#036132]'
                        : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  2
                </span>
                <span className={`text-xs sm:text-sm font-semibold ${currentStep === 2 ? 'text-zinc-900' : 'text-zinc-500'}`}>
                  Tailored Needs
                </span>
              </div>

              <div className="w-4 sm:w-8 h-[1px] bg-zinc-300 mx-1 sm:mx-2" />

              {/* Step 3 */}
              <div className="flex items-center space-x-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === 3
                      ? 'bg-[#EF8F60] text-white shadow-sm'
                      : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  3
                </span>
                <span className={`text-xs sm:text-sm font-semibold ${currentStep === 3 ? 'text-zinc-900' : 'text-zinc-500'}`}>
                  Health Profile
                </span>
              </div>
            </div>

            {/* Smooth Fill Progress Bar with active moving gradient */}
            <div className="w-full h-1.5 bg-zinc-200/80 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full rounded-full overflow-hidden relative"
                initial={{ width: '33.33%' }}
                animate={{
                  width: currentStep === 1 ? '33.33%' : currentStep === 2 ? '66.66%' : '100%',
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: '200%',
                    height: '100%',
                    backgroundImage:
                      'linear-gradient(90deg, #EF8F60 0%, #F6D7C6 25%, #AEDEE4 50%, #EF8F60 75%, #F6D7C6 100%)',
                    animation: 'gradientSweepLTR 3.5s linear infinite',
                  }}
                />
              </motion.div>
            </div>
          </div>
        )}

        {/* Interactive Form Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="relative w-full">
          {/* Background Joyzen Orange Logo Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none z-0 opacity-35 select-none">
            <Image
              src="/joyzen-orange.png"
              alt="Joyzen Orange Logo Watermark"
              fill
              className="object-contain"
            />
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 p-8 rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/90 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_12px_32px_rgba(0,0,0,0.04)] text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-[#AEDEE4]/50 text-[#036132] mx-auto flex items-center justify-center shadow-xs">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-zinc-900">Form Saved Successfully!</h3>
                <p className="text-sm text-zinc-600 max-w-md mx-auto">
                  Thank you, <span className="font-semibold text-zinc-800">{watch('fullName')}</span>. We have saved your information and our specialists will review your profile and reach out shortly.
                </p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="mt-4 px-7 py-3 rounded-full text-xs font-bold tracking-wide uppercase text-zinc-800 bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 transition-all cursor-pointer"
              >
                Submit Another Response
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait" custom={currentStep}>
              {/* STEP 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  custom={1}
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.35 }}
                  className="relative z-10 space-y-4"
                >
                  {/* Full Name Input */}
                  <div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-xs border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                      <input
                        {...register('fullName', {
                          onChange: (e) => {
                            e.target.value = e.target.value.replace(/[0-9]/g, '');
                          },
                        })}
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
                      />
                    </div>
                    {errors.fullName && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.fullName.message}</p>}
                  </div>

                  {/* Age Input */}
                  <div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-xs border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                      <input
                        {...register('age', {
                          onChange: (e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                          },
                        })}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={3}
                        placeholder="Age"
                        className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
                      />
                    </div>
                    {errors.age && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.age.message}</p>}
                  </div>

                  {/* Gender Custom Dropdown */}
                  <div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-xs border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] transition-all overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setGenderOpen(!genderOpen)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left text-sm sm:text-base font-medium text-zinc-700 focus:outline-none cursor-pointer"
                      >
                        <span>{selectedGender || 'Gender'}</span>
                        <span className="text-zinc-500 hover:text-zinc-800 transition-colors">
                          {genderOpen ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </span>
                      </button>

                      {/* Dropdown Options */}
                      <AnimatePresence>
                        {genderOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="px-6 pb-5 pt-2 space-y-2 border-t border-white/60 bg-white/5 backdrop-blur-xs"
                          >
                            {['Female', 'Male', 'Prefer not to say'].map((option) => (
                              <div
                                key={option}
                                onClick={() => {
                                  setValue('gender', option, { shouldValidate: true });
                                  setValue('selectedOption', '');
                                  setValue('concern', '');
                                  setGenderOpen(false);
                                }}
                                className={`text-sm sm:text-base cursor-pointer py-1.5 transition-colors ${
                                  selectedGender === option
                                    ? 'font-bold text-zinc-900'
                                    : 'font-medium text-zinc-500 hover:text-zinc-900'
                                }`}
                              >
                                {option}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {errors.gender && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.gender.message}</p>}
                  </div>

                  {/* Step 1 Action Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={handleNextStep1}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[24px] text-sm font-bold uppercase tracking-tight text-black bg-[#AEDEE44D] border border-[#AEDEE4] backdrop-blur-xs shadow-md hover:bg-[#AEDEE4]/60 transition-all cursor-pointer"
                    >
                      <span>Continue</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Tailored Needs */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  custom={2}
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.35 }}
                  className="relative z-10 space-y-4"
                >
                  {/* Dynamic Options List (for Female and Male) */}
                  {currentOptions && currentOptions.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          {selectedGender} Health Description Options
                        </span>
                      </div>
                      {currentOptions.map((option, idx) => {
                        const isItemChosen = selectedOption === option;
                        return (
                          <GradientOptionWrapper key={option} isSelected={isItemChosen} index={idx}>
                            <button
                              type="button"
                              onClick={() => {
                                setValue('selectedOption', isItemChosen ? '' : option, { shouldValidate: true });
                              }}
                              className={`w-full text-center sm:text-left px-6 py-4 text-sm sm:text-base transition-colors rounded-[26px] ${
                                isItemChosen ? 'font-bold text-zinc-900' : 'font-medium text-zinc-700 hover:text-zinc-900'
                              }`}
                            >
                              {option}
                            </button>
                          </GradientOptionWrapper>
                        );
                      })}
                    </div>
                  )}

                  {/* "Don't know what happening?" extra input text area for BOTH men and female (and prefer not to say) */}
                  <div className="space-y-3 pt-2">
                    <div className="px-2 mb-1">
                      <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                        Don&apos;t know what happening?
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-0.5">
                        Tell us in your own words what you are experiencing.
                      </p>
                    </div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-xs border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                      <textarea
                        {...register('concern')}
                        rows={4}
                        placeholder="tell us what happening"
                        className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px] resize-none"
                      />
                    </div>
                  </div>

                  {/* Step 2 Action Buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-[24px] text-sm font-semibold text-zinc-700 bg-white/60 border border-white hover:bg-white transition-all cursor-pointer shadow-xs"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                      <span>Back</span>
                    </button>

                    <SpecularButton
                      type="button"
                      onClick={handleNextStep2}
                      size="md"
                      tint="#AEDEE44D"
                      tintOpacity={0.35}
                      textColor="#000000"
                      lineColor="#ffffff"
                      baseColor="#AEDEE44D"
                      radius={24}
                      className="font-bold text-sm uppercase tracking-tight px-8 py-3.5 shadow-md"
                    >
                      CONTINUE
                    </SpecularButton>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Complete Health Profile Questionnaire (from q-form-2/form.tsx) */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  custom={3}
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.35 }}
                  className="relative z-10 space-y-4"
                >
                  {/* Full Name Input (pre-filled from Step 1) */}
                  <div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-xs border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                      <input
                        {...register('fullName', {
                          onChange: (e) => {
                            e.target.value = e.target.value.replace(/[0-9]/g, '');
                          },
                        })}
                        type="text"
                        placeholder="Full Name"
                        maxLength={50}
                        className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
                      />
                    </div>
                    {errors.fullName && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.fullName.message}</p>}
                  </div>

                  {/* Age Input (pre-filled from Step 1) */}
                  <div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-xs border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                      <input
                        {...register('age', {
                          onChange: (e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                          },
                        })}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={3}
                        placeholder="Age"
                        className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
                      />
                    </div>
                    {errors.age && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.age.message}</p>}
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-xs border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                      <input
                        {...register('phoneNumber')}
                        type="tel"
                        placeholder="Phone number"
                        maxLength={10}
                        className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.phoneNumber.message}</p>}
                  </div>

                  {/* Email Input */}
                  <div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-xs border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="Email"
                        className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
                      />
                    </div>
                    {errors.email && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.email.message}</p>}
                  </div>

                  {/* City Input */}
                  <div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-xs border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                      <input
                        {...register('city')}
                        type="text"
                        placeholder="city"
                        maxLength={50}
                        className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
                      />
                    </div>
                    {errors.city && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.city.message}</p>}
                  </div>

                  {/* Country Input */}
                  <div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-xs border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                      <input
                        {...register('country')}
                        type="text"
                        placeholder="Country"
                        maxLength={50}
                        className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
                      />
                    </div>
                    {errors.country && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.country.message}</p>}
                  </div>

                  {/* Occupation Input */}
                  <div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-xs border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                      <input
                        {...register('occupation')}
                        type="text"
                        placeholder="Occupation"
                        maxLength={50}
                        className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
                      />
                    </div>
                    {errors.occupation && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.occupation.message}</p>}
                  </div>

                  {/* Dropdown 1: Period cycle regular? */}
                  {selectedGender !== 'Male' && (
                    <GlassDropdown
                      label="Period cycle regular?"
                      value={periodCycleValue || ''}
                      onChange={(val) => setValue('periodCycleRegular', val, { shouldValidate: true })}
                      error={errors.periodCycleRegular?.message}
                    />
                  )}

                  {/* Dropdown 2: PCOS */}
                  {selectedGender !== 'Male' && (
                    <GlassDropdown
                      label="PCOS"
                      value={pcosValue || ''}
                      onChange={(val) => setValue('pcos', val, { shouldValidate: true })}
                      error={errors.pcos?.message}
                    />
                  )}

                  {/* Dropdown 3: Hormonal */}
                  <GlassDropdown
                    label="Hormonal"
                    value={hormonalValue || ''}
                    onChange={(val) => setValue('hormonal', val, { shouldValidate: true })}
                    error={errors.hormonal?.message}
                  />

                  {/* Dropdown 4: Thyroid */}
                  <GlassDropdown
                    label="Thyroid"
                    value={thyroidValue || ''}
                    onChange={(val) => setValue('thyroid', val, { shouldValidate: true })}
                    error={errors.thyroid?.message}
                  />

                  {/* Section 2: Trying to Conceive? How long */}
                  <div className="pt-4 space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
                      Trying to Conceive? How long
                    </h2>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-xs border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                      <input
                        {...register('tryingToConceive')}
                        type="text"
                        placeholder="Your Answer"
                        maxLength={500}
                        className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
                      />
                    </div>
                    {errors.tryingToConceive && (
                      <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.tryingToConceive.message}</p>
                    )}
                  </div>

                  {/* Step 3 Action Buttons */}
                  <div className="flex items-center justify-between pt-6">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-[24px] text-sm font-semibold text-zinc-700 bg-white/60 border border-white hover:bg-white transition-all cursor-pointer shadow-xs"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                      <span>Back</span>
                    </button>

                    <SpecularButton
                      type="submit"
                      size="md"
                      tint="#AEDEE44D"
                      tintOpacity={0.35}
                      textColor="#000000"
                      lineColor="#ffffff"
                      baseColor="#AEDEE44D"
                      radius={24}
                      className="font-bold text-sm uppercase tracking-tight px-8 py-3.5 shadow-md"
                    >
                      SAVE
                    </SpecularButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </form>
      </div>

      {/* Consultant Calendar Section appears below when Step 3 is reached */}
      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative z-10 w-full  mt-12 sm:mt-16"
        >
          <Consultant />
        </motion.div>
      )}
    </section>
  );
}