"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/all";
import Image from "next/image";
import { GALLERY, GalleryItem } from "@/data/gallery";

gsap.registerPlugin(ScrollTrigger, Flip);

/* ─── Singleton: only one video can be unmuted at a time ─── */
let activeAudioVideo: HTMLVideoElement | null = null;

/* ─── VideoCard ─── */
function VideoCard({ item }: { item: GalleryItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.play().catch(() => { }); setPlaying(true); }
        else {
          el.pause(); setPlaying(false);
          // If this video was the active audio source, clear it
          if (activeAudioVideo === el) {
            el.muted = true;
            activeAudioVideo = null;
            setMuted(true);
          }
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;

    if (el.muted) {
      // Mute the previously active video first
      if (activeAudioVideo && activeAudioVideo !== el) {
        activeAudioVideo.muted = true;
        // Dispatch a custom event so the other VideoCard updates its state
        activeAudioVideo.dispatchEvent(new Event("force-mute"));
      }
      el.muted = false;
      activeAudioVideo = el;
      setMuted(false);
    } else {
      el.muted = true;
      activeAudioVideo = null;
      setMuted(true);
    }
  };

  /* Listen for force-mute from the singleton logic */
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const handler = () => setMuted(true);
    el.addEventListener("force-mute", handler);
    return () => el.removeEventListener("force-mute", handler);
  }, []);

  return (
    <>
      <video ref={videoRef} src={item.src} poster={item.poster}
        muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: item.objectPosition ?? "center" }}
      />
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", border: "1.5px solid rgba(255,255,255,0.35)" }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="white" style={{ marginLeft: 2 }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
      <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}
        className="absolute bottom-3 right-3 z-10 flex items-center justify-center active:scale-90"
        style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(20,14,8,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>
        {muted ? (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   GalleryCard
   wrapperRef  → grid slot holder, never moves
   innerRef    → the visual card, Flip animates this only
───────────────────────────────────────────────────────── */
function GalleryCard({
  item,
  index,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  onOpen: (item: GalleryItem, innerEl: HTMLDivElement, wrapperEl: HTMLDivElement) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  /* scroll-reveal — animate the wrapper so layout isn't disturbed */
  useEffect(() => {
    if (!wrapperRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(wrapperRef.current,
        { opacity: 0, y: 48, scale: 0.94 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out",
          delay: (index % 3) * 0.07,
          scrollTrigger: { trigger: wrapperRef.current, start: "top 88%", toggleActions: "play none none none" },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  const isPlaceholder = !item.src;


  return (
    /* ── WRAPPER: holds grid slot, purely structural ── */
    <div
      ref={wrapperRef}
      style={{
        gridColumn: `span ${item.colSpan} / span ${item.colSpan}`,
        gridRow: `span ${item.rowSpan} / span ${item.rowSpan}`,
        position: "relative",   // so inner can be absolute inset-0
      }}
    >
      {/* ── INNER: this is the only thing Flip will move ── */}
      <div
        ref={innerRef}
        data-flip-id={item.id}
        className="group absolute inset-0 overflow-hidden rounded-2xl cursor-pointer"
        // style={{
        //   background: isPlaceholder
        //     ? placeholders[index % placeholders.length]
        //     : "#1a120b",
        // }}
        onClick={() => {
          if (!isPlaceholder && innerRef.current && wrapperRef.current) {
            onOpen(item, innerRef.current, wrapperRef.current);
          }
        }}
      >
        {!isPlaceholder && (
          item.type === "video" ? <VideoCard item={item} /> : (
            <Image
              src={item.src}
              alt={item.caption ?? "Memory"}
              fill
              sizes={`${Math.round((item.colSpan / 3) * 100)}vw`}
              className="object-cover object-center transition-transform duration-700"
              style={{ objectPosition: item.objectPosition ?? "center" }}
            />
          )
        )}

        {item.type === "video" && !isPlaceholder && (
          <span className="absolute top-3 left-3 text-[10px] font-sans tracking-widest uppercase px-2 py-0.5 rounded-full pointer-events-none"
            style={{ background: "rgba(20,14,8,0.55)", color: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.15)" }}>
            video
          </span>
        )}

        {item.caption && (
          <div className="absolute bottom-0 inset-x-0 px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out"
            style={{ background: "linear-gradient(to top, rgba(20,14,8,0.78) 0%, transparent 100%)" }}>
            <p className="font-sans text-xs tracking-wide leading-snug" style={{ color: "rgba(255,255,255,0.9)" }}>
              {item.caption}
            </p>
          </div>
        )}

        {/* <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1.5px rgba(196,168,130,0.4)" }} /> */}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Memories
───────────────────────────────────────────────────────── */
const Memories = () => {
  const headingRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const overlayPortalRef = useRef<HTMLDivElement>(null); // fixed full-screen portal
  const activeInnerRef = useRef<HTMLDivElement | null>(null);
  const activeWrapperRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openCaption, setOpenCaption] = useState("");

  /* ── Open ── */
  const handleOpen = useCallback((
    item: GalleryItem,
    innerEl: HTMLDivElement,
    wrapperEl: HTMLDivElement
  ) => {
    if (isOpen) return;

    activeInnerRef.current = innerEl;
    activeWrapperRef.current = wrapperEl;
    setOpenCaption(item.caption ?? "");

    const portal = overlayPortalRef.current!;
    const backdrop = backdropRef.current!;

    /* 1. Snapshot BEFORE any DOM change */
    const state = Flip.getState(innerEl);

    /* 2. Move innerEl into the fixed portal (portal is flex-center) */
    portal.appendChild(innerEl);

    /* 3. Clear grid's inset-0 and set the final centered size.
          The portal is display:flex + align/justify center,
          so we just need position:relative + explicit size. */
    innerEl.style.position = "relative";
    innerEl.style.inset = "unset";
    innerEl.style.width = `${Math.min(window.innerWidth * 0.92, 640)}px`;
    innerEl.style.height = `${Math.min(window.innerHeight * 0.8, 520)}px`;
    innerEl.style.flexShrink = "0";

    /* 4. Show backdrop + portal */
    portal.style.pointerEvents = "auto";
    gsap.set(backdrop, { opacity: 0, display: "block" });
    gsap.to(backdrop, { opacity: 1, duration: 0.3, ease: "power2.out" });

    /* 5. Flip from grid position → portal center */
    Flip.from(state, {
      duration: 0.55,
      ease: "power3.inOut",
      absolute: true,
      onComplete: () => {
        /* If it's a video, unmute it — singleton ensures only one audio at a time */
        const video = innerEl.querySelector("video");
        if (video) {
          if (activeAudioVideo && activeAudioVideo !== video) {
            activeAudioVideo.muted = true;
            activeAudioVideo.dispatchEvent(new Event("force-mute"));
          }
          video.muted = false;
          activeAudioVideo = video;
        }
        setIsOpen(true);
      },
    });
  }, [isOpen]);

  /* ── Close ── */
  const handleClose = useCallback(() => {
    if (!isOpen || !activeInnerRef.current || !activeWrapperRef.current) return;

    const innerEl = activeInnerRef.current;
    const wrapperEl = activeWrapperRef.current;
    const backdrop = backdropRef.current!;
    const portal = overlayPortalRef.current!;

    setIsOpen(false);

    /* Mute video immediately when closing + clear singleton */
    const video = innerEl.querySelector("video");
    if (video) {
      video.muted = true;
      video.dispatchEvent(new Event("force-mute"));
      if (activeAudioVideo === video) activeAudioVideo = null;
    }

    /* 1. Snapshot current expanded position */
    const state = Flip.getState(innerEl);

    /* 2. Put innerEl back into its wrapper — restore grid styles */
    innerEl.style.position = "";
    innerEl.style.left = "";
    innerEl.style.top = "";
    innerEl.style.width = "";
    innerEl.style.height = "";
    innerEl.style.borderRadius = "";
    innerEl.style.inset = "";
    innerEl.style.flexShrink = "";
    wrapperEl.appendChild(innerEl);

    /* 3. Fade backdrop */
    gsap.to(backdrop, {
      opacity: 0, duration: 0.3, ease: "power2.in",
      onComplete: () => { backdrop.style.display = "none"; }
    });

    /* 4. Flip back from portal → wrapper */
    Flip.from(state, {
      duration: 0.5,
      ease: "power3.inOut",
      absolute: true,
      onComplete: () => {
        portal.style.pointerEvents = "none";
        activeInnerRef.current = null;
        activeWrapperRef.current = null;
        setOpenCaption("");
      },
    });
  }, [isOpen]);

  /* Escape key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  /* Header scroll-reveal */
  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(Array.from(headingRef.current!.children),
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.14, ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none none" },
        }
      );
    });
    return () => ctx.revert();
  }, []);



  return (
    <section className="relative min-h-screen bg-white">

      {/* ── Teddy standing on the top-right edge ─────────── */}
      <div
        className="absolute pointer-events-none -top-35 select-none"
        style={{
          right: "clamp(1rem, 5vw, 2.5rem)",
          zIndex: 20,
          transformOrigin: "bottom center",
        }}
      >
        <Image
          src="/dudu-cute.gif"
          alt="Teddy bear"
          width={150}
          height={180}
          unoptimized
          className="object-contain"
        />
      </div>

      {/* ── Fixed portal — innerEl lives here when open ── */}
      <div
        ref={overlayPortalRef}
        onClick={(e) => {
          // Close when clicking the portal backdrop area (not the card itself)
          if (e.target === overlayPortalRef.current || e.target === backdropRef.current) {
            handleClose();
          }
        }}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          pointerEvents: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {/* ── Backdrop lives inside the portal so z-index can't block it ── */}
        <div
          ref={backdropRef}
          style={{
            display: "none", position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.75)", opacity: 0, cursor: "pointer",
          }}
        />
      </div>

      {/* ── Close button ── */}
      {isOpen && (
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: "fixed", top: 20, right: 20, zIndex: 10000,
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {/* ── Caption pill ── */}
      {isOpen && openCaption && (
        <div style={{
          position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
          zIndex: 10000, padding: "8px 20px", borderRadius: 999,
          background: "rgba(20,14,8,0.6)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}>
          <p className="font-sans text-sm tracking-wide whitespace-nowrap" style={{ color: "rgba(255,255,255,0.9)" }}>
            {openCaption}
          </p>
        </div>
      )}

      {/* ── Section Header ── */}
      <div ref={headingRef} className="relative z-10 flex flex-col items-center pt-16 pb-10 px-6">
        <span className="font-sans uppercase tracking-[0.28em] mb-3 block"
          style={{ fontSize: "clamp(0.65rem, 1.4vw, 0.82rem)", color: "var(--color-muted-warm)" }}>
          A collection of
        </span>
        <h2 className="font-script text-center leading-none"
          style={{ fontFamily: "var(--font-great-vibes)", fontSize: "clamp(3rem, 10vw, 6rem)", color: "var(--color-foreground)" }}>
          Beautiful Memories
        </h2>
        <p className="font-sans text-center mt-3 max-w-xs"
          style={{ fontSize: "clamp(0.78rem, 1.6vw, 0.92rem)", color: "var(--color-foreground-light)", lineHeight: 1.8 }}>
          Every picture, every video — makes a memory.
        </p>
        <div className="mt-6 rounded-full"
          style={{ width: "clamp(48px,12vw,80px)", height: "1.5px", background: "linear-gradient(90deg,transparent,var(--color-accent),transparent)" }} />
      </div>

      {/* ── Bento Grid ── */}
      <div className="relative z-10  pb-20 mx-auto" style={{ maxWidth: "min(900px, 96vw)" }}>
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gridAutoRows: "clamp(90px, 12vw, 160px)", // compact: 90px mobile → 160px desktop
            gridAutoFlow: "dense",                    // CSS fallback — backfills any edge-case holes
          }}
        >
          {GALLERY.map((item, i) => (
            <GalleryCard key={item.id} item={item} index={i} onOpen={handleOpen} />
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10 flex flex-col items-center pb-16 gap-3">
        <div className="rounded-full"
          style={{ width: "clamp(48px,12vw,80px)", height: "1.5px", background: "linear-gradient(90deg,transparent,var(--color-accent),transparent)" }} />
        <p className="font-sans" style={{ fontSize: "clamp(0.7rem, 1.4vw, 0.82rem)", color: "var(--color-muted-warm)", letterSpacing: "0.2em" }}>
          made with love 🌸
        </p>
      </div>
    </section>
  );
};

export default Memories;