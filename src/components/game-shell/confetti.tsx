"use client";

/**
 * Confete leve (CSS puro + cores da identidade).
 * Respeita prefers-reduced-motion e a preferência manual de movimento
 * reduzido: sem animação, o confete simplesmente não dispara.
 */

import { useMemo } from "react";
import { useA11y } from "@/components/a11y/a11y-provider";

const COLORS = ["var(--success)", "#a560e8", "var(--matematica)", "#ff9600", "#ffc800", "#ff4b4b"];

interface Piece {
  left: number;
  delay: number;
  duration: number;
  spin: number;
  color: string;
  size: number;
}

export function Confetti({ pieces = 90 }: { pieces?: number }) {
  const { reducedMotion } = useA11y();

  const items = useMemo<Piece[]>(() => {
    if (reducedMotion) return [];
    if (typeof window !== "undefined") {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (query.matches) return [];
    }
    return Array.from({ length: pieces }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 700,
      duration: 1900 + Math.random() * 1400,
      spin: 360 + Math.random() * 720,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 7 + Math.random() * 6,
    }));
  }, [pieces, reducedMotion]);

  if (items.length === 0) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {items.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            background: p.color,
            ["--dur" as string]: `${p.duration}ms`,
            ["--delay" as string]: `${p.delay}ms`,
            ["--spin" as string]: p.spin,
          }}
        />
      ))}
    </div>
  );
}
