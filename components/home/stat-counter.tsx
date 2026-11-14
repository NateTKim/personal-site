"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion/react";

/**
 * A number that counts up once, the first time it scrolls into view.
 * The server HTML already holds the final value (readable with JS off), and
 * screen readers only ever get the final value. 300ms, per the motion rules.
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
    // Already on screen at load: leave the final value alone.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;

    el.textContent = `${prefix}0${suffix}`;
    let controls: ReturnType<typeof animate> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        controls = animate(0, value, {
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (v) => {
            el.textContent = `${prefix}${Math.round(v)}${suffix}`;
          },
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      controls?.stop();
      el.textContent = `${prefix}${value}${suffix}`;
    };
  }, [value, prefix, suffix]);

  return (
    <>
      <span ref={ref} aria-hidden className="tabular-nums">
        {prefix}
        {value}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {value}
        {suffix}
      </span>
    </>
  );
}
