import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import PaymentSuccessContent from './PaymentSuccessContent';

export const metadata: Metadata = {
  title: 'Payment Successful | Joyzen Care',
  description:
    'Your Joyzen healthcare membership payment was successful. Your dedicated clinical team and doctor have been assigned.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-[#036132] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-zinc-500">Loading payment details...</p>
            </div>
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </main>
  );
}

