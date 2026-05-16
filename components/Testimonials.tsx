"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TITLE_TEXT = "Not taking our word for it?";

const QUOTES = [
  {
    quote:
      "Asked for a landing page. Got something I'm bragging to my investors about.",
    author: "Priya N.",
    role: "Founder, Saily",
  },
  {
    quote: "Finally a website that looks as solid as what we build.",
    author: "Marcus T.",
    role: "Owner, Sourdough Construction",
  },
  {
    quote:
      "Worked with three agencies before these guys. Xada is the only one that actually shipped.",
    author: "Sara L.",
    role: "Director, S&T Concrete",
  },
] as const;

// Brand palette as RGB triples — each letter gets a colour interpolated
// based on its position so the line reads as a rainbow gradient.
const PALETTE: [number, number, number][] = [
  [192, 132, 252], // violet
  [129, 140, 248], // indigo
  [56, 189, 248], // blue
  [244, 114, 182], // pink
  [232, 121, 249], // fuchsia
];

function rgbForLetter(i: number, total: number): [number, number, number] {
  const t = total > 1 ? i / (total - 1) : 0;
  const scaled = t * (PALETTE.length - 1);
  const idx = Math.floor(scaled);
  const local = scaled - idx;
  const a = PALETTE[idx];
  const b = PALETTE[Math.min(PALETTE.length - 1, idx + 1)];
  return [
    Math.round(a[0] + (b[0] - a[0]) * local),
    Math.round(a[1] + (b[1] - a[1]) * local),
    Math.round(a[2] + (b[2] - a[2]) * local),
  ];
}

type LetterData = { char: string; rgb: [number, number, number]; idx: number };
type SplitData = { words: LetterData[][]; total: number };

function buildLetters(text: string): SplitData {
  const words = text.split(" ");
  let total = 0;
  for (const w of words) total += Array.from(w).length;
  let global = 0;
  const result = words.map((word) =>
    Array.from(word).map((char) => {
      const rgb = rgbForLetter(global, total);
      const data: LetterData = { char, rgb, idx: global };
      global++;
      return data;
    }),
  );
  return { words: result, total };
}

const QUOTE_DATA = QUOTES.map((q) => buildLetters(`“${q.quote}”`));

export default function Testimonials(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteLetterRefs = useRef<(HTMLSpanElement | null)[][]>(
    QUOTES.map(() => []),
  );

  // -1 = title phase, 0..n = quote phases
  const [active, setActive] = useState(-1);
  const activeRef = useRef(-1);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    // Each letter takes 18% of its segment progress to fully colour in.
    // Smaller window = sharper sweep; larger window = softer overlap.
    const REVEAL_WINDOW = 0.18;
    const TITLE_END = 0.28; // first 28% of pin = cinematic title phase

    const sweep = (refs: (HTMLSpanElement | null)[], p: number) => {
      const total = refs.length;
      for (let i = 0; i < total; i++) {
        const letter = refs[i];
        if (!letter) continue;
        const start = (i / total) * (1 - REVEAL_WINDOW);
        const lp = Math.max(0, Math.min(1, (p - start) / REVEAL_WINDOW));
        letter.style.setProperty("--p", lp.toFixed(3));
      }
    };

    const reset = (refs: (HTMLSpanElement | null)[]) => {
      for (const letter of refs) {
        if (letter) letter.style.setProperty("--p", "0");
      }
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=320%",
      pin: true,
      scrub: 0.4,
      onUpdate: (self) => {
        const p = self.progress;

        if (p < TITLE_END) {
          if (activeRef.current !== -1) {
            // Coming back from a quote → clear quote letters
            quoteLetterRefs.current.forEach(reset);
            activeRef.current = -1;
            setActive(-1);
          }
          // Title is plain bold black — no per-letter sweep
        } else {
          const qp = (p - TITLE_END) / (1 - TITLE_END);
          const segLen = 1 / QUOTES.length;
          const idx = Math.min(
            QUOTES.length - 1,
            Math.floor(qp / segLen),
          );
          const localP = (qp - idx * segLen) / segLen;

          if (idx !== activeRef.current) {
            // Reset previously-active letters so they restart from scratch
            // if the user scrubs back to them.
            if (activeRef.current >= 0) {
              reset(quoteLetterRefs.current[activeRef.current]);
            }
            activeRef.current = idx;
            setActive(idx);
          }
          sweep(quoteLetterRefs.current[idx], localP);
        }
      },
    });

    return () => st.kill();
  }, []);

  const showTitle = active < 0;
  const currentQuote = active >= 0 ? QUOTES[active] : null;
  const progressFill = active < 0 ? 0 : (active + 1) / QUOTES.length;

  return (
    <section
      ref={sectionRef}
      className="quotes-section"
      style={{ fontFamily: "var(--font-display)" }}
    >
      <div className="quotes-inner">
        {/* Top bar */}
        <div className="quotes-topbar">
          <span className="quotes-topbar__label">Testimonials</span>
          <div className="quotes-topbar__rule" />
          <span className="quotes-topbar__num">
            0{Math.max(0, active + 1)} / 0{QUOTES.length}
          </span>
        </div>

        {/* Stage — title + quote sets layered, only one visible */}
        <div className="quotes-stage">
          <div className={`quotes-title ${!showTitle ? "is-out" : ""}`}>
            <h2 className="quotes-title__text">{TITLE_TEXT}</h2>
          </div>

          {QUOTE_DATA.map((data, qi) => (
            <div
              key={qi}
              className={`quote-set ${qi === active ? "is-active" : ""}`}
              aria-hidden={qi !== active}
            >
              <p className="quote-text">
                {data.words.map((wordChars, wi) => (
                  <span className="quote-word" key={wi}>
                    {wordChars.map(({ char, rgb, idx }) => (
                      <span
                        key={idx}
                        ref={(el) => {
                          quoteLetterRefs.current[qi][idx] = el;
                        }}
                        className="quote-letter"
                        style={
                          {
                            "--r": rgb[0],
                            "--g": rgb[1],
                            "--b": rgb[2],
                          } as React.CSSProperties
                        }
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        {/* Author — placeholder during title so layout doesn't jump */}
        <div className="quotes-author" key={active}>
          <span className="quotes-author__name">
            {currentQuote ? `— ${currentQuote.author}` : " "}
          </span>
          <span className="quotes-author__role">
            {currentQuote ? currentQuote.role : " "}
          </span>
        </div>

        {/* Progress bar */}
        <div className="quotes-progress">
          <div className="quotes-progress__bar">
            <div
              className="quotes-progress__fill"
              style={{ transform: `scaleX(${progressFill})` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
