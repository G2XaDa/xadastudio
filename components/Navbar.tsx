"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  animate,
  MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePageTransition } from "@/components/PageTransition";

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const NAV_LINKS = ["About", "Team", "Careers", "Contact"] as const;

function NavLink({
  label,
  motionX,
  motionOpacity,
  onNavigate,
}: {
  label: string;
  motionX: MotionValue<number>;
  motionOpacity: MotionValue<number>;
  onNavigate?: () => void;
}) {
  const [state, setState] = useState<"idle" | "in" | "out">("idle");

  const lineVariants = {
    idle: { clipPath: "inset(0 100% 0 0)" },
    in:   { clipPath: "inset(0 0% 0 0)" },
    out:  { clipPath: "inset(0 100% 0 0)" },
  };

  return (
    <motion.div style={{ x: motionX, opacity: motionOpacity }}>
      <button
        className="relative flex flex-col items-start bg-transparent border-none cursor-pointer"
        onMouseEnter={() => setState("in")}
        onMouseLeave={() => setState("out")}
        onClick={() => onNavigate?.()}
        style={{ padding: 0, gap: "3px" }}
      >
        <span
          style={{
            fontSize: "clamp(1.15rem, 1.5vw, 1.4rem)",
            fontWeight: 500,
            letterSpacing: "0.01em",
            color: state === "in" ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.5)",
            transition: "color 0.25s ease",
            fontFamily: "var(--font-display)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
        <motion.span
          variants={lineVariants}
          animate={state}
          initial="idle"
          transition={
            state === "in"
              ? { duration: 0.6, ease: EXPO }
              : { duration: 0.5, ease: [0.4, 0, 0.6, 1] }
          }
          style={{
            display: "block",
            height: "1px",
            width: "100%",
            background: "rgba(0,0,0,0.75)",
          }}
        />
      </button>
    </motion.div>
  );
}

function OverlayLink({
  label,
  index,
  menuOpen,
  onClick,
  onNavigate,
}: {
  label: string;
  index: number;
  menuOpen: boolean;
  onClick: () => void;
  onNavigate?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const textStyle = {
    fontSize: "clamp(3rem, 9vw, 7rem)",
    fontWeight: 900,
    letterSpacing: "-0.03em",
    lineHeight: 1.05,
    textTransform: "uppercase" as const,
    fontFamily: "var(--font-display)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.45, delay: menuOpen ? 0.15 + index * 0.07 : 0, ease: EXPO }}
    >
      <button
        className="relative block bg-transparent border-none cursor-pointer overflow-hidden"
        style={{ padding: "0 6px 0 0" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => { onClick(); onNavigate?.(); }}
      >
        {/* Base layer: black text */}
        <span style={{ ...textStyle, color: "#0a0a0a", display: "block" }}>
          {label}
        </span>

        {/* Ink layer: black bg + white text, sweeps left → right on hover */}
        <motion.span
          aria-hidden
          animate={{ clipPath: hovered ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
          transition={{ duration: hovered ? 0.45 : 0.38, ease: EXPO }}
          style={{
            ...textStyle,
            color: "#ffffff",
            background: "#0a0a0a",
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            paddingRight: "6px",
            clipPath: "inset(0 100% 0 0)",
          }}
        >
          {label}
        </motion.span>
      </button>
    </motion.div>
  );
}

function MenuButton({
  motionOpacity,
  motionY,
  active,
  isOpen,
  isDark,
  onClick,
}: {
  motionOpacity: MotionValue<number>;
  motionY: MotionValue<number>;
  active: boolean;
  isOpen: boolean;
  isDark: boolean;
  onClick: () => void;
}) {
  const lineRef = useRef<HTMLSpanElement>(null);

  const handleEnter = async () => {
    const el = lineRef.current;
    if (!el) return;
    // Wipe out to the right
    await animate(el, { clipPath: "inset(0 0% 0 100%)" }, { duration: 0.28, ease: [0.4, 0, 1, 1] });
    // Snap to left edge (invisible)
    animate(el, { clipPath: "inset(0 100% 0 0)" }, { duration: 0 });
    // Grow back in from the left
    animate(el, { clipPath: "inset(0 0% 0 0)" }, { duration: 0.38, ease: EXPO });
  };

  const handleLeave = async () => {
    const el = lineRef.current;
    if (!el) return;
    // Wipe out to the left
    await animate(el, { clipPath: "inset(0 100% 0 0)" }, { duration: 0.28, ease: [0.4, 0, 1, 1] });
    // Snap to right edge (invisible)
    animate(el, { clipPath: "inset(0 0% 0 100%)" }, { duration: 0 });
    // Grow back in from the right
    animate(el, { clipPath: "inset(0 0% 0 0)" }, { duration: 0.38, ease: EXPO });
  };

  return (
    <motion.button
      className="hidden md:flex flex-col items-start bg-transparent border-none cursor-pointer"
      style={{
        position: "fixed",
        top: 0,
        right: "4rem",
        height: "80px",
        justifyContent: "center",
        zIndex: 70,
        opacity: motionOpacity,
        y: motionY,
        pointerEvents: active ? "auto" : "none",
        padding: 0,
        gap: "3px",
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
    >
      <span style={{ display: "block", overflow: "hidden", position: "relative", height: "1.5em" }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "menu"}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: EXPO }}
            style={{
              display: "block",
              fontSize: "clamp(1.15rem, 1.5vw, 1.4rem)",
              fontWeight: 500,
              letterSpacing: "0.01em",
              color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
              fontFamily: "var(--font-display)",
              whiteSpace: "nowrap",
              transition: "color 0.4s ease",
            }}
          >
            {isOpen ? "Close" : "Menu"}
          </motion.span>
        </AnimatePresence>
      </span>
      <span
        ref={lineRef}
        style={{
          display: "block",
          height: "1px",
          width: "100%",
          background: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
          clipPath: "inset(0 0% 0 0)",
          transition: "background 0.4s ease",
        }}
      />
    </motion.button>
  );
}

const LINK_ROUTES: Partial<Record<typeof NAV_LINKS[number], string>> = {
  About:   "/",
  Team:    "/team",
  Careers: "/careers",
  Contact: "/contact",
};

export default function Navbar() {
  const { navigateTo } = usePageTransition();
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { stiffness: 35, damping: 20, mass: 0.8 });

  const vh = () => (typeof window !== "undefined" ? window.innerHeight : 900);
  const map = (v: number, a: number, b: number, c: number, d: number) => {
    const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
    return c + t * (d - c);
  };

  // ── Per-link scroll-driven transforms (staggered, vh-based) ────
  const link0x  = useTransform(smoothY, (v) => map(v, 0,           vh() * 0.30, 0, 160));
  const link0op = useTransform(smoothY, (v) => map(v, 0,           vh() * 0.25, 1, 0));
  const link1x  = useTransform(smoothY, (v) => map(v, vh() * 0.04, vh() * 0.34, 0, 160));
  const link1op = useTransform(smoothY, (v) => map(v, vh() * 0.04, vh() * 0.29, 1, 0));
  const link2x  = useTransform(smoothY, (v) => map(v, vh() * 0.08, vh() * 0.38, 0, 160));
  const link2op = useTransform(smoothY, (v) => map(v, vh() * 0.08, vh() * 0.33, 1, 0));
  const link3x  = useTransform(smoothY, (v) => map(v, vh() * 0.12, vh() * 0.42, 0, 160));
  const link3op = useTransform(smoothY, (v) => map(v, vh() * 0.12, vh() * 0.37, 1, 0));
  const link4x  = useTransform(smoothY, (v) => map(v, vh() * 0.16, vh() * 0.46, 0, 160));
  const link4op = useTransform(smoothY, (v) => map(v, vh() * 0.16, vh() * 0.41, 1, 0));

  const linkTransforms = [
    { x: link0x, opacity: link0op },
    { x: link1x, opacity: link1op },
    { x: link2x, opacity: link2op },
    { x: link3x, opacity: link3op },
    { x: link4x, opacity: link4op },
  ];

  // ── MENU appears after links have collapsed ─────────────────────
  const menuOpacity = useTransform(smoothY, (v) => map(v, vh() * 0.35, vh() * 0.50, 0, 1));
  const menuY       = useTransform(smoothY, (v) => map(v, vh() * 0.35, vh() * 0.50, 10, 0));

  // ── Logo fades up into navbar as hero top bar scrolls away ───────
  const logoOpacity = useTransform(smoothY, (v) => map(v, vh() * 0.02, vh() * 0.15, 0, 1));
  const logoY       = useTransform(smoothY, (v) => map(v, vh() * 0.02, vh() * 0.15, 12, 0));

  // Track whether we're scrolled so MENU is actually clickable
  const [isScrolled, setIsScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setIsScrolled(v > vh() * 0.40));

  // ── Dark-section detection (footer) ────────────────────────────
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const els = document.querySelectorAll("[data-dark-nav]");
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => setIsDark(entries.some((e) => e.isIntersecting)),
      { threshold: 0.05 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Overlay state ───────────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    document.body.classList.toggle("nav-menu-open", menuOpen);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("nav-menu-open");
    };
  }, [menuOpen]);

  return (
    <>
      {/* ── Main navbar ─────────────────────────────────────────── */}
      <motion.nav
        className="fixed top-0 left-0 w-full z-50 flex items-center px-6 md:px-16"
        style={{ height: "80px", fontFamily: "var(--font-display)" }}
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 0.7, delay: 0.1, ease: EXPO }}
      >
        {/* Logo — fades up as hero's Xada scrolls away */}
        <motion.span
          className="hidden md:block text-xs font-semibold tracking-[0.35em] uppercase select-none"
          style={{
            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
            fontFamily: "var(--font-display)",
            opacity: logoOpacity,
            y: logoY,
            transition: "color 0.4s ease",
          }}
        >
          Xada
        </motion.span>

        {/* Desktop: centered nav links */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-end gap-10">
          {NAV_LINKS.map((link, i) => (
            <NavLink
              key={link}
              label={link}
              motionX={linkTransforms[i].x}
              motionOpacity={linkTransforms[i].opacity}
              onNavigate={LINK_ROUTES[link] ? () => navigateTo(LINK_ROUTES[link]!, link) : undefined}
            />
          ))}
        </div>


        {/* Mobile: MENU toggle */}
        <div className="md:hidden w-full flex justify-end">
          <button
            className="bg-transparent border-none cursor-pointer"
            onClick={() => setMenuOpen((o) => !o)}
            style={{ padding: 0 }}
          >
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)", fontFamily: "var(--font-display)", transition: "color 0.4s ease" }}
            >
              {menuOpen ? "Close" : "Menu"}
            </span>
          </button>
        </div>
      </motion.nav>

      {/* ── Desktop MENU button — fixed above overlay ───────────── */}
      <MenuButton
        motionOpacity={menuOpacity}
        motionY={menuY}
        active={isScrolled || menuOpen}
        isOpen={menuOpen}
        isDark={isDark}
        onClick={() => setMenuOpen((o) => !o)}
      />

      {/* ── Full-screen overlay ──────────────────────────────────── */}
      <motion.div
        className="fixed inset-0 z-60 flex flex-col justify-center px-6 md:px-16"
        style={{ background: "#ffffff", fontFamily: "var(--font-display)", pointerEvents: menuOpen ? "auto" : "none" }}
        initial={{ clipPath: "inset(0 0 100% 100%)" }}
        animate={{ clipPath: menuOpen ? "inset(0 0 0% 0%)" : "inset(0 0 100% 100%)" }}
        transition={{ duration: 0.65, ease: EXPO }}
        aria-hidden={!menuOpen}
      >
        {/* Mobile close button */}
        <button
          className="md:hidden absolute top-0 right-6 h-20 flex items-center bg-transparent border-none cursor-pointer"
          onClick={() => setMenuOpen(false)}
          style={{ padding: 0 }}
        >
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: "rgba(0,0,0,0.5)", fontFamily: "var(--font-display)" }}
          >
            Close
          </span>
        </button>

        <nav className="flex flex-col gap-4">
          {NAV_LINKS.map((link, i) => (
            <OverlayLink
              key={link}
              label={link}
              index={i}
              menuOpen={menuOpen}
              onClick={() => setMenuOpen(false)}
              onNavigate={LINK_ROUTES[link] ? () => navigateTo(LINK_ROUTES[link]!, link) : undefined}
            />
          ))}
        </nav>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.45, delay: menuOpen ? 0.45 : 0, ease: EXPO }}
          style={{ position: "absolute", bottom: "clamp(2rem,5vh,4rem)", left: "clamp(1.5rem,6vw,4rem)" }}
        >
          <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(0,0,0,0.3)", marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>
            Get in touch
          </p>
          <a
            href="mailto:hello@xadastudio.com"
            style={{ fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)", fontWeight: 500, letterSpacing: "0.04em", color: "rgba(0,0,0,0.6)", textDecoration: "none", fontFamily: "var(--font-display)", transition: "color 0.25s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0a0a")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,0,0,0.6)")}
          >
            hello@xadastudio.com
          </a>
        </motion.div>
      </motion.div>
    </>
  );
}
