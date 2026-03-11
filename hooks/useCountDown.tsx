"use client";

import { useState, useEffect, useCallback } from "react";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// March 13, 2026 00:00:00 local time
const BIRTHDAY = new Date("2026-03-13T00:00:00");

function calcTimeLeft(): { timeLeft: TimeLeft; isBirthday: boolean } {
  const now = new Date();
  const diff = BIRTHDAY.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      isBirthday: true,
    };
  }

  return {
    timeLeft: {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
    },
    isBirthday: false,
  };
}

export function useCountdown() {
  const [state, setState] = useState<{ timeLeft: TimeLeft; isBirthday: boolean }>({
    timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    isBirthday: false,
  });

  const tick = useCallback(() => setState(calcTimeLeft()), []);

  useEffect(() => {
    tick(); // immediate
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  return state;
}