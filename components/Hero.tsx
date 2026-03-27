"use client";

import { motion, MotionConfig, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const BACK: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

const WE_BUILD    = "We Build";
const EXPERIENCES = "Experiences";

export default function Hero(): React.JSX.Element {
  const ctaRef = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 280, damping: 28 });
  const sy = useSpring(my, { stiffness: 280, damping: 28 });

  const weBuildRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const expRefs       = useRef<(HTMLSpanElement | null)[]>([]);
  const introComplete = useRef(false);

  const sectionRef  = useRef<HTMLElement>(null);
  const topBarRef   = useRef<HTMLDivElement>(null);
  const weBuildRef  = useRef<HTMLDivElement>(null);
  const digitalRef  = useRef<HTMLDivElement>(null);
  const expRef      = useRef<HTMLDivElement>(null);
  const ctaRef2     = useRef<HTMLDivElement>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);

  // ── Scroll-driven split exit ─────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const targets = [sectionRef, topBarRef, weBuildRef, digitalRef, expRef, ctaRef2, bottomRef];
    if (targets.some((r) => !r.current)) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    tl
      .to(topBarRef.current,  { x: "-110vw", opacity: 0, duration: 1 }, 0)
      .to(weBuildRef.current, { x: "-110vw", opacity: 0, duration: 1 }, 0.05)
      .to(expRef.current,     { x:  "110vw", opacity: 0, duration: 1 }, 0.05)
      .to(ctaRef2.current,    { x:  "110vw", opacity: 0, duration: 1 }, 0)
      .to(bottomRef.current,  { y: "4rem",   opacity: 0, duration: 0.7 }, 0)
      .to(digitalRef.current, {
        xPercent: -50,
        x: "50vw",
        scale: 0.92,
        opacity: 0,
        transformOrigin: "center center",
        duration: 0.55,
        ease: "power3.out",
      }, 0);

    const st = ScrollTrigger.create({
      trigger:   sectionRef.current,
      start:     "top top",
      end:       "+=150%",
      pin:       true,
      scrub:     1.5,
      animation: tl,
    });

    return () => { st.kill(); tl.kill(); };
  }, []);

  // ── CTA magnetic pull ────────────────────────────────────────────────
  useEffect(() => {
    const btn = ctaRef.current;
    if (!btn) return;
    const RADIUS = 130, STRENGTH = 0.38;
    const onMove = (e: MouseEvent) => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      if (Math.sqrt(dx * dx + dy * dy) < RADIUS) {
        mx.set(dx * STRENGTH);
        my.set(dy * STRENGTH);
      } else {
        mx.set(0);
        my.set(0);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  // ── Page-load glow animations (set via JS so hover can override them) ─
  useEffect(() => {
    weBuildRefs.current.forEach((el, i) => {
      if (!el || WE_BUILD[i] === " ") return;
      el.style.animation = `glow-letter1 1.6s ease-in-out ${(0.42 + i * 0.09).toFixed(2)}s both`;
    });
    expRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.animation = `glow-letter3 1.6s ease-in-out ${(1.55 + i * 0.08).toFixed(2)}s both`;
    });
    const t = setTimeout(() => { introComplete.current = true; }, 4000);
    return () => clearTimeout(t);
  }, []);

  // ── Hover proximity glow ─────────────────────────────────────────────
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
          const S = e * 90;
          const L = 10 + e * 62;
          const A = baseAlpha + (1 - baseAlpha) * e;
          const col = `hsla(${hue.toFixed(0)},${S.toFixed(0)}%,${L.toFixed(0)}%,${A.toFixed(2)})`;

          el.style.animation = "none";
          (el.style as CSSStyleDeclaration & { webkitTextStroke: string }).webkitTextStroke =
            `${strokeW} ${col}`;
          el.style.filter = e > 0.05
            ? `drop-shadow(0 0 ${(e * 7).toFixed(1)}px hsla(${hue.toFixed(0)},90%,72%,${e.toFixed(2)}))`
            : "";
          el.dataset.glowActive = "1";
        } else if (el.dataset.glowActive === "1") {
          el.dataset.glowActive = "";
          (el.style as CSSStyleDeclaration & { webkitTextStroke: string }).webkitTextStroke =
            `${strokeW} rgba(0,0,0,${baseAlpha})`;
          el.style.filter = "";
        }
      });
    };

    const onMove = (e: MouseEvent) => {
      if (!introComplete.current) return;
      applyGlow(weBuildRefs.current, "1.5px", 0.7, e.clientX, e.clientY);
      applyGlow(expRefs.current,     "1px",   0.6, e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <MotionConfig reducedMotion="never">
      <section
        ref={sectionRef}
        className="relative z-10 h-screen w-full flex flex-col justify-between px-6 pt-20 pb-6 md:px-16 md:pt-24 md:pb-12 overflow-hidden"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {/* ── Top bar ── */}
        <motion.div
          ref={topBarRef}
          className="flex items-center justify-between"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 0.9, ease: EXPO }}
        >
          <span
            className="text-xs font-semibold tracking-[0.35em] uppercase"
            style={{ color: "rgba(0,0,0,0.4)" }}
          >
            Xada
          </span>
          <div className="flex-1 mx-6 h-px" style={{ background: "rgba(0,0,0,0.12)" }} />
          <span className="text-xs font-medium tracking-[0.25em]" style={{ color: "rgba(0,0,0,0.2)" }}>
            01
          </span>
        </motion.div>

        {/* ── Headline block ── */}
        <div className="flex flex-col justify-center md:flex-1 md:mt-4 md:-mb-4">

          {/* "We Build" */}
          <motion.div
            ref={weBuildRef}
            style={{
              fontSize: "clamp(4.5rem, 11vw, 10rem)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              userSelect: "none",
            }}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1.0, delay: 0.35, ease: EXPO }}
          >
            {WE_BUILD.split("").map((char, i) => (
              <span
                key={i}
                ref={(el) => { weBuildRefs.current[i] = el; }}
                style={{
                  display: "inline-block",
                  WebkitTextStroke: "1.5px rgba(0,0,0,0.7)",
                  color: "transparent",
                  whiteSpace: char === " " ? "pre" : undefined,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </motion.div>

          {/* "DIGITAL" */}
          <div
            ref={digitalRef}
            className="font-black leading-none tracking-tight uppercase select-none md:-mt-3"
            style={{ fontSize: "clamp(5.8rem, 19vw, 18rem)", color: "#0a0a0a", overflow: "hidden" }}
          >
            {"DIGITAL".split("").map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: 64, clipPath: "inset(110% 0 0 0)" }}
                animate={{ y: 0, clipPath: "inset(0 0 0 0)" }}
                transition={{ duration: 0.55, delay: 0.65 + i * 0.065, ease: BACK }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* "Experiences" */}
          <motion.div
            ref={expRef}
            className="self-end md:-mt-2"
            style={{
              fontSize: "clamp(2.8rem, 7.5vw, 9rem)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              userSelect: "none",
            }}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.9, delay: 1.45, ease: EXPO }}
          >
            {EXPERIENCES.split("").map((char, i) => (
              <span
                key={i}
                ref={(el) => { expRefs.current[i] = el; }}
                style={{
                  display: "inline-block",
                  WebkitTextStroke: "1px rgba(0,0,0,0.6)",
                  color: "transparent",
                  padding: "0 2px",
                  margin: "0 -2px",
                }}
              >
                {char}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Sub-row: tagline + CTA ── */}
        <motion.div
          ref={ctaRef2}
          className="flex flex-col items-center gap-3 md:mt-10 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9, ease: EXPO }}
        >
          <motion.button
            ref={ctaRef}
            style={{ x: sx, y: sy, color: "#0a0a0a", border: "1px solid rgba(0,0,0,0.15)" }}
            className="group flex items-center justify-center gap-3 w-full py-4 text-xs tracking-[0.25em] uppercase transition-colors duration-300 md:w-auto md:px-7"
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(109,40,217,0.45)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)")}
          >
            Get in touch
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </motion.button>

          <p
            className="text-xs tracking-widest uppercase leading-relaxed text-center md:text-left md:max-w-55 md:order-first"
            style={{ color: "rgba(0,0,0,0.35)" }}
          >
            Web Design Studio
            <br />
            Est. 2025
          </p>
        </motion.div>

        {/* ── Bottom ticker ── */}
        <motion.div
          ref={bottomRef}
          className="flex items-center gap-5 md:mt-8"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 0.9, delay: 2.1, ease: EXPO }}
        >
          <div className="h-px flex-1" style={{ background: "rgba(0,0,0,0.07)" }} />
          <span
            className="text-[10px] tracking-[0.3em] uppercase whitespace-nowrap"
            style={{ color: "rgba(0,0,0,0.2)" }}
          >
            Scroll to explore
          </span>
          <div className="h-px flex-1" style={{ background: "rgba(0,0,0,0.07)" }} />
        </motion.div>
      </section>
    </MotionConfig>
  );
}
