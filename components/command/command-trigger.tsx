"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { useMediaQuery, useShortcutLabel } from "@/lib/use-media-query";

// cmdk (and its dialog) download once the page is idle, or when the menu is first used.
const CommandMenu = dynamic(() => import("./command-menu").then((m) => m.CommandMenu), {
  ssr: false,
});

/** "Menu" on small screens (where it also holds LinkedIn, GitHub and Resume), ⌘K above. */
export function CommandTrigger() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const shortcut = useShortcutLabel();
  const desktop = useMediaQuery("(min-width: 48rem)", true);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  // What is typed between opening the menu and its search field taking focus (the menu's
  // code may still be downloading). null while nothing is being kept.
  const typed = useRef<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!e.repeat && e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setLoaded(true);
        if (!open) {
          const focused = document.activeElement;
          opener.current =
            focused instanceof HTMLElement && focused !== document.body ? focused : triggerRef.current;
        }
        typed.current = open ? null : "";
        setOpen(!open);
      }
    }
    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // While the menu is opening, characters and Backspace typed outside it are kept for the
  // search field instead of reaching the page. Every other key (Enter, Escape, arrows, Tab,
  // shortcuts) and IME composition pass through untouched.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (typed.current === null || e.isComposing) return;
      if (e.target instanceof Element && e.target.closest("[data-command-menu]")) return;
      if (e.key === "Backspace") typed.current = typed.current.slice(0, -1);
      else if (e.key.length === 1 && !e.metaKey && (!e.ctrlKey || e.getModifierState("AltGraph")))
        typed.current += e.key;
      else return;
      e.preventDefault();
      e.stopPropagation();
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  useEffect(() => {
    // Warm the menu's code once the page is idle, so the first Cmd+K opens
    // instantly and no keystrokes are lost while it downloads.
    const warm = () => setLoaded(true);
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(warm, { timeout: 4000 })
      : window.setTimeout(warm, 3000);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  /** Hands the search field what was typed since the menu opened: once, then null. */
  function takeTyped() {
    const keys = typed.current;
    typed.current = null;
    return keys;
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          opener.current = triggerRef.current;
          typed.current = "";
          setLoaded(true);
          setOpen(true);
        }}
        onPointerEnter={() => setLoaded(true)}
        onFocus={() => setLoaded(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Meta+K Control+K"
        aria-label={desktop ? `${shortcut} – Open menu` : `Open menu (${shortcut})`}
        className="js-only inline-flex h-8 items-center gap-1.5 rounded-(--control-radius) border border-frame-border bg-white/[0.035] px-2.5 text-[13px] text-muted-foreground transition-colors duration-150 hover:bg-white/[0.07] hover:text-foreground md:px-3"
      >
        <span className="md:hidden">Menu</span>
        <Search className="hidden size-3.5 md:block" aria-hidden />
        <kbd className="hidden label-text md:inline">{shortcut}</kbd>
      </button>
      {loaded && (
        <CommandMenu
          open={open}
          onOpenChange={(next) => {
            if (!next) typed.current = null;
            setOpen(next);
          }}
          opener={opener}
          takeTyped={takeTyped}
        />
      )}
    </>
  );
}
