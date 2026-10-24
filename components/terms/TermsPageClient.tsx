'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TermsPageClient() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto font-sans selection:bg-[#EF8F60]/20 selection:text-[#EF8F60]">
      {/* Background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-emerald-100/30 via-[#95C1E2]/20 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />

      {/* Header */}
      <div className="border-b border-zinc-200 pb-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wide uppercase mb-4"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Clinics, Staff &amp; User Agreement
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 font-epilogue tracking-tight"
        >
          Terms &amp; Conditions
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 text-zinc-500 text-sm sm:text-base"
        >
          Applicable to Patients, Onboarded Clinics, Medical Practitioners &amp; Healthcare Staff • Joyzen Integrated Health Systems PVT LTD
        </motion.p>
      </div>

      <div className="prose prose-zinc max-w-none space-y-10 text-zinc-700 leading-relaxed text-sm sm:text-base">
        {/* Section 1 */}
        <section className="bg-white/60 p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-epilogue mb-3">
            1. Agreement &amp; Platform Scope
          </h2>
          <p>
            These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern the access and use of the healthcare platform, digital clinical records, tele-consultation channels, and pharmacy fulfillment tools managed by Joyzen Integrated Health Systems PVT LTD (&ldquo;Joyzen&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By accessing the platform as a patient, clinic partner, or clinical staff member, you agree to be bound by these Terms.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white/60 p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-epilogue mb-3">
            2. Terms Governing Clinics, Medical Practitioners &amp; Clinical Staff
          </h2>
          <p>
            For partner clinics, diagnostic labs, hospitals, registered medical practitioners (RMPs), and allied health staff:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mt-3">
            <li>
              <strong>Credentialing &amp; Licenses:</strong> Practitioners warrant that all medical registrations, state medical council memberships, and clinical establishment licenses remain valid and in good standing.
            </li>
            <li>
              <strong>Patient Data Confidentiality:</strong> Clinics and staff are bound by statutory confidentiality under the DPDP Act 2023, National Medical Commission (NMC) regulations, and HIPAA/ISO standards.
            </li>
            <li>
              <strong>Consultation Payouts &amp; Settlements:</strong> Commercial fee schedules, clinic revenue sharing, and disbursements are executed within agreed contractual settlement cycles.
            </li>
            <li>
              <strong>Standard of Care:</strong> Telehealth consultations must comply with the Telemedicine Practice Guidelines issued by the Ministry of Health and Family Welfare (MoHFW).
            </li>
          </ul>
        </section>

        {/* SECTION EMBEDDING GRIEVANCE REDRESSAL INSIDE T&Cs FOR CLINICS AND STAFF */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-[#F6FBFD] to-emerald-50/40 border-2 border-emerald-300 shadow-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3">
            Clause 14: Clinic &amp; Staff Dispute Resolution
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-epilogue mb-3">
            Grievance Redressal Mechanism &amp; Officer Contact
          </h2>
          <p className="text-zinc-700 leading-relaxed">
            In compliance with applicable laws, any grievance, dispute, contractual escalation, or personal data inquiry arising from clinics, staff, doctors, or platform users must be directed to the designated Grievance Officer:
          </p>

          <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-sm mt-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-400 uppercase font-semibold">Grievance Officer &amp; Privacy Contact</p>
                <p className="text-base font-bold text-zinc-900">Kushal Bhardwaj</p>
                <p className="text-xs text-zinc-600 font-medium">Designation: Director</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 uppercase font-semibold">Entity</p>
                <p className="text-sm font-semibold text-zinc-800">Joyzen Integrated Health Systems PVT LTD</p>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100">
              <p className="text-xs text-zinc-400 uppercase font-semibold">Address</p>
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
                  <a href="mailto:Kushal@joyzen.in" className="text-sm font-bold text-emerald-700 hover:underline">
                    Kushal@joyzen.in
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('Kushal@joyzen.in', 'email')}
                    className="px-2 py-0.5 text-xs rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    {copiedField === 'email' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-400 uppercase font-semibold">Phone &amp; Working Hours</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <a href="tel:8360978099" className="text-sm font-bold text-zinc-900 hover:text-emerald-700">
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
                <span className="text-xs text-zinc-500 block">(Mon–Sat, 10:00–18:00 IST)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-white/90 border border-zinc-200 text-sm text-zinc-700 leading-relaxed">
            You may contact us with complaints about the platform or requests about your personal data (access, correction, erasure, withdrawal of consent). We acknowledge complaints within <strong>24 hours</strong> and aim to resolve them within <strong>15 days</strong>. If you are not satisfied, you may approach the <strong>Data Protection Board of India</strong>.
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-2">
            <Link
              href="/grievance-redressal"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              Access Full Grievance Redressal Portal →
            </Link>
            <Link
              href="/privacy-policy"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              Review Privacy Policy →
            </Link>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white/60 p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-epilogue mb-3">
            3. Governing Law &amp; Jurisdiction
          </h2>
          <p>
            These Terms are governed by the laws of India. Subject to the dispute resolution mechanism and statutory jurisdiction of the Data Protection Board of India, courts in Ludhiana/Punjab shall have exclusive jurisdiction over legal actions.
          </p>
        </section>
      </div>

      {/* Related Legal Links */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/privacy-policy"
          className="p-5 rounded-2xl border border-zinc-200 bg-white/80 hover:bg-white transition-all text-sm font-semibold text-zinc-800 hover:text-emerald-700 flex items-center justify-between shadow-xs group"
        >
          <span>Read Joyzen Privacy Policy</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
        <Link
          href="/grievance-redressal"
          className="p-5 rounded-2xl border border-zinc-200 bg-white/80 hover:bg-white transition-all text-sm font-semibold text-zinc-800 hover:text-emerald-700 flex items-center justify-between shadow-xs group"
        >
          <span>Grievance Redressal &amp; Privacy Contact</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
