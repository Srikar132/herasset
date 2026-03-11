import { useEffect, useRef, useCallback } from "react";

interface Options {
  src: string;
  volume?: number;
  loop?: boolean;
}

/**
 * useBgSound — autoplay-safe background audio hook.
 *
 * Strategy:
 * 1. Create & preload the Audio element immediately.
 * 2. Register a ONE-TIME capture-phase listener on `pointerdown` + `keydown`
 *    at the document root — these are the only events browsers accept as
 *    genuine user gestures for autoplay.
 * 3. The `play()` callback you call from GSAP's onStart is stored in a ref
 *    so it can be invoked from either path (gesture OR explicit call).
 * 4. On iOS Safari: we also call audio.load() inside the gesture handler
 *    before play() — iOS requires a synchronous load() inside a gesture.
 */
export function useBgSound({ src, volume = 0.35, loop = true }: Options) {
  const audioRef      = useRef<HTMLAudioElement | null>(null);
  const unlockedRef   = useRef(false);   // have we successfully started?
  const pendingRef    = useRef(false);   // did play() get called before unlock?

  // The actual play attempt — call this from gesture OR from GSAP onStart
  const attemptPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || unlockedRef.current) return;

    // iOS Safari needs synchronous load() inside a gesture context
    audio.load();

    audio
      .play()
      .then(() => {
        unlockedRef.current = true;
        pendingRef.current  = false;
      })
      .catch(() => {
        // Still blocked — mark as pending so the gesture listener retries
        pendingRef.current = true;
      });
  }, []);

  useEffect(() => {
    // 1. Build the audio element
    const audio       = new Audio(src);
    audio.volume      = Math.min(1, Math.max(0, volume));
    audio.loop        = loop;
    audio.preload     = "auto";
    audioRef.current  = audio;

    // 2. Try immediate play (works on desktop after a prior interaction,
    //    or if the browser's autoplay policy is permissive)
    audio.play()
      .then(() => { unlockedRef.current = true; })
      .catch(() => {
        // Blocked — set up gesture listeners
        pendingRef.current = true;
      });

    // 3. Capture-phase listeners — fire BEFORE any React synthetic events,
    //    which guarantees we're still inside the trusted gesture context.
    const onGesture = () => {
      if (unlockedRef.current) {
        cleanup();
        return;
      }
      if (pendingRef.current) {
        // iOS: load() must be called synchronously in the gesture
        audio.load();
        audio.play()
          .then(() => {
            unlockedRef.current = true;
            pendingRef.current  = false;
            cleanup();
          })
          .catch(() => {
            // Some browsers still block — leave listeners active for next gesture
          });
      }
    };

    const cleanup = () => {
      document.removeEventListener("pointerdown", onGesture, true);
      document.removeEventListener("keydown",     onGesture, true);
    };

    // Use capture: true so this fires before React's bubbling handlers
    document.addEventListener("pointerdown", onGesture, { capture: true });
    document.addEventListener("keydown",     onGesture, { capture: true });

    return () => {
      cleanup();
      audio.pause();
      audio.src = "";
      audioRef.current    = null;
      unlockedRef.current = false;
      pendingRef.current  = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Call this from GSAP's onStart (or any click handler).
   * If the audio is already playing, this is a no-op.
   * If it's pending (blocked), it retries — this call itself counts as a
   * gesture context if it originates from a user interaction chain.
   */
  const play = useCallback(() => {
    attemptPlay();
  }, [attemptPlay]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const setVolume = useCallback((v: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(1, Math.max(0, v));
    }
  }, []);

  return { play, pause, setVolume };
}