import { useEffect, useRef, useCallback } from "react";

interface Options {
  src: string;
  volume?: number;
  loop?: boolean;
}

/**
 * useBgSound — background audio hook.
 *
 * ✅ Autoplays as soon as the browser allows.
 * ✅ If browser blocks autoplay, retries on first user gesture.
 * ✅ play() / pause() toggle works at any point afterwards.
 */
export function useBgSound({ src, volume = 0.35, loop = true }: Options) {
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const wantsPlay   = useRef(true);  // true = we WANT audio playing (autoplay intent)

  useEffect(() => {
    const audio  = new Audio(src);
    audio.volume = Math.min(1, Math.max(0, volume));
    audio.loop   = loop;
    audio.preload = "auto";
    audioRef.current = audio;

    /* ── 1. Try autoplay immediately ── */
    audio.play()
      .then(() => {
        // Autoplay succeeded — great, clean up gesture listeners
        cleanup();
      })
      .catch(() => {
        // Blocked by browser — we'll retry on first gesture
      });

    /* ── 2. Gesture-based unlock (for browsers that block autoplay) ── */
    const onGesture = () => {
      if (!wantsPlay.current) {
        // User paused before gesture — don't force audio on them.
        // But still unlock the context silently.
        audio.load();
        audio.play()
          .then(() => { audio.pause(); cleanup(); })
          .catch(() => {});
        return;
      }

      // User still wants audio playing → start it for real
      audio.load();
      audio.play()
        .then(() => { cleanup(); })
        .catch(() => { /* still blocked, keep listeners for next gesture */ });
    };

    const cleanup = () => {
      document.removeEventListener("pointerdown", onGesture, true);
      document.removeEventListener("keydown",     onGesture, true);
    };

    document.addEventListener("pointerdown", onGesture, { capture: true });
    document.addEventListener("keydown",     onGesture, { capture: true });

    return () => {
      cleanup();
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = useCallback(() => {
    wantsPlay.current = true;
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => { /* blocked — gesture listener will handle */ });
  }, []);

  const pause = useCallback(() => {
    wantsPlay.current = false;
    audioRef.current?.pause();
  }, []);

  const setVolume = useCallback((v: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(1, Math.max(0, v));
    }
  }, []);

  return { play, pause, setVolume };
}