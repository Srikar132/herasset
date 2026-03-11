"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useCountdown } from "@/hooks/useCountDown";
import FloatingElements from "@/components/FloatingElements";
import CountdownSection from "@/components/CountDownSection";
import Image from "next/image";


export default function Home() {
  const { timeLeft, isBirthday } = useCountdown();
  const [showBirthday, setShowBirthday] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const countdownRef = useRef<HTMLDivElement>(null);
  const birthdayRef  = useRef<HTMLDivElement>(null);
  const prevBirthday = useRef(false);

  // On mount: check immediately if it's already birthday
  useEffect(() => {
    if (isBirthday && !prevBirthday.current) {
      setShowBirthday(true);
      prevBirthday.current = true;
    }
  }, [isBirthday]);

  // When birthday flips mid-session: crossfade
  useEffect(() => {
    if (isBirthday && !prevBirthday.current && countdownRef.current && birthdayRef.current) {
      prevBirthday.current = true;
      setTransitioning(true);

      gsap.to(countdownRef.current, {
        opacity: 0,
        y: -20,
        duration: 1.2,
        ease: "power3.in",
        onComplete: () => {
          setShowBirthday(true);
          setTransitioning(false);
        },
      });
    }
  }, [isBirthday]);

  return (
    <main
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "var(--color-background)" }}
    >
      {/* Vignette */}
      <div className="vignette" />


      {/* Ambient floating petals & butterflies */}
      <FloatingElements />

      {/* Countdown */}
      {!showBirthday && (
        <div ref={countdownRef} style={{ opacity: transitioning ? 1 : 1 }}>
          <CountdownSection timeLeft={timeLeft} />
        </div>
      )}

      {/* Birthday */}
      {showBirthday && (
        <div ref={birthdayRef}>
          {/* <WishingSection /> */}
        </div>
      )}
    </main>
  );
}