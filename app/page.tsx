"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useCountdown } from "@/hooks/useCountDown";
import CountdownSection from "@/components/CountDownSection";
import LandingPage from "@/components/LandingPage";


export default function Home() {
  const { timeLeft, isBirthday } = useCountdown();
  const [showBirthday, setShowBirthday] = useState(false);

  const countdownRef = useRef<HTMLDivElement>(null);
  const birthdayRef = useRef<HTMLDivElement>(null);
  const prevBirthday = useRef(false);

  // On mount: check immediately if it's already birthday
  useEffect(() => {
    if (isBirthday && !prevBirthday.current) {
      setShowBirthday(true);
      prevBirthday.current = true;
    }
  }, [isBirthday]);

  // When birthday flips mid-session: crossfade out countdown, then show birthday view
  useEffect(() => {
    if (isBirthday && !prevBirthday.current && countdownRef.current && birthdayRef.current) {
      prevBirthday.current = true;

      gsap.to(countdownRef.current, {
        opacity: 0,
        scale: 0.0,
        duration: 1.2,
        ease: "power3.in",
        onComplete: () => setShowBirthday(true),
      });
    }
  }, [isBirthday]);

  return (
    <main
      className="relative w-full bg-background"
    >
      {/* Vignette */}
      {/* {!showBirthday && <div className="vignette" />} */}

      {/* Ambient floating petals & butterflies */}
      {/* <FloatingElements /> */}

      {/* Countdown */}
      {!showBirthday && (
        <div ref={countdownRef}>
          <CountdownSection timeLeft={timeLeft} />
        </div>
      )}

      {/* Birthday */}
      {showBirthday && (
        <div ref={birthdayRef}>
          <LandingPage />
        </div>
      )}
    </main>
  );
}