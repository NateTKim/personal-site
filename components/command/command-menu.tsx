"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Code2,
  Copy,
  FileText,
  Hash,
  Home,
  Mail,
  Sparkles,
} from "lucide-react";
import { person } from "@/content/site";
import { copyEmail } from "@/components/copy-email";

const SECTIONS = [
  { id: "orin", label: "Orin demo" },
  { id: "numbers", label: "Numbers" },
  { id: "experience", label: "Experience" },
  { id: "leadership", label: "Leadership" },
  { id: "writing", label: "Research and writing" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const itemClass =
  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground outline-none data-[selected=true]:bg-brand-50 data-[selected=true]:text-brand-800";

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

  function close() {
    onOpenChange(false);
  }

  function goToSection(id: string) {
    close();
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        history.replaceState(null, "", `#${id}`);
        // Move focus to the section for keyboard and screen reader users,
        // after the dialog has returned focus to its trigger.
        el.setAttribute("tabindex", "-1");
        window.setTimeout(() => el.focus({ preventScroll: true }), 60);
        return;
      }
    }
    router.push(`/#${id}`);
  }

  function navigate(href: string) {
    close();
    router.push(href);
  }

  function openUrl(url: string) {
    close();
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function onCopy() {
    const ok = await copyEmail();
    setStatus(ok ? "Email copied" : `Couldn't copy. It's ${person.email}`);
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
      label="Jump to a section or link"
      overlayClassName="fixed inset-0 z-50 bg-sand-950/20 backdrop-blur-[2px]"
      contentClassName="fixed top-[12vh] left-1/2 z-50 w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl bg-card shadow-card-lg ring-1 ring-sand-900/10"
    >
      <Command.Input
        placeholder="Jump to a section, open a link…"
        className="h-14 w-full border-b border-border bg-transparent px-5 text-base text-foreground outline-none placeholder:text-muted-foreground"
      />
      <Command.List className="max-h-[min(420px,60vh)] overflow-y-auto overscroll-contain p-2">
        <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
          Nothing matches that.
        </Command.Empty>

        <Command.Group
          heading="Sections"
          className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase"
        >
          {pathname !== "/" && (
            <Command.Item className={itemClass} onSelect={() => navigate("/")}>
              <Home className="size-4 text-sand-500" aria-hidden />
              Home
            </Command.Item>
          )}
          {SECTIONS.map((s) => (
            <Command.Item key={s.id} className={itemClass} onSelect={() => goToSection(s.id)}>
              <Hash className="size-4 text-sand-500" aria-hidden />
              {s.label}
            </Command.Item>
          ))}
          <Command.Item
            className={itemClass}
            keywords={["case study", "architecture"]}
            onSelect={() => navigate("/orin")}
          >
            <BookOpen className="size-4 text-sand-500" aria-hidden />
            Orin case study
          </Command.Item>
        </Command.Group>

        <Command.Group
          heading="Actions"
          className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase"
        >
          <Command.Item
            className={itemClass}
            keywords={["cv", "pdf"]}
            onSelect={() => openUrl(person.resume)}
          >
            <FileText className="size-4 text-sand-500" aria-hidden />
            Open resume (PDF)
          </Command.Item>
          <Command.Item className={itemClass} keywords={["mail", "contact"]} onSelect={onCopy}>
            <Copy className="size-4 text-sand-500" aria-hidden />
            Copy email address
          </Command.Item>
          <Command.Item
            className={itemClass}
            keywords={["mail", "contact"]}
            onSelect={() => {
              close();
              window.location.href = `mailto:${person.email}`;
            }}
          >
            <Mail className="size-4 text-sand-500" aria-hidden />
            Write an email
          </Command.Item>
        </Command.Group>

        <Command.Group
          heading="Links"
          className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase"
        >
          <Command.Item className={itemClass} onSelect={() => openUrl(person.orin)}>
            <Sparkles className="size-4 text-sand-500" aria-hidden />
            Open Orin (readorin.com)
            <ArrowUpRight className="ml-auto size-3.5 text-sand-400" aria-hidden />
          </Command.Item>
          <Command.Item className={itemClass} onSelect={() => openUrl(person.github)}>
            <Code2 className="size-4 text-sand-500" aria-hidden />
            GitHub
            <ArrowUpRight className="ml-auto size-3.5 text-sand-400" aria-hidden />
          </Command.Item>
          <Command.Item className={itemClass} onSelect={() => openUrl(person.linkedin)}>
            <Briefcase className="size-4 text-sand-500" aria-hidden />
            LinkedIn
            <ArrowUpRight className="ml-auto size-3.5 text-sand-400" aria-hidden />
          </Command.Item>
        </Command.Group>
      </Command.List>
      <div
        role="status"
        className="flex h-9 items-center justify-between border-t border-border px-4 text-xs text-muted-foreground"
      >
        <span>{status || "↑↓ to move · Enter to open · Esc to close"}</span>
      </div>
    </Command.Dialog>
  );
}
