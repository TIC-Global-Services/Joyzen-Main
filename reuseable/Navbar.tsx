'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'About', href: '#', active: true },
  { label: 'Our Vision', href: '#' },
  { label: 'Plans & Pricing', href: '#' },
  { label: 'Community', href: '#' },
  { label: 'International Care', href: '#' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-8 z-50 w-full lg:px-[3%] transition-all">
      <div className="flex items-center justify-between px-[3%] md:px-0">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
          <Image
            src="/joyzen_logo.png"
            alt="Joyzen"
            width={130}
            height={30}
            priority
            className="h-7 sm:h-8 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav Center Pill */}
        <nav className="hidden md:flex items-center gap-2   px-2.5 py-1.5 ">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-xs lg:text-sm px-4 py-1.5 rounded-full font-medium transition-all ${link.active
                  ? 'bg-[#95C1E233] text-zinc-900 backdrop-blur-[1px] border border-white/40 font-semibold'
                  : 'text-zinc-700 hover:text-zinc-900 hover:bg-white/60'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA Button: Talk to us (with icon) */}
        <div className="hidden sm:flex items-center">
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-medium text-zinc-800 bg-white/80 hover:bg-white border border-zinc-200/80 rounded-full shadow-xs hover:shadow-sm transition-all hover:border-zinc-300"
          >
            <span>Talk to us</span>
            <svg
              className="w-4 h-4 text-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <circle cx="12" cy="8" r="4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 20v-1a6 6 0 0112 0v1" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11a4 4 0 014 4v1" />
            </svg>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center p-2 rounded-xl text-zinc-700 bg-white/80 backdrop-blur-md border border-zinc-200"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 bg-white/95 backdrop-blur-xl border border-zinc-200 rounded-2xl shadow-xl space-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 text-sm rounded-lg font-medium ${link.active ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-700 hover:bg-zinc-50'
                }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center mt-2 px-4 py-2 text-sm font-medium text-zinc-900 bg-zinc-100 rounded-full border border-zinc-300"
          >
            Talk to us
          </Link>
        </div>
      )}
    </header>
  );
}