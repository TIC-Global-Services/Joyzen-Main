'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import SpecularButton from '@/reuseable/specularButton';
import GradientOptionWrapper from './GradientOptionWrapper';
import { careChoices, getHealthOptions, type ExploreFormData } from './constants';
import { FIELD_FOCUS, FIELD_SHELL } from './ui';

interface Props {
  isSubmitting: boolean;
  onBack: () => void;
}

export default function StepGoals({ isSubmitting, onBack }: Props) {
  const { register, setValue, watch } = useFormContext<ExploreFormData>();

  const gender = watch('gender');
  const careChoice = watch('careChoice') || '';
  const selectedOption = watch('selectedOption');

  const current = getHealthOptions(gender, careChoice);

  return (
    <div className="space-y-5">
      {gender === 'Prefer not to say' && (
        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold tracking-wide text-zinc-600 px-2">Select care focus</legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {careChoices.map((choice) => {
              const isChosen = careChoice === choice;
              return (
                <button
                  key={choice}
                  type="button"
                  aria-pressed={isChosen}
                  onClick={() => {
                    setValue('careChoice', isChosen ? '' : choice);
                    setValue('selectedOption', '');
                  }}
                  className={`py-3 px-3 rounded-[20px] text-xs sm:text-sm font-semibold transition-all cursor-pointer border text-center ${
                    isChosen
                      ? 'bg-[#036132] text-white border-[#036132] shadow-sm'
                      : 'bg-white/40 text-zinc-700 border-white/80 hover:bg-white/70'
                  }`}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {current && current.options.length > 0 && (
        <fieldset className="space-y-3">
          <legend className="text-xs font-semibold tracking-wide text-zinc-600 px-2 mb-1">{current.heading}</legend>
          {current.options.map((option, idx) => {
            const isChosen = selectedOption === option;
            return (
              <GradientOptionWrapper key={option} isSelected={isChosen} index={idx}>
                <button
                  type="button"
                  aria-pressed={isChosen}
                  onClick={() => setValue('selectedOption', isChosen ? '' : option, { shouldValidate: true })}
                  className={`w-full text-left px-6 py-4 text-sm sm:text-base transition-colors rounded-[26px] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#95C1E2] ${
                    isChosen ? 'font-bold text-zinc-900' : 'font-medium text-zinc-700 hover:text-zinc-900'
                  }`}
                >
                  {option}
                </button>
              </GradientOptionWrapper>
            );
          })}
        </fieldset>
      )}

      <div className="space-y-2 pt-2">
        <div className="px-2">
          <label htmlFor="unclear_health_description" className="block text-sm sm:text-base font-bold text-zinc-900">
            Unclear about your concern?
          </label>
          <p className="text-xs text-zinc-600">Describe what you are experiencing in your own words.</p>
        </div>
        <div className={`${FIELD_SHELL} ${FIELD_FOCUS} !rounded-[24px] p-2`}>
          <textarea
            id="unclear_health_description"
            {...register('unclear_health_description')}
            rows={3}
            placeholder="Tell us about any specific symptoms or health details..."
            className="w-full px-4 py-2 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-500 bg-transparent outline-none resize-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="extra_notes" className="block px-2 text-xs font-semibold text-zinc-700">
          Message / extra notes
        </label>
        <div className={`${FIELD_SHELL} ${FIELD_FOCUS} !rounded-[24px] p-2`}>
          <textarea
            id="extra_notes"
            {...register('extra_notes')}
            rows={2}
            placeholder="Any additional preferences, questions, or notes..."
            className="w-full px-4 py-2 text-sm sm:text-base font-medium text-zinc-700 placeholder:text-zinc-500 bg-transparent outline-none resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[24px] text-sm font-semibold text-zinc-700 bg-white/60 border border-white hover:bg-white transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
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
    </div>
  );
}
