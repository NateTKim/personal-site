import { Fragment } from "react";
import { stats } from "@/content/stats";
import { Todo } from "@/components/site/todo";
import { cn } from "@/lib/utils";
import { StatCounter } from "./stat-counter";

// Hairlines between cells: a 2×2 grid on small screens, one row of four from 1024px.
const cellBorders = ["", "border-l", "border-t lg:border-t-0 lg:border-l", "border-t border-l lg:border-t-0"];

/**
 * A thin strip of four figures under the hero. Each number counts up once when
 * it scrolls into view (StatCounter: the HTML always holds the final value, and
 * screen readers only get that). The label comes first in the DOM, so it is read
 * before its number; the number is drawn on top.
 */
export function StatsRow() {
  return (
    <section aria-labelledby="stats-title" className="px-(--frame-inset) pt-10 sm:pt-14">
      <h2 id="stats-title" className="sr-only">
        In numbers
      </h2>
      <dl className="mx-auto grid w-full max-w-[80rem] grid-cols-2 border-y border-frame-divider lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.key}
            className={cn(
              "flex flex-col-reverse justify-end gap-2.5 border-frame-divider px-3 py-5 sm:px-6 sm:py-6",
              cellBorders[i],
            )}
          >
            <dt className="text-[13px] leading-snug text-muted-foreground">
              {s.label}
              {s.note && <span className="mt-1 block text-subtle-foreground">{s.note}</span>}
              {s.todo && (
                <span className="mt-2 block">
                  <Todo>{s.todo}</Todo>
                </span>
              )}
            </dt>
            <dd className="text-[2rem] leading-none display-type whitespace-nowrap text-data tabular-nums sm:text-5xl">
              {s.parts.map((p, j) => (
                <Fragment key={j}>
                  {j > 0 && (
                    <span aria-hidden className="text-subtle-foreground">
                      {" · "}
                    </span>
                  )}
                  {j > 0 && <span className="sr-only"> and </span>}
                  <StatCounter value={p.value} prefix={p.prefix} suffix={p.suffix} />
                </Fragment>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
