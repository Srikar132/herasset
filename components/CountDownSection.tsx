"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import Image from "next/image";
import CornerDecor from "./CornerDecor";
import DigitUnit from "./DigitUnit";
import { TimeLeft } from "@/hooks/useCountDown";
import { useBgSound } from "@/hooks/useBgSound";

gsap.registerPlugin(TextPlugin);

interface Props {
  timeLeft: TimeLeft;
}

/* Dot separator between digit units */
function Separator() {
  return (
    <div
      className="self-center pb-4 font-serif"
      style={{
        fontSize: "clamp(1.2rem, 3.5vw, 3rem)",
        color: "var(--color-accent)",
        fontWeight: 300,
        fontStyle: "italic",
        opacity: 0.5,
        lineHeight: 1,
      }}
    >
      ·
    </div>
  );
}

export default function CountdownSection({ timeLeft }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const titleRef      = useRef<HTMLHeadingElement>(null);
  const cornerTRRef   = useRef<HTMLDivElement>(null);
  const cornerBLRef   = useRef<HTMLDivElement>(null);
  const gifRef        = useRef<HTMLDivElement>(null);
  const gifImageRef   = useRef<HTMLImageElement>(null);
  const butterflyRef  = useRef<HTMLDivElement>(null);

  // Background ambient sound — plays while this section is mounted,
  // pauses automatically when the component unmounts (birthday crossfade).
  const { play: playBg } = useBgSound({ src: "/countdown-bgsound.mp3", volume: 0.35, loop: true });

  // Preload audio once — reuse the same instance on every click
  const catAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const audio = new Audio("/cat-sound.mp3");
    audio.preload = "auto";
    catAudioRef.current = audio;
    return () => { audio.src = ""; };
  }, []);

  const handleGifClick = () => {
    // — Sound —
    const audio = catAudioRef.current;
    if (audio) {
      audio.currentTime = 0;   // allow rapid re-clicks
      audio.play().catch(() => {
        // Autoplay policy blocked — silently ignore
      });
    }

    // — Haptic (mobile) —
    navigator?.vibrate?.(120);

    // — Bounce animation on the image element —
    if (gifImageRef.current) {
      gsap.fromTo(
        gifImageRef.current,
        { scale: 1 },
        {
          keyframes: [
            { scale: 1.35, duration: 0.15, ease: "power2.out" },
            { scale: 0.88, duration: 0.12, ease: "power2.in"  },
            { scale: 1.18, duration: 0.1,  ease: "power2.out" },
            { scale: 1,    duration: 0.15, ease: "back.out(3)" },
          ],
          overwrite: "auto",
        }
      );
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        // Reveal the container atomically the instant GSAP takes control —
        // prevents the React-paint → useEffect delay flash (FOUC).
        onStart: () => {
          if (containerRef.current) {
            containerRef.current.style.visibility = "visible";
          }
          // Start bg sound here — GSAP firing counts as a post-gesture
          // context in all browsers, so autoplay policy is satisfied.
          playBg();
        },
      });

      // — Main content sequence —
      tl.from(".cd-eyebrow", { scale: 0.7, opacity: 0, duration: 0.9, ease: "back.out(2)" })
        .set(titleRef.current, { opacity: 1 })
        .to(titleRef.current, {
            duration: 1.6,
            text: { value: "For Maheswari", delimiter: "" },
            ease: "none",
          }, "-=0.3")
        .from(".cd-dividers", { scale: 0,   opacity: 0, duration: 0.9,  ease: "back.out(2.5)", transformOrigin: "center" }, "-=0.4")
        .from(".cd-digits",   { scale: 0.7, opacity: 0, duration: 1,    ease: "back.out(2)"   }, "-=0.5")
        .from(".cd-note",     { scale: 0.8, opacity: 0, duration: 0.85, ease: "back.out(1.8)" }, "-=0.5")

        // — Decorative elements after main content lands —
        // Corner TR: slide in from top-right
        .fromTo(cornerTRRef.current,
          { x: 80, y: -80, opacity: 0 },
          { x: 0,  y: 0,   opacity: 1, duration: 1.1, ease: "power3.out" },
          "-=0.2"
        )
        // Corner BL: slide in from bottom-left
        .fromTo(cornerBLRef.current,
          { x: -80, y: 80, opacity: 0 },
          { x: 0,   y: 0,  opacity: 1, duration: 1.1, ease: "power3.out" },
          "<"  // same time as corner TR
        )
        // Butterfly: scale up from zero
        .fromTo(butterflyRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(2.5)" },
          "-=0.5"
        )
        // GIF: slide up from bottom
        .fromTo(gifRef.current,
          { y: 40, opacity: 0 },
          { y: 0,  opacity: 1, duration: 0.85, ease: "back.out(2)" },
          "-=0.5"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-10 flex h-screen overflow-hidden flex-col items-center justify-center w-full px-4 sm:px-6 text-center select-none"
      style={{ visibility: "hidden" }}
    >

      <CornerDecor ref={cornerTRRef} corner="top-right" initialOpacity={0} />

      <CornerDecor ref={cornerBLRef} corner="bottom-left" initialOpacity={0} />

      {/* Gift — bottom right corner */}
      <div
        ref={gifRef}
        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 cursor-pointer"
        style={{ zIndex: 4, opacity: 0 }}
        onClick={handleGifClick}
        role="button"
        aria-label="Play surprise"
      >
        <Image
          ref={gifImageRef}
          src="/dudu-cute.gif"
          alt="gift"
          width={150}
          height={150}
          unoptimized
          priority
        />
      </div>

      {/* Butterfly — top left */}
      <div
        ref={butterflyRef}
        className="fixed top-2 left-2 sm:top-4 sm:left-4 pointer-events-none select-none butterfly"
        style={{ zIndex: 3, animationDuration: "2.8s", opacity: 0 }}
      >
        <Image
          src="/butterfly.webp"
          alt="Butterfly"
          width={200}
          height={200}
          className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 object-contain drop-shadow-sm"
          priority
        />
      </div>

      {/* Eyebrow */}
      <p
        className="cd-eyebrow font-sans uppercase tracking-widest mb-6 sm:mb-10"
        style={{
          fontSize: "clamp(0.6rem, 2.2vw, 0.78rem)",
          color: "var(--color-accent-dark)",
          fontWeight: 300,
          letterSpacing: "0.22em",
          opacity: 0.85,
        }}
      >
        something beautiful is coming
      </p>

      {/* Main script title — typed in via TextPlugin */}
      <h1
        ref={titleRef}
        className="cd-title font-script text-foreground leading-tight"
        style={{
          opacity: 0,
          minHeight: "1.2em",
          marginBottom: "0.3em",
          fontSize: "clamp(3.2rem, 14vw, 9rem)",
          letterSpacing: "0.02em",
          textShadow: "0 2px 18px rgba(92,74,58,0.13), 0 1px 0 rgba(92,74,58,0.08)",
        }}
      >
        {/* intentionally empty — GSAP TextPlugin writes the text */}
      </h1>

      {/* Subtitle */}
      <p
        className="cd-eyebrow font-serif mb-8 sm:mb-14"
        style={{
          fontSize: "clamp(0.92rem, 3vw, 1.1rem)",
          fontStyle: "italic",
          fontWeight: 300,
          color: "var(--color-muted)",
          letterSpacing: "0.04em",
        }}
      >
        counting the moments until your day
      </p>

      {/* Divider */}
      <div
        className="cd-dividers mb-6 sm:mb-12"
        style={{
          width: "100%",
          maxWidth: 360,
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--color-accent) 40%, var(--color-accent) 60%, transparent)",
          transformOrigin: "center",
        }}
      />

      {/* Digits — single row, fluid scaling */}
      <div className="cd-digits flex items-start justify-center gap-2 sm:gap-4 md:gap-10 mb-6 sm:mb-12 w-full">
        <DigitUnit value={timeLeft.days} label="Days" />
        <Separator />
        <DigitUnit value={timeLeft.hours} label="Hours" />
        <Separator />
        <DigitUnit value={timeLeft.minutes} label="Minutes" />
        <Separator />
        <DigitUnit value={timeLeft.seconds} label="Seconds" />
      </div>

      {/* Divider */}
      <div
        className="cd-dividers mb-10"
        style={{
          width: "100%",
          maxWidth: 360,
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--color-accent) 40%, var(--color-accent) 60%, transparent)",
          transformOrigin: "center",
        }}
      />

      {/* Note */}
      <p
        className="cd-note font-serif"
        style={{
          fontSize: "clamp(0.88rem, 2vw, 1.05rem)",
          fontStyle: "italic",
          fontWeight: 300,
          color: "var(--color-muted-warm)",
          lineHeight: 1.85,
          maxWidth: 380,
          letterSpacing: "0.02em",
        }}
      >
        Every second that passes<br />
        is one second closer to celebrating you.
      </p>

    </div>
  );
}