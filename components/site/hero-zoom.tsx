"use client";

import { useRef } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "motion/react";

/**
 * Drives the hero zoom. It only writes one number, --p (0 → 1), on the sticky
 * stage as the page scrolls through the tall track; the geometry (clip-path
 * and translate) is computed in CSS from --p (globals.css, "Hero zoom").
 *
 * The CSS ignores --p unless html.motion-ok is set and reduced motion is off,
 * so with reduced motion this changes nothing and the frame stays static.
 * Scroll is never captured or altered: --p just follows the scroll position.
 */
export function HeroZoom({ labelledBy, children }: { labelledBy: string; children: React.ReactNode }) {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // 0 when the track's top meets the viewport's top, 1 when its bottom meets the
  // viewport's bottom: 0.75 of a screen of scrolling while the stage is stuck.
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // Full bleed at 80% of that (about 0.6 of a screen), then a short hold before
  // the section scrolls away.
  const progress = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  useMotionValueEvent(progress, "change", (p) => {
    stageRef.current?.style.setProperty("--p", p.toFixed(4));
  });

  return (
    <section ref={trackRef} aria-labelledby={labelledBy} className="hero-track">
      <div ref={stageRef} className="hero-stage">
        {children}
      </div>
    </section>
  );
}
