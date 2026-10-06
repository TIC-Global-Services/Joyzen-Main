'use client';

import React, { useState } from 'react';
import { LiquidGlass } from '@liquidglass/react';
import SpecularButton from '@/reuseable/specularButton';
import type { MembershipProgramData, MembershipPlanTier } from '@/reuseable/programMembershipData';

export interface ProgramMembershipProps {
  /** Complete program data containing pricing, features, and text copy */
  data: MembershipProgramData;
  /** Optional custom container styling */
  className?: string;
  /** Callback triggered when user clicks plan CTA button */
  onPlanSelect?: (plan: MembershipPlanTier) => void;
  /** Callback triggered when user clicks care team CTA button */
  onCareTeamClick?: () => void;
}

/**
 * Reusable Program Membership Section
 * Faithfully matches the Joyzen design specifications:
 * - Animated top orb slot
 * - Program header & subtitles
 * - Frosted pill tab selector for durations
 * - Selected plan card with daily pricing & savings pill
 * - Multi-column "What's Included" feature checklist
 * - Supporting tagline
 * - Care team guidance pill
 * - Post-enrollment timeline & closing statement
 */
export default function ProgramMembership({
  data,
  className = '',
  onPlanSelect,
  onCareTeamClick,
}: ProgramMembershipProps) {
  // Default to the designated plan tier (usually '6-months') or the first plan
  const defaultTierId = data.defaultPlanId || data.plans[data.plans.length - 1]?.id || data.plans[0]?.id;
  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultTierId);

  const selectedPlan =
    data.plans.find((p) => p.id === selectedPlanId) || data.plans[0];

  return (
    <section
      aria-label={`${data.programName} Membership Plans`}
      className={`w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-32 flex flex-col items-center select-none relative ${className}`}
    >
      {/* Orb Logo Slot (preserves GSAP / Three.js targets) */}
      <div
        data-orb-slot
        className="relative mx-auto mb-6 flex items-center justify-center rounded-full"
        style={{ width: 'clamp(100px, 12vw, 200px)', height: 'clamp(100px, 12vw, 200px)' }}
      >
        <div
          data-orb-ring
          className="absolute inset-0 rounded-full border-[5px] border-white/80 opacity-0"
          style={{
            boxShadow:
              '0 0 50px rgba(255, 255, 255, 0.85), 0 20px 60px rgba(36, 168, 184, 0.3), inset 0 0 25px rgba(255, 255, 255, 0.4)',
          }}
        />
      </div>

      {/* Main Title */}
      <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-tight text-zinc-900 text-center mb-3">
        Choose Your{' '}
        <span style={{ color: data.programHighlightColor || '#7EBDB9' }}>
          {data.programName}
        </span>{' '}
        Membership
      </h2>

      {/* Hero Tagline & Subtitle */}
      <div className="text-center max-w-2xl mx-auto mb-9 space-y-1 px-4">
        <p className="text-base sm:text-lg font-medium text-black leading-snug">
          {data.tagline}
        </p>
        <p className="text-base sm:text-lg text-black font-normal leading-relaxed">
          {data.subtitle}
        </p>
      </div>

      {/* Interactive Duration Tabs Selector Pill with Liquid Glass */}
      <div className="mb-10 mx-auto max-w-full overflow-x-auto">
        <LiquidGlass
          borderRadius={9999}
          blur={1.8}
          contrast={1.12}
          brightness={1.05}
          saturation={1.15}
          shadowIntensity={0.08}
          displacementScale={0.8}
          elasticity={0.4}
          zIndex={10}
          className="rounded-full border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
        >
          <div
            role="tablist"
            aria-label="Select Plan Duration"
            className="inline-flex items-center p-1.5 rounded-full"
          >
            {data.plans.map((plan) => {
              const isSelected = plan.id === selectedPlanId;

              if (isSelected) {
                return (
                  <LiquidGlass
                    key={plan.id}
                    borderRadius={9999}
                    blur={1.5}
                    contrast={1.12}
                    brightness={1.06}
                    saturation={1.2}
                    shadowIntensity={0.1}
                    displacementScale={0.8}
                    elasticity={0.4}
                    zIndex={20}
                    className="rounded-full shadow-xl border border-white/90 bg-white/60"
                  >
                    <button
                      role="tab"
                      aria-selected={true}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className="relative px-5 sm:px-20 py-2 sm:py-2.5 rounded-full flex flex-col items-center justify-center cursor-pointer outline-none whitespace-nowrap"
                    >
                      <span className="text-sm sm:text-2xl font-bold leading-tight text-[#E5855E]">
                        {plan.durationTitle}
                      </span>
                      <span className="text-[11px] sm:text-base leading-tight mt-0.5 text-zinc-900 font-semibold">
                        {plan.durationSubtitle}
                      </span>
                    </button>
                  </LiquidGlass>
                );
              }

              return (
                <button
                  key={plan.id}
                  role="tab"
                  aria-selected={false}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                  className="relative px-5 sm:px-20 py-2 sm:py-2.5 rounded-full transition-all duration-300 flex flex-col items-center justify-center cursor-pointer outline-none whitespace-nowrap hover:bg-white/40 opacity-80 hover:opacity-100"
                >
                  <span className="text-sm sm:text-2xl font-bold leading-tight text-zinc-800">
                    {plan.durationTitle}
                  </span>
                  <span className="text-[11px] sm:text-base leading-tight mt-0.5 text-zinc-500 font-normal">
                    {plan.durationSubtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </LiquidGlass>
      </div>

      {/* Dual Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8  w-full px-[5%] items-stretch">
        {/* Left Card: Selected Plan Details */}
        <div className="relative rounded-[2.2rem] p-7 sm:p-9 lg:p-10 flex flex-col justify-between overflow-hidden border border-white/90 bg-white/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.95)] min-h-[380px]">
          {/* Ambient bottom gradient (soft lavender/pink on bottom-left, sky cyan on bottom-right) */}
          <div
            className="absolute inset-0 rounded-[2.2rem] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 55% 50% at 100% 100%, rgba(143, 221, 243, 0.75) 0%, rgba(175, 226, 245, 0.35) 42%, transparent 72%), radial-gradient(ellipse 65% 50% at 0% 100%, rgba(246, 210, 238, 0.75) 0%, rgba(238, 205, 242, 0.35) 45%, transparent 75%), linear-gradient(to bottom, #ffffff 58%, #fffefe 100%)',
            }}
          />

          <div className="relative z-10">
            {/* Top Badge */}
            <span className="text-[#E5855E] text-xl sm:text-2xl font-bold tracking-tight mb-4 block">
              {selectedPlan.badge}
            </span>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
              {selectedPlan.originalDailyPrice && (
                <span className="text-2xl sm:text-3xl font-bold text-zinc-900 line-through tracking-tight">
                  {selectedPlan.originalDailyPrice}
                </span>
              )}
              <div className="flex items-baseline">
                <span className="text-4xl sm:text-5xl lg:text-[54px] font-black text-zinc-900 tracking-tight leading-none">
                  {selectedPlan.dailyPrice}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-zinc-900 ml-1">
                  {selectedPlan.priceUnit || '/Day'}
                </span>
              </div>
            </div>

            {/* Savings Badge & Comparison */}
            {(selectedPlan.savingsBadge || selectedPlan.savingsComparisonText) && (
              <div className="flex items-center gap-2.5 mt-3 sm:mt-4 flex-wrap">
                {selectedPlan.savingsBadge && (
                  <span className="inline-flex items-center text-sm font-semibold text-[#036132] bg-[#EAF7EE] border border-[#CDECD5] px-3.5 py-1 rounded-full shadow-xs">
                    {selectedPlan.savingsBadge}
                  </span>
                )}
                {selectedPlan.savingsComparisonText && (
                  <span className="text-sm font-semibold text-zinc-800">
                    {selectedPlan.savingsComparisonText}
                  </span>
                )}
              </div>
            )}

            {/* Plan Commitment Summary */}
            <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-3">
              {selectedPlan.planSummary}
            </p>
          </div>

          {/* Bottom Action Button */}
          <div className="flex justify-end mt-8 sm:mt-12 relative z-10">
            <SpecularButton
              type="button"
              size="md"
              tint="#AEDEE44D"
              tintOpacity={0.35}
              textColor="#000000"
              lineColor="#ffffff"
              baseColor="#AEDEE44D"
              radius={20}
              onClick={() => onPlanSelect?.(selectedPlan)}
              className="font-bold text-sm uppercase tracking-tight px-6 py-2.5 shadow-sm"
            >
              {selectedPlan.ctaButtonText}
            </SpecularButton>
          </div>
        </div>

        {/* Right Card: What's Included Feature Checklist */}
        <div className="relative rounded-[2.2rem] p-7 sm:p-9 lg:p-10 flex flex-col justify-start overflow-hidden border border-white/90 bg-white/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.95)] min-h-[380px]">
          {/* Ambient bottom gradient (soft lavender/pink on bottom-left, sky cyan on bottom-right) */}
          <div
            className="absolute inset-0 rounded-[2.2rem] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 55% 50% at 100% 100%, rgba(143, 221, 243, 0.75) 0%, rgba(175, 226, 245, 0.35) 42%, transparent 72%), radial-gradient(ellipse 65% 50% at 0% 100%, rgba(246, 210, 238, 0.75) 0%, rgba(238, 205, 242, 0.35) 45%, transparent 75%), linear-gradient(to bottom, #ffffff 58%, #fffefe 100%)',
            }}
          />

          <div className="relative z-10">
            <h3 className="text-lg sm:text-xl font-bold text-zinc-700 tracking-tight mb-6">
              {data.includedTitle}
            </h3>

            {/* 2-Column Checklist */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
              {data.includedFeatures.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2.5 text-xs sm:text-[13px] font-medium text-zinc-700 leading-snug"
                >
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 text-zinc-600 shrink-0"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <circle cx="10" cy="10" r="8.75" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="M6 10.2L8.8 13L14 7.8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Supporting Line */}
      <p className="text-black text-sm sm:text-2xl font-normal text-center mt-6 mb-8 tracking-tight">
        {data.supportingLine}
      </p>

      {/* Care Team Block with Liquid Glass */}
      <div className="w-full max-w-4xl mx-auto hidden md:block ">
        <LiquidGlass
          borderRadius={9999}
          blur={1.8}
          contrast={1.12}
          brightness={1.05}
          saturation={1.15}
          shadowIntensity={0.08}
          displacementScale={0.8}
          elasticity={0.4}
          zIndex={10}
          className="rounded-md md:rounded-full border border-white/80 shadow-[0_15px_35px_rgba(0,0,0,0.04)] w-full"
        >
          <div className="px-6 sm:px-8 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <p className="text-xs sm:text-lg text-black font-bold max-w-xl text-center sm:text-left leading-[1.2]">
              {data.careTeamBlock.text}
            </p>
            <SpecularButton
              type="button"
              size="sm"
              tint="#AEDEE44D"
              tintOpacity={0.35}
              textColor="#000000"
              lineColor="#ffffff"
              baseColor="#AEDEE44D"
              radius={18}
              onClick={onCareTeamClick}
              className="font-bold text-[11px] sm:text-sm uppercase tracking-tight px-5 py-2 shadow-sm whitespace-nowrap"
            >
              {data.careTeamBlock.buttonText}
            </SpecularButton>
          </div>
        </LiquidGlass>
      </div>
      <div className="w-full max-w-4xl mx-auto md:hidden">
        <LiquidGlass
          borderRadius={8}
          blur={1.8}
          contrast={1.12}
          brightness={1.05}
          saturation={1.15}
          shadowIntensity={0.08}
          displacementScale={0.8}
          elasticity={0.4}
          zIndex={10}
          className="rounded-md md:rounded-full border border-white/80 shadow-[0_15px_35px_rgba(0,0,0,0.04)] w-full"
        >
          <div className="px-6 sm:px-8 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <p className="text-xs sm:text-lg text-black font-bold max-w-xl text-center sm:text-left leading-[1.2]">
              {data.careTeamBlock.text}
            </p>
            <SpecularButton
              type="button"
              size="sm"
              tint="#AEDEE44D"
              tintOpacity={0.35}
              textColor="#000000"
              lineColor="#ffffff"
              baseColor="#AEDEE44D"
              radius={18}
              onClick={onCareTeamClick}
              className="font-bold text-[11px] sm:text-sm uppercase tracking-tight px-5 py-2 shadow-sm whitespace-nowrap"
            >
              {data.careTeamBlock.buttonText}
            </SpecularButton>
          </div>
        </LiquidGlass>
      </div>

      {/* After Enrollment & Closing Statement */}
      <div className="w-full flex flex-col items-center justify-center mt-8 gap-1.5 text-center px-4">
        <p className="text-xs sm:text-2xl text-zinc-600 font-normal">
          {data.afterEnrollmentNotice}
        </p>
        <p className="text-sm sm:text-2xl font-bold text-zinc-900 max-w-3xl leading-[1.2]">
          {data.closingStatement}
        </p>
      </div>
    </section>
  );
}
