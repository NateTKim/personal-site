"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { profile } from "@/content/profile";

export async function copyEmail(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(profile.email);
    return true;
  } catch {
    return false;
  }
}

export function CopyEmail() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const reset = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(reset.current), []);

  async function onClick() {
    const copied = await copyEmail();
    window.clearTimeout(reset.current);
    setState(copied ? "copied" : "failed");
    if (copied) reset.current = window.setTimeout(() => setState("idle"), 2000);
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className="js-only inline-flex h-11 items-center gap-2 rounded-(--control-radius) border border-frame-border bg-white/[0.035] px-5 text-[15px] font-medium text-foreground transition-colors duration-150 hover:bg-white/[0.07]"
      >
        {state === "copied" ? (
          <Check className="size-4" aria-hidden />
        ) : (
          <Copy className="size-4" aria-hidden />
        )}
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed · Try again" : "Copy email"}
      </button>
      <span role="status" className="sr-only">
        {state === "copied"
          ? "Email address copied"
          : state === "failed"
            ? "Couldn't copy. The address is " + profile.email
            : ""}
      </span>
    </>
  );
}
