"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface DigitUnitProps {
  value: number;
  label: string;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function DigitUnit({ value, label }: DigitUnitProps) {
  const numRef = useRef<HTMLSpanElement>(null);
  const prevRef = useRef<number>(-1);

  useEffect(() => {
    if (!numRef.current) return;
    if (prevRef.current === value) return;
    prevRef.current = value;

    // Subtle opacity-only crossfade — no translateY to avoid layout shift
    gsap.fromTo(
      numRef.current,
      { opacity: 0, scale: 0.96 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      }
    );
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-3 min-w-0">
      {/* Fixed-size container prevents layout shift when digits change */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "clamp(3.2rem, 16vw, 8rem)",
          height: "clamp(3.2rem, 16vw, 8rem)",
        }}
      >
        <span
          ref={numRef}
          className="font-serif"
          style={{
            fontSize: "clamp(2.5rem, 14vw, 8rem)",
            fontWeight: 900,
            color: "var(--color-foreground)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            fontStyle: "italic",
            willChange: "opacity, transform",
            display: "block",
            textAlign: "center",
          }}
        >
          {pad(value)}
        </span>
        {/* Subtle underline that breathes */}
        <div
          className="absolute bottom-0 left-1/2 h-px"
          style={{
            width: "60%",
            transform: "translateX(-50%)",
            background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
            animation: "breathe 3s ease-in-out infinite",
          }}
        />
      </div>

      {/* Label */}
      <span
        className="font-sans tracking-widest uppercase"
        style={{
          fontSize: "clamp(0.45rem, 1.5vw, 0.58rem)",
          fontWeight: 300,
          color: "var(--color-muted)",
          letterSpacing: "0.22em",
        }}
      >
        {label}
      </span>
    </div>
  );
}