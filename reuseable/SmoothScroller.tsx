"use client";
import { ReactNode, useRef, useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import gsap from "gsap";
import { usePathname } from "next/navigation";

interface LenisProviderProps {
  children: ReactNode;
}

const SmoothScroller = ({ children }: LenisProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (lenisRef.current) {
      // Lenis owns the scroll position — reset it to the top on every
      // route change so pages (e.g. a blog article) don't open mid-scroll.
      lenisRef.current.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
      setTimeout(() => {
        lenisRef.current?.resize();
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [pathname]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    /* ---------------------------------------------------
       1. Allow browser native scroll restoration
    --------------------------------------------------- */
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "auto"; // <-- important
    }

    /* ---------------------------------------------------
       2. Initialize Lenis AFTER the browser restores scroll
    --------------------------------------------------- */
    requestAnimationFrame(() => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1,
        syncTouch: false,
        autoRaf: false, // <-- changed (important!)
      });

      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      /* ---------------------------------------------------
         3. Sync Lenis with GSAP Ticker for smooth iOS pinning
      --------------------------------------------------- */
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.addEventListener("refresh", () => lenis.resize());
      ScrollTrigger.refresh();
    });

    return () => {
      lenisRef.current?.destroy();
      ScrollTrigger.killAll();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroller;