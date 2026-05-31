"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  HERO_SLIDER_INTERVAL_MS,
  HERO_SLIDES,
  HERO_TITLE_CARD,
  type HeroSlide,
} from "@/components/home/hero-slider-data";

function renderHeadline(slide: HeroSlide) {
  const { headline, headlineHighlight } = slide;
  if (!headlineHighlight || !headline.includes(headlineHighlight)) {
    return headline;
  }

  const [before, after] = headline.split(headlineHighlight);
  return (
    <>
      {before}
      <span className="bg-gradient-to-r from-amber-200 via-accent to-amber-300 bg-clip-text text-transparent">
        {headlineHighlight}
      </span>
      {after}
    </>
  );
}

function SlideCta({ slide }: { slide: HeroSlide }) {
  const onClick = () => {
    trackEvent("hero_slider_cta_click", { slide_id: slide.id, cta_href: slide.ctaHref });
  };

  const base =
    slide.ctaVariant === "trial"
      ? "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-900/15 dark:bg-orange-600 dark:hover:bg-orange-500"
      : "bg-accent text-accent-dark hover:bg-accent-hover shadow-black/30";

  return (
    <Link
      href={slide.ctaHref}
      onClick={onClick}
      className={`rounded-xl px-8 py-4 text-center text-base font-bold transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${base}`}
    >
      {slide.ctaLabel}
    </Link>
  );
}

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const trackedRef = useRef<Set<string>>(new Set());

  const slide = HERO_SLIDES[activeIndex];

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(mediaQuery.matches);
    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const current = HERO_SLIDES[activeIndex];
    const key = `${current.id}-${activeIndex}`;
    if (trackedRef.current.has(key)) return;
    trackedRef.current.add(key);
    trackEvent("hero_slider_view", { slide_id: current.id, slide_index: activeIndex });
  }, [activeIndex]);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setInterval(() => goNext(), HERO_SLIDER_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, goNext]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/90">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" aria-hidden />
        {slide.eyebrow}
      </div>

      <div className="mb-6 rounded-2xl border border-white/20 bg-white/10 px-4 py-4 backdrop-blur-sm sm:px-5 sm:py-5">
        <h1 className="text-xl font-extrabold leading-snug tracking-tight text-white sm:text-2xl lg:text-[1.65rem] lg:leading-tight">
          {HERO_TITLE_CARD}
        </h1>
      </div>

      <div aria-live="polite" aria-atomic="true" className="relative min-h-[320px] sm:min-h-[300px]">
        <div key={slide.id} className="animate-fade-in">
          <h2 className="text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[2.35rem]">
            {renderHeadline(slide)}
          </h2>

          <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/85">{slide.subheadline}</p>

          <div className="mt-5 inline-flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-xl border border-orange-400/30 bg-orange-500/10 px-4 py-2.5">
            <span className="text-3xl font-extrabold tabular-nums text-orange-300 sm:text-4xl">₹49</span>
            <span className="text-sm font-medium text-white/80">{slide.priceDetail}</span>
          </div>

          <p className="mt-3 text-sm text-white/75">{slide.proofLine}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <SlideCta slide={slide} />
            <Link
              href={slide.secondaryHref}
              className="text-center text-sm font-semibold text-white/80 underline-offset-2 transition-colors hover:text-white hover:underline sm:text-left"
            >
              {slide.secondaryLabel} →
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>

        <div className="flex flex-1 items-center justify-center gap-2" role="tablist" aria-label="Hero slides">
          {HERO_SLIDES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Slide ${index + 1}: ${item.headline}`}
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                index === activeIndex ? "w-8 bg-accent" : "w-2.5 bg-white/35 hover:bg-white/55"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
        <Link href="/try" className="underline-offset-2 hover:underline">
          Try free preview (OTP, no card)
        </Link>
        <span className="hidden sm:inline" aria-hidden>
          ·
        </span>
        <Link href="/login" className="underline-offset-2 hover:underline">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
