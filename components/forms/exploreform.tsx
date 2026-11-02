'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import SpecularButton from '@/reuseable/specularButton';
import { LiquidGlass } from '@liquidglass/react';
import {
  COUNTRIES,
  getStatesByCountry,
  getCitiesByState,
} from '@/lib/utils';
import {
  createLead,
  formatApiError,
  type CreateLeadPayload,
  type GenderType,
} from '@/lib/joyzenApi';

// ----------------------------------------------------------------------
// Schema Definition
// ----------------------------------------------------------------------
export const exploreFormSchema = z.object({
  // Step 1: Basic & Location Info
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name cannot contain numbers'),
  countryCode: z.string().min(1, 'Country code is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine((val) => {
      const trimmed = val.trim();
      if (!trimmed) return false;
      // Allow digits, spaces, hyphens, parentheses, and leading plus
      if (!/^[\d\s\-\(\)\+]+$/.test(trimmed)) {
        return false;
      }
      const digits = trimmed.replace(/\D/g, '');
      return digits.length >= 7 && digits.length <= 15;
    }, 'Please enter a valid phone number (7-15 digits)'),
  gender: z.string().min(1, 'Please select your gender'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid date of birth (YYYY-MM-DD)')
    .optional()
    .or(z.literal('')),
  raw_country: z.string().max(50).optional().or(z.literal('')),
  raw_state: z.string().max(50).optional().or(z.literal('')),
  raw_city: z.string().max(50).optional().or(z.literal('')),
  temp_lead_source: z.string().optional().or(z.literal('')),

  // Step 2: Tailored Health Needs
  careChoice: z.string().optional().or(z.literal('')),
  selectedOption: z.string().optional().or(z.literal('')),
  unclear_health_description: z.string().optional().or(z.literal('')),
  extra_notes: z.string().optional().or(z.literal('')),
});

export type ExploreFormData = z.infer<typeof exploreFormSchema>;

// ----------------------------------------------------------------------
// Option Lists & Plan Mappings (from spec files)
// ----------------------------------------------------------------------
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

export const countryCodeOptions = [
  { code: '+91', country: 'IN', label: '+91 (India)' },
  { code: '+1', country: 'US', label: '+1 (US/CA)' },
  { code: '+44', country: 'UK', label: '+44 (UK)' },
  { code: '+971', country: 'AE', label: '+971 (UAE)' },
  { code: '+65', country: 'SG', label: '+65 (Singapore)' },
  { code: '+61', country: 'AU', label: '+61 (Australia)' },
  { code: '+49', country: 'DE', label: '+49 (Germany)' },
];

export interface PlanMeta {
  planName: string;
  planCode: string;
  route: string;
}

export const HEALTH_OPTION_PLAN_MAP: Record<string, PlanMeta> = {
  // Female options
  'I am a teenager and want to understand my body and periods': {
    planName: 'LUNA',
    planCode: 'LUNA',
    route: '/luna',
  },
  'I want to improve my overall health, lifestyle, and cycle': {
    planName: 'LYRA',
    planCode: 'LYRA',
    route: '/lyra',
  },
  'I just want a doctor and guidance for my health': {
    planName: 'LYRA',
    planCode: 'LYRA',
    route: '/lyra',
  },
  'I have PCOS, irregular periods, or hormone issues': {
    planName: 'CALA',
    planCode: 'CALA',
    route: '/cala',
  },
  'I am married and want to prepare my body before pregnancy': {
    planName: 'EVE',
    planCode: 'EVE',
    route: '/eve',
  },
  'I am getting married soon and want to prepare my body for a healthy pregnancy': {
    planName: 'EVE',
    planCode: 'EVE',
    route: '/eve',
  },
  'We are trying to conceive': {
    planName: 'VITA',
    planCode: 'VITA',
    route: '/vita',
  },
  'We have been trying for a while but no success': {
    planName: 'VITA',
    planCode: 'VITA',
    route: '/vita',
  },
  'We are planning pregnancy and want to prepare together': {
    planName: 'EVE + GENESIS',
    planCode: 'EVE-GENESIS',
    route: '/eve-genesis',
  },

  // Male options
  'I want to improve my overall health, energy, and lifestyle': {
    planName: 'CORE',
    planCode: 'CORE',
    route: '/core',
  },
  'I feel low energy, stressed, or not physically at my best': {
    planName: 'CORE',
    planCode: 'CORE',
    route: '/core',
  },
  'I just want a personal doctor for guidance': {
    planName: 'CORE',
    planCode: 'CORE',
    route: '/core',
  },
  'I have sexual health or testosterone concerns': {
    planName: 'ATLAS',
    planCode: 'ATLAS',
    route: '/atlas',
  },
  'I have fertility issues or poor sperm reports': {
    planName: 'ATLAS',
    planCode: 'ATLAS',
    route: '/atlas',
  },
  'I am getting married soon and want to prepare my health for good performance and future fatherhood': {
    planName: 'GENESIS',
    planCode: 'GENESIS',
    route: '/genesis',
  },
  'We are planning for a baby': {
    planName: 'VITA',
    planCode: 'VITA',
    route: '/vita',
  },
  'We are trying for a baby': {
    planName: 'VITA',
    planCode: 'VITA',
    route: '/vita',
  },
};

// ----------------------------------------------------------------------
// Moving Pastel Gradient Wrapper for Option Pills
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
      <div
        className={`relative p-[2px] rounded-[28px] transition-all duration-300 ${
          isSelected
            ? 'shadow-[0_4px_22px_rgba(239,143,96,0.35),0_0_12px_rgba(174,222,243,0.25)]'
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
        <div
          className={`absolute inset-0 rounded-[28px] bg-white/80 border border-white/90 transition-opacity duration-300 pointer-events-none ${
            isSelected ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
          }`}
        />
        <div
          className={`relative z-10 w-full h-full rounded-[26px] overflow-hidden transition-all duration-300 ${
            isSelected
              ? 'bg-[#FCFAF7]/95 text-zinc-900 font-bold'
              : 'bg-white/90 group-hover:bg-[#FCFAF7]/95 text-zinc-700'
          }`}
          style={{
            WebkitMaskImage: '-webkit-radial-gradient(white, black)',
          }}
        >
          <div
            className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
              isSelected ? 'opacity-25' : 'opacity-0 group-hover:opacity-15'
            }`}
            style={{
              backgroundImage: gradientString,
              backgroundSize: '200% 100%',
              animation: `${animName} ${duration}s ease-in-out -${delaySec}s infinite`,
            }}
          />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent pointer-events-none rounded-t-[26px]" />
          <div className="relative z-10 w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Explore Form Component
// ----------------------------------------------------------------------
export default function ExploreForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [genderOpen, setGenderOpen] = useState(false);
  const [countryCodeOpen, setCountryCodeOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [leadSourceOpen, setLeadSourceOpen] = useState(false);
  const [careChoice, setCareChoice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Filter search states for location dropdowns
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  // Guard against Chromium date picker crashes and double-invocation loops
  const lastPickerTimeRef = useRef(0);
  const isPickingDateRef = useRef(false);

  const handleDateInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const now = Date.now();
    if (isPickingDateRef.current || now - lastPickerTimeRef.current < 800) {
      return;
    }
    lastPickerTimeRef.current = now;
    try {
      e.currentTarget.showPicker?.();
    } catch {}
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setGenderOpen(false);
        setCountryCodeOpen(false);
        setCountryOpen(false);
        setStateOpen(false);
        setCityOpen(false);
        setLeadSourceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

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

  const selectedGender = watch('gender');
  const selectedCountryCode = watch('countryCode');
  const selectedCountry = watch('raw_country') || 'India';
  const selectedState = watch('raw_state') || '';
  const selectedCity = watch('raw_city') || '';
  const selectedLeadSource = watch('temp_lead_source');
  const selectedOption = watch('selectedOption');
  const selectedDob = watch('dob');

  // Dynamically derive available States & Cities from @/lib/utils
  const availableStates = useMemo(() => {
    return getStatesByCountry(selectedCountry);
  }, [selectedCountry]);

  const availableCities = useMemo(() => {
    return getCitiesByState(selectedCountry, selectedState);
  }, [selectedCountry, selectedState]);

  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return availableStates;
    return availableStates.filter((s) =>
      s.toLowerCase().includes(stateSearch.toLowerCase().trim())
    );
  }, [availableStates, stateSearch]);

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return availableCities;
    return availableCities.filter((c) =>
      c.toLowerCase().includes(citySearch.toLowerCase().trim())
    );
  }, [availableCities, citySearch]);

  // Determine current options based on gender and careChoice
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

  const closeAllDropdowns = () => {
    setGenderOpen(false);
    setCountryCodeOpen(false);
    setCountryOpen(false);
    setStateOpen(false);
    setCityOpen(false);
    setLeadSourceOpen(false);
  };

  const handleNextStep1 = async () => {
    setApiError(null);
    closeAllDropdowns();
    const isStep1Valid = await trigger([
      'fullName',
      'countryCode',
      'phone',
      'gender',
      'email',
      'dob',
      'raw_country',
      'raw_state',
      'raw_city',
      'temp_lead_source',
    ]);
    if (isStep1Valid) {
      setCurrentStep(2);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    }
  };

  const handlePrevStep = () => {
    setApiError(null);
    closeAllDropdowns();
    setCurrentStep((prev) => Math.max(1, prev - 1));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Submit via Axios
  const onSubmit = async (data: ExploreFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const selectedPlanMeta = data.selectedOption
        ? HEALTH_OPTION_PLAN_MAP[data.selectedOption]
        : null;

      // Sanitize phone number: strip spaces, hyphens, parentheses, dots
      const rawDigits = data.phone.replace(/[\s\-\(\)\.]/g, '');
      let cleanDigits = rawDigits;
      const dialCode = data.countryCode.replace('+', '');
      // Strip duplicated country code prefix if typed in phone field
      if (cleanDigits.startsWith(`+${dialCode}`)) {
        cleanDigits = cleanDigits.slice(dialCode.length + 1);
      } else if (cleanDigits.startsWith(dialCode) && cleanDigits.length > 10) {
        cleanDigits = cleanDigits.slice(dialCode.length);
      } else if (cleanDigits.startsWith('0')) {
        cleanDigits = cleanDigits.slice(1);
      }
      cleanDigits = cleanDigits.replace(/^\+/, '');

      const fullPhone = `${data.countryCode}${cleanDigits}`;
      const mappedGender: GenderType =
        data.gender === 'Female' ? 'FEMALE' : data.gender === 'Male' ? 'MALE' : 'OTHER';

      const payload: CreateLeadPayload = {
        name: data.fullName.trim(),
        phone: fullPhone,
        gender: mappedGender,
        email: data.email?.trim() || undefined,
        dob: data.dob?.trim() || undefined,
        plan_code: selectedPlanMeta?.planCode || undefined,
        temp_lead_source: data.temp_lead_source || undefined,
        raw_country: data.raw_country?.trim() || undefined,
        raw_state: data.raw_state?.trim() || undefined,
        raw_city: data.raw_city?.trim() || undefined,
        clear_health_description: data.selectedOption || undefined,
        unclear_health_description: data.unclear_health_description?.trim() || undefined,
        extra_notes: data.extra_notes?.trim() || undefined,
      };

      const leadResponse = await createLead(payload);

      // SECURITY: Strictly save only the lead_id in sessionStorage (no PII in browser storage)
      if (leadResponse?.id) {
        sessionStorage.setItem('joyzen_lead_id', leadResponse.id);
      }

      // If mapped to a program route, navigate directly to it
      if (selectedPlanMeta?.route) {
        router.push(selectedPlanMeta.route);
      } else {
        setSubmitted(true);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (err) {
      const errMsg = formatApiError(err);
      setApiError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
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

  // Today's date string YYYY-MM-DD for max dob restriction
  const maxDobDate = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  return (
    <section className="relative w-full min-h-screen pt-16 pb-36 sm:pb-48 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center select-none overflow-x-clip overflow-y-visible bg-[#FAF8F5]">
      {/* iOS-Safe Moving Gradient Flow Keyframes */}
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

      {/* Honeycomb Vector Pattern Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-35 z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="explore-honeycomb-pattern"
              width="62.35"
              height="108"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 31.18 0 L 62.35 18 L 62.35 54 L 31.18 72 L 0 54 L 0 18 Z M 0 54 L 0 90 L 31.18 108 L 62.35 90 L 62.35 54 M 31.18 72 L 31.18 108"
                fill="none"
                stroke="#EAE6DE"
                strokeWidth="1.1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#explore-honeycomb-pattern)" />
        </svg>
      </div>

      <div ref={formRef} className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center mt-6 transition-all duration-300">
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
                  <h1 className="text-[38px] sm:text-4xl lg:text-[44px] font-bold tracking-tight text-black leading-[1.18]">
                    Explore <br className="sm:hidden" />
                    <span className="text-[#EF8F60]">Joyzen</span> care
                  </h1>
                  <p className="text-sm sm:text-base text-zinc-600 font-normal leading-[1.4] max-w-lg mx-auto">
                    Personalized reproductive and holistic health programs guided by your own dedicated doctor.
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
        )}

        {/* 2-Step Progress Indicator Header */}
        {!submitted && (
          <div className="w-full mb-6 p-4 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between px-4">
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
                  Basic &amp; Contact Info
                </span>
              </div>

              <div className="flex-1 h-[1px] bg-zinc-300 mx-4" />

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
            <div className="w-full h-1.5 bg-zinc-200/80 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: '50%' }}
                animate={{ width: currentStep === 1 ? '50%' : '100%' }}
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

        {/* Global Error Banner */}
        {apiError && (
          <div className="w-full mb-4 p-4 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-sm flex items-start gap-3 backdrop-blur-sm">
            <svg className="w-5 h-5 shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="font-semibold">Submission Notice</p>
              <p className="text-xs sm:text-sm mt-0.5">{apiError}</p>
            </div>
          </div>
        )}

        {/* Interactive Form Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="relative w-full">
          {submitted ? (
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
                  className="w-full rounded-[36px] bg-white/40 backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_12px_36px_rgba(0,0,0,0.04)] overflow-hidden"
                >
                  <div className="p-10 sm:p-14 text-center relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#EF8F60] tracking-tight mb-4">
                      Thank You!
                    </h2>
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
          ) : (
            <AnimatePresence mode="wait" custom={currentStep}>
              {/* ------------------------------------------------------------- */}
              {/* STEP 1: Basic & Location Information                          */}
              {/* ------------------------------------------------------------- */}
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
                  {/* Full Name Input (required) */}
                  <div>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                      <input
                        {...register('fullName')}
                        type="text"
                        placeholder="Full Name *"
                        className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
                      />
                    </div>
                    {errors.fullName && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.fullName.message}</p>}
                  </div>

                  {/* Phone with Country Code (required) */}
                  <div className={`relative ${countryCodeOpen ? 'z-[100]' : 'z-20'}`}>
                    <div className="flex gap-2">
                      {/* Country Code Dropdown */}
                      <div className={`relative w-36 shrink-0 rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] transition-all ${countryCodeOpen ? 'z-[100]' : 'z-10'}`}>
                        <button
                          type="button"
                          onClick={() => {
                            setCountryCodeOpen(!countryCodeOpen);
                            setGenderOpen(false);
                            setCountryOpen(false);
                            setStateOpen(false);
                            setCityOpen(false);
                            setLeadSourceOpen(false);
                          }}
                          className="w-full px-4 py-4 flex items-center justify-between text-left text-sm font-semibold text-zinc-800 focus:outline-none cursor-pointer"
                        >
                          <span>{selectedCountryCode}</span>
                          <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {countryCodeOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              data-lenis-prevent
                              onWheel={(e) => e.stopPropagation()}
                              onTouchMove={(e) => e.stopPropagation()}
                              className="absolute left-0 right-0 top-full mt-1.5 z-[999] p-2 space-y-1 rounded-2xl border border-zinc-200/80 bg-white/98 backdrop-blur-3xl shadow-2xl max-h-48 overflow-y-auto overscroll-contain"
                            >
                              {countryCodeOptions.map((opt) => (
                                <div
                                  key={opt.code}
                                  onClick={() => {
                                    setValue('countryCode', opt.code, { shouldValidate: true });
                                    setCountryCodeOpen(false);
                                  }}
                                  className={`text-xs py-2 px-3 rounded-xl cursor-pointer transition-colors ${
                                    selectedCountryCode === opt.code
                                      ? 'font-bold text-zinc-900 bg-zinc-100'
                                      : 'font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                                  }`}
                                >
                                  {opt.label}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Phone Number Input */}
                      <div className="relative flex-1 rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                        <input
                          {...register('phone')}
                          type="tel"
                          inputMode="numeric"
                          placeholder="Phone Number (e.g. 9876543210) *"
                          className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
                        />
                      </div>
                    </div>
                    {errors.phone && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.phone.message}</p>}
                  </div>

                  {/* Gender Custom Dropdown (required) */}
                  <div className={`relative ${genderOpen ? 'z-[100]' : 'z-20'}`}>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] transition-all">
                      <button
                        type="button"
                        onClick={() => {
                          setGenderOpen(!genderOpen);
                          setCountryCodeOpen(false);
                          setCountryOpen(false);
                          setStateOpen(false);
                          setCityOpen(false);
                          setLeadSourceOpen(false);
                        }}
                        className="w-full px-6 py-4 flex items-center justify-between text-left text-sm sm:text-base font-medium text-zinc-700 focus:outline-none cursor-pointer"
                      >
                        <span className={selectedGender ? 'text-zinc-900 font-medium' : 'text-zinc-400'}>
                          {selectedGender ? `Gender: ${selectedGender}` : 'Gender *'}
                        </span>
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          {selectedGender && (
                            <span
                              role="button"
                              title="Clear gender"
                              onClick={(e) => {
                                e.stopPropagation();
                                setValue('gender', '', { shouldValidate: true });
                                setValue('selectedOption', '');
                                setValue('careChoice', '');
                                setCareChoice('');
                              }}
                              className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </span>
                          )}
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
                        </div>
                      </button>

                      <AnimatePresence>
                        {genderOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="px-6 pb-5 pt-2 space-y-2 border-t border-white/60 bg-white/80 backdrop-blur-md rounded-b-[28px]"
                          >
                            {['Female', 'Male', 'Prefer not to say'].map((option) => (
                              <div
                                key={option}
                                onClick={() => {
                                  if (selectedGender === option) {
                                    setValue('gender', '', { shouldValidate: true });
                                    setValue('selectedOption', '');
                                    setValue('careChoice', '');
                                    setCareChoice('');
                                  } else {
                                    setValue('gender', option, { shouldValidate: true });
                                    setValue('selectedOption', '');
                                    setValue('careChoice', '');
                                    setCareChoice('');
                                  }
                                  setGenderOpen(false);
                                }}
                                className={`text-sm sm:text-base cursor-pointer py-1.5 transition-colors flex items-center justify-between ${
                                  selectedGender === option
                                    ? 'font-bold text-zinc-900'
                                    : 'font-medium text-zinc-500 hover:text-zinc-900'
                                }`}
                              >
                                <span>{option}</span>
                                {selectedGender === option && (
                                  <span
                                    role="button"
                                    title="Remove selection"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setValue('gender', '', { shouldValidate: true });
                                      setValue('selectedOption', '');
                                      setValue('careChoice', '');
                                      setCareChoice('');
                                      setGenderOpen(false);
                                    }}
                                    className="p-0.5 rounded-full text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </span>
                                )}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {errors.gender && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.gender.message}</p>}
                  </div>

                  {/* Email & Date of Birth (Date Picker) Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                    {/* Email Input */}
                    <div>
                      <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                        <input
                          {...register('email')}
                          type="email"
                          placeholder="Email (optional)"
                          className="w-full px-6 py-4 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none rounded-[28px]"
                        />
                      </div>
                      {errors.email && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.email.message}</p>}
                    </div>

                    {/* Date of Birth Date Picker */}
                    <div>
                      <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                        <div className="relative flex items-center pr-3">
                          <input
                            {...register('dob', {
                              onChange: () => {
                                isPickingDateRef.current = true;
                                setTimeout(() => {
                                  isPickingDateRef.current = false;
                                }, 800);
                              },
                            })}
                            type="date"
                            max={maxDobDate}
                            min="1920-01-01"
                            onClick={handleDateInputClick}
                            className={`w-full px-6 py-4 text-sm sm:text-base font-medium bg-transparent outline-none rounded-[28px] cursor-pointer transition-colors scheme-light [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:cursor-pointer hover:[&::-webkit-calendar-picker-indicator]:opacity-100 ${
                              selectedDob ? 'text-zinc-900 font-semibold' : 'text-zinc-400'
                            }`}
                          />
                          {selectedDob && (
                            <button
                              type="button"
                              title="Clear date of birth"
                              onClick={(e) => {
                                e.stopPropagation();
                                setValue('dob', '');
                              }}
                              className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer shrink-0"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      {errors.dob && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.dob.message}</p>}
                    </div>
                  </div>

                  {/* Location Selectors: Country, State, City (from @/lib/utils) */}
                  <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 relative ${
                    countryOpen || stateOpen || cityOpen ? 'z-[100]' : 'z-20'
                  }`}>
                    {/* Country Selector */}
                    <div className={`relative ${countryOpen ? 'z-[100]' : 'z-10'}`}>
                      <div className="rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] transition-all">
                        <button
                          type="button"
                          onClick={() => {
                            setCountryOpen(!countryOpen);
                            setStateOpen(false);
                            setCityOpen(false);
                            setGenderOpen(false);
                            setCountryCodeOpen(false);
                            setLeadSourceOpen(false);
                          }}
                          className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-medium text-zinc-700 focus:outline-none cursor-pointer"
                        >
                          <span className={selectedCountry ? 'text-zinc-900 font-semibold truncate' : 'text-zinc-400'}>
                            {selectedCountry || 'Country'}
                          </span>
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            {selectedCountry && (
                              <span
                                role="button"
                                title="Clear country"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setValue('raw_country', '');
                                  setValue('raw_state', '');
                                  setValue('raw_city', '');
                                }}
                                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </span>
                            )}
                            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        <AnimatePresence>
                          {countryOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              data-lenis-prevent
                              onWheel={(e) => e.stopPropagation()}
                              onTouchMove={(e) => e.stopPropagation()}
                              className="absolute left-0 right-0 top-full mt-1.5 z-[999] p-2 space-y-1 rounded-2xl border border-zinc-200/80 bg-white/98 backdrop-blur-3xl shadow-2xl max-h-56 overflow-y-auto overscroll-contain"
                            >
                              {selectedCountry && (
                                <div className="px-2.5 py-1.5 mb-1 bg-[#AEDEE4]/25 border border-[#AEDEE4]/60 rounded-xl flex items-center justify-between text-xs text-zinc-800">
                                  <span className="truncate">
                                    Selected: <strong className="font-semibold">{selectedCountry}</strong>
                                  </span>
                                  <button
                                    type="button"
                                    title="Remove selected country"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setValue('raw_country', '');
                                      setValue('raw_state', '');
                                      setValue('raw_city', '');
                                    }}
                                    className="shrink-0 ml-2 px-1.5 py-0.5 rounded text-[11px] font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <span>Remove</span>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                              {COUNTRIES.map((country) => (
                                <div
                                  key={country}
                                  onClick={() => {
                                    if (selectedCountry === country) {
                                      setValue('raw_country', '');
                                      setValue('raw_state', '');
                                      setValue('raw_city', '');
                                    } else {
                                      setValue('raw_country', country);
                                      setValue('raw_state', '');
                                      setValue('raw_city', '');
                                    }
                                    setCountryOpen(false);
                                  }}
                                  className={`text-xs py-2 px-3 rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                                    selectedCountry === country
                                      ? 'font-bold text-zinc-900 bg-zinc-100'
                                      : 'font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                                  }`}
                                >
                                  <span className="truncate">{country}</span>
                                  {selectedCountry === country && (
                                    <span
                                      role="button"
                                      title="Remove selection"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setValue('raw_country', '');
                                        setValue('raw_state', '');
                                        setValue('raw_city', '');
                                        setCountryOpen(false);
                                      }}
                                      className="shrink-0 p-0.5 rounded-full text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-2"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </span>
                                  )}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* State Selector */}
                    <div className={`relative ${stateOpen ? 'z-[100]' : 'z-10'}`}>
                      <div className="rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] transition-all">
                        <button
                          type="button"
                          onClick={() => {
                            setStateOpen(!stateOpen);
                            setCountryOpen(false);
                            setCityOpen(false);
                            setGenderOpen(false);
                            setCountryCodeOpen(false);
                            setLeadSourceOpen(false);
                            setStateSearch('');
                          }}
                          className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-medium text-zinc-700 focus:outline-none cursor-pointer"
                        >
                          <span className={selectedState ? 'text-zinc-900 font-semibold truncate' : 'text-zinc-400'}>
                            {selectedState || 'State'}
                          </span>
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            {selectedState && (
                              <span
                                role="button"
                                title="Clear state"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setValue('raw_state', '');
                                  setValue('raw_city', '');
                                  setStateSearch('');
                                }}
                                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </span>
                            )}
                            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        <AnimatePresence>
                          {stateOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              data-lenis-prevent
                              onWheel={(e) => e.stopPropagation()}
                              className="absolute left-0 right-0 top-full mt-1.5 z-[999] p-2 rounded-2xl border border-zinc-200/80 bg-white/98 backdrop-blur-3xl shadow-2xl max-h-64 overflow-hidden flex flex-col pointer-events-auto"
                            >
                              <div className="p-1 pb-2 border-b border-zinc-100 flex items-center gap-1.5">
                                <div className="relative flex-1">
                                  <input
                                    type="text"
                                    value={stateSearch}
                                    onChange={(e) => setStateSearch(e.target.value)}
                                    placeholder="Search state..."
                                    className="w-full pl-3 pr-7 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg outline-none text-zinc-800 placeholder:text-zinc-400 focus:border-[#95C1E2]"
                                    autoFocus
                                  />
                                  {stateSearch && (
                                    <button
                                      type="button"
                                      onClick={() => setStateSearch('')}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                                    >
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {selectedState && (
                                <div className="px-2.5 py-1.5 my-1 bg-[#AEDEE4]/25 border border-[#AEDEE4]/60 rounded-xl flex items-center justify-between text-xs text-zinc-800">
                                  <span className="truncate">
                                    Selected: <strong className="font-semibold">{selectedState}</strong>
                                  </span>
                                  <button
                                    type="button"
                                    title="Remove selected state"
                                    onClick={() => {
                                      setValue('raw_state', '');
                                      setValue('raw_city', '');
                                    }}
                                    className="shrink-0 ml-2 px-1.5 py-0.5 rounded text-[11px] font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <span>Remove</span>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              )}

                              <div
                                data-lenis-prevent
                                onWheel={(e) => e.stopPropagation()}
                                onTouchMove={(e) => e.stopPropagation()}
                                className="overflow-y-auto space-y-1 pt-1 max-h-48 overscroll-contain pr-1"
                              >
                                {filteredStates.length > 0 ? (
                                  filteredStates.map((state) => (
                                    <div
                                      key={state}
                                      onClick={() => {
                                        if (selectedState === state) {
                                          setValue('raw_state', '');
                                          setValue('raw_city', '');
                                        } else {
                                          setValue('raw_state', state);
                                          setValue('raw_city', '');
                                        }
                                        setStateOpen(false);
                                      }}
                                      className={`text-xs py-2 px-3 rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                                        selectedState === state
                                          ? 'font-bold text-zinc-900 bg-zinc-100'
                                          : 'font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                                      }`}
                                    >
                                      <span className="truncate">{state}</span>
                                      {selectedState === state && (
                                        <span
                                          role="button"
                                          title="Remove selection"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setValue('raw_state', '');
                                            setValue('raw_city', '');
                                            setStateOpen(false);
                                          }}
                                          className="shrink-0 p-0.5 rounded-full text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-2"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        </span>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <div
                                    onClick={() => {
                                      if (stateSearch.trim()) {
                                        setValue('raw_state', stateSearch.trim());
                                        setValue('raw_city', '');
                                        setStateOpen(false);
                                      }
                                    }}
                                    className="p-2 text-xs text-zinc-600 hover:bg-zinc-50 cursor-pointer rounded-lg text-center"
                                  >
                                    Use custom: &quot;{stateSearch}&quot;
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* City Selector */}
                    <div className={`relative ${cityOpen ? 'z-[100]' : 'z-10'}`}>
                      <div className="rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] transition-all">
                        <button
                          type="button"
                          onClick={() => {
                            setCityOpen(!cityOpen);
                            setCountryOpen(false);
                            setStateOpen(false);
                            setGenderOpen(false);
                            setCountryCodeOpen(false);
                            setLeadSourceOpen(false);
                            setCitySearch('');
                          }}
                          className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-medium text-zinc-700 focus:outline-none cursor-pointer"
                        >
                          <span className={selectedCity ? 'text-zinc-900 font-semibold truncate' : 'text-zinc-400'}>
                            {selectedCity || 'City'}
                          </span>
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            {selectedCity && (
                              <span
                                role="button"
                                title="Clear city"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setValue('raw_city', '');
                                  setCitySearch('');
                                }}
                                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </span>
                            )}
                            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        <AnimatePresence>
                          {cityOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              data-lenis-prevent
                              onWheel={(e) => e.stopPropagation()}
                              className="absolute left-0 right-0 top-full mt-1.5 z-[999] p-2 rounded-2xl border border-zinc-200/80 bg-white/98 backdrop-blur-3xl shadow-2xl max-h-64 overflow-hidden flex flex-col pointer-events-auto"
                            >
                              <div className="p-1 pb-2 border-b border-zinc-100 flex items-center gap-1.5">
                                <div className="relative flex-1">
                                  <input
                                    type="text"
                                    value={citySearch}
                                    onChange={(e) => setCitySearch(e.target.value)}
                                    placeholder="Search or enter city..."
                                    className="w-full pl-3 pr-7 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg outline-none text-zinc-800 placeholder:text-zinc-400 focus:border-[#95C1E2]"
                                    autoFocus
                                  />
                                  {citySearch && (
                                    <button
                                      type="button"
                                      onClick={() => setCitySearch('')}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                                    >
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {selectedCity && (
                                <div className="px-2.5 py-1.5 my-1 bg-[#AEDEE4]/25 border border-[#AEDEE4]/60 rounded-xl flex items-center justify-between text-xs text-zinc-800">
                                  <span className="truncate">
                                    Selected: <strong className="font-semibold">{selectedCity}</strong>
                                  </span>
                                  <button
                                    type="button"
                                    title="Remove selected city"
                                    onClick={() => {
                                      setValue('raw_city', '');
                                    }}
                                    className="shrink-0 ml-2 px-1.5 py-0.5 rounded text-[11px] font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <span>Remove</span>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              )}

                              <div
                                data-lenis-prevent
                                onWheel={(e) => e.stopPropagation()}
                                onTouchMove={(e) => e.stopPropagation()}
                                className="overflow-y-auto space-y-1 pt-1 max-h-48 overscroll-contain pr-1"
                              >
                                {filteredCities.length > 0 ? (
                                  filteredCities.map((city) => (
                                    <div
                                      key={city}
                                      onClick={() => {
                                        if (selectedCity === city) {
                                          setValue('raw_city', '');
                                        } else {
                                          setValue('raw_city', city);
                                        }
                                        setCityOpen(false);
                                      }}
                                      className={`text-xs py-2 px-3 rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                                        selectedCity === city
                                          ? 'font-bold text-zinc-900 bg-zinc-100'
                                          : 'font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                                      }`}
                                    >
                                      <span className="truncate">{city}</span>
                                      {selectedCity === city && (
                                        <span
                                          role="button"
                                          title="Remove selection"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setValue('raw_city', '');
                                            setCityOpen(false);
                                          }}
                                          className="shrink-0 p-0.5 rounded-full text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-2"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        </span>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <div
                                    onClick={() => {
                                      if (citySearch.trim()) {
                                        setValue('raw_city', citySearch.trim());
                                        setCityOpen(false);
                                      }
                                    }}
                                    className="p-2 text-xs text-zinc-600 hover:bg-zinc-50 cursor-pointer rounded-lg text-center"
                                  >
                                    Use custom: &quot;{citySearch}&quot;
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* How did you hear about us? Dropdown */}
                  <div className={`relative ${leadSourceOpen ? 'z-[100]' : 'z-10'}`}>
                    <div className="relative rounded-[28px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] transition-all">
                      <button
                        type="button"
                        onClick={() => {
                          setLeadSourceOpen(!leadSourceOpen);
                          setGenderOpen(false);
                          setCountryCodeOpen(false);
                          setCountryOpen(false);
                          setStateOpen(false);
                          setCityOpen(false);
                        }}
                        className="w-full px-6 py-4 flex items-center justify-between text-left text-sm sm:text-base font-medium text-zinc-700 focus:outline-none cursor-pointer"
                      >
                        <span className={selectedLeadSource ? 'text-zinc-900 font-medium' : 'text-zinc-400'}>
                          {selectedLeadSource || 'How did you hear about us?'}
                        </span>
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          {selectedLeadSource && (
                            <span
                              role="button"
                              title="Clear selection"
                              onClick={(e) => {
                                e.stopPropagation();
                                setValue('temp_lead_source', '');
                              }}
                              className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </span>
                          )}
                          <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      <AnimatePresence>
                        {leadSourceOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            data-lenis-prevent
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                            className="absolute left-0 right-0 top-full mt-1.5 z-[999] px-6 pb-5 pt-2 space-y-1.5 border border-zinc-200/80 bg-white/98 backdrop-blur-3xl shadow-2xl rounded-2xl max-h-56 overflow-y-auto overscroll-contain"
                          >
                            {selectedLeadSource && (
                              <div className="px-2.5 py-1.5 mb-1 bg-[#AEDEE4]/25 border border-[#AEDEE4]/60 rounded-xl flex items-center justify-between text-xs text-zinc-800">
                                <span className="truncate">
                                  Selected: <strong className="font-semibold">{selectedLeadSource}</strong>
                                </span>
                                <button
                                  type="button"
                                  title="Remove selected option"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setValue('temp_lead_source', '');
                                  }}
                                  className="shrink-0 ml-2 px-1.5 py-0.5 rounded text-[11px] font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <span>Remove</span>
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            )}
                            {leadSourceOptions.map((opt) => (
                              <div
                                key={opt}
                                onClick={() => {
                                  if (selectedLeadSource === opt) {
                                    setValue('temp_lead_source', '');
                                  } else {
                                    setValue('temp_lead_source', opt);
                                  }
                                  setLeadSourceOpen(false);
                                }}
                                className={`text-sm cursor-pointer py-1.5 transition-colors flex items-center justify-between ${
                                  selectedLeadSource === opt
                                    ? 'font-bold text-zinc-900'
                                    : 'font-medium text-zinc-500 hover:text-zinc-900'
                                }`}
                              >
                                <span className="truncate">{opt}</span>
                                {selectedLeadSource === opt && (
                                  <span
                                    role="button"
                                    title="Remove selection"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setValue('temp_lead_source', '');
                                      setLeadSourceOpen(false);
                                    }}
                                    className="shrink-0 p-0.5 rounded-full text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-2"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </span>
                                )}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Step 1 Continue Button */}
                  <div className="flex justify-end pt-4 relative z-0">
                    <button
                      type="button"
                      onClick={handleNextStep1}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[24px] text-sm font-bold uppercase tracking-tight text-black bg-[#AEDEE44D] border border-[#AEDEE4] backdrop-blur-sm shadow-md hover:bg-[#AEDEE4]/60 transition-all cursor-pointer"
                    >
                      <span>Continue to Health Goals</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* STEP 2: Tailored Health Goals & Program Matching              */}
              {/* ------------------------------------------------------------- */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  custom={2}
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.35 }}
                  className="relative z-10 space-y-5"
                >
                  {/* Category choices if "Prefer not to say" selected */}
                  {selectedGender === 'Prefer not to say' && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 px-2">
                        Select Care Focus
                      </span>
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
                                setValue('selectedOption', '');
                              }}
                              className={`py-3 px-3 rounded-[20px] text-xs sm:text-sm font-semibold transition-all cursor-pointer border text-center ${
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
                    </div>
                  )}

                  {/* Dynamic Options List */}
                  {currentOptions && currentOptions.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          {optionsHeading}
                        </span>
                      </div>
                      {currentOptions.map((option, idx) => {
                        const isItemChosen = selectedOption === option;
                        const planMeta = HEALTH_OPTION_PLAN_MAP[option];
                        return (
                          <GradientOptionWrapper key={option} isSelected={isItemChosen} index={idx}>
                            <button
                              type="button"
                              onClick={() => {
                                setValue('selectedOption', isItemChosen ? '' : option, { shouldValidate: true });
                              }}
                              className={`w-full flex items-center justify-between text-left px-6 py-4 text-sm sm:text-base transition-colors rounded-[26px] gap-3 cursor-pointer ${
                                isItemChosen ? 'font-bold text-zinc-900' : 'font-medium text-zinc-700 hover:text-zinc-900'
                              }`}
                            >
                              <span className="flex-1">{option}</span>
                              {/* {planMeta && (
                                <span
                                  className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors ${
                                    isItemChosen
                                      ? 'bg-[#036132] text-white shadow-xs'
                                      : 'bg-zinc-200/80 text-zinc-600 group-hover:bg-[#AEDEE4]/50 group-hover:text-[#036132]'
                                  }`}
                                >
                                  {planMeta.planName}
                                </span>
                              )} */}
                            </button>
                          </GradientOptionWrapper>
                        );
                      })}
                    </div>
                  )}

                  {/* "Unclear about concern" Textarea */}
                  <div className="space-y-2 pt-2">
                    <div className="px-2">
                      <h3 className="text-sm sm:text-base font-bold text-zinc-900">
                        Unclear about your concern?
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Describe what you are experiencing in your own words.
                      </p>
                    </div>
                    <div className="relative rounded-[24px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all p-2">
                      <textarea
                        {...register('unclear_health_description')}
                        rows={3}
                        placeholder="Tell us about any specific symptoms or health details..."
                        className="w-full px-4 py-2 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* "Message / Any other notes" Textarea */}
                  <div className="space-y-2">
                    <div className="px-2">
                      <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                        Message / Extra Notes
                      </span>
                    </div>
                    <div className="relative rounded-[24px] bg-white/5 backdrop-blur-sm border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all p-2">
                      <textarea
                        {...register('extra_notes')}
                        rows={2}
                        placeholder="Any additional preferences, questions, or notes..."
                        className="w-full px-4 py-2 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Step 2 Action Buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-[24px] text-sm font-semibold text-zinc-700 bg-white/60 border border-white hover:bg-white transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                      <span>Back</span>
                    </button>

                    <SpecularButton
                      type="submit"
                      disabled={isSubmitting}
                      size="md"
                      tint="#AEDEE44D"
                      tintOpacity={0.35}
                      textColor="#000000"
                      lineColor="#ffffff"
                      baseColor="#AEDEE44D"
                      radius={24}
                      className="font-bold text-sm uppercase tracking-tight px-8 py-3.5 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'PROCESSING...' : 'SUBMIT & VIEW PLAN'}
                    </SpecularButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </form>
      </div>

      {/* Background Watermark */}
      <div className="relative w-full flex items-center justify-center -my-16 sm:-my-24 pointer-events-none z-0 select-none">
        <div className="relative w-72 sm:w-96 h-72 sm:h-96 opacity-40">
          <Image
            src="/joyzen-orange.png"
            alt="Joyzen Logo Watermark"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
