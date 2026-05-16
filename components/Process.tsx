"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STAGES = [
  {
    num: "01",
    name: "Discover",
    title: "We listen first.",
    desc: "Goals, audience, voice, what's working, what isn't. The brief that lives in your head becomes the brief on paper.",
  },
  {
    num: "02",
    name: "Design",
    title: "Sketch → prototype.",
    desc: "Wireframes become high-fidelity layouts. Every screen, every interaction, mocked up until it feels right.",
  },
  {
    num: "03",
    name: "Build",
    title: "Code with craft.",
    desc: "Real engineering — performance budgets, accessibility, motion. The detail that takes 10× longer to ship.",
  },
  {
    num: "04",
    name: "Launch",
    title: "Live, then some.",
    desc: "Lighthouse audits, QA, deploy. We don't ship and disappear — the first 30 days of tweaks are on us.",
  },
] as const;

// ── Per-stage viz components ─────────────────────────────────────────

function DiscoverViz() {
  const questions: { x: number; y: number; text: string }[] = [
    { x: 160, y: 85, text: "WHO?" },
    { x: 640, y: 85, text: "WHY?" },
    { x: 95, y: 230, text: "HOW?" },
    { x: 705, y: 230, text: "WHEN?" },
    { x: 220, y: 380, text: "GOAL?" },
    { x: 580, y: 380, text: "VOICE?" },
  ];
  return (
    <svg viewBox="0 0 800 460" className="viz-svg viz-svg--discover" aria-hidden="true">
      {questions.map((q, i) => (
        <line
          key={`l${i}`}
          className={`d-line d-line--${i + 1}`}
          x1="400"
          y1="230"
          x2={q.x}
          y2={q.y}
          pathLength="1"
        />
      ))}
      <g className="d-center">
        <circle cx="400" cy="230" r="65" />
        <text x="400" y="237" textAnchor="middle">BRIEF</text>
      </g>
      {questions.map((q, i) => (
        <g key={`q${i}`} className={`d-q d-q--${i + 1}`}>
          <text x={q.x} y={q.y + 5} textAnchor="middle">
            {q.text}
          </text>
        </g>
      ))}
    </svg>
  );
}

function DesignViz() {
  return (
    <svg viewBox="0 0 800 460" className="viz-svg viz-svg--design" aria-hidden="true">
      {/* Header row */}
      <rect className="wf wf--1" x="40" y="40" width="720" height="50" pathLength="1" rx="2" />
      <circle className="wf wf--1b" cx="70" cy="65" r="10" pathLength="1" />
      <line className="wf wf--1c" x1="640" y1="65" x2="685" y2="65" pathLength="1" />
      <line className="wf wf--1d" x1="570" y1="65" x2="620" y2="65" pathLength="1" />
      <line className="wf wf--1e" x1="500" y1="65" x2="550" y2="65" pathLength="1" />

      {/* Hero block */}
      <rect className="wf wf--2" x="40" y="115" width="720" height="180" pathLength="1" rx="2" />
      <line className="wf wf--2a" x1="80" y1="170" x2="500" y2="170" pathLength="1" />
      <line className="wf wf--2b" x1="80" y1="200" x2="420" y2="200" pathLength="1" />
      <rect className="wf wf--2c" x="80" y="230" width="120" height="36" pathLength="1" rx="2" />

      {/* Cards */}
      <rect className="wf wf--3" x="40" y="320" width="220" height="110" pathLength="1" rx="2" />
      <rect className="wf wf--4" x="290" y="320" width="220" height="110" pathLength="1" rx="2" />
      <rect className="wf wf--5" x="540" y="320" width="220" height="110" pathLength="1" rx="2" />
    </svg>
  );
}

function BuildViz() {
  return (
    <div className="editor">
      <div className="editor__bar">
        <span className="editor__dot" />
        <span className="editor__dot" />
        <span className="editor__dot" />
        <span className="editor__title">hero.css</span>
      </div>
      <pre className="editor__body">
        <span className="cline cline--1">
          <span className="t-key">.hero</span> {"{"}
        </span>
        <span className="cline cline--2">
          {"  "}
          <span className="t-prop">background</span>:{" "}
          <span className="t-val">linear-gradient(</span>
        </span>
        <span className="cline cline--3">
          {"    "}
          <span className="t-val">90deg</span>,{" "}
          <span className="t-val">#c084fc</span>,{" "}
          <span className="t-val">#38bdf8</span>
        </span>
        <span className="cline cline--4">{"  "});</span>
        <span className="cline cline--5">
          {"  "}
          <span className="t-prop">animation</span>:{" "}
          <span className="t-val">slideUp .8s ease</span>;
        </span>
        <span className="cline cline--6">{"}"}</span>
        <span className="cline cline--7 cline--caret">▍</span>
      </pre>
    </div>
  );
}

function LaunchViz() {
  const scores: { v: number; l: string }[] = [
    { v: 100, l: "Perf" },
    { v: 100, l: "A11y" },
    { v: 100, l: "BP" },
    { v: 100, l: "SEO" },
  ];
  return (
    <div className="launch">
      <div className="launch-site">
        <div className="ls-block ls-block--hero">
          <div className="ls-block__shimmer" />
        </div>
        <div className="ls-row">
          <div className="ls-block ls-block--card" />
          <div className="ls-block ls-block--card" />
          <div className="ls-block ls-block--card" />
        </div>
      </div>
      <div className="launch-scores">
        {scores.map((s, i) => (
          <div
            className="lscore"
            key={s.l}
            style={{ "--i": i } as React.CSSProperties}
          >
            <span className="lscore__value">{s.v}</span>
            <span className="lscore__label">{s.l}</span>
          </div>
        ))}
        <span className="launch-live">● LIVE</span>
      </div>
    </div>
  );
}

export default function Process(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=320%",
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const idx = Math.min(
          STAGES.length - 1,
          Math.floor(self.progress * STAGES.length),
        );
        if (idx !== activeRef.current) {
          activeRef.current = idx;
          setActive(idx);
        }
      },
    });

    return () => st.kill();
  }, []);

  const current = STAGES[active];

  return (
    <section
      ref={sectionRef}
      className="process-section"
      style={{ fontFamily: "var(--font-display)" }}
    >
      <div className="process-inner">
        {/* Top bar */}
        <div className="process-topbar">
          <span className="process-topbar__label">How we work</span>
          <div className="process-topbar__rule" />
          <span className="process-topbar__num">
            0{active + 1} / 0{STAGES.length}
          </span>
        </div>

        {/* Stage meta + title — remounts on active change for fade */}
        <div className="process-meta" key={`m-${active}`}>
          <div className="process-meta__chip">
            <span className="process-meta__num">{current.num}</span>
            <span className="process-meta__sep">—</span>
            <span className="process-meta__name">{current.name}</span>
          </div>
          <h2 className="process-meta__title">{current.title}</h2>
        </div>

        {/* Central visual — remounts on active change so its CSS animations replay */}
        <div className="process-viz" key={`v-${active}`}>
          {active === 0 && <DiscoverViz />}
          {active === 1 && <DesignViz />}
          {active === 2 && <BuildViz />}
          {active === 3 && <LaunchViz />}
        </div>

        {/* Description */}
        <p className="process-desc" key={`d-${active}`}>
          {current.desc}
        </p>

        {/* Progress dots */}
        <div className="process-dots">
          {STAGES.map((_, i) => (
            <span
              key={i}
              className={`p-dot ${i === active ? "is-active" : ""} ${i < active ? "is-done" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
