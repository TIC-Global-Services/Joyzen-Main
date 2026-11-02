'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LiquidGlass } from '@liquidglass/react';
import SpecularButton from '@/reuseable/specularButton';
import type { MembershipProgramData, MembershipPlanTier } from '@/reuseable/programMembershipData';
import {
  fetchSystemPlan,
  createPublicCheckout,
  openRazorpayCheckout,
  formatApiError,
  type PlanVariant,
  type TrialOffer,
} from '@/lib/joyzenApi';

export interface ProgramMembershipProps {
  /** Complete program data containing pricing, features, and text copy */
  data: MembershipProgramData;
  /** Optional custom container styling */
  className?: string;
  /** Optional callback triggered when user clicks plan CTA button */
  onPlanSelect?: (plan: MembershipPlanTier) => void;
  /** Optional callback triggered when user clicks care team CTA button */
  onCareTeamClick?: () => void;
}

/**
 * Reusable Program Membership Section
 * Connected to Joyzen Public Plan Checkout API:
 * - Reads lead_id from sessionStorage (strictly keeping client storage secure)
 * - Fetches live durations and trial offer via Axios (GET /subscription-plans/system-plans/:code?leadId=...)
 * - Displays trial offer card when available
 * - Handles Razorpay checkout modal via Axios (POST /payment-links/public/checkout)
 * - Redirects to Joyzen payment result page on success
 */
/**
 * Helper to build dynamic membership plan tiers from Joyzen API variants
 * with dynamic daily price, baseline comparison, and savings badge.
 */
function buildTiersFromApiVariants(
  variants: PlanVariant[],
  programName: string,
  fallbackPlans: MembershipPlanTier[]
): MembershipPlanTier[] {
  if (!variants || variants.length === 0) return fallbackPlans;

  const sorted = [...variants]
    .filter((v) => v.isActive)
    .sort((a, b) => a.durationInDays - b.durationInDays);

  if (sorted.length === 0) return fallbackPlans;

  const monthlyVariant = sorted[0];
  const baseDailyPrice = Math.max(
    1,
    Math.round(monthlyVariant.price / (monthlyVariant.durationInDays || 30))
  );

  return sorted.map((variant, index) => {
    const dailyPriceNum = Math.max(
      1,
      Math.round(variant.price / (variant.durationInDays || 30))
    );
    const months = Math.round((variant.durationInDays || 30) / 30);
    const isMonthly = variant.durationInDays <= 31;
    const isLongest = index === sorted.length - 1;

    let id = 'monthly';
    if (variant.durationInDays > 31 && variant.durationInDays <= 95) {
      id = '3-months';
    } else if (variant.durationInDays > 95) {
      id = '6-months';
    } else {
      id = `plan-${variant.id}`;
    }

    const fallbackMatch = fallbackPlans.find(
      (fb) =>
        fb.id === id ||
        fb.durationTitle.toLowerCase() === variant.variantLabel.toLowerCase()
    );

    let durationSubtitle = 'Flexible';
    let savingsBadge: string | undefined;
    let savingsComparisonText: string | undefined;
    let originalDailyPrice: string | undefined;
    let badge =
      fallbackMatch?.badge ||
      (isMonthly ? 'Flexible' : isLongest ? 'Biggest Savings' : 'Most Chosen');
    let badgeEmoji =
      fallbackMatch?.badgeEmoji ||
      (isLongest ? '💰' : !isMonthly ? '⭐' : undefined);

    if (!isMonthly) {
      const baselineCost = baseDailyPrice * variant.durationInDays;
      const savings = baselineCost - variant.price;
      if (savings > 0) {
        durationSubtitle = `Save ₹${savings.toLocaleString('en-IN')}`;
        savingsBadge = `Save ₹${savings.toLocaleString('en-IN')}`;
        savingsComparisonText = 'vs paying monthly';
        originalDailyPrice = `₹${baseDailyPrice}`;
      }
    }

    const durationText = months <= 1 ? 'Monthly' : `${months} Month`;
    const commitText =
      months <= 1
        ? `₹${variant.price.toLocaleString('en-IN')}/month · Flexible billing`
        : `₹${variant.price.toLocaleString('en-IN')} for ${months} months`;

    return {
      id,
      backendVariantId: variant.id,
      totalPrice: variant.price,
      durationInDays: variant.durationInDays,
      durationTitle: variant.variantLabel,
      durationSubtitle:
        fallbackMatch?.durationSubtitle && !savingsBadge
          ? fallbackMatch.durationSubtitle
          : durationSubtitle,
      badge,
      badgeEmoji,
      originalDailyPrice,
      dailyPrice: `₹${dailyPriceNum}`,
      priceUnit: '/Day',
      savingsBadge,
      savingsComparisonText,
      planSummary: `${durationText} ${programName} Program · ${commitText}`,
      ctaButtonText: months <= 1 ? 'START MONTHLY' : `CHOOSE ${months} MONTHS`,
    };
  });
}

export default function ProgramMembership({
  data,
  className = '',
  onPlanSelect,
  onCareTeamClick,
}: ProgramMembershipProps) {
  const router = useRouter();

  // State
  const defaultTierId =
    data.defaultPlanId || data.plans[data.plans.length - 1]?.id || data.plans[0]?.id;
  const [activePlans, setActivePlans] = useState<MembershipPlanTier[]>(data.plans);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultTierId);
  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState<boolean>(false);

  // Live API Plan & Trial State
  const [apiVariants, setApiVariants] = useState<PlanVariant[]>([]);
  const [trialOffer, setTrialOffer] = useState<TrialOffer | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showMissingLeadModal, setShowMissingLeadModal] = useState<boolean>(false);

  // Read lead_id from sessionStorage on mount (strictly transient, no PII)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLeadId = sessionStorage.getItem('joyzen_lead_id');
      setLeadId(storedLeadId);

      // Fetch live system plan and trial offer via Axios
      const programCode = data.programKey.toUpperCase();
      fetchSystemPlan(programCode, storedLeadId)
        .then((planData) => {
          if (planData?.subscriptionPlans?.[0]?.variants) {
            const rawVariants = planData.subscriptionPlans[0].variants.filter((v) => v.isActive);
            setApiVariants(rawVariants);
            const computedTiers = buildTiersFromApiVariants(
              rawVariants,
              data.programName,
              data.plans
            );
            if (computedTiers && computedTiers.length > 0) {
              setActivePlans(computedTiers);
            }
          }
          if (planData?.trial) {
            setTrialOffer(planData.trial);
          }
        })
        .catch((err) => {
          // Gracefully fallback to static plan definitions if API is unreachable
          console.warn('System plan fetch notice (fallback to static tiers):', err?.message);
        });
    }
  }, [data.programKey]);

  useEffect(() => {
    setActivePlans(data.plans);
    setSelectedPlanId(
      data.defaultPlanId || data.plans[data.plans.length - 1]?.id || data.plans[0]?.id
    );
    setIsFeaturesExpanded(false);
  }, [data.programKey, data.defaultPlanId, data.plans]);

  const hasMoreFeatures = data.includedFeatures.length > 10;
  const displayedFeatures =
    hasMoreFeatures && !isFeaturesExpanded
      ? data.includedFeatures.slice(0, 10)
      : data.includedFeatures;

  const selectedPlan =
    activePlans.find((p) => p.id === selectedPlanId) || activePlans[0];

  // Find matching API variant for the currently selected duration
  const findMatchingApiVariant = (): PlanVariant | undefined => {
    if (!apiVariants || apiVariants.length === 0) return undefined;

    const lowerId = selectedPlanId.toLowerCase();
    const lowerTitle = selectedPlan.durationTitle.toLowerCase();

    if (lowerId.includes('month') && !lowerId.includes('3') && !lowerId.includes('6')) {
      return (
        apiVariants.find((v) => v.durationInDays <= 31) ||
        apiVariants.find((v) => v.variantLabel.toLowerCase().includes('month') && !v.variantLabel.includes('3'))
      );
    }
    if (lowerId.includes('3') || lowerTitle.includes('3')) {
      return (
        apiVariants.find((v) => v.durationInDays === 90) ||
        apiVariants.find((v) => v.variantLabel.toLowerCase().includes('3'))
      );
    }
    if (lowerId.includes('6') || lowerTitle.includes('6')) {
      return (
        apiVariants.find((v) => v.durationInDays === 180) ||
        apiVariants.find((v) => v.variantLabel.toLowerCase().includes('6'))
      );
    }

    return apiVariants[0];
  };

  // Perform checkout
  const handleInitiateCheckout = async (planTier: MembershipPlanTier, isTrial = false) => {
    // If a custom callback is provided by parent, invoke it
    if (onPlanSelect) {
      onPlanSelect(planTier);
      return;
    }

    setCheckoutError(null);

    // Verify leadId in sessionStorage
    const currentLeadId = leadId || (typeof window !== 'undefined' ? sessionStorage.getItem('joyzen_lead_id') : null);

    if (!currentLeadId) {
      setShowMissingLeadModal(true);
      return;
    }

    setIsCheckingOut(true);

    try {
      let targetPlanId: string;

      if (isTrial && trialOffer) {
        targetPlanId = trialOffer.id;
      } else if (planTier.backendVariantId) {
        targetPlanId = planTier.backendVariantId;
      } else {
        const matchedVariant = findMatchingApiVariant();
        if (matchedVariant) {
          targetPlanId = matchedVariant.id;
        } else if (apiVariants.length > 0) {
          targetPlanId = apiVariants[0].id;
        } else {
          // If no API variants returned, prompt visitor
          throw new Error('This plan is currently not available for instant online checkout. Please contact our care team.');
        }
      }

      // Call checkout API via Axios
      const checkoutData = await createPublicCheckout({
        subscriptionPlanId: targetPlanId,
        leadId: currentLeadId,
        acceptedTerms: true,
        futurePlanCode: isTrial ? data.programKey.toUpperCase() : undefined,
      });

      // Open Razorpay Popup
      await openRazorpayCheckout(checkoutData, () => {
        // Modal dismissed by visitor
        setIsCheckingOut(false);
      });
    } catch (err) {
      const errMsg = formatApiError(err);

      // Handle specific API error codes
      if (errMsg.includes('404') || errMsg.toLowerCase().includes('buyer_not_found') || errMsg.toLowerCase().includes('saved lead id is wrong')) {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('joyzen_lead_id');
        }
        setLeadId(null);
        setShowMissingLeadModal(true);
      } else if (errMsg.toLowerCase().includes('trial_already_used')) {
        setTrialOffer(null);
        setCheckoutError('You have already availed the trial offer. Please select one of our standard plan durations.');
      } else {
        setCheckoutError(errMsg);
      }
      setIsCheckingOut(false);
    }
  };

  return (
    <section
      aria-label={`${data.programName} Membership Plans`}
      className={`w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-32 flex flex-col items-center select-none relative ${className}`}
    >
      {/* Missing Lead Modal Prompt */}
      {showMissingLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] bg-white p-7 sm:p-8 text-center shadow-2xl border border-zinc-100 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#AEDEE4]/40 text-[#036132] mx-auto flex items-center justify-center font-bold text-lg">
              ✓
            </div>
            <h3 className="text-xl font-bold text-zinc-900">
              Personalize Your {data.programName} Plan
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              To tailor your care program with your dedicated doctor and activate enrollment, please complete our quick assessment first.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => router.push(`/q-form?plan=${data.programKey.toUpperCase()}`)}
                className="w-full py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider bg-[#036132] text-white hover:bg-[#024a26] transition-colors cursor-pointer"
              >
                Complete Assessment
              </button>
              <button
                type="button"
                onClick={() => setShowMissingLeadModal(false)}
                className="w-full py-3 px-6 rounded-full font-semibold text-xs text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
      <div className="text-center max-w-2xl mx-auto mb-7 space-y-1 px-4">
        <p className="text-base sm:text-lg font-medium text-black leading-snug">
          {data.tagline}
        </p>
        <p className="text-base sm:text-lg text-black font-normal leading-relaxed">
          {data.subtitle}
        </p>
      </div>

      {/* Checkout Error Notice */}
      {checkoutError && (
        <div className="w-full max-w-xl mb-6 p-4 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm text-center">
          {checkoutError}
        </div>
      )}

      {/* Optional Trial Card (shown above duration tabs if offered by API) */}
      {trialOffer && (
        <div className="mb-8 w-full max-w-xl mx-auto px-4">
          <LiquidGlass
            borderRadius={26}
            blur={2}
            contrast={1.12}
            brightness={1.05}
            saturation={1.15}
            shadowIntensity={0.06}
            displacementScale={0.8}
            elasticity={0.4}
            zIndex={10}
            className="rounded-[26px] border border-white/90 bg-white/75 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-[#AEDEE4]/60 text-[#036132] flex items-center justify-center font-bold text-base shrink-0">
                ★
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-zinc-900">
                  Start with a {trialOffer.durationInDays}-day trial · ₹{trialOffer.price}
                </p>
                <p className="text-xs text-zinc-500">
                  Experience full personal guidance before committing to a plan
                </p>
              </div>
            </div>
            <SpecularButton
              type="button"
              size="sm"
              tint="#AEDEE44D"
              tintOpacity={0.6}
              textColor="#000000"
              lineColor="#ffffff"
              baseColor="#AEDEE44D"
              radius={20}
              disabled={isCheckingOut}
              onClick={() => handleInitiateCheckout(selectedPlan, true)}
              className="font-bold text-xs uppercase tracking-tight px-6 py-2.5 whitespace-nowrap cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isCheckingOut ? 'Opening...' : 'Start Trial'}
            </SpecularButton>
          </LiquidGlass>
        </div>
      )}

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
            {activePlans.map((plan) => {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full px-[5%] items-stretch">
        {/* Left Card: Selected Plan Details */}
        <div className="relative rounded-[2.2rem] p-7 sm:p-9 lg:p-10 flex flex-col justify-between overflow-hidden border border-white/90 bg-white/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.95)] min-h-[380px]">
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
                <span className="text-4xl sm:text-5xl lg:text-[70px] font-black text-[#036132] tracking-tight leading-none font-sans">
                  {selectedPlan.dailyPrice}
                </span>
                <span className="text-xl sm:text-[70px] font-bold text-zinc-900 ml-1">
                  {selectedPlan.priceUnit || '/Day'}
                </span>
              </div>
            </div>

            {/* Plan Commitment Summary */}
            <p className="text-xs sm:text-lg text-[#6E6E6E] tracking-tight font-bold mt-2">
              {selectedPlan.planSummary}
            </p>

            {/* Savings Badge */}
            {(selectedPlan.savingsBadge || selectedPlan.savingsComparisonText) && (
              <div className="flex items-center mt-2 flex-wrap gap-1.5">
                {selectedPlan.savingsBadge && (
                  <span className="inline-flex items-center text-lg sm:text-xl font-semibold text-[#036132]">
                    {selectedPlan.savingsBadge}
                  </span>
                )}
                {selectedPlan.savingsComparisonText && (
                  <span className="inline-flex items-center text-lg sm:text-xl font-semibold text-[#036132]">
                    {selectedPlan.savingsComparisonText}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-start mt-8 sm:mt-12 relative z-10">
            <SpecularButton
              type="button"
              size="md"
              tint="#AEDEE44D"
              tintOpacity={0.6}
              textColor="#000000"
              lineColor="#ffffff"
              baseColor="#AEDEE44D"
              radius={20}
              disabled={isCheckingOut}
              onClick={() => handleInitiateCheckout(selectedPlan, false)}
              className="font-bold text-sm uppercase tracking-tight px-6 py-2.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isCheckingOut ? 'Loading Payment...' : selectedPlan.ctaButtonText}
            </SpecularButton>
          </div>
        </div>

        {/* Right Card: What's Included Feature Checklist */}
        <div className="relative rounded-[2.2rem] p-7 sm:p-9 lg:p-10 flex flex-col justify-start overflow-hidden border border-white/90 bg-white/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.95)] min-h-[380px]">
          <div
            className="absolute inset-0 rounded-[2.2rem] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 55% 50% at 100% 100%, rgba(143, 221, 243, 0.75) 0%, rgba(175, 226, 245, 0.35) 42%, transparent 72%), radial-gradient(ellipse 65% 50% at 0% 100%, rgba(246, 210, 238, 0.75) 0%, rgba(238, 205, 242, 0.35) 45%, transparent 75%), linear-gradient(to bottom, #ffffff 58%, #fffefe 100%)',
            }}
          />

          <div className="relative z-10">
            <h3 className="text-lg sm:text-[28px] font-bold text-[#6E6E6E] tracking-tight mb-6 whitespace-pre-line">
              {data.includedTitle}
            </h3>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
              {displayedFeatures.map((feature, idx) => (
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

            {hasMoreFeatures && (
              <div className="mt-5 pt-1 flex justify-start">
                <button
                  type="button"
                  onClick={() => setIsFeaturesExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-zinc-800 hover:text-black transition-colors duration-200 cursor-pointer group"
                >
                  <span className="underline underline-offset-4 decoration-zinc-300 group-hover:decoration-black transition-colors">
                    {isFeaturesExpanded ? 'Read less' : 'Read more'}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-zinc-500 group-hover:text-black transition-transform duration-200 ${
                      isFeaturesExpanded ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.5 6L8 10.5L12.5 6"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Supporting Line */}
      <p className="text-black text-sm sm:text-base font-normal text-center mt-6 sm:mt-8 mb-8 sm:mb-10 tracking-tight">
        {data.supportingLine}
      </p>

      {/* Care Team Block with Liquid Glass */}
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4">
        <LiquidGlass
          borderRadius={32}
          blur={1}
          contrast={1.12}
          brightness={1.05}
          saturation={1.15}
          shadowIntensity={0.06}
          displacementScale={0.8}
          elasticity={0.4}
          zIndex={10}
          className="w-full rounded-[28px] sm:rounded-[34px] bg-[#EAF7F5]/75 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.95)] overflow-hidden"
        >
          <div className="px-6 py-8 sm:px-12 sm:py-10 flex flex-col items-center justify-center text-center relative z-10">
            <p className="text-lg sm:text-2xl md:text-[24px] font-bold text-black max-w-xl mx-auto leading-[1.2] tracking-tight mb-6 sm:mb-8 text-center">
              {data.careTeamBlock.text}
            </p>
            <SpecularButton
              type="button"
              size="sm"
              tint="#BCE5E8"
              tintOpacity={0.25}
              textColor="#EF8F60"
              lineColor="#ffffff"
              baseColor="#AEDEE44D"
              radius={24}
              onClick={onCareTeamClick}
              className="font-medium text-xs sm:text-sm uppercase tracking-tight px-7 py-2.5 shadow-sm whitespace-nowrap"
            >
              {data.careTeamBlock.buttonText}
            </SpecularButton>
          </div>
        </LiquidGlass>
      </div>

      {/* After Enrollment & Closing Statement */}
      <div className="w-full max-w-xl sm:max-w-2xl mx-auto flex flex-col items-center justify-center mt-8 sm:mt-4 text-center px-4">
        <p className="text-xs sm:text-base text-black font-normal leading-[1.4] text-center whitespace-pre-line">
          {data.afterEnrollmentNotice} {data.closingStatement}
        </p>
      </div>
    </section>
  );
}
