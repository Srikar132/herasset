"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

/**
 * A custom cursor follower using gsap.quickTo() for maximum performance.
 * The butterfly image tracks the real cursor with a smooth lag behind.
 * Hidden on touch devices.
 */
export default function CursorFollower() {
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ── Hide on touch devices ── */
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const follower = followerRef.current;
    if (!follower) return;

    /* ── Hide the default cursor on the whole page ── */
    document.documentElement.style.cursor = "none";

    /* ── quickTo functions — one per axis, per element ── */
    const fxTo = gsap.quickTo(follower, "x", { duration: 0.55, ease: "power3.out" });
    const fyTo = gsap.quickTo(follower, "y", { duration: 0.55, ease: "power3.out" });

    /* trail lags slightly more for depth */
    /* ── Rotation: track velocity between frames ── */
    let lastX = 0;
    let lastY = 0;
    let rotation = 0;
    let raf = 0;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    /* quickTo for scale — grows while moving, shrinks when idle */
    const scaleTo = gsap.quickTo(follower, "scale", { duration: 0.35, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      fxTo(x);
      fyTo(y);

      /* gentle rotation based on horizontal velocity */
      const dx = x - lastX;
      const dy = y - lastY;
      rotation = gsap.utils.clamp(-30, 30, dx * 2.5);
      gsap.to(follower, { rotation, duration: 0.3, ease: "power2.out", overwrite: "auto" });

      /* scale up proportional to speed while moving */
      const speed = Math.sqrt(dx * dx + dy * dy);
      const targetScale = gsap.utils.clamp(1, 2.2, 1 + speed * 0.045);
      scaleTo(targetScale);

      /* shrink back to normal after 120 ms of stillness */
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => scaleTo(1), 120);

      lastX = x;
      lastY = y;
    };

    /* ── Scale up on clickable elements ── */
    const onEnterLink = () => {
      if (idleTimer) clearTimeout(idleTimer);
      gsap.to(follower, { scale: 2.4, duration: 0.25, ease: "back.out(2)", overwrite: "auto" });
    };
    const onLeaveLink = () => {
      gsap.to(follower, { scale: 1, duration: 0.25, ease: "back.out(2)", overwrite: "auto" });
    };

    const bindLinks = () => {
      document.querySelectorAll("a, button, [role='button'], [tabindex]").forEach((el) => {
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
    };
    bindLinks();

    /* re-bind whenever new elements might appear */
    const observer = new MutationObserver(bindLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
      document.documentElement.style.cursor = "";
      cancelAnimationFrame(raf);
      if (idleTimer) clearTimeout(idleTimer);
      document.querySelectorAll("a, button, [role='button'], [tabindex]").forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
    };
  }, []);

  return (
    <>
      {/* ── Soft glow trail dot ── */}


      {/* ── Butterfly image follower ── */}
      <div
        ref={followerRef}
        className="pointer-events-none fixed top-0 left-0 z-9999"
        style={{
          width: 48,
          height: 48,
          transform: "translate(-50%, -50%)",
          willChange: "transform",
        }}
      >
        <Image
          src="/cursor.png"
          alt=""
          fill
          sizes="48px"
          className="object-contain select-none"
          style={{ filter: "drop-shadow(0 2px 6px rgba(110,90,48,0.35))" }}
          draggable={false}
          priority
        />
      </div>
    </>
  );
}
