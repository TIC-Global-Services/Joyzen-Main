'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Tokenized content with highlight markers
const para1Tokens = [
  { text: 'Joyzen', highlight: true },
  { text: 'brings' },
  { text: 'your' },
  { text: 'care,' },
  { text: 'your' },
  { text: 'health' },
  { text: 'information,' },
  { text: 'your' },
  { text: 'guidance' },
  { text: 'and' },
  { text: 'your' },
  { text: 'support' },
  { text: 'into' },
  { text: 'one', highlight: true },
  { text: 'connected', highlight: true },
  { text: 'experience', highlight: true },
  { text: 'that' },
  { text: 'is' },
  { text: 'easier' },
  { text: 'to' },
  { text: 'reach,' },
  { text: 'simpler', highlight: true },
  { text: 'to', highlight: true },
  { text: 'understand', highlight: true },
  { text: 'and' },
  { text: 'far' },
  { text: 'less', highlight: true },
  { text: 'stressful', highlight: true },
  { text: 'to' },
  { text: 'manage.' },
];

const para2Tokens = [
  { text: 'No' },
  { text: 'more' },
  { text: 'pausing' },
  { text: 'your' },
  { text: 'life' },
  { text: 'to' },
  { text: 'chase' },
  { text: 'your' },
  { text: 'healthcare.' },
  { text: 'Joyzen' },
  { text: 'is' },
  { text: 'built' },
  { text: 'to' },
  { text: 'move' },
  { text: 'with' },
  { text: 'you,' },
  { text: 'keeping' },
  { text: 'you' },
  { text: 'informed,' },
  { text: 'supported' },
  { text: 'and' },
  { text: 'ready' },
  { text: 'for' },
  { text: 'whatever' },
  { text: 'comes' },
  { text: 'next.' },
  { text: 'Less' },
  { text: 'time' },
  { text: 'managing' },
  { text: 'your' },
  { text: 'health.' },
  { text: 'More', highlight: true },
  { text: 'time', highlight: true },
  { text: 'actually', highlight: true },
  { text: 'living', highlight: true },
  { text: 'it.', highlight: true },
];

export default function AboutMobileSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const phoneEl = phoneRef.current;
    if (!sectionEl) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const allWords = gsap.utils.toArray<HTMLElement>(
        sectionEl.querySelectorAll('.word-span')
      );

      if (allWords.length === 0) return;

      const createPinnedAnimation = (pinMultiplier: number) => {
        const getEnd = () => `+=${Math.round(window.innerHeight * pinMultiplier)}`;

        // 1. Mobile rises from bottom to top as section approaches and becomes fully visible before/at pin
        if (phoneEl) {
          gsap.fromTo(
            phoneEl,
            { y: 120, opacity: 0.2, scale: 0.94 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: sectionEl,
                start: 'top 85%',
                end: 'top top',
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        // 2. Section Pins at top top and scrubs the word reveal timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top top',
            end: getEnd,
            pin: true,
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        });

        // Sequential Word-by-word reveal scrubbed with scroll
        allWords.forEach((word) => {
          const targetColor = word.getAttribute('data-target-color') || '#18181b';
          tl.to(
            word,
            {
              color: targetColor,
              duration: 0.05,
              ease: 'none',
            },
            '>-0.015'
          );
        });

        // Settle pause before unpinning
        tl.to({}, { duration: 0.25 });

        return () => {
          tl.kill();
        };
      };

      // Responsive pinning multipliers
      mm.add('(min-width: 1024px)', () => createPinnedAnimation(1.6));
      mm.add('(min-width: 768px) and (max-width: 1023px)', () => createPinnedAnimation(1.4));
      mm.add('(max-width: 767px)', () => createPinnedAnimation(1.2));
    }, sectionEl);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-center px-5 sm:px-10 md:px-16 lg:px-20 py-12 md:py-16 select-none overflow-hidden"
    >
      <div className="w-full flex flex-col items-center">

        {/* Mobile Mockup (Shown Half with Smooth Fade Bottom) */}
        <div
          ref={phoneRef}
          className="relative w-full flex justify-center mb-6 sm:mb-8 md:mb-10"
        >
          <div className="relative w-full">
            {/* Half-Phone crop with bottom mask fade */}
            <div className="relative max-w-[50dvh] mx-auto h-[40dvh] [mask-image:linear-gradient(to_bottom,black_45%,transparent_94%)] [-webkit-mask-image:linear-gradient(to_bottom,black_45%,transparent_94%)]">
              <Image
                src="/joyzen-mobile-mockup.png"
                alt="Joyzen Mobile App Interface"
                fill
                priority
                className="object-cover object-top drop-shadow-[0_16px_36px_rgba(0,0,0,0.08)]"
              />
            </div>
          </div>
        </div>

        {/* Narrative Copy - Staggered Two-Paragraph Layout with Word Reveal */}
        <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 max-w-7xl">
          {/* Paragraph 1: Offset left/center */}
          <div className="w-full md:w-[88%] lg:w-[79%] text-left">
            <p className="text-xl lg:text-[28px] font-medium leading-[1.2] sm:leading-[1.2] tracking-tight">
              {para1Tokens.map((item, i) => (
                <span
                  key={i}
                  data-target-color={item.highlight ? '#E27D60' : '#18181B'}
                  className="inline-block mr-[0.25em] word-span text-[#D4D4D8] select-none"
                >
                  {item.text}
                </span>
              ))}
            </p>
          </div>

          {/* Paragraph 2: Staggered further to the right */}
          <div className="w-full md:w-[88%] lg:w-[79%] ml-auto text-right">
            <p className="text-xl lg:text-[28px] font-medium leading-[1.2] sm:leading-[1.2] tracking-tight">
              {para2Tokens.map((item, i) => (
                <span
                  key={i}
                  data-target-color={item.highlight ? '#E27D60' : '#18181B'}
                  className="inline-block mr-[0.25em] word-span text-[#D4D4D8] select-none"
                >
                  {item.text}
                </span>
              ))}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}




