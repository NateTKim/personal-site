"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  ArrowUpRight,
  AtSign,
  Briefcase,
  Code2,
  Copy,
  CornerDownRight,
  FileText,
  Home,
  Mail,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { profile } from "@/content/profile";
import { workOrder } from "@/content/work";
import { copyEmail } from "@/components/copy-email";
import { WindowDots } from "@/components/site/window-frame";
import { useMediaQuery } from "@/lib/use-media-query";

const itemClass =
  "flex min-h-10 cursor-pointer items-center gap-3 rounded-(--frame-radius-sm) px-3 text-sm text-muted-foreground outline-none data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-foreground";
const iconClass = "size-4 shrink-0 text-subtle-foreground";
const groupClass =
  "[&_[cmdk-group-heading]]:label-text [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-subtle-foreground";

const LINKS = [
  { href: profile.linkedin, label: "LinkedIn", icon: Briefcase },
  { href: profile.github, label: "GitHub", icon: Code2 },
  { href: profile.orin, label: "Orin (readorin.com)", icon: Sparkles },
];

export function CommandMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState("");
  // On touch screens, don't focus the search field on open: that would pop up the
  // keyboard over what is mostly a menu. Tapping the field still focuses it.
  const coarse = useMediaQuery("(pointer: coarse)", false);

  function close() {
    onOpenChange(false);
  }

  function navigate(href: string) {
    close();
    router.push(href);
  }

  /** Scrolls to a section on this page and moves focus there. */
  function scrollToSection(el: HTMLElement) {
    close();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    // Move focus there for keyboard and screen reader users, after the dialog
    // has returned focus to its trigger.
    el.setAttribute("tabindex", "-1");
    window.setTimeout(() => el.focus({ preventScroll: true }), 60);
  }

  /** "Work" on the home page scrolls to the work section; elsewhere it goes home. */
  function goToWork() {
    const el = pathname === "/" ? document.getElementById("work") : null;
    if (!el) return navigate("/");
    scrollToSection(el);
  }

  /** "Contact" scrolls to the footer's contact section, which every page has. */
  function goToContact() {
    const el = document.getElementById("contact");
    if (el) scrollToSection(el);
  }

  function openUrl(url: string) {
    close();
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function onCopy() {
    const ok = await copyEmail();
    setStatus(ok ? "Email copied" : `Couldn't copy. It's ${profile.email}`);
    window.setTimeout(
      () => {
        setStatus("");
        if (ok) close();
      },
      ok ? 700 : 2500,
    );
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Menu: go to a page, copy the email or open a link"
      overlayClassName="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]"
      contentClassName="fixed top-[10vh] left-1/2 z-50 w-[min(560px,calc(100%-2rem))] -translate-x-1/2 overflow-clip rounded-(--frame-radius) border border-frame-border bg-frame font-sans text-foreground shadow-[inset_0_1px_0_0_var(--frame-highlight),0_40px_100px_-30px_rgb(0_0_0/0.9)] outline-none"
    >
      <div className="relative flex h-9 items-center border-b border-frame-divider bg-frame-bar px-3.5">
        <WindowDots />
        <p className="pointer-events-none absolute inset-x-16 text-center label-text text-subtle-foreground">
          Menu
        </p>
      </div>
      <Command.Input
        tabIndex={coarse ? -1 : undefined}
        placeholder="Go to a page, copy the email…"
        className="h-12 w-full border-b border-frame-divider bg-transparent px-4 text-base text-foreground outline-none placeholder:text-subtle-foreground focus-visible:border-b-white/35 focus-visible:bg-white/[0.02] sm:text-[15px]"
      />
      <Command.List className="max-h-[min(420px,60vh)] overflow-y-auto overscroll-contain p-2">
        <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
          Nothing matches that.
        </Command.Empty>

        <Command.Group heading="Go to" className={groupClass}>
          <Command.Item className={itemClass} keywords={["home", "projects"]} onSelect={goToWork}>
            <Home className={iconClass} aria-hidden />
            Work
          </Command.Item>
          {workOrder.map((w) => (
            <Command.Item
              key={w.slug}
              className={itemClass}
              keywords={w.titleSuffix ? [w.role, w.titleSuffix] : [w.role]}
              onSelect={() => navigate(w.href)}
            >
              <CornerDownRight className={iconClass} aria-hidden />
              {w.title}
            </Command.Item>
          ))}
          <Command.Item
            className={itemClass}
            keywords={["about", "experience"]}
            onSelect={() => navigate("/info")}
          >
            <User className={iconClass} aria-hidden />
            Info
          </Command.Item>
          <Command.Item
            className={itemClass}
            keywords={["email", "reach", "linkedin", "github"]}
            onSelect={goToContact}
          >
            <AtSign className={iconClass} aria-hidden />
            Contact
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Actions" className={groupClass}>
          <Command.Item
            className={itemClass}
            keywords={["cv", "pdf"]}
            onSelect={() => openUrl(profile.resume)}
          >
            <FileText className={iconClass} aria-hidden />
            Open resume (PDF)
          </Command.Item>
          <Command.Item className={itemClass} keywords={["mail", "contact"]} onSelect={onCopy}>
            <Copy className={iconClass} aria-hidden />
            Copy email address
          </Command.Item>
          <Command.Item
            className={itemClass}
            keywords={["mail", "contact"]}
            onSelect={() => {
              close();
              window.location.href = `mailto:${profile.email}`;
            }}
          >
            <Mail className={iconClass} aria-hidden />
            Write an email
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Links" className={groupClass}>
          {LINKS.map((l) => (
            <Command.Item key={l.label} className={itemClass} onSelect={() => openUrl(l.href)}>
              <l.icon className={iconClass} aria-hidden />
              {l.label}
              <ArrowUpRight className="ml-auto size-3.5 text-subtle-foreground" aria-hidden />
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
      <div
        role="status"
        className="flex h-9 items-center justify-between border-t border-frame-divider px-4 text-xs text-subtle-foreground"
      >
        <span>
          {status || (coarse ? "Tap an item to open it" : "↑↓ to move · Enter to open · Esc to close")}
        </span>
      </div>
      {/* Last in the DOM so the search field gets focus first; drawn in the title bar. */}
      <button
        type="button"
        onClick={close}
        // Keep Enter on this button from reaching cmdk, which would open the selected item.
        onKeyDown={(e) => e.stopPropagation()}
        className="absolute top-1 right-1.5 grid size-7 place-items-center rounded-(--control-radius) text-subtle-foreground transition-colors duration-150 hover:bg-white/[0.07] hover:text-foreground"
      >
        <X className="size-4" aria-hidden />
        <span className="sr-only">Close menu</span>
      </button>
    </Command.Dialog>
  );
}
