import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { WindowFrame } from "@/components/site/window-frame";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
      <SiteHeader active={null} />
      <main
        id="main"
        tabIndex={-1}
        className="flex flex-1 items-center px-(--frame-inset) pt-[calc(var(--header-h)+3rem)] pb-20 outline-none"
      >
        <WindowFrame title="404" className="mx-auto w-full max-w-xl" bodyClassName="p-6 sm:p-10">
          <p className="label-text text-subtle-foreground">Error 404</p>
          <h1 className="mt-3 text-4xl leading-[1.05] display-type text-foreground text-glow sm:text-5xl">
            This page <span className="serif-italic">doesn&rsquo;t exist.</span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            The link may be wrong, or the page may have moved.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex h-10 items-center gap-2 rounded-(--control-radius) border border-frame-border bg-white/[0.035] px-4 text-sm text-foreground transition-colors duration-150 hover:bg-white/[0.07]"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to the work
          </Link>
        </WindowFrame>
      </main>
    </>
  );
}
