"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { person } from "@/content/site";

export async function copyEmail(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(person.email);
    return true;
  } catch {
    return false;
  }
}

export function CopyEmail() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function onClick() {
    setState((await copyEmail()) ? "copied" : "failed");
    window.setTimeout(() => setState("idle"), 2000);
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-[15px] font-medium text-foreground transition-colors hover:bg-sand-100"
      >
        {state === "copied" ? (
          <Check className="size-4 text-up" aria-hidden />
        ) : (
          <Copy className="size-4" aria-hidden />
        )}
        {state === "copied" ? "Copied" : "Copy email"}
      </button>
      <span role="status" className="sr-only">
        {state === "copied"
          ? "Email address copied"
          : state === "failed"
            ? "Couldn't copy. The address is " + person.email
            : ""}
      </span>
    </>
  );
}
