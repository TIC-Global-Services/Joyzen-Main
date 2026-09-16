'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import SpecularButton from '@/reuseable/specularButton';


export const exploreFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  age: z
    .string()
    .min(1, 'Age is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 120, 'Please enter a valid age'),
  gender: z.string().min(1, 'Please select your gender'),
  selectedOption: z.string().optional(),
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
// Gradient Border & Ambient Glow Pill Wrapper
// ----------------------------------------------------------------------
function GradientOptionWrapper({
  children,
  className = '',
  isSelected = false,
}: {
  children: React.ReactNode;
  className?: string;
  isSelected?: boolean;
}) {
  return (
    <div className={`relative group w-full ${className}`}>
      {/* Soft Ambient Glow BEHIND the Option Pill */}
      <div
        className={`absolute -inset-[3px] rounded-[32px] bg-gradient-to-r from-[#F6D7C6] via-[#F9E0AE] to-[#AEDEE4] blur-sm pointer-events-none transition-opacity duration-300 ${
          isSelected
            ? 'opacity-85'
            : 'opacity-0 group-hover:opacity-65 group-focus-within:opacity-75'
        }`}
      />

      {/* 1.5px Outer Frame forming the Gradient Border Stroke */}
      <div
        className={`relative p-[1.5px] rounded-[28px] transition-all duration-300 ${
          isSelected
            ? 'bg-gradient-to-r from-[#F6D7C6] via-[#F9E0AE] to-[#AEDEE4] shadow-[0_4px_24px_rgba(246,215,198,0.35)]'
            : 'bg-white/80 group-hover:bg-gradient-to-r group-hover:from-[#F6D7C6] group-hover:via-[#F9E0AE] group-hover:to-[#AEDEE4] group-focus-within:bg-gradient-to-r group-focus-within:from-[#F6D7C6] group-focus-within:via-[#F9E0AE] group-focus-within:to-[#AEDEE4]'
        }`}
      >
        {/* Inner Glassmorphic Pill Container */}
        <div
          className={`w-full h-full rounded-[26px] backdrop-blur-xs transition-all ${
            isSelected
              ? 'bg-[#FCFAF7]/95 text-zinc-900 font-bold'
              : 'bg-white/5 group-hover:bg-[#FCFAF7]/90 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_4px_16px_rgba(0,0,0,0.02)]'
          }`}
        >
          {children}
        </div>
      </div>
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
    formState: { errors },
  } = useForm<ExploreFormData>({
    resolver: zodResolver(exploreFormSchema),
    defaultValues: {
      fullName: '',
      age: '',
      gender: '',
      selectedOption: '',
    },
  });

  const selectedGender = watch('gender');
  const selectedOption = watch('selectedOption');

  // Options are shown based on gender selection
  const currentOptions =
    selectedGender === 'Male'
      ? maleOptions
      : selectedGender === 'Female'
      ? femaleOptions
      : null;

  const handleNextStep = async () => {
    const isStep1Valid = await trigger(['fullName', 'age', 'gender']);
    if (isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const onSubmit = (data: ExploreFormData) => {
    console.log('Explore Form Submitted:', data);
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setCurrentStep(1);
    setValue('selectedOption', '');
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
    <section className="relative w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center select-none overflow-hidden bg-[#FAF7F5]">
      {/* 1. Existing Background Hexagon Grid Mesh */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='97' viewBox='0 0 56 97' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 0l28 16v32L28 64 0 48V16zm0 97l28-16V49L28 33 0 49v32z' fill='%2000000' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 97px',
        }}
      />

      {/* 2. Soft Pastel Gradient Overlay on Top of Existing BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFC5CD]/55 via-[#E6D3F5]/45 to-[#B4ECF5]/60 pointer-events-none z-0" />

      {/* 3. Glowing Ambient Mesh Blobs */}
      <div className="absolute -top-36 -left-36 w-[650px] h-[650px] bg-[#FFAAA6]/60 rounded-full blur-[110px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#FFDFD3]/50 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-1/6 -right-24 w-[650px] h-[650px] bg-[#B2EBF2]/75 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute -bottom-36 right-0 w-[600px] h-[600px] bg-[#80DEEA]/50 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center mt-10">
        {/* Dynamic Heading & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
          <AnimatePresence mode="wait">
            {currentStep === 2 ? (
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
                  Select the option that matches your current health goals &amp; needs.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="heading-step1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-3"
              >
                <h1 className="text-[40px] sm:text-4xl lg:text-[46px] font-bold tracking-tight text-black leading-[1.18]">
                  Explore <br className='sm:hidden'/><span className="text-[#EF8F60]">Joyzen</span> models
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-zinc-600 font-normal leading-[1.4] max-w-xl mx-auto">
                  Discover personalized care programs designed around your journey, with structured guidance, continuous support, and plans that adapt as you progress.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stepper Progress Bar Header */}
        {!submitted && (
          <div className="w-full mb-6 p-4 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between px-2">
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
                  Basic Information
                </span>
              </div>

              <div className="w-8 h-[1px] bg-zinc-300 mx-2 hidden sm:block" />

              <div className="flex items-center space-x-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === 2
                      ? 'bg-[#EF8F60] text-white shadow-sm'
                      : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  2
                </span>
                <span className={`text-xs sm:text-sm font-semibold ${currentStep === 2 ? 'text-zinc-900' : 'text-zinc-500'}`}>
                  Tailored Needs
                </span>
              </div>
            </div>

            {/* Smooth Fill Progress Bar */}
            <div className="w-full h-1.5 bg-zinc-200/80 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#F6D7C6] via-[#EF8F60] to-[#AEDEE4]"
                initial={{ width: '50%' }}
                animate={{ width: currentStep === 1 ? '50%' : '100%' }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
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
                <h3 className="text-2xl font-bold text-zinc-900">Form Submitted Successfully!</h3>
                <p className="text-sm text-zinc-600 max-w-md mx-auto">
                  Thank you, <span className="font-semibold text-zinc-800">{watch('fullName')}</span>. Our specialized care team will review your responses and reach out shortly.
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
                        {...register('fullName')}
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
                        {...register('age')}
                        type="text"
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
                        className="w-full px-6 py-4 flex items-center justify-between text-left text-sm sm:text-base font-medium text-zinc-700 focus:outline-none"
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
                            className="px-6 pb-5 pt-2 space-y-2 border-t border-white/60 bg-white/60 backdrop-blur-2xl"
                          >
                            {['Female', 'Male', 'Prefer not to say'].map((option) => (
                              <div
                                key={option}
                                onClick={() => {
                                  setValue('gender', option, { shouldValidate: true });
                                  setValue('selectedOption', ''); // Reset option when gender changes
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
                      onClick={handleNextStep}
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
                  {/* Dynamic Options List */}
                  {currentOptions && currentOptions.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          {selectedGender} Health Description Options
                        </span>
                      </div>
                      {currentOptions.map((option) => {
                        const isItemChosen = selectedOption === option;
                        return (
                          <GradientOptionWrapper key={option} isSelected={isItemChosen}>
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
                  ) : (
                    <div className="p-6 text-center rounded-[28px] bg-white/5 backdrop-blur-xs border border-white/80 text-zinc-600 text-sm">
                      No specific options required for your gender selection. You can submit the form directly.
                    </div>
                  )}

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
                      SUBMIT FORM
                    </SpecularButton>
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