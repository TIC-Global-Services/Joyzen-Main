'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
});

export type GeneralCareFormData = z.infer<typeof generalCareSchema>;

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
            className={`px-6 sm:px-8 py-2 rounded-full text-2xl font-semibold transition-all duration-300 ${
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
            className={`px-6 sm:px-8 py-2 rounded-full text-2xl font-semibold transition-all duration-300 ${
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
                <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold tracking-tight text-black leading-none mb-4">
                  Going through reproductive health problems? view our plans here.
                </h2>
                <p className="text-sm sm:text-[22px] text-zinc-600 font-normal leading-[1.2]">
                  Designed personally for your reproductive health taken <br/> care by your own doctor.
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
                <p className="text-sm sm:text-[22px] text-zinc-600 font-normal leading-[1.2]">
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
  const [genderOpen, setGenderOpen] = useState(false);
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
    },
  });

  const selectedGender = watch('gender');

  const onSubmit = (data: ReproductiveCareFormData) => {
    console.log('Reproductive Care Form Submitted:', data);
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative w-full max-w-xl mt-5">
       
      {/* Background Joyzen Orange Logo Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none z-0 opacity-40 select-none">
        <Image
          src="/joyzen-orange.png"
          alt="Joyzen Orange Logo Watermark"
          fill
          className="object-contain"
        />
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
            className="mt-4 px-6 py-2 rounded-full text-xs font-semibold text-zinc-800 bg-white/80 border border-white shadow-xs"
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
                onClick={() => setGenderOpen(!genderOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left text-sm sm:text-base font-medium text-zinc-700 focus:outline-none"
              >
                <span>{selectedGender || 'Gender'}</span>
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

              {/* Glassmorphic Dropdown List */}
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

          {/* Submit Specular Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
            
              className="font-bold text-sm uppercase tracking-tight px-7 py-3.5 bg-[#AEDEE44D] border-[#AEDEE44D] text-black rounded-[28px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] hover:bg-white/70 hover:border-[#AEDEE4] transition-all duration-300"
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
    },
  });

  const selectedGender = watch('gender');
  const selectedSpecialist = watch('specialist');

  const onSubmit = (data: GeneralCareFormData) => {
    console.log('General Care Form Submitted:', data);
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative w-full max-w-xl space-y-4">
      
      {/* Background Joyzen Orange Logo Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none z-0 opacity-40 select-none">
        <Image
          src="/joyzen-orange.png"
          alt="Joyzen Orange Logo Watermark"
          fill
          className="object-contain"
        />
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
            className="mt-4 px-6 py-2 rounded-full text-xs font-semibold text-zinc-800 bg-white/80 border border-white shadow-xs"
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
                onClick={() => setGenderOpen(!genderOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left text-sm sm:text-base font-medium text-[#6E6E6E] focus:outline-none"
              >
                <span>{selectedGender || 'Gender'}</span>
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
                            ? 'font-bold text-[#6E6E6E]'
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

          {/* Concern Glassmorphic Input */}
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

          {/* Who would you like to get in touch with? Glassmorphic Custom Select Dropdown */}
          <div>
            <div className="relative rounded-[28px] bg-white/5 backdrop-blur-[2px] border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] transition-all overflow-hidden">
              <button
                type="button"
                onClick={() => setSpecialistOpen(!specialistOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left text-sm sm:text-base font-medium text-zinc-700 focus:outline-none"
              >
                <span>{selectedSpecialist || 'Who would you like to get in touch with?'}</span>
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
            {errors.specialist && <p className="text-xs font-medium text-red-500 mt-1 pl-4">{errors.specialist.message}</p>}
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