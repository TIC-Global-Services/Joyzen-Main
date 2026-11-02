'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import SpecularButton from '@/reuseable/specularButton';

export const reproductiveCareSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  age: z
    .string()
    .min(1, 'Age is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 120, 'Please enter a valid age'),
  gender: z.string().min(1, 'Please select your gender'),
  careChoice: z.string().optional(),
  selectedOption: z.string().optional(),
  temp_lead_source: z.string().optional(),
  unclear_health_description: z.string().optional(),
  extra_notes: z.string().optional(),
});

export type ReproductiveCareFormData = z.infer<typeof reproductiveCareSchema>;

export const generalCareSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  age: z
    .string()
    .min(1, 'Age is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 120, 'Please enter a valid age'),
  gender: z.string().min(1, 'Please select your gender'),
  concern: z.string().min(3, 'Please describe your health concern'),
  specialist: z.string().min(1, 'Please select a specialist'),
  temp_lead_source: z.string().optional(),
  unclear_health_description: z.string().optional(),
  extra_notes: z.string().optional(),
});

export type GeneralCareFormData = z.infer<typeof generalCareSchema>;

export const femaleOptions = [
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

export const maleOptions = [
  'I want to improve my overall health, energy, and lifestyle',
  'I feel low energy, stressed, or not physically at my best',
  'I just want a personal doctor for guidance',
  'I have sexual health or testosterone concerns',
  'I have fertility issues or poor sperm reports',
  'I am getting married soon and want to prepare my health for good performance and future fatherhood',
  'We are planning for a baby',
  'We are trying to conceive',
  'We have been trying for a while but no success',
  'We are planning pregnancy and want to prepare together',
];

export const coupleOptions = [
  'We are planning pregnancy and want to prepare together',
  'We are trying to conceive',
  'We have been trying for a while but no success',
];

export const leadSourceOptions = [
  'Instagram',
  'Facebook',
  'Google Search',
  'Friend / Family Referral',
  'Doctor / Healthcare Professional',
  'LinkedIn',
  'YouTube',
  'Other',
];

export const OPTION_PLAN_MAP: Record<string, { plan: string; route: string }> = {
  // Female options
  'I am a teenager and want to understand my body and periods': { plan: 'LUNA', route: '/luna' },
  'I want to improve my overall health, lifestyle, and cycle': { plan: 'LYRA', route: '/lyra' },
  'I just want a doctor and guidance for my health': { plan: 'LYRA', route: '/lyra' },
  'I have PCOS, irregular periods, or hormone issues': { plan: 'CALA', route: '/cala' },
  'I am married and want to prepare my body before pregnancy': { plan: 'EVE', route: '/eve' },
  'I am getting married soon and want to prepare my body for a healthy pregnancy': { plan: 'EVE', route: '/eve' },
  'We are trying to conceive': { plan: 'VITA', route: '/vita' },
  'We have been trying for a while but no success': { plan: 'VITA', route: '/vita' },
  'We are planning pregnancy and want to prepare together': { plan: 'EVE + GENESIS', route: '/eve-genesis' },

  // Male options
  'I want to improve my overall health, energy, and lifestyle': { plan: 'CORE', route: '/core' },
  'I feel low energy, stressed, or not physically at my best': { plan: 'CORE', route: '/core' },
  'I just want a personal doctor for guidance': { plan: 'CORE', route: '/core' },
  'I have sexual health or testosterone concerns': { plan: 'ATLAS', route: '/atlas' },
  'I have fertility issues or poor sperm reports': { plan: 'ATLAS', route: '/atlas' },
  'I am getting married soon and want to prepare my health for good performance and future fatherhood': { plan: 'GENESIS', route: '/genesis' },
  'We are planning for a baby': { plan: 'VITA', route: '/vita' },
  'We are trying for a baby': { plan: 'VITA', route: '/vita' },

  // Legacy mappings for robustness
  'I want to improve my overall health, lifestyle, and vitality': { plan: 'CORE', route: '/core' },
  'I have hormone issues, low energy, or fertility concerns': { plan: 'ATLAS', route: '/atlas' },
  'I am married and want to prepare my health before pregnancy': { plan: 'GENESIS', route: '/genesis' },
  'I am getting married soon and want to prepare for a healthy pregnancy': { plan: 'GENESIS', route: '/genesis' },
};

/**
 * GradientInputWrapper renders a crisp multi-color pastel gradient stroke on the border
 * of option pills on hover, focus-within, and when selected.
 */
function GradientInputWrapper({
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
      {/* Soft Ambient Glow BEHIND the pill */}
      <div
        className={`absolute -inset-[5px] rounded-[30px] bg-gradient-to-r from-[#F6D7C6] via-[#F9E0AE] to-[#AEDEE4] blur-sm pointer-events-none transition-opacity duration-300 ${
          isSelected
            ? 'opacity-85'
            : 'opacity-0 group-hover:opacity-60 group-focus-within:opacity-70'
        }`}
      />

      {/* 1.5px Outer Wrapper forming the Gradient Border Stroke */}
      <div
        className={`relative p-[5px] rounded-[28px] transition-all duration-300 ${
          isSelected
            ? 'bg-gradient-to-r from-[#F6D7C6] via-[#F9E0AE] to-[#AEDEE4] '
            : 'bg-white/80 group-hover:bg-gradient-to-r group-hover:from-[#F6D7C6] group-hover:via-[#F9E0AE] group-hover:to-[#AEDEE4] group-focus-within:bg-gradient-to-r group-focus-within:from-[#F6D7C6] group-focus-within:via-[#F9E0AE] group-focus-within:to-[#AEDEE4]'
        }`}
      >
        {/* Inner Pill Container */}
        <div
          className={`w-full h-full rounded-[26px] backdrop-blur-md transition-all ${
            isSelected
              ? 'bg-[#FCFAF7] text-zinc-900 font-bold'
              : 'bg-[#FCFAF7]/90 group-hover:bg-[#FCFAF7] shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_4px_16px_rgba(0,0,0,0.02)]'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function PricingForms() {
  const [activeTab, setActiveTab] = useState<'reproductive' | 'general'>('reproductive');

  return (
    <section className="relative w-full py-10 sm:py-20 px-[5%] select-none overflow-hidden">
      {/* Ambient Glass Glow Behind Forms */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial from-[#AEDEE4]/35 via-[#F6D7C6]/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="flex flex-col items-center">
        {/* Top Glass Tab Bar Switcher */}
        <div className="inline-flex items-center p-1.5 rounded-full bg-white/40 backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('reproductive')}
            className={`px-6 sm:px-8 py-1.5 md:py-2 rounded-full cursor-pointer text-lg md:text-2xl font-semibold transition-all duration-300 ${
              activeTab === 'reproductive'
                ? 'bg-white/90 text-[#036132] shadow-[0_4px_16px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] border border-white/90'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Reproductive Care
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-6 sm:px-8 py-2 rounded-full cursor-pointer text-base md:text-2xl font-semibold transition-all duration-300 ${
              activeTab === 'general'
                ? 'bg-white/90 text-[#036132] shadow-[0_4px_16px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] border border-white/90'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            General Care
          </button>
        </div>

        {/* Form Container with Animated Tab Switch */}
        <AnimatePresence mode="wait">
          {activeTab === 'reproductive' ? (
            <motion.div
              key="reproductive-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center"
            >
              {/* Heading & Subtitle */}
              <div className="text-center max-w-4xl mx-auto mb-10">
                <h2 className="text-[2rem] sm:text-3xl lg:text-[40px] font-bold tracking-tight text-black leading-[1.2] mb-4">
                  Going through <br className='sm:hidden'/>reproductive health problems?<br className='sm:hidden'/> view our plans here.
                </h2>
                <p className="text-xl sm:text-[22px] text-black font-normal leading-[1.2]">
                  Designed personally for your<br className='sm:hidden'/> reproductive health taken <br className='hidden sm:block'/> care by your <br className='sm:hidden'/> own doctor.
                </p>
              </div>

              {/* Form 1 Component */}
              <ReproductiveCareForm />
            </motion.div>
          ) : (
            <motion.div
              key="general-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center"
            >
              {/* Heading & Subtitle */}
              <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
                <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold tracking-tight text-black leading-[1.2]">
                  One place for your health
                </h2>
                <p className="text-base sm:text-[22px] text-zinc-600 font-normal leading-[1.2]">
                  From heart, bones &amp; joints to internal health and beyond- expert care, personalized for you.
                </p>
              </div>

              {/* Form 2 Component */}
              <GeneralCareForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ReproductiveCareForm() {
  const router = useRouter();
  const [genderOpen, setGenderOpen] = useState(false);
  const [leadSourceOpen, setLeadSourceOpen] = useState(false);
  const [careChoice, setCareChoice] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReproductiveCareFormData>({
    resolver: zodResolver(reproductiveCareSchema),
    defaultValues: {
      fullName: '',
      age: '',
      gender: '',
      careChoice: '',
      selectedOption: '',
      temp_lead_source: '',
      unclear_health_description: '',
      extra_notes: '',
    },
  });

  const selectedGender = watch('gender');
  const selectedOption = watch('selectedOption');
  const selectedLeadSource = watch('temp_lead_source');

  // Determine which options to display based on gender & careChoice for 'Prefer not to say'
  let currentOptions: string[] | null = null;
  let optionsHeading = '';

  if (selectedGender === 'Female') {
    currentOptions = femaleOptions;
    optionsHeading = 'Female Health Options';
  } else if (selectedGender === 'Male') {
    currentOptions = maleOptions;
    optionsHeading = 'Male Health Options';
  } else if (selectedGender === 'Prefer not to say') {
    if (careChoice === "Women's health") {
      currentOptions = femaleOptions;
      optionsHeading = "Women's Health Options";
    } else if (careChoice === "Men's health") {
      currentOptions = maleOptions;
      optionsHeading = "Men's Health Options";
    } else if (careChoice === 'Care for us as a couple') {
      currentOptions = coupleOptions;
      optionsHeading = 'Couple Care Options';
    }
  }

  const onSubmit = (data: ReproductiveCareFormData) => {
    console.log('Reproductive Care Form Submitted (API Payload):', {
      fullName: data.fullName,
      age: data.age,
      gender: data.gender,
      careChoice: data.careChoice || '',
      selectedOption: data.selectedOption || '',
      temp_lead_source: data.temp_lead_source || '',
      unclear_health_description: data.unclear_health_description || '',
      extra_notes: data.extra_notes || '',
    });

    const targetRoute = data.selectedOption ? OPTION_PLAN_MAP[data.selectedOption]?.route : null;
    if (targetRoute) {
      router.push(targetRoute);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative w-full max-w-2xl mt-5 px-[5%] sm:px-0">
      {/* Background Joyzen Orange Logo Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none z-0 opacity-40 select-none">
        <Image src="/joyzen-orange.png" alt="Joyzen Orange Logo Watermark" fill className="object-contain" />
      </div>

      {submitted ? (
        <div className="relative z-10 p-8 rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_12px_32px_rgba(0,0,0,0.04)] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#AEDEE4]/40 text-[#036132] mx-auto flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-zinc-900">Form Submitted Successfully</h3>
          <p className="text-sm text-zinc-600">Our care team will reach out to tailor your reproductive care plan.</p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 px-6 py-2 rounded-full cursor-pointer text-xs font-semibold text-zinc-800 bg-white/80 border border-white shadow-xs"
          >
            Submit Another Query
          </button>
        </div>
      ) : (
        <div className="relative z-10 space-y-4">
          {/* Full Name Glassmorphic Input */}
          <div>
            <div className="relative rounded-[28px] bg-white/5 backdrop-blur-[2px] border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:bg-white/5 focus-within:border-[#95C1E2] transition-all">
              <input
                {...register('fullName')}
                type="text"
                placeholder="Full Name"
                className="w-full px-6 py-4 text-sm sm:text-base font-medium text-[#6E6E6E] placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
              />
            </div>
            {errors.fullName && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.fullName.message}</p>}
          </div>

          {/* Age Glassmorphic Input */}
          <div>
            <div className="relative rounded-[28px] bg-white/5 backdrop-blur-[2px] border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:bg-white/5 focus-within:border-[#95C1E2] transition-all">
              <input
                {...register('age')}
                type="text"
                placeholder="Age"
                className="w-full px-6 py-4 text-sm sm:text-base font-medium text-[#6E6E6E] placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
              />
            </div>
            {errors.age && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.age.message}</p>}
          </div>

          {/* Gender Glassmorphic Custom Select Dropdown */}
          <div>
            <div className="relative rounded-[28px] bg-white/5 backdrop-blur-[2px] border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] transition-all overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setGenderOpen(!genderOpen);
                  setLeadSourceOpen(false);
                }}
                className="w-full px-6 py-4 flex cursor-pointer items-center justify-between text-left text-sm sm:text-base font-medium text-zinc-700 focus:outline-none"
              >
                <span className={selectedGender ? 'text-zinc-900 font-medium' : 'text-zinc-400'}>
                  {selectedGender || 'Gender'}
                </span>
                <span className="text-[#6E6E6E] hover:text-zinc-800 transition-colors">
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
                          setValue('selectedOption', ''); // Reset selected option when gender changes
                          setValue('careChoice', '');
                          setCareChoice('');
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

          {/* Sub-choice when 'Prefer not to say' is selected */}
          <AnimatePresence>
            {selectedGender === 'Prefer not to say' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="pt-1 pb-1 space-y-2 overflow-hidden"
              >
                <div className="px-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    What care are you looking for?
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: "Women's health", label: "Women's health" },
                    { id: "Men's health", label: "Men's health" },
                    { id: 'Care for us as a couple', label: 'Care for us as a couple' },
                  ].map((choice) => {
                    const isChosen = careChoice === choice.id;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => {
                          const next = isChosen ? '' : choice.id;
                          setCareChoice(next);
                          setValue('careChoice', next);
                          setValue('selectedOption', ''); // Reset option when careChoice changes
                        }}
                        className={`py-3 px-4 rounded-[20px] text-xs sm:text-sm font-semibold transition-all cursor-pointer border text-center ${
                          isChosen
                            ? 'bg-[#036132] text-white border-[#036132] shadow-sm'
                            : 'bg-white/40 text-zinc-700 border-white/80 hover:bg-white/70'
                        }`}
                      >
                        {choice.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic Reproductive Options List */}
          <AnimatePresence mode="wait">
            {currentOptions && currentOptions.length > 0 && (
              <motion.div
                key={`${selectedGender}-${careChoice}`}
                initial={{ opacity: 0, height: 0, y: 10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="pt-2 space-y-3 overflow-hidden"
              >
                <div className="flex items-center justify-between px-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {optionsHeading}
                  </span>
                </div>
                {currentOptions.map((option) => {
                  const isItemChosen = selectedOption === option;
                  const planMeta = OPTION_PLAN_MAP[option];
                  return (
                    <GradientInputWrapper key={option} isSelected={isItemChosen}>
                      <button
                        type="button"
                        onClick={() => {
                          setValue('selectedOption', isItemChosen ? '' : option, { shouldValidate: true });
                        }}
                        className={`w-full flex items-center justify-between text-left px-6 py-4 cursor-pointer text-sm sm:text-base transition-colors rounded-[26px] gap-3 ${
                          isItemChosen ? 'font-bold text-zinc-900' : 'font-medium text-[#6E6E6E] hover:text-zinc-900'
                        }`}
                      >
                        <span className="flex-1">{option}</span>
                        {planMeta && (
                          <span
                            className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors ${
                              isItemChosen
                                ? 'bg-[#036132] text-white shadow-xs'
                                : 'bg-zinc-200/70 text-zinc-600 group-hover:bg-[#AEDEE4]/40 group-hover:text-[#036132]'
                            }`}
                          >
                            {planMeta.plan}
                          </span>
                        )}
                      </button>
                    </GradientInputWrapper>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* How did you hear about us? (temp_lead_source) Dropdown */}
          <div>
            <div className="relative rounded-[28px] bg-white/5 backdrop-blur-[2px] border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] transition-all overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setLeadSourceOpen(!leadSourceOpen);
                  setGenderOpen(false);
                }}
                className="w-full px-6 py-4 flex cursor-pointer items-center justify-between text-left text-sm sm:text-base font-medium text-zinc-700 focus:outline-none"
              >
                <span className={selectedLeadSource ? 'text-zinc-900 font-medium' : 'text-zinc-400'}>
                  {selectedLeadSource || 'How did you hear about us?'}
                </span>
                <span className="text-[#6E6E6E] hover:text-zinc-800 transition-colors">
                  {leadSourceOpen ? (
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
                {leadSourceOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-6 pb-5 pt-2 space-y-2 border-t border-white/60 bg-white/60 backdrop-blur-2xl max-h-56 overflow-y-auto"
                  >
                    {leadSourceOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setValue('temp_lead_source', option, { shouldValidate: true });
                          setLeadSourceOpen(false);
                        }}
                        className={`text-sm sm:text-base cursor-pointer py-1.5 transition-colors ${
                          selectedLeadSource === option
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
          </div>

          {/* Unclear about concern (unclear_health_description) */}
          <div>
            <div className="relative rounded-[24px] bg-white/5 backdrop-blur-[2px] border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:bg-white/5 focus-within:border-[#95C1E2] transition-all p-2">
              <textarea
                {...register('unclear_health_description')}
                rows={3}
                placeholder="Unclear about concern"
                className="w-full px-4 py-2 text-sm sm:text-base font-medium text-[#6E6E6E] placeholder:text-zinc-400 bg-transparent outline-none resize-none"
              />
            </div>
          </div>

          {/* Message (extra_notes) */}
          <div>
            <div className="relative rounded-[24px] bg-white/5 backdrop-blur-[2px] border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:bg-white/5 focus-within:border-[#95C1E2] transition-all p-2">
              <textarea
                {...register('extra_notes')}
                rows={3}
                placeholder="Message"
                className="w-full px-4 py-2 text-sm sm:text-base font-medium text-[#6E6E6E] placeholder:text-zinc-400 bg-transparent outline-none resize-none"
              />
            </div>
          </div>

          {/* Submit Specular / Glass Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="font-bold text-sm uppercase cursor-pointer tracking-tight px-7 py-3.5 bg-[#AEDEE44D] border border-[#AEDEE44D] text-black rounded-[28px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] hover:bg-white/70 hover:border-[#AEDEE4] transition-all duration-300 cursor-pointer"
            >
              SUBMIT FORM
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

function GeneralCareForm() {
  const [genderOpen, setGenderOpen] = useState(false);
  const [specialistOpen, setSpecialistOpen] = useState(false);
  const [leadSourceOpen, setLeadSourceOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GeneralCareFormData>({
    resolver: zodResolver(generalCareSchema),
    defaultValues: {
      fullName: '',
      age: '',
      gender: '',
      concern: '',
      specialist: '',
      temp_lead_source: '',
      unclear_health_description: '',
      extra_notes: '',
    },
  });

  const selectedGender = watch('gender');
  const selectedSpecialist = watch('specialist');
  const selectedLeadSource = watch('temp_lead_source');

  const onSubmit = (data: GeneralCareFormData) => {
    console.log('General Care Form Submitted (API Payload):', {
      fullName: data.fullName,
      age: data.age,
      gender: data.gender,
      concern: data.concern,
      specialist: data.specialist,
      temp_lead_source: data.temp_lead_source || '',
      unclear_health_description: data.unclear_health_description || '',
      extra_notes: data.extra_notes || '',
    });
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative w-full max-w-xl space-y-4">
      {/* Background Joyzen Orange Logo Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none z-0 opacity-40 select-none">
        <Image src="/joyzen-orange.png" alt="Joyzen Orange Logo Watermark" fill className="object-contain" />
      </div>

      {submitted ? (
        <div className="relative z-10 p-8 rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_12px_32px_rgba(0,0,0,0.04)] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#AEDEE4]/40 text-[#036132] mx-auto flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-zinc-900">Query Received</h3>
          <p className="text-sm text-zinc-600">Our clarity team will connect you with your chosen specialist shortly.</p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 px-6 py-2 rounded-full text-xs cursor-pointer font-semibold text-zinc-800 bg-white/80 border border-white shadow-xs"
          >
            Submit Another Query
          </button>
        </div>
      ) : (
        <div className="relative z-10 space-y-4">
          {/* Full Name Glassmorphic Input */}
          <div>
            <div className="relative rounded-[28px] bg-white/5 backdrop-blur-[2px] border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:bg-white/5 focus-within:border-[#95C1E2] transition-all">
              <input
                {...register('fullName')}
                type="text"
                placeholder="Full Name"
                className="w-full px-6 py-4 text-sm sm:text-base font-medium text-[#6E6E6E] placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
              />
            </div>
            {errors.fullName && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.fullName.message}</p>}
          </div>

          {/* Age Glassmorphic Input */}
          <div>
            <div className="relative rounded-[28px] bg-white/5 backdrop-blur-[2px] border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:bg-white/5 focus-within:border-[#95C1E2] transition-all">
              <input
                {...register('age')}
                type="text"
                placeholder="Age"
                className="w-full px-6 py-4 text-sm sm:text-base font-medium text-[#6E6E6E] placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
              />
            </div>
            {errors.age && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.age.message}</p>}
          </div>

          {/* Gender Custom Dropdown */}
          <div>
            <div className="relative rounded-[28px] bg-white/5 backdrop-blur-[2px] border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] transition-all overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setGenderOpen(!genderOpen);
                  setSpecialistOpen(false);
                  setLeadSourceOpen(false);
                }}
                className="w-full px-6 py-4 flex items-center cursor-pointer justify-between text-left text-sm sm:text-base font-medium text-[#6E6E6E] focus:outline-none"
              >
                <span className={selectedGender ? 'text-zinc-900 font-medium' : 'text-zinc-400'}>
                  {selectedGender || 'Gender'}
                </span>
                <span className="text-[#6E6E6E] hover:text-zinc-800 transition-colors">
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

              <AnimatePresence>
                {genderOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-6 pb-5 pt-2 space-y-2 border-t border-white/60 bg-white/5 backdrop-blur-[2px]"
                  >
                    {['Female', 'Male', 'Prefer not to say'].map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setValue('gender', option, { shouldValidate: true });
                          setGenderOpen(false);
                        }}
                        className={`text-sm sm:text-base cursor-pointer py-1.5 transition-colors ${
                          selectedGender === option
                            ? 'font-bold text-zinc-900'
                            : 'font-medium text-[#6E6E6E] hover:text-zinc-900'
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

          {/* Concern Input */}
          <div>
            <div className="relative rounded-[28px] bg-white/5 backdrop-blur-[2px] border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:bg-white/5 focus-within:border-[#95C1E2] transition-all">
              <input
                {...register('concern')}
                type="text"
                placeholder="Concern"
                className="w-full px-6 py-4 text-sm sm:text-base font-medium text-[#6E6E6E] placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
              />
            </div>
            {errors.concern && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.concern.message}</p>}
          </div>

          {/* Specialist Select Dropdown */}
          <div>
            <div className="relative rounded-[28px] bg-white/5 backdrop-blur-[2px] border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] transition-all overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setSpecialistOpen(!specialistOpen);
                  setGenderOpen(false);
                  setLeadSourceOpen(false);
                }}
                className="w-full px-6 py-4 flex cursor-pointer items-center justify-between text-left text-sm sm:text-base font-medium text-zinc-700 focus:outline-none"
              >
                <span className={selectedSpecialist ? 'text-zinc-900 font-medium' : 'text-zinc-400'}>
                  {selectedSpecialist || 'Who would you like to get in touch with?'}
                </span>
                <span className="text-zinc-400 hover:text-zinc-800 transition-colors">
                  {specialistOpen ? (
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
                {specialistOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-6 pb-5 pt-2 space-y-2 border-t border-white/60 bg-white/5 backdrop-blur-[2px]"
                  >
                    {['Cardiologist', 'rheumatologist', 'neurologist'].map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setValue('specialist', option, { shouldValidate: true });
                          setSpecialistOpen(false);
                        }}
                        className={`text-sm sm:text-base cursor-pointer py-1.5 transition-colors ${
                          selectedSpecialist === option
                            ? 'font-bold text-black'
                            : 'font-medium text-black hover:text-zinc-900'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {errors.specialist && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.specialist.message}</p>}
          </div>

          {/* How did you hear about us? (temp_lead_source) Dropdown */}
          <div>
            <div className="relative rounded-[28px] bg-white/5 backdrop-blur-[2px] border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] transition-all overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setLeadSourceOpen(!leadSourceOpen);
                  setGenderOpen(false);
                  setSpecialistOpen(false);
                }}
                className="w-full px-6 py-4 flex cursor-pointer items-center justify-between text-left text-sm sm:text-base font-medium text-zinc-700 focus:outline-none"
              >
                <span className={selectedLeadSource ? 'text-zinc-900 font-medium' : 'text-zinc-400'}>
                  {selectedLeadSource || 'How did you hear about us?'}
                </span>
                <span className="text-[#6E6E6E] hover:text-zinc-800 transition-colors">
                  {leadSourceOpen ? (
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
                {leadSourceOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-6 pb-5 pt-2 space-y-2 border-t border-white/60 bg-white/60 backdrop-blur-2xl max-h-56 overflow-y-auto"
                  >
                    {leadSourceOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setValue('temp_lead_source', option, { shouldValidate: true });
                          setLeadSourceOpen(false);
                        }}
                        className={`text-sm sm:text-base cursor-pointer py-1.5 transition-colors ${
                          selectedLeadSource === option
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
          </div>

          {/* Unclear about concern (unclear_health_description) */}
          <div>
            <div className="relative rounded-[24px] bg-white/5 backdrop-blur-[2px] border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:bg-white/5 focus-within:border-[#95C1E2] transition-all p-2">
              <textarea
                {...register('unclear_health_description')}
                rows={3}
                placeholder="Unclear about concern"
                className="w-full px-4 py-2 text-sm sm:text-base font-medium text-[#6E6E6E] placeholder:text-zinc-400 bg-transparent outline-none resize-none"
              />
            </div>
          </div>

          {/* Message (extra_notes) */}
          <div>
            <div className="relative rounded-[24px] bg-white/5 backdrop-blur-[2px] border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:bg-white/5 focus-within:border-[#95C1E2] transition-all p-2">
              <textarea
                {...register('extra_notes')}
                rows={3}
                placeholder="Message"
                className="w-full px-4 py-2 text-sm sm:text-base font-medium text-[#6E6E6E] placeholder:text-zinc-400 bg-transparent outline-none resize-none"
              />
            </div>
          </div>

          {/* Connect Specular Button */}
          <div className="flex justify-end pt-4">
            <SpecularButton
              type="submit"
              size="md"
              tint="#AEDEE44D"
              tintOpacity={0.35}
              textColor="#000000"
              lineColor="#ffffff"
              baseColor="#AEDEE44D"
              radius={24}
              className="font-bold text-sm uppercase tracking-tight px-7 py-4"
            >
              CONNECT WITH CLARITY TEAM
            </SpecularButton>
          </div>
        </div>
      )}
    </form>
  );
}
