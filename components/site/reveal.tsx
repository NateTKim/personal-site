"use client";

import { useEffect, useRef, useState } from "react";

type RevealState = "idle" | "hidden" | "in";

/**
 * A light scroll reveal: the element fades up once (260ms, opacity and 8px; CSS under
 * "Scroll reveals" in globals.css) the first time it scrolls into view.
 *
 * The state is React's own (data-reveal="idle" | "hidden" | "in"), so the server HTML
 * and the first client render always match. It starts "idle" (fully visible), so
 * nothing is hidden before JavaScript runs or with it off. The first observer callback
 * says where the element is: already on screen, it stays "idle" for good (no flash);
 * below the fold, it becomes "hidden" and turns "in" when it scrolls into view. With
 * reduced motion, or without IntersectionObserver, nothing happens at all.
 */
export function Reveal({
  as = "div",
  children,
  ...props
}: { as?: "div" | "section" | "article" | "nav" } & React.HTMLAttributes<HTMLElement>) {
  // Typed as a <div> so it fits every allowed tag's ref (each is an HTMLElement).
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let first = true;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (first) {
          first = false;
          // Judged against the whole viewport, so nothing on screen at mount is hidden.
          const r = entry.boundingClientRect;
          if (r.top < window.innerHeight && r.bottom > 0) {
            io.disconnect();
            return;
          }
          setState("hidden");
          return;
        }
        if (entry.isIntersecting) {
          setState("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag {...props} ref={ref} data-reveal={state}>
      {children}
    </Tag>
  );
}
