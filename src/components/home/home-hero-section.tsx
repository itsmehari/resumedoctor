"use client";

import { useState } from "react";
import { HeroSlider } from "@/components/home/hero-slider";
import { HeroVisual } from "@/components/home/hero-visual";

/** Hero text slider + dual artwork (before/after + desk scene), synced by slide index. */
export function HomeHeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeVisual = activeIndex % 2;

  return (
    <>
      <div className="relative mx-auto mb-8 w-full max-w-[320px] sm:max-w-md lg:hidden">
        <HeroVisual activeVisual={activeVisual} compact />
      </div>

      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-14 lg:items-center">
        <HeroSlider activeIndex={activeIndex} onActiveIndexChange={setActiveIndex} />
        <div className="relative hidden lg:block min-h-[280px] sm:min-h-[320px]">
          <HeroVisual activeVisual={activeVisual} />
        </div>
      </div>
    </>
  );
}
