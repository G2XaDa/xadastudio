"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SKILLS = [
  { title: "Landing Pages",       desc: "High-converting, scroll-stopping pages built to make a first impression that lasts." },
  { title: "Business Websites",   desc: "Professional sites that establish credibility and turn visitors into clients." },
  { title: "Ecommerce Stores",    desc: "Sleek, fast storefronts engineered for seamless shopping and maximum revenue." },
  { title: "Custom Features",     desc: "Bespoke functionality built exactly to spec — no templates, no compromises." },
  { title: "WebGL & Animation",   desc: "Real-time graphics and physics-based motion that make browsers feel alive." },
  { title: "SEO & Performance",   desc: "Speed-optimised, search-ready builds that rank, load fast, and stay fast." },
] as const;

const SERVICE_DETAILS = [
  {
    tagline: "Your digital storefront, perfected.",
    what: "A landing page is a single, focused page built around one goal — whether that's capturing leads, selling a product, or booking a call. No distractions, no dead ends. Just a clear path from curiosity to conversion.",
    how: "We design and build every landing page from the ground up. Pixel-perfect layouts, scroll-driven animations, persuasive copy structure, and conversion-focused hierarchy — all custom, zero templates.",
    why: "A well-crafted landing page converts 5–10× better than a generic website. First impressions form in under 50 milliseconds. That's not enough time to read a word — it's enough time to feel something. We make sure what they feel is trust.",
  },
  {
    tagline: "Credibility you can feel through a screen.",
    what: "A business website is your brand's permanent home on the internet — the place every pitch, every ad, and every referral eventually points to. It needs to work as hard as you do.",
    how: "We handle everything from information architecture and design systems to development and launch. Multi-page, fast, accessible, and built to represent you at your absolute best — on every device, at every screen size.",
    why: "75% of people judge a company's credibility by its website alone. Before they read your case studies, before they check your pricing, they've already decided whether you're worth their time. Yours should leave zero doubt.",
  },
  {
    tagline: "Built to sell. Designed to impress.",
    what: "An ecommerce store that converts doesn't just list products — it guides customers through a journey that builds desire, removes friction, and makes buying feel like the obvious next step.",
    how: "Custom Shopify or headless builds with branded product pages, frictionless checkout flows, mobile-first design, and performance optimised for high traffic. Every detail considered. Nothing left to chance.",
    why: "Cart abandonment drops dramatically when the shopping experience feels premium. Trust is everything in ecommerce — and trust is built through design. A store that looks credible sells more. Full stop.",
  },
  {
    tagline: "If you can imagine it, we can build it.",
    what: "Off-the-shelf tools create off-the-shelf experiences. Custom features are what separate a website from a product — something people actually remember, return to, and talk about.",
    how: "From interactive configurators and booking systems to custom dashboards and complex API integrations — you spec it, we scope it, we ship it. On time, on budget, exactly as discussed.",
    why: "Your competitors are using the same plugins as everyone else. Custom features are a moat. They're harder to copy, impossible to replicate with a template, and they signal to every visitor that you take your craft seriously.",
  },
  {
    tagline: "The web, but cinematic.",
    what: "WebGL and animation transform a website from a document into an experience — one that moves, reacts, and surprises at every scroll and cursor movement. The kind of thing people screenshot and send to friends.",
    how: "We use WebGL2, GSAP ScrollTrigger, and physics-based motion to craft scroll-driven narratives and real-time 3D visuals that run natively in the browser at 60fps. No compromises on performance or fidelity.",
    why: "Motion is the new differentiator. Sites with immersive animation win Awwwards, earn press coverage, and get shared. They don't just look good — they feel alive. And that feeling translates directly into brand perception and recall.",
  },
  {
    tagline: "Beautiful and built to be found.",
    what: "A stunning website that nobody finds is a stunning website that doesn't work. SEO and performance are the infrastructure that makes your entire web investment compound over time.",
    how: "Lighthouse 100 targets, Core Web Vitals optimisation, structured data, semantic HTML, image compression, and edge caching — baked in from day one, not bolted on at the end as an afterthought.",
    why: "A 1-second delay in page load reduces conversions by 7%. Page one of Google gets 95% of all search clicks. Speed and visibility aren't nice-to-haves. They're the difference between a website and a growth engine.",
  },
] as const;

export default function SkillsShowcase(): React.JSX.Element {
  const sectionRef  = useRef<HTMLElement>(null);
  const chapter1Ref = useRef<HTMLDivElement>(null);
  const chapter2Ref = useRef<HTMLDivElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);
  const topBarRef   = useRef<HTMLDivElement>(null);

  const cardRefs     = useRef<(HTMLDivElement | null)[]>(Array(6).fill(null));
  const fillRefs     = useRef<(HTMLDivElement | null)[]>(Array(6).fill(null));
  const specularRefs = useRef<(HTMLDivElement | null)[]>(Array(6).fill(null));

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const overlayRef        = useRef<HTMLDivElement>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);
  const openCardRectRef   = useRef<DOMRect | null>(null);
  const closeCardRef      = useRef<() => void>(() => {});

  // ── Effect 1: GSAP ScrollTrigger ─────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    ScrollTrigger.refresh();

    const allTargets = [
      chapter1Ref, chapter2Ref, gridRef, topBarRef,
      ...cardRefs.current.map((el) => ({ current: el })),
    ];
    if (allTargets.some((r) => !r.current)) return;

    const ch1Letters = chapter1Ref.current!.querySelectorAll<HTMLElement>(".ch1-letter");
    const ch2Lines   = chapter2Ref.current!.querySelectorAll<HTMLElement>(".ch2-line");

    gsap.set(ch1Letters,          { y: 60, clipPath: "inset(110% 0 0 0)", opacity: 0 });
    gsap.set(chapter1Ref.current, { y: "46vh" });

    const tl = gsap.timeline();

    tl.to(chapter1Ref.current, { y: 0, duration: 0.18, ease: "power2.out" }, 0);
    tl.to(ch1Letters, {
      y: 0, clipPath: "inset(0% 0 0 0)", opacity: 1,
      duration: 0.14, stagger: 0.007, ease: "back.out(1.3)",
    }, 0.02);

    tl.to(chapter1Ref.current, { y: "-46vh", opacity: 0, duration: 0.10, ease: "power2.in" }, 0.28);

    tl.from(topBarRef.current, { opacity: 0, clipPath: "inset(0 100% 0 0)", duration: 0.07 }, 0.38);
    tl.from(gridRef.current,   { opacity: 0, duration: 0.05 }, 0.39);

    tl.from(cardRefs.current[0], { clipPath: "inset(0 100% 0 0)", opacity: 0, duration: 0.20, ease: "power3.out" }, 0.42);
    tl.from(cardRefs.current[1], { clipPath: "inset(0 0 0 100%)", opacity: 0, duration: 0.20, ease: "power3.out" }, 0.47);
    tl.from(cardRefs.current[2], { y: 72, rotation: 2, opacity: 0, duration: 0.20, ease: "power3.out" }, 0.52);
    tl.from(cardRefs.current[3], { y: -72, rotation: -2, opacity: 0, duration: 0.20, ease: "power3.out" }, 0.57);

    tl.from(ch2Lines[0], { clipPath: "inset(0 100% 0 0)", opacity: 0, duration: 0.09, ease: "power3.out" }, 0.65);
    tl.from(ch2Lines[1], { clipPath: "inset(0 0 0 100%)", opacity: 0, duration: 0.09, ease: "power3.out" }, 0.66);

    tl.from(cardRefs.current[4], { scale: 0.82, opacity: 0, duration: 0.17, ease: "power3.out", transformOrigin: "center center" }, 0.71);
    tl.from(cardRefs.current[5], { x: 110, opacity: 0, duration: 0.17, ease: "back.out(1.7)" }, 0.76);

    tl.to(chapter2Ref.current, { opacity: 0, y: -20, duration: 0.07, ease: "power2.in" }, 0.86);

    // ── Phase 6: Cards scatter in 3D ──
    gsap.set(gridRef.current,       { perspective: 1200 });
    gsap.set(cardRefs.current,      { transformStyle: "preserve-3d" });

    const SCATTER = [
      { x: "-120vw", y: "-80vh",  z: 400,  rotateZ: -18 },
      { x: "0vw",    y: "-130vh", z: -300, rotateX: 25  },
      { x: "120vw",  y: "-80vh",  z: 400,  rotateZ: 18  },
      { x: "-120vw", y: "80vh",   z: -300, rotateZ: -12 },
      { x: "0vw",    y: "130vh",  z: 300,  rotateX: -20 },
      { x: "120vw",  y: "80vh",   z: 400,  rotateZ: 15  },
    ] as const;

    cardRefs.current.forEach((card, i) => {
      tl.to(card, {
        ...SCATTER[i], opacity: 0, scale: 0.7,
        duration: 0.10, ease: "power3.in",
      }, 0.87 + i * 0.012);
    });

    tl.to(topBarRef.current, { opacity: 0, y: -20, duration: 0.07, ease: "power2.in" }, 0.87);

    const st = ScrollTrigger.create({
      trigger:   section,
      start:     "top top",
      end:       "+=300%",
      pin:       true,
      scrub:     1.8,
      animation: tl,
    });

    return () => {
      st.kill();
      tl.kill();
      if (gridRef.current) gsap.set(gridRef.current, { clearProps: "perspective" });
      const validCards = cardRefs.current.filter(Boolean);
      if (validCards.length) gsap.set(validCards, { clearProps: "transformStyle" });
    };
  }, []);

  // ── Escape key to close overlay ──────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCardRef.current(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Overlay open / close ─────────────────────────────────────────────────
  const closeCard = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay || overlay.style.display === "none") return;

    gsap.to(overlayContentRef.current, {
      opacity: 0, y: 20, duration: 0.22, ease: "power2.in",
      onComplete: () => {
        const rect = openCardRectRef.current;
        gsap.to(overlay, {
          top:          rect ? rect.top    : "50%",
          left:         rect ? rect.left   : "50%",
          width:        rect ? rect.width  : 0,
          height:       rect ? rect.height : 0,
          borderRadius: "2px",
          duration: 0.52,
          ease: "power3.inOut",
          onComplete: () => {
            gsap.set(overlay, { display: "none" });
            setOpenIndex(null);
            document.body.style.overflow = "";
          },
        });
      },
    });
  }, []);

  // Keep ref in sync so the keydown listener always calls the latest version
  useEffect(() => { closeCardRef.current = closeCard; }, [closeCard]);

  const expandCard = useCallback((index: number) => {
    const card    = cardRefs.current[index];
    const overlay = overlayRef.current;
    if (!card || !overlay) return;

    const rect = card.getBoundingClientRect();
    openCardRectRef.current = rect;

    gsap.set(overlayContentRef.current, { opacity: 0, y: 30 });
    gsap.set(overlay, {
      display:      "flex",
      top:          rect.top,
      left:         rect.left,
      width:        rect.width,
      height:       rect.height,
      borderRadius: "2px",
    });

    setOpenIndex(index);
    document.body.style.overflow = "hidden";

    gsap.to(overlay, {
      top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: 0,
      duration: 0.7, ease: "power3.inOut",
      onComplete: () => {
        gsap.to(overlayContentRef.current, {
          opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
        });
      },
    });
  }, []);

  // ── Direction-aware dark flood fill hover ────────────────────────────────
  const getEdge = (clientX: number, clientY: number, rect: DOMRect): "top"|"right"|"bottom"|"left" => {
    const x = clientX - rect.left, y = clientY - rect.top;
    const min = Math.min(y, rect.height - y, x, rect.width - x);
    if (min === y)                return "top";
    if (min === rect.height - y)  return "bottom";
    if (min === x)                return "left";
    return "right";
  };

  const clipHidden = (edge: "top"|"right"|"bottom"|"left") => {
    if (edge === "top")    return "inset(0 0 100% 0)";
    if (edge === "bottom") return "inset(100% 0 0 0)";
    if (edge === "left")   return "inset(0 100% 0 0)";
    return "inset(0 0 0 100%)";
  };

  const handleCardMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const fill = fillRefs.current[index];
    const card = cardRefs.current[index];
    if (!fill || !card) return;
    const edge = getEdge(e.clientX, e.clientY, card.getBoundingClientRect());
    fill.style.transition = "none";
    fill.style.clipPath = clipHidden(edge);
    fill.getBoundingClientRect();
    fill.style.transition = "clip-path 0.55s cubic-bezier(0.16,1,0.3,1)";
    fill.style.clipPath = "inset(0 0 0 0)";
    card.classList.add("is-hovered");
    card.style.borderColor = "rgba(109,40,217,0.5)";
  }, []);

  const handleCardMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const fill = fillRefs.current[index];
    const card = cardRefs.current[index];
    if (!fill || !card) return;
    const edge = getEdge(e.clientX, e.clientY, card.getBoundingClientRect());
    fill.style.transition = "clip-path 0.45s cubic-bezier(0.4,0,1,1)";
    fill.style.clipPath = clipHidden(edge);
    card.classList.remove("is-hovered");
    card.style.borderColor = "rgba(109,40,217,0.12)";
  }, []);

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const specular = specularRefs.current[index];
    const card     = cardRefs.current[index];
    if (!specular || !card) return;
    const rect = card.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width  * 100;
    const ny = (e.clientY - rect.top)  / rect.height * 100;
    specular.style.background =
      `radial-gradient(circle at ${nx}% ${ny}%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, transparent 65%)`;
  }, []);

  const detail = openIndex !== null ? SERVICE_DETAILS[openIndex] : null;
  const skill  = openIndex !== null ? SKILLS[openIndex]          : null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Full-screen service overlay ── */}
      <div
        ref={overlayRef}
        className="service-overlay"
        style={{ display: "none", fontFamily: "var(--font-display)" }}
      >
        {/* Close button */}
        <button className="overlay-close" onClick={closeCard} aria-label="Close">
          <span />
          <span />
        </button>

        {/* Decorative large number */}
        {openIndex !== null && (
          <span className="overlay-bg-number" aria-hidden="true">
            0{openIndex + 1}
          </span>
        )}

        {/* Content */}
        <div ref={overlayContentRef} className="overlay-content">
          {detail && skill && (
            <>
              {/* Header */}
              <div className="overlay-header">
                <span className="overlay-index">0{openIndex! + 1}</span>
                <h2 className="overlay-title">{skill.title}</h2>
                <p className="overlay-tagline">{detail.tagline}</p>
              </div>

              <div className="overlay-rule" />

              {/* Three columns */}
              <div className="overlay-body">
                <div className="overlay-col">
                  <span className="overlay-col-label">What it is</span>
                  <p className="overlay-col-text">{detail.what}</p>
                </div>
                <div className="overlay-col">
                  <span className="overlay-col-label">How we do it</span>
                  <p className="overlay-col-text">{detail.how}</p>
                </div>
                <div className="overlay-col">
                  <span className="overlay-col-label">Why it matters</span>
                  <p className="overlay-col-text">{detail.why}</p>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="overlay-footer">
                <button className="overlay-cta">
                  Start a project
                  <span className="overlay-cta-arrow">→</span>
                </button>
                <span className="overlay-close-hint">Press ESC to close</span>
              </div>
            </>
          )}
        </div>
      </div>

      <section
        ref={sectionRef}
        className="skills-section"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {/* Chapter 1 — CAPABILITIES */}
        <div ref={chapter1Ref} className="chapter-text chapter-text--1" aria-hidden="true">
          <span
            style={{
              fontSize: "clamp(1rem, 11vw, 15rem)",
              fontWeight: 900,
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
              color: "#0a0a0a",
              lineHeight: 1,
              userSelect: "none",
              display: "block",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {"CAPABILITIES".split("").map((char, i) => (
              <span key={i} className="ch1-letter" style={{ display: "inline-block" }}>
                {char}
              </span>
            ))}
          </span>
        </div>

        {/* Chapter 2 — WE BUILD / THIS. */}
        <div ref={chapter2Ref} className="chapter-text chapter-text--2" aria-hidden="true">
          <span
            className="ch2-line"
            style={{
              WebkitTextStroke: "1.5px rgba(0,0,0,0.7)",
              color: "transparent",
              fontSize: "clamp(3.2rem, 10vw, 9.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
              display: "block",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            WE BUILD
          </span>
          <span
            className="ch2-line"
            style={{
              color: "#0a0a0a",
              fontSize: "clamp(3.2rem, 10vw, 9.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
              display: "block",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            THIS.
          </span>
        </div>

        {/* Inner content */}
        <div className="skills-inner">
          {/* Top bar */}
          <div ref={topBarRef} className="skills-topbar" style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)" }}>
              Services
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.1)", margin: "0 1.5rem" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.25em", color: "rgba(0,0,0,0.2)" }}>
              02
            </span>
          </div>

          {/* Cards grid */}
          <div ref={gridRef} className="skills-grid">
            {SKILLS.map((skill, i) => (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="skill-card"
                onClick={() => expandCard(i)}
                onMouseMove={(e) => handleCardMouseMove(e, i)}
                onMouseEnter={(e) => handleCardMouseEnter(e, i)}
                onMouseLeave={(e) => handleCardMouseLeave(e, i)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-glass" />
                <div ref={(el) => { fillRefs.current[i] = el; }} className="card-fill" />
                <span className="card-bg-number">0{i + 1}</span>
                <div ref={(el) => { specularRefs.current[i] = el; }} className="card-specular" />
                <span className="card-number">0{i + 1}</span>
                <h3 className="card-title">{skill.title}</h3>
                <p className="card-desc">{skill.desc}</p>
                <div className="card-footer">
                  <div className="card-rule" />
                  <span className="card-arrow">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
