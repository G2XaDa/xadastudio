"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TEAM = [
  {
    name: "Jon",
    role: "Client Relations & Strategy",
    email: "jon@xadastudio.com",
    accent: "#c084fc",
    initial: "J",
    index: "01",
    tags: ["Strategy", "Client Relations", "Communication", "Brand Narrative", "Partnerships"],
  },
  {
    name: "Titas",
    role: "Developer & Founder",
    email: "titas@xadastudio.com",
    accent: "#818cf8",
    initial: "T",
    index: "02",
    tags: ["Next.js", "TypeScript", "WebGL", "Three.js", "GSAP", "UI Engineering"],
  },
  {
    name: "Matas",
    role: "Head of Marketing & Ops",
    email: "matas@xadastudio.com",
    accent: "#38bdf8",
    initial: "M",
    index: "03",
    tags: ["Growth", "SEO", "Ops", "Funnels", "Notion", "Paid Ads"],
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

export default function TeamPage() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>(Array(3).fill(null));
  const fillRefs    = useRef<(HTMLDivElement | null)[]>(Array(3).fill(null));

  const [hoveredCard,  setHoveredCard]  = useState<number | null>(null);
  const [hoveredEmail, setHoveredEmail] = useState<number | null>(null);

  // ── Entrance animations ─────────────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        const label    = headlineRef.current.querySelector<HTMLElement>(".team-label");
        const headline = headlineRef.current.querySelector<HTMLElement>(".team-headline");

        if (label) gsap.from(label, {
          clipPath: "inset(0 100% 0 0)", opacity: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: headlineRef.current, start: "top 85%" },
        });

        if (headline) gsap.from(headline, {
          y: 40, opacity: 0, duration: 0.9, delay: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: headlineRef.current, start: "top 85%" },
        });
      }

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 60, opacity: 0, duration: 0.9, delay: i * 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Direction-aware flood fill handlers ─────────────────────────────────
  const handleEnter = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    const fill = fillRefs.current[i];
    const card = cardRefs.current[i];
    if (!fill || !card) return;
    const edge = getEdge(e.clientX, e.clientY, card.getBoundingClientRect());
    fill.style.transition = "none";
    fill.style.clipPath = clipHidden(edge);
    fill.getBoundingClientRect(); // force reflow
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

  return (
    <>
      <style>{`
        .team-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1rem, 2vw, 1.25rem);
          max-width: 1280px;
          margin: 0 auto;
          padding-left: clamp(1.5rem, 4vw, 4rem);
          padding-right: clamp(1.5rem, 4vw, 4rem);
        }
        @media (max-width: 900px) {
          .team-grid { grid-template-columns: 1fr; max-width: 480px; }
        }
        .team-card { position: relative; overflow: hidden; }
        .team-card-fill {
          position: absolute; inset: 0; z-index: 0;
          background: #09090d;
          clip-path: inset(0 100% 0 0);
          pointer-events: none;
        }
        .team-card-content { position: relative; z-index: 1; }
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
            className="team-label"
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
            The Team
          </span>
          <h1
            className="team-headline"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              color: "#0a0a0a",
              margin: 0,
            }}
          >
            Three people.
            <br />
            One studio.
          </h1>
        </div>

        {/* ── Cards ──────────────────────────────────────────────────────── */}
        <div className="team-grid">
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="team-card"
              onMouseEnter={(e) => handleEnter(e, i)}
              onMouseLeave={(e) => handleLeave(e, i)}
              style={{
                border: `1px solid ${hoveredCard === i ? member.accent + "55" : "rgba(0,0,0,0.08)"}`,
                borderRadius: "2px",
                padding: "clamp(1.5rem, 2.5vw, 2rem)",
                transition: "border-color 0.35s ease",
                cursor: "default",
              }}
            >
              {/* Direction-aware dark fill */}
              <div
                ref={(el) => { fillRefs.current[i] = el; }}
                className="team-card-fill"
              />

              <div className="team-card-content" style={{ display: "flex", flexDirection: "column", gap: "0" }}>

                {/* Top row: index + arrow */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.25em",
                      color: hoveredCard === i ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {member.index}
                  </span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: hoveredCard === i ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.2)",
                      transform: hoveredCard === i ? "translateX(4px)" : "none",
                      transition: "color 0.3s ease, transform 0.3s ease",
                    }}
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>

                {/* Giant monogram */}
                <div
                  aria-hidden="true"
                  style={{
                    fontSize: "clamp(6rem, 10vw, 8.5rem)",
                    fontWeight: 900,
                    lineHeight: 0.9,
                    letterSpacing: "-0.05em",
                    color: member.accent,
                    userSelect: "none",
                    marginBottom: "clamp(1.25rem, 2.5vw, 1.75rem)",
                    filter: hoveredCard === i
                      ? `drop-shadow(0 0 28px ${member.accent}88)`
                      : "none",
                    transition: "filter 0.4s ease",
                  }}
                >
                  {member.initial}
                </div>

                {/* Name */}
                <h2
                  style={{
                    fontSize: "clamp(1.75rem, 3vw, 2.4rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    color: hoveredCard === i ? "#ffffff" : "#0a0a0a",
                    margin: "0 0 0.35rem",
                    lineHeight: 1,
                    transition: "color 0.3s ease",
                  }}
                >
                  {member.name}
                </h2>

                {/* Role */}
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: hoveredCard === i ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.3)",
                    marginBottom: "clamp(1.25rem, 2.5vw, 1.75rem)",
                    display: "block",
                    transition: "color 0.3s ease",
                  }}
                >
                  {member.role}
                </span>

                {/* Rule */}
                <div
                  style={{
                    height: "1px",
                    background: hoveredCard === i ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                    marginBottom: "clamp(1rem, 2vw, 1.25rem)",
                    transition: "background 0.3s ease",
                  }}
                />

                {/* Expertise */}
                <span
                  style={{
                    fontSize: "0.55rem",
                    fontWeight: 900,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: hoveredCard === i ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.2)",
                    display: "block",
                    marginBottom: "0.6rem",
                    transition: "color 0.3s ease",
                  }}
                >
                  Expertise
                </span>

                {/* Skills as dot-separated flowing text */}
                <p
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    lineHeight: 1.8,
                    color: hoveredCard === i ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
                    margin: "0 0 clamp(1.25rem, 2.5vw, 1.75rem)",
                    letterSpacing: "0.01em",
                    transition: "color 0.3s ease",
                  }}
                >
                  {member.tags.map((tag, t) => (
                    <span key={tag}>
                      {tag}
                      {t < member.tags.length - 1 && (
                        <span
                          style={{ color: member.accent, margin: "0 0.4em", fontWeight: 900 }}
                          aria-hidden="true"
                        >
                          ·
                        </span>
                      )}
                    </span>
                  ))}
                </p>

                {/* Email row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: `1px solid ${hoveredCard === i ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)"}`,
                    paddingTop: "0.9rem",
                    marginTop: "auto",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <a
                    href={`mailto:${member.email}`}
                    onMouseEnter={() => setHoveredEmail(i)}
                    onMouseLeave={() => setHoveredEmail(null)}
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 500,
                      letterSpacing: "0.02em",
                      fontFamily: "monospace",
                      color: hoveredEmail === i
                        ? (hoveredCard === i ? "#ffffff" : member.accent)
                        : (hoveredCard === i ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.38)"),
                      textDecoration: "none",
                    }}
                  >
                    {member.email}
                  </a>
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: `1px solid ${hoveredCard === i ? member.accent + "55" : "rgba(0,0,0,0.1)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      color: hoveredCard === i ? member.accent : "rgba(0,0,0,0.25)",
                      transition: "border-color 0.3s ease, color 0.3s ease",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* ── Join CTA ───────────────────────────────────────────────────── */}
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
                We&apos;re growing
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
                Want to be part
                <br />
                of the studio?
              </h2>
            </div>

            <a
              href="/careers"
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
                (e.currentTarget as HTMLAnchorElement).style.background = "#0a0a0a";
                (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#0a0a0a";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color = "#0a0a0a";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,0,0,0.15)";
              }}
            >
              View open roles
              <span style={{ fontSize: "1rem" }} aria-hidden="true">→</span>
            </a>
          </div>
        </div>

      </main>
    </>
  );
}
