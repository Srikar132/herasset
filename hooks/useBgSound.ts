import { useEffect, useRef, useCallback } from "react";

interface Options {
  src: string;
  /** 0–1, default 0.35 — kept low so it never competes with the UI */
  volume?: number;
  loop?: boolean;
}

export function useBgSound({ src, volume = 0.35, loop = true }: Options) {
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const resumeRef  = useRef<(() => void) | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.volume  = volume;
    audio.loop    = loop;
    audio.preload = "auto";
    audioRef.current = audio;

    // Single named resume handler — registered once, removed once.
    const resume = () => {
      audio.play().catch(() => {});
      document.removeEventListener("pointerdown", resume);
      document.removeEventListener("visibilitychange", resume);
    };
    resumeRef.current = resume;

    // Try immediate play first
    audio.play().catch(() => {
      // Blocked by autoplay policy — wait for any user interaction
      document.addEventListener("pointerdown",      resume);
      document.addEventListener("visibilitychange", resume);
    });

    return () => {
      // Clean up listeners in case they're still pending
      document.removeEventListener("pointerdown",      resume);
      document.removeEventListener("visibilitychange", resume);
      audio.pause();
      audio.src = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Call this from a known user-gesture context (e.g. GSAP onStart after
   *  first click, or a mute-button toggle) to guarantee playback starts. */
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // Remove pending resume listeners — we're starting manually
    if (resumeRef.current) {
      document.removeEventListener("pointerdown",      resumeRef.current);
      document.removeEventListener("visibilitychange", resumeRef.current);
      resumeRef.current = null;
    }
    audio.play().catch(() => {});
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const setVolume = useCallback((v: number) => {
    if (audioRef.current) audioRef.current.volume = Math.min(1, Math.max(0, v));
  }, []);

  return { play, pause, setVolume };
}
