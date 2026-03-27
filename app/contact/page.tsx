"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CONTACTS = [
  {
    label: "General Enquiries",
    email: "hello@xadastudio.com",
    desc: "Got a project in mind? Start here.",
    accent: "#c084fc",
  },
  {
    label: "Careers",
    email: "hello@xadastudio.com",
    desc: "Want to join the team? We'd love to hear from you.",
    accent: "#818cf8",
  },
] as const;

const SOCIALS = [
  { label: "Instagram", handle: "@xadastudio", href: "#" },
  { label: "LinkedIn",  handle: "Xada Studio",  href: "#" },
  { label: "X / Twitter", handle: "@xadastudio", href: "#" },
] as const;

export default function ContactPage() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const rowRefs     = useRef<(HTMLDivElement | null)[]>([]);

  const [hoveredContact, setHoveredContact] = useState<number | null>(null);
  const [hoveredSocial,  setHoveredSocial]  = useState<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        const label    = headlineRef.current.querySelector<HTMLElement>(".contact-label");
        const headline = headlineRef.current.querySelector<HTMLElement>(".contact-headline");
        const sub      = headlineRef.current.querySelector<HTMLElement>(".contact-sub");

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

      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        gsap.from(row, {
          y: 40, opacity: 0, duration: 0.8, delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 90%" },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        .contact-email-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          padding: clamp(1.75rem, 3.5vw, 2.5rem) 0;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          cursor: pointer;
          text-decoration: none;
        }
        .contact-socials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1rem, 2vw, 1.25rem);
        }
        @media (max-width: 640px) {
          .contact-socials-grid { grid-template-columns: 1fr; }
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
            paddingLeft: "clamp(1.5rem, 4vw, 4rem)",
            paddingRight: "clamp(1.5rem, 4vw, 4rem)",
            marginBottom: "clamp(4rem, 8vh, 6rem)",
          }}
        >
          <span
            className="contact-label"
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
            Contact
          </span>
          <h1
            className="contact-headline"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              color: "#0a0a0a",
              margin: "0 0 clamp(1.25rem, 3vw, 2rem)",
              maxWidth: "14ch",
            }}
          >
            Let&apos;s make
            <br />
            something great.
          </h1>
          <p
            className="contact-sub"
            style={{
              fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "rgba(0,0,0,0.45)",
              maxWidth: "420px",
              margin: 0,
            }}
          >
            Tell us about your project and we&apos;ll get back to you within 24 hours.
            No fluff, no sales pitch — just a straight conversation.
          </p>
        </div>

        {/* ── Email rows ─────────────────────────────────────────────────── */}
        <div
          style={{
            paddingLeft: "clamp(1.5rem, 4vw, 4rem)",
            paddingRight: "clamp(1.5rem, 4vw, 4rem)",
            maxWidth: "1280px",
            borderTop: "1px solid rgba(0,0,0,0.07)",
            marginBottom: "clamp(4rem, 8vh, 6rem)",
          }}
        >
          {CONTACTS.map((c, i) => (
            <a
              key={c.label}
              ref={(el) => { rowRefs.current[i] = el as HTMLDivElement | null; }}
              href={`mailto:${c.email}`}
              className="contact-email-row"
              onMouseEnter={() => setHoveredContact(i)}
              onMouseLeave={() => setHoveredContact(null)}
              style={{ color: "inherit" }}
            >
              {/* Left */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 900,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: hoveredContact === i ? c.accent : "rgba(0,0,0,0.3)",
                    transition: "color 0.25s ease",
                  }}
                >
                  {c.label}
                </span>
                <span
                  style={{
                    fontSize: "clamp(1.6rem, 4vw, 3.2rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: hoveredContact === i ? "#0a0a0a" : "rgba(0,0,0,0.75)",
                    transition: "color 0.25s ease",
                  }}
                >
                  {c.email}
                </span>
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 400,
                    color: "rgba(0,0,0,0.35)",
                    transition: "color 0.25s ease",
                  }}
                >
                  {c.desc}
                </span>
              </div>

              {/* Right arrow */}
              <span
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                  color: hoveredContact === i ? c.accent : "rgba(0,0,0,0.15)",
                  transform: hoveredContact === i ? "translate(6px, -6px)" : "translate(0,0)",
                  transition: "color 0.3s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
          ))}
        </div>

        {/* ── Socials ────────────────────────────────────────────────────── */}
        <div
          ref={(el) => { rowRefs.current[CONTACTS.length] = el; }}
          style={{
            paddingLeft: "clamp(1.5rem, 4vw, 4rem)",
            paddingRight: "clamp(1.5rem, 4vw, 4rem)",
            maxWidth: "1280px",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "0.6rem",
              fontWeight: 900,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.28)",
              marginBottom: "1.25rem",
            }}
          >
            Find us online
          </span>

          <div className="contact-socials-grid">
            {SOCIALS.map((s, i) => (
              <a
                key={s.label}
                href={s.href}
                onMouseEnter={() => setHoveredSocial(i)}
                onMouseLeave={() => setHoveredSocial(null)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                  padding: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  border: `1px solid ${hoveredSocial === i ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.07)"}`,
                  borderRadius: "2px",
                  textDecoration: "none",
                  transition: "border-color 0.25s ease",
                }}
              >
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(0,0,0,0.3)",
                  }}
                >
                  {s.label}
                </span>
                <span
                  style={{
                    fontSize: "clamp(1rem, 2vw, 1.35rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: hoveredSocial === i ? "#0a0a0a" : "rgba(0,0,0,0.6)",
                    transition: "color 0.25s ease",
                  }}
                >
                  {s.handle}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: hoveredSocial === i ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)",
                    transform: hoveredSocial === i ? "translateX(4px)" : "none",
                    transition: "color 0.25s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}
