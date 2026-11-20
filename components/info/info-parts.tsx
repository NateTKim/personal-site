import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Info } from "lucide-react";
import type { InfoEntry, InfoPhoto } from "@/content/info";
import { WindowFrame } from "@/components/site/window-frame";
import { MetaSep } from "@/components/work/work-card";
import { cn } from "@/lib/utils";

export const infoBody = "text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]";

/** The same dash marker as the /work pages' lists. */
export const dashItem =
  "relative pl-6 before:absolute before:top-[0.8em] before:left-0 before:h-px before:w-3 before:bg-subtle-foreground";

/**
 * Renders `text` with `children` (an icon) bound to its last word in a no-wrap span,
 * so the icon never wraps onto a line by itself. Breaks before the last word are unchanged.
 */
function KeepWithLastWord({ text, children }: { text: string; children: React.ReactNode }) {
  const i = text.lastIndexOf(" ") + 1;
  return (
    <>
      {text.slice(0, i)}
      <span className="whitespace-nowrap">
        {text.slice(i)}
        {children}
      </span>
    </>
  );
}

/**
 * An entry's heading block: the title (a link to its /work page when it has one),
 * the dates (right-aligned from 640px, last on small screens) and a meta line.
 */
export function EntryHeader({
  id,
  title,
  href,
  hrefHint,
  dates,
  children,
}: {
  id: string;
  title: string;
  href?: string;
  /** Named after the title for screen readers when the link's destination needs it. */
  hrefHint?: string;
  dates: string;
  /** The meta line under the title. */
  children: React.ReactNode;
}) {
  return (
    <header className="grid gap-x-6 gap-y-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline">
      <h3 id={id} className="text-lg leading-snug font-medium text-foreground sm:text-xl">
        {href ? (
          <Link
            href={href}
            className="group/entry rounded-sm underline decoration-current/25 underline-offset-[5px] transition-[text-decoration-color] duration-150 hover:decoration-current"
          >
            <KeepWithLastWord text={title}>
              {hrefHint && <span className="sr-only">: {hrefHint}</span>}
              <ArrowRight
                className="ml-1.5 inline-block size-4 align-[-0.1em] text-muted-foreground transition-transform duration-200 group-hover/entry:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden
              />
            </KeepWithLastWord>
          </Link>
        ) : (
          title
        )}
      </h3>
      <p className="text-[15px] leading-6 text-muted-foreground">{children}</p>
      <p className="text-[15px] leading-6 whitespace-nowrap text-muted-foreground tabular-nums sm:col-start-2 sm:row-start-1 sm:text-right">
        {dates}
      </p>
    </header>
  );
}

/** One role: heading block, the master's bullets, and an optional notice. */
export function EntryView({ entry }: { entry: InfoEntry }) {
  const titleId = `info-${entry.key}`;
  return (
    <article aria-labelledby={titleId} className="flex flex-col gap-4">
      <EntryHeader
        id={titleId}
        title={entry.org}
        href={entry.href}
        hrefHint={entry.hrefHint}
        dates={entry.dates}
      >
        <span className="text-foreground/90">{entry.role}</span>
        <MetaSep />
        {entry.locationHref ? (
          <a
            href={entry.locationHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm underline decoration-current/30 underline-offset-4 transition-colors duration-150 hover:text-foreground hover:decoration-current"
          >
            <KeepWithLastWord text={entry.location}>
              <ArrowUpRight className="ml-0.5 inline-block size-3.5 align-[-0.1em]" aria-hidden />
            </KeepWithLastWord>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          entry.location
        )}
      </EntryHeader>
      <ul className="flex flex-col gap-3">
        {entry.bullets.map((b) => (
          <li key={b.text} className={cn(infoBody, dashItem)}>
            {b.text}
            {b.note && <span className="text-subtle-foreground"> {b.note}</span>}
          </li>
        ))}
      </ul>
      {entry.notice && (
        <p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
          <Info className="mt-1 size-4 shrink-0" aria-hidden />
          {entry.notice}
        </p>
      )}
    </article>
  );
}

/** A list of entries with room between them. */
export function EntryList({ entries }: { entries: readonly InfoEntry[] }) {
  return (
    <div className="flex flex-col gap-10">
      {entries.map((e) => (
        <EntryView key={e.key} entry={e} />
      ))}
    </div>
  );
}

/**
 * Two small framed photos, offset like prints on a desk from 1024px. The slots are 3:4,
 * the photos' own shape, so nothing is cropped at any width; each photo's object-position
 * still keeps Nate in frame should a slot ever crop. Above the fold, so not lazy-loaded.
 */
export function PhotoSlots({ photos }: { photos: readonly InfoPhoto[] }) {
  return (
    <div className="grid max-w-md grid-cols-2 gap-3 sm:gap-4 lg:max-w-none">
      {photos.map((photo, i) => (
        <WindowFrame
          key={photo.key}
          size="sm"
          className={cn(i === 1 && "lg:translate-y-8")}
          bodyClassName="relative aspect-[3/4]"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            placeholder="blur"
            loading="eager"
            // A slot is half the row: the row is 28rem at most (12px gap below 640px,
            // 16px from there) and, from 1024px, the 21rem column beside the headline.
            sizes="(min-width: 1024px) 160px, (min-width: 480px) 218px, calc(50vw - 22px)"
            className="object-cover"
            style={{ objectPosition: photo.position }}
          />
        </WindowFrame>
      ))}
    </div>
  );
}
