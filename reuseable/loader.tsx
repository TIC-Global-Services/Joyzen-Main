'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';

export interface PreloaderProps {
  manual?: boolean;
  progress?: number;
  isComplete?: boolean;
  onFinish?: () => void;
}

export default function Preloader({
  manual = false,
  progress: externalProgress,
  isComplete: externalIsComplete,
  onFinish,
}: PreloaderProps) {
  const pathname = usePathname();
  const preloaderRef = useRef<HTMLDivElement>(null);

  // If manual mode starts with isComplete already true (images already cached in memory),
  // skip immediately so returning users see the content right away with zero flash.
  const [initialComplete] = useState(() => manual && Boolean(externalIsComplete));
  const [hasExited, setHasExited] = useState(initialComplete);

  const [internalProgress, setInternalProgress] = useState(0);
  const progressRef = useRef(0);
  const isFinishedRef = useRef(false);

  // Only allowed to ever display on Home ('/') or Our Vision ('/our-vision')
  const isAllowedPath = pathname === '/' || pathname === '/our-vision';

  // Skip if not on an allowed path OR if already cached and completed on mount
  const shouldSkip = !isAllowedPath || initialComplete;

  const currentProgress = manual
    ? Math.min(100, Math.max(0, Math.round(externalProgress ?? 0)))
    : internalProgress;

  // If skipped immediately, trigger onFinish if provided
  useEffect(() => {
    if (shouldSkip) {
      onFinish?.();
    }
  }, [shouldSkip, onFinish]);

  // When images finish downloading and caching, animate loader out and reveal content
  useEffect(() => {
    if (!manual || shouldSkip) return;

    if (externalIsComplete && !isFinishedRef.current) {
      isFinishedRef.current = true;

      if (preloaderRef.current) {
        gsap.to(preloaderRef.current, {
          opacity: 0,
          scale: 1.02,
          duration: 0.7,
          ease: 'power2.out',
          delay: 0.2,
          onComplete: () => {
            setHasExited(true);
            onFinish?.();
          },
        });
      } else {
        setHasExited(true);
        onFinish?.();
      }
    }
  }, [manual, shouldSkip, externalIsComplete, onFinish]);

  // Lock scroll while loader is active, restore scroll once loader hides
  useEffect(() => {
    if (shouldSkip || hasExited) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleScrollBlock = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', handleScrollBlock, { passive: false });
    window.addEventListener('touchmove', handleScrollBlock, { passive: false });

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('wheel', handleScrollBlock);
      window.removeEventListener('touchmove', handleScrollBlock);
    };
  }, [shouldSkip, hasExited]);

  // Automatic fallback mode (for pages without manual progress tracking)
  useEffect(() => {
    if (manual || shouldSkip) return;

    isFinishedRef.current = false;
    let hasReceivedDnaEvent = false;

    const finishLoading = () => {
      if (isFinishedRef.current) return;
      isFinishedRef.current = true;
      setInternalProgress(100);

      if (preloaderRef.current) {
        gsap.to(preloaderRef.current, {
          opacity: 0,
          scale: 1.02,
          duration: 0.7,
          ease: 'power2.out',
          delay: 0.2,
          onComplete: () => {
            setHasExited(true);
            onFinish?.();
          },
        });
      } else {
        setHasExited(true);
        onFinish?.();
      }
    };

    // 1. Listen for DNA sequence image download progress
    const handleDnaProgress = (event: Event) => {
      const customEvent = event as CustomEvent<{ progress: number; isComplete: boolean }>;
      if (!customEvent.detail) return;

      hasReceivedDnaEvent = true;
      const pct = Math.max(progressRef.current, customEvent.detail.progress);
      progressRef.current = pct;
      setInternalProgress(pct);

      if (customEvent.detail.isComplete || pct >= 100) {
        finishLoading();
      }
    };

    window.addEventListener('dna-progress', handleDnaProgress);

    // 2. Track standard page images loading state in DOM
    const trackPageImages = () => {
      if (hasReceivedDnaEvent || isFinishedRef.current) return;

      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
      if (imgs.length === 0) return;

      let loadedCount = 0;
      imgs.forEach((img) => {
        if (img.complete && img.naturalWidth > 0) {
          loadedCount++;
        }
      });

      const imgPct = Math.round((loadedCount / imgs.length) * 100);
      if (imgPct > progressRef.current) {
        progressRef.current = imgPct;
        setInternalProgress(imgPct);
      }

      if (loadedCount === imgs.length && document.readyState === 'complete') {
        finishLoading();
      }
    };

    const imgElements = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
    imgElements.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', trackPageImages);
        img.addEventListener('error', trackPageImages);
      }
    });

    const handleWindowLoad = () => {
      if (!hasReceivedDnaEvent) {
        trackPageImages();
        finishLoading();
      }
    };

    if (document.readyState === 'complete') {
      trackPageImages();
    } else {
      window.addEventListener('load', handleWindowLoad);
    }

    const interval = setInterval(() => {
      if (isFinishedRef.current) {
        clearInterval(interval);
        return;
      }

      trackPageImages();

      if (!hasReceivedDnaEvent) {
        setInternalProgress((prev) => {
          if (prev >= 95 && document.readyState !== 'complete') {
            return prev;
          }
          const next = Math.min(prev + Math.floor(Math.random() * 10 + 5), 95);
          progressRef.current = next;
          return next;
        });
      }
    }, 150);

    const maxTimeout = setTimeout(() => {
      finishLoading();
    }, 6000);

    return () => {
      window.removeEventListener('dna-progress', handleDnaProgress);
      window.removeEventListener('load', handleWindowLoad);
      imgElements.forEach((img) => {
        img.removeEventListener('load', trackPageImages);
        img.removeEventListener('error', trackPageImages);
      });
      clearInterval(interval);
      clearTimeout(maxTimeout);
    };
  }, [manual, shouldSkip, onFinish]);

  if (shouldSkip || hasExited) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#fbf8f2] select-none transition-all"
    >
      {/* Ambient background glow */}
      <div className="absolute w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#EF8F60]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Joyzen Logo and Progress Container */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Joyzen SVG Logo */}
        <svg
          id="preloader-svg"
          width="200"
          height="53"
          viewBox="0 0 200 53"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="scale-[1.15] sm:scale-[1.3] md:scale-[1.5]"
        >
          <g clipPath="url(#clip0_1_140)">
            <path d="M79.8154 10.4224C71.9424 10.4224 65.3442 15.9783 65.3442 25.8703C65.3442 35.7623 71.9446 40.9485 79.8779 40.9485C87.8113 40.9485 94.2909 35.5752 94.2909 25.8703C94.2909 16.1653 87.628 10.4224 79.8176 10.4224H79.8154ZM79.8154 34.6598C75.6373 34.6598 72.4881 31.6698 72.4881 25.8094C72.4881 19.949 75.5748 16.7133 79.8154 16.7133C84.056 16.7133 87.1448 19.8251 87.1448 25.8094C87.1448 31.7937 84.056 34.6598 79.8154 34.6598Z" fill="#FAF8F1" className="preloader-path" />
            <path d="M113.197 11.0334L106.778 32.2178L100.299 11.0334H93.5775L103.387 40.3375L99.6343 52.5475H106.416L110.111 40.3375L119.921 11.0334H113.2H113.197Z" fill="#FAF8F1" className="preloader-path" />
            <path d="M143.148 35.0252V40.3375H120.742V35.0252L133.942 16.3437H121.287L123.065 11.0335H141.996V16.3437L128.914 35.0252H143.146H143.148ZM131.824 8.71324C134.126 8.71324 136.063 6.76051 136.063 4.44028C136.063 2.12004 134.126 0.104248 131.824 0.104248C129.523 0.104248 127.525 2.05698 127.525 4.4381C127.525 6.81922 129.462 8.71107 131.824 8.71107V8.71324Z" fill="#FAF8F1" className="preloader-path" />
            <path d="M61.9642 11.0334V43.2688C61.9642 49.1183 59.0673 52.2822 54.7577 52.9998L54.7728 11.0334H61.9663H61.9642ZM48.2177 52.9998C50.5192 52.9998 52.4562 51.0471 52.4562 48.7269C52.4562 46.4066 50.5192 44.393 48.2177 44.393C45.9162 44.393 43.9188 46.3458 43.9188 48.7269C43.9188 51.108 45.8558 52.9998 48.2177 52.9998Z" fill="#FAF8F1" className="preloader-path" />
            <path d="M171.115 25.6224C171.115 14.8171 165.483 10.4202 158.399 10.4202C150.584 10.4202 144.651 15.7326 144.651 25.4397C144.651 35.8797 151.253 40.9463 159.003 40.9463C163.908 40.9463 167.603 38.8718 169.844 35.0229L165.724 30.9348C164.572 33.5594 161.971 34.6576 159.124 34.6576C155.067 34.6576 151.734 32.4004 151.191 27.5773H171.112V25.6224H171.115ZM151.311 22.9999C152.038 18.7247 154.946 16.7111 158.46 16.7111C161.973 16.7111 164.695 18.8487 164.997 22.9999H151.311Z" fill="#FAF8F1" className="preloader-path" />
            <path d="M190.312 10.4223C185.225 10.4223 182.741 12.8056 180.985 16.772H180.866V11.0334H173.778V40.3375H180.866V25.3331C180.866 24.0197 181.045 22.7063 181.444 21.4559C182.557 17.9593 184.641 16.5872 187.589 16.5872C190.859 16.5872 192.919 18.1746 192.919 22.4475V40.3375H200.005V20.5557C200.005 13.4123 195.767 10.4202 190.316 10.4202L190.312 10.4223Z" fill="#FAF8F1" className="preloader-path" />
            <path d="M79.8154 10.4224C71.9424 10.4224 65.3442 15.9783 65.3442 25.8703C65.3442 35.7623 71.9446 40.9485 79.8779 40.9485C87.8113 40.9485 94.2909 35.5752 94.2909 25.8703C94.2909 16.1653 87.628 10.4224 79.8176 10.4224H79.8154ZM79.8154 34.6598C75.6373 34.6598 72.4881 31.6698 72.4881 25.8094C72.4881 19.949 75.5748 16.7133 79.8154 16.7133C84.056 16.7133 87.1448 19.8251 87.1448 25.8094C87.1448 31.7937 84.056 34.6598 79.8154 34.6598Z" fill="#EF8F60" className="preloader-path" />
            <path d="M113.197 11.0334L106.778 32.2178L100.299 11.0334H93.5775L103.387 40.3375L99.6343 52.5475H106.416L110.111 40.3375L119.921 11.0334H113.2H113.197Z" fill="#EF8F60" className="preloader-path" />
            <path d="M143.148 35.0252V40.3375H120.742V35.0252L133.942 16.3437H121.287L123.065 11.0335H141.996V16.3437L128.914 35.0252H143.146H143.148ZM131.824 8.71324C134.126 8.71324 136.063 6.76051 136.063 4.44028C136.063 2.12004 134.126 0.104248 131.824 0.104248C129.523 0.104248 127.525 2.05698 127.525 4.4381C127.525 6.81922 129.462 8.71107 131.824 8.71107V8.71324Z" fill="#EF8F60" className="preloader-path" />
            <path d="M61.9642 11.0334V43.2688C61.9642 49.1183 59.0673 52.2822 54.7577 52.9998L54.7728 11.0334H61.9663H61.9642ZM48.2177 52.9998C50.5192 52.9998 52.4562 51.0471 52.4562 48.7269C52.4562 46.4066 50.5192 44.393 48.2177 44.393C45.9162 44.393 43.9188 46.3458 43.9188 48.7269C43.9188 51.108 45.8558 52.9998 48.2177 52.9998Z" fill="#EF8F60" className="preloader-path" />
            <path d="M171.115 25.6224C171.115 14.8171 165.483 10.4202 158.399 10.4202C150.584 10.4202 144.651 15.7326 144.651 25.4397C144.651 35.8797 151.253 40.9463 159.003 40.9463C163.908 40.9463 167.603 38.8718 169.844 35.0229L165.724 30.9348C164.572 33.5594 161.971 34.6576 159.124 34.6576C155.067 34.6576 151.734 32.4004 151.191 27.5773H171.112V25.6224H171.115ZM151.311 22.9999C152.038 18.7247 154.946 16.7111 158.46 16.7111C161.973 16.7111 164.695 18.8487 164.997 22.9999H151.311Z" fill="#EF8F60" className="preloader-path" />
            <path d="M190.312 10.4223C185.225 10.4223 182.741 12.8056 180.985 16.772H180.866V11.0334H173.778V40.3375H180.866V25.3331C180.866 24.0197 181.045 22.7063 181.444 21.4559C182.557 17.9593 184.641 16.5872 187.589 16.5872C190.859 16.5872 192.919 18.1746 192.919 22.4475V40.3375H200.005V20.5557C200.005 13.4123 195.767 10.4202 190.316 10.4202L190.312 10.4223Z" fill="#EF8F60" className="preloader-path" />
            <path d="M14.2771 24.544C6.55077 24.544 1.5293 21.1496 0 14.95L34.0372 14.9717V24.544H14.2771Z" fill="#EF8F60" className="preloader-path" />
            <path d="M16.9695 11.7599C13.8332 11.7599 11.1844 9.08957 11.1844 5.92996C11.1844 2.77036 13.8354 0 16.9695 0C20.1036 0 22.8516 2.65946 22.8516 5.92996C22.8516 9.20047 20.1575 11.7599 16.9695 11.7599Z" fill="#EF8F60" className="preloader-path" />
            <path d="M0 37.3064V27.7341H19.7601C27.4865 27.7341 32.5079 31.1286 34.0372 37.3282L0 37.3064Z" fill="#EF8F60" className="preloader-path" />
            <path d="M17.0678 52.278C13.8237 52.278 11.1857 49.6185 11.1857 46.348C11.1857 43.0775 13.8798 40.5181 17.0678 40.5181C20.2559 40.5181 22.8507 43.1884 22.8507 46.348C22.8507 49.5076 20.2019 52.278 17.0678 52.278Z" fill="#EF8F60" className="preloader-path" />
          </g>
          <defs>
            <clipPath id="clip0_1_140">
              <rect width="200" height="53" fill="white" />
            </clipPath>
          </defs>
        </svg>

        {/* Live Progress Bar & Percentage */}
        <div className="w-56 sm:w-64 flex flex-col items-center gap-2 mt-2">
          {/* Track */}
          <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden p-[0.5px]">
            <div
              className="h-full bg-gradient-to-r from-[#F6D7C6] via-[#EF8F60] to-[#036132] rounded-full transition-all duration-200 ease-out"
              style={{ width: `${currentProgress}%` }}
            />
          </div>

          <div className="w-full flex items-center justify-between text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
            <span>Loading Experience</span>
            <span className="font-bold text-[#EF8F60]">{currentProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}