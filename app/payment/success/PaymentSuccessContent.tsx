'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import OptimizedPastelGradient from '@/components/shared/OptimizedPastelGradient';
import SpecularButton from '@/reuseable/specularButton';

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const paymentLinkId = searchParams.get('paymentLinkId') || 'cd9c1608-3f1f-40c4-b4f2-2edd2e7ffb04';
  const planNameParam = searchParams.get('planName');
  const amountParam = searchParams.get('amount');
  const currencyParam = searchParams.get('currency') || 'INR';

  const [copied, setCopied] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [planDetails, setPlanDetails] = useState<{
    planName: string;
    amount?: number | null;
    currency: string;
  }>({
    planName: planNameParam || '',
    amount: amountParam ? Number(amountParam) : null,
    currency: currencyParam,
  });

  useEffect(() => {
    // Generate clean localized date on client to avoid hydration mismatch
    const now = new Date();
    setFormattedDate(
      now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    );

    // If planName was not passed in URL, check sessionStorage backup
    if (!planNameParam && typeof window !== 'undefined') {
      try {
        const rawOrder = sessionStorage.getItem('joyzen_last_order');
        if (rawOrder) {
          const parsed = JSON.parse(rawOrder);
          if (parsed.planName) {
            setPlanDetails({
              planName: parsed.planName,
              amount: parsed.amount ? Number(parsed.amount) : null,
              currency: parsed.currency || 'INR',
            });
            return;
          }
        }
      } catch {
        /* storage read non-fatal */
      }
    }

    // Default fallback if no plan name is discovered
    if (!planNameParam && !planDetails.planName) {
      setPlanDetails({
        planName: 'Joyzen Comprehensive Care Plan',
        amount: null,
        currency: 'INR',
      });
    }
  }, [planNameParam, planDetails.planName]);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(paymentLinkId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const planTitleForMessage = planDetails.planName || 'Joyzen Care Plan';
  const whatsappMessage = encodeURIComponent(
    `Hello Joyzen Care Team, I have completed my payment for the "${planTitleForMessage}" (Reference ID: ${paymentLinkId}). Could you please assist me with scheduling my doctor consultation?`
  );
  const whatsappUrl = `https://wa.me/911244962743?text=${whatsappMessage}`;

  return (
    <div className="relative w-full min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center select-none overflow-x-hidden">
      {/* 1. Ultra-Optimized Fixed Pastel Moving Gradient (0% Main-Thread CPU) */}
      {/* <div className="print:hidden">
        <OptimizedPastelGradient />
      </div> */}

      {/* 2. Print-specific styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, footer, nav, .print\\:hidden {
            display: none !important;
          }
          .print-card {
            box-shadow: none !important;
            border: 1px solid #e4e4e7 !important;
            max-width: 100% !important;
            padding: 24px !important;
          }
        }
      `}</style>

      {/* 3. Main Glassmorphic Receipt Container */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="print-card relative z-10 w-full max-w-2xl mx-auto rounded-[32px] sm:rounded-[40px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_24px_60px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] p-6 sm:p-10 lg:p-12 space-y-8"
      >
        {/* Header Branding & Success Badge */}
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Logo */}
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <Image
              src="/joyzen_logo.png"
              alt="Joyzen Healthcare"
              width={140}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Animated Green Checkmark Seal */}
          <div className="relative my-5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
              className="w-20 h-20 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#036132] to-[#2E8B57] flex items-center justify-center shadow-[0_10px_30px_rgba(3,97,50,0.3)] text-white"
            >
              <svg
                aria-hidden="true"
                className="w-10 h-10 sm:w-12 sm:h-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            {/* Subtle Aura Rings */}
            <div className="absolute -inset-2 rounded-full border border-[#036132]/20 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
          </div>

          {/* Status Chip */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] text-[#036132] text-xs sm:text-sm font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#036132] animate-pulse" />
            Payment Confirmed
          </div>

          {/* Headlines */}
          <div className="space-y-2 pt-1">
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-zinc-900 tracking-tight leading-tight">
              Welcome to Your Care Program
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 max-w-md mx-auto leading-relaxed">
              Your payment has been verified. A dedicated doctor and personal care concierge have been assigned to your health profile.Our care team member will connect you soon
            </p>
          </div>
        </div>

        {/* 4. Activated Plan Highlight Card */}
        <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 overflow-hidden border border-[#AEDEE4]/60 bg-gradient-to-br from-[#AEDEE4]/25 via-[#F9E0AE]/20 to-[#EF8F60]/15 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-zinc-200/80 text-[11px] font-bold tracking-wider uppercase text-[#036132] mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#036132]" />
                Purchased Plan
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                {planDetails.planName || 'Joyzen Comprehensive Care Plan'}
              </h2>
            </div>
            {planDetails.amount != null && planDetails.amount > 0 && (
              <div className="text-left sm:text-right shrink-0">
                <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold block">Amount Paid</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                  ₹{planDetails.amount.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* Core Plan Inclusions Pill Bar */}
          {/* <div className="pt-2 border-t border-zinc-200/50 flex flex-wrap gap-2 text-xs font-semibold text-zinc-700">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 border border-white">
              <svg className="w-3.5 h-3.5 text-[#036132]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              1-on-1 Dedicated Doctor
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 border border-white">
              <svg className="w-3.5 h-3.5 text-[#036132]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              WhatsApp Care Concierge
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 border border-white">
              <svg className="w-3.5 h-3.5 text-[#036132]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Clinical Prescriptions Included
            </span>
          </div> */}
        </div>

        {/* 5. Payment Summary Box */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#FAF8F5]/80 border border-zinc-200/60 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-200/60">
            <div>
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Reference ID</span>
              <p className="font-mono text-xs sm:text-sm text-zinc-800 break-all select-all font-semibold">
                {paymentLinkId}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyId}
              className="print:hidden inline-flex items-center justify-center gap-1.5 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:border-zinc-300 transition-all cursor-pointer shadow-xs shrink-0"
              title="Copy Payment Reference ID"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-[#036132]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#036132]">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-zinc-400 font-medium">Plan Name</span>
              <p className="text-zinc-900 font-bold mt-0.5">
                {planDetails.planName || 'Comprehensive Care Plan'}
              </p>
            </div>
            <div>
              <span className="text-zinc-400 font-medium">Payment Status</span>
              <p className="text-zinc-900 font-bold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#036132]" />
                Completed &amp; Active
              </p>
            </div>
            <div>
              <span className="text-zinc-400 font-medium">Date &amp; Time</span>
              <p className="text-zinc-900 font-bold mt-0.5">
                {formattedDate || 'Verified Today'}
              </p>
            </div>
            <div>
              <span className="text-zinc-400 font-medium">Payment Gateway</span>
              <p className="text-zinc-900 font-bold mt-0.5">Razorpay 256-bit SSL</p>
            </div>
          </div>
        </div>

        {/* 6. "What Happens Next?" 3-Step Patient Journey */}
        {/* <div className="space-y-4 pt-1">
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#EF8F60]/15 text-[#EF8F60] text-xs font-bold">
              ✓
            </span>
            Next Steps in Your Care Journey
          </h2>

          <div className="space-y-3.5">
         
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/70 border border-zinc-100 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#AEDEE4]/30 text-[#036132] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm font-bold text-zinc-900">Clinical Profile Review</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Our medical director reviews your submitted health objectives to pair you with your specialized doctor.
                </p>
              </div>
            </div>

           
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/70 border border-zinc-100 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#F9E0AE]/40 text-[#EF8F60] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm font-bold text-zinc-900">WhatsApp Welcome &amp; Scheduling</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Your dedicated Care Concierge will reach out on WhatsApp to coordinate your initial 45-minute comprehensive doctor consultation.
                </p>
              </div>
            </div>

           
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/70 border border-zinc-100 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#DDC3DF]/40 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm font-bold text-zinc-900">Personalized Roadmap &amp; Direct Chat</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Receive your tailored diagnostic panel, lifestyle prescription, and continuous ongoing clinical messaging.
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* 7. WhatsApp & Concierge Contact Card */}
        {/* <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#AEDEE4]/20 via-[#F9E0AE]/20 to-[#EF8F60]/15 border border-[#AEDEE4]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xs sm:text-sm font-bold text-zinc-900">Need immediate assistance?</h4>
            <p className="text-xs text-zinc-600">
              Our Patient Concierge is on standby to help you get started right away.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="print:hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#036132] hover:bg-[#024a26] text-white text-xs sm:text-sm font-bold transition-all shadow-md shrink-0 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
            </svg>
            <span>Chat on WhatsApp</span>
          </a>
        </div> */}

        {/* 8. Action Buttons */}
        <div className="print:hidden flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* <SpecularButton
            type="button"
            size="md"
            tint="#AEDEE44D"
            tintOpacity={0.6}
            textColor="#000000"
            lineColor="#ffffff"
            baseColor="#AEDEE44D"
            radius={24}
            onClick={handlePrint}
            className="w-full sm:w-auto font-bold text-xs uppercase tracking-tight px-7 py-3 shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Receipt</span>
          </SpecularButton> */}

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 rounded-full text-xs font-bold tracking-wider uppercase text-zinc-900 bg-white hover:bg-zinc-100 border border-zinc-200 transition-all shadow-xs"
          >
            Return to Home
          </Link>
        </div>

        {/* 9. Footer Security Badges */}
        <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-600">
          <span className="flex items-center gap-1.5 font-medium">
            <svg className="w-3.5 h-3.5 text-[#036132]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
            256-Bit SSL Encrypted
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <svg className="w-3.5 h-3.5 text-[#036132]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            HIPAA-Compliant Care
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <svg className="w-3.5 h-3.5 text-[#036132]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            ISO 27001 Certified Infrastructure
          </span>
        </div>
      </motion.div>
    </div>
  );
}
