"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ROLES = [
  {
    index: "01",
    title: "Business Development Rep",
    type: "Part-time / Remote",
    accent: "#c084fc",
    description:
      "We need a sharp, driven person to help us find and land new clients. Your job is outreach — identifying potential clients, crafting cold emails and DMs that actually get replies, and booking calls for us to close. If you're hungry, persuasive, and love the chase, this is for you.",
    responsibilities: [
      "Identify and research potential clients across target industries",
      "Execute cold outreach via email, LinkedIn, and DMs",
      "Book discovery calls and hand off warm leads",
      "Track outreach activity and iterate on messaging",
    ],
    requirements: [
      "Strong written communication skills",
      "Self-starter — no hand-holding needed",
      "Familiarity with cold outreach tools (Apollo, Instantly, etc.)",
      "Previous sales or outreach experience is a plus",
    ],
  },
  {
    index: "02",
    title: "Social Media Manager",
    type: "Part-time / Remote",
    accent: "#818cf8",
    description:
      "We want someone to own our social presence from end to end — content ideas, copy, visuals, scheduling, and growth. You'll be the voice of Xada Studio across platforms, turning our work and thinking into content that attracts the right clients.",
    responsibilities: [
      "Plan and execute content across Instagram, LinkedIn, and X",
      "Create short-form video, carousels, and written posts",
      "Grow our following and engagement organically",
      "Track analytics and double down on what works",
    ],
    requirements: [
      "Eye for design and strong copywriting instincts",
      "Proven track record growing a brand or personal account",
      "Comfortable with short-form video (Reels, TikTok-style)",
      "Understanding of B2B and agency positioning is a big plus",
    ],
  },
  {
    index: "03",
    title: "Web Developer",
    type: "Project-based / Remote",
    accent: "#38bdf8",
    description:
      "We're looking for a developer who can build premium, production-grade web experiences alongside our team. You should be comfortable with modern tooling, have a sharp eye for detail, and care as much about the craft as we do.",
    responsibilities: [
      "Build and ship client projects with Next.js, React, and TypeScript",
      "Implement animations and interactions using GSAP and Framer Motion",
      "Collaborate with design to bring pixel-perfect UIs to life",
      "Work with AI tooling including Claude and the Anthropic API",
    ],
    requirements: [
      "Strong proficiency in Next.js, React, and TypeScript",
      "Experience with GSAP, Framer Motion, or Three.js",
      "Comfort working with AI APIs (Claude, OpenAI)",
      "Clean code habits and attention to detail",
    ],
  },
] as const;

type Edge = "top" | "right" | "bottom" | "left";

function getEdge(clientX: number, clientY: number, rect: DOMRect): Edge {
  const x = clientX - rect.left, y = clientY - rect.top;
  const min = Math.min(y, rect.height - y, x, rect.width - x);
  if (min === y)               return "top";
  if (min === rect.height - y) return "bottom";
  if (min === x)               return "left";
  return "right";
}

function clipHidden(edge: Edge) {
  if (edge === "top")    return "inset(0 0 100% 0)";
  if (edge === "bottom") return "inset(100% 0 0 0)";
  if (edge === "left")   return "inset(0 100% 0 0)";
  return "inset(0 0 0 100%)";
}

export default function CareersPage() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>(Array(3).fill(null));
  const fillRefs    = useRef<(HTMLDivElement | null)[]>(Array(3).fill(null));

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [openCard,    setOpenCard]    = useState<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        const label    = headlineRef.current.querySelector<HTMLElement>(".careers-label");
        const headline = headlineRef.current.querySelector<HTMLElement>(".careers-headline");
        const sub      = headlineRef.current.querySelector<HTMLElement>(".careers-sub");

        if (label) gsap.from(label, {
          clipPath: "inset(0 100% 0 0)", opacity: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: headlineRef.current, start: "top 85%" },
        });
        if (headline) gsap.from(headline, {
          y: 40, opacity: 0, duration: 0.9, delay: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: headlineRef.current, start: "top 85%" },
        });
        if (sub) gsap.from(sub, {
          y: 20, opacity: 0, duration: 0.7, delay: 0.25, ease: "power3.out",
          scrollTrigger: { trigger: headlineRef.current, start: "top 85%" },
        });
      }

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 60, opacity: 0, duration: 0.9, delay: i * 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    const fill = fillRefs.current[i];
    const card = cardRefs.current[i];
    if (!fill || !card) return;
    const edge = getEdge(e.clientX, e.clientY, card.getBoundingClientRect());
    fill.style.transition = "none";
    fill.style.clipPath = clipHidden(edge);
    fill.getBoundingClientRect();
    fill.style.transition = "clip-path 0.55s cubic-bezier(0.16,1,0.3,1)";
    fill.style.clipPath = "inset(0 0 0 0)";
    setHoveredCard(i);
  };

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    const fill = fillRefs.current[i];
    const card = cardRefs.current[i];
    if (!fill || !card) return;
    const edge = getEdge(e.clientX, e.clientY, card.getBoundingClientRect());
    fill.style.transition = "clip-path 0.45s cubic-bezier(0.4,0,1,1)";
    fill.style.clipPath = clipHidden(edge);
    setHoveredCard(null);
  };

  const h = hoveredCard;

  return (
    <>
      <style>{`
        .careers-card { position: relative; overflow: hidden; cursor: pointer; }
        .careers-card-fill {
          position: absolute; inset: 0; z-index: 0;
          background: #09090d;
          clip-path: inset(0 100% 0 0);
          pointer-events: none;
        }
        .careers-card-content { position: relative; z-index: 1; }
        .careers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1rem, 2vw, 1.25rem);
          max-width: 1280px;
          margin: 0 auto;
          padding-left: clamp(1.5rem, 4vw, 4rem);
          padding-right: clamp(1.5rem, 4vw, 4rem);
        }
        @media (max-width: 1024px) {
          .careers-grid { grid-template-columns: 1fr; max-width: 600px; }
        }
        .role-detail-section {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .role-detail-section.open {
          max-height: 600px;
        }
      `}</style>

      <main
        ref={sectionRef}
        style={{
          minHeight: "100svh",
          background: "#ffffff",
          fontFamily: "var(--font-display)",
          paddingTop: "clamp(6rem, 12vh, 10rem)",
          paddingBottom: "clamp(5rem, 10vh, 8rem)",
        }}
      >
        {/* ── Intro ──────────────────────────────────────────────────────── */}
        <div
          ref={headlineRef}
          style={{
            textAlign: "center",
            paddingLeft: "clamp(1.5rem, 4vw, 4rem)",
            paddingRight: "clamp(1.5rem, 4vw, 4rem)",
            marginBottom: "clamp(4rem, 8vh, 7rem)",
          }}
        >
          <span
            className="careers-label"
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
            Careers
          </span>
          <h1
            className="careers-headline"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              color: "#0a0a0a",
              margin: "0 0 clamp(1.25rem, 3vw, 2rem)",
            }}
          >
            Build with us.
          </h1>
          <p
            className="careers-sub"
            style={{
              fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "rgba(0,0,0,0.45)",
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            We&apos;re a small, focused studio that moves fast and works on
            interesting problems. Here&apos;s what we&apos;re looking for right now.
          </p>
        </div>

        {/* ── Role Cards ─────────────────────────────────────────────────── */}
        <div className="careers-grid">
          {ROLES.map((role, i) => (
            <div
              key={role.title}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="careers-card"
              onMouseEnter={(e) => handleEnter(e, i)}
              onMouseLeave={(e) => handleLeave(e, i)}
              onClick={() => setOpenCard(openCard === i ? null : i)}
              style={{
                border: `1px solid ${h === i ? role.accent + "55" : "rgba(0,0,0,0.08)"}`,
                borderRadius: "2px",
                padding: "clamp(1.5rem, 2.5vw, 2rem)",
                transition: "border-color 0.35s ease",
              }}
            >
              {/* Dark fill */}
              <div
                ref={(el) => { fillRefs.current[i] = el; }}
                className="careers-card-fill"
              />

              <div className="careers-card-content">
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem" }}>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.25em",
                      color: h === i ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {role.index}
                  </span>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "0.3rem 0.65rem",
                      borderRadius: "100px",
                      border: `1px solid ${h === i ? role.accent + "55" : role.accent + "33"}`,
                      color: h === i ? role.accent : role.accent,
                      background: h === i ? role.accent + "15" : role.accent + "0d",
                      transition: "border-color 0.3s ease, background 0.3s ease",
                    }}
                  >
                    {role.type}
                  </span>
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.05,
                    color: h === i ? "#ffffff" : "#0a0a0a",
                    margin: "0 0 0.75rem",
                    transition: "color 0.3s ease",
                  }}
                >
                  {role.title}
                </h2>

                {/* Description */}
                <p
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 400,
                    lineHeight: 1.75,
                    color: h === i ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.48)",
                    margin: "0 0 1.5rem",
                    transition: "color 0.3s ease",
                  }}
                >
                  {role.description}
                </p>

                {/* Expandable detail */}
                <div className={`role-detail-section${openCard === i ? " open" : ""}`}>
                  <div style={{ paddingBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {/* Responsibilities */}
                    <div>
                      <span
                        style={{
                          fontSize: "0.55rem",
                          fontWeight: 900,
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                          color: h === i ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)",
                          display: "block",
                          marginBottom: "0.6rem",
                          transition: "color 0.3s ease",
                        }}
                      >
                        What you&apos;ll do
                      </span>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        {role.responsibilities.map((r) => (
                          <li
                            key={r}
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 400,
                              lineHeight: 1.6,
                              color: h === i ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                              paddingLeft: "1rem",
                              position: "relative",
                              transition: "color 0.3s ease",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                left: 0,
                                color: role.accent,
                                fontWeight: 900,
                              }}
                              aria-hidden="true"
                            >·</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirements */}
                    <div>
                      <span
                        style={{
                          fontSize: "0.55rem",
                          fontWeight: 900,
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                          color: h === i ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)",
                          display: "block",
                          marginBottom: "0.6rem",
                          transition: "color 0.3s ease",
                        }}
                      >
                        What we need
                      </span>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        {role.requirements.map((r) => (
                          <li
                            key={r}
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 400,
                              lineHeight: 1.6,
                              color: h === i ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                              paddingLeft: "1rem",
                              position: "relative",
                              transition: "color 0.3s ease",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                left: 0,
                                color: role.accent,
                                fontWeight: 900,
                              }}
                              aria-hidden="true"
                            >·</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bottom row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: `1px solid ${h === i ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)"}`,
                    paddingTop: "0.9rem",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: h === i ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {openCard === i ? "Show less" : "See details"}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: h === i ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.2)",
                      transform: openCard === i ? "rotate(90deg)" : "none",
                      transition: "color 0.3s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                    }}
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Apply CTA ──────────────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "clamp(5rem, 10vh, 8rem) auto 0",
            paddingLeft: "clamp(1.5rem, 4vw, 4rem)",
            paddingRight: "clamp(1.5rem, 4vw, 4rem)",
          }}
        >
          <div
            style={{
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "2px",
              padding: "clamp(2.5rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "0.63rem",
                  fontWeight: 900,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: "rgba(0,0,0,0.3)",
                  marginBottom: "1rem",
                }}
              >
                Ready to apply?
              </span>
              <h2
                style={{
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.0,
                  color: "#0a0a0a",
                  margin: 0,
                }}
              >
                Drop us a line.
                <br />
                We&apos;d love to hear from you.
              </h2>
            </div>

            <a
              href="mailto:hello@xadastudio.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "1rem 1.75rem",
                border: "1px solid rgba(0,0,0,0.15)",
                borderRadius: "2px",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background 0.25s ease, border-color 0.25s ease, color 0.25s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "#0a0a0a";
                el.style.color = "#ffffff";
                el.style.borderColor = "#0a0a0a";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "transparent";
                el.style.color = "#0a0a0a";
                el.style.borderColor = "rgba(0,0,0,0.15)";
              }}
            >
              hello@xadastudio.com
              <span style={{ fontSize: "1rem" }} aria-hidden="true">→</span>
            </a>
          </div>
        </div>

      </main>
    </>
  );
}
