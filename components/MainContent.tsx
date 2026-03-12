"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import CornerDecor from "./CornerDecor";
import ReactConfetti from "react-confetti";

gsap.registerPlugin(TextPlugin);

/* ─── Brand-palette confetti colours ── */
const CONFETTI_COLORS = [
  "#c4a882", "#6e5a30", "#d8ccb4",
  "#5c4a3a", "#f5efe2", "#7a6040", "#ede4d0",
];

/* ─── Butterfly scatter layout ───────────────────────────────────────────── */
const BUTTERFLIES = [
  { top: "5%",  left: "3%",   w: 160, rotate: "-rotate-12", flutter: "0.9s" },
  { top: "3%",  left: "34%",  w: 130, rotate: "rotate-6",   flutter: "1.1s" },
  { top: "68%", left: "16%",  w: 160, rotate: "rotate-3",   flutter: "1.3s" },
  { top: "63%", left: "68%",  w: 150, rotate: "-rotate-6",  flutter: "0.85s" },
];

export default function MainContent() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const happyRef      = useRef<HTMLParagraphElement>(null);
  const birthdayRef   = useRef<HTMLHeadingElement>(null);
  const nameRef       = useRef<HTMLHeadingElement>(null);
  const dividerRef    = useRef<HTMLDivElement>(null);
  const quoteRef      = useRef<HTMLParagraphElement>(null);
  const scrollBtnRef  = useRef<HTMLButtonElement>(null);
  const butterflyRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ── Confetti fires once after name is typed ── */
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onStart: () => {
          if (containerRef.current)
            containerRef.current.style.visibility = "visible";
          // Lock scroll for the entire intro animation
          disablePageScroll();
        },
      });

      /* 1 ── Butterflies drift in, staggered */
      tl.fromTo(
        butterflyRefs.current,
        { scale: 0, opacity: 0, y: 30 },
        {
          scale: 1, opacity: 1, y: 0,
          duration: 0.8,
          ease: "back.out(2)",
          stagger: 0.18,
        }
      );

      /* 2 ── "Happy" fades up */
      tl.fromTo(
        happyRef.current,
        { opacity: 0, y: 18, letterSpacing: "0.55em" },
        { opacity: 1, y: 0,  letterSpacing: "0.35em", duration: 0.9, ease: "power3.out" },
        "-=0.5"
      );

      /* 3 ── "Birthday" sweeps in */
      tl.fromTo(
        birthdayRef.current,
        { opacity: 0, scale: 0.82, y: 16 },
        { opacity: 1, scale: 1,    y: 0,  duration: 1.1, ease: "back.out(1.8)" },
        "-=0.3"
      );

      /* 4 ── "Maheswari" typed in via TextPlugin, char by char */
      tl.call(() => setShowConfetti(true));

      tl.set(nameRef.current, { opacity: 1 });
      tl.to(nameRef.current, {
        duration: 1,
        text: { value: "Maheswari", delimiter: "" },
        ease: "none",
      }, "-=0.2");

      /* ── Confetti burst right after name finishes typing ── */

      /* 4 ── Thin divider grows from center */
      tl.fromTo(
        dividerRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.9, ease: "power2.out", transformOrigin: "center" },
        "-=0.4"
      );

      /* 5 ── Quote drifts up */
      tl.fromTo(
        quoteRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0,  duration: 1.1, ease: "power2.out" },
        "-=0.3"
      );

      /* 6 ── Scroll button fades in last, then pulses forever */
      tl.fromTo(
        scrollBtnRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
          onComplete: () => {
            // Animation done — release the scroll lock
            enablePageScroll();
          },
        },
        "-=0.3"
      );
      // Infinite gentle bob after it appears
      tl.to(scrollBtnRef.current, {
        y: -7,
        duration: 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, containerRef);

    return () => {
      ctx.revert();
      // Safety — always release scroll if component unmounts mid-animation
      enablePageScroll();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{
        background: "var(--color-background)",
        visibility: "hidden",
      }}
    >
      {/* ── Corner flower decorations ─────────────────────── */}
      <CornerDecor corner="top-right"    />
      <CornerDecor corner="bottom-left"  />

      {/* ── One-time confetti burst after name types in ── */}
      {showConfetti && (
        <ReactConfetti
          width={typeof window !== "undefined" ? window.innerWidth : 800}
          height={typeof window !== "undefined" ? window.innerHeight : 600}
          numberOfPieces={120}
          recycle={false}
          gravity={0.18}
          wind={0.01}
          initialVelocityY={14}
          tweenDuration={6000}
          colors={CONFETTI_COLORS}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 9998, pointerEvents: "none" }}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}


      {/* ── Scattered butterflies ─────────────────────────── */}
      {BUTTERFLIES.map((b, i) => (
        <div
          key={i}
          ref={(el) => { butterflyRefs.current[i] = el; }}
          className={`absolute pointer-events-none select-none ${b.rotate}`}
          style={{
            top: b.top,
            left: b.left,
            /* clamp: mobile base → large screen max */
            width:  `clamp(${b.w}px, ${b.w * 0.14}vw, ${Math.round(b.w * 1.65)}px)`,
            height: `clamp(${b.w}px, ${b.w * 0.14}vw, ${Math.round(b.w * 1.65)}px)`,
            opacity: 0,
            zIndex: 2,
          }}
        >
          {/* flutter CSS animation wraps the image so GSAP scale/opacity on parent don't conflict */}
          <div
            className="butterfly w-full h-full"
            style={{ animationDuration: b.flutter, animationDelay: `${i * 0.2}s` }}
          >
            <Image
              src="/butterfly.webp"
              alt=""
              fill
              className="object-contain drop-shadow-md"
              sizes={`(max-width: 768px) ${b.w}px, ${Math.round(b.w * 1.65)}px`}
            />
          </div>
        </div>
      ))}

      {/* ── Centre text ───────────────────────────────────── */}
      <div
        className="absolute inset-0  flex flex-col items-center justify-center px-6 text-center"
        style={{ zIndex: 5 }}
      >
        {/* Inner width cap — stops text sprawling on 4K / ultrawide */}
        <div style={{ width: "100%", maxWidth: "min(640px, 88vw)" }}>

        {/* "Happy" — spaced-caps eyebrow */}
        <p
          ref={happyRef}
          className="font-sans uppercase text-foregground"
          style={{
            fontSize: "clamp(1rem, 1.6vw, 2rem)",
            letterSpacing: "0.35em",
            fontWeight: 300,
            opacity: 0,
            marginBottom: "0.15em",
          }}
        >
          Happy
        </p>

        {/* "Birthday" — large script */}
        <h1
          ref={birthdayRef}
          className="font-script text-foreground leading-none"
          style={{
            fontSize: "clamp(3.8rem, 12vw, 10rem)",
            opacity: 0,
            letterSpacing: "0.02em",
            textShadow: "0 4px 32px rgba(92,74,58,0.18), 0 1px 0 rgba(92,74,58,0.08)",
            marginBottom: "0.05em",
          }}
        >
          Birthday
        </h1>

        {/* "Maheswari" — typed in by TextPlugin */}
        <h2
          ref={nameRef}
          className="font-script text-foreground leading-none"
          style={{
            fontSize: "clamp(2rem, 7vw, 4.5rem)",
            opacity: 0,
            minHeight: "1.2em",
            letterSpacing: "0.04em",
            color: "var(--color-accent-dark)",
            textShadow: "0 2px 20px rgba(92,74,58,0.13)",
            marginBottom: "clamp(0.9rem, 3vw, 1.6rem)",
          }}
        >
          {/* intentionally empty — TextPlugin writes here */}
        </h2>

        {/* Thin ornamental divider */}
        <div
          ref={dividerRef}
          style={{
            width: "min(280px, 60vw)",
            height: "1px",
            margin: "0 auto",
            background:
              "linear-gradient(90deg, transparent, var(--color-accent) 35%, var(--color-accent) 65%, transparent)",
            marginBottom: "clamp(0.8rem, 2.5vw, 1.4rem)",
            opacity: 0,
          }}
        />

        {/* Quote */}
        <p
          ref={quoteRef}
          className="font-serif text-accent-dark"
          style={{
            fontSize: "clamp(0.82rem, 1.8vw, 1rem)",
            fontWeight: 300,
            fontStyle: "italic",
            lineHeight: 1.9,
            opacity: 0,
            letterSpacing: "0.02em",
          }}
        >
          Many more happy returns of the day! MAAA.... ,<br />
          God bless you and keep you safe always.<br />
          May all your dreams and wishes come true.
        </p>

        {/* ── Apple-feel scroll hint button ─────────────────── */}
        <button
          ref={scrollBtnRef}
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
          className="group"
          aria-label="Scroll to next section"
          style={{
            marginTop: "clamp(1.4rem, 4vw, 2.2rem)",
            opacity: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.55rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            outline: "none",
            width: "100%",
            justifyContent: "center",
          }}
        >
          {/* Pill */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.5rem 1.2rem",
              borderRadius: "999px",
              border: "1px solid rgba(110, 90, 48, 0.28)",
              background: "rgba(255,250,242,0.55)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow:
                "0 2px 16px rgba(92,74,58,0.08), inset 0 1px 0 rgba(255,255,255,0.55)",
              fontSize: "clamp(0.65rem, 1.4vw, 0.78rem)",
              fontFamily: "var(--font-jost), sans-serif",
              fontWeight: 300,
              letterSpacing: "0.18em",
              color: "var(--color-accent-dark)",
              textTransform: "uppercase",
              transition: "box-shadow 0.25s, background 0.25s",
            }}
          >
            Scroll
            <svg
              width="11" height="11" viewBox="0 0 12 12"
              fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ opacity: 0.7 }}
            >
              <path
                d="M2 4L6 8L10 4"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        </div>{/* end inner cap */}
      </div>
    </div>
  );
}