"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import CornerDecor from "./CornerDecor";

gsap.registerPlugin(ScrollTrigger);

/* ─── Butterfly scatter layout (mirroring MainContent style) ──── */
const BUTTERFLIES = [
    { top: "4%", left: "8%", w: 80, rotate: "-rotate-12" },
    { top: "6%", left: "60%", w: 64, rotate: "rotate-6" },
    { top: "78%", left: "6%", w: 72, rotate: "rotate-3" },
    { top: "80%", left: "82%", w: 64, rotate: "-rotate-6" },
];

export default function BirthdayLetter() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const envelopeRef = useRef<HTMLDivElement>(null);
    const letterRef = useRef<HTMLDivElement>(null);
    const linesRef = useRef<(HTMLElement | null)[]>([]);
    const signRef = useRef<HTMLDivElement>(null);
    const butterflyRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            /* ── Butterflies drift in ── */
            gsap.fromTo(
                butterflyRefs.current,
                { scale: 0, opacity: 0, y: 20 },
                {
                    scale: 1, opacity: 1, y: 0,
                    duration: 0.8, ease: "back.out(2)", stagger: 0.15,
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
                }
            );

            /* ── Envelope slides up ── */
            gsap.fromTo(envelopeRef.current,
                { opacity: 0, y: 50, scale: 0.96 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out",
                    scrollTrigger: { trigger: envelopeRef.current, start: "top 88%", toggleActions: "play none none none" },
                }
            );

            /* ── Letter paper rises ── */
            gsap.fromTo(letterRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
                    scrollTrigger: { trigger: letterRef.current, start: "top 85%", toggleActions: "play none none none" },
                }
            );

            /* ── Each line fades in staggered ── */
            linesRef.current.forEach((el, i) => {
                if (!el) return;
                gsap.fromTo(el,
                    { opacity: 0, y: 18 },
                    {
                        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
                        delay: i * 0.06,
                        scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
                    }
                );
            });

            /* ── Signature sweeps in ── */
            gsap.fromTo(signRef.current,
                { opacity: 0, x: -16, rotate: -3 },
                {
                    opacity: 1, x: 0, rotate: 0, duration: 0.9, ease: "back.out(1.4)",
                    scrollTrigger: { trigger: signRef.current, start: "top 94%", toggleActions: "play none none none" },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const setLineRef = (i: number) => (el: HTMLElement | null) => {
        linesRef.current[i] = el;
    };

    return (
        <div
            ref={sectionRef}
            className="relative w-full h-screen"
            style={{
                background: "white",
            }}
        >

            {/* ── Teddy standing on the top-right edge ─────────── */}

            {/* ── Corner flower decorations (same as MainContent) ── */}
            <CornerDecor corner="top-left" />
            <CornerDecor corner="bottom-right" />

            {/* ── Scattered butterflies ──────────────────────────── */}
            {BUTTERFLIES.map((b, i) => (
                <div
                    key={i}
                    ref={(el) => { butterflyRefs.current[i] = el; }}
                    className={`absolute pointer-events-none select-none ${b.rotate}`}
                    style={{
                        top: b.top,
                        left: b.left,
                        width: b.w,
                        height: b.w,
                        opacity: 0,
                        zIndex: 2,
                    }}
                >
                    <Image
                        src="/butterfly.webp"
                        alt=""
                        fill
                        className="object-contain drop-shadow"
                        sizes={`${b.w}px`}
                    />
                </div>
            ))}

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

            {/* ── Centred content (like MainContent layout) ────── */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center px-4"
                style={{ zIndex: 5 }}
            >
                <div style={{ width: "100%", maxWidth: "min(540px, 90vw)" }}>

                    {/* ── Section eyebrow ── */}
                    <div className="flex flex-col items-center mb-3">
                        <div
                            className="rounded-full mb-2"
                            style={{
                                width: "clamp(36px, 10vw, 60px)",
                                height: "1.5px",
                                background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
                            }}
                        />
                        <span
                            className="font-sans uppercase tracking-[0.28em] text-muted-warm"
                            style={{ fontSize: "clamp(0.58rem, 1.2vw, 0.72rem)" }}
                        >
                            A letter for you
                        </span>
                    </div>

                    <h2
                        className="font-script text-center leading-none text-foreground mb-3"
                        style={{ fontSize: "clamp(2rem, 7vw, 4rem)" }}
                    >
                        Dear Maheswari
                    </h2>

                    {/* ── Envelope container ── */}
                    <div
                        ref={envelopeRef}
                        className="relative w-full opacity-0"
                    >
                        {/* ── Envelope flap (triangle) ── */}
                        <div
                            className="absolute left-0 right-0 mx-auto z-0"
                            style={{
                                top: "clamp(-16px, -3vw, -24px)",
                                width: "75%",
                                height: "clamp(24px, 5vw, 40px)",
                                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                                background: "var(--color-background-dark)",
                            }}
                        />

                        {/* ── Envelope body ── */}
                        <div
                            className="relative z-10 rounded-xl border border-accent/30 overflow-hidden"
                            style={{
                                background: "var(--color-background-dark)",
                                padding: "clamp(4px, 1.5vw, 8px)",
                                boxShadow: "0 6px 32px rgba(92,74,58,0.10), 0 2px 6px rgba(92,74,58,0.05)",
                            }}
                        >
                            {/* ── Letter paper ── */}
                            <div
                                ref={letterRef}
                                className="relative rounded-lg opacity-0"
                                style={{
                                    background: "var(--color-background-light)",
                                    padding: "clamp(0.8rem, 3vw, 1.6rem) clamp(0.8rem, 3vw, 1.5rem)",
                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                                }}
                            >
                                {/* ── Faint ruled lines (decorative) ── */}
                                <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none overflow-hidden rounded-lg opacity-[0.06]">
                                    {Array.from({ length: 18 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-full border-b border-foreground"
                                            style={{ height: "clamp(20px, 3vw, 28px)" }}
                                        />
                                    ))}
                                </div>

                                {/* ── Red margin line ── */}
                                <div
                                    className="absolute top-0 bottom-0 pointer-events-none opacity-[0.10]"
                                    style={{
                                        left: "clamp(0.6rem, 2.5vw, 1.2rem)",
                                        width: "1.5px",
                                        background: "var(--color-accent)",
                                    }}
                                />

                                {/* ── Letter content ── */}
                                <div className="relative z-10">
                                    {/* Date */}
                                    <p
                                        ref={setLineRef(0)}
                                        className="font-sans text-muted-warm text-right opacity-0"
                                        style={{
                                            fontSize: "clamp(0.55rem, 1.1vw, 0.68rem)",
                                            letterSpacing: "0.06em",
                                            marginBottom: "clamp(0.3rem, 1vw, 0.6rem)",
                                        }}
                                    >
                                        March 12, 2026
                                    </p>

                                    {/* Greeting */}
                                    <p
                                        ref={setLineRef(1)}
                                        className="font-script text-foreground opacity-0"
                                        style={{
                                            fontSize: "clamp(1.2rem, 3.5vw, 1.8rem)",
                                            marginBottom: "clamp(0.3rem, 1vw, 0.5rem)",
                                        }}
                                    >
                                        My Dearest Mahi,
                                    </p>

                                    {/* Body paragraphs — compact line-height for h-screen fit */}
                                    <p
                                        ref={setLineRef(2)}
                                        className="font-serif text-foreground opacity-0 italic"
                                        style={{
                                            fontSize: "clamp(0.72rem, 1.6vw, 0.88rem)",
                                            lineHeight: 1.7,
                                            letterSpacing: "0.01em",
                                            marginBottom: "clamp(0.25rem, 0.8vw, 0.45rem)",
                                        }}
                                    >
                                        Happy Birthday to the most beautiful soul I know! Today is your
                                        day, and I want you to know just how special you are — not only
                                        today, but every single day.
                                    </p>

                                    <p
                                        ref={setLineRef(3)}
                                        className="font-serif text-foreground-light opacity-0 italic"
                                        style={{
                                            fontSize: "clamp(0.72rem, 1.6vw, 0.88rem)",
                                            lineHeight: 1.7,
                                            letterSpacing: "0.01em",
                                            marginBottom: "clamp(0.25rem, 0.8vw, 0.45rem)",
                                        }}
                                    >
                                        Thank you for being with me, for your patience, your kindness,
                                        and for all those moments that make everything worth it. You make
                                        the ordinary feel extraordinary just by being you.
                                    </p>

                                    <p
                                        ref={setLineRef(4)}
                                        className="font-serif text-foreground-light opacity-0 italic"
                                        style={{
                                            fontSize: "clamp(0.72rem, 1.6vw, 0.88rem)",
                                            lineHeight: 1.7,
                                            letterSpacing: "0.01em",
                                            marginBottom: "clamp(0.25rem, 0.8vw, 0.45rem)",
                                        }}
                                    >
                                        And hey — please don&apos;t be angry with me, okay? I know I&apos;m not
                                        perfect, but everything I do comes from how much I care about you.
                                        Your smile is my favourite thing in this whole world, and I never
                                        want to be the reason it fades.
                                    </p>

                                    <p
                                        ref={setLineRef(5)}
                                        className="font-serif text-foreground-light opacity-0 italic"
                                        style={{
                                            fontSize: "clamp(0.72rem, 1.6vw, 0.88rem)",
                                            lineHeight: 1.7,
                                            letterSpacing: "0.01em",
                                            marginBottom: "clamp(0.25rem, 0.8vw, 0.45rem)",
                                        }}
                                    >
                                        May this new year of your life bring you all the happiness, all
                                        the dreams you deserve, and all the love your heart can hold.
                                        I&apos;ll always be right here, cheering for you.
                                    </p>

                                    <p
                                        ref={setLineRef(6)}
                                        className="font-serif text-foreground opacity-0"
                                        style={{
                                            fontSize: "clamp(0.72rem, 1.6vw, 0.88rem)",
                                            lineHeight: 1.7,
                                            letterSpacing: "0.01em",
                                            marginBottom: "clamp(0.4rem, 1.2vw, 0.8rem)",
                                        }}
                                    >
                                        With all my love, forever and always.
                                    </p>

                                    {/* Signature */}
                                    <div
                                        ref={signRef}
                                        className="flex flex-col items-end gap-0.5 opacity-0"
                                    >
                                        <span
                                            className="font-script text-accent-dark"
                                            style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)" }}
                                        >
                                            Yours forever
                                        </span>
                                        <span
                                            className="font-sans text-muted-warm tracking-widest uppercase"
                                            style={{ fontSize: "clamp(0.5rem, 1vw, 0.62rem)" }}
                                        >
                                            — with love
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Wax seal ── */}
                        <div
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 rounded-full border-2 border-accent/40 flex items-center justify-center"
                            style={{
                                width: "clamp(36px, 8vw, 52px)",
                                height: "clamp(36px, 8vw, 52px)",
                                background: "var(--color-accent-dark)",
                                boxShadow: "0 3px 12px rgba(92,74,58,0.22), inset 0 1px 2px rgba(255,255,255,0.12)",
                            }}
                        >
                            <span
                                className="font-script text-background-light"
                                style={{ fontSize: "clamp(1rem, 2.5vw, 1.4rem)" }}
                            >
                                M
                            </span>
                        </div>
                    </div>

                    {/* ── Bottom flourish ── */}
                    <div className="flex flex-col items-center mt-8 gap-1.5">
                        <div
                            className="rounded-full"
                            style={{
                                width: "clamp(36px, 10vw, 60px)",
                                height: "1.5px",
                                background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
                            }}
                        />
                        <p
                            className="font-sans text-muted-warm"
                            style={{ fontSize: "clamp(0.55rem, 1.1vw, 0.68rem)", letterSpacing: "0.2em" }}
                        >
                            sealed with love 💌
                        </p>
                    </div>

                </div>{/* end inner cap */}
            </div>
        </div>
    );
}
