"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── Services + their hover-reveal copy ──────────────────────────────
const SERVICES = [
  {
    title: "Landing Pages",
    tagline: "Your digital storefront, perfected.",
    detail:
      "A single, focused page built around one goal — a clear path from curiosity to conversion, with zero distractions.",
  },
  {
    title: "Business Websites",
    tagline: "Credibility you can feel through a screen.",
    detail:
      "Your brand's permanent home — multi-page, fast, accessible, built to represent you at your best on every device.",
  },
  {
    title: "Ecommerce Stores",
    tagline: "Built to sell. Designed to impress.",
    detail:
      "Custom storefronts that guide customers through desire to checkout — branded, frictionless, optimised for high traffic.",
  },
  {
    title: "Custom Features",
    tagline: "If you can imagine it, we can build it.",
    detail:
      "Configurators, booking systems, dashboards, complex integrations — you spec it, we scope it, we ship it.",
  },
  {
    title: "WebGL & Animation",
    tagline: "The web, but cinematic.",
    detail:
      "Scroll-driven narratives and real-time 3D running natively at 60fps — the kind of thing people screenshot and share.",
  },
  {
    title: "SEO & Performance",
    tagline: "Beautiful and built to be found.",
    detail:
      "Lighthouse 100, Core Web Vitals, structured data — the infrastructure that makes your web investment compound.",
  },
] as const;

// ── 3 capability groups; `services` indexes into SERVICES ───────────
const GROUPS = [
  {
    label: "Build",
    blurb:
      "The foundation — sites and pages engineered to convert, built from scratch with zero templates.",
    services: [0, 1, 2],
  },
  {
    label: "Craft",
    blurb:
      "Where the web stops feeling like a document — bespoke features and real-time motion that make browsers feel alive.",
    services: [3, 4],
  },
  {
    label: "Grow",
    blurb:
      "The infrastructure that compounds — speed, structure and search built in so the work keeps paying off.",
    services: [5],
  },
] as const;

// ── Body-bg colours: page tints through these as the section scrolls ─
const GROUP_BG = ["#321a66", "#16306f", "#4f1a4d"] as const;
const PAGE_BG = "#ffffff";

// 12-point X silhouette, same shape used in the preloader
const X_PATH =
  "M23 47 L47 23 L100 76 L153 23 L177 47 L124 100 L177 153 L153 177 L100 124 L47 177 L23 153 L76 100 Z";

export default function SkillsShowcase(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null); // includes the pin-spacer
  const blurXRef = useRef<HTMLDivElement>(null);

  const [activeGroup, setActiveGroup] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const activeRef = useRef(0); // guards setState in onUpdate

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const wrap = wrapRef.current;
    if (!section || !wrap || !blurXRef.current) return;

    // base transform — GSAP owns the centering so it can also drift it
    gsap.set(blurXRef.current, { xPercent: -50, yPercent: -50 });

    // matchMedia split: pin works fine on desktop but breaks on mobile
    // (iOS dynamic viewport + touch scroll velocity + locomotive-scroll
    // make ScrollTrigger pin "teleport" on touch). Mobile gets a simpler
    // non-pinned per-group reveal that scrolls naturally.
    const mm = gsap.matchMedia();

    // ── DESKTOP / TABLET ≥768px: pinned scrub ─────────────────────────
    mm.add("(min-width: 768px)", () => {
      // IMPORTANT: pin ST first so the pin-spacer is inserted inside
      // .cap-wrap before the bg ST measures the wrap. Otherwise wrap
      // reads as 100vh and the bg timeline finishes early.
      const pinTl = gsap.timeline();
      pinTl.to(
        blurXRef.current!,
        {
          x: "14vw",
          y: "-9vh",
          rotation: 70,
          scale: 1.28,
          ease: "none",
          duration: 2,
        },
        0,
      );

      const pinST = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=260%",
        pin: true,
        scrub: 1.1,
        animation: pinTl,
        onUpdate: (self) => {
          const idx = Math.min(
            GROUPS.length - 1,
            Math.floor(self.progress * GROUPS.length),
          );
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActiveGroup(idx);
          }
        },
      });

      // Wrap now includes the 360vh pin-spacer → bg ST measures right.
      // Phases (4.6 units → 460vh of scroll):
      //   0   → 0.5  entry   white  → violet
      //   0.5 → 1.0  hold    violet
      //   1.0 → 2.3  pin 1→2 violet → blue
      //   2.3 → 3.6  pin 2→3 blue   → plum
      //   3.6 → 4.6  exit    plum   → white
      const bgTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.4,
        },
      });
      bgTl
        .to("body", { backgroundColor: GROUP_BG[0], ease: "none", duration: 0.5 }, 0)
        .to("body", { backgroundColor: GROUP_BG[1], ease: "none", duration: 1.3 }, 1.0)
        .to("body", { backgroundColor: GROUP_BG[2], ease: "none", duration: 1.3 }, 2.3)
        .to("body", { backgroundColor: PAGE_BG, ease: "none", duration: 1.0 }, 3.6);

      ScrollTrigger.refresh();

      return () => {
        bgTl.scrollTrigger?.kill();
        bgTl.kill();
        pinST.kill();
        pinTl.kill();
        gsap.set("body", { backgroundColor: PAGE_BG });
      };
    });

    // ── MOBILE <768px: no pin, body-bg shift + per-group reveal ───────
    mm.add("(max-width: 767px)", () => {
      // Body bg shift across full section visibility
      const bgTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      bgTl
        .to("body", { backgroundColor: GROUP_BG[0], ease: "none", duration: 0.5 }, 0)
        .to("body", { backgroundColor: GROUP_BG[1], ease: "none", duration: 1 }, 1.0)
        .to("body", { backgroundColor: GROUP_BG[2], ease: "none", duration: 1 }, 2.0)
        .to("body", { backgroundColor: PAGE_BG, ease: "none", duration: 0.4 }, 3.4);

      // Subtle blurred-X drift
      const xTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
      xTl.to(blurXRef.current!, {
        x: "8vw",
        y: "-7vh",
        rotation: 50,
        scale: 1.2,
        ease: "none",
        duration: 1,
      });

      // Per-group reveal — each list group adds `.is-revealed` once it
      // scrolls into view, persists. CSS uses .is-revealed alongside
      // .is-active to trigger the bright text wipe on mobile.
      const listGroups = Array.from(
        wrap.querySelectorAll<HTMLDivElement>(".cap-list__group"),
      );
      const groupSTs = listGroups.map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          once: true,
          onEnter: () => el.classList.add("is-revealed"),
        }),
      );

      return () => {
        bgTl.scrollTrigger?.kill();
        bgTl.kill();
        xTl.scrollTrigger?.kill();
        xTl.kill();
        groupSTs.forEach((st) => st.kill());
        gsap.set("body", { backgroundColor: PAGE_BG });
      };
    });

    return () => mm.revert();
  }, []);

  const activeBlurb = GROUPS[activeGroup];
  const hoveredService = hovered !== null ? SERVICES[hovered] : null;

  return (
    <div ref={wrapRef} className="cap-wrap">
    <section
      ref={sectionRef}
      className="cap-section"
      data-dark-nav="true"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {/* big blurred X — our "blob" */}
      <div ref={blurXRef} className="cap-blur-x" aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <defs>
            <linearGradient id="cap-x-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="28%" stopColor="#818cf8" />
              <stop offset="52%" stopColor="#38bdf8" />
              <stop offset="76%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#e879f9" />
            </linearGradient>
          </defs>
          <path d={X_PATH} fill="url(#cap-x-grad)" />
        </svg>
      </div>

      <div className="cap-inner">
        {/* top bar — Capabilities ———— 0X / 03 */}
        <div className="cap-topbar">
          <span className="cap-topbar__label">Capabilities</span>
          <div className="cap-topbar__rule" />
          <span className="cap-topbar__num">
            0{activeGroup + 1} / 0{GROUPS.length}
          </span>
        </div>

        <div className="cap-main">
          {/* ── left rail: groups + hover-reveal detail panel ── */}
          <div className="cap-rail">
            <span className="cap-rail__eyebrow">What we do</span>

            <ul className="cap-groups">
              {GROUPS.map((g, i) => (
                <li
                  key={g.label}
                  className={`cap-group ${i === activeGroup ? "is-active" : ""}`}
                >
                  <span className="cap-group__num">0{i + 1}</span>
                  <span className="cap-group__name">
                    <span className="cap-group__name-dim">{g.label}</span>
                    <span className="cap-group__name-bright" aria-hidden="true">
                      {g.label}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="cap-detail">
              <div
                className="cap-detail__inner"
                key={
                  hovered !== null
                    ? `s${hovered}`
                    : `g${activeGroup}`
                }
              >
                {hoveredService ? (
                  <>
                    <span className="cap-detail__tagline">
                      {hoveredService.tagline}
                    </span>
                    <p className="cap-detail__text">
                      {hoveredService.detail}
                    </p>
                  </>
                ) : (
                  <>
                    <span className="cap-detail__tagline">
                      {activeBlurb.label}
                    </span>
                    <p className="cap-detail__text">{activeBlurb.blurb}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── right: the full service list, grouped ── */}
          <div className="cap-list">
            {GROUPS.map((g, gi) => (
              <div
                key={g.label}
                className={`cap-list__group ${gi === activeGroup ? "is-active" : ""}`}
              >
                {/* mobile-only — desktop shows the group label in the left rail */}
                <div className="cap-list__group-head" aria-hidden="true">
                  <span className="cap-list__group-num">0{gi + 1}</span>
                  <span className="cap-list__group-label">{g.label}</span>
                  <span className="cap-list__group-blurb">{g.blurb}</span>
                </div>
                {g.services.map((si, idx) => (
                  <div
                    key={si}
                    className={`cap-service ${hovered === si ? "is-hovered" : ""}`}
                    style={{ "--i": idx } as React.CSSProperties}
                    onMouseEnter={() => setHovered(si)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <span className="cap-service__title">
                      <span className="cap-service__title-dim">
                        {SERVICES[si].title}
                      </span>
                      <span className="cap-service__title-bright" aria-hidden="true">
                        {SERVICES[si].title}
                      </span>
                    </span>
                    <span className="cap-service__arrow" aria-hidden="true">
                      ↗
                    </span>
                    {/* shown on mobile only — desktop uses the left panel */}
                    <span className="cap-service__tagline">
                      {SERVICES[si].tagline}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
