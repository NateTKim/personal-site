"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { useShortcutLabel } from "@/lib/use-media-query";

// cmdk (and its dialog) only download the first time the menu opens.
const CommandMenu = dynamic(() => import("./command-menu").then((m) => m.CommandMenu), {
  ssr: false,
});

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
        className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm text-sand-700 shadow-card transition-colors hover:bg-sand-100 hover:text-foreground"
      >
        <Search className="size-3.5" aria-hidden />
        <span className="sm:hidden">Menu</span>
        <span className="hidden sm:inline">Jump to</span>
        <kbd className="hidden rounded-md bg-sand-100 px-1.5 py-0.5 font-sans text-[11px] font-medium text-sand-700 ring-1 ring-sand-200 sm:inline">
          {shortcut}
        </kbd>
      </button>
      {loaded && <CommandMenu open={open} onOpenChange={setOpen} />}
    </>
  );
}
