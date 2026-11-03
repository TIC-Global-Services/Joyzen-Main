'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import SelectDropdown, { toOptions } from './SelectDropdown';
import { COUNTRIES, getStatesByCountry, getCitiesByState } from '@/lib/utils';
import { countryCodeOptions, genderOptions, leadSourceOptions, type ExploreFormData } from './constants';
import { CloseIcon, FIELD_FOCUS, FIELD_SHELL, FieldError, INPUT_CLASS } from './ui';

// Built once at module load, not on every render.
const GENDER_OPTS = toOptions(genderOptions);
const LEAD_OPTS = toOptions(leadSourceOptions);
const COUNTRY_OPTS = toOptions(COUNTRIES);
const CODE_OPTS = countryCodeOptions.map((c) => ({ value: c.code, label: c.label }));

export default function StepBasic() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ExploreFormData>();

  const gender = watch('gender');
  const countryCode = watch('countryCode');
  const country = watch('raw_country') || '';
  const state = watch('raw_state') || '';
  const city = watch('raw_city') || '';
  const leadSource = watch('temp_lead_source') || '';
  const dob = watch('dob');

  // Set after mount so server and client markup match (no hydration mismatch).
  const [maxDob, setMaxDob] = useState<string | undefined>();
  useEffect(() => {
    setMaxDob(new Date().toLocaleDateString('en-CA')); // YYYY-MM-DD in local time
  }, []);

  const stateOpts = useMemo(
    () => toOptions(country ? getStatesByCountry(country) : []),
    [country]
  );
  const cityOpts = useMemo(
    () => toOptions(country && state ? getCitiesByState(country, state) : []),
    [country, state]
  );

  const onGenderChange = (v: string) => {
    setValue('gender', v, { shouldValidate: true });
    setValue('selectedOption', '');
    setValue('careChoice', '');
  };

  return (
    <div className="space-y-4">
      {/* Full name */}
      <div>
        <div className={`${FIELD_SHELL} ${FIELD_FOCUS}`}>
          <input
            {...register('fullName')}
            type="text"
            autoComplete="name"
            aria-label="Full name"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'err-fullName' : undefined}
            placeholder="Full Name *"
            className={INPUT_CLASS}
          />
        </div>
        <FieldError id="err-fullName" message={errors.fullName?.message} />
      </div>

      {/* Phone */}
      <div>
        <div className="flex gap-2">
          <SelectDropdown
            className="w-36 shrink-0"
            triggerClassName="px-4"
            ariaLabel="Country code"
            placeholder="Code"
            value={countryCode}
            triggerLabel={countryCode}
            options={CODE_OPTS}
            clearable={false}
            onChange={(v) => setValue('countryCode', v, { shouldValidate: true })}
          />
          <div className={`${FIELD_SHELL} ${FIELD_FOCUS} flex-1`}>
            <input
              {...register('phone')}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              aria-label="Phone number"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'err-phone' : undefined}
              placeholder="Phone Number (e.g. 9876543210) *"
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <FieldError id="err-phone" message={errors.phone?.message} />
      </div>

      {/* Gender */}
      <div>
        <SelectDropdown
          ariaLabel="Gender"
          placeholder="Gender *"
          prefix="Gender: "
          triggerClassName="px-6"
          value={gender}
          options={GENDER_OPTS}
          onChange={onGenderChange}
        />
        <FieldError id="err-gender" message={errors.gender?.message} />
      </div>

      {/* Email + DOB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className={`${FIELD_SHELL} ${FIELD_FOCUS}`}>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              aria-label="Email (optional)"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'err-email' : undefined}
              placeholder="Email (optional)"
              className={INPUT_CLASS}
            />
          </div>
          <FieldError id="err-email" message={errors.email?.message} />
        </div>

        <div>
          <div className={`group ${FIELD_SHELL} ${FIELD_FOCUS}`}>
            <div className="relative flex items-center">
              {!dob && (
                <span className="pointer-events-none absolute left-6 text-sm sm:text-base font-medium text-zinc-500 select-none">
                  Date of birth (optional)
                </span>
              )}
              <input
                {...register('dob')}
                type="date"
                max={maxDob}
                min="1920-01-01"
                aria-label="Date of birth (optional)"
                aria-invalid={!!errors.dob}
                aria-describedby={errors.dob ? 'err-dob' : undefined}
                className={`w-full px-6 py-4 text-sm sm:text-base font-medium bg-transparent outline-none rounded-[28px] cursor-pointer transition-colors scheme-light [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                  dob ? 'text-zinc-900 font-semibold' : 'text-transparent'
                }`}
              />
              {dob && (
                <button
                  type="button"
                  aria-label="Clear date of birth"
                  onClick={() => setValue('dob', '', { shouldValidate: true })}
                  className="relative z-10 p-1 mr-2 rounded-full text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/60 transition-colors cursor-pointer shrink-0"
                >
                  <CloseIcon />
                </button>
              )}
              <div aria-hidden="true" className="pointer-events-none pr-5 text-zinc-500 group-hover:text-zinc-700 transition-colors shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <FieldError id="err-dob" message={errors.dob?.message} />
        </div>
      </div>

      {/* Country / State / City */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SelectDropdown
          ariaLabel="Country"
          placeholder="Country"
          searchable
          searchPlaceholder="Search country..."
          value={country}
          options={COUNTRY_OPTS}
          onChange={(v) => {
            setValue('raw_country', v);
            setValue('raw_state', '');
            setValue('raw_city', '');
          }}
        />
        <SelectDropdown
          ariaLabel="State"
          placeholder="State"
          searchable
          allowCustom
          searchPlaceholder="Search state..."
          value={state}
          options={stateOpts}
          onChange={(v) => {
            setValue('raw_state', v);
            setValue('raw_city', '');
          }}
        />
        <SelectDropdown
          ariaLabel="City"
          placeholder="City"
          searchable
          allowCustom
          searchPlaceholder="Search or enter city..."
          value={city}
          options={cityOpts}
          onChange={(v) => setValue('raw_city', v)}
        />
      </div>

      {/* Lead source */}
      <SelectDropdown
        ariaLabel="How did you hear about us?"
        placeholder="How did you hear about us?"
        triggerClassName="px-6"
        value={leadSource}
        options={LEAD_OPTS}
        onChange={(v) => setValue('temp_lead_source', v)}
      />
    </div>
  );
}
