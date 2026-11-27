"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { useMediaQuery, useShortcutLabel } from "@/lib/use-media-query";

// cmdk (and its dialog) only download the first time the menu opens.
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
        setOpen(!open);
      }
    }
    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          opener.current = triggerRef.current;
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
      {loaded && <CommandMenu open={open} onOpenChange={setOpen} opener={opener} />}
    </>
  );
}
