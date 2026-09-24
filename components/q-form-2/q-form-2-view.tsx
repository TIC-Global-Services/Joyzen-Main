'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Form from '@/components/q-form-2/form';
import Consultant from '@/components/q-form-2/conseltent';

export default function QForm2View() {
  return (
    <main className="relative w-full min-h-screen select-none overflow-hidden">
      {/* Soft Pastel Gradient Overlay covering full viewport */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#f8e780]/30 via-[#ddc4df]/30 to-[#b4def7]/40 pointer-events-none z-0" />

      {/* Glowing Ambient Mesh Blobs distributed across viewport */}
      <div className="fixed -top-36 -left-36 w-[800px] h-[800px] bg-[#f8e780]/60 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="fixed top-1/4 left-1/4 w-[700px] h-[700px] bg-[#ddc4df]/50 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-24 w-[800px] h-[800px] bg-[#b4def7]/60 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-2/3 left-10 w-[750px] h-[750px] bg-[#f7f4ed]/80 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="fixed -bottom-36 right-0 w-[800px] h-[800px] bg-[#b4def7]/50 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Page Content */}
      <div className="relative z-10 space-y-12">
        <Form />
        <Consultant />
      </div>
    </main>
  );
}
