"use client";

import { useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EXPO = [0.16, 1, 0.3, 1] as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BACK = [0.34, 1.56, 0.64, 1] as any;

const LETS_MAKE = "Let's Make";
const SOMETHING = "SOMETHING";
const GREAT     = "GREAT.";

// ── Particle field ────────────────────────────────────────────────
const COUNT = 1800;

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const seeds     = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      seeds[i]             = 0.3 + Math.random() * 0.9;
      colors[i * 3]        = 0.65;
      colors[i * 3 + 1]    = 0.55;
      colors[i * 3 + 2]    = 0.98;
    }
    return { positions, colors, seeds };
  }, []);

  useFrame(({ clock }) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const posAttr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const colAttr = pts.geometry.attributes.color as THREE.BufferAttribute;
    const t   = clock.elapsedTime;
    const arr = posAttr.array as Float32Array;
    const col = colAttr.array as Float32Array;

    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += seeds[i] * 0.003;
      if (arr[i * 3 + 1] > 4.8) arr[i * 3 + 1] = -4.8;
      arr[i * 3] += Math.sin(t * 0.4 * seeds[i] + i) * 0.0007;

      const phase = (t * 0.25 * seeds[i] + i * 0.07) % (Math.PI * 2);
      const v     = 0.5 + 0.5 * Math.sin(phase);
      col[i * 3]     = 0.4 + v * 0.4;
      col[i * 3 + 1] = 0.3 + v * 0.3;
      col[i * 3 + 2] = 0.85 + v * 0.15;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]}    />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function Footer(): React.JSX.Element {
  const sectionRef  = useRef<HTMLElement>(null);
  const letsMakeRef = useRef<HTMLDivElement>(null);
  const somethingRef = useRef<HTMLDivElement>(null);
  const greatRef    = useRef<HTMLDivElement>(null);
  const emailRef    = useRef<HTMLAnchorElement>(null);
  const socialsRef  = useRef<HTMLDivElement>(null);
  const colophonRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);

  const letsMakeCharRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const greatCharRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const emailCharRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const introComplete    = useRef(false);

  // ── Set initial hidden states ─────────────────────────────────
  useLayoutEffect(() => {
    const targets = [letsMakeRef, greatRef, emailRef, socialsRef, colophonRef];
    if (targets.some((r) => !r.current)) return;

    gsap.set(letsMakeRef.current, { clipPath: "inset(0 100% 0 0)" });
    gsap.set(greatRef.current,    { clipPath: "inset(0 0% 0 100%)" });
    gsap.set(emailRef.current,    { opacity: 0, y: 30 });
    gsap.set(colophonRef.current, { opacity: 0 });

    if (somethingRef.current) {
      const spans = somethingRef.current.querySelectorAll("span");
      gsap.set(spans, { y: 60, opacity: 0, clipPath: "inset(110% 0 0 0)" });
    }

    const socialLinks = socialsRef.current?.querySelectorAll("a");
    if (socialLinks) {
      gsap.set(socialLinks, { x: -20, opacity: 0 });
    }
  }, []);

  // ── ScrollTrigger entrance ────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const targets = [sectionRef, letsMakeRef, greatRef, emailRef, socialsRef, colophonRef];
    if (targets.some((r) => !r.current)) return;

    const tl = gsap.timeline({ defaults: { ease: EXPO }, paused: true });

    tl
      .to(letsMakeRef.current, { clipPath: "inset(0 0% 0 0)",   duration: 0.9 }, 0)
      .to(somethingRef.current!.querySelectorAll("span"), {
          y: 0, opacity: 1, clipPath: "inset(0 0 0 0)",
          stagger: 0.06,
          duration: 0.55,
          ease: BACK,
        }, 0.3)
      .to(greatRef.current,   { clipPath: "inset(0 0% 0 0%)",  duration: 0.9 }, 0.7)
      .to(emailRef.current,   { opacity: 1, y: 0,              duration: 0.6 }, 0.9)
      .to(socialsRef.current!.querySelectorAll("a"), {
          x: 0, opacity: 1, stagger: 0.08, duration: 0.5,
        }, 1.05)
      .to(colophonRef.current, { opacity: 1, duration: 0.5 }, 1.2);

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   "top 85%",
      once:    true,
      onEnter: () => {
        tl.play();
        setTimeout(() => {
          if (letsMakeRef.current)
            letsMakeRef.current.style.animation = "glow-letter-dark3 2s ease-in-out 0s both";
          if (greatRef.current)
            greatRef.current.style.animation = "glow-letter-dark1 2s ease-in-out 0.4s both";
        }, 400);
        setTimeout(() => { introComplete.current = true; }, 1400);
      },
    });

    return () => { st.kill(); tl.kill(); };
  }, []);

  // ── Hover proximity glow ──────────────────────────────────────
  useEffect(() => {
    const RADIUS = 220;
    const smooth = (t: number) => t * t * (3 - 2 * t);

    const applyGlow = (
      refs: (HTMLSpanElement | null)[],
      strokeW: string,
      baseAlpha: number,
      cx: number,
      cy: number,
    ) => {
      refs.forEach((el) => {
        if (!el) return;
        const r    = el.getBoundingClientRect();
        const lx   = r.left + r.width  / 2;
        const ly   = r.top  + r.height / 2;
        const dist = Math.hypot(cx - lx, cy - ly);

        if (dist < RADIUS) {
          const e   = smooth(1 - dist / RADIUS);
          const t   = cx / window.innerWidth;
          const hue = 270 - t * 110 + (lx / window.innerWidth) * 40;
          const S   = e * 90;
          const L   = 10 + e * 62;
          const A   = baseAlpha + (1 - baseAlpha) * e;
          const col = `hsla(${hue.toFixed(0)},${S.toFixed(0)}%,${L.toFixed(0)}%,${A.toFixed(2)})`;

          if (el.parentElement) el.parentElement.style.animation = "none";
          (el.style as CSSStyleDeclaration & { webkitTextStroke: string }).webkitTextStroke =
            `${strokeW} ${col}`;
          el.style.filter = e > 0.05
            ? `drop-shadow(0 0 ${(e * 7).toFixed(1)}px hsla(${hue.toFixed(0)},90%,72%,${e.toFixed(2)}))`
            : "";
          el.dataset.glowActive = "1";
        } else if (el.dataset.glowActive === "1") {
          el.dataset.glowActive = "";
          (el.style as CSSStyleDeclaration & { webkitTextStroke: string }).webkitTextStroke = "";
          el.style.filter = "";
        }
      });
    };

    const onMove = (e: MouseEvent) => {
      if (!introComplete.current) return;
      applyGlow(letsMakeCharRefs.current, "1.5px", 0.6, e.clientX, e.clientY);
      applyGlow(greatCharRefs.current,    "1px",   0.5, e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ── Email hover ───────────────────────────────────────────────
  useEffect(() => {
    const el = emailRef.current;
    const ul = underlineRef.current;
    if (!el || !ul) return;

    const onEnter = () => {
      gsap.to(emailCharRefs.current.filter(Boolean), {
        color: "#ffffff", stagger: 0.02, duration: 0.3, ease: "power2.out",
      });
      gsap.to(ul, { width: "100%", duration: 0.5, ease: "power3.inOut" });
    };
    const onLeave = () => {
      gsap.to(emailCharRefs.current.filter(Boolean), {
        color: "rgba(255,255,255,0.5)", stagger: 0.015, duration: 0.25, ease: "power2.out",
      });
      gsap.set(ul, { transformOrigin: "100% 0" });
      gsap.to(ul, { width: "0%", duration: 0.4, ease: "power3.inOut" });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);


  return (
    <section ref={sectionRef} className="footer-section" data-dark-nav="true" style={{ fontFamily: "var(--font-display)" }}>
      {/* Three.js particle field */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          gl={{ alpha: true, antialias: false }}
          aria-hidden="true"
        >
          <ParticleField />
        </Canvas>
      </div>

      {/* Content */}
      <div className="footer-content">

        {/* Headline */}
        <div className="footer-headline">
          {/* "Let's Make" */}
          <div
            ref={letsMakeRef}
            className="footer-headline__lets"
            style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.6)", color: "transparent" } as React.CSSProperties}
          >
            {LETS_MAKE.split("").map((char, i) => (
              <span
                key={i}
                ref={(el) => { letsMakeCharRefs.current[i] = el; }}
                style={{ whiteSpace: char === " " ? "pre" : undefined }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>

          {/* "SOMETHING" */}
          <div
            ref={somethingRef}
            className="footer-headline__something"
            style={{ overflow: "hidden" }}
          >
            {SOMETHING.split("").map((char, i) => (
              <span key={i} style={{ display: "inline-block" }}>{char}</span>
            ))}
          </div>

          {/* "GREAT." */}
          <div
            ref={greatRef}
            className="footer-headline__great"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.5)", color: "transparent" } as React.CSSProperties}
          >
            {GREAT.split("").map((char, i) => (
              <span
                key={i}
                ref={(el) => { greatCharRefs.current[i] = el; }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Email + socials */}
        <div className="footer-email-row">
          <a
            ref={emailRef}
            href="mailto:hello@xadastudio.com"
            className="footer-email-link"
          >
            {"hello@xadastudio.com".split("").map((char, i) => (
              <span
                key={i}
                ref={(el) => { emailCharRefs.current[i] = el; }}
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {char}
              </span>
            ))}
            <div ref={underlineRef} className="footer-email-underline" />
          </a>

          <div ref={socialsRef} className="footer-socials">
            {(["Facebook", "Instagram", "TikTok"] as const).map((name) => (
              <a key={name} href="#" className="footer-social-link" aria-label={`Follow on ${name}`}>
                <span className="footer-social-link__inner">
                  <span className="footer-social-link__top">{name}</span>
                  <span className="footer-social-link__bot" aria-hidden="true">{name}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Colophon */}
        <div ref={colophonRef} className="footer-colophon">
          <span className="footer-colophon__text">© 2025 Xada Studio</span>
          <span className="footer-colophon__text">All rights reserved</span>
        </div>
      </div>
    </section>
  );
}
