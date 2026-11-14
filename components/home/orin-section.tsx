import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { OrinDemo } from "@/components/orin/orin-demo";
import { demoSamples } from "@/lib/orin/demo-data";
import { person } from "@/content/site";

export function OrinSection() {
  return (
    <section id="orin" aria-labelledby="orin-title" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-brand-700">Project · May 2026 – present</p>
          <h2
            id="orin-title"
            className="mt-2 font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl"
          >
            Orin explains SEC filings in plain English.
          </h2>
        </div>
        <div className="mt-8 sm:mt-10">
          <OrinDemo samples={demoSamples} />
        </div>
        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-5 text-center sm:mt-12">
          <p className="text-base leading-7 text-sand-700">
            Type a ticker and Orin reads the company&apos;s latest 10-Q or 10-K. Every figure comes from SEC
            EDGAR; the AI only writes prose around those figures, and anything a company didn&apos;t report
            shows as &ldquo;not reported.&rdquo; Business Health is a 1-10 score from six weighted signals,
            computed without an LLM. It explains filings and never gives buy or sell advice.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/orin"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-[15px] font-medium text-primary-foreground shadow-[0_6px_16px_-8px_var(--color-brand-600)] transition-colors hover:bg-brand-700"
            >
              Read the case study
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a
              href={person.orin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-[15px] font-medium transition-colors hover:bg-sand-100"
            >
              readorin.com
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
        </div>
      </div>
    </section>
  );
}
