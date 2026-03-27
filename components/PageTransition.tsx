"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";

const EXPO = [0.16, 1, 0.3, 1] as const;

interface TransitionCtx {
  navigateTo: (href: string, label?: string) => void;
}

const TransitionContext = createContext<TransitionCtx>({
  navigateTo: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router   = useRouter();
  const controls = useAnimation();
  const [label, setLabel] = useState("");
  const [labelVisible, setLabelVisible] = useState(false);
  const running = useRef(false);

  const navigateTo = useCallback(
    async (href: string, pageName = "") => {
      if (running.current) return;
      running.current = true;

      setLabel(pageName);
      setLabelVisible(false);

      // Slide curtain UP from below
      await controls.start({
        y: "0%",
        transition: { duration: 0.55, ease: EXPO },
      });

      // Flash the label
      setLabelVisible(true);
      await new Promise((r) => setTimeout(r, 160));

      // Navigate (page renders behind the curtain)
      router.push(href);
      await new Promise((r) => setTimeout(r, 200));

      // Continue sliding UP off the top
      await controls.start({
        y: "-100%",
        transition: { duration: 0.55, ease: EXPO },
      });

      // Reset below screen for next use
      controls.set({ y: "100%" });
      setLabelVisible(false);
      running.current = false;
    },
    [controls, router],
  );

  return (
    <TransitionContext.Provider value={{ navigateTo }}>
      {children}

      {/* ── Curtain ── */}
      <motion.div
        initial={{ y: "100%" }}
        animate={controls}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 300,
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          fontFamily: "var(--font-display)",
        }}
        aria-hidden
      >
        <motion.span
          animate={{ opacity: labelVisible ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            fontSize: "clamp(3rem, 10vw, 9rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.25)",
          }}
        >
          {label}
        </motion.span>
      </motion.div>
    </TransitionContext.Provider>
  );
}
