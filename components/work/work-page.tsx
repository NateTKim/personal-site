import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Info } from "lucide-react";
import { profile } from "@/content/profile";
import { workOrder, type WorkMeta, type WorkSlug } from "@/content/work";
import { workPages } from "@/content/work-pages";
import { LabelSection } from "@/components/site/label-section";
import { Reveal } from "@/components/site/reveal";
import { SiteHeader } from "@/components/site/site-header";
import { WindowFrame } from "@/components/site/window-frame";
import { cn } from "@/lib/utils";
import { MetaSep } from "./work-card";

function entry(slug: WorkSlug) {
  const index = workOrder.findIndex((w) => w.slug === slug);
  return { index, meta: workOrder[index], page: workPages[slug] };
}

function fullTitle(meta: WorkMeta) {
  return meta.titleSuffix ? `${meta.title} ${meta.titleSuffix}` : meta.title;
}

/** <title>, description and Open Graph for one /work page. */
export function workMetadata(slug: WorkSlug): Metadata {
  const { meta, page } = entry(slug);
  const title = fullTitle(meta);
  const description = page.descriptionNote ? `${meta.summary} ${page.descriptionNote}` : meta.summary;
  return {
    title,
    description,
    openGraph: { title: `${title} · ${profile.name}`, description, type: "article" },
  };
}

const bodyText = "text-[17px] leading-relaxed text-muted-foreground";

/**
 * The template every /work page shares: a title with one italic-serif phrase
 * (a fact: the role, or the club), the meta line (role · location · dates, as
 * the master states them), the card's visual (passed in, at full width), four
 * short sections, and links to the previous and next work in card order.
 * Server-rendered and static: everything reads with JS off.
 */
export function WorkPage({ slug, visual }: { slug: WorkSlug; visual: React.ReactNode }) {
  const { index, meta, page } = entry(slug);
  const prev = workOrder[index - 1];
  const next = workOrder[index + 1];

  return (
    <>
      <SiteHeader active="work" />
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 px-(--frame-inset) pt-[calc(var(--header-h)+2.5rem)] pb-20 outline-none sm:pt-[calc(var(--header-h)+4.5rem)] sm:pb-28"
      >
        <article aria-labelledby="work-title" className="mx-auto w-full max-w-[80rem]">
          <header>
            <p className="label-text text-subtle-foreground">{page.section}</p>
            <h1
              id="work-title"
              className="mt-4 text-[clamp(2.25rem,1.2rem+3.6vw,4.5rem)] leading-[1.04] display-type text-balance text-foreground text-glow sm:mt-5"
            >
              {meta.title}{" "}
              {meta.titleSuffix && (
                <>
                  <span className="inline-block text-[0.42em] leading-tight tracking-[-0.01em] text-muted-foreground">
                    {meta.titleSuffix}
                  </span>{" "}
                </>
              )}
              {/* The italic phrase always starts its own line. */}
              <br />
              <span className="serif-italic">{page.italic}</span>
            </h1>
            <p className="mt-5 max-w-[48rem] text-[17px] leading-relaxed text-muted-foreground sm:mt-7 sm:text-lg">
              <span className="text-foreground">{page.meta.role}</span>
              <MetaSep />
              <span className="whitespace-nowrap">{page.meta.location}</span>
              <MetaSep />
              <span className="whitespace-nowrap">{page.meta.dates}</span>
            </p>
            {page.links && (
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {page.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center gap-1.5 rounded-(--control-radius) border border-frame-border bg-white/[0.035] px-4 text-sm text-foreground transition-colors duration-150 hover:bg-white/[0.07]"
                    >
                      {l.label}
                      <ArrowUpRight className="size-4 text-muted-foreground" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </header>

          <Reveal className="mt-10 sm:mt-14">{visual}</Reveal>

          <div className="mt-14 sm:mt-20">
            <LabelSection id="work-context" title="Context">
              {page.contextIsNotice ? (
                <p className="flex items-start gap-3 text-lg leading-relaxed text-foreground">
                  <Info className="mt-[0.3em] size-5 shrink-0 text-muted-foreground" aria-hidden />
                  {page.context.join(" ")}
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {page.context.map((p) => (
                    <p key={p} className={bodyText}>
                      {p}
                    </p>
                  ))}
                </div>
              )}
            </LabelSection>

            <LabelSection id="work-built" title="What I built">
              <ul className="flex flex-col gap-4">
                {page.built.map((b) => (
                  <li
                    key={b}
                    className={cn(
                      bodyText,
                      "relative pl-6 before:absolute before:top-[0.8em] before:left-0 before:h-px before:w-3 before:bg-subtle-foreground",
                    )}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </LabelSection>

            <LabelSection id="work-results" title="Results">
              {/* The figure column is as wide as the widest figure (a subgrid) from 640px;
                  below that each figure sits above its line. */}
              <ul className="flex flex-col sm:grid sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-8">
                {page.results.map((r) => (
                  <li
                    key={r.figure}
                    className="flex flex-col gap-2 border-t border-frame-divider py-5 first:border-t-0 first:pt-0 last:pb-0 sm:col-span-2 sm:grid sm:grid-cols-subgrid sm:items-baseline"
                  >
                    <span className="text-[2.5rem] leading-none display-type whitespace-nowrap text-data tabular-nums sm:text-5xl">
                      {r.figure}
                    </span>{" "}
                    <span className={bodyText}>{r.text}</span>
                  </li>
                ))}
              </ul>
            </LabelSection>

            <LabelSection id="work-stack" title={page.stackLabel}>
              <ul className="flex flex-wrap gap-2">
                {page.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-(--tag-radius) border border-frame-border bg-white/[0.02] px-3.5 py-1.5 text-[15px] leading-6 text-foreground"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </LabelSection>
          </div>

          <Pager prev={prev} next={next} />
        </article>
      </main>
    </>
  );
}

/** "All work", then the previous and next work in card order (none past either end). */
function Pager({ prev, next }: { prev?: WorkMeta; next?: WorkMeta }) {
  return (
    <Reveal
      as="nav"
      aria-label="More work"
      className="mt-6 border-t border-frame-divider pt-10 sm:mt-10 sm:pt-14"
    >
      <Link
        href="/#work"
        className="inline-flex h-10 items-center gap-2 rounded-(--control-radius) border border-frame-border bg-white/[0.035] px-4 text-sm text-foreground transition-colors duration-150 hover:bg-white/[0.07]"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All work
      </Link>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
        {prev && (
          <li>
            <PagerLink item={prev} direction="prev" />
          </li>
        )}
        {next && (
          <li className="sm:col-start-2">
            <PagerLink item={next} direction="next" />
          </li>
        )}
      </ul>
    </Reveal>
  );
}

function PagerLink({ item, direction }: { item: WorkMeta; direction: "prev" | "next" }) {
  const isNext = direction === "next";
  const Arrow = isNext ? ArrowRight : ArrowLeft;
  const arrowClass = cn(
    "size-3.5 transition-transform duration-200 motion-reduce:transition-none",
    isNext ? "group-hover:translate-x-0.5" : "group-hover:-translate-x-0.5",
  );
  return (
    <Link
      href={item.href}
      rel={direction}
      // The ring comes from the base :focus-visible rule (globals.css); only its offset changes.
      className="group block h-full rounded-(--frame-radius-sm) focus-visible:outline-offset-4"
    >
      <WindowFrame
        size="sm"
        className="h-full transition-[border-color] duration-200 group-hover:border-white/20 motion-reduce:transition-none"
        bodyClassName={cn("flex flex-col gap-2 p-4 sm:p-6", isNext && "sm:items-end sm:text-right")}
      >
        <span className="flex items-center gap-1.5 label-text text-subtle-foreground">
          {!isNext && <Arrow className={arrowClass} aria-hidden />}
          {isNext ? "Next" : "Previous"}
          {isNext && <Arrow className={arrowClass} aria-hidden />}
        </span>{" "}
        <span className="text-2xl leading-tight display-type text-foreground sm:text-3xl">
          {item.title}
          {item.titleSuffix && (
            <>
              {" "}
              <span className="inline-block text-base tracking-[-0.01em] text-muted-foreground sm:text-lg">
                {item.titleSuffix}
              </span>
            </>
          )}
        </span>{" "}
        <span className="text-sm text-muted-foreground">{item.role}</span>
      </WindowFrame>
    </Link>
  );
}
