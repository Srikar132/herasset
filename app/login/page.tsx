"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

/* ─── Petal field data ─── */
const PETALS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: 3 + (i * 4.1) % 94,
  y: 5 + (i * 7.3) % 88,
  size: 10 + (i * 2.9) % 20,
  rotate: (i * 41) % 360,
  op: 0.22 + (i * 0.025) % 0.42,
}));

const BUTTERFLIES = [
  { x: 8,  y: 14, size: 115, rot: -14, flutter: "2.8s" },
  { x: 76, y: 10, size: 95,  rot: 9,   flutter: "3.1s" },
  { x: 4,  y: 60, size: 105, rot: 6,   flutter: "2.5s" },
  { x: 80, y: 65, size: 88,  rot: -9,  flutter: "3.3s" },
  { x: 44, y: 6,  size: 78,  rot: 16,  flutter: "2.7s" },
];

const HINTS = [
  "whisper the secret word...",
  "only she knows this 🌸",
  "what did we share?",
  "the magic word, love...",
  "it's our little secret...",
];

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [hintIdx, setHintIdx]     = useState(0);
  const [focused, setFocused]     = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const rootRef        = useRef<HTMLDivElement>(null);
  const veilRef        = useRef<HTMLDivElement>(null);
  const titleRef       = useRef<HTMLDivElement>(null);
  const inputAreaRef   = useRef<HTMLDivElement>(null);
  const gateLRef       = useRef<HTMLDivElement>(null);
  const gateRRef       = useRef<HTMLDivElement>(null);
  const gateGlowRef    = useRef<HTMLDivElement>(null);
  const butterfliesRef = useRef<(HTMLDivElement | null)[]>([]);
  const bloomsRef      = useRef<(HTMLDivElement | null)[]>([]);
  const inputRef       = useRef<HTMLInputElement>(null);
  const teddyRef       = useRef<HTMLDivElement>(null);

  /* ──── ENTRANCE ──── */
  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onStart: () => { if (rootRef.current) rootRef.current.style.visibility = "visible"; },
      });

      tl.fromTo(veilRef.current,      { opacity: 0 }, { opacity: 1, duration: 1.8, ease: "power2.inOut" })
        .fromTo(".l-petal",            { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(2)", stagger: { each: 0.055, from: "random" } }, "-=1.3")
        .fromTo(".l-bf",               { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.85, ease: "back.out(2.5)", stagger: 0.13 }, "-=0.7")
        .fromTo(gateLRef.current,      { x: -70, opacity: 0 }, { x: 0, opacity: 1, duration: 1.1, ease: "power3.out" }, "-=0.5")
        .fromTo(gateRRef.current,      { x: 70,  opacity: 0 }, { x: 0, opacity: 1, duration: 1.1, ease: "power3.out" }, "<")
        .fromTo(titleRef.current,      { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: "power3.out" }, "-=0.7")
        .fromTo(inputAreaRef.current,  { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.5")
        .fromTo(teddyRef.current,      { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: "back.out(2)" }, "-=0.5");

      // Perpetual butterfly float
      butterfliesRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, { y: -12 - i * 2, rotate: `+=${5 + i * 2}`, duration: 2.8 + i * 0.45,
          ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * 0.5 + 2 });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* ──── HINT cycle ──── */
  useEffect(() => {
    if (!focused) return;
    const id = setInterval(() => setHintIdx(p => (p + 1) % HINTS.length), 2800);
    return () => clearInterval(id);
  }, [focused]);

  /* ──── BLOOM per keypress ──── */
  const triggerBloom = useCallback((len: number) => {
    const el = bloomsRef.current[len % 8];
    if (!el) return;
    gsap.fromTo(el, { scale: 0, opacity: 0.95, y: 0 },
      { scale: 2.2, opacity: 0, y: -36, duration: 0.75, ease: "power2.out" });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v.length > password.length) triggerBloom(v.length);
    setPassword(v);
    setError("");
  };

  /* ──── SUCCESS ──── */
  const playSuccess = useCallback(() => {
    setSucceeded(true);
    const tl = gsap.timeline({ onComplete: () => router.push("/") });
    tl.to(gateLRef.current,  { rotateY: -85, x: -50, opacity: 0, duration: 0.95, ease: "power3.inOut" })
      .to(gateRRef.current,  { rotateY: 85,  x: 50,  opacity: 0, duration: 0.95, ease: "power3.inOut" }, "<")
      .to(gateGlowRef.current, { opacity: 1, scale: 1.4, duration: 0.55, ease: "power2.out" }, "-=0.45")
      .to(".l-petal", { y: "115vh", rotate: "+=400", opacity: 0, duration: 1.6,
          stagger: { each: 0.04, from: "random" }, ease: "power2.in" }, "-=0.3")
      .to(".l-bf", { y: -220, opacity: 0, scale: 1.4, duration: 1.1, stagger: 0.09, ease: "power2.in" }, "<")
      .to(veilRef.current,  { opacity: 0, duration: 1.2, ease: "power2.inOut" }, "-=0.5")
      .to(rootRef.current,  { opacity: 0, duration: 0.5, ease: "power2.in" }, "-=0.2");
  }, [router]);

  /* ──── FAIL ──── */
  const playFail = useCallback(() => {
    // Butterflies scatter in panic
    butterfliesRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        x: (i % 2 === 0 ? -45 : 45), y: -18, rotate: (i % 2 === 0 ? -35 : 35), scale: 1.25,
        duration: 0.32, ease: "power3.out", yoyo: true, repeat: 1,
        onComplete: () => {gsap.to(el, { x: 0, y: 0, rotate: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.45)" })},
      });
    });
    // Gate rattles
    gsap.to([gateLRef.current, gateRRef.current], {
      keyframes: [{ x: -5, dur: 0.07 }, { x: 5, dur: 0.07 }, { x: -4, dur: 0.06 }, { x: 4, dur: 0.06 }, { x: 0, dur: 0.06 }],
    });
    // Input shakes
    if (inputRef.current) {
      gsap.fromTo(inputRef.current, { x: 0 }, {
        keyframes: [{ x: -13 }, { x: 13 }, { x: -9 }, { x: 9 }, { x: 0 }],
        duration: 0.38, ease: "power2.inOut",
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || loading || succeeded) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        playSuccess();
      } else {
        setLoading(false);
        const msgs = [
          "The butterflies don't recognise you 🦋",
          "Nope! That's not the secret word 🌸",
          "The gate stays shut, try again!",
          "Hmm... wrong spell, love 🌿",
        ];
        setError(msgs[Math.floor(Math.random() * msgs.length)]);
        playFail();
        setPassword("");
      }
    } catch {
      setLoading(false);
      setError("Something bloomed wrong. Try again 🌸");
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative w-full h-screen overflow-hidden select-none"
      style={{ background: "var(--color-background)", visibility: "hidden" }}
    >

      {/* ── Warm radial glow ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 65% at 50% 52%, rgba(196,168,130,0.22) 0%, transparent 70%)",
      }} />
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
        height: "38%",
        background: "linear-gradient(to top, rgba(110,90,48,0.09) 0%, transparent 100%)",
      }} />

      {/* ── Parchment veil ── */}
      <div ref={veilRef} className="absolute inset-0 pointer-events-none" style={{
        opacity: 0,
        background: "radial-gradient(ellipse 85% 85% at 50% 50%, rgba(237,228,208,0.5) 0%, rgba(237,228,208,0.78) 70%, rgba(237,228,208,0.92) 100%)",
      }} />

      {/* ── Petals ── */}
      {PETALS.map((p) => (
        <div
          key={p.id}
          className="l-petal absolute pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size * 1.55,
            transform: `rotate(${p.rotate}deg)`, opacity: 0 }}
        >
          <svg viewBox="0 0 20 31" fill="none" style={{ width: "100%", height: "100%" }}>
            <ellipse cx="10" cy="15.5" rx="7.5" ry="13.5"
              fill="var(--color-accent)" fillOpacity={p.op + 0.1}
              stroke="var(--color-accent-dark)" strokeWidth="0.4" strokeOpacity="0.3" />
            <line x1="10" y1="2" x2="10" y2="29" stroke="var(--color-accent-dark)" strokeWidth="0.4" strokeOpacity="0.2" />
            <line x1="10" y1="9"  x2="4"  y2="13" stroke="var(--color-accent-dark)" strokeWidth="0.3" strokeOpacity="0.15" />
            <line x1="10" y1="15" x2="3"  y2="17" stroke="var(--color-accent-dark)" strokeWidth="0.3" strokeOpacity="0.15" />
            <line x1="10" y1="9"  x2="16" y2="13" stroke="var(--color-accent-dark)" strokeWidth="0.3" strokeOpacity="0.15" />
            <line x1="10" y1="15" x2="17" y2="17" stroke="var(--color-accent-dark)" strokeWidth="0.3" strokeOpacity="0.15" />
          </svg>
        </div>
      ))}

      {/* ── Butterflies ── */}
      {BUTTERFLIES.map((b, i) => (
        <div
          key={i}
          ref={(el) => { butterfliesRef.current[i] = el; }}
          className="l-bf absolute pointer-events-none butterfly"
          style={{
            left: `${b.x}%`, top: `${b.y}%`,
            width: b.size, height: b.size,
            transform: `rotate(${b.rot}deg)`,
            animationDuration: b.flutter,
            animationDelay: `${i * 0.22}s`,
            opacity: 0, zIndex: 4,
          }}
        >
          <img src="/butterfly.webp" alt="" style={{
            width: "100%", height: "100%", objectFit: "contain",
            filter: "drop-shadow(0 2px 8px rgba(92,74,58,0.18))",
          }} />
        </div>
      ))}

      {/* ── Corner flower decorations ── */}
      {[
        { cls: "-rotate-90 opacity-100", pos: "top-0 left-0" },
        { cls: "rotate-90 opacity-100",  pos: "bottom-0 right-0" },
        { cls: "opacity-60",             pos: "top-0 right-0" },
        { cls: "rotate-180 opacity-60",  pos: "bottom-0 left-0" },
      ].map((c, i) => (
        <div key={i} className={`absolute ${c.pos} pointer-events-none`} style={{ zIndex: 5 }}>
          <img src="/corner-top-right.png" alt=""
            className={`${c.cls} w-52 h-52 md:w-72 md:h-72 lg:w-96 lg:h-96`} />
        </div>
      ))}

      {/* ── Gate glow (success) ── */}
      <div ref={gateGlowRef} className="absolute pointer-events-none" style={{
        left: "50%", top: "50%", transform: "translate(-50%, -50%)",
        width: "clamp(140px, 32vw, 300px)", height: "clamp(160px, 44vh, 360px)",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(196,168,130,0.75) 0%, transparent 70%)",
        opacity: 0, zIndex: 6, filter: "blur(24px)",
      }} />

      {/* ── Gate halves ── */}
      <div ref={gateLRef} className="absolute" style={{
        right: "calc(50% + clamp(22px, 3.5vw, 40px))",
        bottom: "clamp(14%, 20vh, 26%)",
        width: "clamp(50px, 7.5vw, 96px)",
        opacity: 0, zIndex: 7, perspective: "500px",
      }}>
        <GateHalf flip={false} />
      </div>
      <div ref={gateRRef} className="absolute" style={{
        left: "calc(50% + clamp(22px, 3.5vw, 40px))",
        bottom: "clamp(14%, 20vh, 26%)",
        width: "clamp(50px, 7.5vw, 96px)",
        opacity: 0, zIndex: 7, perspective: "500px",
      }}>
        <GateHalf flip={true} />
      </div>

      {/* ── Main content ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 10 }}>

        {/* Title */}
        <div ref={titleRef} className="flex flex-col items-center text-center"
          style={{ opacity: 0, marginBottom: "clamp(1.8rem, 5.5vh, 3.5rem)" }}>
          <p className="font-sans uppercase" style={{
            color: "var(--color-accent-dark)", fontSize: "clamp(0.52rem, 1.1vw, 0.7rem)",
            letterSpacing: "0.38em", fontWeight: 300, marginBottom: "0.6rem", opacity: 0.8,
          }}>
            a private garden
          </p>
          <div className="flex items-center gap-3 mb-3" style={{ opacity: 0.65 }}>
            <div className="h-px" style={{ width: "clamp(28px, 5.5vw, 56px)", background: "linear-gradient(90deg,transparent,var(--color-accent))" }} />
            <span style={{ color: "var(--color-accent)", fontSize: "0.9rem" }}>✦</span>
            <div className="h-px" style={{ width: "clamp(28px, 5.5vw, 56px)", background: "linear-gradient(90deg,var(--color-accent),transparent)" }} />
          </div>
          <h1 className="font-script text-foreground leading-none" style={{
            fontSize: "clamp(3.2rem, 13vw, 9rem)",
            textShadow: "0 3px 28px rgba(92,74,58,0.14)",
            letterSpacing: "0.02em",
          }}>
            For Maheswari
          </h1>
          <p className="font-serif italic" style={{
            color: "var(--color-muted)", fontSize: "clamp(0.78rem, 1.8vw, 1rem)",
            fontWeight: 300, marginTop: "0.45rem", letterSpacing: "0.04em",
          }}>
            the gate opens only for you
          </p>
        </div>

        {/* Input area */}
        <div ref={inputAreaRef} className="flex flex-col items-center"
          style={{ opacity: 0, width: "100%", maxWidth: "min(370px, 86vw)" }}>
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">

            <div className="relative w-full flex flex-col items-center">

              {/* Cycling hint */}
              <p className="font-serif italic text-center mb-3 transition-all duration-700" style={{
                color: "var(--color-muted-warm)", fontSize: "clamp(0.7rem, 1.6vw, 0.86rem)",
                opacity: focused ? 0.9 : 0.55, letterSpacing: "0.02em",
                transition: "opacity 0.5s ease",
              }}>
                {HINTS[hintIdx]}
              </p>

              {/* "Handwritten line" input */}
              <div className="relative w-full">
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={handleChange}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  autoComplete="current-password"
                  disabled={loading || succeeded}
                  className="w-full text-center font-serif italic"
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: `1.5px solid ${error ? "rgba(158,68,48,0.6)" : focused ? "var(--color-accent-dark)" : "rgba(196,168,130,0.5)"}`,
                    outline: "none",
                    fontSize: "clamp(1.15rem, 3.2vw, 1.6rem)",
                    color: "var(--color-foreground)",
                    paddingBottom: "0.45rem",
                    letterSpacing: "0.1em",
                    transition: "border-color 0.4s ease",
                    caretColor: "var(--color-accent-dark)",
                  }}
                />

                {/* Focus shimmer underline */}
                <div className="absolute bottom-0 left-1/2 h-px" style={{
                  width: focused ? "100%" : "0%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
                  filter: "blur(1px)",
                  opacity: 0.65,
                  transition: "width 0.5s ease",
                }} />

                {/* Bloom burst dots */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} ref={(el) => { bloomsRef.current[i] = el; }}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${10 + i * 11}%`, bottom: "0.6rem",
                      width: 22, height: 22, opacity: 0,
                      transform: "translate(-50%,-50%)",
                    }}
                  >
                    <svg viewBox="0 0 28 28" fill="none" style={{ width: "100%", height: "100%" }}>
                      <circle cx="14" cy="14" r="11" fill="var(--color-accent)" fillOpacity="0.5" />
                      <circle cx="14" cy="14" r="5"  fill="var(--color-accent-dark)" fillOpacity="0.45" />
                    </svg>
                  </div>
                ))}
              </div>

              {/* Character flower dots */}
              <div className="flex items-center gap-1.5 mt-3" style={{ minHeight: 10 }}>
                {Array.from({ length: Math.min(password.length, 14) }).map((_, i) => (
                  <div key={i} style={{
                    width: 7, height: 7,
                    borderRadius: "50%",
                    background: `rgba(110,90,48,${0.35 + (i / Math.max(password.length, 1)) * 0.55})`,
                    transform: `scale(${0.75 + (i / Math.max(password.length, 1)) * 0.45})`,
                    transition: "all 0.2s ease",
                    boxShadow: `0 0 ${3 + i}px rgba(196,168,130,0.4)`,
                  }} />
                ))}
                {password.length > 14 && (
                  <span style={{ color: "var(--color-accent)", fontSize: "0.6rem" }}>+{password.length - 14}</span>
                )}
              </div>
            </div>

            {/* Error — floats as a soft note */}
            {error && (
              <p className="font-serif italic text-center" style={{
                color: "rgba(155,68,46,0.88)",
                fontSize: "clamp(0.7rem, 1.6vw, 0.82rem)",
                letterSpacing: "0.02em",
                animation: "fadeUp 0.4s ease both",
              }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!password || loading || succeeded}
              className="group relative font-sans uppercase"
              style={{
                background: "none", border: "none",
                cursor: password && !loading && !succeeded ? "pointer" : "default",
                color: password && !loading ? "var(--color-accent-dark)" : "var(--color-muted)",
                fontSize: "clamp(0.58rem, 1.3vw, 0.7rem)",
                letterSpacing: "0.30em",
                padding: "0.5rem 0.8rem",
                transition: "color 0.35s ease",
                marginTop: "0.2rem",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <Spinner />
                    opening the gate...
                  </>
                ) : succeeded ? (
                  "the gate is open 🌸"
                ) : (
                  <>
                    open the gate
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </span>
              {/* Hover underline */}
              <span className="absolute bottom-0 left-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                width: "100%",
                background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
              }} />
            </button>
          </form>
        </div>
      </div>

      {/* ── Teddy peeking ── */}
      <div ref={teddyRef} className="absolute pointer-events-none" style={{
        bottom: 0, right: "clamp(1rem, 4vw, 2.5rem)",
        width: "clamp(75px, 11vw, 125px)",
        zIndex: 8, opacity: 0,
      }}>
        <img src="/dudu-cute.gif" alt="" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
      </div>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        input::placeholder { color:var(--color-muted); opacity:0.5; font-style:italic; }
      `}</style>
    </div>
  );
}

function Spinner() {
  return (
    <span style={{
      width: 13, height: 13, borderRadius: "50%",
      border: "1.5px solid rgba(110,90,48,0.3)",
      borderTopColor: "var(--color-accent-dark)",
      display: "inline-block",
      animation: "spin 0.75s linear infinite",
    }} />
  );
}

function GateHalf({ flip }: { flip: boolean }) {
  return (
    <svg
      viewBox="0 0 64 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%", height: "auto",
        transform: flip ? "scaleX(-1)" : undefined,
        filter: "drop-shadow(0 4px 18px rgba(92,74,58,0.22))",
      }}
    >
      {/* Vertical bars */}
      <rect x="4"  y="22" width="8"  height="184" rx="4"   fill="var(--color-accent-dark)" fillOpacity="0.75" />
      <rect x="18" y="30" width="6.5" height="168" rx="3.2" fill="var(--color-accent-dark)" fillOpacity="0.58" />
      <rect x="31" y="26" width="6.5" height="176" rx="3.2" fill="var(--color-accent-dark)" fillOpacity="0.58" />
      <rect x="44" y="22" width="8"  height="184" rx="4"   fill="var(--color-accent-dark)" fillOpacity="0.75" />

      {/* Arch tip tops */}
      <path d="M4  24 Q8  6  12 24"   fill="var(--color-accent)" fillOpacity="0.55" />
      <path d="M18 32 Q21 16 24.5 32" fill="var(--color-accent)" fillOpacity="0.45" />
      <path d="M31 28 Q34 12 37.5 28" fill="var(--color-accent)" fillOpacity="0.45" />
      <path d="M44 24 Q48 6  52 24"   fill="var(--color-accent)" fillOpacity="0.55" />

      {/* Cross bars */}
      <rect x="2" y="58"  width="58" height="6" rx="3"   fill="var(--color-accent-dark)" fillOpacity="0.52" />
      <rect x="2" y="120" width="58" height="6" rx="3"   fill="var(--color-accent-dark)" fillOpacity="0.52" />
      <rect x="2" y="178" width="58" height="5" rx="2.5" fill="var(--color-accent-dark)" fillOpacity="0.52" />

      {/* Flower ornaments on crossbars */}
      <circle cx="29" cy="61"  r="6" fill="var(--color-accent)" fillOpacity="0.65" />
      <circle cx="29" cy="61"  r="2.5" fill="var(--color-background-light)" fillOpacity="0.5" />
      <circle cx="29" cy="123" r="6" fill="var(--color-accent)" fillOpacity="0.65" />
      <circle cx="29" cy="123" r="2.5" fill="var(--color-background-light)" fillOpacity="0.5" />

      {/* Petal spokes on ornament */}
      {[0,60,120,180,240,300].map((deg, i) => {
        const r = deg * Math.PI / 180;
        return (
          <line key={i}
            x1={29} y1={61}
            x2={29 + Math.cos(r) * 9} y2={61 + Math.sin(r) * 9}
            stroke="var(--color-accent)" strokeWidth="1.2" strokeOpacity="0.35"
            strokeLinecap="round"
          />
        );
      })}

      {/* Lock on right edge */}
      <rect x="52" y="108" width="12" height="16" rx="3.5" fill="var(--color-accent-dark)" fillOpacity="0.85" />
      <path d="M54 108 Q54 99 58 99 Q62 99 62 108"
        fill="none" stroke="var(--color-accent-dark)" strokeWidth="2.2"
        strokeOpacity="0.75" strokeLinecap="round" />
      <circle cx="58" cy="116" r="2" fill="var(--color-background-light)" fillOpacity="0.7" />
      <rect x="57" y="116" width="2" height="4" rx="1" fill="var(--color-background-light)" fillOpacity="0.6" />
    </svg>
  );
}