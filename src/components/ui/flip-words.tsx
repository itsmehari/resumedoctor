"use client";

import { useState, useEffect, useCallback } from "react";

interface FlipWordsProps {
  words: string[];
  /** Duration each word stays (ms) */
  duration?: number;
  className?: string;
}

/**
 * Flips through a list of words with a vertical flip animation.
 */
export function FlipWords({ words, duration = 2500, className = "" }: FlipWordsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const rotate = useCallback(() => {
    if (words.length <= 1) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
      setIsFlipping(false);
    }, 400);
  }, [words.length]);

  useEffect(() => {
    if (words.length <= 1) return;
    const interval = setInterval(rotate, duration);
    return () => clearInterval(interval);
  }, [duration, rotate, words.length]);

  const word = words[currentIndex];

  return (
    <span
      className={`inline-block overflow-hidden align-bottom ${className}`}
      style={{ perspective: "200px", minWidth: "min-content" }}
      aria-live="polite"
    >
      <span
        className={`inline-block transition-none ${
          isFlipping ? "animate-flip-out" : "animate-flip-in"
        }`}
        style={{ transformOrigin: "bottom", backfaceVisibility: "hidden" }}
      >
        {word}
      </span>
    </span>
  );
}
