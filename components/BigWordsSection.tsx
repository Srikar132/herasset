"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   ✏️  EDIT — your bold lines
   ───────────────────────────────────────────── */
const LINES = [
  "Be Happy",
  "Don't Overthink",
  "Smile More",
  "Stay Kind",
  "Love Yourself",
  "Dream Big",
  "Keep Going",
  "Trust The Process",
  "Be Brave",
  "Laugh Often",
  "Stay Curious",
  "You're Enough",
];

export default function BigWordsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      lineRefs.current.forEach((el, i) => {
        if (!el) return;

        /* ── Each line slides up + fades in on scroll ── */
        gsap.fromTo(el,
          {
            opacity: 0,
            y: 60,
            scale: 0.92,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );

        /* ── Subtle parallax drift while scrolling past ── */
        gsap.to(el, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.3,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full overflow-hidden p-5"
      style={{
        background: "var(--color-background)",
        paddingTop: "clamp(3rem, 8vw, 6rem)",
        paddingBottom: "clamp(4rem, 10vw, 8rem)",
      }}
    >
      {/* ── Top accent line ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, var(--color-accent), transparent)" }}
      />

      {/* ── Lines ── */}
      <div
        className="flex flex-col items-center"
        style={{ gap: "clamp(0.6rem, 2vw, 1.5rem)" }}
      >
        {LINES.map((text, i) => {
          /* Alternate between foreground and accent-dark for visual rhythm */
          const isAccent = i % 2 === 1;

          return (
            <div
              key={i}
              ref={(el) => { lineRefs.current[i] = el; }}
              className="w-full opacity-0"
              style={{ padding: "0 clamp(0.2rem, 0.8vw, 0.5rem)" }}
            >
              {/*
                SVG text — scales to fill 100% width automatically.
                The viewBox width is calculated per-text so each line
                truly stretches edge-to-edge like a responsive image.
              */}
              <svg
                viewBox={`0 0 ${text.length * 52} 100`}
                xmlns="http://www.w3.org/2000/svg"
                className="block w-full h-auto"
                style={{ overflow: "visible" }}
                aria-label={text}
                role="img"
              >
                <text
                  x="50%"
                  y="78"
                  textAnchor="middle"
                  dominantBaseline="auto"
                  style={{
                    fontFamily: "var(--font-jost), sans-serif",
                    fontWeight: 900,
                    fontSize: "96px",
                    letterSpacing: "-0.03em",
                    textTransform: "uppercase",
                    fill: isAccent
                      ? "var(--color-accent-dark)"
                      : "var(--color-foreground)",
                    stroke: isAccent
                      ? "var(--color-accent-dark)"
                      : "var(--color-foreground)",
                    strokeWidth: "2px",
                    paintOrder: "stroke",
                    opacity: 0.70,
                  }}
                >
                  {text}
                </text>
              </svg>
            </div>
          );
        })}
      </div>

      {/* ── Bottom closer ── */}
      <div
        className="flex flex-col items-center mt-12 gap-3"
        style={{ opacity: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <span style={{ color: "var(--color-accent)", fontSize: "0.9rem" }}>✦</span>
          <div
            className="h-px"
            style={{
              width: "clamp(40px, 10vw, 80px)",
              background: "var(--color-accent)",
            }}
          />
          <span style={{ color: "var(--color-accent)", fontSize: "0.9rem" }}>✦</span>
        </div>
        <p
          className="font-sans uppercase text-center"
          style={{
            color: "var(--color-muted-warm)",
            fontSize: "clamp(0.55rem, 1.1vw, 0.7rem)",
            letterSpacing: "0.35em",
          }}
        >
          remember these, always
        </p>
      </div>

      {/* ── Bottom accent line ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, var(--color-accent), transparent)" }}
      />
    </div>
  );
}
