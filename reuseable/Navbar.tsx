'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Our Vision', href: '/our-vision' },
  { label: 'Plans & Pricing', href: '/plan-and-pricing' },
  { label: 'Community', href: '/community' },
  { label: 'International Care', href: '/international-care' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/' || pathname === '/contact/'
      const inactiveTextColor = isHome ? 'text-black' : 'text-black [text-shadow:_0_1px_6px_rgba(0,0,0,0.35)]'

  return (
    <header className="absolute top-8 z-50 w-full px-[3%] transition-all">
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
        <nav className="hidden lg:flex items-center gap-2   px-2.5 py-1.5 ">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs lg:text-sm px-4 py-3 rounded-full font-medium transition-all ${isActive
                    ? 'bg-[#95C1E233] text-zinc-900 backdrop-blur-[1px] border border-white/40 font-semibold'
                    : 'text-zinc-700 hover:text-zinc-900 hover:bg-white/60'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button: Talk to us (with icon) */}
        <div className="hidden lg:flex items-center">
          <Link
            href="#contact"

          >
            <button className={`hidden px-3 lg:px-6 md:flex gap-2 text-xs lg:text-base items-center justify-center py-1.5 lg:py-3 rounded-[2.625rem] border border-white/10 backdrop-blur-xs shadow-md font-satoshi font-medium transition-colors ${isHome ? 'bg-white/10 hover:bg-[#F9F9F9]' : 'bg-white/20 hover:bg-white/30'}`}>
              <span className={inactiveTextColor}>Talk to us</span>
              <span><Image src="/nav-icon.svg" alt="Icon" width={20} height={20} className={isHome ? '' : 'brightness-0'} /></span>
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex items-center p-2 rounded-xl text-zinc-700 bg-white/80 backdrop-blur-md border border-zinc-200"
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
        <div className="lg:hidden mt-3 p-4 bg-white/95 backdrop-blur-xl border border-zinc-200 rounded-2xl shadow-xl space-y-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 text-sm rounded-lg font-medium ${isActive ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-700 hover:bg-zinc-50'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
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