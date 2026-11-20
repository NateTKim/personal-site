import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { WorkMeta } from "@/content/work";
import { Reveal } from "@/components/site/reveal";
import { Todo } from "@/components/site/todo";
import { WindowFrame } from "@/components/site/window-frame";

/**
 * Separator for "role · dates · summary": a dot for the eye, a comma for screen
 * readers. A no-break space keeps the dot on the line of the item before it.
 * Also used by the meta line on the /work pages.
 */
export function MetaSep() {
  return (
    <>
      <span className="sr-only">,</span>
      <span aria-hidden className="text-subtle-foreground">
        &nbsp;·
      </span>{" "}
    </>
  );
}

/**
 * A work card is a large window. The whole card is one link (the title's
 * link stretches over it), so it has a single accessible name: the title,
 * described by the role · dates · summary line. The visual sits below, in a
 * nested, smaller window passed as children. The window's title is the link's
 * path, like an address bar.
 */
export function WorkCard({ meta, children }: { meta: WorkMeta; children: React.ReactNode }) {
  const metaId = `${meta.slug}-meta`;
  return (
    <Reveal as="article" className="group relative">
      <WindowFrame
        title={meta.href.slice(1)}
        className="transition-[border-color] duration-200 group-hover:border-white/20 motion-reduce:transition-none"
      >
        <div className="p-5 sm:p-8 lg:p-10">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-[2rem] leading-[1.05] display-type text-foreground text-glow sm:text-5xl">
              <Link
                href={meta.href}
                aria-describedby={metaId}
                className="outline-none after:absolute after:inset-0 after:z-10 after:rounded-(--frame-radius) focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-(--ring)"
              >
                {meta.title}
                {meta.titleSuffix && (
                  <>
                    {" "}
                    {/* Moves to its own line as a unit when the line is full. */}
                    <span className="inline-block text-lg leading-tight tracking-[-0.01em] text-muted-foreground sm:text-2xl">
                      {meta.titleSuffix}
                    </span>
                  </>
                )}
              </Link>
            </h3>
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-(--control-radius) border border-frame-border text-muted-foreground transition-colors duration-200 group-hover:border-white/25 group-hover:text-foreground motion-reduce:transition-none sm:size-12"
            >
              <ArrowUpRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
            </span>
          </div>
          <p
            id={metaId}
            className="mt-3 max-w-[48rem] text-[15px] leading-relaxed text-muted-foreground sm:mt-4 sm:text-base sm:leading-relaxed"
          >
            <span className="text-foreground">{meta.role}</span>
            <MetaSep />
            <span className="whitespace-nowrap">{meta.dates}</span>
            {meta.todo && (
              <>
                {" "}
                <Todo>{meta.todo}</Todo>
              </>
            )}
            <MetaSep />
            {meta.summary}
          </p>
          <div className="mt-6 sm:mt-8">{children}</div>
        </div>
      </WindowFrame>
    </Reveal>
  );
}
