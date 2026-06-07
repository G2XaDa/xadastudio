"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/components/PageTransition";
import { useReveal } from "@/components/Preloader";
import { HUB } from "@/lib/hub";

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SESSION_KEY = "xadahub-popup-seen";
const SHOW_AFTER_MS = 3500; // beat after the intro lifts, in full view

export default function HubAnnouncement() {
  const { navigateTo } = usePageTransition();
  const { revealed } = useReveal();
  const [open, setOpen] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  // If audio is still locked when the popup opens, remember to chime on the
  // first user gesture that unlocks it.
  const chimePendingRef = useRef(false);

  // ── Web Audio chime ───────────────────────────────────────────────
  const ensureCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      try {
        audioCtxRef.current = new AC();
      } catch {
        return null;
      }
    }
    return audioCtxRef.current;
  }, []);

  const playChime = useCallback(() => {
    const ctx = ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    // Audio still locked (no user gesture yet) — chime on first unlock instead.
    if (ctx.state !== "running") {
      chimePendingRef.current = true;
      return;
    }
    chimePendingRef.current = false;

    const now = ctx.currentTime + 0.02;
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);

    // A soft ascending shimmer — D5 · A5 · D6.
    [587.33, 880, 1174.66].forEach((freq, i) => {
      const t = now + i * 0.08;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 1.25);
    });
  }, [ensureCtx]);

  // Unlock the AudioContext on the first user gesture (autoplay policy).
  useEffect(() => {
    const unlock = () => {
      const ctx = ensureCtx();
      if (ctx) {
        ctx
          .resume()
          .then(() => {
            if (chimePendingRef.current) {
              chimePendingRef.current = false;
              playChime();
            }
          })
          .catch(() => {});
      }
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    window.addEventListener("touchstart", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, [ensureCtx, playChime]);

  // ── Open once per session, a beat after the intro lifts ────────────
  useEffect(() => {
    if (!revealed) return;
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      /* storage blocked — still show once */
    }
    const t = setTimeout(() => setOpen(true), SHOW_AFTER_MS);
    return () => clearTimeout(t);
  }, [revealed]);

  // ── While open: chime, lock scroll, Esc to close ───────────────────
  useEffect(() => {
    if (!open) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    playChime();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, playChime]);

  const close = useCallback(() => setOpen(false), []);
  const readMore = useCallback(() => {
    setOpen(false);
    navigateTo(HUB.href, HUB.title);
  }, [navigateTo]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="hub-pop__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EXPO }}
          onClick={close}
        >
          <style>{`
            .hub-pop__backdrop {
              position: fixed; inset: 0; z-index: 200;
              display: flex; align-items: center; justify-content: center;
              padding: 1.5rem;
              background: rgba(10,10,10,0.55);
              -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
              font-family: var(--font-display);
            }
            .hub-pop {
              position: relative;
              display: flex;
              width: 100%; max-width: 900px;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 40px 120px rgba(0,0,0,0.45),
                          0 0 0 1px rgba(255,255,255,0.04);
            }
            .hub-pop__media { position: relative; flex: 0 0 46%; line-height: 0; }
            .hub-pop__media img {
              display: block; width: 100%; height: 100%;
              object-fit: cover; object-position: center left;
            }
            .hub-pop__close {
              position: absolute; top: 0.85rem; right: 0.85rem; z-index: 2;
              width: 32px; height: 32px; border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              background: rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.08);
              color: #0a0a0a; cursor: pointer; font-size: 0.95rem; line-height: 1;
              -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px);
              transition: background 0.2s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1);
            }
            .hub-pop__close:hover { background: #ffffff; transform: rotate(90deg); }
            .hub-pop__body {
              flex: 1; min-width: 0;
              display: flex; flex-direction: column; justify-content: center;
              padding: clamp(1.5rem, 3.2vw, 2.6rem);
            }
            .hub-pop__pill {
              display: inline-flex; align-items: center; gap: 0.5rem;
              font-size: 0.56rem; font-weight: 800; letter-spacing: 0.22em;
              text-transform: uppercase; color: rgba(0,0,0,0.5);
              border: 1px solid rgba(167,139,250,0.35); border-radius: 100px;
              padding: 0.35rem 0.7rem; margin-bottom: 1rem;
            }
            .hub-pop__pill-dot {
              width: 6px; height: 6px; border-radius: 50%; background: #a78bfa;
              animation: hub-pulse 2.4s cubic-bezier(0.16,1,0.3,1) infinite;
            }
            @keyframes hub-pulse {
              0%   { box-shadow: 0 0 0 0 rgba(167,139,250,0.5); }
              70%  { box-shadow: 0 0 0 8px rgba(167,139,250,0); }
              100% { box-shadow: 0 0 0 0 rgba(167,139,250,0); }
            }
            .hub-pop__title {
              font-size: clamp(1.6rem, 2.8vw, 2.25rem); font-weight: 900;
              letter-spacing: -0.03em; line-height: 1.05; color: #0a0a0a; margin: 0;
              max-width: 16ch;
            }
            .hub-pop__blurb {
              margin: 0.7rem 0 1.25rem; font-size: 0.9rem; line-height: 1.6;
              color: rgba(0,0,0,0.5);
            }
            .hub-pop__actions { display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap; }
            .hub-pop__cta {
              flex: 1; min-width: 180px;
              display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
              background: #0a0a0a; color: #fff; border: none; cursor: pointer;
              padding: 0.85rem 1.25rem; border-radius: 3px;
              font-family: var(--font-display);
              font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
              transition: background 0.25s ease;
            }
            .hub-pop__cta:hover { background: #1d1d1f; }
            .hub-pop__cta-arrow { transition: transform 0.3s ease; }
            .hub-pop__cta:hover .hub-pop__cta-arrow { transform: translateX(4px); }
            .hub-pop__later {
              background: transparent; border: none; cursor: pointer;
              font-family: var(--font-display);
              font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em;
              color: rgba(0,0,0,0.4); transition: color 0.2s ease;
            }
            .hub-pop__later:hover { color: #0a0a0a; }
            .hub-pop__follow {
              margin-top: 1.1rem; padding-top: 0.9rem; border-top: 1px solid rgba(0,0,0,0.07);
              font-size: 0.62rem; font-weight: 600; letter-spacing: 0.04em; color: rgba(0,0,0,0.35);
            }
            .hub-pop__follow a { color: rgba(0,0,0,0.6); text-decoration: none; }
            .hub-pop__follow a:hover { color: #a78bfa; }

            /* Stack to a vertical card on small screens */
            @media (max-width: 680px) {
              .hub-pop { flex-direction: column; max-width: 420px; }
              .hub-pop__media { flex: none; width: 100%; height: 168px; }
              .hub-pop__media img { object-position: center; }
              .hub-pop__body { padding: clamp(1.25rem, 5vw, 1.6rem); }
              .hub-pop__title { max-width: none; }
            }
          `}</style>

          <motion.div
            className="hub-pop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hub-pop-title"
            initial={{ opacity: 0, scale: 0.9, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, y: 12, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: EXPO }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="hub-pop__close"
              onClick={close}
              aria-label="Close announcement"
            >
              ✕
            </button>

            <span className="hub-pop__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HUB.banner} alt="Introducing xadaHub — coming soon" />
            </span>

            <div className="hub-pop__body">
              <span className="hub-pop__pill">
                <span className="hub-pop__pill-dot" aria-hidden="true" />
                {HUB.status}
              </span>
              <h2 id="hub-pop-title" className="hub-pop__title">
                {HUB.tagline}
              </h2>
              <p className="hub-pop__blurb">{HUB.excerpt}</p>

              <div className="hub-pop__actions">
                <button type="button" className="hub-pop__cta" onClick={readMore}>
                  Read the announcement
                  <span className="hub-pop__cta-arrow" aria-hidden="true">→</span>
                </button>
                <button type="button" className="hub-pop__later" onClick={close}>
                  Maybe later
                </button>
              </div>

              <p className="hub-pop__follow">
                Follow along:{" "}
                {HUB.socials.map((s, i) => (
                  <span key={s.label}>
                    {i > 0 ? " · " : ""}
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.label} {s.handle}
                    </a>
                  </span>
                ))}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
