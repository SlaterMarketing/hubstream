"use client";

import { useEffect, useState } from "react";

const BRAND_ORANGE_50 = "rgba(255, 114, 76, 0.5)";

export function EventScrollCircle() {
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = window.innerHeight;
      const progress = Math.min(scrollY / height, 1);
      // Ease out for smoother feel: starts small, expands to fill
      const eased = 1 - Math.pow(1 - progress, 1.5);
      const newScale = 0.5 + eased * 0.85; // 0.5 -> 1.35 (slightly over 1 to ensure full coverage)
      setScale(newScale);
    };

    handleScroll(); // Initial
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-150 ease-out"
      style={{
        width: "200vmax",
        height: "200vmax",
        marginLeft: "-100vmax",
        marginTop: "-100vmax",
        backgroundColor: BRAND_ORANGE_50,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
      aria-hidden
    />
  );
}
