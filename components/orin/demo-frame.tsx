"use client";

import { useRef, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { LazyMotion, domAnimation, m, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Browser-framed product screen that starts zoomed out and tilted, then
 * scales to full width and flattens over about one viewport of scroll
 * (Mercury-style). Scroll is never captured: the transform just follows the
 * page's own scroll position.
 *
 * - JS off / reduced motion: rendered flat and full size, always interactive.
 * - Before hydration: html.motion-ok (set by an inline script) gives the
 *   same starting pose in CSS, so there's no snap when Motion takes over.
 */
export function DemoFrame({ url, children }: { url: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // Server/hydration render assumes reduced motion (flat frame); the CSS
  // pose from html.motion-ok covers the gap until the client value lands.
  const motionOk = !useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const wide = useMediaQuery("(min-width: 768px)", true);
  const [nearEnd, setNearEnd] = useState(false);

  // 0 when the frame's top is 90% down the viewport, 1 when it reaches the top.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.05"] });
  const scale = useTransform(scrollYProgress, [0, 1], wide ? [0.7, 1] : [0.88, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], wide ? [16, 0] : [8, 0]);
  useMotionValueEvent(scrollYProgress, "change", (v) => setNearEnd(v > 0.88));

  // Clicks only land once the frame has (nearly) flattened.
  const interactive = !motionOk || nearEnd;

  return (
    <div ref={ref} className="[perspective:1600px]">
      <LazyMotion features={domAnimation} strict>
        <m.div
          className={cn(
            "demo-frame origin-top overflow-hidden rounded-2xl bg-background shadow-card-lg ring-1 ring-sand-900/10 sm:rounded-3xl",
            !interactive && "pointer-events-none",
          )}
          style={motionOk ? { scale, rotateX } : undefined}
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-3 border-b border-border bg-sand-100/80 px-3 py-2.5 sm:px-4">
            <div className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-sand-300 sm:size-3" />
              <span className="size-2.5 rounded-full bg-sand-300 sm:size-3" />
              <span className="size-2.5 rounded-full bg-sand-300 sm:size-3" />
            </div>
            <div className="mx-auto flex h-7 max-w-md min-w-0 flex-1 items-center justify-center truncate rounded-lg bg-card px-3 text-xs text-sand-600 ring-1 ring-sand-900/8">
              <span className="truncate" aria-label={`Address: ${url}`}>
                {url}
              </span>
            </div>
            <div className="w-[42px] sm:w-[48px]" aria-hidden />
          </div>
          {children}
        </m.div>
      </LazyMotion>
    </div>
  );
}
