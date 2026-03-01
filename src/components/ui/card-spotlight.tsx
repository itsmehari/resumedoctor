"use client";

import { useRef, useState, type ReactNode } from "react";

interface CardSpotlightProps {
  children: ReactNode;
  className?: string;
}

/**
 * A card with a spotlight effect that follows the mouse, revealing a radial gradient.
 */
export function CardSpotlight({ children, className = "" }: CardSpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      {/* Spotlight gradient - follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(circle 280px at ${position.x}% ${position.y}%, rgba(13, 101, 217, 0.15) 0%, rgba(255, 185, 0, 0.08) 40%, transparent 70%)`,
        }}
      />
      {/* Subtle base gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(13, 101, 217, 0.06) 0%, transparent 60%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
