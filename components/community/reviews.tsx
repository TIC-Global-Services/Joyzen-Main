'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}



export interface ReviewCardItem {
  id: string;
  rating: number;
  quote: string;
  authorName: string;
}

const defaultLeftReviews: ReviewCardItem[] = [
  {
    id: 'rev-1',
    rating: 5,
    quote:
      '"Joyzen transformed the way I approach my healthcare. The continuous support made all the difference."',
    authorName: '-Sarah M.',
  },
  {
    id: 'rev-2',
    rating: 5,
    quote:
      '"Having doctors and wellness mentors in one circle changed everything for my everyday routine."',
    authorName: '-David Ross',
  },
  {
    id: 'rev-3',
    rating: 5,
    quote:
      '"The empathy, quick consultations, and warm community feel is unmatched anywhere else."',
    authorName: '-Elena Rostova',
  },
];

const defaultRightReviews: ReviewCardItem[] = [
  {
    id: 'rev-4',
    rating: 5,
    quote:
      '"From mindful workshops to doctor checkups, everything feels deeply personal and empowering."',
    authorName: '-Michael Chen',
  },
  {
    id: 'rev-5',
    rating: 5,
    quote:
      '"No more guesswork or rushing through appointments. Genuine care and continuous guidance."',
    authorName: '-Sarah Jenkins',
  },
  {
    id: 'rev-6',
    rating: 5,
    quote:
      '"A safe space where healthcare meets human connection. Life is so much better as part of Joyzen."',
    authorName: '-Marcus Vance',
  },
];

const FiveStars = ({ rating = 5 }: { rating?: number }) => (
  <div className="flex items-center text-[#FBBF24]">
    {Array.from({ length: rating }).map((_, i) => (
      <svg
        key={i}
        className="w-4.5 h-4.5 sm:w-6 sm:h-6 fill-current drop-shadow-[0_1px_2px_rgba(251,191,36,0.3)]"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const ReviewCard = ({ card }: { card: ReviewCardItem }) => {
  return (
    <div className="glass-card backdrop-blur-xs w-[280px] xs:w-[300px] sm:w-[340px] md:w-[380px] lg:w-[437px] p-6 sm:p-7 md:p-8 rounded-[24px] sm:rounded-[32px] flex flex-col gap-2.5 sm:gap-2 hover:scale-[1.02] transition-transform duration-300">
      {/* 5 Golden Stars */}
      <FiveStars rating={card.rating} />

      {/* Review Quote Text */}
      <p className="text-lg sm:text-lg lg:text-2xl text-zinc-700 font-normal leading-[1.35] sm:leading-tight tracking-tight mt-1">
        {card.quote}
      </p>

      {/* Author Name in Orange */}
      <span className="text-2xl lg:text-[32px] font-semibold text-[#EF7C48] tracking-tight mt-0.5">
        {card.authorName}
      </span>
    </div>
  );
};

export interface ReviewsProps {
  leftReviews?: ReviewCardItem[];
  rightReviews?: ReviewCardItem[];
}

const Reviews = ({
  leftReviews = defaultLeftReviews,
  rightReviews = defaultRightReviews,
}: ReviewsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevents iOS Safari's dynamic-toolbar resize events from forcing a
    // full ScrollTrigger.refresh() mid-scroll (which would reset every
    // card's gsap.set() offscreen position and read as a stutter/reset).
    ScrollTrigger.config({ ignoreMobileResize: true });

    let ctx: gsap.Context;

    // Use a small delay to ensure DOM and route transitions are fully settled
    // before calculating ScrollTrigger positions. This fixes the iOS blank page glitch
    // when navigating back to the page.
    const initTimer = setTimeout(() => {
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        // Helper function to build a continuous, seamlessly fading flow of cards
        const buildScrollTimeline = (
        leftCards: HTMLElement[],
        rightCards: HTMLElement[],
        scrollDistance: number,
        cardDuration: number,
        staggerStep: number,
        scrubSpeed: number
      ) => {
        const vh = window.innerHeight;
        // Travel distance safely past the viewport bounds (top & bottom)
        const travelDistance = Math.max(vh * 1.15, 800);

        // Initially hide all upcoming cards completely offscreen with 0 opacity
        gsap.set([...leftCards, ...rightCards], {
          y: travelDistance,
          opacity: 0,
          autoAlpha: 0,
          force3D: true,
          willChange: 'transform, opacity',
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: `+=${scrollDistance}`,
            scrub: scrubSpeed,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const totalPairs = Math.max(leftCards.length, rightCards.length);

        for (let i = 0; i < totalPairs; i++) {
          // Left card animation
          if (leftCards[i]) {
            const startTime = i * staggerStep;

            // Travel from bottom to top
            tl.fromTo(
              leftCards[i],
              { y: travelDistance },
              { y: -travelDistance, duration: cardDuration, ease: 'none', force3D: true },
              startTime
            );

            // Fade in as card enters bottom viewport
            tl.fromTo(
              leftCards[i],
              { opacity: 0, autoAlpha: 0 },
              { opacity: 1, autoAlpha: 1, duration: cardDuration * 0.22, ease: 'power1.out' },
              startTime
            );

            // Fade out as card exits top viewport
            tl.to(
              leftCards[i],
              { opacity: 0, autoAlpha: 0, duration: cardDuration * 0.22, ease: 'power1.in' },
              startTime + cardDuration * 0.78
            );
          }

          // Right card animation (interleaved for continuous alternating flow)
          if (rightCards[i]) {
            const rightStartTime = i * staggerStep + staggerStep * 0.5;

            // Travel from bottom to top
            tl.fromTo(
              rightCards[i],
              { y: travelDistance },
              { y: -travelDistance, duration: cardDuration, ease: 'none', force3D: true },
              rightStartTime
            );

            // Fade in
            tl.fromTo(
              rightCards[i],
              { opacity: 0, autoAlpha: 0 },
              { opacity: 1, autoAlpha: 1, duration: cardDuration * 0.22, ease: 'power1.out' },
              rightStartTime
            );

            // Fade out
            tl.to(
              rightCards[i],
              { opacity: 0, autoAlpha: 0, duration: cardDuration * 0.22, ease: 'power1.in' },
              rightStartTime + cardDuration * 0.78
            );
          }
        }
      };

      // ── Mobile / Tablet (≤1024px) ──
      mm.add('(max-width: 1024px)', () => {
        const leftCards = gsap.utils.toArray<HTMLElement>('.review-card-left');
        const rightCards = gsap.utils.toArray<HTMLElement>('.review-card-right');
        // Snappy touch scroll distance, smooth alternating cards without large gaps
        buildScrollTimeline(leftCards, rightCards, 1900, 2.2, 0.7, 0.35);
      });

      // ── Desktop (>1024px) ──
      mm.add('(min-width: 1025px)', () => {
        const leftCards = gsap.utils.toArray<HTMLElement>('.review-card-left');
        const rightCards = gsap.utils.toArray<HTMLElement>('.review-card-right');
        buildScrollTimeline(leftCards, rightCards, 3000, 2.4, 0.8, 1.0);
      });
    }, containerRef);
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (ctx) {
        ctx.revert();
      }
    };
  }, []);

  return (
    <section
      id="reviews-section"
      className="relative w-full bg-transparent select-none overflow-hidden"
    >
      <div
        ref={containerRef}
        className="h-screen w-full flex flex-col items-center justify-center overflow-hidden relative px-0 sm:px-[5%]"
      >
        {/* Background Ambient Spotlights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-gradient-to-tr from-[#EF8F60]/12 via-[#78C9CF]/12 to-transparent rounded-full blur-[140px] pointer-events-none" />

        {/* PINNED CENTER EMBLEM & TITLE LAYER (Fixed in Center during scroll) */}
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center select-none">
          <div className="flex flex-col items-center justify-center">
            {/* Orange Joyzen Logo in Center */}
            <div className="relative w-28 h-28 xs:w-36 xs:h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 mb-1 sm:mb-2 transition-transform duration-500">
              <Image
                src="/joyzen-orange.png"
                alt="Joyzen"
                fill
                priority
                className="object-contain drop-shadow-[0_14px_28px_rgba(239,143,96,0.18)]"
              />
            </div>

            {/* Typography */}
            <div className="flex flex-col items-center">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[40px] font-bold text-zinc-900 tracking-tight leading-none">
                Hear From Our
              </h2>
              <h2 className="text-[36px] xs:text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-[#AEDEE4] tracking-tight leading-none">
                Joyzen Club
              </h2>
            </div>
          </div>
        </div>

        {/* FLOATING / SCROLLING REVIEW CARDS LAYER (Columns scroll past the pinned center) */}
        <div 
          className="absolute inset-0 z-10 w-full flex justify-between h-full pointer-events-none px-2 sm:px-4"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)'
          }}
        >
          {/* Left Column of Floating Cards */}
          <div className="w-full lg:w-1/2 absolute inset-y-0 left-0 h-full pointer-events-none">
            {leftReviews.map((card, i) => (
              <div
                key={`rev-left-${card.id}-${i}`}
                className="review-card-left opacity-0 absolute inset-0 flex items-center justify-start lg:justify-end pl-3 xs:pl-4 sm:pl-6 lg:pl-0 lg:pr-16 pointer-events-none"
              >
                <div className="pointer-events-auto">
                  <ReviewCard card={card} />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column of Floating Cards */}
          <div className="w-full lg:w-1/2 absolute inset-y-0 right-0 h-full pointer-events-none">
            {rightReviews.map((card, i) => (
              <div
                key={`rev-right-${card.id}-${i}`}
                className="review-card-right opacity-0 absolute inset-0 flex items-center justify-end lg:justify-start pr-3 xs:pr-4 sm:pr-6 lg:pr-0 lg:pl-16 pointer-events-none"
              >
                <div className="pointer-events-auto">
                  <ReviewCard card={card} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;