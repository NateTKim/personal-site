"use client";

import dynamic from "next/dynamic";
import { beforeAfter, stats } from "@/content/site";
import { LazyWhenVisible } from "@/components/lazy-when-visible";
import { StatCounter } from "./stat-counter";

const BeforeAfterChart = dynamic(() => import("./before-after-chart"), { ssr: false });

export function NumbersGrid() {
  return (
    <div className="flex flex-col gap-6">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <li
            key={s.label}
            data-reveal
            className="flex flex-col gap-3 rounded-2xl bg-card p-6 shadow-card ring-1 ring-sand-900/8"
          >
            <span className="font-display text-5xl font-medium tracking-tight text-foreground">
              <StatCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </span>
            <p className="text-sm leading-6 text-sand-700">{s.label}</p>
            <p className="mt-auto text-xs text-muted-foreground">Resume: {s.source}</p>
          </li>
        ))}
      </ul>

      <figure data-reveal className="rounded-2xl bg-card p-6 shadow-card ring-1 ring-sand-900/8 sm:p-8">
        <figcaption className="flex flex-col gap-1">
          <span className="text-lg font-semibold tracking-tight">Before and after: time per task</span>
          <span className="text-sm text-muted-foreground">
            Two internal tools I built. Hover a bar for the resume&apos;s exact wording.
          </span>
        </figcaption>
        <div className="mt-6 flex items-center gap-5 text-xs text-sand-700" aria-hidden>
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-sand-300" /> Before
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-brand-600" /> After
          </span>
        </div>
        <div className="mt-3">
          <LazyWhenVisible placeholderClassName="h-64 w-full rounded-xl bg-sand-100/60">
            <BeforeAfterChart />
          </LazyWhenVisible>
        </div>
        {/* The same data as text: works with JS off and for screen readers. */}
        <dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
          {beforeAfter.map((b) => (
            <div key={b.key} className="flex flex-col gap-1">
              <dt className="text-sm font-medium text-foreground">
                {b.task} <span className="font-normal text-muted-foreground">· {b.detail}</span>
              </dt>
              <dd className="text-sm text-sand-700 tabular-nums">
                {b.before.label} → <span className="font-semibold text-brand-700">{b.after.label}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          &ldquo;Under 15 seconds&rdquo; is drawn at 15 seconds, its upper bound. &ldquo;~5 minutes&rdquo; is
          drawn at 5.
        </p>
      </figure>
    </div>
  );
}
