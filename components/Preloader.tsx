"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  MotionConfig,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

const EXPO = [0.16, 1, 0.3, 1] as const;

// ── Timeline (ms) ───────────────────────────────────────────────────
const DRAW_MS = 1100; // white outline sketches itself on
const FILL_DELAY_MS = 800; // gradient starts rising into the mark
const FILL_MS = 900; // gradient rise duration
const HOLD_MS = 320; // beat once the mark is complete
const LIFT_MS = 720; // black curtain slides up off the screen
const FILL_END = FILL_DELAY_MS + FILL_MS; // 1700 — counter reaches 100
const LIFT_AT = FILL_END + HOLD_MS; // 2020 — curtain starts lifting

// X silhouette — two crossing bars as a single 12-point outline (0 0 200 200)
const X_PATH =
  "M23 47 L47 23 L100 76 L153 23 L177 47 L124 100 L177 153 L153 177 L100 124 L47 177 L23 153 L76 100 Z";

const GRADIENT_STOPS = [
  { offset: "0%", color: "#c084fc" },
  { offset: "28%", color: "#818cf8" },
  { offset: "52%", color: "#38bdf8" },
  { offset: "76%", color: "#f472b6" },
  { offset: "100%", color: "#e879f9" },
];

interface RevealCtx {
  /** True once the preloader has lifted and the site is visible. */
  revealed: boolean;
}

const RevealContext = createContext<RevealCtx>({ revealed: true });

/** Read whether the intro preloader has finished — gate page intros on this. */
export const useReveal = () => useContext(RevealContext);

/**
 * Wraps the app, runs the logo-draw loading screen on every full page load,
 * then exposes `revealed` so intros (e.g. Hero) start as the curtain lifts.
 */
export function RevealProvider({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false); // unmounts the overlay entirely

  const count = useMotionValue(0);
  const display = useTransform(count, (v) =>
    Math.round(v).toString().padStart(3, "0"),
  );
  const barScale = useTransform(count, [0, 100], [0, 1]);

  useEffect(() => {
    // Lock scroll while the curtain is up.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const release = () => {
      document.body.style.overflow = prevOverflow;
    };

    const counter = animate(count, 100, {
      duration: FILL_END / 1000,
      ease: "easeInOut",
    });
    const liftTimer = setTimeout(() => setRevealed(true), LIFT_AT);
    const doneTimer = setTimeout(() => {
      setDone(true);
      release();
    }, LIFT_AT + LIFT_MS + 60);

    return () => {
      counter.stop();
      clearTimeout(liftTimer);
      clearTimeout(doneTimer);
      release();
    };
  }, [count]);

  return (
    <RevealContext.Provider value={{ revealed }}>
      {children}

      {!done && (
        <MotionConfig reducedMotion="never">
          <motion.div
            aria-hidden
            initial={{ y: 0 }}
            animate={{ y: revealed ? "-100%" : 0 }}
            transition={{ duration: LIFT_MS / 1000, ease: EXPO }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "#0a0a0a",
              pointerEvents: "none",
              overflow: "hidden",
              fontFamily: "var(--font-display)",
            }}
          >
            {/* ── top bar — mirrors the hero's "Xada —— 01" ── */}
            <div
              style={{
                position: "absolute",
                top: "clamp(1.5rem, 5vh, 2.5rem)",
                left: "clamp(1.5rem, 4vw, 4rem)",
                right: "clamp(1.5rem, 4vw, 4rem)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.42)",
                  whiteSpace: "nowrap",
                }}
              >
                Xada Studio
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  margin: "0 1.5rem",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <motion.span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.85)",
                  fontVariantNumeric: "tabular-nums",
                  whiteSpace: "nowrap",
                }}
              >
                {display}
              </motion.span>
            </div>

            {/* ── centered X mark ── */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <motion.svg
                viewBox="0 0 200 200"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: EXPO }}
                style={{
                  width: "clamp(104px, 17vw, 168px)",
                  height: "auto",
                  overflow: "visible",
                  filter: "drop-shadow(0 0 22px rgba(167,139,250,0.22))",
                }}
              >
                <defs>
                  <linearGradient id="xada-x-grad" x1="0" y1="0" x2="1" y2="1">
                    {GRADIENT_STOPS.map((s) => (
                      <stop key={s.offset} offset={s.offset} stopColor={s.color} />
                    ))}
                  </linearGradient>
                  <clipPath id="xada-x-fill">
                    {/* rises bottom → top to "pour" the gradient into the mark */}
                    <motion.rect
                      x="0"
                      y="0"
                      width="200"
                      height="200"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{
                        duration: FILL_MS / 1000,
                        delay: FILL_DELAY_MS / 1000,
                        ease: EXPO,
                      }}
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: "50% 100%",
                      }}
                    />
                  </clipPath>
                </defs>

                {/* gradient fill, revealed by the rising clip */}
                <path
                  d={X_PATH}
                  fill="url(#xada-x-grad)"
                  clipPath="url(#xada-x-fill)"
                />

                {/* white outline — sketches itself first, then frames the mark */}
                <motion.path
                  d={X_PATH}
                  fill="none"
                  stroke="rgba(255,255,255,0.92)"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: DRAW_MS / 1000, ease: EXPO },
                    opacity: { duration: 0.2 },
                  }}
                />
              </motion.svg>
            </div>

            {/* ── progress hairline — full-bleed at the bottom edge ── */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "2px",
                background: "rgba(255,255,255,0.07)",
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, #c084fc, #818cf8, #38bdf8, #f472b6, #e879f9)",
                  transformOrigin: "left",
                  scaleX: barScale,
                }}
              />
            </div>
          </motion.div>
        </MotionConfig>
      )}
    </RevealContext.Provider>
  );
}
