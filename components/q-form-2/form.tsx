'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import SpecularButton from '@/reuseable/specularButton';

export const qForm2Schema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(50, 'Full name must not exceed 50 characters'),
  age: z
    .string()
    .min(1, 'Age is required')
    .max(3, 'Age cannot exceed 3 digits')
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 120,
      'Please enter a valid age (1-119)'
    ),
  phoneNumber: z
    .string()
    .length(10, 'Phone number must be exactly 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
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
  periodCycleRegular: z.string().min(1, 'Please select Yes or No'),
  pcos: z.string().min(1, 'Please select Yes or No'),
  hormonal: z.string().min(1, 'Please select Yes or No'),
  thyroid: z.string().min(1, 'Please select Yes or No'),
  tryingToConceive: z
    .string()
    .max(500, 'Answer must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

export type QForm2Data = z.infer<typeof qForm2Schema>;

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

export default function QForm2() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<QForm2Data>({
    resolver: zodResolver(qForm2Schema),
    defaultValues: {
      fullName: '',
      age: '',
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

  const periodCycleValue = watch('periodCycleRegular');
  const pcosValue = watch('pcos');
  const hormonalValue = watch('hormonal');
  const thyroidValue = watch('thyroid');

  const onSubmit = (data: QForm2Data) => {
    console.log('Q-Form 2 Submitted:', data);
    setSubmitted(true);
  };

  const handleReset = () => {
    reset();
    setSubmitted(false);
  };

  return (
    <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center select-none">
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center mt-6">
        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-black leading-[1.18] text-center mb-8">
          To know more about you
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="relative w-full space-y-4">
          {/* Joyzen Orange Logo Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 pointer-events-none z-0 opacity-30 select-none">
            <Image
              src="/joyzen-orange.png"
              alt="Joyzen Watermark Logo"
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
                  Thank you, <span className="font-semibold text-zinc-800">{watch('fullName')}</span>. We have saved your information and our specialists will be in touch soon.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 px-7 py-3 rounded-full text-xs font-bold tracking-wide uppercase text-zinc-800 bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 transition-all cursor-pointer"
              >
                Submit Another Response
              </button>
            </motion.div>
          ) : (
            <div className="relative z-10 space-y-4">
              {/* Full Name Input */}
              <div>
                <div className="relative rounded-[28px] bg-white/5 backdrop-blur-xs border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] focus-within:border-[#95C1E2] transition-all">
                  <input
                    {...register('fullName')}
                    type="text"
                    placeholder="Full Name"
                    maxLength={50}
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
                    maxLength={3}
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
              <GlassDropdown
                label="Period cycle regular?"
                value={periodCycleValue}
                onChange={(val) => setValue('periodCycleRegular', val, { shouldValidate: true })}
                error={errors.periodCycleRegular?.message}
              />

              {/* Dropdown 2: PCOS */}
              <GlassDropdown
                label="PCOS"
                value={pcosValue}
                onChange={(val) => setValue('pcos', val, { shouldValidate: true })}
                error={errors.pcos?.message}
              />

              {/* Dropdown 3: Hormonal */}
              <GlassDropdown
                label="Hormonal"
                value={hormonalValue}
                onChange={(val) => setValue('hormonal', val, { shouldValidate: true })}
                error={errors.hormonal?.message}
              />

              {/* Dropdown 4: Thyroid */}
              <GlassDropdown
                label="Thyroid"
                value={thyroidValue}
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

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
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
            </div>
          )}
        </form>
      </div>
    </section>
  );
}