"use client";

import React, { useState, useEffect } from "react";
import PinnedSection from "./PinnedSection";
import MainContent from "./MainContent";
import BirthdayLetter from "./BirthdayLetter";
import ReasonsSection from "./ReasonsSection";
import Memories from "./Memories";
import BigWordsSection from "./BigWordsSection";
import { useBgSound } from "@/hooks/useBgSound";

const AUDIO_SRC = "/countdown-bgsound.mp3";

export default function LandingPage() {
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);

  const { play, pause } = useBgSound({ src: AUDIO_SRC, volume: 0.3, loop: true });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const toggle = () => {
    if (playing) { pause(); setPlaying(false); }
    else         { play();  setPlaying(true);  }
  };

  return (
    <>
      {/* ── 1. Hero — lowest layer ── */}
      <PinnedSection zIndex={1}>
        <MainContent />
      </PinnedSection>

      {/* ── 2. Birthday Letter — scrolls over hero ── */}
      <PinnedSection zIndex={10}>
        <BirthdayLetter />
      </PinnedSection>

      {/* ── 3. Reasons — scrolls over letter ── */}
      <PinnedSection zIndex={20}>
        <ReasonsSection />
      </PinnedSection>

      {/* ── 4. Memories gallery — not pinned ── */}
      <div className="relative" style={{ zIndex: 30 }}>
        <Memories />
      </div>

            {/* ── 5. Big words — final section ── */}
            <div className="relative" style={{ zIndex: 40 }}>
                <BigWordsSection />
            </div>

            {/* ── Floating audio button ── */}
            <AudioButton visible={visible} playing={playing} onToggle={toggle} />

            {/* ── Butterfly cursor follower ── */}
            
        </>
    );
}

/* ─────────────────────────────────────────────────────────────
   AudioButton — fixed bottom-right, matches design system
   ───────────────────────────────────────────────────────────── */
function AudioButton({
    visible,
    playing,
    onToggle,
}: {
    visible: boolean;
    playing: boolean;
    onToggle: () => void;
}) {
    return (
        <button
            onClick={onToggle}
            aria-label={playing ? "Pause music" : "Play music"}
            style={{
                // Positioning
                position: "fixed",
                bottom: "clamp(1.25rem, 4vw, 2rem)",
                right: "clamp(1.25rem, 4vw, 2rem)",
                zIndex: 9999,

                // Size
                width: "clamp(2.75rem, 8vw, 3.25rem)",
                height: "clamp(2.75rem, 8vw, 3.25rem)",
                borderRadius: "50%",

                // Colours — design system vars
                background: "var(--color-background-dark)",
                border: "1.5px solid var(--color-accent)",
                color: "var(--color-foreground)",

                // Layout
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                // Motion
                opacity: visible ? 1 : 0,
                transform: visible ? "scale(1) translateY(0)" : "scale(0.85) translateY(8px)",
                transition: "opacity 0.6s ease, transform 0.6s ease, background 0.2s ease, box-shadow 0.2s ease",

                // Shadow
                boxShadow: "0 4px 20px rgba(100, 80, 48, 0.25)",

                cursor: "pointer",
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--color-accent)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(100,80,48,0.4)";
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--color-background-dark)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(100,80,48,0.25)";
            }}
        >
            {playing ? <PauseIcon /> : <PlayIcon />}

            {/* Ripple ring when playing */}
            {playing && <RippleRing />}
        </button>
    );
}

/* ── SVG icons — thin, on-brand ── */
function PlayIcon() {
    return (
        <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{ marginLeft: "2px" }} // optical centering for play triangle
        >
            <path
                d="M5 3.5L13 8L5 12.5V3.5Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function PauseIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="4" y="3" width="3" height="10" rx="1" fill="currentColor" />
            <rect x="9" y="3" width="3" height="10" rx="1" fill="currentColor" />
        </svg>
    );
}

/* ── Animated ripple ring — shows only while playing ── */
function RippleRing() {
    return (
        <span
            style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "1.5px solid var(--color-accent)",
                opacity: 0,
                animation: "ripple 2s ease-out infinite",
                pointerEvents: "none",
            }}
        >
            {/* Inject keyframe once via a style tag */}
            <style>{`
        @keyframes ripple {
          0%   { transform: scale(1);    opacity: 0.7; }
          100% { transform: scale(1.9);  opacity: 0;   }
        }
      `}</style>
        </span>
    );
}