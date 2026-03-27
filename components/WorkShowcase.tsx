"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

const PROJECTS = [
  { id: "01", name: "Chas Concrete",  type: "Business Website", src: "/ChatGPT Image Mar 27, 2026, 03_22_01 AM.png", href: "https://www.chasconcretesolutions.com", rotate: -2 },
  { id: "02", name: "Metarp",         type: "Business Website", src: "/preview3.png",                                href: "https://www.metarp.lt",                  rotate:  3 },
  { id: "03", name: "Xada Shop",      type: "Ecommerce Store",  src: "/preview4.png",                                href: "https://www.xada-shop.com",              rotate: -1 },
  { id: "04", name: "Prisiminkime",   type: "Custom Build",     src: "/ab.png",                                      href: "https://www.prisiminkime.lt",            rotate:  2 },
];

export default function WorkShowcase(): React.JSX.Element {
  const [active, setActive] = useState<number | null>(null);

  // Spring-based cursor following for the floating image
  const cursorX = useMotionValue(-400);
  const cursorY = useMotionValue(-400);
  const imgX = useSpring(cursorX, { stiffness: 140, damping: 22 });
  const imgY = useSpring(cursorY, { stiffness: 140, damping: 22 });

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    cursorX.set(e.clientX - 160);
    cursorY.set(e.clientY - 100);
  }, [cursorX, cursorY]);

  return (
    <section
      className="ws2-section"
      style={{ fontFamily: "var(--font-display)" }}
      onMouseMove={onMouseMove}
    >
      {/* ── Floating image that follows cursor ── */}
      {/* Outer layer: position only — springs stay alive, never remounts */}
      <motion.div className="ws2-float" style={{ x: imgX, y: imgY }}>
        {/* Inner layer: keyed by active so AnimatePresence fires on every switch */}
        <AnimatePresence mode="wait">
          {active !== null && (
            <motion.div
              key={active}
              style={{ rotate: PROJECTS[active].rotate }}
              initial={{ opacity: 0, scale: 0.88, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1,    filter: "blur(0px)"  }}
              exit={{    opacity: 0, scale: 1.05, filter: "blur(8px)"  }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="ws2-float__frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PROJECTS[active].src}
                  alt={PROJECTS[active].name}
                  className="ws2-float__img"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Header bar ── */}
      <motion.div
        className="ws2-header"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="ws2-header__label">Selected Work</span>
        <span className="ws2-header__num">03</span>
      </motion.div>

      {/* ── Project list ── */}
      <ul className="ws2-list">
        {PROJECTS.map((project, i) => (
          <motion.li
            key={project.id}
            className={`ws2-item${active === i ? " is-active" : ""}`}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ws2-item__link"
            >
              <span className="ws2-item__index">{project.id}</span>

              <div className="ws2-item__meta">
                <span className="ws2-item__name">{project.name}</span>
                <span className="ws2-item__type">{project.type}</span>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.src} alt={project.name} className="ws2-item__thumb" />

              <span className="ws2-item__arrow">→</span>
            </a>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
