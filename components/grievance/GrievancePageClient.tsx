'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function GrievancePageClient() {
  const [activeTab, setActiveTab] = useState<'all' | 'privacy' | 'clinic'>('all');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Personal Data / DPDP Request',
    userRole: 'Patient / User',
    subject: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields.');
      return;
    }
    const generatedTicket = `JZN-GRV-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedTicket);
    setFormSubmitted(true);
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Background ambient decorative glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#95C1E2]/25 via-[#EF8F60]/20 to-[#F8E780]/20 blur-3xl -z-10 pointer-events-none rounded-full" />

      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EF8F60]/10 border border-[#EF8F60]/30 text-[#D86D39] text-xs font-semibold tracking-wide uppercase mb-4"
        >
          <span className="w-2 h-2 rounded-full bg-[#EF8F60] animate-pulse" />
          Statutory Compliance & Data Protection
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight font-epilogue"
        >
          Grievance Redressal &amp; Privacy Contact
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed font-sans"
        >
          Pursuant to India&apos;s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and Rule 3(2) of the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, Joyzen provides a dedicated officer and statutory redressal mechanism for patients, platform users, partner clinics, and healthcare staff.
        </motion.p>
      </div>

      {/* Primary Grievance Officer Card (Official Details) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="relative bg-gradient-to-br from-white/95 via-white/80 to-[#F4F9FD]/90 backdrop-blur-xl border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-xl mb-14 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#EF8F60]/15 via-[#95C1E2]/20 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-zinc-200/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Authorized Officer
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                DPDP Act Data Protection Contact
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-epilogue">
              Kushal Bhardwaj
            </h2>
            <p className="text-zinc-600 font-medium text-base mt-1">
              Designation: <span className="text-zinc-900 font-semibold">Director</span>
            </p>
            <p className="text-zinc-500 text-sm mt-0.5">
              Joyzen Integrated Health Systems PVT LTD
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:Kushal@joyzen.in"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EF8F60] text-white font-medium text-sm shadow-md hover:bg-[#e07d4c] transition-all hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Officer Directly
            </a>
            <a
              href="tel:8360978099"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white font-medium text-sm shadow-md hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call 8360978099
            </a>
          </div>
        </div>

        {/* Contact Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {/* Email Box */}
          <div className="bg-white/90 rounded-2xl p-5 border border-zinc-200/70 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Official Email</p>
                <a
                  href="mailto:Kushal@joyzen.in"
                  className="text-base sm:text-lg font-bold text-zinc-900 hover:text-[#EF8F60] transition-colors mt-1 block break-all"
                >
                  Kushal@joyzen.in
                </a>
                <p className="text-xs text-zinc-500 mt-1">Direct redressal mailbox</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard('Kushal@joyzen.in', 'email')}
                className="p-2 text-zinc-400 hover:text-zinc-700 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors"
                title="Copy email"
              >
                {copiedField === 'email' ? (
                  <span className="text-xs font-semibold text-emerald-600">Copied!</span>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Phone Box */}
          <div className="bg-white/90 rounded-2xl p-5 border border-zinc-200/70 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Direct Telephone</p>
                <a
                  href="tel:8360978099"
                  className="text-base sm:text-lg font-bold text-zinc-900 hover:text-[#EF8F60] transition-colors mt-1 block"
                >
                  8360978099
                </a>
                <p className="text-xs text-zinc-500 mt-1">Mon–Sat, 10:00–18:00 IST</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard('8360978099', 'phone')}
                className="p-2 text-zinc-400 hover:text-zinc-700 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors"
                title="Copy phone"
              >
                {copiedField === 'phone' ? (
                  <span className="text-xs font-semibold text-emerald-600">Copied!</span>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Postal Address Box */}
          <div className="bg-white/90 rounded-2xl p-5 border border-zinc-200/70 shadow-sm md:col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Physical Registered Address</p>
                <p className="text-sm font-semibold text-zinc-800 mt-1 leading-snug">
                  58A, Phase 1. Golden avenue, Baran hara, Hambra road, Ludhiana, Punjab, 141001
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard('58A, Phase 1. Golden avenue, Baran hara, Hambra road, Ludhiana, Punjab, 141001', 'address')}
                className="p-2 text-zinc-400 hover:text-zinc-700 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors flex-shrink-0"
                title="Copy address"
              >
                {copiedField === 'address' ? (
                  <span className="text-xs font-semibold text-emerald-600">Copied!</span>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Commitment Highlight Strip */}
        <div className="mt-8 pt-6 border-t border-zinc-200/80 bg-white/60 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-6 sm:p-8 rounded-b-3xl">
          <p className="text-zinc-800 text-sm sm:text-base leading-relaxed">
            <strong>Commitment &amp; Scope:</strong> You may contact us with complaints about the platform or requests about your personal data (access, correction, erasure, withdrawal of consent). We acknowledge complaints within <strong>24 hours</strong> and aim to resolve them within <strong>15 days</strong>. If you are not satisfied, you may approach the <strong>Data Protection Board of India</strong>.
          </p>
        </div>
      </motion.div>

      {/* Resolution Timeline & SLA Guarantee */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm relative overflow-hidden group hover:border-[#EF8F60]/40 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EF8F60] font-bold text-lg mb-4">
            24h
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Prompt Acknowledgment</h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Every complaint, data subject request, or clinic issue is registered and formally acknowledged within 24 hours with a distinct tracking reference.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm relative overflow-hidden group hover:border-[#95C1E2]/60 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2A75B3] font-bold text-lg mb-4">
            15d
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Speedy Resolution</h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Our grievance team, alongside medical and technical directors, investigates thoroughly and strives to conclude resolutions within a maximum of 15 days.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold text-lg mb-4">
            DPBI
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Statutory Escalation</h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            If our resolution does not satisfy your request or if timelines are breached, you have the statutory right under law to petition the Data Protection Board of India.
          </p>
        </motion.div>
      </div> */}

      {/* Scope Details: Filterable Tabs for (1) Platform Users, (2) Privacy Policy / DPDPA, (3) Clinic & Staff T&Cs */}
      {/* <div className="mb-14">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 font-epilogue">
              Redressal Scopes &amp; Applicability
            </h2>
            <p className="text-zinc-600 text-sm mt-1">
              Find detailed guidance specific to your interaction with Joyzen.
            </p>
          </div>

          <div className="inline-flex p-1 bg-zinc-100 rounded-xl border border-zinc-200">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              All Scopes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'privacy'
                  ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Privacy Policy (DPDPA)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('clinic')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'clinic'
                  ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Clinics &amp; Staff T&amp;Cs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
          {(activeTab === 'all' || activeTab === 'all') && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#EF8F60] flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">1. Platform &amp; Patient Care</h3>
                <p className="text-xs text-zinc-500 mb-4">Linked from website footer across Joyzen web &amp; mobile apps</p>
                <ul className="text-sm text-zinc-600 space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-[#EF8F60] font-bold">•</span>
                    Teleconsultation scheduling, audio/video disruptions, or doctor connectivity.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#EF8F60] font-bold">•</span>
                    Digital prescription accuracy, pharmacy dispatch, and delivery timeline concerns.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#EF8F60] font-bold">•</span>
                    Billing, subscription renewal, refund requests, and health record synchronization.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#EF8F60] font-bold">•</span>
                    Service misconduct or customer support quality escalation.
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 text-xs text-zinc-500">
                Official Response Window: Within 24 hours
              </div>
            </motion.div>
          )}

          {(activeTab === 'all' || activeTab === 'privacy') && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#2A75B3] flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">2. Inside Joyzen Privacy Policy</h3>
                <p className="text-xs text-zinc-500 mb-4">Digital Personal Data Protection Act (DPDPA), 2023</p>
                <ul className="text-sm text-zinc-600 space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <strong>Right to Access:</strong> Request a comprehensive summary of personal and sensitive health data.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <strong>Right to Correction &amp; Updating:</strong> Rectify incomplete, outdated, or erroneous medical logs.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <strong>Right to Erasure:</strong> Delete personal data upon cessation of care (subject to statutory health record retention).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <strong>Withdrawal of Consent:</strong> Seamlessly revoke processing permissions at any time.
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100">
                <Link
                  href="/privacy-policy"
                  className="text-xs font-semibold text-[#2A75B3] hover:underline flex items-center gap-1"
                >
                  View Full Privacy Policy →
                </Link>
              </div>
            </motion.div>
          )}

         
          {(activeTab === 'all' || activeTab === 'clinic') && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">3. Inside Clinic &amp; Staff T&amp;Cs</h3>
                <p className="text-xs text-zinc-500 mb-4">Shown to Onboarded Clinics, Doctors &amp; Healthcare Staff</p>
                <ul className="text-sm text-zinc-600 space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    Clinic partnership contracts, service level agreement disputes, and consultation revenue payouts.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    Provider onboarding, credentialing reviews, and tele-health compliance matters.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    Staff confidentiality, data access controls, and electronic health record (EHR) handling disputes.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    Platform interoperability, API integration snags, or institutional billing grievances.
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100">
                <Link
                  href="/terms"
                  className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  View Clinic &amp; Staff Terms →
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div> */}

      {/* Interactive Direct Redressal Submission Form */}
      {/* <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/90 shadow-lg mb-14">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EF8F60]">Direct Online Submission</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-epilogue mt-1">
            Submit a Grievance or Personal Data Request
          </h2>
          <p className="text-zinc-600 text-sm mt-2">
            Use this secure form to transmit your concern directly to Kushal Bhardwaj, Director &amp; Grievance Officer. You will receive an email confirmation within 24 hours.
          </p>
        </div>

        {formSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center max-w-xl mx-auto my-6"
          >
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 font-epilogue">Grievance Registered Successfully</h3>
            <p className="text-sm text-zinc-600 mt-2">
              Your grievance has been lodged with the Grievance Office under tracking ID:
            </p>
            <div className="mt-3 inline-block px-4 py-2 bg-white rounded-lg border border-emerald-300 font-mono font-bold text-emerald-800 text-lg shadow-sm">
              {ticketId}
            </div>
            <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
              An acknowledgment has been dispatched to <strong>{formData.email}</strong>. As per Joyzen Redressal Policy, our office will review and resolve this within <strong>15 days</strong>.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <a
                href={`mailto:Kushal@joyzen.in?subject=Grievance%20Ticket%20${ticketId}&body=Dear%20Grievance%20Officer,%0A%0AReferencing%20Ticket:%20${ticketId}%0AApplicant:%20${encodeURIComponent(formData.name)}%0AEmail:%20${encodeURIComponent(formData.email)}%0APhone:%20${encodeURIComponent(formData.phone)}%0A%0ADescription:%0A${encodeURIComponent(formData.message)}`}
                className="px-5 py-2.5 rounded-full bg-[#EF8F60] text-white font-medium text-xs hover:bg-[#e07d4c] transition-all"
              >
                Open in Email Client
              </a>
              <button
                type="button"
                onClick={() => {
                  setFormSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    category: 'Personal Data / DPDP Request',
                    userRole: 'Patient / User',
                    subject: '',
                    message: '',
                  });
                }}
                className="px-5 py-2.5 rounded-full bg-zinc-100 text-zinc-700 font-medium text-xs hover:bg-zinc-200 transition-all"
              >
                Submit Another Request
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                  I am filing as a *
                </label>
                <select
                  value={formData.userRole}
                  onChange={(e) => setFormData({ ...formData, userRole: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-[#EF8F60] focus:ring-2 focus:ring-[#EF8F60]/20 bg-white text-zinc-900 text-sm outline-none transition-all"
                >
                  <option value="Patient / User">Patient / Platform User</option>
                  <option value="Clinic Partner">Partner Clinic / Medical Practice</option>
                  <option value="Healthcare Provider / Staff">Doctor / Clinical Staff</option>
                  <option value="Pharmacy / Vendor">Pharmacy / Diagnostic Partner</option>
                  <option value="Other">Other Stakeholder</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                  Category of Grievance *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-[#EF8F60] focus:ring-2 focus:ring-[#EF8F60]/20 bg-white text-zinc-900 text-sm outline-none transition-all"
                >
                  <option value="Personal Data / DPDP Request">DPDP Act (Access, Erasure, Correction, Consent)</option>
                  <option value="Platform / Consultation Issue">Doctor Consultation / Telehealth Service Issue</option>
                  <option value="E-Pharmacy / Medication">E-Pharmacy / Medication Delivery / Prescription</option>
                  <option value="Billing / Refund">Billing, Fees, or Refund Dispute</option>
                  <option value="Clinic Contract / Staff T&Cs">Clinic Terms, Payouts, or Staff Grievance</option>
                  <option value="Technical / Security Concern">Platform Downtime / Security Concern</option>
                  <option value="General Complaint">Other General Complaint</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-[#EF8F60] focus:ring-2 focus:ring-[#EF8F60]/20 text-zinc-900 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-[#EF8F60] focus:ring-2 focus:ring-[#EF8F60]/20 text-zinc-900 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-[#EF8F60] focus:ring-2 focus:ring-[#EF8F60]/20 text-zinc-900 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                Subject / Summary of Complaint *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of your grievance or data request"
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-[#EF8F60] focus:ring-2 focus:ring-[#EF8F60]/20 text-zinc-900 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                Detailed Description &amp; Incident Information *
              </label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Please describe your grievance in full detail. Include appointment dates, order numbers, clinic names, or specific data rights you are exercising."
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-[#EF8F60] focus:ring-2 focus:ring-[#EF8F60]/20 text-zinc-900 text-sm outline-none transition-all resize-y"
              />
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-500 leading-relaxed">
              By submitting this form, you confirm that the information provided is accurate and authorize Joyzen&apos;s Grievance Officer and authorized legal/clinical representatives to process this information to investigate and redress your grievance under Indian law.
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900 text-white font-medium text-sm hover:bg-[#EF8F60] transition-colors shadow-md cursor-pointer"
              >
                Submit Grievance to Officer
              </button>
              <span className="text-xs text-zinc-500">
                Direct Officer Mailbox: <a href="mailto:Kushal@joyzen.in" className="text-zinc-800 underline font-semibold">Kushal@joyzen.in</a>
              </span>
            </div>
          </form>
        )}
      </div> */}

      {/* Escalation Hierarchy & Data Protection Board of India Notice */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl mb-14">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-amber-400">
              Statutory Rights &amp; Regulatory Escalation
            </span>
            <h3 className="text-2xl font-bold font-epilogue mt-1 mb-3">
              Right to Approach the Data Protection Board of India
            </h3>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-4xl">
              Under Section 13 of the <strong>Digital Personal Data Protection Act, 2023</strong>, if you have exhausted Joyzen&apos;s grievance redressal process and either:
            </p>
            <ul className="text-sm text-zinc-300 mt-3 space-y-2 list-disc list-inside">
              <li>Our Grievance Officer fails to provide a formal resolution within the statutory 15-day timeframe; or</li>
              <li>You are dissatisfied with the resolution or remedial action proposed;</li>
            </ul>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-4xl mt-3">
              You are entitled by law to lodge a direct complaint with the <strong>Data Protection Board of India (DPBI)</strong> for adjudication and relief. Joyzen maintains a tamper-evident audit record of all grievances to facilitate transparent regulatory compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Helpful Legal Navigation Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
        <Link
          href="/privacy-policy"
          className="p-5 rounded-2xl border border-zinc-200 bg-white/70 hover:bg-white transition-all text-sm font-semibold text-zinc-800 hover:text-[#EF8F60] flex items-center justify-center gap-2 group shadow-sm"
        >
          <span>Read Joyzen Privacy Policy</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
        <Link
          href="/terms"
          className="p-5 rounded-2xl border border-zinc-200 bg-white/70 hover:bg-white transition-all text-sm font-semibold text-zinc-800 hover:text-[#EF8F60] flex items-center justify-center gap-2 group shadow-sm"
        >
          <span>Read Terms &amp; Conditions (Clinics &amp; Users)</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
