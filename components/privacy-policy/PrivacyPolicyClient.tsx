'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PrivacyPolicyClient() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto font-sans selection:bg-[#EF8F60]/20 selection:text-[#EF8F60]">
      {/* Ambient background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#95C1E2]/20 via-[#EF8F60]/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />

      {/* Header */}
      <div className="border-b border-zinc-200 pb-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-4"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          DPDP Act 2023 Compliant
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 font-epilogue tracking-tight"
        >
          Privacy Policy
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 text-zinc-500 text-sm sm:text-base"
        >
          Effective Date: January 1, 2026 • Joyzen Integrated Health Systems PVT LTD
        </motion.p>
      </div>

      <div className="prose prose-zinc max-w-none space-y-10 text-zinc-700 leading-relaxed text-sm sm:text-base">
        {/* Section 1: Overview */}
        <section className="bg-white/60 p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-epilogue mb-3">
            1. Introduction &amp; Commitment to Privacy
          </h2>
          <p>
            Joyzen Integrated Health Systems PVT LTD (&ldquo;Joyzen&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy and the confidentiality of your personal and sensitive health data. This Privacy Policy governs our collection, use, processing, and disclosure of personal data when you interact with the Joyzen website, mobile application, tele-consultation services, Luna AI health companion, and partner clinics.
          </p>
          <p className="mt-3">
            We adhere strictly to India&apos;s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>, the <strong>Information Technology Act, 2000</strong>, the <strong>Telemedicine Practice Guidelines</strong>, and applicable National Digital Health Mission (ABDM) standards.
          </p>
        </section>

        {/* Section 2: Data We Collect */}
        <section className="bg-white/60 p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-epilogue mb-3">
            2. Personal &amp; Health Data We Process
          </h2>
          <ul className="list-disc list-inside space-y-2.5 text-zinc-600 mt-3">
            <li>
              <strong>Identity &amp; Demographics:</strong> Name, age, gender, date of birth, contact details (email, phone, address).
            </li>
            <li>
              <strong>Health &amp; Clinical Data:</strong> Medical history, doctor notes, vital statistics, diagnostic reports, allergies, current medications, lifestyle records.
            </li>
            <li>
              <strong>Technical &amp; Usage Data:</strong> IP address, device telemetry, browser information, log files, session duration.
            </li>
            <li>
              <strong>Payment &amp; Billing Data:</strong> Transaction references and billing addresses processed via secure, RBI-authorized payment gateways.
            </li>
          </ul>
        </section>

        {/* Section 3: Data Principal Rights under DPDPA */}
        <section className="bg-white/60 p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-epilogue mb-3">
            3. Your Rights as a Data Principal
          </h2>
          <p>Under the DPDP Act 2023, you are endowed with statutory rights regarding your personal data:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-xs">
              <h4 className="font-semibold text-zinc-900 mb-1">Right to Access</h4>
              <p className="text-xs text-zinc-600 leading-normal">
                Request a summary of your personal data processed and third parties with whom it has been shared.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-xs">
              <h4 className="font-semibold text-zinc-900 mb-1">Right to Correction &amp; Erasure</h4>
              <p className="text-xs text-zinc-600 leading-normal">
                Request rectification of inaccurate data or deletion of data no longer required for statutory health reasons.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-xs">
              <h4 className="font-semibold text-zinc-900 mb-1">Right of Grievance Redressal</h4>
              <p className="text-xs text-zinc-600 leading-normal">
                Directly contact our Grievance Officer regarding any privacy complaint or processing dispute.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-xs">
              <h4 className="font-semibold text-zinc-900 mb-1">Right to Nominate</h4>
              <p className="text-xs text-zinc-600 leading-normal">
                Nominate an individual to exercise your data rights in the event of death or incapacity.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: GRIEVANCE REDRESSAL EMBEDDED DIRECTLY IN PRIVACY POLICY */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-orange-50/70 via-white to-blue-50/50 border-2 border-[#EF8F60]/40 shadow-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EF8F60]/15 text-[#D86D39] text-xs font-bold tracking-wide uppercase mb-3">
            Mandatory Statutory Disclosure
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-epilogue mb-3">
            4. Grievance Officer &amp; Privacy Contact
          </h2>
          <p className="text-zinc-700 leading-relaxed">
            In accordance with the <strong>Digital Personal Data Protection Act, 2023</strong> and the <strong>Information Technology Rules, 2021</strong>, the contact details of the official Grievance Officer &amp; Privacy Contact for Joyzen Integrated Health Systems PVT LTD are published below:
          </p>

          <div className="bg-white/95 rounded-2xl p-6 border border-zinc-200/90 shadow-sm mt-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-400 uppercase font-semibold">Name &amp; Designation</p>
                <p className="text-base font-bold text-zinc-900">Kushal Bhardwaj</p>
                <p className="text-xs text-zinc-600 font-medium">Director</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 uppercase font-semibold">Company</p>
                <p className="text-sm font-semibold text-zinc-800">Joyzen Integrated Health Systems PVT LTD</p>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100">
              <p className="text-xs text-zinc-400 uppercase font-semibold">Registered Address</p>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <p className="text-sm text-zinc-800 font-medium">
                  58A, Phase 1. Golden avenue, Baran hara, Hambra road, Ludhiana, Punjab, 141001
                </p>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      '58A, Phase 1. Golden avenue, Baran hara, Hambra road, Ludhiana, Punjab, 141001',
                      'address'
                    )
                  }
                  className="shrink-0 px-2.5 py-1 text-xs rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                >
                  {copiedField === 'address' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-100">
              <div>
                <p className="text-xs text-zinc-400 uppercase font-semibold">Official Email</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <a href="mailto:Kushal@joyzen.in" className="text-sm font-bold text-[#EF8F60] hover:underline">
                    Kushal@joyzen.in
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('Kushal@joyzen.in', 'email')}
                    className="px-2 py-0.5 text-xs rounded-md bg-[#EF8F60]/10 text-[#D86D39] hover:bg-[#EF8F60]/20 transition-colors"
                  >
                    {copiedField === 'email' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-400 uppercase font-semibold">Telephone &amp; Business Hours</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <a href="tel:8360978099" className="text-sm font-bold text-zinc-900 hover:text-[#EF8F60]">
                    8360978099
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('8360978099', 'phone')}
                    className="px-2 py-0.5 text-xs rounded-md bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors"
                  >
                    {copiedField === 'phone' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <span className="text-xs text-zinc-500 block">Mon–Sat, 10:00–18:00 IST</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-white/80 border border-zinc-200 text-sm text-zinc-700 leading-relaxed">
            <strong>Redressal SLAs &amp; Escalation:</strong> You may contact us with complaints about the platform or requests about your personal data (access, correction, erasure, withdrawal of consent). We acknowledge complaints within <strong>24 hours</strong> and aim to resolve them within <strong>15 days</strong>. If you are not satisfied, you may approach the <strong>Data Protection Board of India</strong>.
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-2">
            <Link
              href="/grievance-redressal"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#EF8F60] hover:text-[#D86D39] transition-colors"
            >
              Go to Dedicated Grievance Redressal Page →
            </Link>
            <Link
              href="/terms"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              View Terms &amp; Conditions →
            </Link>
          </div>
        </section>

        {/* Section 5: Security */}
        <section className="bg-white/60 p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-epilogue mb-3">
            5. Data Security &amp; Retention
          </h2>
          <p>
            We deploy 256-bit AES encryption in transit and at rest, multi-factor authentication, and strict role-based access protocols. Medical records are preserved in strict accordance with statutory Indian healthcare retention policies.
          </p>
        </section>
      </div>

      {/* Related Legal Links */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/terms"
          className="p-5 rounded-2xl border border-zinc-200 bg-white/80 hover:bg-white transition-all text-sm font-semibold text-zinc-800 hover:text-[#EF8F60] flex items-center justify-between shadow-xs group"
        >
          <span>Read Terms &amp; Conditions (Clinics &amp; Users)</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
        <Link
          href="/grievance-redressal"
          className="p-5 rounded-2xl border border-zinc-200 bg-white/80 hover:bg-white transition-all text-sm font-semibold text-zinc-800 hover:text-[#EF8F60] flex items-center justify-between shadow-xs group"
        >
          <span>Grievance Redressal</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
