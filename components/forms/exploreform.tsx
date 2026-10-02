'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
      .min(3, 'Full name must be at least 3 characters')
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
  const speeds = [3.2, 4.4, 3.6, 4.8, 3.4, 4.0, 4.6, 3.8, 4.2];
  const duration = speeds[index % speeds.length];
  const isReverse = index % 2 === 1;
  const animName = isReverse ? 'exploreGradientFlowReverse' : 'exploreGradientFlow';
  const delaySec = ((index * 0.7) % duration).toFixed(2);

  const gradientString =
    'linear-gradient(90deg, #EF8F60 0%, #F6D7C6 14%, #AEDEE4 32%, #F9E0AE 50%, #B5ECF2 68%, #EF8F60 84%, #F6D7C6 100%)';

  return (
    <div className={`relative group w-full ${className}`}>
      {/* Outer Frame with moving gradient border */}
      <div
        className={`relative p-[2px] rounded-[28px] transition-all duration-300 ${isSelected
          ? 'shadow-[0_4px_22px_rgba(239,143,96,0.35),0_0_12px_rgba(174,222,228,0.25)]'
          : 'shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.02)] group-hover:shadow-[0_4px_20px_rgba(239,143,96,0.22)]'
          }`}
        style={{
          backgroundImage: gradientString,
          backgroundSize: '200% 100%',
          animation: `${animName} ${duration}s ease-in-out -${delaySec}s infinite`,
          WebkitMaskImage: '-webkit-radial-gradient(white, black)',
          isolation: 'isolate',
        }}
      >
        {/* Soft default border overlay when not selected or hovered */}
        <div
          className={`absolute inset-0 rounded-[28px] bg-white/80 border border-white/90 transition-opacity duration-300 pointer-events-none ${isSelected ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
            }`}
        />

        {/* Inner Pill */}
        <div
          className={`relative z-10 w-full h-full rounded-[26px] overflow-hidden transition-all duration-300 ${isSelected
            ? 'bg-[#FCFAF7]/95 text-zinc-900 font-bold'
            : 'bg-white/90 group-hover:bg-[#FCFAF7]/95 text-zinc-700'
            }`}
          style={{
            WebkitMaskImage: '-webkit-radial-gradient(white, black)',
          }}
        >
          {/* Subtle moving pastel gradient tint inside pill */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${isSelected ? 'opacity-25' : 'opacity-0 group-hover:opacity-15'
              }`}
            style={{
              backgroundImage: gradientString,
              backgroundSize: '200% 100%',
              animation: `${animName} ${duration}s ease-in-out -${delaySec}s infinite`,
            }}
          />

          {/* Top highlight reflection */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent pointer-events-none rounded-t-[26px]" />

          {/* Pill content */}
          <div className="relative z-10 w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}


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
      <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] transition-all overflow-hidden">
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
              className="px-6 pb-4 pt-1 space-y-1 border-t border-white/60 bg-white/80 backdrop-blur-md"
            >
              {['Yes', 'No'].map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`text-sm sm:text-base cursor-pointer py-2 px-3 rounded-xl transition-colors ${value === option
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
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    <section className="relative w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center select-none overflow-hidden">
      {/* iOS-Safe Gradient Flow Keyframes */}
      <style>{`
        @keyframes exploreGradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes exploreGradientFlowReverse {
          0% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>

      {/* Dynamic Animated Background: Vibrant Pastel, Full Edge-to-Edge Color Sweep (iOS GPU Optimized) */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#FCFAF7]/20"
        style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)', isolation: 'isolate' }}
      >
        <motion.div
          className="absolute top-0 -left-[60vw] w-[220vw] h-full opacity-60 blur-[30px]"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(250,237,150,0.65) 0%, rgba(255,218,195,0.6) 25%, rgba(235,208,245,0.55) 50%, rgba(185,228,252,0.65) 75%, rgba(250,237,150,0.65) 100%)',
            backgroundSize: '100% 100%',
            willChange: 'transform',
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
          className="absolute top-1/6 -left-20 sm:-left-36 w-[340px] h-[340px] sm:w-[680px] sm:h-[680px] lg:w-[880px] lg:h-[880px] rounded-full blur-[45px] sm:blur-[80px] lg:blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, rgba(250,237,150,0.7) 0%, rgba(255,218,195,0.55) 45%, rgba(255,218,195,0) 75%)',
            willChange: 'transform',
          }}
          animate={{
            x: ['0vw', '70vw', '0vw'],
            y: ['0vh', '12vh', '0vh'],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute top-1/4 -right-20 sm:-right-36 w-[360px] h-[360px] sm:w-[700px] sm:h-[700px] lg:w-[920px] lg:h-[920px] rounded-full blur-[45px] sm:blur-[80px] lg:blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, rgba(185,228,252,0.7) 0%, rgba(235,208,245,0.55) 45%, rgba(235,208,245,0) 75%)',
            willChange: 'transform',
          }}
          animate={{
            x: ['0vw', '-70vw', '0vw'],
            y: ['0vh', '-10vh', '0vh'],
            scale: [1, 0.95, 1.08, 1],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute top-2/3 -left-16 sm:-left-32 w-[320px] h-[320px] sm:w-[620px] sm:h-[620px] lg:w-[780px] lg:h-[780px] rounded-full blur-[45px] sm:blur-[80px] lg:blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, rgba(255,208,185,0.6) 0%, rgba(250,237,150,0.45) 45%, rgba(250,237,150,0) 75%)',
            willChange: 'transform',
          }}
          animate={{
            x: ['0vw', '65vw', '0vw'],
            y: ['0vh', '-7vh', '0vh'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.8,
          }}
        />

        <motion.div
          className="absolute -top-20 sm:-top-32 -right-16 sm:-right-32 w-[340px] h-[340px] sm:w-[640px] sm:h-[640px] lg:w-[820px] lg:h-[820px] rounded-full blur-[45px] sm:blur-[80px] lg:blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, rgba(195,242,246,0.65) 0%, rgba(235,208,245,0.45) 45%, rgba(235,208,245,0) 75%)',
            willChange: 'transform',
          }}
          animate={{
            x: ['0vw', '-65vw', '0vw'],
            y: ['0vh', '9vh', '0vh'],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.2,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center mt-10">
        {/* Dynamic Heading & Subtitle */}
        {!submitted && (
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
                    Let's take the next step
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-600 font-medium">
                    You've told us a little about what you're looking for.<br className='hidden md:block' />
                    Now, share your contact details so our team can guide you from here.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Stepper Progress Bar Header */}
        {!submitted && (
          <div className="w-full mb-6 p-4 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between px-2">
              {/* Step 1 */}
              <div className="flex items-center space-x-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === 1
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
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === 2
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
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === 3
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
                className="h-full rounded-full"
                initial={{ width: '33.33%' }}
                animate={{
                  width: currentStep === 1 ? '33.33%' : currentStep === 2 ? '66.66%' : '100%',
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #EF8F60 0%, #F6D7C6 25%, #AEDEE4 50%, #EF8F60 75%, #F6D7C6 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'exploreGradientFlow 3.5s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        )}

        {/* Interactive Form Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="relative w-full">
          {/* Background Joyzen Orange Logo Watermark */}
          {!submitted && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none z-0 opacity-35 select-none">
              <Image
                src="/joyzen-orange.png"
                alt="Joyzen Orange Logo Watermark"
                fill
                className="object-contain"
              />
            </div>
          )}

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full flex flex-col items-center justify-center py-4"
            >
              {/* Heading from Image 2 */}
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-center text-zinc-950 mb-8 sm:mb-10">
                Confirmation. Your call is booked.
              </h1>

              {/* Confirmation Card from Image 2 */}
              <div className="w-full max-w-xl mx-auto p-10 sm:p-14 rounded-[36px] sm:rounded-[44px] bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_12px_36px_rgba(0,0,0,0.04)] relative overflow-hidden text-center">
                {/* Joyzen Orange Watermark Logo in background */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-72 sm:w-80 h-72 sm:h-80 pointer-events-none z-0 opacity-25 select-none">
                  <Image
                    src="/joyzen-orange.png"
                    alt="Joyzen Logo"
                    fill
                    className="object-contain"
                  />
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#EF8F60] tracking-tight mb-5 relative z-10">
                  You&apos;re all set
                </h2>

                <p className="text-base sm:text-lg text-zinc-800 font-medium leading-relaxed max-w-sm mx-auto mb-8 relative z-10">
                  Thank you for reaching out.
                  <br />
                  Our Clarity team will review your
                  <br />
                  information and get in touch with you.
                </p>

                <div className="relative z-10">
                  <Link
                    href="/"
                    className="inline-block px-7 py-3 rounded-full text-xs font-bold tracking-wider uppercase text-zinc-900 bg-[#E8F4F5]/80 hover:bg-[#DCEEEF] border border-white shadow-xs hover:shadow-sm transition-all cursor-pointer"
                  >
                    BACK TO HOME
                  </Link>
                </div>
              </div>
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
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
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
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
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
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] transition-all overflow-hidden">
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
                            className="px-6 pb-5 pt-2 space-y-2 border-t border-white/60 bg-white/80 backdrop-blur-md"
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
                                className={`text-sm sm:text-base cursor-pointer py-1.5 transition-colors ${selectedGender === option
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
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[24px] text-sm font-bold uppercase tracking-tight text-black bg-[#AEDEE44D] border border-[#AEDEE4] backdrop-blur-sm shadow-md hover:bg-[#AEDEE4]/60 transition-all cursor-pointer"
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
                              className={`w-full text-center sm:text-left px-6 py-4 text-sm sm:text-base transition-colors rounded-[26px] ${isItemChosen ? 'font-bold text-zinc-900' : 'font-medium text-zinc-700 hover:text-zinc-900'
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
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
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
                  {/* <div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
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
                  </div> */}

                  {/* Age Input (pre-filled from Step 1) */}
                  {/* <div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
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
                  </div> */}

                  {/* Phone Number Input */}
                  <div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
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
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
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
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
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
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
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
                  {/* <div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                      <input
                        {...register('occupation')}
                        type="text"
                        placeholder="Occupation"
                        maxLength={50}
                        className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
                      />
                    </div>
                    {errors.occupation && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.occupation.message}</p>}
                  </div> */}

                  {/* Dropdown 1: Period cycle regular? */}
                  {/* {selectedGender !== 'Male' && (
                    <GlassDropdown
                      label="Period cycle regular?"
                      value={periodCycleValue || ''}
                      onChange={(val) => setValue('periodCycleRegular', val, { shouldValidate: true })}
                      error={errors.periodCycleRegular?.message}
                    />
                  )} */}

                  {/* Dropdown 2: PCOS */}
                  {/* {selectedGender !== 'Male' && (
                    <GlassDropdown
                      label="PCOS"
                      value={pcosValue || ''}
                      onChange={(val) => setValue('pcos', val, { shouldValidate: true })}
                      error={errors.pcos?.message}
                    />
                  )} */}

                  {/* Dropdown 3: Hormonal */}
                  {/* <GlassDropdown
                    label="Hormonal"
                    value={hormonalValue || ''}
                    onChange={(val) => setValue('hormonal', val, { shouldValidate: true })}
                    error={errors.hormonal?.message}
                  /> */}

                  {/* Dropdown 4: Thyroid */}
                  {/* <GlassDropdown
                    label="Thyroid"
                    value={thyroidValue || ''}
                    onChange={(val) => setValue('thyroid', val, { shouldValidate: true })}
                    error={errors.thyroid?.message}
                  /> */}

                  {/* Section 2: Anything you'd like us to know? */}
                  <div className="pt-6 space-y-3 w-full">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 text-center">
                      Anything you&apos;d like us to know?
                    </h2>
                    <div className="relative rounded-[28px] bg-white/40 backdrop-blur-md border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                      <textarea
                        {...register('tryingToConceive')}
                        id="concern-textarea"
                        rows={4}
                        placeholder="Tell us anything you'd like to share before we get in touch..."
                        maxLength={500}
                        className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px] resize-none"
                      />
                    </div>
                    {errors.tryingToConceive && (
                      <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.tryingToConceive.message}</p>
                    )}
                  </div>

                  {/* Consultant Section (Calendar + Continue & Save + Not Sure What's Happening?) */}
                  <div className="pt-8 w-full">
                    <Consultant
                      onContinueAndSave={() => {
                        handleSubmit(onSubmit, (formErrors) => {
                          const firstErrorField = Object.keys(formErrors)[0];
                          const el = document.getElementsByName(firstErrorField)[0];
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            (el as HTMLElement).focus();
                          }
                        })();
                      }}
                      onBack={handlePrevStep}
                      showSaveButton={true}
                      saveButtonText="CONTINUE & SAVE"
                      onGetInTouch={() => {
                        const el = document.getElementById('concern-textarea');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          el.focus();
                        }
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </form>
      </div>
    </section>
  );
}