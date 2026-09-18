import React from 'react';
import Form from '@/components/q-form-2/form';
import Consultant from '@/components/q-form-2/conseltent';

export default function QForm2Page() {
  return (
    <main className="relative w-full min-h-screen select-none overflow-hidden bg-[#FAF7F5]">
      {/* 1. Base Hexagon Grid Mesh Overlay across the entire page */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='97' viewBox='0 0 56 97' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 0l28 16v32L28 64 0 48V16zm0 97l28-16V49L28 33 0 49v32z' fill='%2000000' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 97px',
        }}
      />

      {/* 2. Soft Pastel Gradient Overlay covering the full page height */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFC5CD]/55 via-[#E6D3F5]/45 to-[#B4ECF5]/60 pointer-events-none z-0" />

      {/* 3. Glowing Ambient Blobs distributed continuously top to bottom */}
      <div className="absolute -top-36 -left-36 w-[750px] h-[750px] bg-[#FFAAA6]/60 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FFDFD3]/50 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/3 -right-24 w-[750px] h-[750px] bg-[#B2EBF2]/75 rounded-full blur-[110px] pointer-events-none z-0" />
      <div className="absolute top-2/3 left-10 w-[700px] h-[700px] bg-[#FFC5CD]/45 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute -bottom-36 right-0 w-[750px] h-[750px] bg-[#80DEEA]/50 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Page Content */}
      <div className="relative z-10 space-y-12">
        <Form />
        <Consultant />
      </div>
              <div className='h-20 w-full bg-[#fcf9f2] absolute -bottom-[2%] left-0 z-100 blur-md'></div>
    </main>
  );
}