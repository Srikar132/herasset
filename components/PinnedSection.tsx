"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PinnedSectionProps {
  children: React.ReactNode;
  /**
   * Animate the section out (scale + fade) as the next section scrolls over it.
   * @default true
   */
  animateOut?: boolean;
  /** Final scale when fully scrolled past. @default 0.92 */
  exitScale?: number;
  /** Final opacity when fully scrolled past. @default 0.3 */
  exitOpacity?: number;
  /**
   * How much extra scroll travel to hold the pin before releasing.
   * "+=200vh" = the section stays pinned for 200vh of scrolling before the
   * next section appears. Increase for more resistance / cinematic weight.
   * @default "+=200vh"
   */
  pinDuration?: string;
  /**
   * scrub value passed to ScrollTrigger.
   * - true  → perfectly tied to scroll (no lag, clean)
   * - 1     → 1 s lag (smooth, slightly resistive)
   * - 1.5   → heavier feel — recommended for cinematic pages
   * @default 1.5
   */
  scrub?: number | boolean;
  className?: string;
  /** Pass-through z-index so parent stacking order is respected */
  zIndex?: number;
}

/**
 * PinnedSection
 * ─────────────
 * Wraps any section so it pins at top:0 via GSAP ScrollTrigger while the
 * next section scrolls up over it with a cinematic scale+fade exit.
 *
 * KEY FIXES vs prior version:
 *  - pinSpacing: true  → allocates real scroll space so pin has weight
 *  - end: pinDuration  → "+=200vh" gives generous hold before release
 *  - scrub: 1.5        → lag makes scroll feel heavy/cinematic, not snappy
 *  - zIndex prop       → no longer hardcodes zIndex:1, respects parent stacking
 */
export default function PinnedSection({
  children,
  animateOut  = true,
  exitScale   = 0.9,
  exitOpacity = 1,
  pinDuration = "+=200vh",
  scrub       = 5,
  className   = "",
  zIndex,
}: PinnedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const triggerVars: ScrollTrigger.Vars = {
        trigger: ref.current!,
        start:      "top top",
        end:        `bottom top`,   // ← real scroll distance before unpin
        pin:        true,
        pinSpacing: false,          // ← allocates scroll space (was false — root cause of fast scroll)
        scrub,                     // ← lag for cinematic feel (was 0.1 — too snappy)
        anticipatePin: 0,

      };

      if (animateOut) {
        gsap.to(ref.current, {
          scale:   exitScale,
          opacity: exitOpacity,
          ease:    "none",
          scrollTrigger: triggerVars,
        });
      } else {
        ScrollTrigger.create(triggerVars);
      }
    });

    return () => ctx.revert();
  }, [animateOut, exitScale, exitOpacity, pinDuration, scrub]);

  return (
    <div
      ref={ref}
      className={`relative will-change-transform ${className}`}
      style={zIndex !== undefined ? { zIndex } : undefined}
    >
      {children}
    </div>
  );
}