"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageTransition } from "@/components/PageTransition";
import type { CaseStudy } from "@/lib/caseStudies";

const PAD = "clamp(1.5rem, 4vw, 4rem)";

const BODY_SECTIONS = [
  { key: "challenge", label: "The Challenge" },
  { key: "approach", label: "The Approach" },
  { key: "outcome", label: "The Outcome" },
] as const;

export default function CaseStudyClient({
  study,
  next,
}: {
  study: CaseStudy;
  next: CaseStudy;
}) {
  const { navigateTo } = usePageTransition();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Hero — clip-path / fade-ups, no scrollTrigger (above the fold).
      gsap.from(".cs-kicker", { clipPath: "inset(0 100% 0 0)", opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.1 });
      gsap.from(".cs-title", { y: 50, opacity: 0, duration: 0.9, delay: 0.2, ease: "power3.out" });
      gsap.from(".cs-tag", { y: 16, opacity: 0, duration: 0.6, delay: 0.4, stagger: 0.06, ease: "power3.out" });
      gsap.from(".cs-cover", {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.1,
        delay: 0.35,
        ease: "power4.out",
      });

      // Everything below reveals on scroll.
      gsap.utils.toArray<HTMLElement>(".cs-reveal").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".cs-gallery-item").forEach((el) => {
        gsap.from(el, {
          clipPath: "inset(0 0 100% 0)",
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [study.slug]);

  return (
    <>
      <style>{`
        .cs-wrap { padding-left: ${PAD}; padding-right: ${PAD}; }
        .cs-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(1.25rem, 3vw, 2.5rem);
          padding: clamp(1.75rem, 4vw, 2.75rem) 0;
          border-top: 1px solid rgba(0,0,0,0.1);
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        @media (max-width: 720px) { .cs-meta-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; } }
        .cs-meta-label {
          display: block;
          font-size: 0.58rem; font-weight: 900; letter-spacing: 0.28em;
          text-transform: uppercase; color: rgba(0,0,0,0.3);
          margin-bottom: 0.6rem;
        }
        .cs-meta-value {
          font-size: clamp(0.95rem, 1.6vw, 1.15rem); font-weight: 600;
          letter-spacing: -0.01em; color: #0a0a0a; line-height: 1.4;
        }
        .cs-body-row {
          display: grid;
          grid-template-columns: minmax(0, 22ch) 1fr;
          gap: clamp(1.5rem, 5vw, 5rem);
          padding: clamp(3rem, 7vh, 5.5rem) 0;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }
        @media (max-width: 720px) { .cs-body-row { grid-template-columns: 1fr; gap: 1rem; } }
        .cs-body-label {
          font-size: 0.62rem; font-weight: 900; letter-spacing: 0.3em;
          text-transform: uppercase; color: rgba(0,0,0,0.3);
          position: sticky; top: 6rem; align-self: start;
        }
        @media (max-width: 720px) { .cs-body-label { position: static; } }
        .cs-body-text {
          font-size: clamp(1.25rem, 2.4vw, 1.9rem); font-weight: 500;
          line-height: 1.45; letter-spacing: -0.015em; color: #141414;
          margin: 0; max-width: 30ch;
        }
        .cs-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1.5rem, 4vw, 3rem);
          padding: clamp(3.5rem, 9vh, 6rem) 0;
        }
        @media (max-width: 720px) { .cs-metrics { grid-template-columns: 1fr; gap: 2.5rem; } }
        .cs-metric-value {
          font-size: clamp(2.8rem, 8vw, 6rem); font-weight: 900;
          letter-spacing: -0.04em; line-height: 1;
        }
        .cs-metric-label {
          margin-top: 0.75rem; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase; color: rgba(0,0,0,0.4);
        }
        .cs-cover {
          height: clamp(340px, 68vh, 720px);
          border-radius: 4px; overflow: hidden;
          box-shadow: 0 30px 90px rgba(0,0,0,0.16);
        }
        .cs-cover img {
          display: block; width: 100%; height: 100%;
          object-fit: cover; object-position: top center;
        }
        .cs-gallery-item {
          width: 100%; height: clamp(320px, 58vh, 620px);
          border-radius: 4px; overflow: hidden;
          margin-bottom: clamp(1rem, 3vw, 2rem);
          box-shadow: 0 24px 70px rgba(0,0,0,0.12);
        }
        .cs-gallery-item img {
          display: block; width: 100%; height: 100%;
          object-fit: cover; object-position: top center;
        }
        .cs-link { background: transparent; border: none; cursor: pointer; padding: 0; font-family: var(--font-display); }
        .cs-next-name {
          font-size: clamp(2.5rem, 9vw, 7rem); font-weight: 900;
          letter-spacing: -0.04em; line-height: 1; color: #0a0a0a;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
          display: inline-block;
        }
        .cs-next:hover .cs-next-name { transform: translateX(14px); }
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
        <div className="cs-wrap" style={{ marginBottom: "clamp(2.5rem, 6vh, 4rem)" }}>
          <button
            type="button"
            className="cs-link"
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

        {/* ── Hero ── */}
        <header className="cs-wrap" style={{ marginBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
          <span
            className="cs-kicker"
            style={{
              display: "block",
              fontSize: "0.63rem",
              fontWeight: 900,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: study.accent,
              marginBottom: "1.5rem",
            }}
          >
            {study.client} · {study.year}
          </span>
          <h1
            className="cs-title"
            style={{
              fontSize: "clamp(3rem, 9vw, 8rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 0.98,
              color: "#0a0a0a",
              margin: "0 0 clamp(1.5rem, 3vw, 2.25rem)",
              maxWidth: "16ch",
            }}
          >
            {study.name}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            {study.role.map((r) => (
              <span
                key={r}
                className="cs-tag"
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  color: "rgba(0,0,0,0.55)",
                  padding: "0.45rem 0.9rem",
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: "100px",
                }}
              >
                {r}
              </span>
            ))}
          </div>
        </header>

        {/* ── Cover ── */}
        <div className="cs-wrap" style={{ marginBottom: "clamp(2.5rem, 6vh, 4rem)" }}>
          <div className="cs-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={study.cover}
              alt={study.name}
              onLoad={() => {
                ScrollTrigger.refresh();
                window.dispatchEvent(new Event("resize"));
              }}
            />
          </div>
        </div>

        {/* ── Meta bar ── */}
        <div className="cs-wrap cs-reveal" style={{ marginBottom: "clamp(2.5rem, 6vh, 4rem)" }}>
          <div className="cs-meta-grid">
            <div>
              <span className="cs-meta-label">Client</span>
              <span className="cs-meta-value">{study.client}</span>
            </div>
            <div>
              <span className="cs-meta-label">Services</span>
              <span className="cs-meta-value">{study.role.join(", ")}</span>
            </div>
            <div>
              <span className="cs-meta-label">Year</span>
              <span className="cs-meta-value">{study.year}</span>
            </div>
            <div>
              <span className="cs-meta-label">Live</span>
              {study.liveHref ? (
                <a
                  href={study.liveHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cs-meta-value"
                  style={{ textDecoration: "none", color: study.accent }}
                >
                  Visit site ↗
                </a>
              ) : (
                <span className="cs-meta-value" style={{ color: "rgba(0,0,0,0.3)" }}>
                  —
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Overview ── */}
        <div className="cs-wrap cs-reveal" style={{ padding: "clamp(3rem, 8vh, 6rem) 0" }}>
          <p
            style={{
              fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
              fontWeight: 500,
              lineHeight: 1.4,
              letterSpacing: "-0.02em",
              color: "#0a0a0a",
              margin: 0,
              maxWidth: "24ch",
            }}
          >
            {study.overview}
          </p>
        </div>

        {/* ── Challenge / Approach / Outcome ── */}
        <div className="cs-wrap">
          {BODY_SECTIONS.map(({ key, label }) => (
            <div className="cs-body-row cs-reveal" key={key}>
              <span className="cs-body-label">{label}</span>
              <p className="cs-body-text">{study[key]}</p>
            </div>
          ))}
        </div>

        {/* ── Gallery ── */}
        <div className="cs-wrap" style={{ paddingTop: "clamp(3rem, 7vh, 5rem)" }}>
          {study.gallery.map((src, i) => (
            <div className="cs-gallery-item" key={`${src}-${i}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${study.name} — view ${i + 1}`} />
            </div>
          ))}
        </div>

        {/* ── Metrics ── */}
        <div className="cs-wrap cs-reveal">
          <div className="cs-metrics">
            {study.metrics.map((m) => (
              <div key={m.label}>
                <div className="cs-metric-value" style={{ color: study.accent }}>
                  {m.value}
                </div>
                <div className="cs-metric-label">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Next case study ── */}
        <div
          className="cs-wrap cs-reveal"
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
            Next Case Study
          </span>
          <button
            type="button"
            className="cs-link cs-next"
            onClick={() => navigateTo(`/work/${next.slug}`, next.name)}
            style={{ display: "block", textAlign: "left" }}
          >
            <span className="cs-next-name">{next.name}</span>
          </button>
        </div>
      </main>
    </>
  );
}
