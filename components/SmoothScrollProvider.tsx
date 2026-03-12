"use client";

/**
 * SmoothScrollProvider
 * ────────────────────
 * Drop this into your root layout (or page) to enable ScrollSmoother globally.
 *
 * ScrollSmoother requires exactly:
 *   #smooth-wrapper  (outer, fixed viewport height)
 *     └── #smooth-content  (inner, full natural height)
 *
 * All data-speed / data-lag attributes on child elements are
 * automatically picked up by ScrollSmoother.create() below.
 *
 * Usage in layout.tsx:
 *   <SmoothScrollProvider>
 *     {children}
 *   </SmoothScrollProvider>
 */

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const smootherRef = useRef<ScrollSmoother | null>(null);

  useEffect(() => {
    // ScrollSmoother must only run in browser
    if (typeof window === "undefined") return;

    // smootherRef.current = ScrollSmoother.create({
    //   wrapper:  "#smooth-wrapper",
    //   content:  "#smooth-content",

    //   /**
    //    * smooth: 1.2
    //    * How many seconds the content lags behind the scroll bar.
    //    * 1–1.5 feels luxurious without motion sickness.
    //    * 0 = no smoothing (disable if accessibility is a concern).
    //    */
    //   smooth: 0.1,

    //   /**
    //    * effects: true
    //    * Enables data-speed and data-lag attributes on any element.
    //    * data-speed="0.65" → element scrolls at 65% of page speed (parallax)
    //    * data-lag="0.2"    → element follows scroll with 0.2s delay
    //    */
    //   effects: false,

    //   /**
    //    * normalizeScroll: true
    //    * Prevents browser scroll jank, especially on iOS Safari.
    //    * Comment out if you see issues with embedded iframes.
    //    */
    //   normalizeScroll: true,
    // });

    return () => {
      smootherRef.current?.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper" style={{ overflow: "hidden", height: "100vh" }}>
      <div id="smooth-content">
        {children}
      </div>
    </div>
  );
}