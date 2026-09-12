"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Ensure ScrollTrigger is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextRevealProps {
  /** Optional badge text shown above the title (e.g. "PHILOSOPHY") */
  badgeText?: string;
  /** Controls if the badge is displayed */
  showBadge?: boolean;
  /** Small pre-title text above the main title */
  preTitle?: string;
  /** Large main title (e.g. "Working Together." or "Deliberately.") */
  mainTitle?: string;
  /** Custom color for the main title. Defaults to Regen Power green (#63B846) */
  titleColor?: string;
  /** Paragraph text to reveal, can be a single string or an array of paragraphs */
  text: string | string[];
  /** Optional additional classes for the outer section container */
  className?: string;
}

// Helper to split text into word spans
const SplitWords = ({ text }: { text: string }) => {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="inline-block mr-[0.25em] word-span text-[#D4D4D8] select-none"
        >
          {word}
        </span>
      ))}
    </>
  );
};

export default function TextReveal({
  badgeText = "PHILOSOPHY",
  showBadge = false,
  preTitle,
  mainTitle,
  titleColor = "#63B846",
  text,
  className = "",
}: TextRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const allWords = gsap.utils.toArray<HTMLElement>(
        sectionEl.querySelectorAll(".word-span") || []
      );

      if (allWords.length === 0) return;

      const createPinnedAnimation = (
        pinMultiplier: number,
        stagger: number,
        shouldPin = true,
        pinSpacing = true
      ) => {
        const getEnd = () => `+=${Math.round(window.innerHeight * pinMultiplier)}`;

        const textReveal = gsap.to(allWords, {
          color: "#000000",
          stagger,
          ease: "none",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top top",
            end: getEnd,
            scrub: 0.7,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        });

        const pinTrigger = shouldPin
          ? ScrollTrigger.create({
              trigger: sectionEl,
              start: "top top",
              end: getEnd,
              pin: true,
              pinSpacing,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              fastScrollEnd: true,
            })
          : null;

        return () => {
          textReveal.kill();
          pinTrigger?.kill();
        };
      };

      // Responsive pinning heights & stagger speeds
      mm.add("(min-width: 1280px)", () => createPinnedAnimation(1.35, 0.1, true, true));
      mm.add("(min-width: 768px) and (max-width: 1279px)", () => createPinnedAnimation(1.1, 0.09, true, true));
      mm.add("(max-width: 767px)", () => createPinnedAnimation(0.85, 0.06, true, true));
    }, sectionEl);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [text]);

  const paragraphsArray = Array.isArray(text) ? text : [text];

  return (
    <section
      ref={sectionRef}
      className={`w-full bg-white relative overflow-hidden flex flex-col justify-between py-12 md:py-20 min-h-screen ${className}`}
    >
      {/* Background Dots - matching the clean modern aesthetic */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(217, 217, 217, 0.15) 3.5px, transparent 3.5px),
            radial-gradient(circle, rgba(217, 217, 217, 0.15) 3.5px, transparent 3.5px)
          `,
          backgroundSize: "80px 80px",
          backgroundPosition: "0 0, 40px 40px",
        }}
      />

      <div ref={containerRef} className="w-full relative z-10 flex flex-col justify-between flex-1">
        {/* Header Section */}
        <div className="w-full  px-6 sm:px-8 md:px-12 lg:px-16 flex flex-col items-start text-left mb-10 md:mb-5">
          {showBadge && badgeText && (
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#F3F2EC] text-[#55524B] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] mb-5 md:mb-6 shadow-sm border border-[#E9E8E1] select-none">
              {badgeText}
            </div>
          )}
          <h2 className="flex flex-col gap-1.5 sm:gap-2 leading-[1.1] md:leading-[1.05]">
            {preTitle && (
              <span className="text-[20px] sm:text-[26px] md:text-2xl font-normal text-[#171717] tracking-tight">
                {preTitle}
              </span>
            )}
            {mainTitle && (
              <span
                className="text-[44px] sm:text-[60px] md:text-[76px] lg:text-[5rem] font-medium tracking-tighter"
                style={{ color: titleColor }}
              >
                {mainTitle}
              </span>
            )}
          </h2>
        </div>

        {/* Scroll Reveal Text Block */}
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 flex-1 flex flex-col justify-start items-start text-center py-6 md:py-5">
          <div className="flex flex-col gap-6 md:gap-10 w-full">
            {paragraphsArray.map((para, idx) => (
              <p
                key={idx}
                className="font-normal text-left text-[20px] sm:text-[26px] md:text-[34px] leading-[1.45] tracking-[-0.02em]"
              >
                <SplitWords text={para} />
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}