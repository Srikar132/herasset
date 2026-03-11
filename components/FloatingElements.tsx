"use client";

import { useEffect, useRef } from "react";

interface FloatingItem {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  type: "petal" | "butterfly";
  drift: number;
}

function PetalSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 20 28" fill="none" aria-hidden>
      <ellipse cx="10" cy="14" rx="7" ry="11"
        fill="#c4a882" fillOpacity="0.5"
        stroke="#a08060" strokeWidth="0.4" strokeOpacity="0.4"
        transform="rotate(-10 10 14)" />
      <line x1="10" y1="4" x2="10" y2="24" stroke="#a08060" strokeWidth="0.4" strokeOpacity="0.3" />
    </svg>
  );
}

function ButterflySVG({ size }: { size: number }) {
  return (
    <svg width={size * 1.6} height={size} viewBox="0 0 48 30" fill="none" aria-hidden
      className="butterfly" style={{ animationDuration: `${1.2 + Math.random() * 0.8}s` }}>
      {/* Right wings */}
      <ellipse cx="28" cy="12" rx="16" ry="10" fill="#c8b8a0" fillOpacity="0.5"
        stroke="#907060" strokeWidth="0.6" />
      <ellipse cx="30" cy="22" rx="12" ry="6"  fill="#c0ae98" fillOpacity="0.4"
        stroke="#907060" strokeWidth="0.5" />
      {/* Left wings */}
      <ellipse cx="20" cy="12" rx="16" ry="10" fill="#c8b8a0" fillOpacity="0.5"
        stroke="#907060" strokeWidth="0.6" />
      <ellipse cx="18" cy="22" rx="12" ry="6"  fill="#c0ae98" fillOpacity="0.4"
        stroke="#907060" strokeWidth="0.5" />
      {/* Body */}
      <ellipse cx="24" cy="15" rx="2.5" ry="8" fill="#907060" fillOpacity="0.6" />
      {/* Antennae */}
      <line x1="23" y1="7" x2="18" y2="1" stroke="#907060" strokeWidth="0.7" strokeOpacity="0.5" />
      <line x1="25" y1="7" x2="30" y2="1" stroke="#907060" strokeWidth="0.7" strokeOpacity="0.5" />
      <circle cx="18" cy="1" r="1" fill="#907060" fillOpacity="0.5" />
      <circle cx="30" cy="1" r="1" fill="#907060" fillOpacity="0.5" />
    </svg>
  );
}

let idCounter = 0;

export default function FloatingElements() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function spawnItem() {
      if (!container) return;
      idCounter++;

      const isPetal = Math.random() > 0.38;
      const size = isPetal ? 12 + Math.random() * 10 : 18 + Math.random() * 14;
      const x = Math.random() * 96;
      const duration = isPetal ? 12 + Math.random() * 10 : 15 + Math.random() * 12;
      const drift = (Math.random() - 0.5) * 60;

      const el = document.createElement("div");
      el.style.cssText = `
        position: absolute;
        left: ${x}vw;
        top: -60px;
        pointer-events: none;
        will-change: transform, opacity;
        animation: petalDrift ${duration}s linear forwards;
      `;

      // Create SVG string inline
      if (isPetal) {
        el.innerHTML = `<svg width="${size}" height="${size * 1.4}" viewBox="0 0 20 28" fill="none">
          <ellipse cx="10" cy="14" rx="7" ry="11" fill="#c4a882" fill-opacity="0.5"
            stroke="#a08060" stroke-width="0.4" stroke-opacity="0.4"
            transform="rotate(-10 10 14)" />
          <line x1="10" y1="4" x2="10" y2="24" stroke="#a08060" stroke-width="0.4" stroke-opacity="0.3" />
        </svg>`;
      } else {
        el.innerHTML = `<svg width="${size * 1.6}" height="${size}" viewBox="0 0 48 30" fill="none"
          style="animation: flutter ${1.0 + Math.random() * 0.8}s ease-in-out infinite">
          <ellipse cx="28" cy="12" rx="16" ry="10" fill="#c8b8a0" fill-opacity="0.45"
            stroke="#907060" stroke-width="0.6" />
          <ellipse cx="30" cy="22" rx="12" ry="6"  fill="#c0ae98" fill-opacity="0.35"
            stroke="#907060" stroke-width="0.5" />
          <ellipse cx="20" cy="12" rx="16" ry="10" fill="#c8b8a0" fill-opacity="0.45"
            stroke="#907060" stroke-width="0.6" />
          <ellipse cx="18" cy="22" rx="12" ry="6"  fill="#c0ae98" fill-opacity="0.35"
            stroke="#907060" stroke-width="0.5" />
          <ellipse cx="24" cy="15" rx="2.5" ry="8" fill="#907060" fill-opacity="0.55" />
          <line x1="23" y1="7" x2="18" y2="1" stroke="#907060" stroke-width="0.7" stroke-opacity="0.5" />
          <line x1="25" y1="7" x2="30" y2="1" stroke="#907060" stroke-width="0.7" stroke-opacity="0.5" />
          <circle cx="18" cy="1" r="1" fill="#907060" fill-opacity="0.5" />
          <circle cx="30" cy="1" r="1" fill="#907060" fill-opacity="0.5" />
        </svg>`;
      }

      container.appendChild(el);
      setTimeout(() => el.remove(), (duration + 1) * 1000);
    }

    // Initial spawn
    for (let i = 0; i < 6; i++) {
      setTimeout(spawnItem, i * 1200);
    }

    const interval = setInterval(spawnItem, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 2 }}
      aria-hidden
    />
  );
}