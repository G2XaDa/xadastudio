"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageTransition } from "@/components/PageTransition";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { HUB } from "@/lib/hub";

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function WorkClient() {
  const { navigateTo } = usePageTransition();

  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  // Floating image that follows the cursor (from WorkShowcase).
  const cursorX = useMotionValue(-400);
  const cursorY = useMotionValue(-400);
  const imgX = useSpring(cursorX, { stiffness: 140, damping: 22 });
  const imgY = useSpring(cursorY, { stiffness: 140, damping: 22 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      cursorX.set(e.clientX - 160);
      cursorY.set(e.clientY - 100);
    },
    [cursorX, cursorY],
  );

  // Intro reveal — same GSAP setup as ContactClient.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const root = headlineRef.current;
      if (!root) return;
      const label = root.querySelector<HTMLElement>(".work-label");
      const headline = root.querySelector<HTMLElement>(".work-headline");
      const sub = root.querySelector<HTMLElement>(".work-sub");

      if (label)
        gsap.from(label, {
          clipPath: "inset(0 100% 0 0)",
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 85%" },
        });
      if (headline)
        gsap.from(headline, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          delay: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 85%" },
        });
      if (sub)
        gsap.from(sub, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          delay: 0.25,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 85%" },
        });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        .work-row {
          position: relative;
          display: flex;
          align-items: center;
          gap: clamp(1rem, 3vw, 2.5rem);
          width: 100%;
          padding: clamp(1.6rem, 3.5vw, 2.6rem) 0;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          background: transparent;
          border-left: none; border-right: none; border-top: none;
          cursor: pointer;
          text-align: left;
          font-family: var(--font-display);
        }
        .work-row__index {
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.2em;
          color: rgba(0,0,0,0.3);
          width: 3ch;
          flex-shrink: 0;
          transition: color 0.3s ease;
        }
        .work-row__name {
          font-size: clamp(1.8rem, 5.5vw, 4.5rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1;
          color: rgba(0,0,0,0.78);
          transition: color 0.3s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .work-row__excerpt {
          margin-top: 0.6rem;
          font-size: clamp(0.82rem, 1.4vw, 1rem);
          font-weight: 400;
          color: rgba(0,0,0,0.4);
          max-width: 48ch;
        }
        .work-row__meta {
          margin-left: auto;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.3rem;
          flex-shrink: 0;
        }
        .work-row__type {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.35);
        }
        .work-row__year {
          font-size: 0.78rem;
          font-weight: 500;
          color: rgba(0,0,0,0.3);
        }
        .work-row__arrow {
          font-size: clamp(1.4rem, 3vw, 2.4rem);
          color: rgba(0,0,0,0.15);
          flex-shrink: 0;
          transform: translate(0,0);
          transition: color 0.3s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .work-row.is-active .work-row__name { color: #0a0a0a; transform: translateX(8px); }
        .work-row.is-active .work-row__arrow { transform: translate(6px,-6px); }
        .work-row__thumb {
          display: none;
        }
        @media (max-width: 767px) {
          .work-row { gap: 0.9rem; flex-wrap: wrap; }
          .work-row__meta { margin-left: 0; align-items: flex-start; width: 100%; flex-direction: row; gap: 0.9rem; }
          .work-row__arrow { display: none; }
          /* On touch, show a static thumbnail since there's no cursor-follow preview */
          .work-row__thumb {
            display: block;
            width: 100%;
            height: 200px;
            object-fit: cover;
            object-position: top center;
            margin-top: 1rem;
            border-radius: 3px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          }
        }
        .work-float {
          position: fixed;
          top: 0; left: 0;
          width: 320px;
          z-index: 40;
          pointer-events: none;
          will-change: transform;
        }
        @media (max-width: 767px) { .work-float { display: none; } }
        .work-float__frame {
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.25);
        }
        .work-float__img {
          display: block;
          width: 100%;
          height: 240px;
          object-fit: cover;
          object-position: top center;
        }

        /* ── Featured news: xadaHub launch ── */
        .hub-feature__eyebrow {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: clamp(1.25rem, 3vw, 1.75rem);
        }
        .hub-feature__eyebrow-text {
          font-size: 0.62rem; font-weight: 900; letter-spacing: 0.35em;
          text-transform: uppercase; color: rgba(0,0,0,0.32); white-space: nowrap;
        }
        .hub-feature__eyebrow-rule { flex: 1; height: 1px; background: rgba(0,0,0,0.08); }

        .hub-feature {
          display: block;
          width: 100%;
          max-width: 1000px;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 5px;
          overflow: hidden;
          background: #fff;
          cursor: pointer;
          text-align: left;
          padding: 0;
          font-family: var(--font-display);
          transition: border-color 0.4s ease, box-shadow 0.4s ease,
                      transform 0.55s cubic-bezier(0.16,1,0.3,1);
        }
        .hub-feature:hover {
          transform: translateY(-6px);
          border-color: rgba(167,139,250,0.3);
          animation: proj-glow 2.5s linear infinite;
        }
        .hub-feature__media { display: block; width: 100%; }
        .hub-feature__media img { display: block; width: 100%; height: auto; }
        .hub-feature__bar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem;
          padding: clamp(0.95rem, 2vw, 1.3rem) clamp(1.1rem, 2.5vw, 1.5rem);
          border-top: 1px solid rgba(0,0,0,0.08);
        }
        .hub-feature__label {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-size: 0.6rem; font-weight: 800; letter-spacing: 0.22em;
          text-transform: uppercase; color: rgba(0,0,0,0.45);
        }
        .hub-feature__dot {
          width: 7px; height: 7px; border-radius: 50%; background: #a78bfa;
          animation: hub-pulse 2.4s cubic-bezier(0.16,1,0.3,1) infinite;
        }
        @keyframes hub-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(167,139,250,0.5); }
          70%  { box-shadow: 0 0 0 9px rgba(167,139,250,0); }
          100% { box-shadow: 0 0 0 0 rgba(167,139,250,0); }
        }
        .hub-feature__cta {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: #0a0a0a; white-space: nowrap;
        }
        .hub-feature__cta-arrow {
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
          color: #a78bfa;
        }
        .hub-feature:hover .hub-feature__cta-arrow { transform: translate(5px, -5px); }
        @media (max-width: 520px) {
          .hub-feature__bar { flex-direction: column; align-items: flex-start; gap: 0.6rem; }
        }
      `}</style>

      <main
        ref={sectionRef}
        onMouseMove={onMouseMove}
        style={{
          minHeight: "100svh",
          background: "#ffffff",
          fontFamily: "var(--font-display)",
          paddingTop: "clamp(6rem, 12vh, 10rem)",
          paddingBottom: "clamp(5rem, 10vh, 8rem)",
        }}
      >
        {/* ── Floating cursor-following preview ── */}
        <motion.div className="work-float" style={{ x: imgX, y: imgY }}>
          <AnimatePresence mode="wait">
            {active !== null && (
              <motion.div
                key={active}
                style={{ rotate: CASE_STUDIES[active].rotate }}
                initial={{ opacity: 0, scale: 0.88, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
                transition={{ duration: 0.28, ease: EXPO }}
              >
                <div className="work-float__frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={CASE_STUDIES[active].cover}
                    alt={CASE_STUDIES[active].name}
                    className="work-float__img"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Intro ── */}
        <div
          ref={headlineRef}
          style={{
            paddingLeft: "clamp(1.5rem, 4vw, 4rem)",
            paddingRight: "clamp(1.5rem, 4vw, 4rem)",
            marginBottom: "clamp(3.5rem, 8vh, 6rem)",
          }}
        >
          <span
            className="work-label"
            style={{
              display: "block",
              fontSize: "0.63rem",
              fontWeight: 900,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.32)",
              marginBottom: "1.5rem",
            }}
          >
            Selected Work
          </span>
          <h1
            className="work-headline"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              color: "#0a0a0a",
              margin: "0 0 clamp(1.25rem, 3vw, 2rem)",
              maxWidth: "16ch",
            }}
          >
            Case studies,
            <br />
            not screenshots.
          </h1>
          <p
            className="work-sub"
            style={{
              fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "rgba(0,0,0,0.45)",
              maxWidth: "460px",
              margin: 0,
            }}
          >
            A look at how we think — the problem, the approach, and the results
            behind each build. Hover to preview, click to read the story.
          </p>
        </div>

        {/* ── Featured news: xadaHub launch announcement ── */}
        <div
          style={{
            paddingLeft: "clamp(1.5rem, 4vw, 4rem)",
            paddingRight: "clamp(1.5rem, 4vw, 4rem)",
            marginBottom: "clamp(3.5rem, 8vh, 6rem)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: EXPO }}
          >
            <div className="hub-feature__eyebrow">
              <span className="hub-feature__eyebrow-text">Latest</span>
              <span className="hub-feature__eyebrow-rule" />
            </div>
            <button
              type="button"
              className="hub-feature"
              onClick={() => navigateTo(HUB.href, HUB.title)}
              aria-label={`${HUB.title} — read the announcement`}
            >
              <span className="hub-feature__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={HUB.banner} alt="Introducing xadaHub — coming soon" />
              </span>
              <span className="hub-feature__bar">
                <span className="hub-feature__label">
                  <span className="hub-feature__dot" aria-hidden="true" />
                  News · Coming soon
                </span>
                <span className="hub-feature__cta">
                  Read the announcement
                  <span className="hub-feature__cta-arrow" aria-hidden="true">↗</span>
                </span>
              </span>
            </button>
          </motion.div>
        </div>

        {/* ── Listing ── */}
        <div
          style={{
            paddingLeft: "clamp(1.5rem, 4vw, 4rem)",
            paddingRight: "clamp(1.5rem, 4vw, 4rem)",
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {CASE_STUDIES.map((study, i) => (
            <motion.button
              key={study.slug}
              type="button"
              className={`work-row${active === i ? " is-active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => navigateTo(`/work/${study.slug}`, study.name)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.07, ease: EXPO }}
            >
              <span
                className="work-row__index"
                style={{ color: active === i ? study.accent : undefined }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <span className="work-row__name">{study.name}</span>
                <span className="work-row__excerpt">{study.excerpt}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={study.cover} alt={study.name} className="work-row__thumb" />
              </span>

              <span className="work-row__meta">
                <span className="work-row__type" style={{ color: active === i ? study.accent : undefined }}>
                  {study.type}
                </span>
                <span className="work-row__year">{study.year}</span>
              </span>

              <span
                className="work-row__arrow"
                style={{ color: active === i ? study.accent : undefined }}
                aria-hidden="true"
              >
                ↗
              </span>
            </motion.button>
          ))}
        </div>
      </main>
    </>
  );
}
