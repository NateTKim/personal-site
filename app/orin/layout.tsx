import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { person } from "@/content/site";

export default function CaseStudyLayout({ children }: LayoutProps<"/orin">) {
  return (
    <div className="relative isolate">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-brand-50/70 via-[oklch(0.97_0.02_30/50%)] to-transparent"
      />
      <article className="mx-auto w-full max-w-3xl px-4 pt-12 pb-24 sm:px-6 sm:pt-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-sand-700 underline-offset-4 hover:text-foreground hover:underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Home
        </Link>
        <div className="mt-8">{children}</div>
        <div className="mt-16 flex flex-wrap gap-3 border-t border-border pt-8">
          <a
            href={person.orin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-[15px] font-medium text-primary-foreground shadow-[0_6px_16px_-8px_var(--color-brand-600)] transition-colors hover:bg-brand-700"
          >
            Try Orin at readorin.com
            <ArrowUpRight className="size-4" aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a
            href={person.orinRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-[15px] font-medium transition-colors hover:bg-sand-100"
          >
            Source on GitHub
            <ArrowUpRight className="size-4" aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </article>
    </div>
  );
}
