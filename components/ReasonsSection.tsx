"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import CornerDecor from "./CornerDecor";

gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollSmoother);

/* ─────────────────────────────────────────────
   The statement is split into three "acts":
   Act 0 → serif italic, foreground colour
   Act 1 → script font, accent-dark colour  (the emotional peak)
   Act 2 → serif italic, foreground colour

   TextPlugin types each act into its own span sequentially,
   so accent words arrive in their own visual style mid-sentence.
   ───────────────────────────────────────────── */
const ACTS = [
  { text: "You are the reason my ordinary days feel like the most ",
    accent: false },
  { text: "beautiful stories ",
    accent: true },
  { text: "ever written",
    accent: false },
] as const;

export default function ReasonsSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const ornamentRef = useRef<HTMLDivElement>(null);
  const closerRef   = useRef<HTMLParagraphElement>(null);
  const butterflyRef = useRef<HTMLDivElement>(null);
  const cursorRef   = useRef<HTMLSpanElement>(null);

  /* One span ref per act */
  const act0Ref = useRef<HTMLSpanElement>(null);
  const act1Ref = useRef<HTMLSpanElement>(null);
  const act2Ref = useRef<HTMLSpanElement>(null);
  const actRefs = [act0Ref, act1Ref, act2Ref];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {

      /* ── 1. Eyebrow drifts up ── */
      gsap.fromTo(eyebrowRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );

      /* ── 2. Ornament scales in from centre ── */
      gsap.fromTo(ornamentRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1, duration: 1.1, ease: "expo.out",
          transformOrigin: "center",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      /* ── 3. TextPlugin — cursor blink starts, then each act types in ──
         The blinking cursor element is visible from the start.
         A timeline chains: blink → type act0 → type act1 → type act2 → hide cursor.
      ── */

      // Start cursor blink immediately when section enters
      const cursorBlink = gsap.to(cursorRef.current, {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: 0.48,
        ease: "steps(1)",
        paused: true,
      });

      const typeTl = gsap.timeline({
        paused: true,
        onComplete: () => {
          // Stop blinking, fade cursor out
          cursorBlink.pause();
          gsap.to(cursorRef.current, { opacity: 0, duration: 0.4, delay: 0.3 });
        },
      });

      ACTS.forEach((act, i) => {
        const ref = actRefs[i].current;
        if (!ref) return;

        // Slower for the accent act so it feels deliberate
        const charsPerSecond = act.accent ? 12 : 20;
        const duration = act.text.length / charsPerSecond;

        typeTl.to(
          ref,
          {
            duration,
            text: {
              value:     act.text,
              delimiter: "",       // char-by-char
              padSpace:  true,     // keep trailing space
            },
            ease: "none",
          },
          i === 0 ? 0 : "-=0.04"  // tiny overlap — seamless chain
        );
      });

      // Fire cursor + typewriter once section scrolls into view
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 66%",
        onEnter: () => {
          cursorBlink.play();
          typeTl.play();
        },
      });

      /* ── 4. Butterfly entry + perpetual flutter ── */
      if (butterflyRef.current) {

        // Slide in from right
        gsap.fromTo(butterflyRef.current,
          { x: 100, opacity: 0, rotate: -10, scale: 0.75 },
          {
            x: 0, opacity: 1, rotate: 0, scale: 1,
            duration: 1.8,
            ease: "expo.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );

        // Perpetual organic float — y drift + gentle rotation
        gsap.to(butterflyRef.current, {
          y: -18,
          rotate: 5,
          duration: 3.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 2,
        });

        // Wing scale flutter (simulates wingbeat on x axis)
        gsap.to(butterflyRef.current.querySelector("img"), {
          scaleX: 0.88,
          duration: 0.9,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 2.2,
        });
      }

      /* ── 5. Closer fades up last ── */
      gsap.fromTo(closerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
          scrollTrigger: {
            trigger: closerRef.current,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center"
      style={{
        backgroundColor: "var(--color-background-light)",
        perspective: "900px",
      }}
    >
      {/* ── Corner flower decorations ── */}
      <CornerDecor corner="top-right" />
      <CornerDecor corner="bottom-left" />

      {/* ── Ambient soft blobs ── */}
      <div className="absolute pointer-events-none" style={{
        top: "-10%", left: "-8%",
        width: "clamp(200px, 35vw, 420px)", height: "clamp(200px, 35vw, 420px)",
        borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
        background: "radial-gradient(circle, rgba(196,168,130,0.15) 0%, transparent 70%)",
        filter: "blur(40px)",
      }} />
      <div className="absolute pointer-events-none" style={{
        bottom: "-8%", right: "-6%",
        width: "clamp(180px, 30vw, 380px)", height: "clamp(180px, 30vw, 380px)",
        borderRadius: "40% 60% 30% 70% / 60% 40% 60% 40%",
        background: "radial-gradient(circle, rgba(110,90,48,0.1) 0%, transparent 70%)",
        filter: "blur(40px)",
      }} />

      {/* ── Top decorative rule ── */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(to right, transparent, var(--color-accent), transparent)",
      }} />

      {/* ────────────────────────────────────────────────────────
          BUTTERFLY IMAGE
          ─────────────────
          data-speed="0.65"  → ScrollSmoother parallax: floats at 65%
                               of scroll speed = drifts upward slowly
          data-lag="0.2"     → 0.2s lag behind scroll = dreamy trailing

          Note: data-speed / data-lag are only active when ScrollSmoother
          is initialised globally (smooth-wrapper / smooth-content in layout).
          The GSAP entry + flutter animations run regardless.
      ──────────────────────────────────────────────────────────── */}
      <div
        ref={butterflyRef}
        data-speed="0.65"
        data-lag="0.2"
        className="absolute pointer-events-none"
        style={{
          right:  "clamp(1.5rem, 7vw, 6rem)",
          top:    "50%",
          transform: "translateY(-58%)",
          width:  "clamp(110px, 20vw, 260px)",
          opacity: 0,          // GSAP entry tween opens this
          zIndex: 2,
          mixBlendMode: "multiply",   // fuses into parchment bg
          filter: "sepia(0.15) brightness(0.97)",
        }}
      >
        <Image
          src="/butterfly.webp"
          alt="butterfly"
          width={260}
          height={260}
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
          priority
        />
      </div>

      {/* ── Main text content ── */}
      <div
        className="relative flex flex-col items-center justify-center px-6 text-center"
        style={{
          maxWidth: "min(760px, 84vw)",
          width: "100%",
          zIndex: 10,
          // Nudge left so butterfly has breathing room on the right
          transform: "translateX(clamp(-30px, -4vw, 0px))",
        }}
      >
        {/* Eyebrow label */}
        <p
          ref={eyebrowRef}
          className="font-sans uppercase opacity-0"
          style={{
            color: "var(--color-muted)",
            fontSize: "clamp(0.6rem, 1.2vw, 0.78rem)",
            letterSpacing: "0.35em",
            marginBottom: "clamp(0.75rem, 2vw, 1.25rem)",
          }}
        >
          a little reason
        </p>

        {/* Ornament */}
        <div
          ref={ornamentRef}
          className="flex items-center justify-center gap-3 opacity-0"
          style={{ marginBottom: "clamp(1.5rem, 3.5vw, 2.5rem)" }}
        >
          <span style={{ color: "var(--color-accent)", fontSize: "clamp(0.8rem, 1.4vw, 1.1rem)" }}>✦</span>
          <div className="h-px" style={{
            width: "clamp(40px, 8vw, 80px)",
            background: "var(--color-accent)",
          }} />
          <span style={{ color: "var(--color-accent)", fontSize: "clamp(0.8rem, 1.4vw, 1.1rem)" }}>✦</span>
        </div>

        {/* ── Statement — three typed act spans ── */}
        <h2
          className="text-center"
          style={{
            fontSize: "clamp(1.7rem, 5.2vw, 7rem)",
            lineHeight: 1.35,
            minHeight: "4.8em",   // prevent layout shift while typing
          }}
        >
          {/* Act 0 — serif italic, base colour */}
          <span
            ref={act0Ref}
            className="font-serif italic"
            style={{ color: "var(--color-foreground)" }}
          />

          {/* Act 1 — script, accent-dark, slightly larger */}
          <span
            ref={act1Ref}
            className="font-script"
            style={{
              color: "var(--color-accent-dark)",
              fontSize: "1.2em",
              lineHeight: 1,
            }}
          />

          {/* Act 2 — serif italic, base colour */}
          <span
            ref={act2Ref}
            className="font-serif italic"
            style={{ color: "var(--color-foreground)" }}
          />

          {/* Blinking cursor — GSAP fades it out when typing completes */}
          <span
            ref={cursorRef}
            style={{
              display:       "inline-block",
              width:         "2px",
              height:        "0.82em",
              background:    "var(--color-accent-dark)",
              marginLeft:    "3px",
              verticalAlign: "middle",
              borderRadius:  "1px",
              opacity:       0,   // GSAP's cursorBlink.play() will make it visible
            }}
          />
        </h2>

        {/* Closing attribution */}
        <p
          ref={closerRef}
          className="font-sans uppercase opacity-0"
          style={{
            color: "var(--color-muted-warm)",
            fontSize: "clamp(0.55rem, 1.1vw, 0.7rem)",
            letterSpacing: "0.3em",
            marginTop: "clamp(1.5rem, 3.5vw, 2.5rem)",
          }}
        >
          — for you, always
        </p>
      </div>

      {/* ── Bottom decorative rule ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(to right, transparent, var(--color-accent), transparent)",
      }} />
    </div>
  );
}