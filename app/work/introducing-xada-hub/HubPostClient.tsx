"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageTransition } from "@/components/PageTransition";
import { HUB } from "@/lib/hub";

const PAD = "clamp(1.5rem, 4vw, 4rem)";

export default function HubPostClient() {
  const { navigateTo } = usePageTransition();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Hero — plays above the fold, no scroll trigger.
      gsap.from(".hub-kicker", { clipPath: "inset(0 100% 0 0)", opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.1 });
      gsap.from(".hub-title", { y: 50, opacity: 0, duration: 0.9, delay: 0.2, ease: "power3.out" });
      gsap.from(".hub-tagline", { y: 20, opacity: 0, duration: 0.7, delay: 0.4, ease: "power3.out" });
      gsap.from(".hub-status", { y: 16, opacity: 0, duration: 0.6, delay: 0.5, ease: "power3.out" });
      gsap.from(".hub-lede", { y: 24, opacity: 0, duration: 0.8, delay: 0.55, ease: "power3.out" });
      gsap.from(".hub-banner", { clipPath: "inset(0 0 100% 0)", duration: 1.1, delay: 0.35, ease: "power4.out" });

      // Everything below reveals on scroll.
      gsap.utils.toArray<HTMLElement>(".hub-reveal").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".hub-step").forEach((el, i) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.75,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hub-steps", start: "top 85%" },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        .hub-wrap { padding-left: ${PAD}; padding-right: ${PAD}; }

        .hub-title {
          font-size: clamp(3rem, 9vw, 8rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 0.95;
          color: #0a0a0a;
          margin: 0 0 clamp(1.25rem, 3vw, 2rem);
        }
        .hub-title__tail {
          background: linear-gradient(100deg, #c084fc, #818cf8, #38bdf8, #f472b6, #e879f9);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hub-tagline {
          font-size: clamp(1.4rem, 3vw, 2.4rem);
          font-weight: 500;
          line-height: 1.35;
          letter-spacing: -0.02em;
          color: #141414;
          margin: 0;
          max-width: 22ch;
        }

        .hub-status {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: clamp(1.5rem, 3vw, 2rem);
          padding: 0.5rem 0.9rem;
          border: 1px solid rgba(167,139,250,0.35);
          border-radius: 100px;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.55);
        }
        .hub-status__dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 0 0 rgba(167,139,250,0.55);
          animation: hub-pulse 2.4s cubic-bezier(0.16,1,0.3,1) infinite;
        }
        @keyframes hub-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(167,139,250,0.5); }
          70%  { box-shadow: 0 0 0 9px rgba(167,139,250,0); }
          100% { box-shadow: 0 0 0 0 rgba(167,139,250,0); }
        }

        /* Banner with a soft gradient frame + multi-colour glow */
        .hub-banner {
          position: relative;
          width: 100%;
          max-width: 560px;
          border-radius: 6px;
          padding: 2px;
          background: linear-gradient(120deg, #c084fc, #818cf8, #38bdf8, #f472b6, #e879f9);
          box-shadow: 0 30px 90px rgba(129,140,248,0.18), 0 10px 40px rgba(244,114,182,0.12);
        }
        .hub-banner__inner {
          border-radius: 5px;
          overflow: hidden;
          background: #fff;
        }
        .hub-banner img {
          display: block;
          width: 100%;
          height: auto;
        }

        /* Hero row — lede on the left, banner filling the right */
        .hub-hero-row {
          display: grid;
          grid-template-columns: 1fr minmax(0, 560px);
          gap: clamp(2rem, 5vw, 4.5rem);
          align-items: center;
        }
        @media (max-width: 860px) {
          .hub-hero-row { grid-template-columns: 1fr; gap: clamp(1.5rem, 5vw, 2.5rem); }
          .hub-hero-row .hub-banner { order: -1; }
        }

        .hub-lede {
          font-size: clamp(1.4rem, 2.6vw, 2.1rem);
          font-weight: 500;
          line-height: 1.4;
          letter-spacing: -0.02em;
          color: #0a0a0a;
          margin: 0;
          max-width: 30ch;
        }

        .hub-section-label {
          display: block;
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.3);
          margin-bottom: clamp(1.5rem, 4vw, 2.25rem);
        }

        .hub-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(1.5rem, 3vw, 2.5rem);
        }
        @media (max-width: 900px) { .hub-steps { grid-template-columns: 1fr 1fr; gap: 2rem; } }
        @media (max-width: 520px) { .hub-steps { grid-template-columns: 1fr; } }
        .hub-step { border-top: 1px solid rgba(0,0,0,0.12); padding-top: 1.1rem; }
        .hub-step__num {
          font-size: 0.7rem; font-weight: 900; letter-spacing: 0.15em;
          background: linear-gradient(100deg, #818cf8, #f472b6);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          font-variant-numeric: tabular-nums;
        }
        .hub-step__title {
          margin: 0.8rem 0 0.5rem;
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          font-weight: 800; letter-spacing: -0.02em; color: #0a0a0a;
        }
        .hub-step__desc {
          margin: 0; font-size: 0.92rem; line-height: 1.6; color: rgba(0,0,0,0.5);
        }

        .hub-powered {
          display: flex; flex-wrap: wrap; gap: 0.6rem;
        }
        .hub-chip {
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.02em;
          color: rgba(0,0,0,0.6);
          padding: 0.5rem 1rem;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 100px;
        }

        .hub-manifesto {
          font-size: clamp(1.25rem, 2.4vw, 1.9rem);
          font-weight: 500; line-height: 1.5; letter-spacing: -0.015em;
          color: #141414; margin: 0; max-width: 34ch;
        }
        .hub-manifesto strong { color: #0a0a0a; font-weight: 800; }

        .hub-socials { display: flex; flex-wrap: wrap; gap: clamp(0.75rem, 2vw, 1rem); }
        .hub-social {
          display: flex; flex-direction: column; gap: 0.35rem;
          padding: clamp(1.1rem, 2.5vw, 1.5rem);
          border: 1px solid rgba(0,0,0,0.08); border-radius: 3px;
          text-decoration: none; min-width: 180px; flex: 1;
          transition: border-color 0.25s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .hub-social:hover { border-color: rgba(167,139,250,0.4); transform: translateY(-3px); }
        .hub-social__label {
          font-size: 0.58rem; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: rgba(0,0,0,0.3);
        }
        .hub-social__handle {
          font-size: clamp(1rem, 2vw, 1.3rem); font-weight: 700;
          letter-spacing: -0.01em; color: rgba(0,0,0,0.7);
        }

        .hub-link { background: transparent; border: none; cursor: pointer; padding: 0; font-family: var(--font-display); }
        .hub-back-name {
          font-size: clamp(2.5rem, 9vw, 7rem); font-weight: 900;
          letter-spacing: -0.04em; line-height: 1; color: #0a0a0a;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); display: inline-block;
        }
        .hub-back-link:hover .hub-back-name { transform: translateX(14px); }
      `}</style>

      <main
        ref={rootRef}
        style={{
          background: "#ffffff",
          fontFamily: "var(--font-display)",
          paddingTop: "clamp(6rem, 12vh, 9rem)",
          paddingBottom: "clamp(4rem, 9vh, 7rem)",
        }}
      >
        {/* ── Back ── */}
        <div className="hub-wrap" style={{ marginBottom: "clamp(2.5rem, 6vh, 4rem)" }}>
          <button
            type="button"
            className="hub-link"
            onClick={() => navigateTo("/work", "Work")}
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.4)",
              transition: "color 0.25s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0a0a")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,0,0,0.4)")}
          >
            ← All Work
          </button>
        </div>

        {/* ── Header ── */}
        <header className="hub-wrap" style={{ marginBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
          <span
            className="hub-kicker"
            style={{
              display: "block",
              fontSize: "0.63rem",
              fontWeight: 900,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#a78bfa",
              marginBottom: "1.5rem",
            }}
          >
            {HUB.kicker} · {HUB.date}
          </span>
          <h1 className="hub-title">
            Introducing {HUB.brandLead}
            <span className="hub-title__tail">{HUB.brandTail}</span>
          </h1>
          <p className="hub-tagline">{HUB.tagline}</p>
          <div className="hub-status">
            <span className="hub-status__dot" aria-hidden="true" />
            {HUB.status}
          </div>
        </header>

        {/* ── Hero row: lede + banner ── */}
        <div
          className="hub-wrap hub-hero-row"
          style={{ paddingTop: "clamp(1rem, 3vh, 2.5rem)", marginBottom: "clamp(2.5rem, 7vh, 5rem)" }}
        >
          <p className="hub-lede">
            xadaHub turns a sentence into a live website. {HUB.excerpt}
          </p>
          <div className="hub-banner">
            <div className="hub-banner__inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HUB.banner}
                alt="xadaHub launch banner — build websites, claim domains, and go live just by describing what you want. Powered by AI."
                onLoad={() => {
                  ScrollTrigger.refresh();
                  window.dispatchEvent(new Event("resize"));
                }}
              />
            </div>
          </div>
        </div>

        {/* ── How it works ── */}
        <div className="hub-wrap hub-reveal" style={{ paddingBottom: "clamp(2.5rem, 7vh, 5rem)" }}>
          <span className="hub-section-label">How it works</span>
          <div className="hub-steps">
            {HUB.steps.map((s) => (
              <div className="hub-step" key={s.k}>
                <span className="hub-step__num">{s.k}</span>
                <h3 className="hub-step__title">{s.title}</h3>
                <p className="hub-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Powered by ── */}
        <div
          className="hub-wrap hub-reveal"
          style={{
            paddingTop: "clamp(2.5rem, 6vh, 4rem)",
            paddingBottom: "clamp(2.5rem, 6vh, 4rem)",
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <span className="hub-section-label">Powered by</span>
          <div className="hub-powered">
            {HUB.poweredBy.map((p) => (
              <span className="hub-chip" key={p}>{p}</span>
            ))}
          </div>
        </div>

        {/* ── More than websites ── */}
        <div
          className="hub-wrap hub-reveal"
          style={{
            paddingTop: "clamp(3rem, 8vh, 6rem)",
            paddingBottom: "clamp(3rem, 8vh, 6rem)",
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <span className="hub-section-label">More than websites</span>
          <p className="hub-manifesto">
            Xada Studio designs and builds premium websites — but we&apos;re a{" "}
            <strong>software company</strong> too. We make new things for the internet, and
            xadaHub is the first product we&apos;re shipping to the world. More to come.
          </p>
        </div>

        {/* ── Coming soon + socials ── */}
        <div
          className="hub-wrap hub-reveal"
          style={{
            paddingTop: "clamp(3rem, 7vh, 5rem)",
            paddingBottom: "clamp(3rem, 7vh, 5rem)",
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <span className="hub-section-label">Coming soon — follow along</span>
          <div className="hub-socials">
            {HUB.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hub-social"
              >
                <span className="hub-social__label">{s.label}</span>
                <span className="hub-social__handle">{s.handle}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Back to all work ── */}
        <div
          className="hub-wrap hub-reveal"
          style={{
            borderTop: "1px solid rgba(0,0,0,0.1)",
            paddingTop: "clamp(3rem, 7vh, 5rem)",
            marginTop: "clamp(2rem, 5vh, 4rem)",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "0.62rem",
              fontWeight: 900,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.3)",
              marginBottom: "1.25rem",
            }}
          >
            Back to
          </span>
          <button
            type="button"
            className="hub-link hub-back-link"
            onClick={() => navigateTo("/work", "Work")}
            style={{ display: "block", textAlign: "left" }}
          >
            <span className="hub-back-name">All Work</span>
          </button>
        </div>
      </main>
    </>
  );
}
