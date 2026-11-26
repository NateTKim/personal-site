"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion/react";

/**
 * A number that counts up once, the first time it scrolls into view (250ms, under the
 * 300ms motion rule).
 *
 * Its text is always the final value, so the DOM, copied text, crawlers and screen readers
 * get it once and never see "0"; with JS off or reduced motion it is simply shown. While it
 * counts, data-count holds the number on screen: CSS turns the real text transparent and
 * draws data-count over it with empty alt text, which assistive tech skips ("Stat counter"
 * in globals.css).
 */
export function StatCounter({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    // The overlay needs alt text in `content` (to stay out of the accessibility tree).
    if (!CSS.supports("content", 'attr(data-count) / ""')) return;
    // Already on screen at load: leave the final value alone.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;

    const show = (n: number) => el.setAttribute("data-count", `${prefix}${n}${suffix}`);
    show(0);
    let controls: ReturnType<typeof animate> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        controls = animate(0, value, {
          duration: 0.25,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (v) => show(Math.round(v)),
          onComplete: () => el.removeAttribute("data-count"),
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      controls?.stop();
      el.removeAttribute("data-count");
    };
  }, [value, prefix, suffix]);

  // One text node, so the accessibility tree holds the value as one piece of text.
  return (
    <span ref={ref} className="stat-count tabular-nums">
      {`${prefix}${value}${suffix}`}
    </span>
  );
}
