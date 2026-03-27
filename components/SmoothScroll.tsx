"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    let scroll: import("locomotive-scroll").default | null = null;

    import("locomotive-scroll").then(({ default: LocomotiveScroll }) => {
      scroll = new LocomotiveScroll();
    });

    return () => {
      scroll?.destroy();
    };
  }, []);

  return null;
}
