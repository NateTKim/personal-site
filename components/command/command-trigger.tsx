"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { useShortcutLabel } from "@/lib/use-media-query";

// cmdk (and its dialog) only download the first time the menu opens.
const CommandMenu = dynamic(() => import("./command-menu").then((m) => m.CommandMenu), {
  ssr: false,
});

/** "Menu" on small screens (where it also holds LinkedIn, GitHub and Resume), ⌘K above. */
export function CommandTrigger() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const shortcut = useShortcutLabel();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setLoaded(true);
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);

    // Warm the menu's code once the page is idle, so the first Cmd+K opens
    // instantly and no keystrokes are lost while it downloads.
    const warm = () => setLoaded(true);
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(warm, { timeout: 4000 })
      : window.setTimeout(warm, 3000);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        onPointerEnter={() => setLoaded(true)}
        onFocus={() => setLoaded(true)}
        aria-haspopup="dialog"
        aria-keyshortcuts="Meta+K Control+K"
        // One name on every screen size; it contains both visible labels ("Menu", the shortcut).
        aria-label={`Open menu (${shortcut})`}
        className="js-only inline-flex h-8 items-center gap-1.5 rounded-(--control-radius) border border-frame-border bg-white/[0.035] px-2.5 text-[13px] text-muted-foreground transition-colors duration-150 hover:bg-white/[0.07] hover:text-foreground md:px-3"
      >
        <span className="md:hidden">Menu</span>
        <Search className="hidden size-3.5 md:block" aria-hidden />
        <kbd className="hidden label-text md:inline">{shortcut}</kbd>
      </button>
      {loaded && <CommandMenu open={open} onOpenChange={setOpen} />}
    </>
  );
}
